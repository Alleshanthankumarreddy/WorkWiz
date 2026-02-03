/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// 🔥 Initialize Firebase inside Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyAaBBuTpMyOWj_VpeI4t6Snywz50YKkbeg",
  authDomain: "workwiz-2d7b9.firebaseapp.com",
  projectId: "workwiz-2d7b9",
  storageBucket: "workwiz-2d7b9.firebasestorage.app",
  messagingSenderId: "924036282376",
  appId: "1:924036282376:web:cbd9bc1fe30afe5e21f9bd",
  measurementId: "G-LL11SVR8H0"
});

// Get messaging instance
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] Background message ", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new update.",
    icon: payload.notification.image, // optional icon from your public folder
    // data: {
    //   url: payload.data?.url || "/"  // where to open when clicked
    // }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
