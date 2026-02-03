import express from "express";
import { saveFcmToken } from "../Controllers/NotificationsController.js";
import auth from "../Middleware/authMiddleware.js";

const notificationRouter = express.Router();

notificationRouter.post("/save-token", auth, saveFcmToken);

export default notificationRouter;
