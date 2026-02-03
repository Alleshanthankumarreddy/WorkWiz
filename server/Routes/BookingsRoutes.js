import express from "express";
import auth from "../Middleware/authMiddleware.js";
import { createAdvancePayment, createBookingRequest, sendArrivalVerificationOtp, sendWorkCompletionOtp, verifyArrivalOtpAndStartWork, verifyCompletionOtpAndFinishWork } from "../Controllers/BookingsController.js";

const bookingsRouter = express.Router();

bookingsRouter.post("/createBookingRequest", auth, createBookingRequest);
bookingsRouter.patch("/createAdvancePayment", auth, createAdvancePayment);
bookingsRouter.post("/sendArrivalVerificationOtp", auth, sendArrivalVerificationOtp);
bookingsRouter.patch("/verifyArrivalOtpAndStartWork", auth,verifyArrivalOtpAndStartWork);
bookingsRouter.post("/sendWorkCompletionOtp", auth, sendWorkCompletionOtp);
bookingsRouter.patch("/verifyCompletionOtpAndFinishWork", auth, verifyCompletionOtpAndFinishWork);

export default bookingsRouter;