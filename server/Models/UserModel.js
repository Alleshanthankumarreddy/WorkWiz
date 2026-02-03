import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;
      }
    },

    googleId: {
      type: String,
      default: null
    },

    role: {
      type: String,
      enum: ["customer", "worker"],
      required: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    fcmToken: {
      type: String,
      default: null
    }

  },
  { timestamps: true }
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
