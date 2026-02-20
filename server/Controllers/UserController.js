import userModel from "../Models/UserModel.js";
import Booking from "../Models/BookingModel.js";
import workerModel from "../Models/WorkerModel.js";
import customerProfileModel from "../Models/CustomerProfileModel.js";

 const joinedDate = async (req, res) => {
  try {
    const { role } = req.body;

    const userId = req.user._id;

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const user = await userModel.findOne({
      _id: userId,
      role: role,
    }).select("createdAt role email");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found for this role",
      });
    }

    const joinDate = user.createdAt;

    const joinDateFormatted = joinDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    return res.status(200).json({
      success: true,
      role: user.role,              
      joinDate,                     
      joinDateFormatted,            
    });
  } catch (error) {
    console.error("Get user join date error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user join date",
    });
  }
};

const totalBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.body;

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // Decide filter key dynamically
    const filter =
      role === "customer"
        ? { customerId: userId }
        : role === "worker"
        ? { workerId: userId }
        : null;

    if (!filter) {
      return res.status(400).json({
        success: false,
        message: "Invalid user role",
      });
    }

    const bookings = await Booking.find({
      ...filter,
      status: "work_done",
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      role,
      bookings,
      totalBookings: bookings.length,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

const recentActivity = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.body; // "customer" | "worker"

    if (!userId || !role) {
      return res.status(400).json({
        success: false,
        message: "User ID or role missing",
      });
    }

    // 🔹 Filter bookings based on role
    const filter =
      role === "customer"
        ? { customerId: userId }
        : { workerId: userId };

    // 🔹 Fetch latest 3 bookings
    const bookings = await Booking.find(filter)
      .sort({ updatedAt: -1 })
      .limit(3);

    // 🔹 Collect IDs for name resolution
    const workerUserIds = bookings.map(b => b.workerId);
    const customerUserIds = bookings.map(b => b.customerId);

    // 🔹 Fetch worker names
    const workers = await workerModel.find({
      userId: { $in: workerUserIds }
    }).select("userId name");

    const workerMap = {};
    workers.forEach(w => {
      workerMap[w.userId.toString()] = w.name;
    });

    // 🔹 Fetch customer names
    const customers = await customerProfileModel.find({
      userId: { $in: customerUserIds }
    }).select("userId name");

    const customerMap = {};
    customers.forEach(c => {
      customerMap[c.userId.toString()] = c.name;
    });

    // 🔹 Build recent activity messages
    const activities = bookings.map((booking) => {
      const workerName =
        workerMap[booking.workerId?.toString()] || "the worker";

      const customerName =
        customerMap[booking.customerId?.toString()] || "the customer";

      let message = "";

      switch (booking.status) {
        case "requested":
          message =
            role === "customer"
              ? `You requested a service from ${workerName}`
              : `You received a service request from ${customerName}`;
          break;

        case "accepted":
          message =
            role === "customer"
              ? `${workerName} accepted your service request`
              : `You accepted a service request from ${customerName}`;
          break;

        case "in_progress":
          message =
            role === "customer"
              ? `Service is in progress with ${workerName}`
              : `You are working on a service for ${customerName}`;
          break;

        case "work_done":
          message =
            role === "customer"
              ? `You received the service from ${workerName} successfully`
              : `You have successfully completed the service for ${customerName}`;
          break;

        case "cancelled":
          message =
            role === "customer"
              ? `Your service request was cancelled`
              : `A service was cancelled`;
          break;

        default:
          message = "Booking activity updated";
      }

      return {
        bookingId: booking._id,
        status: booking.status,
        message,
        date: booking.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("Recent activity error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent activity",
    });
  }
};


export { joinedDate, totalBookings, recentActivity}