import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  UserCircleIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  EnvelopeIcon,
  HomeIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import {
  UserCircleIcon as UserCircleSolid,
  CheckCircleIcon as CheckCircleSolid
} from '@heroicons/react/24/solid';

const CustomerProfilePage = () => {
  // Mock data for demonstration
  const [customer, setCustomer] = useState({
  name: "",
  phone: "",
  email: "",
  address: {
    street: "",
    city: "",
    state: "",
    pincode: ""
  },
  totalBookings: 0,
  activeBookings: 0,
  memberSince: "",
  createdAt: new Date(),
  updatedAt: new Date()
});

const [accountInfo, setAccountInfo] = useState({
  joinedDate: null,
  joinedDateFormatted: "",
});

const [recentActivities, setRecentActivities] = useState([]);



  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  const token = localStorage.getItem("token");

  // Mock customer data

useEffect(() => {
  fetchCustomerProfile();
  fetchCustomerProfile();
  fetchAccountInfo();
  fetchTotalBookings();
  fetchRecentActivity;
}, []);

const fetchCustomerProfile = async () => {
  try {
    setLoading(true);

    const { data } = await axios.get(
      "http://localhost:5000/api/customer/getCustomerProfile",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const profile = data.profile;

 

    setCustomer({
      ...profile,
      email: profile.userId.email,   // coming from populated user
      memberSince: new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric"
      }),
      totalBookings: 0,   // optional: replace later
      activeBookings: 0
    });

    setEditForm({
      name: profile.name,
      phone: profile.phone,
      address: { ...profile.address }
    });
   

  } catch (error) {
    alert(error);
  } finally {
    setLoading(false);
  }
};

const fetchAccountInfo = async () => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/user/joinedDate",
      { role: "customer" },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAccountInfo({
      joinedDate: data.joinDate,
      joinedDateFormatted: data.joinDateFormatted,
    });
  } catch (error) {
    console.error("Failed to fetch account info", error);
  }
};

const fetchTotalBookings = async () => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/user/totalBookings",
      {
        role: "customer", // or "worker"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
       setCustomer((prev) => ({
        ...prev,
        totalBookings: data.totalBookings,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch total bookings", error);
  }
};

const fetchRecentActivity = async () => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/user/recentActivity",
      {
        role: "customer", // change to "worker" in worker profile
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (data.success) {
      setRecentActivities(data.activities);
    }
  } catch (error) {
    console.error("Failed to fetch recent activity", error);
  }
};

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to original values
      setEditForm({
        name: customer.name,
        phone: customer.phone,
        address: { ...customer.address }
      });
    }
    setIsEditing(!isEditing);
  };
const handleSave = async () => {
  try {
    const { data } = await axios.patch(
      "http://localhost:5000/api/customer/updateCustomerProfile",
      {
        name: editForm.name,
        phone: editForm.phone,
        address: editForm.address
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    alert(data.message);

    setIsEditing(false);
    fetchCustomerProfile(); // reload updated data

  } catch (error) {
    alert(error);
  }
};


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

const handleCancel = () => {
  setEditForm({
    name: customer.name,
    phone: customer.phone,
    address: { ...customer.address }
  });
  setIsEditing(false);
};


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#FBEFEF]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A70A9] mx-auto"></div>
          <p className="mt-4 text-[#213448]">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#213448]">
            My Profile
          </h1>
          <p className="text-[#547792] mt-2">Manage your personal information and preferences</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-[#EAE0CF]">
          
          {/* Profile Header with Gradient */}
          <div className="bg-gradient-to-r from-[#213448] to-[#4A70A9] px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-white bg-gradient-to-br from-[#4A70A9] to-[#BFABD4] flex items-center justify-center">
                  <UserCircleSolid className="h-24 w-24 text-white opacity-90" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#94B4C1] text-white rounded-full p-2 shadow-lg">
                  <ShieldCheckIcon className="h-5 w-5" />
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
                          className="bg-pink/100 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 w-full max-w-xs"
                          placeholder="Enter your name"
                        />
                      ) : (
                        customer.name
                      )}
                    </h2>
                    <p className="text-[#94B4C1] mt-1 flex items-center justify-center sm:justify-start space-x-1">
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>{customer.email}</span>
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
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-4">
                  <StatItem 
                    label="Total Bookings" 
                    value={customer.totalBookings} 
                    icon={<CalendarIcon className="h-5 w-5" />}
                    color="from-[#4A70A9] to-[#213448]"
                  />
                  <StatItem 
                    label="Member Since" 
                    value={customer.memberSince} 
                    icon={<UserCircleIcon className="h-5 w-5" />}
                    color="from-[#BFABD4] to-[#4A70A9]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="px-6 py-8 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-[#FBEFEF] rounded-lg">
                    <PhoneIcon className="h-6 w-6 text-[#4A70A9]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#213448]">Contact Information</h3>
                </div>

                <div className="space-y-4">
                  <InfoField 
                    label="Phone Number" 
                    value={isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9]"
                        placeholder="Enter phone number"
                      />
                    ) : customer.phone}
                    icon={<PhoneIcon className="h-5 w-5 text-[#547792]" />}
                  />
                  
                  <InfoField 
                    label="Email Address" 
                    value={customer.email}
                    icon={<EnvelopeIcon className="h-5 w-5 text-[#547792]" />}
                    isEditable={false}
                  />
                  
                  <InfoField 
                    label="Customer ID" 
                    value={customer._id}
                    icon={<UserCircleIcon className="h-5 w-5 text-[#547792]" />}
                    isEditable={false}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-[#FBEFEF] rounded-lg">
                    <HomeIcon className="h-6 w-6 text-[#4A70A9]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#213448]">Address Details</h3>
                </div>

                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <InfoField 
                        label="Street" 
                        value={
                          <input
                            type="text"
                            name="address.street"
                            value={editForm.address.street}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9]"
                            placeholder="Enter street address"
                          />
                        }
                        icon={<MapPinIcon className="h-5 w-5 text-[#547792]" />}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <InfoField 
                          label="City" 
                          value={
                            <input
                              type="text"
                              name="address.city"
                              value={editForm.address.city}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9]"
                              placeholder="City"
                            />
                          }
                          icon={<BuildingOfficeIcon className="h-5 w-5 text-[#547792]" />}
                        />
                        
                        <InfoField 
                          label="State" 
                          value={
                            <input
                              type="text"
                              name="address.state"
                              value={editForm.address.state}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9]"
                              placeholder="State"
                            />
                          }
                          icon={<MapPinIcon className="h-5 w-5 text-[#547792]" />}
                        />
                      </div>
                      
                      <InfoField 
                        label="Pincode" 
                        value={
                          <input
                            type="text"
                            name="address.pincode"
                            value={editForm.address.pincode}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-[#EAE0CF] rounded-lg focus:ring-2 focus:ring-[#4A70A9] focus:border-[#4A70A9]"
                            placeholder="Pincode"
                          />
                        }
                        icon={<MapPinIcon className="h-5 w-5 text-[#547792]" />}
                      />
                    </>
                  ) : (
                    <div className="bg-[#FBEFEF] rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-[#EAE0CF] rounded-lg">
                          <HomeIcon className="h-6 w-6 text-[#4A70A9]" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-[#213448] mb-2">Primary Address</h4>
                          <p className="text-[#547792]">{customer.address.street}</p>
                          <p className="text-[#547792]">
                            {customer.address.city}, {customer.address.state} - {customer.address.pincode}
                          </p>
                          <div className="mt-4 flex items-center text-sm text-[#547792]">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>Default delivery address</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8 pt-8 border-t border-[#EAE0CF]">
              <h3 className="text-lg font-semibold text-[#213448] mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard 
                  title="Account Created"
                  value={ 
                            accountInfo.joinedDate
                            ? new Date(accountInfo.joinedDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "—"
                        }
                  icon={<CalendarIcon className="h-8 w-8 text-[#4A70A9]" />}
                  bgColor="bg-[#FBEFEF]"
                />
                
                <InfoCard 
                  title="Profile Status"
                  value="Verified"
                  icon={<ShieldCheckIcon className="h-8 w-8 text-[#BFABD4]" />}
                  bgColor="bg-[#FBEFEF]"
                  badge={
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#94B4C1] text-white">
                      <CheckCircleSolid className="h-3 w-3 mr-1" />
                      Active
                    </span>
                  }
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 bg-[#FBEFEF] border-t border-[#EAE0CF] flex justify-end space-x-3">
            <button
              onClick={() => window.location.href = '/bookings'}
              className="px-4 py-2 bg-[#4A70A9] text-white rounded-lg hover:bg-[#213448] transition-colors font-medium"
            >
              View My Bookings
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className=" max-w-5xl mx-auto mt-8">
          <QuickStat 
            title="Services Used"
            value={customer.totalBookings}
            description="Completed services"
            bgColor="bg-[#4A70A9]"
            textColor="text-white"
          />


        </div>

        {/* Recent Activity (Optional Section) */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-[#EAE0CF]">
          <h3 className="text-lg font-semibold text-[#213448] mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-[#94B4C1]">No recent activity</p>
            ) : (
              recentActivities.map((activity) => (
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

// Reusable Components
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

const InfoField = ({ label, value, icon, isEditable = true }) => (
  <div className="flex items-start space-x-3">
    <div className="pt-1">{icon}</div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-[#213448] mb-1">
        {label}
      </label>
      <div className={`${isEditable ? '' : 'text-[#213448] font-medium'}`}>
        {value}
      </div>
    </div>
  </div>
);

const InfoCard = ({ title, value, icon, bgColor, badge }) => (
  <div className={`${bgColor} rounded-xl p-5 border border-[#EAE0CF]`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[#547792]">{title}</p>
        <p className="text-lg font-semibold text-[#213448] mt-1">{value}</p>
      </div>
      <div className="p-3 bg-white rounded-lg shadow-sm border border-[#EAE0CF]">
        {icon}
      </div>
    </div>
    {badge && <div className="mt-3">{badge}</div>}
  </div>
);

const QuickStat = ({ title, value, description, bgColor, textColor }) => (
  <div className={`${bgColor} rounded-xl shadow-md p-4 border border-[#EAE0CF]`}>
    <div className="flex items-center space-x-3">
      <div className={`h-12 w-12 ${textColor === 'text-white' ? 'bg-white/20' : 'bg-[#EAE0CF]'} rounded-lg flex items-center justify-center`}>
        <span className={`font-bold ${textColor}`}>{value}</span>
      </div>
      <div>
        <p className={`text-sm ${textColor === 'text-white' ? 'text-white/90' : 'text-[#547792]'}`}>{title}</p>
        <p className={`text-xl font-bold ${textColor}`}>{value}</p>
        <p className={`text-xs mt-1 ${textColor === 'text-white' ? 'text-white/70' : 'text-[#547792]'}`}>{description}</p>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ icon, text, time }) => (
  <div className="flex items-center justify-between py-2 border-b border-[#FBEFEF] last:border-0">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-[#FBEFEF] rounded-lg">
        {icon}
      </div>
      <span className="text-[#547792]">{text}</span>
    </div>
    <span className="text-sm text-[#94B4C1]">{time}</span>
  </div>
);

const formatTimeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

const getActivityIcon = (status) => {
  switch (status) {
    case "requested":
      return <CalendarIcon className="h-5 w-5 text-[#4A70A9]" />;
    case "accepted":
    case "work_done":
      return <CheckCircleSolid className="h-5 w-5 text-[#94B4C1]" />;
    case "in_progress":
      return <UserCircleIcon className="h-5 w-5 text-[#BFABD4]" />;
    case "cancelled":
      return <XMarkIcon className="h-5 w-5 text-red-500" />;
    default:
      return <CalendarIcon className="h-5 w-5 text-gray-400" />;
  }
};


export default CustomerProfilePage;