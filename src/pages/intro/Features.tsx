
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, Star, Award, User, GraduationCap, Shield, Brain, BarChart3, TrendingUp, CheckCircle, Clock, Target, Video, MessageSquare } from "lucide-react";

const Features = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">EduYatra</Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/features" className="text-purple-600 font-medium">
            Features
          </Link>
          <Link to="/courses" className="text-gray-700 hover:text-purple-600 transition-colors">
            Courses
          </Link>
          <Link to="/tutoring" className="text-gray-700 hover:text-purple-600 transition-colors">
            Supervision
          </Link>
          <Link to="/schools" className="text-gray-700 hover:text-purple-600 transition-colors">
            Institutions
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-600">Login</Button>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">Sign up</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-purple-100 text-purple-700 border-purple-200">
              ✨ Comprehensive Learning Features
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need for{" "}
              <span className="relative">
                Supervised Learning
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full"></div>
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover powerful features designed to enhance teacher-student collaboration, streamline exam processes, and track learning progress effectively.
            </p>
          </div>
        </div>
      </div>

      {/* Core Features Grid */}
      <div className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Teacher-Student Collaboration</h3>
                <p className="text-gray-600 mb-4">
                  Seamless communication between teachers and students with real-time interaction tools and progress sharing.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Real-time chat and discussion forums
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Assignment submission and feedback
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Virtual study sessions
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Comprehensive Exam System</h3>
                <p className="text-gray-600 mb-4">
                  Advanced online examination platform with secure proctoring and automated evaluation capabilities.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Secure online proctoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Automated grading system
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Multiple question formats
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Advanced Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Detailed insights into learning progress, performance trends, and areas for improvement.
                </p>
                <ul className="text-sm text-gray-500 space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Performance tracking dashboards
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Learning pattern analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Progress reports generation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Detailed Features */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built for Modern Education
            </h2>
            <p className="text-xl text-gray-600">
              Everything educators and students need in one comprehensive platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <Video className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Live Classes</h4>
                <p className="text-sm text-gray-600">Interactive video sessions with screen sharing and whiteboard tools</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Discussion Forums</h4>
                <p className="text-sm text-gray-600">Threaded discussions for Q&A and collaborative learning</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Scheduling</h4>
                <p className="text-sm text-gray-600">Smart calendar integration for classes, exams, and deadlines</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Security</h4>
                <p className="text-sm text-gray-600">End-to-end encryption and secure data handling</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Digital Library</h4>
                <p className="text-sm text-gray-600">Vast collection of learning resources and study materials</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <Target className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Goal Tracking</h4>
                <p className="text-sm text-gray-600">Set and monitor learning objectives with milestone tracking</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Progress Reports</h4>
                <p className="text-sm text-gray-600">Detailed analytics and performance insights for continuous improvement</p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md hover:shadow-lg transition-all">
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Achievements</h4>
                <p className="text-sm text-gray-600">Gamified learning with badges, certificates, and rewards</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-700 py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Experience These Features?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of educators and students already using EduYatra's powerful features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg rounded-xl"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <span className="text-xl font-bold">EduYatra</span>
              </div>
              <p className="text-gray-400">
                Empowering education through supervised learning and teacher-student collaboration.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/courses">Courses</Link></li>
                <li><Link to="/tutoring">Supervision</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About EduYatra</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Learning Community</li>
                <li>System Status</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduYatra. All rights reserved. Supervised Learning Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
