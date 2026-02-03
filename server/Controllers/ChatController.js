import chatModel from "../Models/ChatModel.js";
import Booking from  "../Models/BookingModel.js";


 const getOrCreateChat = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user._id; // from auth middleware

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Allow only booked customer or worker
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

    res.json({ success: true, chat });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getOrCreateChat }