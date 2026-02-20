import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { addBooking } from "../redux/slices/bookingSlice";

const CreateBookingForm = () => {
  const [formData, setFormData] = useState({
    serviceType: '',
    expectedTime: '',
    fullAddress: '',
    city: '',
    pincode: '',
    landmark: '',
    state: '',
    lat: '',
    lng: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const getCurrentLocation = () => {
if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setFormData(prev => ({
        ...prev,
        lat: position.coords.latitude.toString(),
        lng: position.coords.longitude.toString()
      }));
    },
    (error) => {
      alert("Unable to retrieve your location. Please allow location access.");
      console.error(error);
    }
  );
};

const { workerEmail } = useParams(); 
const dispatch = useDispatch();

const token = localStorage.getItem("token");

const bookings = useSelector(state => state.bookings.bookings);

useEffect(() => {
  console.log("REDUX BOOKINGS:", bookings);
}, [bookings]);

  const handleSubmit = async (e) => {
  e.preventDefault();


  try {
    const res = await axios.post(
      "http://localhost:5000/api/booking/createBookingRequest",
      {
        workerEmail: workerEmail,

        serviceType: formData.serviceType,
        expectedTime: formData.expectedTime,

        serviceAddress: {
          fullAddress: formData.fullAddress,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
          lat: formData.lat,
          lng: formData.lng
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (res.data.success) {
      const booking = res.data.booking;

      dispatch(addBooking({
        _id: booking._id,
        workerId: booking.workerId,
        workerEmail: booking.workerEmail,
        serviceType: booking.serviceType,
        status: booking.status
      }));
      alert("Booking successfull")
    } else {
      alert(res.data.message);
    }

  } catch (error) {
    console.error("Booking creation failed:", error);
    alert(
      error?.response?.data?.message ||
      "Failed to create booking"
    );
  }
};

  const serviceTypes = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Cleaning',
    'Painting',
    'Pest Control',
    'Appliance Repair',
    'Other'
  ];

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#F9F7F7' }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#112D4E' }}>
            Create Booking
          </h1>
          <p className="text-lg" style={{ color: '#3F72AF' }}>
            Provide basic details about the work
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left decorative panel */}
            <div className="md:w-1/3 p-8 hidden md:block" style={{ backgroundColor: '#DBE2EF' }}>
              <div className="h-full flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3F72AF' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: '#112D4E' }}>Service Details</h3>
                      <p className="text-sm" style={{ color: '#3F72AF' }}>Choose service type & time</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3F72AF' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold" style={{ color: '#112D4E' }}>Service Address</h3>
                      <p className="text-sm" style={{ color: '#3F72AF' }}>Complete address details</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="md:w-2/3 p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Details Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ color: '#112D4E', borderColor: '#DBE2EF' }}>
                    Service Details
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Service Type */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#3F72AF' }}>
                        Service Type *
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition"
                        style={{ 
                          backgroundColor: '#F9F7F7',
                          borderColor: '#DBE2EF',
                          color: '#112D4E'
                        }}
                        required
                      >
                        <option value="">Select a service type</option>
                        {serviceTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Expected Time */}
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#3F72AF' }}>
                        Expected Time for Service *
                      </label>
                      <input
                        type="datetime-local"
                        name="expectedTime"
                        value={formData.expectedTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition"
                        style={{ 
                          backgroundColor: '#F9F7F7',
                          borderColor: '#DBE2EF',
                          color: '#112D4E'
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Service Address Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ color: '#112D4E', borderColor: '#DBE2EF' }}>
                    Service Address
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Full Address */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2" style={{ color: '#3F72AF' }}>
                          Full Address *
                        </label>
                        <textarea
                          name="fullAddress"
                          value={formData.fullAddress}
                          onChange={handleChange}
                          rows="3"
                          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition"
                          style={{ 
                            backgroundColor: '#F9F7F7',
                            borderColor: '#DBE2EF',
                            color: '#112D4E'
                          }}
                          required
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#3F72AF' }}>
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition"
                          style={{ 
                            backgroundColor: '#F9F7F7',
                            borderColor: '#DBE2EF',
                            color: '#112D4E'
                          }}
                          required
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#3F72AF' }}>
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition"
                          style={{ 
                            backgroundColor: '#F9F7F7',
                            borderColor: '#DBE2EF',
                            color: '#112D4E'
                          }}
                          required
                        />
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#3F72AF' }}>
                          Pincode *
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition"
                          style={{ 
                            backgroundColor: '#F9F7F7',
                            borderColor: '#DBE2EF',
                            color: '#112D4E'
                          }}
                          required
                        />
                      </div>

                      {/* Landmark */}
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#3F72AF' }}>
                          Landmark (Optional)
                        </label>
                        <input
                          type="text"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition"
                          style={{ 
                            backgroundColor: '#F9F7F7',
                            borderColor: '#DBE2EF',
                            color: '#112D4E'
                          }}
                        />
                      </div>
                    </div>

                    {/* Coordinates */}
                    <div className="pt-2">
                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="mb-4 px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: '#3F72AF' }}
                    >
                        Use My Current Location
                    </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#3F72AF' }}>
                        Latitude (Optional)
                        </label>
                        <input
                        type="text"
                        name="lat"
                        value={formData.lat}
                        onChange={handleChange}
                        placeholder="e.g., 40.7128"
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition"
                        style={{ 
                            backgroundColor: '#F9F7F7',
                            borderColor: '#DBE2EF',
                            color: '#112D4E'
                        }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#3F72AF' }}>
                        Longitude (Optional)
                        </label>
                        <input
                        type="text"
                        name="lng"
                        value={formData.lng}
                        onChange={handleChange}
                        placeholder="e.g., -74.0060"
                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition"
                        style={{ 
                            backgroundColor: '#F9F7F7',
                            borderColor: '#DBE2EF',
                            color: '#112D4E'
                        }}
                        />
                    </div>
                    </div>

                  </div>
                </div>

                {/* Form Actions */}
                <div className="pt-6 border-t" style={{ borderColor: '#DBE2EF' }}>
                  <div className="flex flex-col md:flex-row gap-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 rounded-lg font-semibold text-white transition transform hover:scale-[1.02]"
                      style={{ backgroundColor: '#112D4E' }}
                    >
                      Create Booking
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        serviceType: '',
                        expectedTime: '',
                        fullAddress: '',
                        city: '',
                        pincode: '',
                        landmark: '',
                        state: '',
                        lat: '',
                        lng: ''
                      })}
                      className="px-6 py-3 rounded-lg font-semibold transition"
                      style={{ 
                        backgroundColor: '#F9F7F7',
                        color: '#3F72AF',
                        border: '2px solid #DBE2EF'
                      }}
                    >
                      Clear Form
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CreateBookingForm;