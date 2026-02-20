import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import RequestedBookingHeadline from "./RequestedBookingHeadline";

function AppLayout() {
  const bookings = useSelector((state) => state.bookings.bookings);

  const handleChat = (booking) => {
    console.log("Start chat:", booking);
  };

  return (
    <div>
      <div className="p-4 space-y-3">
         <RequestedBookingHeadline />
      </div>

      <Outlet />
    </div>
  );
}

export default AppLayout;
