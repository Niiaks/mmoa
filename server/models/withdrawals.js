import mongoose from "mongoose";

const STATUSES = ["pending", "successful", "failed", "reversed"];

const withdrawalSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
      index: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    momoNumber: {
      type: String,
      required: true,
    },
    totalRaised: {
      type: Number,
      required: true,
    },
    availableBalance: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true,
    },
    paystackMoMoFee: {
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
    transferCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    platformFeeTransferReference: {
      type: String,
      unique: true,
      sparse: true,
    },
    platformFeeTransferCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    platformFeeStatus: {
      type: String,
      enum: ["pending", "successful", "failed", "reversed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: STATUSES,
      default: "pending",
    },
    completedAt: {
      type: Date,
    },
    failureReason: {
      type: String,
    },
  },
  { timestamps: true },
);

// Speeds up the aggregate query in withdrawMoney that sums successful withdrawals
// per campaign.
withdrawalSchema.index({ campaign: 1, status: 1 });

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
export default Withdrawal;
