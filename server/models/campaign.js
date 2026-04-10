import mongoose from "mongoose";

const types = [
  "emergency",
  "bereavement",
  "education",
  "emergency",
  "medical",
  "other",
];
const statuses = ["active", "closed", "expired"];

const campaignSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: String,
    type: {
      type: String,
      enum: types,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    totalRaised: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "active",
      enum: statuses,
    },
    deadline: Date,
  },
  { timestamps: true },
);

export const Campaign = mongoose.Model("Campaign", campaignSchema);
