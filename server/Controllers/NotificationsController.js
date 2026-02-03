import User from "../Models/UserModel.js";

export const saveFcmToken = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fcmToken } = req.body;

    await User.findByIdAndUpdate(userId, { fcmToken });

    res.status(200).json({ success: true, message: "FCM token saved" });
  } catch (error) {
    console.error("Save token error:", error);
    res.status(500).json({ success: false });
  }
};
