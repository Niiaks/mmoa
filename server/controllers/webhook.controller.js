import crypto from "crypto";
import { ENV } from "../config/env.js";
import Contribution from "../models/contribution.js";
import Campaign from "../models/campaign.js";
import Withdrawal from "../models/withdrawals.js";

export const webhookController = async (req, res) => {
  const signature = req.headers["x-paystack-signature"];
  if (!signature) {
    console.warn("Webhook received without X-Paystack-Signature header");
    // Return 400 so Paystack retries with the correct signature.
    return res.status(400).send("Missing signature");
  }

  const hash = crypto
    .createHmac("sha512", ENV.paystackSecretKey)
    .update(req.body)
    .digest("hex");

  if (hash !== signature) {
    console.warn("Webhook rejected: signature mismatch — possible tampering");
    return res.status(400).send("Invalid signature");
  }

  let event;
  try {
    event = JSON.parse(req.body.toString());
  } catch {
    console.error("Webhook rejected: body is not valid JSON");
    return res.status(400).send("Invalid JSON");
  }

  const { event: eventType, data } = event;
  const reference = data?.reference ?? "N/A";

  console.log(`Paystack webhook received: ${eventType} — ref: ${reference}`);

  try {
    switch (eventType) {
      case "charge.success":
        await handleChargeSuccess(data);
        break;

      case "transfer.success": {
        const handledAsOrganizer = await handleTransferSuccess(data);
        if (!handledAsOrganizer) {
          await handlePlatformFeeTransferSuccess(data);
        }
        break;
      }

      case "transfer.failed": {
        const handledAsOrganizer = await handleTransferFailed(data);
        if (!handledAsOrganizer) {
          await handlePlatformFeeTransferFailed(data);
        }
        break;
      }

      case "transfer.reversed": {
        const handledAsOrganizer = await handleTransferReversed(data);
        if (!handledAsOrganizer) {
          await handlePlatformFeeTransferReversed(data);
        }
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }
  } catch (error) {
    console.error(
      `Error processing webhook ${eventType} (ref: ${reference}):`,
      error.message,
    );
    // Return 500 so Paystack retries the event.
    return res.status(500).send("Processing error");
  }

  // Acknowledge only after successful processing.
  return res.status(200).send();
};

async function handleChargeSuccess(data) {
  const { reference, metadata } = data;

  const contribution = await Contribution.findOne({
    paystackReference: reference,
  });

  if (!contribution) {
    console.log(`charge.success: no contribution found for ref ${reference}`);
    return;
  }

  if (contribution.status === "successful") {
    console.log(
      `charge.success: contribution ${reference} already successful — skipping`,
    );
    return;
  }

  if (!contribution.amount || contribution.amount <= 0) {
    console.error(
      `charge.success: contribution ${reference} has invalid amount ${contribution.amount}`,
    );
    return;
  }

  contribution.status = "successful";
  await contribution.save();

  const campaignId = metadata?.campaign_id;
  if (campaignId) {
    await Campaign.findByIdAndUpdate(campaignId, {
      $inc: { totalRaised: contribution.amount },
    });
    console.log(
      `charge.success: campaign ${campaignId} totalRaised +${contribution.amount}`,
    );
  } else {
    console.warn(
      `charge.success: ref ${reference} has no campaign_id in metadata`,
    );
  }
}

async function handleTransferSuccess(data) {
  const { reference, transfer_code } = data;

  const withdrawal = await Withdrawal.findOne({
    paystackTransferReference: reference,
  });

  if (!withdrawal) {
    // Not an organizer transfer — caller will try the platform fee path.
    return false;
  }

  if (withdrawal.status === "successful") {
    console.log(
      `transfer.success: withdrawal ${reference} already successful — skipping`,
    );
    return true;
  }

  await Withdrawal.findByIdAndUpdate(withdrawal._id, {
    status: "successful",
    transferCode: transfer_code,
    completedAt: new Date(),
  });

  console.log(
    `transfer.success: organizer withdrawal ${reference} marked successful`,
  );
  return true;
}

async function handleTransferFailed(data) {
  const { reference, reason } = data;

  const withdrawal = await Withdrawal.findOne({
    paystackTransferReference: reference,
  });

  if (!withdrawal) {
    console.log(
      `transfer.failed: no organizer withdrawal found for ref ${reference}`,
    );
    return false;
  }

  if (withdrawal.status === "failed") {
    console.log(
      `transfer.failed: withdrawal ${reference} already failed — skipping`,
    );
    return true;
  }

  await Withdrawal.findByIdAndUpdate(withdrawal._id, {
    status: "failed",
    failureReason: reason ?? "Unknown failure",
  });

  console.log(
    `transfer.failed: organizer withdrawal ${reference} marked failed. Reason: ${reason ?? "N/A"}`,
  );
  return true;
}

async function handleTransferReversed(data) {
  const { reference, reason } = data;

  const withdrawal = await Withdrawal.findOne({
    paystackTransferReference: reference,
  });

  if (!withdrawal) {
    console.log(
      `transfer.reversed: no organizer withdrawal found for ref ${reference}`,
    );
    return false;
  }

  if (withdrawal.status === "reversed") {
    console.log(
      `transfer.reversed: withdrawal ${reference} already reversed — skipping`,
    );
    return true;
  }

  await Withdrawal.findByIdAndUpdate(withdrawal._id, {
    status: "reversed",
    failureReason: reason ?? "Transfer reversed by Paystack",
  });

  console.log(
    `transfer.reversed: organizer withdrawal ${reference} marked reversed. Reason: ${reason ?? "N/A"}`,
  );
  return true;
}

async function handlePlatformFeeTransferSuccess(data) {
  const { reference, transfer_code } = data;

  const withdrawal = await Withdrawal.findOne({
    platformFeeTransferReference: reference,
  });

  if (!withdrawal) {
    console.log(
      `transfer.success: no platform fee withdrawal found for ref ${reference}`,
    );
    return;
  }

  if (withdrawal.platformFeeStatus === "successful") {
    console.log(
      `transfer.success: platform fee ${reference} already successful — skipping`,
    );
    return;
  }

  await Withdrawal.findByIdAndUpdate(withdrawal._id, {
    platformFeeStatus: "successful",
    platformFeeTransferCode: transfer_code,
  });

  console.log(`transfer.success: platform fee ${reference} marked successful`);
}

async function handlePlatformFeeTransferFailed(data) {
  const { reference, reason } = data;

  const withdrawal = await Withdrawal.findOne({
    platformFeeTransferReference: reference,
  });

  if (!withdrawal) {
    console.log(
      `transfer.failed: no platform fee withdrawal found for ref ${reference}`,
    );
    return;
  }

  if (withdrawal.platformFeeStatus === "failed") {
    console.log(
      `transfer.failed: platform fee ${reference} already failed — skipping`,
    );
    return;
  }

  await Withdrawal.findByIdAndUpdate(withdrawal._id, {
    platformFeeStatus: "failed",
  });

  console.log(
    `transfer.failed: platform fee ${reference} marked failed. Reason: ${reason ?? "N/A"}`,
  );
}

async function handlePlatformFeeTransferReversed(data) {
  const { reference, reason } = data;

  const withdrawal = await Withdrawal.findOne({
    platformFeeTransferReference: reference,
  });

  if (!withdrawal) {
    console.log(
      `transfer.reversed: no platform fee withdrawal found for ref ${reference}`,
    );
    return;
  }

  if (withdrawal.platformFeeStatus === "reversed") {
    console.log(
      `transfer.reversed: platform fee ${reference} already reversed — skipping`,
    );
    return;
  }

  await Withdrawal.findByIdAndUpdate(withdrawal._id, {
    platformFeeStatus: "reversed",
  });

  console.log(
    `transfer.reversed: platform fee ${reference} marked reversed. Reason: ${reason ?? "N/A"}`,
  );
}
