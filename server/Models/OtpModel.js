import mongoose from "mongoose";

const emailOtpSchema = new mongoose.Schema(
    {
        email: {
        type: String,
        required: true,
        index: true
        },

        otpHash: {
        type: String,
        required: true
        },

        expiresAt: {
        type: Date,
        required: true,
        expires: 0 
        },
    },
    {
        timestamps: true
    }
);

const otpModel = mongoose.models.Otp || mongoose.model("Otp",emailOtpSchema);

export default otpModel;