import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import http from "http";

import { connectDB } from "./Config/mongodb.js";
import razorpayInstance from "./Config/razorpay.js";

import workerModel from "./Models/WorkerModel.js";
import chatModel from "./Models/ChatModel.js";
import messageModel from "./Models/MessageModel.js";
import Booking from "./Models/BookingModel.js";
import reviewModel from "./Models/ReviewsModel.js";

import customerRouter from "./Routes/CustomerRoutes.js";
import workerRouter from "./Routes/WorkerRoutes.js";
import AuthRouter from "./Routes/AuthRoutes.js";
import notificationRouter from "./Routes/NotificationsRoutes.js";
import bookingsRouter from "./Routes/BookingsRoutes.js";
import chatRouter from "./Routes/ChatRoutes.js";
import userRouter from "./Routes/UserRoutes.js";

import initChatSocket from "./socket/chatSocket.js";
import reviewsRouter from "./Routes/ReviewsRoutes.js";
import QuoteRouter from "./Routes/QuoteRoutes.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

// DB Connection
await connectDB();

// Routes
app.use('/api/customer', customerRouter);
app.use('/api/worker', workerRouter);
app.use('/api/auth', AuthRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/booking", bookingsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/user",userRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/quote", QuoteRouter);

app.use("/uploads", express.static("uploads"));
// 🔥 Create HTTP server
const server = http.createServer(app);

// 🔥 Initialize Socket.IO
const io = initChatSocket(server);

app.set("io" , io);

// Start server
server.listen(PORT, () => {
  console.log("🚀 Server running on PORT " + PORT);
});
