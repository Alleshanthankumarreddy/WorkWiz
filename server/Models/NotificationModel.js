import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["customer", "worker"],
      required: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    relatedBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null
    },

    notificationType: {
      type: String,
      enum: ["waiting_list", "booking", "payment"],
      required: true
    },

    channel: {
      type: String,
      enum: ["in_app", "push", "email", "sms"],
      default: "in_app"
    },

    isRead: {
      type: Boolean,
      default: false
    },

    action: {
      type: String // e.g. "OPEN_BOOKING", "OPEN_PAYMENT"
    },

    payload: {
      type: Object // flexible extra data
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const notificationModel = mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default notificationModel;
