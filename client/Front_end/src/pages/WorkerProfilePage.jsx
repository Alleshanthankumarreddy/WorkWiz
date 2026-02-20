import { useState, useEffect } from 'react';
import axios from "axios";
import React from 'react';
import {
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  BriefcaseIcon,
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  BanknotesIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ClockIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  WrenchIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid';

const WorkerProfilePage = () => {
 const [worker, setWorker] = useState({
  name: "",
  email: "",
  phoneNumber: "",
  serviceName: "",
  experienceYears: 0,
  totalJobsCompleted: 0,
  memberSince: "",
  ratingAvg: 0,
  isFree: true,
  skills: [],
  profilePhoto: ""
});

  const [bankDetails, setBankDetails] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: '',
    serviceName: '',
    experienceYears: '',
  });

  const [activities, setActivities] = useState([]);

  const token = localStorage.getItem("token");



  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values
      setEditForm({
        name: worker.name,
        phoneNumber: worker.phoneNumber,
        serviceName: worker.serviceName,
        experienceYears: worker.experienceYears.toString(),
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try{
    // In real app, call API to update worker
    const payload = {
      name: editForm.name,
      phoneNumber: editForm.phoneNumber,
      serviceName: editForm.serviceName,
      experienceYears: parseInt(editForm.experienceYears),
    };

    const res = await axios.patch(
      "http://localhost:5000/api/worker/updateWorkerProfile",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setWorker(prev => ({
        ...prev,
        ...res.data.worker,
      }));

      setIsEditing(false);
      alert("Profile updated successfully!");
    }

  } catch (error) {
    console.error("Update Worker Error:", error);
    alert(error.response?.data?.message || "Failed to update profile");
  }
};
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setEditForm({
      name: worker.name,
      phoneNumber: worker.phoneNumber,
      serviceName: worker.serviceName,
      experienceYears: worker.experienceYears.toString(),
    });
    setIsEditing(false);
  };

const handleStatusToggle = async () => {
  try {
    const res = await axios.patch(
      "http://localhost:5000/api/worker/toggleWorkerAvailability",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.success) {
      setWorker(prev => ({
        ...prev,
        isFree: res.data.isFree
      }));

    }

  } catch (error) {
    console.error("Toggle Availability Error:", error);

    if (error.response?.status === 401) {
      alert("Session expired. Please login again.");
    } else {
      alert(error.response?.data?.message || "Failed to update status");
    }
  }
};


  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIconSolid
        key={index}
        className={`h-5 w-5 ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

const fetchWorkerProfile = async () => {
  try {
    const { data } = await axios.post(
        "http://localhost:5000/api/worker/getWorkerProfile",
        {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (data.success) {
      setWorker(prev => ({
        ...prev,
        ...data.worker,
        email: data.worker.userId.email,
        profilePhoto: data.worker.profilePhoto
          ? `http://localhost:5000${data.worker.profilePhoto}`  // ⭐ FIX
          : "",   
      }));

      setEditForm({
        name: data.worker.name,
        phoneNumber: data.worker.phoneNumber,
        serviceName: data.worker.serviceName,
        experienceYears: data.worker.experienceYears.toString(),
      });
    }
  } catch (error) {
    console.error("Failed to fetch worker profile", error);
  }
}

const fetchWorkerAddress = async () => {
  try {
    const { data } = await axios.post(
        "http://localhost:5000/api/worker/getWorkerAddress",
        {},
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        }
    );

    if (data.success) {
      setAddresses([data.address.addressDetails]); 
      console.log(data.address.addressDetails);// your UI expects array
    }
  } catch (error) {
    console.error("Failed to fetch worker address", error);
  }
};

const fetchJoinedDate = async () => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/user/joinedDate",
      { role: "worker" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    if (data.success) {
     
      setWorker((prev) => ({
        ...prev,
        memberSince: data.joinDateFormatted,
      }));
        console.log("JOIN DATE RESPONSE:", data.joinDateFormatted);
    }
  } catch (error) {
    console.error("Failed to fetch joined date", error);
  }
};

const fetchTotalBookings = async () => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/user/joinedDate",
      { role: "worker" }, // 👈 BODY
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    if (data.success) {
      setWorker((prev) => ({
        ...prev,
        totalJobsCompleted: data.totalBookings,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch total bookings", error);
  }
};

const fetchRecentActivity = async () => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/user/joinedDate",
      { role: "worker" }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );


    if (data.success) {
      setActivities(data.activities);
    }
    console.log(activities);
  } catch (error) {
    console.error("Failed to fetch recent activity", error);
  }
};

 const fetchBankDetails = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/worker/getWorkerBankDetails",
        {}, // no body needed
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setBankDetails(res.data.data);
      }

    } catch (error) {
      console.error("Fetch Bank Details Error:", error);

      // If 404 → no bank details → keep null (UI already handles)
      if (error.response?.status !== 404) {
        alert("Failed to load bank details");
      }
    }
  };

  const fetchDocuments = async () => {
    try {

      const res = await axios.post(
        "http://localhost:5000/api/worker/getWorkerDocuments",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setDocuments(res.data.documents);
      }

    } catch (error) {
      console.error("Fetch Documents Error:", error);

      if (error.response?.status !== 404) {
        alert("Failed to load documents");
      }
    }
  };

useEffect(() => {
  const loadData = async () => {
    try {
      await Promise.all([
        fetchWorkerProfile(),
        fetchWorkerAddress(),
        fetchJoinedDate(),
        fetchTotalBookings(),
        fetchRecentActivity(),
        fetchBankDetails(),
        fetchDocuments()
        ]);
    } catch (err) {
      console.error("Profile loading failed", err);
    } finally {
      setLoading(false);   // ⭐ CRITICAL LINE
    }
  };

  loadData();
}, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#EFECE3]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A70A9] mx-auto"></div>
          <p className="mt-4 text-[#213448]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#213448]">
            My Worker Profile
          </h1>
          <p className="text-[#547792] mt-2">Manage your professional information and services</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#EAE0CF]">
          
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-[#213448] to-[#4A70A9] px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-gradient-to-br from-[#4A70A9] to-[#BFABD4] flex items-center justify-center overflow-hidden">
                  <img
                    src={worker.profilePhoto}
                    alt={worker.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#94B4C1] text-white rounded-full p-2 shadow-lg">
                  <WrenchIcon className="h-5 w-5" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleInputChange}
                          className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 w-full max-w-xs"
                          placeholder="Your name"
                        />
                      ) : (
                        worker.name
                      )}
                    </h2>
                    <p className="text-[#94B4C1] mt-1 flex items-center justify-center sm:justify-start space-x-1">
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>{worker.email}</span>
                    </p>
                  </div>
                  
                  {/* Edit Button */}
                  <div className="mt-4 sm:mt-0">
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="inline-flex items-center px-4 py-2 bg-[#94B4C1] text-white rounded-lg hover:bg-[#547792] transition-colors"
                        >
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="inline-flex items-center px-4 py-2 bg-[#547792] text-white rounded-lg hover:bg-[#213448] transition-colors"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleEditToggle}
                        className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatItem 
                    label="Jobs Completed" 
                    value={worker.totalJobsCompleted} 
                    icon={<CheckCircleIconSolid className="h-5 w-5" />}
                    color="from-[#4A70A9] to-[#213448]"
                  />
                  <StatItem 
                    label="Experience" 
                    value={`${worker.experienceYears} yrs`} 
                    icon={<BriefcaseIcon className="h-5 w-5" />}
                    color="from-[#94B4C1] to-[#4A70A9]"
                  />
                  <StatItem 
                    label="Member Since" 
                    value={worker.memberSince || "-"} 
                    icon={<CalendarIcon className="h-5 w-5" />}
                    color="from-[#547792] to-[#213448]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[#EAE0CF]">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {['profile', 'bank', 'address', 'documents'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    py-4 px-1 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
                    ${activeTab === tab
                      ? 'border-[#4A70A9] text-[#213448] font-semibold'
                      : 'border-transparent text-[#547792] hover:text-[#213448] hover:border-[#94B4C1]'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <ProfileTab 
                worker={worker}
                isEditing={isEditing}
                editForm={editForm}
                handleInputChange={handleInputChange}
                handleStatusToggle={handleStatusToggle}
                renderStars={renderStars}
              />
            )}

            {activeTab === 'bank' && <BankTab bankDetails={bankDetails} />}
            {activeTab === 'address' && <AddressTab addresses={addresses} />}
            {activeTab === 'documents' && <DocumentsTab documents={documents} />}
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-[#EFECE3] border-t border-[#EAE0CF] flex justify-between">
            <button
              onClick={() => window.location.href = '/my-bookings'}
              className="px-4 py-2 bg-[#4A70A9] text-white rounded-lg hover:bg-[#213448] transition-colors font-medium"
            >
              View My Bookings
            </button>
            <div className="flex space-x-3">
              <button
                onClick={handleStatusToggle}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${worker.isFree ? 'bg-[#94B4C1] text-white hover:bg-[#547792]' : 'bg-[#BFABD4] text-white hover:bg-[#4A70A9]'}`}
              >
                {worker.isFree ? 'Mark as Busy' : 'Mark as Available'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 max-w-5xl mt-8 gap-4">
          <QuickStat 
            title="Customer Rating"
            value={worker.ratingAvg.toFixed(1)}
            description={`Based on ${worker.totalJobsCompleted} jobs`}
            color="bg-gradient-to-r from-[#94B4C1] to-[#4A70A9]"
            icon={<StarIconSolid className="h-6 w-6 text-white" />}
          />
          <QuickStat 
            title="Profile Strength"
            value="92%"
            description="Complete your profile"
            color="bg-gradient-to-r from-[#BFABD4] to-[#4A70A9]"
            icon={<ShieldCheckIcon className="h-6 w-6 text-white" />}
          />
        </div>

        {/* Recent Activity */}
        {/* Recent Activity (Optional Section) */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-[#EAE0CF]">
          <h3 className="text-lg font-semibold text-[#213448] mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {!activities || activities.length === 0 ? (
              <p className="text-sm text-[#94B4C1]">No recent activity</p>
            ) : (
              activities.map((activity) => (
                <ActivityItem
                  key={activity.bookingId}
                  icon={getActivityIcon(activity.status)}
                  text={activity.message}
                  time={formatTimeAgo(activity.date)}
                />
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};


// ======= Tab Components =======
const ProfileTab = ({ worker, isEditing, editForm, handleInputChange, handleStatusToggle, renderStars }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Left Column - Personal Info */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-[#EFECE3] rounded-lg">
            <UserIcon className="h-6 w-6 text-[#4A70A9]" />
          </div>
          <h3 className="text-xl font-semibold text-[#213448]">Personal Information</h3>
        </div>

        <div className="space-y-4">
          <InfoField 
            label="Service Category" 
            value={isEditing ? (
              <input
                type="text"
                name="serviceName"
                value={editForm.serviceName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9]"
                placeholder="Your service category"
              />
            ) : worker.serviceName}
            icon={<WrenchIcon className="h-5 w-5 text-[#547792]" />}
          />
          
          <InfoField 
            label="Phone Number" 
            value={isEditing ? (
              <input
                type="tel"
                name="phoneNumber"
                value={editForm.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9]"
                placeholder="Your phone number"
              />
            ) : worker.phoneNumber}
            icon={<PhoneIcon className="h-5 w-5 text-[#547792]" />}
          />
          
          <InfoField 
            label="Experience" 
            value={isEditing ? (
              <input
                type="number"
                name="experienceYears"
                value={editForm.experienceYears}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9]"
                placeholder="Years of experience"
              />
            ) : `${worker.experienceYears} years`}
            icon={<BriefcaseIcon className="h-5 w-5 text-[#547792]" />}
          />
        </div>
      </div>

      {/* Right Column - Professional Info */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-[#EFECE3] rounded-lg">
            <StarIcon className="h-6 w-6 text-[#4A70A9]" />
          </div>
          <h3 className="text-xl font-semibold text-[#213448]">Professional Details</h3>
        </div>

        {/* Rating Card */}
        <div className="bg-[#EFECE3] p-4 rounded-lg border border-[#EAE0CF]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="flex">{renderStars(worker.ratingAvg)}</div>
              <span className="text-lg font-semibold text-[#213448]">{worker.ratingAvg.toFixed(1)}</span>
            </div>
            <span className="text-sm text-[#547792]">Average Rating</span>
          </div>
          <p className="text-sm text-[#547792]">Based on {worker.totalJobsCompleted} completed jobs</p>
        </div>

        {/* Skills */}
        <div className="bg-[#EFECE3] p-4 rounded-lg border border-[#EAE0CF]">
          <h4 className="font-medium text-[#213448] mb-3">Skills & Expertise</h4>
          <div className="flex flex-wrap gap-2">
            {worker.skills?.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-[#EAE0CF] text-[#213448] rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#EFECE3] p-4 rounded-lg border border-[#EAE0CF]">
          <h4 className="font-medium text-[#213448] mb-2">About Me</h4>
          <p className="text-sm text-[#547792]">{worker.description}</p>
        </div>
      </div>
    </div>
  </div>
);

const BankTab = ({ bankDetails }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-semibold text-[#213448]">Bank Account Details</h3>
    {bankDetails ? (
      <div className=" rounded-2xl p-6 shadow-sm border border-[#EAE0CF]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard icon={<UserIcon className="h-6 w-6 text-[#4A70A9]" />} label="Account Holder" value={bankDetails.accountHolderName} />
          <InfoCard icon={<BanknotesIcon className="h-6 w-6 text-[#4A70A9]" />} label="Bank Name" value={bankDetails.bankName} />
          <InfoCard icon={<CreditCardIcon className="h-6 w-6 text-[#4A70A9]" />} label="Account Number" value={`****${bankDetails.accountNumber?.slice(-4)}`} secure />
          <InfoCard icon={<DocumentTextIcon className="h-6 w-6 text-[#4A70A9]" />} label="IFSC Code" value={bankDetails.ifscCode} />
          {bankDetails.upiId && <InfoCard icon={<div className="h-6 w-6 text-[#4A70A9] font-bold">₹</div>} label="UPI ID" value={bankDetails.upiId} />}
        </div>
        <div className="mt-6 pt-6 border-t border-[#EAE0CF] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {bankDetails.isVerified ? <CheckCircleIconSolid className="h-5 w-5 text-[#94B4C1]" /> : <ClockIcon className="h-5 w-5 text-[#BFABD4]" />}
            <span className={`font-medium ${bankDetails.isVerified ? 'text-[#4A70A9]' : 'text-[#547792]'}`}>
              {bankDetails.isVerified ? 'Verified Account' : 'Pending Verification'}
            </span>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-12 bg-[#EFECE3] rounded-2xl border border-[#EAE0CF]">
        <CreditCardIcon className="h-12 w-12 text-[#94B4C1] mx-auto mb-4" />
        <p className="text-[#547792]">No bank details added yet</p>
        <button className="mt-4 px-4 py-2 bg-[#4A70A9] text-white rounded-lg hover:bg-[#213448] transition-colors">
          Add Bank Details
        </button>
      </div>
    )}
  </div>
);

const AddressTab = ({ addresses }) => (
  <div className="space-y-6">
    

    {addresses.length > 0 ? (
      <div className="grid grid-cols-1 gap-4">
        {addresses.map((address) => (
          <div key={address._id} className="bg-white border border-[#EAE0CF] rounded-lg p-6 hover:shadow-md transition-shadow hover:border-[#94B4C1]">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${address.addressType === 'home' ? 'bg-[#EFECE3] text-[#4A70A9]' : 'bg-[#EAE0CF] text-[#BFABD4]'}`}>
                  <HomeIcon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-[#213448]">Primary Address</span>
                    {address.isPrimary && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-[#94B4C1] text-white rounded">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#547792] mt-2">{address.addressText}</p>
                  <p className="text-sm text-[#547792]">
                   {address.street}, {address.city}, {address.state} - {address.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12 bg-[#EFECE3] rounded-2xl border border-[#EAE0CF]">
        <HomeIcon className="h-12 w-12 text-[#94B4C1] mx-auto mb-4" />
        <p className="text-[#547792]">No address added yet</p>
      </div>
    )}
  </div>
);

const DocumentsTab = ({ documents }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-[#213448]">My Documents</h3>
      <span className="text-sm text-[#547792]">{documents.filter(d => d.verified).length} of {documents.length} verified</span>
    </div>

    {documents.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc._id} className="bg-white border border-[#EAE0CF] rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${doc.verified ? 'bg-[#EFECE3]' : 'bg-[#EAE0CF]'}`}>
                  <DocumentTextIcon className={`h-5 w-5 ${doc.verified ? 'text-[#4A70A9]' : 'text-[#547792]'}`} />
                </div>
                <div>
                  <h4 className="font-medium text-[#213448]">{doc.documentType}</h4>
                  <p className="text-sm text-[#547792]">{doc.documentNumber}</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-2 ${doc.verified ? 'bg-[#94B4C1] text-white' : 'bg-[#EAE0CF] text-[#547792]'}`}>
                  {doc.verified ? 'Verified' : 'Pending'}
                </span>
                <button className="text-sm text-[#4A70A9] hover:text-[#213448]">
                  View
                </button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-[#EAE0CF]">
              <p className="text-xs text-[#94B4C1]">
                Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-12 bg-[#EFECE3] rounded-2xl border border-[#EAE0CF]">
        <DocumentTextIcon className="h-12 w-12 text-[#94B4C1] mx-auto mb-4" />
        <p className="text-[#547792]">No documents uploaded yet</p>
        <button className="mt-4 px-4 py-2 bg-[#4A70A9] text-white rounded-lg hover:bg-[#213448] transition-colors">
          Upload Documents
        </button>
      </div>
    )}
  </div>
);

// ===== Reusable Components =====
const StatItem = ({ label, value, icon, color }) => (
  <div className={`bg-gradient-to-r ${color} rounded-xl p-4 text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{label}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="bg-white/20 p-2 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

const InfoField = ({ label, value, icon }) => (
  <div className="flex items-start space-x-3">
    <div className="pt-1">{icon}</div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-[#213448] mb-1">
        {label}
      </label>
      <div className="text-[#213448] font-medium">
        {value}
      </div>
    </div>
  </div>
);

const InfoCard = ({ icon, label, value, secure = false }) => (
  <div className="bg-white p-4 rounded-lg border border-[#EAE0CF] hover:border-[#94B4C1] transition-colors">
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#547792] truncate">{label}</p>
        <p className="text-lg font-semibold text-[#213448] mt-1">
          {secure ? '•••••••••••' + value.slice(-4) : value}
        </p>
      </div>
    </div>
  </div>
);

const QuickStat = ({ title, value, description, color, icon }) => (
  <div className={`${color} rounded-xl shadow-md p-5 text-white`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        <p className="text-xs opacity-75 mt-2">{description}</p>
      </div>
      <div className="p-3 bg-white/20 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

const ActivityItem = ({ icon, text, time, amount }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#EAE0CF] last:border-0">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-[#EFECE3] rounded-lg">
        {icon}
      </div>
      <div>
        <span className="text-[#213448]">{text}</span>
        <p className="text-sm text-[#547792]">{time}</p>
      </div>
    </div>
    {amount && (
      <span className="font-semibold text-[#4A70A9]">{amount}</span>
    )}
  </div>
);

export default WorkerProfilePage;