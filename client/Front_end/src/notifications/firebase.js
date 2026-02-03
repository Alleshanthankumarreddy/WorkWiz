// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAaBBuTpMyOWj_VpeI4t6Snywz50YKkbeg",
  authDomain: "workwiz-2d7b9.firebaseapp.com",
  projectId: "workwiz-2d7b9",
  storageBucket: "workwiz-2d7b9.firebasestorage.app",
  messagingSenderId: "924036282376",
  appId: "1:924036282376:web:cbd9bc1fe30afe5e21f9bd",
  measurementId: "G-LL11SVR8H0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateToken = async () => {
    const permission = await Notification.requestPermission();
    console.log( permission );
    if(permission === "granted") {
        const token = await getToken( messaging, {
            vapidKey:"BC-u5qU49cyS4MrePqKKQ0AM1QgyEGOUOcmAqjBG8_v6CAf2sUKiwte1VWLTZiCqCjiZ0dBaeWczqE_RG0STtb8",
        });
        return token;
    }
    
}


