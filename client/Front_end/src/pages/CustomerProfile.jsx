import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Edit3,
  Save,
  X,
} from "lucide-react";

export default function CustomerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/customer/getCustomerProfile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(data.profile);
      setForm({
        name: data.profile.name,
        phone: data.profile.phone,
        street: data.profile.address.street,
        city: data.profile.address.city,
        state: data.profile.address.state,
        pincode: data.profile.address.pincode,
      });
    } catch (err) {
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/customer/updateCustomerProfile",
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(data.message);
      setEditMode(false);
      fetchProfile();
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center mt-20 text-red-500">Profile not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700"
            >
              <Edit3 size={18} /> Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setEditMode(false)}
              className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-xl hover:bg-gray-500"
            >
              <X size={18} /> Cancel
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <ProfileField
            icon={<User size={18} />}
            label="Full Name"
            name="name"
            value={form.name}
            editMode={editMode}
            onChange={handleChange}
          />

          {/* Email (read only) */}
          <ProfileField
            icon={<Mail size={18} />}
            label="Email"
            value={profile.userId.email}
            editMode={false}
          />

          {/* Phone */}
          <ProfileField
            icon={<Phone size={18} />}
            label="Phone"
            name="phone"
            value={form.phone}
            editMode={editMode}
            onChange={handleChange}
          />

          {/* Street */}
          <ProfileField
            icon={<MapPin size={18} />}
            label="Street"
            name="street"
            value={form.street}
            editMode={editMode}
            onChange={handleChange}
          />

          <ProfileField
            icon={<MapPin size={18} />}
            label="City"
            name="city"
            value={form.city}
            editMode={editMode}
            onChange={handleChange}
          />

          <ProfileField
            icon={<MapPin size={18} />}
            label="State"
            name="state"
            value={form.state}
            editMode={editMode}
            onChange={handleChange}
          />

          <ProfileField
            icon={<MapPin size={18} />}
            label="Pincode"
            name="pincode"
            value={form.pincode}
            editMode={editMode}
            onChange={handleChange}
          />
        </div>

        {editMode && (
          <button
            onClick={handleUpdate}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
          >
            <Save size={18} /> Save Changes
          </button>
        )}
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value, editMode, name, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 mt-1">
        {icon}
        {editMode ? (
          <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            className="bg-transparent outline-none w-full text-sm"
          />
        ) : (
          <span className="text-gray-800 text-sm">{value}</span>
        )}
      </div>
    </div>
  );
}
