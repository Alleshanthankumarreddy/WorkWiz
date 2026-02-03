import { useState } from "react";
import React from "react";
import axios from "axios";
import {
  User,
  Phone,
  MapPin,
  Building2,
  Home,
  Hash,
  Save,
} from "lucide-react";

export default function CustomerProfileDetails() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.post(
        "http://localhost:5000/api/customer/createCustomerProfile",
        {
          name: form.name,
          phone: form.phone,
          address: {
            street: form.street,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(data.message);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white w-full max-w-2xl p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Tell us a bit about yourself
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="label">Full Name</label>
            <div className="input">
              <User size={18} className="icon" />
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="label">Phone Number</label>
            <div className="input">
              <Phone size={18} className="icon" />
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin size={16} /> Address Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="label">Street</label>
                <div className="input">
                  <Home size={18} className="icon" />
                  <input
                    type="text"
                    name="street"
                    placeholder="Street / Area"
                    value={form.street}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">City</label>
                <div className="input">
                  <Building2 size={18} className="icon" />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">State</label>
                <div className="input">
                  <Building2 size={18} className="icon" />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={form.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Pincode</label>
                <div className="input">
                  <Hash size={18} className="icon" />
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Saving..." : <><Save size={18} /> Save Profile</>}
          </button>
        </form>
      </div>

      {/* Tailwind reusable styles */}
      <style jsx>{`
        .label {
          @apply block text-sm font-medium text-gray-700 mb-1;
        }
        .input {
          @apply flex items-center bg-gray-100 rounded-lg px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500;
        }
        .input input {
          @apply bg-transparent outline-none w-full text-sm;
        }
        .icon {
          @apply text-gray-500 mr-2;
        }
      `}</style>
    </div>
  );
}
