import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
{
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  workerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  // 🛠 Service Category
  serviceType: { 
    type: String, 
    trim: true 
  },

  // 📝 Detailed problem/work explanation
  description: {
    type: String,
    trim: true
  },

  // ⏰ Time (decided after discussion)
  startTime: { type: Date },
  endTime: { type: Date },

  // 💰 Pricing (decided in chat)
  totalAmount: { type: Number, min: 0 },

  // 💵 Payment Tracking
  advancePaid: { type: Number, default: 0 },
  remainingAmount: { type: Number, default: 0 },

  // 📌 Booking Status Flow
  status: {
    type: String,
    enum: [
      "requested",
      "accepted",
      "in_progress",
      "work_done",
      "cancelled"
    ],
    default: "requested"
  },

  // 📍 Service Location
  serviceAddress: {
    fullAddress: { type: String, required: true },
    landmark: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    pincode: { type: String, required: true },

    // For maps & distance calculation later
    location: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },


}, { timestamps: true });

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
export default Booking;
