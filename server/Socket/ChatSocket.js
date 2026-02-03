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

const onlineUsers = new Map(); // userId -> socketId

const initChatSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // 🟢 Register user as online
    socket.on("register_user", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("✅ User online:", userId);
    });

    // 🟢 Join booking room
    socket.on("join_chat", ({ bookingId }) => {
      socket.join(bookingId);
      console.log("User joined chat room:", bookingId);
    });

    // 📨 Handle message sending
    socket.on("send_message", async (data) => {
      try {
        const { chatId, bookingId, senderId, senderType, messageText } = data;

        const newMessage = await messageModel.create({
          chatId,
          senderId,
          senderType,
          messageText,
        });

        const chat = await chatModel.findById(chatId);

        // 🔥 Determine receiver
        const receiverId =
          senderType === "customer" ? chat.workerId.toString() : chat.customerId.toString();

        const receiverSocket = onlineUsers.get(receiverId);

        // 🟢 Send real-time message to chat room
        io.to(bookingId).emit("receive_message", newMessage);

        // 🔔 Send push notification if receiver is offline
        if (!receiverSocket) {
          const receiver = await userModel.findById(receiverId);
          console.log(receiver.fcmToken);
          if (receiver?.fcmToken) {
            await sendPushNotification(
              receiver.fcmToken,
              "💬 New Message on WorkWiz",
              messageText.length > 40 ? messageText.slice(0, 40) + "..." : messageText,
              receiverId // 👈 ADD THIS
            );

            console.log("📲 Push sent to offline user:", receiverId);
          }
        }

        await chatModel.findByIdAndUpdate(chatId, { lastMessageAt: Date.now() });

      } catch (error) {
        console.error("Message error:", error);
      }
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
};

export default initChatSocket;
