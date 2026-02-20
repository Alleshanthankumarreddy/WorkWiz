import mongoose from "mongoose";

const workerDocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userId",
      required: true
    },

    documentType: {
      type: String,
      enum: [
        "AADHAR",
        "LICENSE",
        "SKILL_CERTIFICATE",
        "EXPERIENCE_CERTIFICATE",
        "OTHER"
      ],
      required: true
    },

    documentNumber: {
      type: String,
      default: null // certificates may not have numbers
    },

    documentName: {
      type: String, // e.g. "Carpentry Course Certificate"
      required: true
    },

    documentUrl: {
      type: String,
      required: true
    },

    verified: {
      type: Boolean,
      default: false
    },

    verifiedAt: {
      type: Date,
      default: null
    },

    adminRemarks: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const workerDocumentModel =
  mongoose.models.WorkerDocument ||
  mongoose.model("WorkerDocument", workerDocumentSchema);

export default workerDocumentModel;
