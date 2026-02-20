import Booking from "../Models/BookingModel.js";
import workerModel from "../Models/WorkerModel.js";
import userModel from "../Models/UserModel.js";
import paymentModel from "../Models/PaymentModel.js";
import razorpayInstance from "../Config/razorpay.js";
import otpModel from "../Models/OtpModel.js";
import workerBankModel from "../Models/WorkerBankDetailsModel.js";
import customerProfileModel from "../Models/CustomerProfileModel.js";

import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const sendOtpToEmail = async (email, subject, messageTitle) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(otp, salt);

  // Remove old OTPs for this email
  await otpModel.deleteMany({ email });

  await otpModel.create({
    email,
    otpHash,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"WorkWiz" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <h2>${messageTitle}</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `
  });
};

const verifyOtp = async (email, otp) => {
  const otpRecord = await otpModel.findOne({ email }).sort({ createdAt: -1 });
  if (!otpRecord) return false;

  const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!isMatch) return false;

  await otpModel.deleteMany({ email }); // prevent reuse
  return true;
};

const createBookingRequest = async (req, res) => {
  const { workerEmail, serviceType, expectedTime, serviceAddress } = req.body;
  const customerId = req.user._id;

  try {
    /* ---------------- VALIDATION ---------------- */

    if (!workerEmail || !serviceType || !expectedTime || !serviceAddress) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const { fullAddress, city, pincode, landmark, state, lat, lng } = serviceAddress;

    if (!fullAddress || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Address, city and pincode are required"
      });
    }

    /* ---------------- CUSTOMER CHECK ---------------- */

    const customer = await userModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }
const requestedStartTime = new Date(expectedTime);

if (isNaN(requestedStartTime.getTime())) {
  return res.status(400).json({
    success: false,
    message: "Invalid start time"
  });
}

const now = new Date();

// Must be future
if (requestedStartTime <= now) {
  return res.status(400).json({
    success: false,
    message: "Start time must be in the future"
  });
}

// Must be 1 hour ahead
const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

if (requestedStartTime < oneHourFromNow) {
  return res.status(400).json({
    success: false,
    message: "Start time must be at least 1 hour from now"
  });
}


    /* ---------------- FIND USER BY EMAIL ---------------- */

    const workerUser = await userModel.findOne({ email: workerEmail });

    if (!workerUser || workerUser.role !== "worker") {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    /* ---------------- FIND WORKER PROFILE ---------------- */

    const worker = await workerModel.findOne({ userId: workerUser._id });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found"
      });
    }

    /* ---------------- AVAILABILITY CHECK ---------------- */

    if (!worker.isFree) {
      return res.status(400).json({
        success: false,
        message: "Worker is not available currently"
      });
    }

    const existingBooking = await Booking.findOne({
      customerId,
      workerId: worker.userId,
      status: { $in: ["requested", "accepted", "in_progress"] }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You already have an active booking with this worker"
      });
    }


    /* ---------------- CREATE BOOKING ---------------- */

    const booking = new Booking({
      customerId,
      workerId: worker.userId,   // ✅ CORRECT
      serviceType,
      startTime: new Date(expectedTime),
      status: "requested",

      serviceAddress: {
        fullAddress,
        landmark,
        city,
        state,
        pincode,
        location: { lat, lng }
      }
    });

    await booking.save();

    return res.status(201).json({
      success: true,
      message: "Booking request sent successfully",
      booking
    });

  } catch (error) {
    console.error("Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating booking"
    });
  }
};

const createAdvancePayment = async (req,res) => {
    const { bookingId, totalAmount, description, startTime, paymentMethod } = req.body;
     try {
    // 1️⃣ Validate input
    if (!bookingId || !totalAmount || !description || !startTime || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "All fields including description are required"
      });
    }

    // 2️⃣ Find booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }
    

    const requestedStartTime = new Date(startTime);

    if (isNaN(requestedStartTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid start time"
      });
    }

    // Booking creation time + 1 hour
    const minimumAllowedTime = new Date(booking.createdAt.getTime() + 60 * 60 * 1000);

    if (requestedStartTime < minimumAllowedTime) {
      return res.status(400).json({
        success: false,
        message: "Start time must be at least 1 hour after booking request"
      });
    }
    
    // 4️⃣ Decide advance amount (20%)
    const advanceAmount = Math.round(totalAmount * 0.2);

    // 3️⃣ Update booking details
    booking.totalAmount = totalAmount;
    booking.description = description; // ✅ added properly
    booking.startTime = new Date(startTime);
    booking.remainingAmount = totalAmount - advanceAmount;
    booking.status = "accepted"
    await booking.save();

    await workerModel.findOneAndUpdate(
      { userId: booking.workerId },
      { isFree: false }
    );


    // 5️⃣ Create Razorpay order
    const order = await razorpayInstance.orders.create({
      amount: advanceAmount * 100, // in paise
      currency: "INR",
      receipt: `booking_${bookingId}`,
      payment_capture: 1
    });

    // 6️⃣ Create payment record
    const payment = new paymentModel({
      bookingId,
      amount: advanceAmount,
      type: "advance",
      paymentMethod,
      razorpayOrderId: order.id,
      receipt: order.receipt,
      paymentStatus: "pending"
    });

    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Advance payment order created",
      orderId: order.id,
      amount: advanceAmount,
      currency: "INR"
    });

  } catch (error) {
    console.error("Booking Step 2 Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during payment setup"
    });
  }
};

const sendArrivalVerificationOtp = async (req, res) => {
    const { bookingId } = req.body;

    try {
        const booking = await Booking.findById(bookingId).populate("customerId");
        if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

        await sendOtpToEmail(
        booking.customerId.email,
        "OTP to Verify Worker Arrival",
        "Worker Arrival Verification"
        );

        res.json({ success: true, message: "Arrival OTP sent" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
}

const verifyArrivalOtpAndStartWork = async (req, res) => {
  const { bookingId, otp } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate("customerId");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const valid = await verifyOtp(booking.customerId.email, otp);
    if (!valid) return res.status(400).json({ success: false, message: "Invalid OTP" });

    booking.status = "in_progress";
    await booking.save();

    res.json({ success: true, message: "Work started", booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

const sendWorkCompletionOtp = async (req,res) => {
    const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate("customerId");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    await sendOtpToEmail(
      booking.customerId.email,
      "OTP to Confirm Work Completion",
      "Work Completion Verification"
    );

    res.json({ success: true, message: "Completion OTP sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

const verifyCompletionOtpAndFinishWork= async (req, res) => {
  const { bookingId, otp } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate("customerId");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const valid = await verifyOtp(booking.customerId.email, otp);
    if (!valid) return res.status(400).json({ success: false, message: "Invalid OTP" });

    booking.status = "work_done";
    await booking.save();

    res.json({ success: true, message: "Work marked as completed", booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "OTP verification failed" });
  }
};

const payRemainingAmount = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    if (!bookingId || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Booking ID and payment method are required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status !== "work_done") {
      return res.status(400).json({ success: false, message: "Work not completed yet" });
    }

    const remainingAmount = booking.remainingAmount;
    if (remainingAmount <= 0) {
      return res.status(400).json({ success: false, message: "No remaining amount to pay" });
    }

    await workerModel.findOneAndUpdate(
      { userId: booking.workerId },
      { isFree: true }
    );


    // ✅ ONLY create order — DO NOT PAY WORKER HERE
    const order = await razorpayInstance.orders.create({
      amount: remainingAmount * 100,
      currency: "INR",
      receipt: `booking_remaining_${bookingId}`,
      payment_capture: 1
    });

    const payment = await paymentModel.create({
      bookingId,
      amount: remainingAmount,
      type: "remaining",
      paymentMethod,
      razorpayOrderId: order.id,
      receipt: order.receipt,
      paymentStatus: "pending"
    });

    res.status(200).json({
      success: true,
      message: "Remaining payment order created",
      orderId: order.id,
      amount: remainingAmount,
      currency: "INR"
    });

  } catch (error) {
    console.error("Error creating remaining payment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id;

    if (!bookingId) {
      return res.status(400).json({ success: false, message: "Booking ID required" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking already cancelled" });
    }

    await workerModel.findOneAndUpdate(
      { userId: booking.workerId },
      { isFree: true }
    );


    // Get advance payment record
    const payment = await paymentModel.findOne({ bookingId, type: "advance", paymentStatus: "success" });
    if (!payment) {
      return res.status(400).json({ success: false, message: "No successful advance payment found" });
    }

    const advanceAmount = payment.amount;
    let workerShare = 0;
    let customerRefund = 0;

    const now = new Date();
    const acceptedTime = booking.startTime; // when booking was accepted
    const diffMinutes = (now - acceptedTime) / (1000 * 60);

    // Identify who is cancelling
    const isCustomer = booking.customerId.toString() === userId.toString();
    const isWorker = booking.workerId.toString() === userId.toString();

    if (!isCustomer && !isWorker) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
    }

    // 🔹 Worker Cancels → Full refund to customer
    if (isWorker) {
      workerShare = 0;
      customerRefund = advanceAmount;
    }

    // 🔹 Customer Cancels → Time-based split
    if (isCustomer) {
      if (diffMinutes <= 30) {
        workerShare = advanceAmount * 0.10;
        customerRefund = advanceAmount * 0.90;
      } else if (diffMinutes <= 60) {
        workerShare = advanceAmount * 0.20;
        customerRefund = advanceAmount * 0.80;
      } else {
        workerShare = 0;
        customerRefund = advanceAmount;
      }
    }

    // 💰 REFUND TO CUSTOMER
    if (customerRefund > 0) {
          await razorpayInstance.payments.refund(payment.razorpayPaymentId, {
            amount: Math.round(customerRefund * 100)
          });
        }

        // 💸 PAYOUT TO WORKER (only if share > 0)
    if (workerShare > 0) {
      // // 1️⃣ Get worker's bank details
      // const workerBank = await workerBankModel.findOne({ userId: booking.workerId });

      // if (!workerBank || !workerBank.razorpayFundAccountId) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Worker bank details not available for payout"
      //   });
      // }

      // // 2️⃣ Create payout to worker
      // const payout = await razorpayX.payouts.create({
      //   account_number: process.env.RAZORPAYX_ACCOUNT_NUMBER, // Your RazorpayX account number
      //   fund_account_id: workerBank.razorpayFundAccountId,
      //   amount: Math.round(workerShare * 100), // in paise
      //   currency: "INR",
      //   mode: "IMPS",
      //   purpose: "payout",
      //   queue_if_low_balance: true,
      //   reference_id: booking._id.toString(),
      //   narration: "WorkWiz cancellation compensation"
      // });

      // console.log("Worker payout successful:", payout.id);
      console.log(`${workerShare} This amount should be paid to the worker manually `);
    }


    booking.status = "cancelled";
    await booking.save();

    payment.paymentStatus = "refunded";
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled and refund processed",
      workerShare,
      customerRefund
    });

  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ success: false, message: "Server error during cancellation" });
  }
};

const getRequestedBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    /* ---------------- BUILD QUERY ---------------- */

    let query = { status: "requested" };

    if (role === "customer") {
      query.customerId = userId;
    } else if (role === "worker") {
      query.workerId = userId;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    /* ---------------- FETCH BOOKINGS ---------------- */

    const bookings = await Booking.find(query)
      .populate({
        path: role === "customer" ? "workerId" : "customerId",
        select: "_id",
      })
      .select("_id serviceType workerId customerId");

    if (!bookings.length) {
      return res.status(200).json({
        success: true,
        bookings: [],
      });
    }

    /* ---------------- COLLECT PROFILE IDS ---------------- */

    const otherUserIds = bookings.map((booking) =>
      role === "customer"
        ? booking.workerId?._id
        : booking.customerId?._id
    );

    /* ---------------- LOAD PROFILES IN ONE QUERY ---------------- */

    let profiles;
    let profileMap = {};

    if (role === "customer") {
      profiles = await workerModel.find({
        userId: { $in: otherUserIds },
      }).select("userId name");
    } else {
      profiles = await customerProfileModel.find({
        userId: { $in: otherUserIds },
      }).select("userId name");
    }

    profiles.forEach((profile) => {
      profileMap[profile.userId.toString()] = profile.name;
    });

    /* ---------------- FORMAT RESPONSE ---------------- */

    const formattedBookings = bookings.map((booking) => {
      const otherUser =
        role === "customer" ? booking.workerId : booking.customerId;

      const name =
        profileMap[otherUser?._id?.toString()] ||
        (role === "customer" ? "Unknown Worker" : "Unknown Customer");

      return {
        bookingId: booking._id,
        serviceType: booking.serviceType,

        ...(role === "customer"
          ? {
              workerId: otherUser?._id,
              workerName: name,
            }
          : {
              customerId: otherUser?._id,
              customerName: name,
            }),
      };
    });

    /* ---------------- RESPONSE ---------------- */

    res.status(200).json({
      success: true,
      bookings: formattedBookings,
    });
  } catch (error) {
    console.error("Get Requested Bookings Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch requested bookings",
    });
  }
};


export { createBookingRequest, createAdvancePayment, sendArrivalVerificationOtp, verifyArrivalOtpAndStartWork, sendWorkCompletionOtp, verifyCompletionOtpAndFinishWork, payRemainingAmount, cancelBooking, getRequestedBookings };
