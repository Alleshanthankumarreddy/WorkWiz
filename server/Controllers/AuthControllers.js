import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../Models/UserModel.js";
import otpModel from "../Models/OtpModel.js";
import nodemailer from "nodemailer";
import { sendPushNotification } from "../Utils/sendPushNotification.js";

import { OAuth2Client } from "google-auth-library";

const signup = async (req, res) => {
  try {
    const { email, otp, password, role } = req.body;

    // 1️⃣ Validate role
    if (!["customer", "worker"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // 3️⃣ Find OTP record
    const otpRecord = await otpModel.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or invalid"
      });
    }

    // 4️⃣ Check OTP expiry
    if (otpRecord.expiresAt < Date.now()) {
      await otpModel.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    // 5️⃣ Verify OTP
    const isOtpValid = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // 6️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7️⃣ Create USER and store FCM token
    const user = await userModel.create({
      email,
      password: hashedPassword,
      role,
      isVerified: true,
    });

    // 8️⃣ Delete OTP
    await otpModel.deleteOne({ email });

    // 9️⃣ Generate JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    return res.status(201).json({
        success: true,
        message: "Signup successful",
        token,
        role: user.role,
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
        profileCompleted: false
      });


  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Signup is failed"
    });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  try {
    const { token, role} = req.body;

    // ✅ Validate role
    if (!["customer", "worker"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    // ✅ Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, sub: googleId } = payload;

    // ✅ Find or create user
    let user = await userModel.findOne({ email });

    if (!user) {
      user = await userModel.create({
        email,
        googleId,
        role,
        isVerified: true,
        isProfileCompleted: false,
      });
    } else {
      // Prevent role switching
      if (user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `This email is already registered as ${user.role}`,
        });
      }
    }

    // ✅ Generate JWT
    const jwtToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );



    // ✅ Send full response including user info
    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      token: jwtToken,
      role: user.role,
      profileCompleted: user.isProfileCompleted,
      user: { email: user.email, role: user.role, isProfileCompleted: user.isProfileCompleted },
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({
      success: false,
      message: "Google authentication failed",
    });
  }
};


const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please login."
      });
    }

    // 3️⃣ Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 4️⃣ Hash OTP
    const otpHash = await bcrypt.hash(otp, 10);

    // 5️⃣ Remove old OTP if exists
    await otpModel.deleteMany({ email });

    // 6️⃣ Store OTP with expiry (5 minutes)
    await otpModel.create({
      email,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    });

    // 7️⃣ Send OTP via email
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
      subject: "Your WorkWiz OTP",
      html: `
        <h2>WorkWiz Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `
    });

    // ✅ Success response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Email, password, and role are required",
      });
    }

    if (!["customer", "worker"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please signup.",
      });
    }

    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This email is registered as ${user.role}`,
      });
    }

    if (user.googleId) {
      return res.status(400).json({
        success: false,
        message: "Please login using Google",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }



    await user.save();



    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );



    // ✅ Send the full user object to the frontend
    const userForFrontend = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isProfileCompleted: user.isProfileCompleted,
    };

    return res.status(200).json({
      success: true,
      message: "Signin successful",
      token,
      role: user.role,
      user: userForFrontend, // 🔥 send user
      profileCompleted: user.isProfileCompleted,
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      success: false,
      message: "Signin failed",
    });
  }
};



export { signup, googleAuth, sendOtp, signin }
