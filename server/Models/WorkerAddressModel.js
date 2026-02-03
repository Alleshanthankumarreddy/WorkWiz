import mongoose from "mongoose";

const workerAddressSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true
    },

    addressText: {
      type: String,
      required: true
    },

    latitude: {
      type: Number,
      required: true
    },

    longitude: {
      type: Number,
      required: true
    },

    addressType: {
      type: String,
      enum: ["home", "office"],
      default: "home"
    }
  },
  { timestamps: true }
);

const workerAddressModel = mongoose.models.WorkerAddress ||
  mongoose.model("WorkerAddress", workerAddressSchema);

export default workerAddressModel;