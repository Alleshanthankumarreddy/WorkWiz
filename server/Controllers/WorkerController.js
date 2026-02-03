import Worker from "../Models/WorkerModel.js";
import WorkerAddress from "../Models/WorkerAddressModel.js";
import WorkerDocument from "../Models/WorkerDocumentModel.js";

const createWorkerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phoneNumber, age, experienceYears, serviceName } = req.body;

    // Validate required fields
    if (!name || !phoneNumber || experienceYears === undefined || !serviceName) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number, experience years, and service name are required",
      });
    }

    // 📸 Get uploaded photo path (if exists)
    let photoPath = "";
    if (req.file) {
      photoPath = `/uploads/workers/${req.file.filename}`;
    }

    let worker = await Worker.findOne({ userId });

    if (worker) {
      // Update existing profile
      worker.name = name;
      worker.phoneNumber = phoneNumber;
      worker.age = age || worker.age;
      worker.experienceYears = experienceYears;
      worker.serviceName = serviceName;

      // Update photo only if new one uploaded
      if (photoPath) worker.profilePhoto = photoPath;

      await worker.save();

      return res.status(200).json({
        success: true,
        message: "Worker profile updated successfully",
        worker,
      });
    }

    // Create new worker
    worker = await Worker.create({
      userId,
      name,
      phoneNumber,
      age,
      experienceYears,
      serviceName,
      profilePhoto: photoPath, // save photo path
    });

    res.status(201).json({
      success: true,
      message: "Worker profile created successfully. Awaiting approval.",
      worker,
    });
  } catch (error) {
    console.error("Error creating worker profile:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getWorkerProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const worker = await Worker.findOne({ userId }).populate("userId", "email");

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

const updateWorkerProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const worker = await Worker.findOne({ userId });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found"
      });
    }

    // Fields allowed to update
    const allowedUpdates = [
      "name",
      "phoneNumber",
      "age",
      "experienceYears",
      "serviceName"
    ];

    // Update only fields that are sent
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        worker[field] = req.body[field];
      }
    });

    await worker.save();

    res.status(200).json({
      success: true,
      message: "Worker profile updated successfully",
      worker
    });

  } catch (error) {
    console.error("Error updating worker profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


const createWorkerAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressText, latitude, longitude, addressType } = req.body;

    if (!addressText || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Address, latitude and longitude are required"
      });
    }

    // Find worker linked to this user
    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker profile not found" });
    }

    // Check if address already exists
    const existingAddress = await WorkerAddress.findOne({ workerId: worker._id });
    if (existingAddress) {
      return res.status(400).json({
        success: false,
        message: "Address already exists. Use update instead."
      });
    }

    const address = await WorkerAddress.create({
      workerId: worker._id,
      addressText,
      latitude,
      longitude,
      addressType
    });

    res.status(201).json({ success: true, address });

  } catch (error) {
    console.error("Create address error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

 const getWorkerAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    const address = await WorkerAddress.findOne({ workerId: worker._id });

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, address });

  } catch (error) {
    console.error("Get address error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateWorkerAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressText, latitude, longitude, addressType } = req.body;

    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    const address = await WorkerAddress.findOne({ workerId: worker._id });
    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    // Only update fields that are provided
    if (addressText) address.addressText = addressText;
    if (latitude) address.latitude = latitude;
    if (longitude) address.longitude = longitude;
    if (addressType) address.addressType = addressType;

    await address.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address
    });

  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const uploadWorkerDocument = async (req, res) => {
  try {
    const userId = req.user._id;
    const { documentType, documentNumber } = req.body;

    if (!documentType || !documentNumber) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Document file is required" });
    }

    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    const document = await WorkerDocument.create({
      workerId: worker._id,
      documentType,
      documentNumber,
      documentUrl: `/uploads/documents/${req.file.filename}`
    });

    res.status(201).json({ success: true, document });

  } catch (error) {
    console.error("Upload document error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { createWorkerProfile, getWorkerProfile, uploadWorkerDocument, updateWorkerProfile, createWorkerAddress, updateWorkerAddress, getWorkerAddress } 