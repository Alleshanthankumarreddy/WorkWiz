import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Shirt,
  Zap,
  Wrench,
  Droplet,
  Sofa,
} from "lucide-react";

const services = [
  {
    title: "Cleaning & Hygiene",
    desc: "Deep cleaning and hygiene services for your home",
    icon: Sparkles,
    color: "bg-pink-100 text-pink-500",
  },
  {
    title: "Laundry",
    desc: "Clothes washing and fabric care services",
    icon: Shirt,
    color: "bg-yellow-100 text-yellow-600",
  },
  {
    title: "Electrician",
    desc: "All electrical repairs and installations",
    icon: Zap,
    color: "bg-yellow-50 text-yellow-500",
  },
  {
    title: "Installations",
    desc: "Appliance and equipment installations",
    icon: Wrench,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Plumber",
    desc: "Pipelines, leakages and plumbing fixes",
    icon: Droplet,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Furniture Maintenance",
    desc: "Cleaning, polishing and furniture care",
    icon: Sofa,
    color: "bg-orange-100 text-orange-500",
  },
];

const CARD_WIDTH = 320;

function ServicesSlider() {
  const [index, setIndex] = useState(0);
  const maxIndex = services.length - 3;

  return (
    <section className="bg-gradient-to-br from-pink-50 via-yellow-50 to-green-50">
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-gray-900">
          Our <span className="text-orange-500">Services</span>
        </h2>
        <p className="mt-4 text-center text-gray-500 max-w-2xl mx-auto">
          Verified professionals for all your household needs
        </p>

        {/* Slider */}
        {/* Slider */}
        <div className="mt-14">
        <div className="overflow-hidden pb-8">
            <div
            className="flex gap-6 transition-transform duration-500"
            style={{
                transform: `translateX(-${index * CARD_WIDTH}px)`,
            }}
            >
            {services.map((service, i) => (
                <div
                key={i}
                className="min-w-[300px] bg-white rounded-xl shadow-md p-6"
                >
                {/* Icon */}
                <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${service.color}`}
                >
                    <service.icon size={22} />
                </div>

                {/* Text */}
                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                    {service.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                    {service.desc}
                </p>
                </div>
            ))}
            </div>
        </div>
        </div>

        {/* Left Arrow */}
        {/* Left Arrow */}
        <button
        onClick={() => setIndex((prev) => Math.max(prev - 1, 0))}
        className="
            absolute -left-6 top-1/2 -translate-y-1/2
            bg-white p-3 rounded-full shadow-lg
            hover:bg-gray-100 transition
            z-20
        "
        >
        <ChevronLeft />
        </button>

        {/* Right Arrow */}
        <button
        onClick={() =>
            setIndex((prev) => Math.min(prev + 1, maxIndex))
        }
        className="
            absolute -right-6 top-1/2 -translate-y-1/2
            bg-white p-3 rounded-full shadow-lg
            hover:bg-gray-100 transition
            z-20
        "
        >
        <ChevronRight />
        </button>

      </div>
    </section>
  );
}

export default ServicesSlider;
