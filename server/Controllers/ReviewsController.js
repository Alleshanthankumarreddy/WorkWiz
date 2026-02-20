import reviewModel from "../Models/ReviewsModel.js";
import userModel from "../Models/UserModel.js";
import Booking from "../Models/BookingModel.js";

const createReview = async (req, res) => {
  try {
    const { workerEmail, bookingId, rating, reviewText } = req.body;
    const customerId = req.user._id; // from auth middleware

    // Validate input
    if (!workerEmail || !bookingId || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find the worker by email and ensure role is "worker"
    const worker = await userModel.findOne({ email: workerEmail, role: "worker" });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Check if booking exists and belongs to this customer
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.customerId.toString() !== customerId.toString()) {
      return res.status(403).json({ message: "You cannot review this booking" });
    }

    // Check if a review already exists for this booking
    const existingReview = await reviewModel.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({ message: "Review for this booking already exists" });
    }

    // Create the review
    const review = await reviewModel.create({
      bookingId,
      customerId,
      workerId: worker._id, // worker's userId
      rating,
      reviewText,
    });

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAverageRating = async (req, res) => {
  try {
    const { workerEmail } = req.params; // or req.params if sent via URL

    if (!workerEmail) {
      return res.status(400).json({ message: "Worker email is required" });
    }

    // Find the worker's userId
    const workerUser = await userModel.findOne({ email: workerEmail, role: "worker" });
    if (!workerUser) {
      return res.status(404).json({ message: "Worker not found" });
    }

    // Find the worker in workerModel
    const worker = await workerModel.findOne({ userId: workerUser._id });
    if (!worker) {
      return res.status(404).json({ message: "Worker profile not found" });
    }

    // Aggregate reviews to calculate average rating
    const result = await reviewModel.aggregate([
      { $match: { workerId: worker._id } },
      { $group: { _id: "$workerId", avgRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } }
    ]);

    let avgRating = 0;
    let totalReviews = 0;

    if (result.length > 0) {
      avgRating = result[0].avgRating;
      totalReviews = result[0].totalReviews;

      // Optional: Update the worker's average rating in workerModel
      worker.ratingAvg = avgRating;
      await worker.save();
    }

    res.status(200).json({
      workerEmail,
      averageRating: avgRating,
      totalReviews
    });
  } catch (error) {
    console.error("Error calculating average rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getWorkerReviews = async (req, res) => {
  try {
    const { workerId } = req.body; // This is User._id

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "workerId is required",
      });
    }

    const reviews = await reviewModel
      .find({ workerId })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    return res.status(200).json({
      success: true,
      reviews,
    });

  } catch (error) {
    console.error("getWorkerReviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export { createReview, getAverageRating, getWorkerReviews };
