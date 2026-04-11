import mongoose from "mongoose";

const statuses = ["pending", "successful", "failed"];

const withdrawalSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalRaised: {
      type: Number,
      required: true,
    },
    fee: {
      type: Number,
      required: true,
    },
    amountSent: {
      type: Number,
      required: true,
    },
    paystackTransferReference: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: statuses,
      default: "pending",
    },
  },
  { timestamps: true },
);

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
export default Withdrawal;
