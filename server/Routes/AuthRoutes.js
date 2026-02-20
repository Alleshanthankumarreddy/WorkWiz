import express from "express";
import { googleAuthSignin, googleAuthSignup, sendOtp, signin, signup } from "../Controllers/AuthControllers.js";
import auth from "../Middleware/authMiddleware.js";

const AuthRouter = express.Router();

AuthRouter.post("/signup", signup);
AuthRouter.post("/googlesignup",googleAuthSignup);
AuthRouter.post("/sendotp",sendOtp);
AuthRouter.post("/signin",signin)
AuthRouter.post("/googlesignin",googleAuthSignin)

export default AuthRouter;