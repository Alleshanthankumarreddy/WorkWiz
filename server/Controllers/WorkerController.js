import Worker from "../Models/WorkerModel.js";
import WorkerAddress from "../Models/WorkerAddressModel.js";
import WorkerDocument from "../Models/WorkerDocumentModel.js";
import workerBankModel from "../Models/WorkerBankDetailsModel.js";
import userModel from "../Models/UserModel.js";
import Booking from "../Models/BookingModel.js";

const createWorkerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phoneNumber, age, experienceYears, serviceName, skills } = req.body;

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
      worker.skills = skills ?? worker.skills;   

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
      skills: skills || [],
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

    console.log(worker);

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

    const {
      addressType,
      latitude,
      longitude,
      houseNumber,
      street,
      area,
      landmark,
      city,
      district,
      state,
      pincode
    } = req.body;

    /* ---------- Basic validations ---------- */
    if (!city || !state || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "City, state, latitude and longitude are required"
      });
    }

    /* ---------- Find worker ---------- */
    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found"
      });
    }

    /* ---------- Prevent duplicate address ---------- */
    const existingAddress = await WorkerAddress.findOne({
       userId
    });

    if (existingAddress) {
      return res.status(400).json({
        success: false,
        message: "Address already exists. Use update instead."
      });
    }

    /* ---------- Create address ---------- */
    const address = await WorkerAddress.create({
      userId,
      addressType: addressType || "home",
      latitude,
      longitude,
      addressDetails: {
        houseNumber,
        street,
        area,
        landmark,
        city,
        district,
        state,
        pincode
      }
    });

    res.status(201).json({
      success: true,
      address
    });

  } catch (error) {
    console.error("Create address error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

 const getWorkerAddress = async (req, res) => {
  try {
    const userId = req.user._id;

    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return res.status(404).json({ success: false, message: "Worker not found" });
    }

    const address = await WorkerAddress.findOne({  userId });

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

    const address = await WorkerAddress.findOne({ userId });
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

    const {
      documentType,
      documentNumber,
      documentName
    } = req.body;

    /* ---------------- VALIDATIONS ---------------- */

    if (!documentType || !documentName) {
      return res.status(400).json({
        success: false,
        message: "Document type and document name are required"
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Document file is required"
      });
    }

    // If Aadhaar or License → document number is required
    if (
      (documentType === "AADHAR" || documentType === "LICENSE") &&
      !documentNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Document number is required for this document type"
      });
    }

    /* ---------------- FIND WORKER ---------------- */

    const worker = await Worker.findOne({ userId });
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    
    /* ---------------- AADHAR DUPLICATE CHECK ---------------- */

     if (documentType === "AADHAR") {
      const existingAadhar = await WorkerDocument.findOne({
        userId,
        documentType: "AADHAR"
      });

      if (existingAadhar) {
        return res.status(400).json({
          success: false,
          message: "Aadhaar document already uploaded. Only one Aadhaar is allowed."
        });
      }
    }

    /* ---------------- SAVE DOCUMENT ---------------- */

    const document = await WorkerDocument.create({
      userId,
      documentType,
      documentNumber: documentNumber || null,
      documentName,
      documentUrl: `/uploads/documents/${req.file.filename}`
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document
    });

  } catch (error) {
    console.error("Upload worker document error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const getWorkerDocuments = async (req, res) => {
  try {
    const userId = req.user._id;

    /* ---------------- FIND WORKER ---------------- */

    const worker = await Worker.findOne({ userId });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker not found"
      });
    }

    /* ---------------- FETCH DOCUMENTS ---------------- */

    const documents = await WorkerDocument.find({ userId }).sort({ createdAt: -1 });

    if (!documents || documents.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No documents uploaded yet",
        documents: []
      });
    }

    res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      documents
    });

  } catch (error) {
    console.error("Get worker documents error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};



const addWorkerBankDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      upiId
    } = req.body;

    /* ---------------- VALIDATION ---------------- */
    if (!accountHolderName || !bankName || !accountNumber || !ifscCode) {
      return res.status(400).json({
        success: false,
        message: "Account holder name, bank name, account number and IFSC code are required"
      });
    }

    /* ---------------- CHECK EXISTING ---------------- */
    const existingBank = await workerBankModel.findOne({ userId });
    if (existingBank) {
      return res.status(400).json({
        success: false,
        message: "Bank details already exist. Please update instead."
      });
    }

    /* ---------------- SAVE BANK DETAILS ---------------- */
    const bankDetails = await workerBankModel.create({
      userId,
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      upiId: upiId || null,
      isVerified: false
    });

    res.status(201).json({
      success: true,
      message: "Bank details added successfully",
      data: {
        accountHolderName: bankDetails.accountHolderName,
        bankName: bankDetails.bankName,
        ifscCode: bankDetails.ifscCode,
        upiId: bankDetails.upiId,
        isVerified: bankDetails.isVerified
      }
    });

  } catch (error) {
    console.error("Add Bank Details Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add bank details"
    });
  }
};

const getWorkerBankDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    const bankDetails = await workerBankModel.findOne({ userId });

    if (!bankDetails) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Bank details fetched successfully",
      data: {
        accountHolderName: bankDetails.accountHolderName,
        bankName: bankDetails.bankName,
        ifscCode: bankDetails.ifscCode,
        upiId: bankDetails.upiId,
        isVerified: bankDetails.isVerified,
        accountNumber: bankDetails.accountNumber
      }
    });

  } catch (error) {
    console.error("Get Bank Details Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bank details"
    });
  }
};

 const updateWorkerBankDetails = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      upiId
    } = req.body;

    const workerBank = await workerBankModel.findOne({ userId });
    if (!workerBank) {
      return res.status(404).json({
        success: false,
        message: "Bank details not found. Please add first."
      });
    }

    // 🔹 Check if payout info actually changed
    const payoutDetailsChanged =
      accountNumber ||
      ifscCode ||
      upiId;

    // ================== CREATE NEW FUND ACCOUNT ONLY IF NEEDED ==================
    let fundAccountId = workerBank.razorpayFundAccountId;

    if (payoutDetailsChanged) {
      const fundAccount = await razorpay.fundAccounts.create({
        contact_id: workerBank.razorpayContactId,
        account_type: upiId ? "vpa" : "bank_account",
        bank_account: upiId
          ? undefined
          : {
              name: accountHolderName || workerBank.accountHolderName,
              ifsc: ifscCode || workerBank.ifscCode,
              account_number: accountNumber || workerBank.accountNumber
            },
        vpa: upiId ? { address: upiId } : undefined
      });

      fundAccountId = fundAccount.id;
    }

    // 🔹 Update DB fields safely
    if (accountHolderName) workerBank.accountHolderName = accountHolderName;
    if (bankName) workerBank.bankName = bankName;
    if (accountNumber) workerBank.accountNumber = accountNumber;
    if (ifscCode) workerBank.ifscCode = ifscCode;
    if (upiId !== undefined) workerBank.upiId = upiId;

    workerBank.razorpayFundAccountId = fundAccountId;
    workerBank.isVerified = true;

    await workerBank.save();

    res.status(200).json({
      success: true,
      message: "Bank details updated successfully",
      data: {
        accountHolderName: workerBank.accountHolderName,
        bankName: workerBank.bankName,
        ifscCode: workerBank.ifscCode,
        upiId: workerBank.upiId,
        isVerified: workerBank.isVerified
      }
    });

  } catch (error) {
    console.error("Update Bank Details Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update bank details"
    });
  }
};



const toggleWorkerAvailability = async (req, res) => {
  try {
    const userId = req.user._id;


    const worker = await Worker.findOne({ userId });

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: "Worker profile not found"
      });
    }

    worker.isFree = !worker.isFree;

    await worker.save();

    res.status(200).json({
      success: true,
      message: `Worker is now ${worker.isFree ? "Available" : "Unavailable"}`,
      isFree: worker.isFree
    });

  } catch (error) {
    console.error("Toggle Availability Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update availability"
    });
  }
};

const getPastBookings = async (req, res) => {
  try {
    const { workerId } = req.body;

    if (!workerId) {
      return res.status(400).json({
        success: false,
        message: "WorkerId is required",
      });
    }

    const bookings = await Booking.find({
      workerId,
      status: { $in: ["work_done", "cancelled"] } // past bookings only
    })
      .sort({ createdAt: -1 }) // latest first
      .lean();

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("getPastBookings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export { createWorkerProfile, getWorkerProfile, uploadWorkerDocument, updateWorkerProfile, createWorkerAddress, getWorkerBankDetails, updateWorkerAddress, getWorkerAddress, toggleWorkerAvailability, addWorkerBankDetails, getWorkerDocuments, updateWorkerBankDetails, getPastBookings } 