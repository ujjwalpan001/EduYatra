import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-6 md:px-10 py-4 md:py-8 bg-gradient-to-r from-blue-50 via-light-blue-100 to-blue-100/90 backdrop-blur-xl border-b border-blue-200 fixed top-0 left-0 w-full z-50 shadow-md h-16 md:h-24 rounded-b-3xl">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center transform hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-xl">
          <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-white rounded-full animate-pulse"></div>
        </div>
        <span className="text-lg sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">EduYatra</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-8 xl:space-x-12 relative">
        <Link to="/features" className="text-base lg:text-xl xl:text-2xl font-semibold text-gray-800 hover:text-purple-700 transition-all duration-300 hover:scale-110 relative group">
          Features
          <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
        </Link>

        {/* Clickable Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="text-base lg:text-xl xl:text-2xl font-semibold text-gray-800 hover:text-purple-700 transition-all duration-300 hover:scale-110">
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

        <Link to="/blogs-faq" className="text-base lg:text-xl xl:text-2xl font-semibold text-gray-800 hover:text-purple-700 transition-all duration-300 hover:scale-110 relative group">
          Blogs/FAQ
          <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
        </Link>

        <Link to="/contact-us" className="text-base lg:text-xl xl:text-2xl font-semibold text-gray-800 hover:text-purple-700 transition-all duration-300 hover:scale-110 relative group">
          Contact Us
          <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 group-hover:w-full transition-all duration-300"></span>
        </Link>
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
        <Link to="/signin">
          <Button variant="ghost" className="text-gray-700 hover:bg-blue-100 transition-all duration-300 text-sm lg:text-lg px-3 lg:px-4">Login</Button>
        </Link>
        <Link to="/signup">
          <Button className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 hover:from-purple-700 hover:via-pink-600 hover:to-blue-700 text-white text-sm lg:text-lg px-4 lg:px-6 py-2 lg:py-3 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg">
            Sign up
          </Button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button 
        onClick={toggleMobileMenu}
        className="lg:hidden p-2 rounded-lg hover:bg-purple-100 transition-colors"
      >
        {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-3xl border-t border-gray-200 lg:hidden">
          <div className="flex flex-col p-4 space-y-3">
            <Link 
              to="/features" 
              className="text-lg font-semibold text-gray-800 hover:text-purple-700 py-2 px-4 hover:bg-purple-50 rounded-lg transition-all"
              onClick={() => setShowMobileMenu(false)}
            >
              Features
            </Link>
            
            <div className="border-t pt-2">
              <button 
                onClick={toggleDropdown} 
                className="w-full text-left text-lg font-semibold text-gray-800 hover:text-purple-700 py-2 px-4 hover:bg-purple-50 rounded-lg transition-all"
              >
                Take a Tour
              </button>
              {showDropdown && (
                <div className="ml-4 mt-2 space-y-2">
                  <Link 
                    to="/how-to-create-exam" 
                    className="block py-2 px-4 text-gray-700 hover:text-purple-700 hover:bg-blue-50 rounded-md transition-all"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    How to Create Exam
                  </Link>
                  <Link 
                    to="/how-to-create-question" 
                    className="block py-2 px-4 text-gray-700 hover:text-purple-700 hover:bg-blue-50 rounded-md transition-all"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    How to Create Question
                  </Link>
                  <Link 
                    to="/how-to-take-test" 
                    className="block py-2 px-4 text-gray-700 hover:text-purple-700 hover:bg-blue-50 rounded-md transition-all"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    How to Take Test
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              to="/blogs-faq" 
              className="text-lg font-semibold text-gray-800 hover:text-purple-700 py-2 px-4 hover:bg-purple-50 rounded-lg transition-all"
              onClick={() => setShowMobileMenu(false)}
            >
              Blogs/FAQ
            </Link>
            
            <Link 
              to="/contact-us" 
              className="text-lg font-semibold text-gray-800 hover:text-purple-700 py-2 px-4 hover:bg-purple-50 rounded-lg transition-all"
              onClick={() => setShowMobileMenu(false)}
            >
              Contact Us
            </Link>

            <div className="flex flex-col space-y-2 pt-3 border-t md:hidden">
              <Link to="/signin" onClick={() => setShowMobileMenu(false)}>
                <Button variant="outline" className="w-full text-gray-700 hover:bg-blue-100 transition-all duration-300">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setShowMobileMenu(false)}>
                <Button className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 hover:from-purple-700 hover:via-pink-600 hover:to-blue-700 text-white">
                  Sign up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
