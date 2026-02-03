import Booking from "../Models/BookingModel.js";
import workerModel from "../Models/WorkerModel.js";
import userModel from "../Models/UserModel.js";
import paymentModel from "../Models/PaymentModel.js";
import razorpayInstance from "../Config/razorpay.js";
import otpModel from "../Models/OtpModel.js";

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
  // Correct mapping from frontend fields
  const { workerEmail, serviceType, expectedTime, serviceAddress } = req.body;

  const customerId = req.user._id;
  try {
    // 1️⃣ Validate fields
    if (!workerEmail || !customerId || !serviceType || !expectedTime || !serviceAddress) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const { fullAddress, city, pincode, landmark, state, lat, lng } = serviceAddress;

    // 2️⃣ Validate address fields
    if (!fullAddress || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Address, city and pincode are required"
      });
    }


    // 2️⃣ Check customer exists
    const customer = await userModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    // 3️⃣ Find worker using email
    const worker = await userModel.findOne({ email: workerEmail });
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    if (worker.isFree) {
      return res.status(404).json({
        success: false,
        message: "Worker is not available currently"
      });
    }

    // 4️⃣ Create booking
    const booking = new Booking({
      customerId,
      workerId: worker._id,
      serviceType,
      startTime: new Date(expectedTime),
      status: "requested",

      serviceAddress: {
        fullAddress,
        landmark,
        city,
        state,
        pincode,
        location: {
          lat,
          lng
        }
      }
    });

    await booking.save();

    return res.status(201).json({
      success: true,
      message: "Booking request sent successfully",
      booking
    });

  } catch (error) {
    console.error("Booking Step 1 Error:", error);
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
    
    // 4️⃣ Decide advance amount (30%)
    const advanceAmount = Math.round(totalAmount * 0.2);

    // 3️⃣ Update booking details
    booking.totalAmount = totalAmount;
    booking.description = description; // ✅ added properly
    booking.startTime = new Date(startTime);
    booking.remainingAmount = totalAmount - advanceAmount;
    booking.status = "accepted"
    await booking.save();

    

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

const  sendArrivalVerificationOtp = async (req, res) => {
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

export { createBookingRequest, createAdvancePayment, sendArrivalVerificationOtp, verifyArrivalOtpAndStartWork, sendWorkCompletionOtp, verifyCompletionOtpAndFinishWork };
