import React from "react";
import { MapPin, Search, UserCheck, CalendarCheck } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Select Location",
    description:
      "Enter your city or area to find available service professionals near you.",
    icon: MapPin,
    bg: "bg-pink-100",
    iconColor: "text-pink-500",
  },
  {
    step: 2,
    title: "Choose Service",
    description:
      "Browse through our categories and pick the service you need.",
    icon: Search,
    bg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    step: 3,
    title: "Pick a Worker",
    description:
      "View profiles, ratings, and reviews to choose the best professional.",
    icon: UserCheck,
    bg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    step: 4,
    title: "Book & Relax",
    description:
      "Confirm your booking and get quality service at your doorstep.",
    icon: CalendarCheck,
    bg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

function HowItWorks() {
  return (
    <section className="w-full bg-white py-16"> {/* py-24 → py-16 */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-gray-900">
          How It <span className="text-orange-500">Works</span>
        </h2>
        <p className="mt-3 text-center text-gray-500 max-w-2xl mx-auto"> {/* mt-4 → mt-3 */}
          Getting professional help has never been easier. Follow these simple
          steps to book a service.
        </p>

        {/* Steps Grid */}
        <div className="mt-12 grid grid-cols-2 gap-x-20 gap-y-16"> {/* mt-20 → mt-12, gap-x-32 → gap-x-20, gap-y-24 → gap-y-16 */}
          {steps.map((item) => (
            <div key={item.step} className="relative text-center">
              <div
                className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center ${item.bg}`}
              >
                <item.icon className={item.iconColor} size={32} />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-800"> {/* mt-6 → mt-4 */}
                {item.title}
              </h3>
              <p className="mt-2 text-gray-500 max-w-xs mx-auto">{item.description}</p> {/* mt-3 → mt-2 */}
            </div>
          ))}
        </div>
      </div>
  </section>

  );
}

export default HowItWorks;
