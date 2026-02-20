import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000/api";

const CreateQuoteForm = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();  

  const [formData, setFormData] = useState({
    workDescription: "",
    startDate: "",
    startTime: "",
    totalAmount: "",
  });

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const startTimeISO = new Date(
        `${formData.startDate}T${formData.startTime}`
      ).toISOString();  // ✅ Proper date

      const payload = {
        bookingId,
        description: formData.workDescription,   // ✅ MATCH BACKEND
        totalAmount: Number(formData.totalAmount),
        startTime: startTimeISO,
      };

      const res = await axios.post(
        `${API_BASE}/quote/createQuote`,
        payload,
        getAuthHeader()
      );

      alert("Quote created & sent!");
      navigate(-1); // go back to chat

    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Quote creation failed");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#F9F7F7]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Create Quote</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          <textarea
            name="workDescription"
            value={formData.workDescription}
            onChange={handleInputChange}
            required
            placeholder="Describe the work..."
            className="w-full border p-3 rounded-xl"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="date"
              name="startDate"
              min={today}
              required
              onChange={handleInputChange}
              className="border p-3 rounded-xl"
            />

            <input
              type="time"
              name="startTime"
              required
              onChange={handleInputChange}
              className="border p-3 rounded-xl"
            />
          </div>

          <input
            type="number"
            name="totalAmount"
            min="1"
            required
            placeholder="Total Amount"
            onChange={handleInputChange}
            className="w-full border p-3 rounded-xl"
          />

          <button className="w-full bg-[#112D4E] text-white p-3 rounded-xl">
            Create & Send Quote
          </button>

        </form>
      </div>
    </div>
  );
};

export default CreateQuoteForm;
