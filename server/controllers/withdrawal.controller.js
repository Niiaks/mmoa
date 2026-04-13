import axios from "axios";
import Campaign from "../models/campaign.js";
import User from "../models/user.js";
import { normalizePhone } from "../helpers/phoneNormalizer.js";
import { detectNetwork } from "../helpers/detectNetwork.js";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../config/env.js";
import Withdrawal from "../models/withdrawals.js";
import { toLocale } from "../helpers/toLocale.js";

const paystackUrl = "https://api.paystack.co";

export const withdrawMoney = async (req, res) => {
  let organizerReference;

  try {
    const campaignId = req.params.id;
    const organizerId = req.user.id;

    let { momoNumber } = req.body;
    if (!momoNumber) {
      return res.status(400).json({
        success: false,
        message: "momo number not provided",
      });
    }

    momoNumber = normalizePhone(momoNumber);

    const campaign = await Campaign.findOne({
      _id: campaignId,
      organizer: organizerId,
    });

    if (!campaign) {
      return res.status(400).json({
        success: false,
        message: "campaign not found or does not belong to you",
      });
    }
    if (campaign.withdrawn) {
      return res.status(400).json({
        success: false,
        message: "already withdrawn from this campaign",
      });
    }
    if (campaign.totalRaised <= 0) {
      return res.status(400).json({
        success: false,
        message: "insufficient funds to withdraw",
      });
    }

    const organizer = await User.findById(organizerId);
    if (!organizer) {
      return res.status(400).json({
        success: false,
        message: "unauthorized access",
      });
    }

    const platformFee = campaign.totalRaised * 0.025;
    const amountSent = campaign.totalRaised - platformFee;

    const code = detectNetwork(momoNumber);
    if (!code) {
      return res.status(400).json({
        success: false,
        message: "invalid number",
      });
    }

    const { data: receiver } = await axios.post(
      `${paystackUrl}/transferrecipient`,
      {
        type: "mobile_money",
        name: organizer.name,
        account_number: toLocale(momoNumber),
        bank_code: code,
        currency: "GHS",
        description: "organizer withdrawal account",
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    organizerReference = uuidv4();
    const platformReference = uuidv4();

    const newWithdrawal = new Withdrawal({
      campaign: campaignId,
      organizer: organizerId,
      totalRaised: campaign.totalRaised,
      fee: platformFee,
      amountSent,
      paystackTransferReference: organizerReference,
      status: "pending",
    });

    await newWithdrawal.save();

    // transfer to organizer
    const { data: organizerTransfer } = await axios.post(
      `${paystackUrl}/transfer`,
      {
        source: "balance",
        amount: amountSent * 100,
        recipient: receiver.data.recipient_code,
        reference: organizerReference,
        currency: "GHS",
        reason: "settlement of organizer campaign",
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    await Withdrawal.findByIdAndUpdate(newWithdrawal._id, {
      transferCode: organizerTransfer.data.transfer_code,
    });

    // transfer to platform account
    await axios.post(
      `${paystackUrl}/transfer`,
      {
        source: "balance",
        amount: platformFee * 100,
        recipient: ENV.recipientCode,
        reference: platformReference,
        currency: "GHS",
        reason: "settlement of platform fees",
      },
      {
        headers: {
          Authorization: `Bearer ${ENV.paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      },
    );

    return res.status(200).json({
      success: true,
      message: "money withdrawal initiated. You'll soon receive your payment",
      amountSent,
      fee: platformFee,
    });
  } catch (error) {
    console.log("withdrawal error", error.response?.data);
    if (organizerReference) {
      await Withdrawal.findOneAndUpdate(
        { paystackTransferReference: organizerReference },
        { status: "failed" },
      );
    }
    return res.status(500).json({
      success: false,
      message: "oops something broke",
    });
  }
};
