import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ChatPage = ({ bookingId, currentUser }) => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  const API_BASE = "http://localhost:5000/api";

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // 🟢 Load chat & messages
  useEffect(() => {
    const initChat = async () => {
      if (!bookingId) return console.error("No bookingId provided!");

      try {
        const chatRes = await axios.get(`${API_BASE}/chat/${bookingId}`, getAuthHeader());
        const chat = chatRes.data.chat;

        if (!chat) {
          console.error("Chat not found for bookingId:", bookingId);
          return;
        }

        setChatId(chat._id);

        // ✅ Join socket room using bookingId
        console.log("Joining socket room for bookingId:", bookingId);
        socket.emit("join_chat", { bookingId });

        const msgRes = await axios.get(`${API_BASE}/chat/messages/${chat._id}`, getAuthHeader());
        setMessages(msgRes.data.messages);
      } catch (err) {
        console.error("Chat load error", err);
      }
    };

    initChat();
  }, [bookingId]);

  // 🟢 Receive live messages
  useEffect(() => {
    socket.on("receive_message", (msg) => setMessages(prev => [...prev, msg]));
    return () => socket.off("receive_message");
  }, []);

  // 🟢 Auto scroll
  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  // 🟢 Send message
  const sendMessage = () => {
    if (!text.trim()) return;
    if (!currentUser?._id) return console.error("Cannot send message: currentUser._id is missing!");

    socket.emit("send_message", {
      chatId,
      bookingId, // ✅ send bookingId to server
      senderId: currentUser._id,
      senderType: currentUser.role,
      messageText: text,
    });

    setText("");
  };
  useEffect(() => {
    if (currentUser?._id) {
      socket.emit("register_user", currentUser._id);
    }
  }, [currentUser]);


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-green-600 text-white p-4 shadow-md text-lg font-semibold">Booking Chat</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(msg => {
          const isMe = msg.senderId === currentUser._id;
          return (
            <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow ${
                isMe ? "bg-green-500 text-white rounded-br-none" : "bg-white text-gray-800 rounded-bl-none"
              }`}>
                {msg.messageText}
                <div className="text-[10px] mt-1 opacity-70 text-right">
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef}></div>
      </div>
      <div className="p-3 bg-white border-t flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
