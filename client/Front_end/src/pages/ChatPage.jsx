import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import { PaperAirplaneIcon as PaperAirplaneSolid } from "@heroicons/react/24/solid";

import QuoteCard from "../components/QuoteCard";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteData, setQuoteData] = useState({
    workDescription: "",
    startDate: "",
    startTime: "",
    totalAmount: "",
  });

  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const navigate = useNavigate();
  const { bookingId } = useParams();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const API_BASE = "http://localhost:5000/api";

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  /* ---------------- LOAD CHAT ---------------- */
  useEffect(() => {
    if (!bookingId) return;

    const initChat = async () => {
      try {
        const { data: chatRes } = await axios.get(
          `${API_BASE}/chat/${bookingId}`,
          getAuthHeader()
        );

        const chat = chatRes.chat;
        if (!chat) return;

        setChatId(chat._id);

        const other = chat.workerId === currentUser._id ? chat.customer : chat.worker;
        setOtherUser(other);

        socket.emit("join_chat", { bookingId });

        const { data: msgRes } = await axios.get(
          `${API_BASE}/chat/messages/${chat._id}`,
          getAuthHeader()
        );

        setMessages(msgRes.messages);
      } catch (err) {
        console.error("Chat load error", err);
      }
    };

    initChat();
  }, [bookingId]);

  /* ---------------- SOCKET EVENTS ---------------- */
  useEffect(() => {
    const handleReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
      setIsTyping(false);
    };

    const handleTyping = ({ userId, isTyping }) => {
      if (userId !== currentUser._id) setIsTyping(isTyping);
    };

    socket.on("receive_message", handleReceive);
    socket.on("user_typing", handleTyping);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("user_typing", handleTyping);
    };
  }, []);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
  
useEffect(() => {
  if (currentUser?._id) {
    socket.emit("register_user", currentUser._id);
  }
}, []);

  /* ---------------- TYPING ---------------- */
  const emitTyping = (typing) => {
    socket.emit("typing", { bookingId, userId: currentUser._id, isTyping: typing });
  };

  const handleTyping = () => {
    emitTyping(true);
    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 1500);
  };

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!text.trim()) return;

    const newMessage = {
      chatId,
      bookingId,
      senderId: currentUser._id,
      senderType: currentUser.role,
      messageText: text,
      sentAt: new Date().toISOString(),
    };

    socket.emit("send_message", newMessage);
    setText("");
    emitTyping(false);
  };

  /* ---------------- SEND QUOTE ---------------- */
  const sendQuote = async (e) => {
    e.preventDefault();
    try {
      const startTimeISO = new Date(`${quoteData.startDate}T${quoteData.startTime}`).toISOString();

      const payload = {
        bookingId,
        description: quoteData.workDescription,
        totalAmount: Number(quoteData.totalAmount),
        startTime: startTimeISO,
      };

      const { data: res } = await axios.post(`${API_BASE}/quote/createQuote`, payload, getAuthHeader());
      const quote = res.quote;

const messageText = `💬 Quote from worker:-
Description of work: ${quote.description}
Amount: ₹${quote.totalAmount}
Start: ${new Date(quote.startTime).toLocaleString()}`;

      socket.emit("send_message", {
        chatId,
        bookingId,
        senderId: currentUser._id,
        senderType: "worker",
        messageText,
        isQuote: true, 
        quoteId: quote._id,
        sentAt: new Date().toISOString(),
      });

      // Reset quote form
      setShowQuoteForm(false);
      setQuoteData({ workDescription: "", startDate: "", startTime: "", totalAmount: "" });

      alert("Quote sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send quote.");
    }
  };

  /* ---------------- HANDLE QUOTE INPUT ---------------- */
  const handleQuoteInputChange = (e) => {
    const { name, value } = e.target;
    setQuoteData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex flex-col h-screen bg-[#EFECE3]">
      {/* HEADER */}
      <div className="bg-[#213448] text-white p-4 shadow">
        <h2 className="text-lg font-semibold">{otherUser?.name || "Loading..."}</h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === currentUser._id;

          if (msg.isQuote) {
            return (
              <QuoteCard
                key={msg._id || i}
                msg={msg}
                isMe={isMe}
                role={role}
              />
            );
          }

          return (
            <div key={msg._id || i} className={`mb-3 flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-[70%] ${isMe ? "bg-[#4A70A9] text-white" : "bg-white text-black"}`}>
                {msg.messageText}
              </div>
            </div>
          );
        })}

        {isTyping && <div className="text-sm text-gray-500 mb-2">{otherUser?.name} is typing...</div>}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT + BUTTONS */}
      <div className="p-3 bg-white border-t flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border rounded-full px-4 py-2"
            placeholder="Type a message..."
          />

          <button onClick={sendMessage} className="bg-[#213448] text-white p-2 rounded-full flex items-center justify-center">
            <PaperAirplaneSolid className="h-5 w-5" />
          </button>

          {role === "worker" && (
            <button className="bg-[#213448] text-white px-4 py-2 rounded-full" onClick={() => setShowQuoteForm((prev) => !prev)}>
             Send Quote
            </button>
          )}
        </div>

        {/* QUOTE FORM */}
        {showQuoteForm && (
          <form className="bg-[#F9F7F7] border p-4 rounded-xl mt-2" onSubmit={sendQuote}>
            <h3 className="font-semibold mb-2">Create Quote</h3>
            <textarea
              name="workDescription"
              value={quoteData.workDescription}
              onChange={handleQuoteInputChange}
              required
              placeholder="Describe the work..."
              className="w-full border p-2 rounded-xl mb-2"
            />
            <div className="grid md:grid-cols-2 gap-2 mb-2">
              <input
                type="date"
                name="startDate"
                min={new Date().toISOString().split("T")[0]}
                value={quoteData.startDate}
                onChange={handleQuoteInputChange}
                required
                className="border p-2 rounded-xl"
              />
              <input
                type="time"
                name="startTime"
                value={quoteData.startTime}
                onChange={handleQuoteInputChange}
                required
                className="border p-2 rounded-xl"
              />
            </div>
            <input
              type="number"
              name="totalAmount"
              min="1"
              value={quoteData.totalAmount}
              onChange={handleQuoteInputChange}
              required
              placeholder="Total Amount"
              className="w-full border p-2 rounded-xl mb-2"
            />
            <button type="submit" className="w-full bg-[#112D4E] text-white p-2 rounded-xl">
              Send Quote
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
