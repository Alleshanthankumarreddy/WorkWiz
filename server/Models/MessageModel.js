import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },

    senderType: {
      type: String,
      enum: ["customer", "worker"],
      required: true
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    messageText: {
      type: String,
      trim: true
    },

    isRead: {
      type: Boolean,
      default: false
    },
     isQuote: {
      type: Boolean,
      default: false
    },
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
    },

    sentAt: {
      type: Date,
      default: Date.now
    },

  }
);

const messageModel = mongoose.models.Message ||
  mongoose.model("Message", messageSchema);

export default messageModel;
