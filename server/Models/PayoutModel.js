import mongoose from "mongoose";

const payoutSchema = new mongoose.Schema(
  {
    // References
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Payment reference (from Razorpay)
    razorpayPaymentId: {
      type: String,
      required: true,
    },

    razorpayOrderId: {
      type: String,
    },

    // Amount details (ALWAYS store in paise)
    amount: {
      type: Number, // e.g. 1000 = ₹10
      required: true,
    },

    platformCommission: {
      type: Number, // optional
      default: 0,
    },

    workerEarning: {
      type: Number, // amount worker should receive
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    // Worker bank snapshot (IMPORTANT)
    workerBankDetails: {
      accountHolderName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { type: String, required: true },
      bankName: { type: String },
      upiId: { type: String },
    },

    // Payout handling
    payoutMethod: {
      type: String,
      enum: ["manual", "razorpay_x"],
      default: "manual",
    },

    payoutStatus: {
      type: String,
      enum: ["pending", "processing", "paid", "failed"],
      default: "pending",
    },

    payoutDate: {
      type: Date,
    },

    payoutReference: {
      type: String, // UTR / Transaction ID (manual transfer)
    },

    // Safety & tracking
    notes: {
      type: String,
    },

    createdByAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const PayoutModel =
  mongoose.models.Payout || mongoose.model("Payout", payoutSchema);

export default PayoutModel;
