// import { Server } from "socket.io";
// import messageModel from "../Models/MessageModel.js";
// import chatModel from "../Models/ChatModel.js";

// const initChatSocket = (server) => {
//   const io = new Server(server, {
//     cors: { origin: "*", methods: ["GET", "POST"] },
//   });

//   io.on("connection", (socket) => {
//     console.log("🔌 User connected:", socket.id);

//     // ✅ Join chat using bookingId as the room
//     socket.on("join_chat", ({ bookingId }) => {
//       if (!bookingId) return console.error("join_chat: bookingId is missing!");
//       socket.join(bookingId);
//       console.log("User joined chat room:", bookingId);
//     });

//     // Handle sending message
//     socket.on("send_message", async (data) => {
//       try {
//         const { chatId, bookingId, senderId, senderType, messageText } = data;

//         if (!chatId || !bookingId || !senderId) return console.error("send_message: Missing fields!");

//         const newMessage = await messageModel.create({
//           chatId,
//           senderId,
//           senderType,
//           messageText,
//         });

//         await chatModel.findByIdAndUpdate(chatId, { lastMessageAt: Date.now() });

//         // ✅ Emit message to the room (bookingId)
//         io.to(bookingId).emit("receive_message", newMessage);
//       } catch (error) {
//         console.error("Message error:", error);
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ User disconnected");
//     });
//   });
// };

// export default initChatSocket;
import { Server } from "socket.io";
import messageModel from "../Models/MessageModel.js";
import chatModel from "../Models/ChatModel.js";
import userModel from "../Models/UserModel.js";
import {sendPushNotification} from "../Utils/sendPushNotification.js";

const onlineUsers = new Map();

const initChatSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // // 🟢 Register user as online
    // socket.on("register_user", (userId) => {
    //   onlineUsers.set(userId, socket.id);
    //   console.log("✅ User online:", userId);
    // });

  socket.on("register_user", (userId) => {
    onlineUsers.set(userId, socket.id);

    socket.join(userId.toString());   // ⭐ CRITICAL FIX
    console.log("✅ User online:", userId);
  });

    // 🟢 Join booking room
    socket.on("join_chat", ({ bookingId }) => {
      socket.join(bookingId);
      console.log("User joined chat room:", bookingId);
    });

      socket.on("send_message", async (msg) => {
    try {
      const savedMessage = await messageModel.create({
        chatId: msg.chatId,
        senderType: msg.senderType,
        senderId: msg.senderId,
        messageText: msg.messageText,
        isQuote: msg.isQuote || false,
        sentAt: msg.sentAt
      });

      io.to(msg.bookingId).emit("receive_message", {
        ...savedMessage.toObject(),
        quoteId: msg.quoteId   // forwarded only for UI
      });

    } catch (err) {
      console.error("Message save error:", err);
    }
  });

    socket.on("typing", ({ bookingId, userId, isTyping }) => {
    socket.to(bookingId).emit("user_typing", { userId, isTyping });
    });

    


    socket.on("disconnect", () => {
      // Remove disconnected user
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log("❌ User offline:", userId);
          break;
        }
      }
    });
  });

  return io;
};

export default initChatSocket;
