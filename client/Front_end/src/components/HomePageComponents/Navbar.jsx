import { useState } from "react";
import React from "react";
import { Wrench, Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice"; // import logout action

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get auth state from Redux
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    // Optionally remove token from localStorage
    localStorage.removeItem("token");
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo & Greeting */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-pink-200 rounded-md flex items-center justify-center">
            <Wrench className="text-pink-600" size={20} />
          </div>
          <div className="text-xl font-bold text-orange-500 flex items-center gap-2">
            WorkWiz
            <span className="text-gray-600 font-normal text-base">
              {isAuthenticated ? `Hi, ${user?.email?.split("@")[0]}` : "Welcome"}
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
          <li className="hover:text-gray-900 cursor-pointer">Home</li>
          <li className="hover:text-gray-900 cursor-pointer">Services</li>
          <li className="hover:text-gray-900 cursor-pointer">How It Works</li>
          <li className="hover:text-gray-900 cursor-pointer">Testimonials</li>
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-full bg-red-400 text-white font-medium hover:bg-red-500 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 rounded-full bg-pink-400 text-white font-medium hover:bg-pink-500 transition"
            >
              Signup
            </button>

          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-4">
          <ul className="flex flex-col gap-4 text-gray-600 font-medium mb-4">
            <li className="hover:text-gray-900 cursor-pointer">Home</li>
            <li className="hover:text-gray-900 cursor-pointer">Services</li>
            <li className="hover:text-gray-900 cursor-pointer">How It Works</li>
            <li className="hover:text-gray-900 cursor-pointer">Testimonials</li>
          </ul>

          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 rounded-full bg-red-400 text-white font-medium hover:bg-red-500 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2 rounded-full bg-pink-400 text-white font-medium hover:bg-pink-500 transition"
              >
                Signup
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
