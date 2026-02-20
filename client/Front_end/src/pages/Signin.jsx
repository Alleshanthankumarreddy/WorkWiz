import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGoogleLogin } from "@react-oauth/google";
import { setCredentials } from "../redux/slices/authSlice";
import { jwtDecode } from "jwt-decode";
import { setBookings } from "../redux/slices/bookingSlice";
import { generateToken } from "../notifications/firebase";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Key,
  UserCircle,
  Briefcase,
} from "lucide-react";

function Signin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "customer",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const bookings = useSelector((state) => state.bookings.bookings);

console.log("Redux bookings:", bookings);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fcmToken= await generateToken();
      
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/signin",
        {
          email: form.email,
          password: form.password,
          role: form.role,
          fcmToken
        }
      );

      if (!data.success) {
        throw new Error(data.message || "Signin failed");
      }
      // ✅ Save auth data to Redux (this also stores token in localStorage)
      dispatch(setCredentials({ token: data.token }));

      // ✅ Optional: store full user object if you want later
      localStorage.setItem("user", JSON.stringify(data.user));

      try {
        const bookingsRes = await axios.post(
          "http://localhost:5000/api/booking/getRequestedBookings",
          {role: data.user.role},
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (bookingsRes.data.success) {
          dispatch(setBookings(bookingsRes.data.bookings));
        }
      } catch (err) {
        console.error("Booking fetch failed", err);
      }

      // ✅ Navigate based on role
      if (data.role === "customer") {
        navigate("/customerHomepPage");
      } else {
        navigate("/workerHomePage");
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "Signin failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };



const googleSignin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      setIsLoading(true);

      const fcmToken = await generateToken();

      const res = await axios.post(
        "http://localhost:5000/api/auth/googlesignin",
        {
          token: tokenResponse.id_token,
          role: form.role,
          fcmToken // 🔥 important
        }
      );

      if (!res.data.success) {
        throw new Error(res.data.message);
      }

      // ✅ Save token
      dispatch(setCredentials({ token: res.data.token }));
      localStorage.setItem("user", JSON.stringify(res.data.user));
      try {
        const bookingsRes = await axios.post(
          "http://localhost:5000/api/booking/getRequestedBookings",
          {role : data.user.role},
          {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          }
        );

        if (bookingsRes.data.success) {
          dispatch(setBookings(bookingsRes.data.bookings));
        }
      } catch (err) {
        console.error("Booking fetch failed", err);
      }

      // ✅ Navigate by role
      if (res.data.role === "customer") {
        navigate("/customerHomePage");
      } else {
        navigate("/workerHomePage");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Google signin failed");
    } finally {
      setIsLoading(false);
    }
  },

  onError: () => {
    setIsLoading(false);
    alert("Google signin failed");
  },

  flow: "implicit", // ensures id_token
});

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#F9F7F7" }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div
              className="flex items-center justify-center w-20 h-20 rounded-2xl shadow-lg"
              style={{ backgroundColor: "#112D4E" }}
            >
              <Key className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-2 text-[#112D4E]">
            Welcome to <span className="text-[#3F72AF]">WorkWiz</span>
          </h1>

          <p className="text-lg text-[#3F72AF]">
            Sign in to access your account
          </p>
        </div>
        

        {/* Main Card */}
        <div className="rounded-2xl shadow-xl p-8 space-y-6 mt-6 bg-[#DBE2EF]">
          <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selector */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
              Sign in as
            </label>
            <div className="flex gap-4">
              {[
                { value: "customer", icon: UserCircle, label: "👤 Customer" },
                { value: "worker", icon: Briefcase, label: "🔧 Worker" }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleRoleChange(option.value)}
                  className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                    form.role === option.value
                      ? "border-white shadow-lg transform scale-[1.02]"
                      : "border-transparent hover:border-white/50"
                  }`}
                  style={{
                    backgroundColor:
                      form.role === option.value ? "#3F72AF" : "#F9F7F7",
                    color:
                      form.role === option.value ? "#F9F7F7" : "#112D4E",
                  }}
                >
                  {option.label}
                </button>

              ))}
            </div>
          </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#112D4E] mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F72AF]" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 py-4 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3F72AF]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-[#112D4E]">
                  Password
                </label>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F72AF]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#3F72AF]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3F72AF]"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !form.email || !form.password}
              className="w-full py-4 rounded-xl font-bold text-white bg-[#112D4E] flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? "Signing In..." : <>Sign In <ArrowRight /></>}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#3F72AF]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-[#DBE2EF] text-[#112D4E]">
                  Or continue with
                </span>
              </div>
            </div>

            {/* ✅ Google Sign-in Button */}
            <button
              type="button"
              onClick={() => googleSignin()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "#F9F7F7",
                color: "#112D4E",
                border: "2px solid #3F72AF",
              }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
