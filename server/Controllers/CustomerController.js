import CustomerProfile from "../Models/CustomerProfileModel.js";
import Booking from "../Models/BookingModel.js";
import userModel from "../Models/UserModel.js";
import workerModel from "../Models/WorkerModel.js";
import workerAddressModel from "../Models/WorkerAddressModel.js";

const createCustomerProfile= async (req, res) => {
  try {
    const { name, phone, address, location } = req.body;

    if (!name || !phone || !address || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const { street, city, state, pincode } = address;
    const { latitude, longitude } = location;

    if (!street || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Complete address is required",
      });
    }

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const userId = req.user._id;

    let profile = await CustomerProfile.findOne({ userId });

    if (profile) {
      profile.name = name;
      profile.phone = phone;
      profile.address = { street, city, state, pincode };

      await profile.save();

      return res.status(200).json({
        success: true,
        message: "Customer profile updated successfully",
        profile,
      });
    }

    profile = await CustomerProfile.create({
      userId,
      name,
      phone,
      address: { street, city, state, pincode },
      location: { latitude, longitude },
    });

    res.status(201).json({
      success: true,
      message: "Customer profile created successfully",
      profile,
    });
  } catch (error) {
    console.error("Error saving customer profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getCustomerProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const profile = await CustomerProfile.findOne({ userId }).populate(
      "userId",
      "email"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateCustomerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, address } = req.body;

    const updatedProfile = await CustomerProfile.findOneAndUpdate(
      { userId },
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address })
      },
      {
        new: true,      
        runValidators: false 
      }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Customer profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer profile updated successfully",
      profile: updatedProfile,
    });

  } catch (error) {
    console.error("Error updating customer profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getWorkerProfiles = async (req, res) => {
  try {
    const userId = req.user._id;

    /* -------- VERIFY USER EXISTS -------- */

    const user = await userModel.findById(userId).select("_id role");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found or unauthorized"
      });
    }

    /* -------- FETCH APPROVED WORKERS -------- */

    const workers = await workerModel.find({ approved: true })
  .populate("userId", "email")   // ✅ THIS IS THE FIX
  .select(
    "userId name serviceName ratingAvg totalJobsCompleted experienceYears profilePhoto isFree skills"
  )
  .lean();


    const formattedWorkers = workers.map(worker => ({
      userId: worker.userId,

      name: worker.name,
      serviceName: worker.serviceName,

      rating: worker.ratingAvg,
      totalJobs: worker.totalJobsCompleted,

      experience: `${worker.experienceYears} years`,

      location: "Available in your area",

      isAvailable: worker.isFree,
      isVerified: true,

      skills: worker.skills || [],

      profilePhoto:
        worker.profilePhoto ||
        "https://via.placeholder.com/100?text=Worker",

      description: `${worker.serviceName} with ${worker.experienceYears} years of experience`
    }));

    res.status(200).json({
      success: true,
      workers: formattedWorkers
    });

  } catch (error) {
    console.error("Get Worker Profiles Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch workers"
    });
  }
};

const getWorkerProfile = async (req, res) => {
  try {
    const { workerId } = req.body;

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "workerId is required",
      });
    }
    /* ---------------- FETCH WORKER PROFILE ---------------- */

    const worker = await workerModel
      .findOne({userId : workerId})
      .populate("userId", "email");

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found",
      });
    }

    res.status(200).json({
      success: true,
      worker,
    });

  } catch (error) {
    console.error("Error fetching worker profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getWorkerAddress = async (req, res) => {
  try {
    const { workerId } = req.body; // This is User._id

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "workerId is required",
      });
    }

    /* ✅ DIRECT LOOKUP USING userId */

    const address = await workerAddressModel.findOne({
      userId: workerId
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      address,
    });

  } catch (error) {
    console.error("Get address error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




export { getCustomerProfile, createCustomerProfile, updateCustomerProfile, getWorkerProfiles, getWorkerProfile, getWorkerAddress }
