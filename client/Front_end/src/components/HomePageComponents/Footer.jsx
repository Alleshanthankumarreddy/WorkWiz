import React from "react";
import {
  Wrench,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const customerLinks = [
    { name: "Book a Service", href: "#" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#" },
    { name: "FAQs", href: "#" },
  ];

  const workerLinks = [
    { name: "Join as Worker", href: "#" },
    { name: "Worker Dashboard", href: "#" },
    { name: "Earnings", href: "#" },
    { name: "Support", href: "#" },
  ];

  const companyLinks = [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
          {/* Brand Column */}
          <div className="flex-shrink-0 md:w-1/4">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">WorkWiz</span>
            </a>

            <p className="text-white/70 mb-4 text-sm">
              Connecting you with trusted, verified service professionals for all your household needs.
            </p>

            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@workwiz.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 1800-WORKWIZ</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-1 justify-between flex-wrap gap-6 md:gap-12">
            <div>
              <h4 className="font-semibold mb-2 text-sm">For Customers</h4>
              <ul className="space-y-1 text-sm">
                {customerLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">For Workers</h4>
              <ul className="space-y-1 text-sm">
                {workerLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2 text-sm">Company</h4>
              <ul className="space-y-1 text-sm">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/70">
            © {currentYear} WorkWiz. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-white/70 hover:text-white transition">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-white/70 hover:text-white transition">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
