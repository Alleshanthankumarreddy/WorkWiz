import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import { generateToken } from "../notifications/firebase";
import React from "react";
import { setFcmToken } from "../redux/slices/notificationSlice";
import {
  Mail,
  Lock,
  UserCircle,
  Briefcase,
  LogIn,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import axios from "axios";

export default function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "customer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/auth/signin",
      {
        email: form.email,
        password: form.password,
        role: form.role,
      }
    );

    if (data.success) {
      dispatch(setCredentials({ user: data.user, token: data.token, role: data.role }));

      // 🔔 Ask notification permission AFTER login
      const fcmToken = await generateToken();

      if (fcmToken) {
        // ✅ Store in Redux (which also saves to localStorage)
        dispatch(setFcmToken(fcmToken));

        await axios.post(
          "http://localhost:5000/api/notifications/save-token",
          { fcmToken },
          { headers: { Authorization: `Bearer ${data.token}` } }
        );
      }

      alert("Login successful 🎉");

      if (data.role === "worker") navigate("/worker/dashboard");
      else navigate("/customer/home");
    }
  } catch (error) {
    alert(error.response?.data?.message || "Server error");
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      {/* Card */}
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-md p-6 rounded-3xl shadow-2xl border border-white/20 z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-3 shadow-lg">
            <Sparkles className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Sign in to continue to{" "}
            <span className="font-semibold text-indigo-600">WorkWiz</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Email Address
            </label>
            <div className="flex items-center bg-gradient-to-r from-gray-50 to-white rounded-xl px-4 py-2.5 border border-gray-200 group-focus-within:border-indigo-500 group-focus-within:ring-2 group-focus-within:ring-indigo-500/20 transition">
              <Mail className="text-gray-400 mr-3" size={18} />
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">
              Password
            </label>
            <div className="flex items-center bg-gradient-to-r from-gray-50 to-white rounded-xl px-4 py-2.5 border border-gray-200 group-focus-within:border-indigo-500 group-focus-within:ring-2 group-focus-within:ring-indigo-500/20 transition">
              <Lock className="text-gray-400 mr-3" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-sm tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-indigo-500 transition p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
              Sign in as
            </label>
            <div className="flex gap-3">
              <label
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl cursor-pointer border-2 transition ${
                  form.role === "customer"
                    ? "bg-indigo-50 border-indigo-500 shadow-sm"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <UserCircle size={20} />
                Customer
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={form.role === "customer"}
                  onChange={handleChange}
                  className="hidden"
                />
              </label>

              <label
                className={`flex-1 flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl cursor-pointer border-2 transition ${
                  form.role === "worker"
                    ? "bg-purple-50 border-purple-500 shadow-sm"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Briefcase size={20} />
                Worker
                <input
                  type="radio"
                  name="role"
                  value="worker"
                  checked={form.role === "worker"}
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
