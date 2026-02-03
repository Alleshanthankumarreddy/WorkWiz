import messageModle from "../Models/MessageModel.js";
import chatModel from "../Models/ChatModel.js";
import { sendPushNotification } from "../Utils/sendPushNotification.js";

const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await chatModel.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Security check
    if (
      chat.customerId.toString() !== userId.toString() &&
      chat.workerId.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const messages = await messageModle.find({ chatId }).sort({ sentAt: 1 });

    res.json({ success: true, messages });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { getMessages }