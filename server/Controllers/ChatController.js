import chatModel from "../Models/ChatModel.js";
import Booking from "../Models/BookingModel.js";
import CustomerProfile from "../Models/CustomerProfileModel.js";
import Worker from "../Models/WorkerModel.js";

const getOrCreateChat = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      booking.customerId.toString() !== userId.toString() &&
      booking.workerId.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    let chat = await chatModel.findOne({ bookingId });

    if (!chat) {
      chat = await chatModel.create({
        bookingId,
        customerId: booking.customerId,
        workerId: booking.workerId,
      });
    }

    /* ✅ Fetch actual profile names */
    const customerProfile = await CustomerProfile.findOne({
      userId: chat.customerId,
    }).select("name");

    const workerProfile = await Worker.findOne({
      userId: chat.workerId,
    }).select("name");

    res.json({
      success: true,
      chat: {
        ...chat.toObject(),
        customer: customerProfile,
        worker: workerProfile,
      },
    });

  } catch (error) {
    console.error("Get/Create Chat Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getOrCreateChat };
