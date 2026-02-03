import mongoose from "mongoose";

const workerDocumentSchema = new mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true
    },
    documentType: {
      type: String,
      enum: ["Aadhar", "PAN", "License"],
      required: true
    },
    documentNumber: {
      type: String,
      required: true
    },
    documentUrl: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


const workerDocumentModel =  mongoose.models.WorkerDocument ||
  mongoose.model("WorkerDocument", workerDocumentSchema);

export default workerDocumentModel;