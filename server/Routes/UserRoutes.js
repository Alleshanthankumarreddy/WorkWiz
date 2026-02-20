import express from "express";
import { joinedDate, recentActivity, totalBookings } from "../Controllers/UserController.js";

import auth from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/joinedDate" , auth, joinedDate);
userRouter.post("/totalBookings", auth, totalBookings);
userRouter.post("/recentActivity", auth, recentActivity);

export default userRouter;