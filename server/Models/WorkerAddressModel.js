import mongoose from "mongoose";

const workerAddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    addressDetails: {
      houseNumber: { type: String },
      street: { type: String },
      area: { type: String },
      landmark: { type: String },
      city: { type: String, required: true },
      district: { type: String },
      state: { type: String, required: true },
      country: { type: String, default: "India" },
      pincode: {
        type: String,
        match: [/^\d{6}$/, "Invalid pincode"]
      }
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