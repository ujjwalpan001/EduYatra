import React, { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Target, Zap, Users, Star, Award, User, GraduationCap, Shield, Brain, BarChart3, TrendingUp, Play, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from './navbar'; // Import the Navbar component

const Index = () => {
  const floatingRef = useRef();
  const cubeRef = useRef();
  const sphereRef = useRef();

  useEffect(() => {
    // Floating animation for 3D elements
    const animateFloating = () => {
      if (floatingRef.current) {
        floatingRef.current.style.transform = `translateY(${Math.sin(Date.now() * 0.002) * 10}px) rotateY(${Date.now() * 0.05}deg)`;
      }
      if (cubeRef.current) {
        cubeRef.current.style.transform = `rotateX(${Date.now() * 0.03}deg) rotateY(${Date.now() * 0.02}deg)`;
      }
      if (sphereRef.current) {
        sphereRef.current.style.transform = `translateY(${Math.sin(Date.now() * 0.003) * 15}px) rotateZ(${Date.now() * 0.01}deg)`;
      }
      requestAnimationFrame(animateFloating);
    };
    animateFloating();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden relative">
      {/* Import Navbar Component */}
      <Navbar />

      {/* Main content with padding to account for fixed nav */}
      <div className="pt-24 min-h-[calc(100vh-6rem)]">
        {/* Enhanced Hero Section with 3D Elements */}
        <div className="relative overflow-hidden min-h-screen flex items-center">
          {/* 3D Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Animated 3D Cubes */}
            <div 
              ref={cubeRef}
              className="absolute top-20 right-20 w-20 h-20 bg-gradient-to-br from-purple-400/60 to-pink-500/60 rounded-3xl shadow-2xl"
              style={{
                transform: 'rotateX(45deg) rotateY(45deg)',
                animation: 'float 6s ease-in-out infinite',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="absolute inset-2 bg-gradient-to-br from-white/20 to-transparent rounded-2xl backdrop-blur-sm"></div>
            </div>

            {/* Floating Sphere */}
            <div 
              ref={sphereRef}
              className="absolute top-1/3 left-10 w-16 h-16 bg-gradient-to-br from-blue-400/70 to-cyan-500/70 rounded-full shadow-2xl"
              style={{
                animation: 'bounce 4s ease-in-out infinite',
                filter: 'blur(0.5px)'
              }}
            >
              <div className="absolute inset-1 bg-gradient-to-br from-white/30 to-transparent rounded-full"></div>
            </div>

            {/* Geometric Shapes */}
            <div className="absolute bottom-1/4 right-10 w-12 h-12 bg-gradient-to-br from-orange-400/60 to-red-500/60 transform rotate-45 rounded-lg shadow-xl animate-spin-slow"></div>
            <div className="absolute top-1/2 left-20 w-8 h-20 bg-gradient-to-b from-green-400/60 to-emerald-500/60 rounded-full shadow-lg animate-pulse"></div>
            
            {/* Floating Icons with 3D effect */}
            {[
              { icon: Brain, color: 'from-indigo-500 to-purple-600', pos: 'top-32 right-32', delay: '0s' },
              { icon: BarChart3, color: 'from-blue-500 to-cyan-600', pos: 'top-2/3 right-16', delay: '1s' },
              { icon: Star, color: 'from-yellow-400 to-orange-500', pos: 'bottom-32 right-24', delay: '2s' },
              { icon: Target, color: 'from-pink-500 to-rose-600', pos: 'bottom-40 left-16', delay: '1.5s' }
            ].map(({ icon: Icon, color, pos, delay }, index) => (
              <div
                key={index}
                className={`absolute ${pos} w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-2xl hover:scale-125 transition-all duration-300 cursor-pointer`}
                style={{
                  animation: `float 5s ease-in-out infinite ${delay}`,
                  transform: 'rotateX(10deg) rotateY(10deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              </div>
            ))}
          </div>

          {/* Hero Content with Enhanced 3D Design */}
          <div className="container mx-auto px-6 py-20 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <div className="mb-8 space-y-4">
                <Badge className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 px-6 py-2 text-lg font-semibold animate-bounce shadow-lg">
                  ✨ Where Teachers & Students Unite for Excellence
                </Badge>
                
                <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 px-4 py-2 animate-pulse shadow-md">
                  Powered by <span className="font-bold">👥 AI-Enhanced Collaborative Learning</span>
                </Badge>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 leading-tight">
                <span className="block animate-fade-in-up">Master Learning with</span>
                <span className="relative block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 animate-fade-in-up delay-300">
                  Expert Supervision
                  <div className="absolute -bottom-4 left-0 right-0 h-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 rounded-full opacity-30 animate-scale-in delay-500"></div>
                  <div className="absolute -bottom-2 left-4 right-4 h-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 rounded-full animate-scale-in delay-700"></div>
                </span>
              </h1>
              
              <p className="text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-500">
                Experience personalized education through expert teacher supervision, collaborative learning environments, and comprehensive exam preparation with real-time progress tracking.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-700">
              <Link to="signup">

                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 hover:from-purple-700 hover:via-pink-600 hover:to-blue-700 text-white px-10 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 group"
                >
                  <Play className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform" />
                  Begin
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced User Type Sections with Side-by-Side Layout */}
        <div className="py-32 bg-gradient-to-b from-white to-purple-50 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Choose Your Learning Role
              </h2>
              <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Join thousands of educators and learners who trust EduYatra for their supervised learning journey
              </p>
            </div>
            
            <div className="space-y-32">
              {/* Students Section - Image Left, Content Right */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                  <div className="relative w-full h-96 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-4 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-sm"></div>
                    <div className="absolute top-8 left-8 w-20 h-20 bg-white/30 rounded-2xl flex items-center justify-center">
                      <User className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-8 right-8 flex flex-col space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-32 h-4 bg-white/40 rounded-full animate-pulse" style={{animationDelay: `${i * 0.3}s`}}></div>
                      ))}
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-32 h-32 bg-white/20 rounded-full animate-spin-slow"></div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-1/2 space-y-8">
                  <div>
                    <Badge className="bg-blue-100 text-blue-700 px-4 py-2 mb-4">For Students</Badge>
                    <h3 className="text-4xl font-bold mb-6 text-gray-900">Learn with Expert Guidance</h3>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      Learn under expert teacher supervision, participate in collaborative study sessions, and track your progress with detailed analytics and exam preparation tools.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      'Teacher-Supervised Learning Paths',
                      'Collaborative Study Groups & Forums',
                      'Advanced Exam Preparation Tools',
                      'Real-time Progress Analytics'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                        <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
                        <span className="text-lg text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link to="/auth/student">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                      Start Learning Journey
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Teachers Section - Content Left, Image Right */}
              <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                <div className="lg:w-1/2">
                  <div className="relative w-full h-96 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-4 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-sm"></div>
                    <div className="absolute top-8 right-8 w-20 h-20 bg-white/30 rounded-2xl flex items-center justify-center">
                      <GraduationCap className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-8 left-8 grid grid-cols-3 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="w-8 h-8 bg-white/40 rounded-lg animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                      ))}
                    </div>
                    <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-white/20 rounded-full animate-bounce"></div>
                  </div>
                </div>
                
                <div className="lg:w-1/2 space-y-8">
                  <div>
                    <Badge className="bg-green-100 text-green-700 px-4 py-2 mb-4">For Teachers</Badge>
                    <h3 className="text-4xl font-bold mb-6 text-gray-900">Supervise & Inspire</h3>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      Supervise student learning journeys, create engaging curricula, conduct online exams, and monitor student progress with comprehensive analytics dashboard.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      'Student Progress Supervision Dashboard',
                      'Online Exam Creation & Management',
                      'Learning Analytics & Insights',
                      'Collaborative Teaching Tools'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <span className="text-lg text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link to="/auth/teacher">
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                      Join as Teacher
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Admin Section - Image Left, Content Right */}
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                  <div className="relative w-full h-96 bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden">
                    <div className="absolute inset-4 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl backdrop-blur-sm"></div>
                    <div className="absolute top-8 left-8 w-20 h-20 bg-white/30 rounded-2xl flex items-center justify-center">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-8 right-8 space-y-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex space-x-2">
                          <div className="w-4 h-4 bg-white/40 rounded-full animate-pulse"></div>
                          <div className="w-20 h-4 bg-white/30 rounded-full"></div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white/20 rounded-2xl animate-pulse"></div>
                  </div>
                </div>
                
                <div className="lg:w-1/2 space-y-8">
                  <div>
                    <Badge className="bg-purple-100 text-purple-700 px-4 py-2 mb-4">For Institutions</Badge>
                    <h3 className="text-4xl font-bold mb-6 text-gray-900">Manage & Oversee</h3>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      Manage your educational institution, oversee teacher-student interactions, organize exam schedules, and access comprehensive institutional reports.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      'Complete Institution Management',
                      'Exam Schedule & Oversight Tools',
                      'Comprehensive Reporting System',
                      'Multi-campus Administration'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                        <CheckCircle className="w-6 h-6 text-purple-500 flex-shrink-0" />
                        <span className="text-lg text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link to="/auth/admin">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group">
                      Manage Institution
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Learning is complex,{" "}
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  we make it supervised.
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                </span>
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
              {[
                {
                  icon: Users,
                  title: "Teacher-Student Collaboration",
                  description: "Expert teachers guide students through personalized learning paths with real-time supervision and feedback.",
                  gradient: "from-purple-500 to-purple-600",
                  delay: "0s"
                },
                {
                  icon: Award,
                  title: "Comprehensive Exam System",
                  description: "Conduct secure online exams with automated grading, proctoring features, and detailed performance analytics.",
                  gradient: "from-blue-500 to-blue-600",
                  delay: "0.2s"
                },
                {
                  icon: BarChart3,
                  title: "Progress Analytics",
                  description: "Track learning progress with detailed analytics, identify improvement areas, and celebrate achievements.",
                  gradient: "from-green-500 to-green-600",
                  delay: "0.4s"
                }
              ].map((feature, index) => (
                <Card key={index} className="border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-4 transform perspective-1000 hover:rotateY-5 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>
                    <div 
                      className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg transform hover:rotate-12 transition-all duration-300`}
                      style={{animationDelay: feature.delay}}
                    >
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 py-32 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-4 gap-12 text-center">
              {[
                { number: "50K+", label: "Active Students", icon: Users },
                { number: "5K+", label: "Expert Teachers", icon: GraduationCap },
                { number: "98%", label: "Success Rate", icon: Award },
                { number: "24/7", label: "Learning Support", icon: Shield }
              ].map((stat, index) => (
                <div key={index} className="transform hover:scale-110 transition-all duration-300">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">{stat.number}</div>
                  <div className="text-gray-300 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-blue-700 py-32 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl md:text-6xl font-bold mb-8">Ready to transform your learning experience?</h2>
            <p className="text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students and teachers who trust EduYatra for supervised learning excellence.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
            >
              Start Your Supervised Journey Today
            </Button>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="bg-gray-900 text-white py-20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-12">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-full"></div>
                  </div>
                  <span className="text-2xl font-bold">EduYatra</span>
                </div>
                <p className="text-gray-400 text-lg leading-relaxed">
                
                  Empowering education through supervised learning and teacher-student collaboration.
                </p>
              </div>
              
              {[
                {
                  title: "Platform",
                  links: ["Features", "Courses", "Supervision"]
                },
                {
                  title: "Company", 
                  links: ["About EduYatra", "Careers", "Contact"]
                },
                {
                  title: "Support",
                  links: ["Help Center", "Learning Community", "System Status"]
                }
              ].map((section, index) => (
                <div key={index}>
                  <h4 className="font-semibold mb-6 text-xl">{section.title}</h4>
                  <ul className="space-y-3 text-gray-400">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex} className="hover:text-white transition-colors duration-300 cursor-pointer">
                        {link}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-800 mt-16 pt-12 text-center text-gray-400 text-lg">
              <p>© 2024 EduYatra. All rights reserved. Supervised Learning Platform.</p>
            </div>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scaleX(0);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }
        
        @keyframes perspective-rotate {
          0% { transform: perspective(1000px) rotateY(0deg); }
          100% { transform: perspective(1000px) rotateY(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scale-in 1s ease-out forwards;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
        }
        
        .delay-700 {
          animation-delay: 0.7s;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .hover\\:rotateY-5:hover {
          transform: rotateY(-5deg);
        }
        
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};

export default Index;