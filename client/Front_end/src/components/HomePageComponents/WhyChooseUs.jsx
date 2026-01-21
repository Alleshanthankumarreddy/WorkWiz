import React from "react";
import { ShieldCheck, DollarSign, Clock, Star } from "lucide-react";

const features = [
  {
    title: "Verified Professionals",
    description:
      "All our workers undergo thorough background checks and skill verification.",
    icon: ShieldCheck,
    iconColor: "text-pink-400",
  },
  {
    title: "Transparent Pricing",
    description:
      "No hidden charges. See upfront pricing before you book any service.",
    icon: DollarSign,
    iconColor: "text-gray-700",
  },
  {
    title: "Real-time Availability",
    description:
      "Check worker availability instantly and book at your convenience.",
    icon: Clock,
    iconColor: "text-gray-700",
  },
  {
    title: "Quality Guaranteed",
    description:
      "Not satisfied? We’ll make it right or give you a full refund.",
    icon: Star,
    iconColor: "text-gray-700",
  },
];
function WhyChooseUs() {
  return (
    <section className="w-full bg-white py-16"> {/* reduced from py-24 to py-16 */}
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-gray-900">
          Why Choose <span className="text-orange-500">WorkWiz?</span>
        </h2>
        <p className="mt-3 text-center text-gray-500 max-w-3xl mx-auto"> {/* reduced mt-4 → mt-3 */}
          We’re committed to connecting you with the best service professionals
          while ensuring a seamless experience.
        </p>

        {/* Feature Cards */}
        <div className="mt-12 grid grid-cols-2 gap-8"> {/* mt-16 → mt-12, gap-10 → gap-8 */}
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm" >
              <div className="flex justify-center mb-5"> {/* mb-6 → mb-5 */}
                <item.icon size={36} className={item.iconColor} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="mt-2 text-gray-500">{item.description}</p> {/* mt-3 → mt-2 */}
            </div>
          ))}
        </div>
      </div>
  </section>
  );
}

export default WhyChooseUs;