import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phoneNumber: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      min: 18
    },

    experienceYears: {
      type: Number,
      required: true,
      min: 0
    },

    approved: {
      type: Boolean,
      default: false
    },

    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalJobsCompleted: {
      type: Number,
      default: 0,
      min: 0
    },

     serviceName: {
      type: String,
      required: true,
      trim: true
    },

    profilePhoto: {
      type: String, 
      default: "", 
    },

    isFree: {
      type: Boolean,
      default: true,
      required: true,
    },

    skills: {
      type: [String],
      default: [],
    },

  },
  { timestamps: true }
);

const workerModel = mongoose.models.Worker || mongoose.model("Worker",workerSchema)

export default workerModel;
