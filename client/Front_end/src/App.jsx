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
import CustomerProfilePage from "./pages/CustomerProfilePage";
import WorkerProfileDetails from "./pages/WorkerProfileDetails";
import ChatPage from "./pages/ChatPage";
import CustomerProfileSetup from "./pages/CustomerProfileSetup";
import WorkerProfileSetup from "./pages/WorkerProfileSetup";
import WorkerProfilePage from "./pages/WorkerProfilePage";
import ViewAllWorkers from "./pages/ViewAllWorkers";
import ViewWorkerProfile from "./pages/ViewWorkerProfile";
import CreateBookingForm from "./pages/CreateBookingForm";
import AppLayout from "./pages/AppLayout";
import CreateQuoteForm from "./pages/CreateQuoteForm";


function App() {

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
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/chat/:bookingId" element={<ChatPage />} />

        {/* <Route path="/customerprofiledetails" element={<CustomerProfileDetails />} /> */}
        {/* <Route path="/customerprofile" element={<CustomerProfilePage />} /> */}
       {/* < Route path="/workerprofiledetails" element={<WorkerProfileDetails />} /> */}
        {/* <Route path="/workerprofile" element={<WorkerProfilePage/>}/>
        <Route path="/customerprofilesetup" element={<CustomerProfileSetup/>}/>
        <Route path="/workerprofilesetup" element={<WorkerProfileSetup/>}/>
        <Route path="/viewworkerprofile/:workerId" element={<ViewWorkerProfile/>}/>
        <Route path="/viewallworkerprofiles" element={<ViewAllWorkers/>}/>
        <Route path="/createbookingform/:workerEmail" element= {<CreateBookingForm/>}/> */}
        {/* <Route
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
        /> */}

        <Route element={<AppLayout />}>

          <Route path="/" element={<Home />} />
          <Route path="/customerprofile" element={<CustomerProfilePage />} />
          <Route path="/workerprofile" element={<WorkerProfilePage />} />
          <Route path="/customerprofilesetup" element={<CustomerProfileSetup />} />
          <Route path="/workerprofilesetup" element={<WorkerProfileSetup />} />
          <Route path="/viewworkerprofile/:workerId" element={<ViewWorkerProfile />} />
          <Route path="/viewallworkerprofiles" element={<ViewAllWorkers />} />
          <Route path="/createbookingform/:workerEmail" element={<CreateBookingForm />} />
        </Route>
        <Route path="/createquoteform" element={ <CreateQuoteForm/>}/>
      </Routes>
    </>
  );
}


export default App;
