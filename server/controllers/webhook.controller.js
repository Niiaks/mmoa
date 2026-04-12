import crypto from "crypto";
import { ENV } from "../config/env.js";
import Contribution from "../models/contribution.js";
import Campaign from "../models/campaign.js";
import Withdrawal from "../models/withdrawals.js";

export const webhookController = async (req, res) => {
  //validate event
  const hash = crypto
    .createHmac("sha512", ENV.paystackSecretKey)
    .update(JSON.stringify(req.body))
    .digest("hex");
  if (hash === req.headers["x-paystack-signature"]) {
    // Retrieve the request's body
    const event = req.body;
    // Do something with event

    switch (event.event) {
      case "charge.success": {
        const contribution = await Contribution.findOne({
          paystackReference: event.data.reference,
        });
        if (!contribution) {
          console.log("no contribution");
        } else if (contribution.status === "successful") {
          console.log("already verified");
        } else {
          contribution.status = "successful";
          await contribution.save();

          await Campaign.findOneAndUpdate(
            { _id: event.data.metadata.campaign_id },
            {
              $inc: { totalRaised: contribution.amount },
            },
          );
        }
        break;
      }

      case "transfer.success": {
        const withdrawal = await Withdrawal.findOne({
          paystackTransferReference: event.data.reference,
        });
        if (!withdrawal) {
          console.log(
            "no withdrawal found for this reference: ",
            event.data.reference,
          );
        } else if (withdrawal.status === "successful") {
          console.log("withdrawal already confirmed");
        } else {
          await Withdrawal.findOneAndUpdate(
            {
              paystackTransferReference: event.data.reference,
            },
            {
              status: "successful",
            },
          );
        }
        break;
      }

      case "transfer.failed": {
        const withdrawal = await Withdrawal.findOne({
          paystackTransferReference: event.data.reference,
        });
        if (!withdrawal) {
          console.log(
            "no withdrawal found for this reference: ",
            event.data.reference,
          );
        } else if (withdrawal.status === "failed") {
          console.log("withdrawal already confirmed");
        } else {
          await Campaign.findOneAndUpdate(
            {
              _id: withdrawal.campaign,
            },
            {
              withdrawn: false,
            },
          );
          await Withdrawal.findOneAndUpdate(
            {
              paystackTransferReference: event.data.reference,
            },
            {
              status: "failed",
            },
          );
        }
        break;
      }
    }
  }
  res.status(200).send();
};
