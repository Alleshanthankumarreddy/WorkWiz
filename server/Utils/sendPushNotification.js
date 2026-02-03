import admin from "../Config/firebaseAdmin.js";

export const sendPushNotification = async (fcmToken, title, body) => {
  try {
    const message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
    };

    await admin.messaging().send(message);
    console.log("Push notification sent");
  } catch (error) {
    console.error("Push error:", error);
  }
};
