import express from "express";

import { getOrCreateChat } from "../controllers/chatController.js";
import { getMessages } from "../controllers/messageController.js";
import auth from "../middleware/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.get("/messages/:chatId", auth, getMessages); // FIRST
chatRouter.get("/:bookingId", auth, getOrCreateChat);    // SECOND

export default chatRouter;
