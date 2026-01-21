import express from "express";
import { googleAuth, sendOtp, signin, signup } from "../Controllers/AuthControllers.js";

const AuthRouter = express.Router();

AuthRouter.post("/signup", signup);
AuthRouter.post("/google",googleAuth);
AuthRouter.post("/sendotp",sendOtp);
AuthRouter.post("/signin",signin)

export default AuthRouter;