import React, { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";
import { HiX, HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { FaLeaf, FaTractor, FaWhatsapp } from "react-icons/fa";
import { GiWheat, GiFarmer, Gi3dHammer } from "react-icons/gi";
import { MdEmail, MdCall } from "react-icons/md";
import EmailDrop from "../components/DropEmail";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [EmailPage, setEmailPage] = useState(false);

  const missedCall = () => {
    alert("Successfully missed call to owner...");
  };

  const writeEmail = () => {
    setEmailPage(true);
  };

  useEffect(() => {
    if (EmailPage) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [EmailPage]);

  return (
    <footer className="relative mt-10 overflow-hidden">
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg className="relative block w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-green-50"></path>
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 pt-20 pb-8 px-6 md:px-12 lg:px-20">
        
        {/* Floating Decorative Elements */}
        <div className="absolute top-24 left-10 text-green-700/20 animate-pulse hidden lg:block">
          <FaLeaf size={60} />
        </div>
          <div className="absolute top-32 right-16 text-amber-600/20 animate-bounce hidden lg:block">
            <GiWheat size={70} />
          </div>
        <div className="absolute top-30 right-2 text-green-700/60 animate-pulse hidden lg:block">
          <GiWheat size={50} />
        </div>

        {/* Top Section - Logo & Newsletter */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-10 border-b border-green-700/50">
            {/* Brand */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                  <GiFarmer className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-white">
                  Apna<span className="text-green-400">Bazar</span>
                </h2>
              </div>
              <p className="text-green-300/80 text-sm max-w-xs">
                Empowering Indian Farmers with Technology
              </p>
            </div>

            {/* Newsletter */}
            <div className="w-full lg:w-auto">
              <h3 className="text-white font-semibold mb-3 text-center lg:text-left">Subscribe to our Newsletter</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 rounded-xl bg-white/10 border border-green-600/50 text-white placeholder-green-300/50 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all w-full sm:w-64"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-400 hover:to-emerald-400 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></span>
              About Us
            </h3>
            <p className="text-green-200/70 text-sm leading-relaxed">
              Apna-Bazar is one of the largest full-stack AgriTech platforms helping farmers
              improve their productivity, reduce costs, and adopt modern agriculture 
              solutions. We bridge the gap between technology and agriculture.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-green-300/80 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>10K+ Farmers</span>
              </div>
              <div className="flex items-center gap-2 text-green-300/80 text-sm">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                <span>500+ Products</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {['About Us', 'Privacy Policy', 'Return & Refund', 'Terms of Service', 'Shipping Policy'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-green-200/70 hover:text-green-300 text-sm flex items-center gap-2 group transition-all duration-300">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></span>
              Our Services
            </h3>
            <ul className="space-y-3">
              {['Live Crop Bidding', 'Farm Equipment', 'Organic Seeds', 'Weather Updates', 'Expert Consultation'].map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-green-200/70 hover:text-green-300 text-sm flex items-center gap-2 group transition-all duration-300">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></span>
              Contact Us
            </h3>
            <div className="space-y-4">
              <a href="tel:18003000243" className="flex items-center gap-3 text-green-200/70 hover:text-green-300 transition-colors group">
                <div className="w-10 h-10 bg-green-700/50 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <HiPhone className="text-green-300" size={20} />
                </div>
                <div>
                  <p className="text-xs text-green-400">Toll Free</p>
                  <p className="text-sm font-medium">1800 3000 2434</p>
                </div>
              </a>
              <a href="tel:+916394952163" className="flex items-center gap-3 text-green-200/70 hover:text-green-300 transition-colors group">
                <div className="w-10 h-10 bg-green-700/50 rounded-xl flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <FaWhatsapp className="text-green-300" size={20} />
                </div>
                <div>
                  <p className="text-xs text-green-400">WhatsApp</p>
                  <p className="text-sm font-medium">+91 6394952163</p>
                </div>
              </a>
              <div className="flex items-center gap-3 text-green-200/70">
                <div className="w-10 h-10 bg-green-700/50 rounded-xl flex items-center justify-center">
                  <HiLocationMarker className="text-green-300" size={20} />
                </div>
                <div>
                  <p className="text-xs text-green-400">Address</p>
                  <p className="text-sm">Bangalore, India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-green-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <span className="text-green-300/60 text-sm hidden sm:block">Follow us:</span>
              <div className="flex items-center gap-3">
                {[
                  { icon: FaFacebook, color: 'hover:bg-blue-600', href: '#' },
                  { icon: FaInstagram, color: 'hover:bg-pink-600', href: '#' },
                  { icon: FaLinkedin, color: 'hover:bg-blue-700', href: 'https://www.linkedin.com/in/shivam-yadav-696a8725a/' },
                  { icon: FaTwitter, color: 'hover:bg-sky-500', href: '#' },
                  { icon: FaYoutube, color: 'hover:bg-red-600', href: '#' },
                ].map((social, index) => (
                  <a 
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-green-700/50 rounded-xl flex items-center justify-center text-green-300 ${social.color} hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <p className="text-green-300/60 text-sm text-center">
              © 2025 <span className="text-green-400 font-medium">Apna-Bazar</span> Agro Private Limited — All Rights Reserved.
            </p>

            {/* Payment Methods (decorative) */}
            <div className="flex items-center gap-2">
              <span className="text-green-300/60 text-xs">Secure Payments</span>
              <div className="flex items-center gap-1">
                {['💳', '🏦', '📱'].map((icon, i) => (
                  <span key={i} className="text-lg">{icon}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Contact Button - Inside Footer */}
      <button
        onClick={() => setOpen(!open)}
        className={`absolute bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-semibold flex items-center justify-center shadow-2xl shadow-green-500/30 hover:from-green-400 hover:to-emerald-500 hover:scale-110 transition-all duration-300 ${!open && 'animate-bounce'}`}
      >
        {open ? (
          <HiX className="text-3xl" />
        ) : (
          <MdCall className="text-2xl" />
        )}
      </button>

      {/* Contact Popup */}
      {open && (
        <div className="absolute bottom-24 right-6 w-72 bg-white rounded-2xl shadow-2xl p-5 flex flex-col gap-3 z-50 animate-fade-in-up border border-gray-100">
          {/* Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <GiFarmer className="text-white text-xl" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Need Help?</h4>
              <p className="text-xs text-gray-500">We're here for you 24/7</p>
            </div>
          </div>

          <button
            onClick={writeEmail}
            className="flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:shadow-lg hover:shadow-green-200 group"
          >
            <MdEmail className="text-xl group-hover:animate-bounce" />
            <span className="font-medium">Drop an Email</span>
          </button>

          <button
            onClick={missedCall}
            className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 group"
          >
            <HiPhone className="text-xl group-hover:animate-bounce" />
            <span className="font-medium">Request Callback</span>
          </button>

          <a
            href="https://wa.me/6394952163"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 hover:shadow-lg hover:shadow-green-200 group"
          >
            <FaWhatsapp className="text-xl group-hover:animate-bounce" />
            <span className="font-medium">WhatsApp Us</span>
          </a>
        </div>
      )}

      {/* Email Modal */}
      {EmailPage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="relative bg-white w-full max-w-lg mx-auto rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
              <h3 className="text-xl font-bold">Send us a Message</h3>
              <p className="text-green-100 text-sm">We'll get back to you within 24 hours</p>
            </div>
            
            {/* Close button */}
            <button
              onClick={() => setEmailPage(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <HiX className="text-xl" />
            </button>

            {/* Content */}
            <div className="p-6">
              <EmailDrop />
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
