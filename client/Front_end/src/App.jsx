import React from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";


import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
import { setFcmToken } from "./redux/slices/notificationSlice";
import { generateToken } from "./notifications/firebase";
import CustomerProfileDetails from "./pages/CustomerProfileDetails";
import CustomerProfilePage from "./pages/CustomerProfile";
import WorkerProfileDetails from "./pages/WorkerProfileDetails";
import ChatPage from "./pages/ChatPage";


function App() {
   const dispatch = useDispatch();

  const { user, role } = useSelector((state) => state.auth); // ⭐ GET USER HERE

  // useEffect(() => {
  //   const setupFCM = async () => {
  //     const token = await generateToken();
  //     if (token) dispatch(setFcmToken(token));
  //   };
  //   setupFCM();
  // }, [dispatch]);



  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/customerprofiledetails" element={<CustomerProfileDetails />} />
        <Route path="/customerprofile" element={<CustomerProfilePage />} />
        <Route path="/workerprofiledetails" element={<WorkerProfileDetails />} />

        <Route
          path="/chat"
          element={
            user ? (
              <ChatPage
                bookingId={"697e39627e1a25be477b2ebc"}
                currentUser={{ _id: user._id, role }}
              />
            ) : (
              <div>Please login to access chat</div>
            )
          }
        />
      </Routes>
    </>
  );
}


export default App;
