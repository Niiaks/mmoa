import mongoose from "mongoose";

const statuses = ["pending", "successful", "failed"];

const contributionSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      index: true,
      required: true,
    },
    contributorName: {
      type: String,
      trim: true,
    },
    contributorPhone: {
      type: String,
      trim: true,
      minLength: 10,
    },
    amount: {
      type: Number,
      required: true,
    },
    paystackReference: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enum: statuses,
    },
  },
  { timestamps: true },
);

export const Contribution = mongoose.model("Contribution", contributionSchema);
