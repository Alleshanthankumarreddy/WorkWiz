import React, { forwardRef } from "react";
// import { NavLink as RouterNavLink } from "react-router-dom";

// const NavLink = forwardRef(
//   (
//     {
//       to,
//       className = "",
//       activeClassName = "",
//       pendingClassName = "",
//       ...props
//     },
//     ref
//   ) => {
//     return (
//       <RouterNavLink
//         ref={ref}
//         to={to}
//         className={({ isActive, isPending }) =>
//           `${className} ${
//             isActive ? activeClassName : ""
//           } ${isPending ? pendingClassName : ""}`
//         }
//         {...props}
//       />
//     );
//   }
// );

// NavLink.displayName = "NavLink";

// function NavBar() {
//   return (
//     <nav className="flex items-center gap-6 px-6 py-4 bg-white shadow">
//       <NavLink
//         to="/"
//         className="text-gray-600 font-medium"
//         activeClassName="text-indigo-600 font-semibold"
//       >
//         Home
//       </NavLink>

//       <NavLink
//         to="/services"
//         className="text-gray-600 font-medium"
//         activeClassName="text-indigo-600 font-semibold"
//       >
//         Services
//       </NavLink>

//       <NavLink
//         to="/how-it-works"
//         className="text-gray-600 font-medium"
//         activeClassName="text-indigo-600 font-semibold"
//       >
//         How It Works
//       </NavLink>

//       <NavLink
//         to="/contact"
//         className="text-gray-600 font-medium"
//         activeClassName="text-indigo-600 font-semibold"
//       >
//         Contact
//       </NavLink>
//     </nav>
//   );
// }

// export default NavBar;
import { Wrench } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-pink-200 rounded-md flex items-center justify-center">
                <Wrench className="text-pink-600" size={20} />
            </div>
            <div className="text-xl font-bold text-orange-500">
                WorkWiz
            </div>
        </div>

        {/* Nav Links */}
        <ul className="flex items-center gap-8 text-gray-600 font-medium">
        <li className="hover:text-gray-900 cursor-pointer">Home</li>
        <li className="hover:text-gray-900 cursor-pointer">Services</li>
        <li className="hover:text-gray-900 cursor-pointer">How It Works</li>
        <li className="hover:text-gray-900 cursor-pointer">Testimonials</li>
        </ul>


        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button className="px-5 py-2 rounded-full border border-pink-300 text-pink-600 font-medium hover:bg-pink-50 transition">
            Join as Worker
          </button>
          <button className="px-5 py-2 rounded-full bg-pink-400 text-white font-medium hover:bg-pink-500 transition">
            Book a Service
          </button>
        </div>

      </div>
    </nav>
  );
}