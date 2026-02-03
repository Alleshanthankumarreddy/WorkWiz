import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true // one payment per booking
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    type: {
      type: String,
      default: "advance",
      enum: [ "advance", "final" ],
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "cash"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending"
    },

    paymentGateway: {
      type: String,
      default: "razorpay"
    },

    // Razorpay specific fields
    razorpayOrderId: {
      type: String,
      required: true
    },

    razorpayPaymentId: {
      type: String
    },

    razorpaySignature: {
      type: String
    },

    receipt: {
      type: String
    },

    failureReason: {
      type: String
    },

    paidAt: {
      type: Date
    }
  },
  { timestamps: true }
);

const paymentModel = mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);

export default paymentModel;