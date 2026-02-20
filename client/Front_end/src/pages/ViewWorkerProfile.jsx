// WorkerProfile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import axios from 'axios';
import {
  UserCircleIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  WrenchIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  HomeIcon,
  ChevronRightIcon,
  XMarkIcon,
  HashtagIcon,
  MapIcon,
  FlagIcon,
  GlobeAltIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid
} from '@heroicons/react/24/solid';




const ViewWorkerProfile = () => {
  
    const [activeTab, setActiveTab] = useState('profile');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [worker, setWorker] = useState(null);
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pastBookings, setPastBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const { workerId } = useParams();

  // Handle booking
  const handleBookNow = () => {
    navigate(`/createbookingform/${worker.userId.email}`, { 
      state: { worker, address } 
    });
  };

  const fetchWorkerData = async () => {
    try {
      /* -------- GET WORKER PROFILE -------- */
      const profileRes = await axios.post(
        "http://localhost:5000/api/customer/getWorkerProfile",
        {workerId},
        {
          headers: { Authorization:`Bearer ${token}` }
        }
      );


      if (profileRes.data.success) {
        setWorker(profileRes.data.worker);
      }

      /* -------- GET WORKER ADDRESS -------- */
      const addressRes = await axios.post(
        "http://localhost:5000/api/customer/getWorkerAddress",
        {workerId},
        {
          headers: { Authorization:`Bearer ${token}` }
        }
      );

      if (addressRes.data.success) {
        setAddress(addressRes.data.address);
      }

    } catch (error) {
      console.error("Worker fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

const fetchPastBookings = async () => {
  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/worker/getPastBookings",
      { workerId }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setPastBookings(res.data.bookings);
    }
  } catch (err) {
    console.error("Failed to load past bookings", err);
  } finally {
    setLoading(false);
  }
};

const fetchWorkerReviews = async () => {
  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/reviews/getWorkerReviews",
      { workerId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setReviews(res.data.reviews);
    }

  } catch (error) {
    console.error("Failed to load reviews", error);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchWorkerData();
    fetchPastBookings();
    fetchWorkerReviews();
  },[workerId])

  // Render stars
  const renderStars = (rating = 0) => {
  return Array.from({ length: 5 }).map((_, index) => (
    <StarIconSolid
      key={index}
      className={`h-4 w-4 ${
        index < Math.round(rating)
          ? "text-yellow-400"
          : "text-gray-300"
      }`}
    />
  ));
};
  

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
  if (!date) return "Not set";
  return new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};


  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || !worker) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium">Loading worker profile...</p>
    </div>
  );
}

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-[#EFECE3] to-[#EAE0CF]">
      {/* Header */}
      

      <div className="bg-gradient-to-r from-[#213448] to-[#4A70A9] shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/viewallworkerprofiles")}
              className="flex items-center text-white hover:text-[#BFABD4] transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="h-5 w-5 text-[#BFABD4]" />
              <span className="text-white font-medium">Verified Professional</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#EAE0CF] mb-6">
          <div className="relative h-48 bg-gradient-to-r from-[#213448] to-[#4A70A9]">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={"#"}
                  alt={worker.name}
                  className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg bg-[#EFECE3]"
                />
                {worker.isFree && (
                  <div className="absolute bottom-2 right-2 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center flex-wrap gap-3">
                  <h1 className="text-3xl font-bold text-[#213448]">{worker.name}</h1>
                  {worker.isVerified && (
                    <span className="bg-[#94B4C1] text-white px-3 py-1 rounded-full text-sm flex items-center">
                      <CheckCircleIconSolid className="h-4 w-4 mr-1" />
                      Verified
                    </span>
                  )}
                  <p className="text-xl text-[#4A70A9] font-medium mt-1">{worker.serviceName}</p>
                </div>
                
                
                {/* Rating */}
                <div className="flex items-center mt-3">
                  <div className="flex">
                    {renderStars(worker.rating)}
                  </div>
                  <span className="ml-2 font-bold text-[#213448]">{worker.rating}</span>
                  <span className="ml-2 text-sm text-[#547792]">({worker.totalJobs} jobs completed)</span>
                </div>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center text-[#547792]">
                    <BriefcaseIcon className="h-5 w-5 mr-2 text-[#4A70A9]" />
                    {worker.experienceYears} experience
                  </div>
                  <div className="flex items-center text-[#547792]">
                    <MapPinIcon className="h-5 w-5 mr-2 text-[#4A70A9]" />
                    {address?.addressDetails?.area}, {address?.addressDetails?.city}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleBookNow}
                  disabled={!worker.isFree}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                    worker.isFree
                      ? 'bg-gradient-to-r from-[#4A70A9] to-[#213448] text-white hover:shadow-lg'
                      : 'bg-[#EAE0CF] text-[#547792] cursor-not-allowed'
                  }`}
                >
                  {worker.isFree ? 'Book Now' : 'Not Available'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-[#EAE0CF] mb-6">
          <div className="border-b border-[#EAE0CF]">
            <nav className="flex -mb-px px-6 overflow-x-auto">
              {[
                { id: 'profile', label: 'Profile Details', icon: UserCircleIcon },
                { id: 'bookings', label: 'Past Bookings', icon: DocumentTextIcon },
                { id: 'reviews', label: 'Reviews', icon: ChatBubbleLeftRightIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center py-4 px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-[#4A70A9] text-[#4A70A9]'
                      : 'border-transparent text-[#547792] hover:text-[#213448] hover:border-[#BFABD4]'
                    }
                  `}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Details Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[#213448] mb-4 flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2 text-[#4A70A9]" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#EFECE3] p-4 rounded-xl flex items-start space-x-3">
                      <PhoneIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-[#547792] mb-1">Phone Number</p>
                        <p className="text-[#213448] font-medium">{worker.phoneNumber}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#EFECE3] p-4 rounded-xl flex items-start space-x-3">
                      <EnvelopeIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-[#547792] mb-1">Email</p>
                        <p className="text-[#213448] font-medium">{worker.userId.email}</p>
                      </div>
                    </div>
                    
                    <div className="bg-[#EFECE3] p-4 rounded-xl flex items-start space-x-3">
                      <CalendarIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-[#547792] mb-1">Age</p>
                        <p className="text-[#213448] font-medium">{worker.age} years</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">

                  {/* Address Details */}
                  {address && (
                    <div>
                      <h3 className="text-lg font-semibold text-[#213448] mb-4 flex items-center">
                        <HomeIcon className="h-5 w-5 mr-2 text-[#4A70A9]" />
                        Address Details
                      </h3>
                      <div className="bg-[#EFECE3] p-5 rounded-xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                          {address.addressDetails.houseNumber && (
                            <div className="flex items-start gap-3">
                              <HashtagIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5 min-w-[20px]" />
                              <div>
                                <p className="text-sm text-[#547792]">House/Flat No.</p>
                                <p className="text-[#213448]">{address.addressDetails.houseNumber}</p>
                              </div>
                            </div>
                          )}
                          
                          {address.addressDetails.street && (
                            <div className="flex items-start space-x-3">
                              <MapIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5 min-w-[20px]" />
                              <div>
                                <p className="text-sm text-[#547792]">Street</p>
                                <p className="text-[#213448]">{address.addressDetails.street}</p>
                              </div>
                            </div>
                          )}
                          
                          {address.addressDetails.area && (
                            <div className="flex items-start space-x-3">
                              <MapIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5 min-w-[20px]" />
                              <div>
                                <p className="text-sm text-[#547792]">Area</p>
                                <p className="text-[#213448]">{address.addressDetails.area}</p>
                              </div>
                            </div>
                          )}
                          
                          {address.addressDetails.landmark && (
                            <div className="flex items-start space-x-3">
                              <FlagIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5 min-w-[20px]" />
                              <div>
                                <p className="text-sm text-[#547792]">Landmark</p>
                                <p className="text-[#213448]">{address.addressDetails.landmark}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-start space-x-3">
                            <HomeIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5 min-w-[20px]" />
                            <div>
                              <p className="text-sm text-[#547792]">City</p>
                              <p className="text-[#213448]">{address.addressDetails.city}</p>
                            </div>
                          </div>
                          
                          {address.addressDetails.district && (
                            <div className="flex items-start space-x-3">
                              <HomeIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5 min-w-[20px]" />
                              <div>
                                <p className="text-sm text-[#547792]">District</p>
                                <p className="text-[#213448]">{address.addressDetails.district}</p>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-start space-x-3">
                            <GlobeAltIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5 min-w-[20px]" />
                            <div>
                              <p className="text-sm text-[#547792]">State</p>
                              <p className="text-[#213448]">{address.addressDetails.state}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                          <EnvelopeIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5 min-w-[20px]" />
                            <div>
                              <p className="text-sm text-[#547792]">Pincode</p>
                              <p className="text-[#213448]">{address.addressDetails.pincode}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <TagIcon className="h-5 w-5 text-[#4A70A9] flex-shrink-0 mt-0.5 min-w-[20px]" />
                            <div>
                              <p className="text-sm text-[#547792]">Address Type</p>
                              <p className="text-[#213448] capitalize">{address.addressType}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#213448] mb-4 flex items-center">
                      <WrenchIcon className="h-5 w-5 mr-2 text-[#4A70A9]" />
                      Skills & Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2 bg-[#EFECE3] p-5 rounded-xl">
                      {worker.skills?.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 bg-gradient-to-r from-[#4A70A9] to-[#213448] text-white rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* About/Description */}
                {worker.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#213448] mb-4 flex items-center">
                      <DocumentTextIcon className="h-5 w-5 mr-2 text-[#4A70A9]" />
                      About
                    </h3>
                    <p className="text-[#547792] leading-relaxed bg-[#EFECE3] p-4 rounded-xl">
                      {worker.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Past Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[#213448] flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-[#4A70A9]" />
                    Past Bookings & Work History
                  </h3>
                  <span className="bg-[#94B4C1] text-white px-3 py-1 rounded-full text-sm">
                    {pastBookings.length} Total Jobs
                  </span>
                </div>

                {pastBookings.length === 0 ? (
                  <div className="text-center py-12 bg-[#EFECE3] rounded-xl">
                    <DocumentTextIcon className="h-16 w-16 text-[#94B4C1] mx-auto mb-4" />
                    <p className="text-[#213448] font-medium mb-2">No past bookings yet</p>
                    <p className="text-[#547792] text-sm">This worker hasn't completed any jobs yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="bg-[#EFECE3] rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowBookingModal(true);
                        }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                              <span className="ml-3 text-sm text-[#547792]">
                                Booking #{booking._id}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                              <div className="flex items-center text-sm text-[#547792]">
                                <CalendarIcon className="h-4 w-4 mr-2 text-[#4A70A9]" />
                                {formatDate(booking.startTime || booking.createdAt)}
                              </div>
                              <div className="flex items-center text-sm text-[#547792]">
                                <ClockIcon className="h-4 w-4 mr-2 text-[#4A70A9]" />
                                {formatTime(booking.startTime)}
                              </div>
                              <div className="flex items-center text-sm text-[#547792]">
                                <CurrencyRupeeIcon className="h-4 w-4 mr-2 text-[#4A70A9]" />
                                ₹{booking.totalAmount}
                              </div>
                            </div>

                            <p className="text-sm text-[#213448] mt-2">
                              {booking.serviceType}
                            </p>
                          </div>
                          
                          <ChevronRightIcon className="h-5 w-5 text-[#547792] hidden md:block" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[#213448] flex items-center">
                    <StarIcon className="h-5 w-5 mr-2 text-[#4A70A9]" />
                    Customer Reviews
                  </h3>
                  <div className="flex items-center bg-[#EFECE3] px-4 py-2 rounded-xl">
                    <StarIconSolid className="h-5 w-5 text-yellow-400 mr-2" />
                    <span className="font-bold text-[#213448]">{worker.rating}</span>
                    <span className="text-[#547792] ml-1">({reviews.length} reviews)</span>
                  </div>
                </div>

                {reviews.length === 0 ? (
                  <div className="text-center py-12 bg-[#EFECE3] rounded-xl">
                    <ChatBubbleLeftRightIcon className="h-16 w-16 text-[#94B4C1] mx-auto mb-4" />
                    <p className="text-[#213448] font-medium mb-2">No reviews yet</p>
                    <p className="text-[#547792] text-sm">Be the first to leave a review for this worker</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-[#EFECE3] p-5 rounded-xl">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <img
                              src={review.userAvatar}
                              alt={review.userName}
                              className="h-10 w-10 rounded-full object-cover bg-[#94B4C1]"
                            />
                            <div className="ml-3">
                              <p className="font-medium text-[#213448]">{review.userName}</p>
                              <p className="text-xs text-[#547792]">{formatDate(review.date)}</p>
                            </div>
                          </div>
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="mt-3 text-[#547792] text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

       
      </div>

      {/* Booking Details Modal */}
{showBookingModal && selectedBooking && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setShowBookingModal(false)}
    />

    {/* Modal Panel */}
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 z-50">

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-[#213448]">
          Booking Details
        </h3>

        <button
          onClick={() => setShowBookingModal(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-4">

        <div className="bg-[#EFECE3] p-4 rounded-xl">
          <p className="text-sm text-[#547792] mb-1">Booking ID</p>
          <p className="text-[#213448] font-mono">{selectedBooking.id}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#EFECE3] p-4 rounded-xl">
            <p className="text-sm text-[#547792] mb-1">Date</p>
            <p className="text-[#213448]">{formatDate(selectedBooking.date)}</p>
          </div>

          <div className="bg-[#EFECE3] p-4 rounded-xl">
            <p className="text-sm text-[#547792] mb-1">Time</p>
            <p className="text-[#213448]">{selectedBooking.time}</p>
          </div>
        </div>

        <div className="bg-[#EFECE3] p-4 rounded-xl">
          <p className="text-sm text-[#547792] mb-1">Amount</p>
          <p className="text-2xl font-bold text-[#4A70A9]">
            ₹{selectedBooking.amount}
          </p>
        </div>

        <div className="bg-[#EFECE3] p-4 rounded-xl">
          <p className="text-sm text-[#547792] mb-1">Status</p>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
            {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
          </span>
        </div>

        {selectedBooking.serviceDescription && (
          <div className="bg-[#EFECE3] p-4 rounded-xl">
            <p className="text-sm text-[#547792] mb-1">Service Description</p>
            <p className="text-[#213448]">{selectedBooking.serviceDescription}</p>
          </div>
        )}

      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ViewWorkerProfile;