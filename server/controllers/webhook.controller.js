import crypto from "crypto";
import { ENV } from "../config/env.js";
import Contribution from "../models/contribution.js";
import Campaign from "../models/campaign.js";

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
    if (event.event === "charge.success") {
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
    }
  }
  res.status(200).send();
};
