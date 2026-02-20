import React, { useState } from "react";
import axios from "axios";

import {
  User,
  Phone,
  Calendar,
  Briefcase,
  Star,
  MapPin,
  Landmark,
  Navigation,
  Hash,
  Wrench,
  Shield,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Home,
  Building,
  Award,
   Banknote,
  CreditCard,
  FileText,
   Camera
} from "lucide-react";

const WorkerProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [submittedSteps, setSubmittedSteps] = useState({
    profile: false,
    address: false,
    bank: false
  });


  const [form, setForm] = useState({
    // Personal Details
    fullName: "",
    phoneNumber: "",
    dateOfBirth: "",
    profilePhoto: null,
    // Professional Details
    serviceCategory: "",
    experienceYears: "",
    skills: [],
    description: "",
    
    // Address
   // Address
    addressType: "home",
    houseNumber: "",
    street: "",
    area: "",
    landmark: "",
    city: "",
    district: "",
    state: "",
    pincode: "",
    longitude: 0,
    latitude: 0,

    
    // Bank Details
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    upiId: "",
    
    // Documents (for future upload)
    aadharNumber: "",
    panNumber: "",
  });

const [documents, setDocuments] = useState({
  aadhar: {
    number: "",
    file: null
  },
  workProof: {
    documentType: "", // SKILL_CERTIFICATE / LICENSE / EXPERIENCE_CERTIFICATE
    documentName: "",
    file: null
  }
});


const token = localStorage.getItem("token");
  const serviceCategories = [
    "Plumber",
    "Electrician",
    "Carpenter",
    "Painter",
    "Cleaner",
    "AC Repair",
    "Appliance Repair",
    "Gardener",
    "Driver",
    "Cook",
    "Beautician",
    "Tailor",
    "Mason",
    "Welder",
    "Mechanic"
  ];

  const skillsList = [
    "Pipe Installation", "Leak Repair", "Electrical Wiring", "Switchboard Repair",
    "Furniture Making", "Woodworking", "Wall Painting", "Waterproofing",
    "Deep Cleaning", "Sanitization", "AC Service", "Refrigerator Repair",
    "Landscaping", "Gardening", "Driving", "Vehicle Maintenance",
    "Cooking", "Baking", "Hair Styling", "Makeup Artistry",
    "Stitching", "Alterations", "Brick Work", "Tiling",
    "Metal Work", "Welding", "Engine Repair", "Brake Service"
  ];

  const steps = [
    { id: 1, title: "Personal Info", icon: User },
    { id: 2, title: "Professional", icon: Briefcase },
    { id: 3, title: "Address", icon: MapPin },
    { id: 4, title: "Bank Details", icon: CreditCard },
    { id: 5, title: "Documents", icon: FileText }
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

  const handleAccountNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      setForm({ ...form, accountNumber: value });
    }
  };

  const toggleSkill = (skill) => {
    if (form.skills.includes(skill)) {
      setForm({
        ...form,
        skills: form.skills.filter(s => s !== skill)
      });
    } else if (form.skills.length < 10) {
      setForm({
        ...form,
        skills: [...form.skills, skill]
      });
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

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
      },
      (error) => {
        alert("Unable to fetch location. Please allow location access.");
      }
    );
  };

 const validateStep = () => {
  switch (step) {

    /* ---------------- STEP 1: Personal Details ---------------- */
    case 1:
      if (!form.fullName.trim()) {
        alert("Please enter your full name");
        return false;
      }

      if (!form.dateOfBirth) {
        alert("Please select your date of birth");
        return false;
      }

      if (calculateAge(form.dateOfBirth) < 18) {
        alert("You must be at least 18 years old to register as a worker");
        return false;
      }

      if (form.phoneNumber.length !== 10) {
        alert("Please enter a valid 10-digit phone number");
        return false;
      }

      return true;

    /* ---------------- STEP 2: Professional Details ---------------- */
    case 2:
      if (!form.serviceCategory) {
        alert("Please select your service category");
        return false;
      }

      if (
        !form.experienceYears ||
        isNaN(form.experienceYears) ||
        parseInt(form.experienceYears) < 0
      ) {
        alert("Please enter valid years of experience");
        return false;
      }

      if (!form.skills || form.skills.length === 0) {
        alert("Please select at least one skill");
        return false;
      }

      if (!form.description.trim()) {
        alert("Please add a short description about your work");
        return false;
      }

      return true;

    /* ---------------- STEP 3: Address Details ---------------- */
    case 3:
      if (!form.addressType) {
        alert("Please select address type");
        return false;
      }

      if (!form.houseNumber.trim()) {
        alert("Please enter house number");
        return false;
      }

      if (!form.street.trim()) {
        alert("Please enter street name");
        return false;
      }

      if (!form.area.trim()) {
        alert("Please enter area");
        return false;
      }

      if (!form.city.trim()) {
        alert("Please enter your city");
        return false;
      }

      if (!form.state.trim()) {
        alert("Please enter your state");
        return false;
      }

      if (!form.pincode.trim() || form.pincode.length !== 6) {
        alert("Please enter a valid 6-digit PIN code");
        return false;
      }

      return true;

    /* ---------------- STEP 4: Bank Details ---------------- */
    case 4:
      if (!form.accountHolderName.trim()) {
        alert("Please enter account holder name");
        return false;
      }

      if (!form.bankName.trim()) {
        alert("Please enter bank name");
        return false;
      }

      if (!form.accountNumber || form.accountNumber.length < 9) {
        alert("Please enter a valid account number");
        return false;
      }

      if (!form.ifscCode.trim()) {
        alert("Please enter IFSC code");
        return false;
      }

      return true;
      /* ---------------- STEP 5: Documents ---------------- */
      case 5:
        // Aadhaar validation (optional but if entered, must be valid)
      if (documents.aadhar.number.length !== 12) {
        if (documents.aadhar.number) {
            alert("Please enter a valid 12-digit Aadhaar number");
            return false;
          }

          if (!documents.aadhar.file) {
            alert("Please upload Aadhaar document");
            return false;
          }
        }

        // Skill / Work certificate (at least one proof required)
      if (!documents.workProof.file) {
          alert("Please upload at least one work or skill certificate");
          return false;
      }

      return true;

    default:
      return true;
  }
};


const nextStep = async () => {
  if (!validateStep()) return;

  try {
    setLoading(true);

    // STEP 1 & 2 → PROFILE
    if (step === 2 && !submittedSteps.profile) {

      const age = calculateAge(form.dateOfBirth);

      const formData = new FormData();
      formData.append("name", form.fullName);
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("age", age);
      formData.append("experienceYears", form.experienceYears);
      formData.append("serviceName", form.serviceCategory);
      formData.append("skills",form.skills);

      if (form.profilePhoto) {
        formData.append("photo", form.profilePhoto);
      }

      await axios.post(
        "http://localhost:5000/api/worker/createWorkerProfile",
        formData,
        { headers: { Authorization: `Bearer ${token}`,"Content-Type": "multipart/form-data", } }
      );

      setSubmittedSteps(prev => ({ ...prev, profile: true }));
    }

    // STEP 3 → ADDRESS
    if (step === 3 && !submittedSteps.address) {
      await axios.post(
        "http://localhost:5000/api/worker/createWorkerAddress",
        {
          addressType: form.addressType,
          latitude: form.latitude,
          longitude: form.longitude,
          houseNumber: form.houseNumber,
          street: form.street,
          area: form.area,
          landmark: form.landmark,
          city: form.city,
          district: form.district,
          state: form.state,
          pincode: form.pincode
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmittedSteps(prev => ({ ...prev, address: true }));
    }

    // STEP 4 → BANK
    if (step === 4 && !submittedSteps.bank) {
      await axios.post(
        "http://localhost:5000/api/worker/addWorkerBankDetails",
        {
          accountHolderName: form.accountHolderName,
          bankName: form.bankName,
          accountNumber: form.accountNumber,
          ifscCode: form.ifscCode,
          upiId: form.upiId || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmittedSteps(prev => ({ ...prev, bank: true }));
    }

    setStep(step + 1);
  } catch (err) {
    alert(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    // Aadhaar (optional)
    if (documents.aadhar?.file) {
      const aadharForm = new FormData();
      aadharForm.append("documentType", "AADHAR");
      aadharForm.append("documentNumber", documents.aadhar.number);
      aadharForm.append("documentName", "Aadhaar Card");
      aadharForm.append("document", documents.aadhar.file);

      await axios.post(
        "http://localhost:5000/api/worker/uploadWorkerDocument",
        aadharForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    // Work Proof (mandatory)
    const workProofForm = new FormData();
    workProofForm.append("documentType", documents.workProof.documentType);
    workProofForm.append("documentName", documents.workProof.documentName);
    workProofForm.append("document", documents.workProof.file);

    await axios.post(
      "http://localhost:5000/api/worker/uploadWorkerDocument",
      workProofForm,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("🎉 Worker profile submitted successfully!");
  } catch (error) {
    alert(error.response?.data?.message || "Upload failed");
  } finally {
    setLoading(false);
  }
};



  const inputBase =
  "w-full pl-12 pr-4 py-4 rounded-xl bg-[#F9F7F7] text-[#112D4E] " +
  "border-2 border-transparent shadow-sm transition-all " +
  "focus:outline-none focus:border-[#3F72AF] focus:ring-2 focus:ring-[#3F72AF]/20";


  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F9F7F7' }}>
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div 
              className="flex items-center justify-center w-24 h-24 rounded-3xl shadow-xl relative overflow-hidden"
              style={{ backgroundColor: '#112D4E' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
              <Wrench className="w-12 h-12" style={{ color: '#F9F7F7' }} />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3" style={{ color: '#112D4E' }}>
            Become a <span style={{ color: '#3F72AF' }}>WorkWiz</span> Professional
          </h1>
          <p className="text-xl" style={{ color: '#3F72AF' }}>
            Join our network of skilled professionals and start earning today
          </p>
        </div>

        {/* Features */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          <span className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-sm" 
            style={{ backgroundColor: '#DBE2EF', color: '#3F72AF' }}>
            <Sparkles className="w-4 h-4" /> Verified Professionals
          </span>
          <span className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-sm"
            style={{ backgroundColor: '#DBE2EF', color: '#3F72AF' }}>
            < Banknote className="w-4 h-4" /> Payments based on your services
          </span>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon;
              const isActive = stepItem.id === step;
              const isCompleted = stepItem.id < step;
              
              return (
                <React.Fragment key={stepItem.id}>
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
                      {stepItem.title}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div 
                      className="flex-1 h-1 mx-4 -mt-7"
                      style={{ 
                        backgroundColor: stepItem.id < step ? '#3F72AF' : '#DBE2EF' 
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
          className="rounded-3xl shadow-2xl p-8 mb-8"
          style={{ backgroundColor: '#DBE2EF' }}
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#112D4E' }}>
                  <User className="mr-3" size={28} />
                  Personal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Full Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <User className="w-5 h-5" style={{ color: '#3F72AF' }} />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Rajesh Kumar"
                        value={form.fullName}
                        onChange={handleChange}
                        required
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
                        Date of Birth *
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
                        required
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
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Phone Number *
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
                        required
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
                  </div>
                </div>
              <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-[#3F72AF] overflow-hidden bg-[#F9F7F7] flex items-center justify-center">
                  {form.profilePhoto ? (
                    <img
                      src={URL.createObjectURL(form.profilePhoto)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} color="#3F72AF" />
                  )}
                </div>

                <label className="absolute bottom-0 right-0 bg-[#3F72AF] p-2 rounded-full cursor-pointer">
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) =>
                      setForm(prev => ({
                        ...prev,
                        profilePhoto: e.target.files[0],
                      }))
                    }
                  />
                </label>
              </div>

              <p className="text-sm text-gray-500 font-medium">
                Upload Profile Photo
              </p>
            </div>
            </div>
            )}

            {/* Step 2: Professional Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#112D4E' }}>
                  <Briefcase className="mr-3" size={28} />
                  Professional Details
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Service Category *
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Wrench className="w-5 h-5" style={{ color: '#3F72AF' }} />
                      </div>
                      <select
                        name="serviceCategory"
                        value={form.serviceCategory}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none appearance-none"
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
                      >
                        <option value="">Select your service</option>
                        {serviceCategories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Experience (Years) *
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Award className="w-5 h-5" style={{ color: '#3F72AF' }} />
                      </div>
                      <input
                        type="number"
                        name="experienceYears"
                        placeholder="5"
                        value={form.experienceYears}
                        onChange={handleChange}
                        min="0"
                        max="50"
                        required
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

                {/* Skills Selection */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Skills & Expertise *
                    </label>
                    <span className="text-sm" style={{ color: '#3F72AF' }}>
                      {form.skills.length}/10 selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          form.skills.includes(skill)
                            ? 'shadow-md transform scale-105'
                            : 'hover:shadow'
                        }`}
                        style={{
                          backgroundColor: form.skills.includes(skill) ? '#3F72AF' : '#F9F7F7',
                          color: form.skills.includes(skill) ? '#F9F7F7' : '#112D4E',
                          border: '2px solid transparent'
                        }}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                    About Your Service (Optional)
                  </label>
                  <textarea
                    name="description"
                    placeholder="Briefly describe your services, specialties, and approach..."
                    value={form.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none resize-none"
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
            )}

            {/* Step 3: Address */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#112D4E' }}>
                  <MapPin className="mr-3" size={28} />
                  Address Information
                </h2>
                
                <div className="space-y-6">
                  {/* Address Type */}
                 <div className="space-y-3"> 
                        <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() =>
                                      setForm(prev => ({ ...prev, addressType: "home" }))
                                    }
                            className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                            form.addressType === "home"
                                ? 'border-white shadow-lg transform scale-[1.02]' 
                                : 'border-transparent hover:border-white/50'
                            }`}
                            style={{
                            backgroundColor: form.addressType === "home" ? '#3F72AF' : '#F9F7F7',
                            color: form.addressType === "home" ? '#F9F7F7' : '#112D4E'
                            }}
                        >
                            <Home className="w-6 h-6" />
                            Home Address
                        </button>
                        <button
                            type="button"
                            onClick={() =>
                                      setForm(prev => ({ ...prev, addressType: "work" }))
                                    }
                            className={`flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl font-semibold transition-all duration-300 border-2 ${
                            form.addressType === "work" 
                                ? 'border-white shadow-lg transform scale-[1.02]' 
                                : 'border-transparent hover:border-white/50'
                            }`}
                            style={{
                            backgroundColor: form.addressType === "work" ? '#3F72AF' : '#F9F7F7',
                            color: form.addressType === "work" ? '#F9F7F7' : '#112D4E'
                            }}
                        >
                            <Building className="w-6 h-6" />
                            Work Address
                        </button>
                        </div>
                    </div>

                    {/* Address Fields */}
                    <div className="grid md:grid-cols-2 gap-6">


                        {/* House Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#112D4E]">
                            House / Flat No *
                            </label>
                            <div className="relative">
                            <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F72AF]" />
                            <input
                                type="text"
                                name="houseNumber"
                                required
                                placeholder="Flat / House No"
                                value={form.houseNumber}
                                onChange={handleChange}
                                className={inputBase}
                            />
                            </div>
                        </div>

                        {/* Street */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#112D4E]">
                            Street *
                            </label>
                            <div className="relative">
                            <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F72AF]" />
                            <input
                                type="text"
                                name="street"
                                required
                                placeholder="Street name"
                                value={form.street}
                                onChange={handleChange}
                                className={inputBase}
                            />
                            </div>
                        </div>

                        {/* Area */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#112D4E]">
                            Area / Locality *
                            </label>
                            <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F72AF]" />
                            <input
                                type="text"
                                name="area"
                                required
                                placeholder="Area / Locality"
                                value={form.area}
                                onChange={handleChange}
                                className={inputBase}
                            />
                            </div>
                        </div>

                        {/* Landmark */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#112D4E]">
                            Landmark (Optional)
                            </label>
                            <div className="relative">
                            <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F72AF]" />
                            <input
                                type="text"
                                name="landmark"
                                placeholder="Nearby landmark"
                                value={form.landmark}
                                onChange={handleChange}
                                className={inputBase}
                            />
                            </div>
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#112D4E]">
                            City *
                            </label>
                            <div className="relative">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F72AF]" />
                            <input
                                type="text"
                                name="city"
                                required
                                placeholder="City"
                                value={form.city}
                                onChange={handleChange}
                                className={inputBase}
                            />
                            </div>
                        </div>

                        {/* District */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#112D4E]">
                            District
                            </label>
                            <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F72AF]" />
                            <input
                                type="text"
                                name="district"
                                placeholder="District"
                                value={form.district}
                                onChange={handleChange}
                                className={inputBase}
                            />
                            </div>
                        </div>

                        {/* State */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#112D4E]">
                            State *
                            </label>
                            <select
                            name="state"
                            required
                            value={form.state}
                            onChange={handleChange}
                            className={`${inputBase} pl-4 cursor-pointer`}
                            >
                            <option value="">Select State</option>
                            <option>Andhra Pradesh</option>
                            <option>Karnataka</option>
                            <option>Tamil Nadu</option>
                            <option>Telangana</option>
                            <option>Kerala</option>
                            <option>Maharashtra</option>
                            <option>Delhi</option>
                            <option>West Bengal</option>
                            <option>Rajasthan</option>
                            <option>Uttar Pradesh</option>
                            </select>
                        </div>

                        {/* Pincode */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[#112D4E]">
                            Pincode *
                            </label>
                            <div className="relative">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3F72AF]" />
                            <input
                                type="text"
                                name="pincode"
                                required
                                placeholder="6-digit PIN"
                                value={form.pincode}
                                onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                                handleChange({ target: { name: "pincode", value } });
                                }}
                                className={`${inputBase} tracking-widest text-center`}
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
                        
                            {form.latitude !== 0 && form.longitude !== 0 && (
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
              </div>
            )}

            {/* Step 4: Bank Details */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#112D4E' }}>
                  <CreditCard className="mr-3" size={28} />
                  Bank Details for Payments
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Account Holder Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <User className="w-5 h-5" style={{ color: '#3F72AF' }} />
                      </div>
                      <input
                        type="text"
                        name="accountHolderName"
                        placeholder="Same as your name"
                        value={form.accountHolderName}
                        onChange={handleChange}
                        required
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
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Bank Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <FileText className="w-5 h-5" style={{ color: '#3F72AF' }} />
                      </div>
                      <input
                        type="text"
                        name="bankName"
                        placeholder="State Bank of India"
                        value={form.bankName}
                        onChange={handleChange}
                        required
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
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      Account Number *
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <CreditCard className="w-5 h-5" style={{ color: '#3F72AF' }} />
                      </div>
                      <input
                        type="text"
                        name="accountNumber"
                        placeholder="123456789012"
                        value={form.accountNumber}
                        onChange={handleAccountNumberChange}
                        required
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
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      IFSC Code *
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <FileText className="w-5 h-5" style={{ color: '#3F72AF' }} />
                      </div>
                      <input
                        type="text"
                        name="ifscCode"
                        placeholder="SBIN0001234"
                        value={form.ifscCode}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none uppercase"
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
                    <label className="block text-sm font-semibold uppercase tracking-wide" style={{ color: '#112D4E' }}>
                      UPI ID (Optional)
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      placeholder="username@upi"
                      value={form.upiId}
                      onChange={handleChange}
                      className="w-full px-4 py-4 rounded-xl font-medium transition-all duration-300 focus:outline-none"
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

                {/* Note */}
                <div className="p-4 rounded-xl" style={{ backgroundColor: '#F9F7F7', color: '#3F72AF' }}>
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Your bank details are securely encrypted and only used for processing payments
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Documents */}
            {step === 5 && ( 
              <div className="space-y-8">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-[#112D4E]">
                  <FileText className="w-6 h-6" /> Upload Documents
                </h2>

                {/* Aadhaar (Optional) */}
                <div className="space-y-4 p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#112D4E] text-lg">
                      Aadhaar Number (Optional)
                    </label>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Optional</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Aadhaar Number</p>
                      <input
                        type="text"
                        maxLength={12}
                        placeholder="12-digit Aadhaar"
                        className={`${inputBase} text-center tracking-widest text-lg`}
                        value={documents.aadhar.number}
                        onChange={(e) =>
                          setDocuments(prev => ({
                            ...prev,
                            aadhar: {
                              ...prev.aadhar,
                              number: e.target.value.replace(/\D/g, "").slice(0, 12)
                            }
                          }))
                        }
                      />
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {documents.aadhar.number.length}/12 digits
                        </span>
                        {documents.aadhar.number.length === 12 && (
                          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Valid format
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Upload Aadhaar Document</p>
                      <label className={`
                        flex flex-col items-center justify-center w-full h-32
                        border-2 border-dashed rounded-lg cursor-pointer
                        transition-all duration-200
                        ${documents.aadhar.file 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }
                      `}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {documents.aadhar.file ? (
                            <>
                              <svg className="w-8 h-8 mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-sm font-medium text-green-700">
                                {documents.aadhar.file.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Click to change file
                              </p>
                            </>
                          ) : (
                            <>
                              <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="text-sm text-gray-600">
                                <span className="font-semibold">Click to upload</span>
                              </p>
                              <p className="text-xs text-gray-500">Image or PDF (Max 5MB)</p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) =>
                            setDocuments(prev => ({
                              ...prev,
                              aadhar: {
                                ...prev.aadhar,
                                file: e.target.files?.[0]
                              }
                            }))
                          }
                        />
                      </label>
                      {documents.aadhar.file && (
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-600">
                            {(documents.aadhar.file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setDocuments(prev => ({
                                ...prev,
                                aadhar: { ...prev.aadhar, file: null }
                              }))
                            }
                            className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Work / Skill Certificate */}
                <div className="space-y-4 p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-[#112D4E] text-lg">
                      Work / Skill Proof
                    </label>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Required</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Document Type</p>
                        <select
                          className={`${inputBase} bg-white`}
                          value={documents.workProof.documentType}
                          onChange={(e) =>
                            setDocuments(prev => ({
                              ...prev,
                              workProof: {
                                ...prev.workProof,
                                documentType: e.target.value
                              }
                            }))
                          }
                        >
                          <option value="" className="text-gray-400">Select Document Type</option>
                          <option value="SKILL_CERTIFICATE">Skill Certificate</option>
                          <option value="LICENSE">License</option>
                          <option value="EXPERIENCE_CERTIFICATE">Experience Certificate</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Document Name</p>
                        <input
                          type="text"
                          placeholder="e.g., Carpentry Course Certificate, Driving License"
                          className={inputBase}
                          value={documents.workProof.documentName}
                          onChange={(e) =>
                            setDocuments(prev => ({
                              ...prev,
                              workProof: {
                                ...prev.workProof,
                                documentName: e.target.value
                              }
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Upload Document</p>
                      <label className={`
                        flex flex-col items-center justify-center w-full h-40
                        border-2 border-dashed rounded-lg cursor-pointer
                        transition-all duration-200
                        ${documents.workProof.file 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                        }
                      `}>
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                          {documents.workProof.file ? (
                            <>
                              <div className="w-12 h-12 mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <p className="text-sm font-medium text-blue-700 text-center">
                                {documents.workProof.file.name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 text-center">
                                {(documents.workProof.file.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                Click to change document
                              </p>
                            </>
                          ) : (
                            <>
                              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                              </svg>
                              <p className="text-sm text-gray-600 text-center">
                                <span className="font-semibold">Upload Document</span>
                              </p>
                              <p className="text-xs text-gray-500 mt-1 text-center">
                                Image or PDF (Max 5MB)
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) =>
                            setDocuments(prev => ({
                              ...prev,
                              workProof: {
                                ...prev.workProof,
                                file: e.target.files?.[0]
                              }
                            }))
                          }
                        />
                      </label>
                      
                      {documents.workProof.file && (
                        <div className="flex items-center justify-between mt-3">
                          <button
                            type="button"
                            onClick={() => {
                              // Open file preview logic here
                              const url = URL.createObjectURL(documents.workProof.file);
                              window.open(url, '_blank');
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDocuments(prev => ({
                                ...prev,
                                workProof: { ...prev.workProof, file: null }
                              }))
                            }
                            className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t" style={{ borderColor: '#3F72AF' }}>
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: step === 1 ? '#DBE2EF' : '#F9F7F7',
                  color: '#112D4E'
                }}
              >
                Back
              </button>

              {step < 5 ? (
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
                      Submitting...
                    </span>
                  ) : (
                    <>
                      Complete Registration
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Benefits Section */}
        <div className="rounded-3xl shadow-xl p-8" style={{ backgroundColor: '#DBE2EF' }}>
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ color: '#112D4E' }}>
            Why Join WorkWiz?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <BenefitCard
              icon={< Banknote className="w-8 h-8" />}
              title="Regular Work"
              description="Get consistent bookings and earn daily payments directly to your bank account"
              color="#3F72AF"
            />
            <BenefitCard
              icon={<Shield className="w-8 h-8" />}
              title="Verified Badge"
              description="Build trust with customers through our verification and rating system"
              color="#112D4E"
            />
            <BenefitCard
              icon={<Sparkles className="w-8 h-8" />}
              title="Support & Training"
              description="Access training materials and 24/7 customer support"
              color="#3F72AF"
            />
          </div>
        </div>

        {/* Privacy Note */}
        <div className="text-center mt-8">
          <p className="text-sm opacity-75" style={{ color: '#3F72AF' }}>
            🔒 All your information is securely protected. We verify all professionals before activation.
          </p>
        </div>
      </div>
    </div>
  );
};

const BenefitCard = ({ icon, title, description, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 rounded-lg" style={{ backgroundColor: color + '20', color }}>
        {icon}
      </div>
      <h4 className="font-bold text-lg" style={{ color: '#112D4E' }}>{title}</h4>
    </div>
    <p className="text-sm" style={{ color: '#3F72AF' }}>{description}</p>
  </div>
);

export default WorkerProfileSetup;
