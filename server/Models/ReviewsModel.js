import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true // one review per booking
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    reviewText: {
      type: String,
      trim: true,
      maxlength: 1000
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const reviewModel = mongoose.models.Review ||
  mongoose.model("Review", reviewSchema);

export default reviewModel;
