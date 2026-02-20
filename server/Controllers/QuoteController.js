import Booking from "../Models/BookingModel.js";
import QuoteModel from "../Models/QuoteModel.js";
import messageModel from "../Models/MessageModel.js";
import chatModel from "../Models/ChatModel.js";

const createQuote = async (req, res) => {
  try {
    const io = req.app.get("io");
    const { bookingId, description, totalAmount, startTime } = req.body;

    if (!bookingId || !description || !totalAmount || !startTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.workerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to create quote" });
    }

    // ✅ Create the quote
    const quote = await QuoteModel.create({
      bookingId,
      workerId: booking.workerId,
      customerId: booking.customerId,
      description,
      totalAmount: Number(totalAmount),
      startTime: new Date(startTime),
    });

    res.json({ success: true, quote });
  } catch (error) {
    console.error("CreateQuote Error:", error);
    res.status(500).json({ success: false, message: "Quote creation failed" });
  }
};

const handleQuoteResponse = async (req, res) => {
  try {
    const io = req.app.get("io");
    const { quoteId, action } = req.body;

    if (!quoteId || !["accept", "reject"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    const quote = await QuoteModel.findById(quoteId);

    if (!quote) {
      return res.status(404).json({ success: false, message: "Quote not found" });
    }

    if (quote.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    /* ✅ GET CHAT USING bookingId (THIS IS THE REAL FIX) */

    const chat = await chatModel.findOne({ bookingId: quote.bookingId });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found for booking",
      });
    }

    /* ✅ UPDATE QUOTE STATUS */

    quote.status = action === "accept" ? "accepted" : "rejected";
    await quote.save();

    /* ✅ BUILD MESSAGE */

    // const messageText =
    //   action === "accept"
    //     ? `✅ Your quote was ACCEPTED by customer`
    //     : `❌ Your quote was REJECTED by customer\n\n` +
    //       `🛠 Service: ${quote.description}\n` +
    //       `💰 Amount: ₹${quote.totalAmount}\n` +
    //       `⏰ Start Time: ${new Date(quote.startTime).toLocaleString()}`;
const workerMessage =
  action === "accept"
    ? `✅ Your quote was ACCEPTED by customer`
    : `❌ Your quote was REJECTED by customer`;

const customerMessage =
  action === "accept"
    ? `✅ You ACCEPTED the quote`
    : `❌ You REJECTED the quote`;

    /* ✅ SAVE MESSAGE (chatId NOW VALID) */

    // const savedMessage = await messageModel.create({
    //   chatId: chat._id,
    //   senderId: req.user._id,
    //   senderType: "customer",
    //   messageText,
    //   sentAt: new Date(),
    // });

    const workerMsgDoc = await messageModel.create({
  chatId: chat._id,
  senderId: req.user._id,
  senderType: "customer",
  messageText: workerMessage,
  sentAt: new Date(),
});

const customerMsgDoc = await messageModel.create({
  chatId: chat._id,
  senderId: req.user._id,
  senderType: "customer",
  messageText: customerMessage,
  sentAt: new Date(),
});


    /* ✅ SOCKET EVENTS */

    // io.to(quote.bookingId.toString()).emit("receive_message", {
    //   ...savedMessage.toObject(),
    // });

    // io.to(quote.bookingId.toString()).emit("quote_response", {
    //   quoteId,
    //   status: quote.status,
    // });

    const workerRoom = quote.workerId.toString();
const customerRoom = quote.customerId.toString();

/* ✅ PRIVATE EVENTS */

io.to(workerRoom).emit("receive_message", workerMsgDoc);
io.to(customerRoom).emit("receive_message", customerMsgDoc);

/* ✅ Quote status sync */

io.to(workerRoom).emit("quote_response", {
  quoteId,
  status: quote.status,
});

io.to(customerRoom).emit("quote_response", {
  quoteId,
  status: quote.status,
});

    res.json({
      success: true,
      status: quote.status,
    });

  } catch (error) {
    console.error("handleQuoteResponse Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to respond to quote",
    });
  }
};

const getQuoteById = async (req, res) => {
  try {
    const { quoteId } = req.params;

    if (!quoteId) {
      return res.status(400).json({
        success: false,
        message: "quoteId is required",
      });
    }

    const quote = await QuoteModel.findById(quoteId);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: "Quote not found",
      });
    }

    res.json({
      success: true,
      quote,
    });

  } catch (error) {
    console.error("GetQuoteById Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch quote",
    });
  }
};


export { createQuote, getQuoteById, handleQuoteResponse };
