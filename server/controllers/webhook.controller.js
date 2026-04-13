import crypto from "crypto";
import { ENV } from "../config/env.js";
import Contribution from "../models/contribution.js";
import Campaign from "../models/campaign.js";
import Withdrawal from "../models/withdrawals.js";

export const webhookController = async (req, res) => {
  //validate event
  const hash = crypto
    .createHmac("sha512", ENV.paystackSecretKey)
    .update(req.body)
    .digest("hex");
  if (hash === req.headers["x-paystack-signature"]) {
    // Retrieve the request's body
    const event = JSON.parse(req.body.toString());
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

        if (withdrawal && withdrawal.status !== "successful") {
          await Withdrawal.findOneAndUpdate(
            { paystackTransferReference: event.data.reference },
            { status: "successful" },
          );

          await Campaign.findByIdAndUpdate(withdrawal.campaign, {
            withdrawn: true,
          });
        }
        break;
      }

      case "transfer.failed": {
        const withdrawal = await Withdrawal.findOne({
          paystackTransferReference: event.data.reference,
        });

        if (withdrawal && withdrawal.status !== "failed") {
          await Withdrawal.findOneAndUpdate(
            { paystackTransferReference: event.data.reference },
            { status: "failed" },
          );

          await Campaign.findByIdAndUpdate(withdrawal.campaign, {
            withdrawn: false,
          });
        }

        break;
      }
    }
  }
  res.status(200).send();
};
