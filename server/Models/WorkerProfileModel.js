import mongoose from "mongoose";

const workerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true
    },

    workCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    services: {
      type: [String],
      required: true
    },

    pricePerHour: {
      type: Number,
      required: true,
      min: 0
    },

    experience: {
      type: Number,
      required: true,
      min: 0
    },

    permanentAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },

    documents: {
      idProof: { type: String },
      certificates: [{ type: String }]
    },

    isApproved: {
      type: Boolean,
      default: false
    },

    isAvailable: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const workerProfileModel =
  mongoose.models.WorkerProfile ||
  mongoose.model("WorkerProfile", workerProfileSchema);

export default workerProfileModel;
