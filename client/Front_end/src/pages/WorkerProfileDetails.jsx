import { useState } from "react";
import axios from "axios";
import { User, Phone, Briefcase, MapPin, FileText, Camera } from "lucide-react";
import React from "react";

export default function WorkerProfileDetails() {
  const [profile, setProfile] = useState({
    name: "",
    phoneNumber: "",
    age: "",
    experienceYears: "",
    serviceName: "",
  });

  const [address, setAddress] = useState({
    addressText: "",
    latitude: "",
    longitude: "",
    addressType: "home",
  });

  const [document, setDocument] = useState({
    documentType: "",
    documentNumber: "",
  });

  const [photo, setPhoto] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleProfileChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleAddressChange = (e) =>
    setAddress({ ...address, [e.target.name]: e.target.value });

  const handleDocumentChange = (e) =>
    setDocument({ ...document, [e.target.name]: e.target.value });

  const submitProfile = async () => {
    const formData = new FormData();
    Object.keys(profile).forEach((key) => formData.append(key, profile[key]));
    if (photo) formData.append("photo", photo);

    await axios.post(
      "http://localhost:5000/api/worker/createWorkerProfile",
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const submitAddress = async () => {
    await axios.post(
      "http://localhost:5000/api/worker/createWorkerAddress",
      address,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const submitDocument = async () => {
    const formData = new FormData();
    Object.keys(document).forEach((key) => formData.append(key, document[key]));
    if (docFile) formData.append("document", docFile);

    await axios.post(
      "http://localhost:5000/api/worker/uploadWorkerDocument",
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitProfile();
      await submitAddress();
      await submitDocument();
      alert("Worker profile setup completed 🎉");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl p-8 space-y-10"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700">
          Worker Profile Setup
        </h2>

        {/* Profile Section */}
        <section className="grid md:grid-cols-2 gap-6">
          <Input icon={<User />} name="name" placeholder="Full Name" onChange={handleProfileChange} />
          <Input icon={<Phone />} name="phoneNumber" placeholder="Phone Number" onChange={handleProfileChange} />
          <Input icon={<Briefcase />} name="serviceName" placeholder="Service Name" onChange={handleProfileChange} />
          <Input icon={<User />} name="experienceYears" placeholder="Experience (Years)" type="number" onChange={handleProfileChange} />
          <Input icon={<User />} name="age" placeholder="Age" type="number" onChange={handleProfileChange} />
          
          <div className="flex items-center gap-3 border rounded-xl p-3">
            <Camera className="text-gray-400" />
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
          </div>
        </section>

        {/* Address Section */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-indigo-600 flex items-center gap-2">
            <MapPin size={20}/> Address Details
          </h3>
          <Input name="addressText" placeholder="Full Address" onChange={handleAddressChange} />
          <div className="grid md:grid-cols-2 gap-6">
            <Input name="latitude" placeholder="Latitude" onChange={handleAddressChange} />
            <Input name="longitude" placeholder="Longitude" onChange={handleAddressChange} />
          </div>
        </section>

        {/* Document Section */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-indigo-600 flex items-center gap-2">
            <FileText size={20}/> Verification Document
          </h3>
          <Input name="documentType" placeholder="Document Type (Aadhar, License...)" onChange={handleDocumentChange} />
          <Input name="documentNumber" placeholder="Document Number" onChange={handleDocumentChange} />
          <input type="file" onChange={(e) => setDocFile(e.target.files[0])} />
        </section>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition"
        >
          {loading ? "Saving..." : "Complete Profile"}
        </button>
      </form>
    </div>
  );
}

function Input({ icon, ...props }) {
  return (
    <div className="flex items-center gap-3 border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-indigo-400">
      {icon && <span className="text-gray-400">{icon}</span>}
      <input {...props} className="w-full outline-none bg-transparent" required />
    </div>
  );
}
