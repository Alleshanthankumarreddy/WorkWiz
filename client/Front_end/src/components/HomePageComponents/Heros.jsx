import React from "react";
import { MapPin, Search, CheckCircle, ShieldCheck, Clock } from "lucide-react";

function Heros() { 
    return ( 
        <section className="w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-pink-50 via-yellow-50 to-green-50"> <div className="max-w-4xl mx-auto px-6 text-center"> {/* Trust badge */} <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-green-100 text-green-700 text-sm font-medium"> <span className="w-2 h-2 rounded-full bg-green-600"></span> Trusted by 10,000+ customers </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
        Find Trusted Service <span className="text-orange-500">Professionals</span>
        <br /> Near You
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-gray-500 text-lg max-w-2xl mx-auto">
        Book verified electricians, plumbers, cleaners, and more. Get quality
        service at transparent prices, right at your doorstep.
        </p>

        {/* Search bar */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-[380px] px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm">
            <MapPin className="text-gray-400" size={20} />
            <input
            type="text"
            placeholder="Select your city"
            className="w-full outline-none text-gray-600 placeholder-gray-400"
            />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-400 text-white font-medium shadow hover:bg-pink-500 transition">
            <Search size={18} />
            Find Services
        </button>
        </div>

        {/* Features */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
            <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center">
            <CheckCircle className="text-pink-500" size={18} />
            </div>
            Verified Workers
        </div>

        <div className="flex items-center gap-2 text-gray-600">
            <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
            <ShieldCheck className="text-yellow-600" size={18} />
            </div>
            Transparent Pricing
        </div>

        <div className="flex items-center gap-2 text-gray-600">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
            <Clock className="text-blue-600" size={18} />
            </div>
            Real-time Booking
        </div>
        </div>
    </div>
    </section>

); }

export default Heros;