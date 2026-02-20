import React, { useState } from "react";
import axios from "axios";
import {
  Mail,
  Lock,
  Briefcase,
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  Eye,
  EyeOff,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../redux/slices/authSlice";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("customer");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ---------------- SEND OTP ---------------- */
  const sendOtp = async () => {
    if (!email) return alert("Enter email");

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/sendotp", { email });
      setStep(2);
      alert("OTP sent to your email");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- EMAIL SIGNUP ---------------- */
  const signupWithEmail = async () => {
    if (otp.join("").length !== 6 || !password) {
      return alert("Enter valid OTP and password");
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        otp: otp.join(""),
        password,
        role,
      });

      const { token, role: userRole, user } = res.data;

      dispatch(setCredentials({ user, token, role: userRole }));
      alert("Signup successful 🎉");
      if (userRole === "customer") {
        navigate("/customerprofilesetup");
      } else if (userRole === "worker") {
        navigate("/workerprofilesetup");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GOOGLE SIGNUP ---------------- */
  const googleSignup = async (credential) => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        {
          token: credential,
          role,
        }
      );

      const { token, role: userRole, user } = res.data;
      dispatch(setCredentials({ user, token, role: userRole }));
      if (userRole === "customer") {
        navigate("/customerprofilesetup");
      } else if (userRole === "worker") {
        navigate("/workerprofilesetup");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OTP INPUT HANDLERS ---------------- */
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F9F7F7]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-[#112D4E] flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-[#112D4E]">
            Work<span className="text-[#3F72AF]">Wiz</span>
          </h1>
          <p className="text-[#3F72AF] mt-2">Join thousands of professionals</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl shadow-xl p-8 space-y-6 bg-[#DBE2EF]">
          {/* Features */}
          <div className="flex justify-center gap-3">
            {[Zap, Shield, Sparkles].map((Icon, i) => (
              <span
                key={i}
                className="flex font-bold items-center gap-2 px-3 py-2 rounded-full bg-[#F9F7F7] text-[#3F72AF] text-sm"
              >
                <Icon className="w-4 h-4" /> {["Fast", "Secure", "Premium"][i]}
              </span>
            ))}
          </div>
          
          {/* Role selector */}
          <div>
            <h1 className="text font-semibold text-[#112D4E]">
              Create account as a
            </h1>
            <div className="flex gap-4 mt-3">
              {["customer", "worker"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  type="button"
                  className={`flex-1 py-4 rounded-xl font-semibold border-2 transition ${
                    role === r
                      ? "bg-[#3F72AF] text-white border-white"
                      : "bg-[#F9F7F7] text-[#112D4E]"
                  }`}
                >
                  {r === "customer" ? "👤 Customer" : "🔧 Worker"}
                </button>
              ))}
            </div>
          </div>

          

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F72AF]" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 py-4 rounded-xl bg-white"
                />
              </div>

              <button
                onClick={sendOtp}
                disabled={loading || !email}
                className="w-full py-4 rounded-xl bg-[#3F72AF] text-white font-bold"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={(res) => googleSignup(res.credential)}
                  onError={() => alert("Google signup failed")}
                />
              </div>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-[#3F72AF]"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <div className="flex justify-between gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    value={digit}
                    maxLength="1"
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-12 h-12 text-center text-xl rounded-xl bg-white"
                  />
                ))}
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F72AF]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              <button
                onClick={signupWithEmail}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#112D4E] text-white font-bold"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
