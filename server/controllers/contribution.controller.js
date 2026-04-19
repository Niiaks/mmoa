import Contribution from "../models/contribution.js";
import Campaign from "../models/campaign.js";
import axios from "axios";
import { ENV } from "../config/env.js";
const paystackUrl = "https://api.paystack.co";

export const initializePayment = async (req, res) => {
  try {
    const { campaignId, amount, contributorName, contributorEmail } = req.body;
    if (!campaignId || !amount || !contributorEmail) {
      return res
        .status(400)
        .json({ success: false, message: "invalid payload" });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.status !== "active") {
      return res.status(400).json({
        success: false,
        message:
          "campaign not found. It's either closed or expired. Contact organizer",
      });
    }

    if (campaign.requireContributorName) {
      if (!contributorName) {
        return res.status(400).json({
          success: false,
          message: "validation(error): your name is required",
        });
      }
    }

    const { data } = await axios.post(
      `${paystackUrl}/transaction/initialize`,
      {
        email: contributorEmail,
        amount: amount * 100,
        callback_url: `${ENV.clientUrl}/verify`,
        metadata: {
          campaign_id: campaign._id,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ENV.paystackSecretKey}`,
        },
      },
    );
    const newContribution = new Contribution({
      campaign: campaignId,
      amount: parseFloat(amount),
      paystackReference: data.data.reference,
      contributorName,
    });

    await newContribution.save();
    return res.status(200).json({
      success: true,
      message: "payment processed initialized",
      data: {
        reference: data.data.reference,
        authorizationUrl: data.data.authorization_url,
      },
    });
  } catch (error) {
    console.log("contribution error", error.message);
    return res.status(500).json({
      success: false,
      message: "oops something broke",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const reference = req.params.reference;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "missing reference",
      });
    }

    const contribution = await Contribution.findOne({
      paystackReference: reference,
    }).populate("campaign");

    if (!contribution) {
      return res.status(404).json({
        success: false,
        message: "contribution not found",
      });
    }

    if (contribution.status === "successful") {
      return res.status(200).json({
        success: true,
        message: "payment already verified",
        data: {
          amount: contribution.amount,
          campaign: contribution.campaign.title,
        },
      });
    }

    const { data } = await axios.get(
      `${paystackUrl}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${ENV.paystackSecretKey}`,
        },
      },
    );

    if (data.data.status === "success") {
      contribution.status = "successful";
      await contribution.save();

      await Campaign.findByIdAndUpdate(contribution.campaign._id, {
        $inc: { totalRaised: contribution.amount },
      });

      return res.status(200).json({
        success: true,
        message: "payment verified",
        data: {
          amount: contribution.amount,
          campaign: contribution.campaign.title,
        },
      });
    } else {
      contribution.status = "failed";
      await contribution.save();

      return res.status(400).json({
        success: false,
        message: "payment failed",
      });
    }
  } catch (error) {
    console.log("verification error", error.message);
    return res.status(500).json({
      success: false,
      message: "oops something broke",
    });
  }
};

export const getContributions = async (req, res) => {
  try {
    const campaignId = req.params.campaignId;
    const organizerId = req.user.id;

    const campaign = await Campaign.findOne({
      _id: campaignId,
      organizer: organizerId,
    });
    if (!campaign) {
      return res.status(403).json({
        success: false,
        message: "doesn't exist or doesn't belong to you",
      });
    }
    const contributions = await Contribution.find({
      status: "successful",
      campaign: campaignId,
    }).select("contributorName amount createdAt");

    return res.status(200).json({
      success: true,
      message: "gotten contributions",
      contributions,
    });
  } catch (error) {
    console.log("get contributions error", error.message);
    return res.status(500).json({
      success: false,
      message: "oops something broke",
    });
  }
};
