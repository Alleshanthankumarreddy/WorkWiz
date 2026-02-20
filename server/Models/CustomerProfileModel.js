import mongoose from "mongoose";

const customerProfileSchema = new mongoose.Schema(
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
    
    age: {
      type: Number,
      required: true
    },

    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },

    // 📍 Location (Latitude & Longitude)
    location: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    }
  },
  { timestamps: true }
);

const customerProfileModel =
  mongoose.models.CustomerProfile ||
  mongoose.model("CustomerProfile", customerProfileSchema);

export default customerProfileModel;
