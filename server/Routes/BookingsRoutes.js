import express from "express";
import auth from "../Middleware/authMiddleware.js";
import { cancelBooking, createAdvancePayment, createBookingRequest, getRequestedBookings, payRemainingAmount, sendArrivalVerificationOtp, sendWorkCompletionOtp, verifyArrivalOtpAndStartWork, verifyCompletionOtpAndFinishWork } from "../Controllers/BookingsController.js";

const bookingsRouter = express.Router();

bookingsRouter.post("/createBookingRequest", auth, createBookingRequest);
bookingsRouter.patch("/createAdvancePayment", auth, createAdvancePayment);
bookingsRouter.post("/sendArrivalVerificationOtp", auth, sendArrivalVerificationOtp);
bookingsRouter.patch("/verifyArrivalOtpAndStartWork", auth,verifyArrivalOtpAndStartWork);
bookingsRouter.post("/sendWorkCompletionOtp", auth, sendWorkCompletionOtp);
bookingsRouter.patch("/verifyCompletionOtpAndFinishWork", auth, verifyCompletionOtpAndFinishWork);
bookingsRouter.post("/payRemainingAmount",auth, payRemainingAmount);
bookingsRouter.post("/cancelBooking", auth, cancelBooking);
bookingsRouter.post("/getRequestedBookings", auth, getRequestedBookings);

export default bookingsRouter;