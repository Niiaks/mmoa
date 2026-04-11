import Contribution from "../models/contribution.js";
import Campaign from "../models/campaign.js";
export const initializePayment = async (req, res) => {
  const { campaignId, amount, contributorName } = req.body;
  if (!campaignId || !parseFloat(amount)) {
    return res.status(400).json({ success: false, message: "invalid payload" });
  }

  const campaign = await Campaign.findById(campaignId, {
    status: "active",
  });
  if (!campaign) {
    return res.status(400).json({
      success: false,
      message:
        "campaign not found. It's either closed or expired. Contact organizer",
    });
  }
};
