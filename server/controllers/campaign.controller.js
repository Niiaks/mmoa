import { generateSlug } from "../helpers/slugGenerator.js";
import Campaign, { types } from "../models/campaign.js";
import dayjs from "dayjs";
import Contribution from "../models/contribution.js";

export const createCampaign = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const {
      title,
      description,
      type,
      targetAmount,
      deadline,
      requireContributorName,
    } = req.body;

    if (!title || !description || !type || !targetAmount) {
      return res.status(400).json({
        success: false,
        message: "invalid payload",
      });
    }

    if (!types.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "validation(error): invalid type",
      });
    }

    if (targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "validation(error): invalid targetAmount set",
      });
    }

    let slug = generateSlug();

    //check if slug is in db
    let campaign = await Campaign.findOne({ slug });
    while (campaign) {
      slug = generateSlug();
      campaign = await Campaign.findOne({ slug });
    }

    // default to 30 day deadline if no deadline is passed

    if (deadline && !dayjs(deadline).isValid()) {
      return res.status(400).json({
        success: false,
        message: "validation(error): invalid deadline",
      });
    }

    let campaignDeadline = deadline || dayjs().add(30, "days");

    const newCampaign = new Campaign({
      organizer: organizerId,
      title: title.trim(),
      description,
      deadline: campaignDeadline,
      type,
      targetAmount,
      slug,
      requireContributorName,
    });

    await newCampaign.save();

    return res.status(201).json({
      success: true,
      message: "campaign created successfully",
      campaign: newCampaign,
    });
  } catch (error) {
    console.log("error creating campaign", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Oops Something broke" });
  }
};

export const getCampaign = async (req, res) => {
  try {
    const slug = req.params.slug;

    const campaign = await Campaign.findOne({ slug });
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "campaign not found",
      });
    }

    const numberOfContributors = await Contribution.countDocuments({
      campaign: campaign._id,
    });

    if (dayjs().isAfter(campaign.deadline) && campaign.status === "active") {
      campaign.status = "expired";
      await campaign.save();
    }

    return res.status(200).json({
      success: true,
      message: "gotten campaign",
      campaign: {
        title: campaign.title,
        description: campaign.description,
        deadline: campaign.deadline,
        type: campaign.type,
        numberOfContributors,
        amountRaised: campaign.totalRaised,
        targetAmount: campaign.targetAmount,
        status: campaign.status,
      },
      meta: {
        requireContributorName: campaign.requireContributorName,
      },
    });
  } catch (error) {
    console.error("error getting campaign", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Oops Something broke" });
  }
};

export const getOrganizerCampaign = async (req, res) => {
  try {
    const organizerId = req.user.id;

    const campaign = await Campaign.find({ organizer: organizerId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "gotten campaign(s)",
      campaign,
    });
  } catch (error) {
    console.log("error getting organizer campaign", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Oops Something broke" });
  }
};

export const closeCampaign = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const organizerId = req.user.id;
    const campaign = await Campaign.findOneAndUpdate(
      { _id: campaignId, organizer: organizerId },
      { status: "closed" },
      { new: true },
    );
    if (!campaign) {
      return res.status(403).json({
        success: false,
        message: "unauthorized to perform this action",
      });
    }
    return res.status(200).json({
      success: true,
      message: "campaign closed",
    });
  } catch (error) {
    console.log("error closing campaign", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Oops Something broke" });
  }
};

export const extendDeadline = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const { deadline } = req.body;
    const organizerId = req.user.id;

    if (!deadline) {
      return res.status(400).json({
        success: false,
        message: "invalid payload",
      });
    }
    if (!dayjs(deadline).isValid()) {
      return res.status(400).json({
        success: false,
        message: "validation(error): invalid date",
      });
    }

    if (dayjs(deadline).isBefore(dayjs())) {
      return res.status(400).json({
        success: false,
        message: "validation(error): date must be in the future",
      });
    }
    const campaign = await Campaign.findOneAndUpdate(
      { _id: campaignId, organizer: organizerId },
      { deadline },
      { new: true },
    );
    if (!campaign) {
      return res.status(403).json({
        success: false,
        message: "unauthorized to perform this action",
      });
    }
    return res.status(200).json({
      success: true,
      message: "campaign deadline extended",
    });
  } catch (error) {
    console.log("error closing campaign", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Oops Something broke" });
  }
};
