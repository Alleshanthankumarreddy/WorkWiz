import mongoose from "mongoose";

const workerBankSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // One bank profile per worker
    },

    accountHolderName: {
      type: String,
      required: true,
      trim: true
    },

    bankName: {
      type: String,
      required: true,
      trim: true
    },

    accountNumber: {
      type: String,
      required: true,
      trim: true
      // 🔐 In production: encrypt this
    },

    ifscCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },

    upiId: {
      type: String,
      trim: true // Optional
    },

    isVerified: {
      type: Boolean,
      default: false // Admin can verify later
    }
  },
  { timestamps: true }
);

const workerBankModel =
  mongoose.models.WorkerBank ||
  mongoose.model("WorkerBank", workerBankSchema);

export default workerBankModel;
