import axios from "axios";
import Campaign from "../models/campaign.js";
import User from "../models/user.js";
import { normalizePhone } from "../helpers/phoneNormalizer.js";
import { detectNetwork } from "../helpers/detectNetwork.js";
import { toLocale } from "../helpers/toLocale.js";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../config/env.js";
import Withdrawal from "../models/withdrawals.js";

const PAYSTACK_URL = "https://api.paystack.co";

const paystackHeaders = {
  Authorization: `Bearer ${ENV.paystackSecretKey}`,
  "Content-Type": "application/json",
};

/**
 * Fee schedule — centralized so a single edit keeps everything consistent.
 * Update these if Paystack or business rules change.
 */
const FEES = {
  platformFeeRate: 0.025, // 2.5 % of available balance
  paystackMoMoFee: 1.0, // GHS 1 flat per successful MoMo transfer
  minNetAmount: 10, // GHS — Paystack rejects transfers below this
  maxNetAmount: 50_000, // GHS — Paystack hard cap
};

/**
 * Rounds a GHS amount to 2 decimal places using banker-safe integer arithmetic,
 * avoiding the classic 12.005 → 12.00 float trap.
 */
const ghsRound = (amount) => Math.round(amount * 100) / 100;

export const withdrawMoney = async (req, res) => {
  // Track the saved withdrawal record so we can mark it failed on any error.
  let withdrawalDoc = null;

  try {
    const campaignId = req.params.id;
    const organizerId = req.user.id;

    const rawMomo = req.body.momoNumber;
    if (!rawMomo) {
      return res.status(400).json({
        success: false,
        message: "Mobile money number is required",
      });
    }

    const normalizedMomo = normalizePhone(rawMomo);
    if (!normalizedMomo) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid mobile money number — please provide a valid Ghanaian number (e.g. 024 123 4567)",
      });
    }

    const networkCode = detectNetwork(normalizedMomo);
    if (!networkCode) {
      return res.status(400).json({
        success: false,
        message:
          "Unsupported mobile network. Please use MTN, Vodafone/Telecel, or AirtelTigo",
      });
    }

    const localMomo = toLocale(normalizedMomo);

    const campaign = await Campaign.findOne({
      _id: campaignId,
      organizer: organizerId,
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found or does not belong to you",
      });
    }

    // Sum only *successful* withdrawals so failed/pending ones don't reduce
    // the balance. Using an aggregation pipeline keeps this one round-trip.
    const [totalWithdrawnResult] = await Withdrawal.aggregate([
      { $match: { campaign: campaign._id, status: "successful" } },
      { $group: { _id: null, total: { $sum: "$amountSent" } } },
    ]);

    const alreadyWithdrawn = totalWithdrawnResult?.total ?? 0;
    const availableBalance = ghsRound(campaign.totalRaised - alreadyWithdrawn);

    // Reject if there is already a pending withdrawal for this campaign.
    // This prevents a double-spend race where two concurrent requests both
    // read the same availableBalance before either has been saved.
    const pendingExists = await Withdrawal.exists({
      campaign: campaign._id,
      status: "pending",
    });

    if (pendingExists) {
      return res.status(409).json({
        success: false,
        message:
          "A withdrawal is already in progress for this campaign. Please wait for it to complete before initiating another.",
      });
    }

    const platformFee = ghsRound(availableBalance * FEES.platformFeeRate);
    const paystackMoMoFee = FEES.paystackMoMoFee;
    const amountSent = ghsRound(
      availableBalance - platformFee - paystackMoMoFee,
    );

    if (amountSent < FEES.minNetAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance after fees — minimum net payout is GHS ${FEES.minNetAmount}`,
      });
    }

    if (amountSent > FEES.maxNetAmount) {
      return res.status(400).json({
        success: false,
        message: `Withdrawal amount exceeds the maximum single transfer limit of GHS ${FEES.maxNetAmount.toLocaleString()}`,
      });
    }

    const organizer = await User.findById(organizerId);
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: "Organizer account not found",
      });
    }

    const { data: recipientResponse } = await axios.post(
      `${PAYSTACK_URL}/transferrecipient`,
      {
        type: "mobile_money",
        name: organizer.name || "Campaign Organizer",
        account_number: localMomo,
        bank_code: networkCode,
        currency: "GHS",
      },
      {
        headers: paystackHeaders,
      },
    );

    const recipientCode = recipientResponse.data.recipient_code;

    const reference = uuidv4();

    withdrawalDoc = await Withdrawal.create({
      campaign: campaignId,
      organizer: organizerId,
      momoNumber: localMomo,
      totalRaised: campaign.totalRaised,
      availableBalance,
      platformFee,
      paystackMoMoFee,
      amountSent,
      paystackTransferReference: reference,
      status: "pending",
    });

    const { data: transferResponse } = await axios.post(
      `${PAYSTACK_URL}/transfer`,
      {
        source: "balance",
        amount: Math.round(amountSent * 100), // pesewas
        recipient: recipientCode,
        reference,
        currency: "GHS",
        reason: `Campaign payout — ${campaign.title || campaignId}`,
      },
      {
        headers: paystackHeaders,
      },
    );

    // Persist the Paystack transfer code (TRF_xxx) for reconciliation.
    await Withdrawal.findByIdAndUpdate(withdrawalDoc._id, {
      transferCode: transferResponse.data.transfer_code,
    });

    // This is fire-and-forget relative to the organizer's payout — a failure
    // here is logged and recorded on the withdrawal document for manual
    // reconciliation, but does NOT roll back or affect the organizer's transfer.
    // user should not be affected by this
    initiatePlatformFeeTransfer({
      withdrawalId: withdrawalDoc._id,
      platformFee,
      campaignId,
    });

    return res.status(200).json({
      success: true,
      message:
        "Withdrawal initiated. You will receive your payment on your mobile money within a few minutes.",
      breakdown: {
        availableBalance: availableBalance.toFixed(2),
        platformFee: platformFee.toFixed(2),
        paystackMoMoFee: paystackMoMoFee.toFixed(2),
        totalFees: (platformFee + paystackMoMoFee).toFixed(2),
        amountYouWillReceive: amountSent.toFixed(2),
      },
    });
  } catch (error) {
    console.error("Withdrawal error:", error.response?.data ?? error.message);

    // Mark the withdrawal failed if it was already saved.
    if (withdrawalDoc?._id) {
      await Withdrawal.findByIdAndUpdate(withdrawalDoc._id, {
        status: "failed",
        failureReason:
          error.response?.data?.message ?? error.message ?? "Unknown error",
      }).catch((updateErr) =>
        console.error(
          "Failed to mark withdrawal as failed:",
          updateErr.message,
        ),
      );
    }

    const clientMessage =
      error.response?.data?.message ??
      "Something went wrong processing your withdrawal. Please try again.";

    return res.status(500).json({
      success: false,
      message: clientMessage,
    });
  }
};

/**
 * Fires a Paystack transfer for the platform's fee cut and records it on the
 * withdrawal document. Errors are caught and logged — this must never throw
 * since it runs after the organizer's transfer has already been initiated.
 */
async function initiatePlatformFeeTransfer({
  withdrawalId,
  platformFee,
  campaignId,
}) {
  const platformRecipientCode = ENV.recipientCode;

  if (!platformRecipientCode) {
    console.warn(
      "Platform fee transfer skipped: ENV.paystackPlatformRecipientCode is not set.",
    );
    return;
  }

  if (platformFee <= 0) {
    console.warn(
      `Platform fee transfer skipped: fee is ${platformFee} for campaign ${campaignId}`,
    );
    return;
  }

  const platformFeeReference = uuidv4();

  // Record the reference immediately so the webhook can match the transfer
  // even if the axios call succeeds but the process crashes before we save
  // the transfer code.
  await Withdrawal.findByIdAndUpdate(withdrawalId, {
    platformFeeTransferReference: platformFeeReference,
    platformFeeStatus: "pending",
  });

  try {
    const { data: feeTransferResponse } = await axios.post(
      `${PAYSTACK_URL}/transfer`,
      {
        source: "balance",
        amount: Math.round(platformFee * 100), // pesewas
        recipient: platformRecipientCode,
        reference: platformFeeReference,
        currency: "GHS",
        reason: `Platform fee — campaign ${campaignId}`,
      },
      { headers: paystackHeaders },
    );

    await Withdrawal.findByIdAndUpdate(withdrawalId, {
      platformFeeTransferCode: feeTransferResponse.data.transfer_code,
    });

    console.log(
      `Platform fee transfer initiated for campaign ${campaignId}: GHS ${platformFee} — ref ${platformFeeReference}`,
    );
  } catch (error) {
    const reason =
      error.response?.data?.message ?? error.message ?? "Unknown error";

    console.error(
      `Platform fee transfer failed for campaign ${campaignId}: ${reason}`,
    );

    await Withdrawal.findByIdAndUpdate(withdrawalId, {
      platformFeeStatus: "failed",
    }).catch((updateErr) =>
      console.error(
        "Failed to update platformFeeStatus to failed:",
        updateErr.message,
      ),
    );
  }
}
