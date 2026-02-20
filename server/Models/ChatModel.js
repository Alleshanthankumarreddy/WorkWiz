import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true // one chat per booking
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    lastMessageAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const chatModel = mongoose.models.Chat ||
  mongoose.model("Chat", chatSchema);
export default chatModel;
