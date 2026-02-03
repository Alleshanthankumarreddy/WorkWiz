import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Mail,
  Lock,
  User,
  Briefcase,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

import OTPInput from "../components/SignupComponents/OTPinput";
import { generateToken } from "../notifications/firebase";
import { setCredentials } from "../redux/slices/authSlice";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const sendOtp = async () => {
    if (!email) return alert("Enter email");
    try {
      setLoading(true);
      await axios.post(`http://localhost:5000/api/auth/sendotp`, { email });
      setStep(2);
      alert("OTP sent to your email");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async () => {
  if (otp.length !== 6 || !password) {
    return alert("Enter valid OTP and password");
  }

  try {
    setLoading(true);

    const res = await axios.post(`http://localhost:5000/api/auth/signup`, {
      email,
      otp,
      password,
      role,
    });

    const { token, role: userRole, user } = res.data;

    // ✅ Save auth in Redux
    dispatch(setCredentials({ user, token, role: userRole }));
;

    alert("Signup successful 🎉");

    navigate("/");

  } catch (err) {
    console.error("Signup error:", err); // 👈 ADD THIS FOR DEBUGGING
    alert(err.response?.data?.message || "Signup failed");
  } finally {
    setLoading(false);
  }
};


  const googleSignup = async (credential) => {
    try {
      setLoading(true);

      const res = await axios.post(`http://localhost:5000/api/auth/google`, {
        token: credential,
        role,
      });

      const { token, role, user } = res.data;

      dispatch(setCredentials({ user, token, role }));


    } catch (err) {
      alert(err.response?.data?.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 relative">
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/30 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-white/80 backdrop-blur border border-gray-200 rounded-3xl shadow-xl p-8 space-y-6 z-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Work<span className="text-indigo-600">Wiz</span>
          </h1>
          <p className="text-sm text-gray-500">
            Create your account to get started
          </p>
        </div>

        <div className="flex justify-center gap-2 flex-wrap">
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium">
            <Zap className="w-3 h-3" /> Fast
          </span>
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <Shield className="w-3 h-3" /> Secure
          </span>
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-pink-100 text-pink-700 text-xs font-medium">
            <Sparkles className="w-3 h-3" /> Premium
          </span>
        </div>

        {/* Role Select */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Continue as
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full appearance-none bg-gray-50 border-2 border-gray-300 rounded-xl pl-12 pr-12 py-4 font-medium text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200"
            >
              <option value="customer">Customer</option>
              <option value="worker">Worker</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl pl-12 pr-4 py-4 text-gray-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200"
              />
            </div>

            <button
              onClick={sendOtp}
              disabled={loading || !email}
              className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <OTPInput length={6} value={otp} onChange={setOtp} />

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl pl-12 pr-4 py-4 text-gray-900 focus:border-green-500 focus:ring-4 focus:ring-green-200"
              />
            </div>

            <button
              onClick={signupWithEmail}
              disabled={loading || otp.length !== 6 || !password}
              className="w-full py-4 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="text-xs text-gray-500 uppercase">or</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={(res) => googleSignup(res.credential)}
            onError={() => alert("Google Login Failed")}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
