import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: 3,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    phone: {
      type: String,
      min: 10,
      trim: true,
      required: true,
    },
    momoNumber: {
      type: String,
      minLength: 10,
      trim: true,
    },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
