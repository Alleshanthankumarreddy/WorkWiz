import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/* ---------------- SIMPLE VERSION ---------------- */

const WorkerHeadline = ({ workerName, serviceName, onChat }) => {
  const initial = workerName?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="w-full bg-[#EAEFEF] p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#BFC9D1] flex items-center justify-center">
            <span className="text-[#25343F] font-semibold text-lg">
              {initial}
            </span>
          </div>

          <div>
            <h2 className="text-[#25343F] text-xl font-bold">
              {workerName || "Unknown User"}
            </h2>
            <p className="text-[#25343F] text-sm opacity-80">
              Service :- {serviceName || "Service"}
            </p>
          </div>
        </div>

        <button
          onClick={onChat}   // ⭐ IMPORTANT
          className="bg-[#FF9B51] hover:bg-[#e6893d] text-white font-semibold 
                     py-2 px-6 rounded-md transition-all duration-200 
                     transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          Chat Now
        </button>
      </div>
    </div>
  );
};


function RequestedBookingHeadline() {
  const bookings = useSelector((state) => state.bookings.bookings);
  const navigate = useNavigate(); // ⭐ ADD THIS

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const role = storedUser?.role;

  const handleChat = (booking) => {
    if (!booking?.bookingId) return;

    navigate(`/chat/${booking.bookingId}`); // ⭐ NAVIGATION
  };

  if (!bookings.length) {
    return <p className="p-4">No requested bookings</p>;
  }

  return (
    <div className="space-y-4 p-4">
      {bookings.map((booking) => {
        const displayName =
          role === "customer"
            ? booking.workerName
            : booking.customerName;

        return (
          <WorkerHeadline
            key={booking.bookingId}
            workerName={displayName}
            serviceName={booking.serviceType}
            onChat={() => handleChat(booking)} // ⭐ PASS HANDLER
          />
        );
      })}
    </div>
  );
}


export default RequestedBookingHeadline;
