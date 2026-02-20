import React, { useState } from "react";
import axios from "axios";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Home,
  Building,
  Navigation,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Shield,
  Heart
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomerProfileSetup = () => {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    street:"",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
    lat:0,
    lng:0
  });

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [addressType, setAddressType] = useState("home");

  const navigate = useNavigate();
  const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Contact Details", icon: Phone },
    { id: 3, title: "Address", icon: MapPin }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setForm({ ...form, phoneNumber: value });
    }
  };


  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateForm = (step) => {
  // STEP 1: Personal Info
  if (step === 1) {
    if (!form.fullName.trim()) {
      alert("Please enter your full name");
      return false;
    }
    if (!form.dateOfBirth) {
      alert("Please select your date of birth");
      return false;
    }
    if (calculateAge(form.dateOfBirth) < 18) {
      alert("You must be at least 18 years old to register");
      return false;
    }
  }

  // STEP 2: Contact Info
  if (step === 2) {
    if (form.phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return false;
    }
  }

  // STEP 3: Address
  if (step === 3) {
    if (!form.street?.trim()) {
      alert("Please enter your address");
      return false;
    }
    if (!form.city?.trim()) {
      alert("Please enter your city");
      return false;
    }
    if (!form.pinCode?.trim()) {
      alert("Please enter your PIN code");
      return false;
    }
  }

  return true;
};


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);

  try {
    const token = localStorage.getItem("token"); // JWT from login

    const payload = {
      name: form.fullName,
      phone: form.phoneNumber,
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pinCode,
      },
      location: {
        latitude: form.lat,
        longitude: form.lng,
      },
    };

    const res = await axios.post(
      "http://localhost:5000/api/customer/createCustomerProfile",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Profile created successfully 🎉");
    console.log("Profile:", res.data.profile);

  } catch (error) {
    console.error("Profile error:", error);
    alert(
      error.response?.data?.message || "Failed to save profile"
    );
  } finally {
    setLoading(false);
    navigate("/customerprofilepage")
  }
};


  const nextStep = () => {
    if (currentStep === 1 && (!form.fullName || !form.dateOfBirth)) {
      alert("Please fill in name and date of birth");
      return;
    }
    if (currentStep === 2 && form.phoneNumber.length !== 10) {
      alert("Please enter a valid phone number");
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm(prev => ({
          ...prev,
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }));
      },
      (error) => {
        alert("Unable to fetch location. Please allow location access.");
      }
    );
  };
  const focusStyle = (e) => {
    e.target.style.borderColor = '#3F72AF';
    e.target.style.boxShadow = '0 0 0 4px rgba(63, 114, 175, 0.1)';
  };

  const blurStyle = (e) => {
    e.target.style.borderColor = 'transparent';
    e.target.style.boxShadow = 'none';
  };



  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F9F7F7' }}>
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div 
              className="flex items-center justify-center w-24 h-24 rounded-3xl shadow-xl relative overflow-hidden"
              style={{ backgroundColor: '#112D4E' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
              <Heart className="w-12 h-12" style={{ color: '#F9F7F7' }} />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3" style={{ color: '#112D4E' }}>
            Complete Your <span style={{ color: '#3F72AF' }}>Profile</span>
          </h1>
          <p className="text-xl" style={{ color: '#3F72AF' }}>
            A few more details to personalize your experience
          </p>
        </div>

        {/* Features */}
        <div className="flex justify-center gap-4 mb-10">
          <span className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-sm" 
            style={{ backgroundColor: '#DBE2EF', color: '#3F72AF' }}>
            <Sparkles className="w-4 h-4" /> Personalized Service
          </span>
          <span className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-sm"
            style={{ backgroundColor: '#DBE2EF', color: '#3F72AF' }}>
            <Shield className="w-4 h-4" /> Secure & Private
          </span>
          <span className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-sm"
            style={{ backgroundColor: '#DBE2EF', color: '#3F72AF' }}>
            <Navigation className="w-4 h-4" /> Better Local Results
          </span>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center relative z-10">
                    <div 
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${
                        isCompleted ? 'shadow-lg scale-110' : ''
                      }`}
                      style={{
                        backgroundColor: isActive || isCompleted ? '#3F72AF' : '#DBE2EF',
                        color: isActive || isCompleted ? '#F9F7F7' : '#3F72AF',
                        border: isActive ? '3px solid #112D4E' : 'none'
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span 
                      className={`text-sm font-medium ${isActive ? 'font-bold' : ''}`}
                      style={{ color: isActive ? '#112D4E' : '#3F72AF' }}
                    >
                      {step.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div 
                      className="flex-1 h-1 mx-4 -mt-7"
                      style={{ 
                        backgroundColor: step.id < currentStep ? '#3F72AF' : '#DBE2EF' 
                      }}
                    ></div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Form Card */}
        <div 
          className="rounded-3xl shadow-2xl p-8"
          style={{ backgroundColor: '#DBE2EF' }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#112D4E' }}>
                  <User className="inline-block mr-3" size={28} />
                  Personal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <User className="w-5 h-5" style={{ color: '#3F72AF' }} />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="John Doe"
                        value={form.fullName}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none"
                        style={{
                          backgroundColor: '#F9F7F7',
                          color: '#112D4E',
                          border: '2px solid transparent'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3F72AF';
                          e.target.style.boxShadow = '0 0 0 4px rgba(63, 114, 175, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'transparent';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                        Date of Birth
                      </label>
                      {form.dateOfBirth && (
                        <span className="text-sm font-medium px-3 py-1 rounded-full" 
                          style={{ backgroundColor: '#3F72AF', color: '#F9F7F7' }}>
                          Age: {calculateAge(form.dateOfBirth)}
                        </span>
                      )}
                    </div>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Calendar className="w-5 h-5" style={{ color: '#3F72AF' }} />
                      </div>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={form.dateOfBirth}
                        onChange={handleChange}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full pl-12 pr-4 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none"
                        style={{
                          backgroundColor: '#F9F7F7',
                          color: '#112D4E',
                          border: '2px solid transparent'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3F72AF';
                          e.target.style.boxShadow = '0 0 0 4px rgba(63, 114, 175, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'transparent';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#112D4E' }}>
                  <Phone className="inline-block mr-3" size={28} />
                  Contact Details
                </h2>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Phone Number
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Phone className="w-5 h-5" style={{ color: '#3F72AF' }} />
                      </div>
                      <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="9876543210"
                        value={form.phoneNumber}
                        onChange={handlePhoneChange}
                        className="w-full pl-12 pr-4 py-4 rounded-xl font-medium text-lg tracking-wider transition-all duration-300 focus:outline-none"
                        style={{
                          backgroundColor: '#F9F7F7',
                          color: '#112D4E',
                          border: '2px solid transparent'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3F72AF';
                          e.target.style.boxShadow = '0 0 0 4px rgba(63, 114, 175, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'transparent';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      {form.phoneNumber.length === 10 && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <CheckCircle className="w-5 h-5" style={{ color: '#3F72AF' }} />
                        </div>
                      )}
                    </div>
                    <p className="text-sm opacity-75" style={{ color: '#3F72AF' }}>
                      We'll only use this for important updates and service communication
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#112D4E' }}>
                  <MapPin className="inline-block mr-3" size={28} />
                  Address Information
                </h2>
                
                <div className="space-y-6">
                  {/* Address Type */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Address Type
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setAddressType("home")}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                          addressType === "home" 
                            ? 'border-white shadow-lg transform scale-[1.02]' 
                            : 'border-transparent hover:border-white/50'
                        }`}
                        style={{
                          backgroundColor: addressType === "home" ? '#3F72AF' : '#F9F7F7',
                          color: addressType === "home" ? '#F9F7F7' : '#112D4E'
                        }}
                      >
                        <Home className="w-6 h-6" />
                        Home
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddressType("work")}
                        className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                          addressType === "work" 
                            ? 'border-white shadow-lg transform scale-[1.02]' 
                            : 'border-transparent hover:border-white/50'
                        }`}
                        style={{
                          backgroundColor: addressType === "work" ? '#3F72AF' : '#F9F7F7',
                          color: addressType === "work" ? '#F9F7F7' : '#112D4E'
                        }}
                      >
                        <Building className="w-6 h-6" />
                        Work
                      </button>
                    </div>
                </div>

                  {/* Address Fields */}
                <div className="grid md:grid-cols-2 gap-6">

                  {/* Street */}
                  <div className="space-y-3 md:col-span-2">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Street
                    </label>
                    <input
                      type="text"
                      name="street"
                      placeholder="House No, Street, Area"
                      value={form.street}
                      onChange={handleChange}
                      className="w-full px-4 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none"
                      style={{ backgroundColor: '#F9F7F7', color: '#112D4E', border: '2px solid transparent' }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-4 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none"
                      style={{ backgroundColor: '#F9F7F7', color: '#112D4E', border: '2px solid transparent' }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>

                  {/* State */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-4 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none"
                      style={{ backgroundColor: '#F9F7F7', color: '#112D4E', border: '2px solid transparent' }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>

                  {/* Pin Code */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Pin Code
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      placeholder="PIN Code"
                      value={form.pinCode}
                      onChange={handleChange}
                      className="w-full px-4 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none"
                      style={{ backgroundColor: '#F9F7F7', color: '#112D4E', border: '2px solid transparent' }}
                      onFocus={focusStyle}
                      onBlur={blurStyle}
                    />
                  </div>

                </div>
                
                <div className="pt-4 flex flex-col items-center">
                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="px-5 py-3 rounded-xl font-semibold text-white transition-all flex items-center gap-2"
                        style={{ backgroundColor: '#3F72AF' }}
                    >
                        <span>Use My Current Location</span>
                        <MapPin size={18} />
                    </button>

                  {form.lat !== 0 && form.lng !== 0 && (
                    <div className="mt-3 flex justify-center">
                        <div className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-2 shadow-sm">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full" style={{ backgroundColor: '#2D336B' }}>
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium" style={{ color: '#2D336B' }}>Location Captured</span>
                        </div>
                    </div>
                  )}
                </div>


                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t" style={{ borderColor: '#3F72AF' }}>
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: currentStep === 1 ? '#DBE2EF' : '#F9F7F7',
                  color: '#112D4E'
                }}
              >
                Back
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                  style={{ 
                    backgroundColor: '#3F72AF',
                    color: '#F9F7F7'
                  }}
                >
                  Next Step
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{ 
                    backgroundColor: '#112D4E',
                    color: '#F9F7F7'
                  }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>
                      Complete Profile
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Privacy Note */}
        <div className="text-center mt-8">
          <p className="text-sm opacity-75" style={{ color: '#3F72AF' }}>
            🔒 Your information is secure and will only be used to provide you with better service
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileSetup;