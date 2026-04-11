import mongoose from "mongoose";

export const types = [
  "emergency",
  "bereavement",
  "education",
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
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: types,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
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
    requireContributorName: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
