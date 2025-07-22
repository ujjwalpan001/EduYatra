import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="flex items-center justify-between px-10 py-8 bg-gradient-to-r from-blue-50 via-light-blue-100 to-blue-100/90 backdrop-blur-xl border-b border-blue-200 fixed top-0 left-0 w-full z-50 shadow-md h-24 rounded-b-3xl">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 rounded-2xl flex items-center justify-center transform hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
        </div>
        <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">EduYatra</span>
      </div>

      <div className="hidden md:flex items-center space-x-12 relative">
        <Link to="/features" className="text-xl md:text-2xl font-semibold text-gray-800 hover:text-purple-700 transition-all duration-300 hover:scale-110 relative group">
          Features
          <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
        </Link>

        {/* Clickable Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="text-xl md:text-2xl font-semibold text-gray-800 hover:text-purple-700 transition-all duration-300 hover:scale-110">
            Take a Tour
          </button>
          {showDropdown && (
            <div className="absolute top-full mt-2 bg-white rounded-xl shadow-xl py-2 px-4 w-64 z-50">
              <Link to="/how-to-create-exam" className="block py-2 text-gray-700 hover:text-purple-700 hover:bg-blue-50 rounded-md transition-all duration-200">
                How to Create Exam
              </Link>
              <Link to="/how-to-create-question" className="block py-2 text-gray-700 hover:text-purple-700 hover:bg-blue-50 rounded-md transition-all duration-200">
                How to Create Question
              </Link>
              <Link to="/how-to-take-test" className="block py-2 text-gray-700 hover:text-purple-700 hover:bg-blue-50 rounded-md transition-all duration-200">
                How to Take Test
              </Link>
            </div>
          )}
        </div>

        <Link to="/blogs-faq" className="text-xl md:text-2xl font-semibold text-gray-800 hover:text-purple-700 transition-all duration-300 hover:scale-110 relative group">
          Blogs/FAQ
          <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
        </Link>

        <Link to="/contact-us" className="text-xl md:text-2xl font-semibold text-gray-800 hover:text-purple-700 transition-all duration-300 hover:scale-110 relative group">
          Contact Us
          <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/signin">
          <Button variant="ghost" className="text-gray-700 hover:bg-blue-100 transition-all duration-300 text-lg">Login</Button>
        </Link>
        <Link to="/signup">
          <Button className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 hover:from-purple-700 hover:via-pink-600 hover:to-blue-700 text-white text-lg px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
            Sign up
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
