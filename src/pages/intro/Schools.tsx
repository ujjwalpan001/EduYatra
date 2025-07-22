
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, TrendingUp, Shield, Award, Building, Calendar, BarChart3, CheckCircle } from "lucide-react";

const Schools = () => {
  const schoolTypes = [
    {
      title: "Primary Schools",
      description: "Foundation learning for ages 5-11",
      features: ["Interactive lessons", "Progress tracking", "Parent dashboard", "Curriculum aligned"],
      price: "From £5 per student/month",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Secondary Schools", 
      description: "Comprehensive education for ages 11-18",
      features: ["GCSE & A-Level prep", "Mock exams", "Analytics dashboard", "Homework management"],
      price: "From £8 per student/month",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Universities",
      description: "Advanced learning solutions",
      features: ["Research tools", "Peer collaboration", "Advanced analytics", "Custom content"],
      price: "Custom pricing",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Manage unlimited students with detailed profiles and progress tracking."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive insights into student performance and learning patterns."
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "GDPR compliant with enterprise-grade security and privacy protection."
    },
    {
      icon: Calendar,
      title: "Curriculum Planning",
      description: "Align content with your curriculum and schedule lessons effectively."
    },
    {
      icon: Award,
      title: "Achievement Tracking",
      description: "Monitor student achievements and celebrate learning milestones."
    },
    {
      icon: Building,
      title: "Multi-Campus Support",
      description: "Manage multiple locations and departments from a single dashboard."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Head of Mathematics",
      school: "Westfield Academy",
      quote: "EduDojo has transformed how we teach mathematics. Our students are more engaged and their test scores have improved by 35%.",
      students: 850
    },
    {
      name: "Dr. James Thompson",
      role: "Principal",
      school: "Oxford International School",
      quote: "The analytics dashboard gives us incredible insights into student learning. It's been invaluable for our teaching strategies.",
      students: 1200
    },
    {
      name: "Maria Rodriguez",
      role: "Science Department Lead",
      school: "Cambridge High School",
      quote: "Our science students love the interactive lessons. Engagement has increased significantly since we started using EduDojo.",
      students: 650
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-bold">EduDojo</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</Link>
          <Link to="/courses" className="text-gray-700 hover:text-blue-600 transition-colors">Courses</Link>
          <Link to="/tutoring" className="text-gray-700 hover:text-blue-600 transition-colors">Tutoring</Link>
          <Link to="/schools" className="text-blue-600 font-medium">Schools</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-600">Login</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">Sign up</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Empower Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
              Entire School
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform education with our comprehensive platform designed for schools of all sizes. From primary to university level.
          </p>
        </div>

        {/* Student/Teacher/Admin Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Student</h3>
              <p className="text-gray-600">
                Interactive learning experience with personalized content and progress tracking.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Teacher</h3>
              <p className="text-gray-600">
                Comprehensive tools for lesson planning, assessment, and student management.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚙️</span>
              </div>
              <h3 className="text-xl font-bold mb-4">Admin</h3>
              <p className="text-gray-600">
                School-wide analytics and management tools for administrators and principals.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* School Types */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Solutions for Every Educational Level</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {schoolTypes.map((type, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className={`h-2 bg-gradient-to-r ${type.color}`}></div>
                <CardHeader>
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <p className="text-gray-600">{type.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {type.features.map((feature) => (
                      <li key={feature} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-lg font-bold text-blue-600 mb-4">{type.price}</div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Comprehensive School Management</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-3xl p-12 shadow-lg mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted by Schools Worldwide</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-600">Schools Using EduDojo</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500K+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">50K+</div>
              <div className="text-gray-600">Teachers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">What Educators Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                      ))}
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                  </div>
                  <div className="border-t pt-4">
                    <div className="font-bold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-sm text-blue-600">{testimonial.school}</div>
                    <div className="text-xs text-gray-500 mt-1">{testimonial.students} students</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Implementation Process */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Implementation Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="font-bold mb-2">Consultation</h3>
              <p className="text-gray-600 text-sm">We assess your school's needs and customize the platform accordingly.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="font-bold mb-2">Setup & Training</h3>
              <p className="text-gray-600 text-sm">Our team handles setup and provides comprehensive training for your staff.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="font-bold mb-2">Pilot Program</h3>
              <p className="text-gray-600 text-sm">Start with a small group to test and refine the implementation.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                4
              </div>
              <h3 className="font-bold mb-2">Full Deployment</h3>
              <p className="text-gray-600 text-sm">Roll out to your entire school with ongoing support and monitoring.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your School?</h2>
          <p className="text-xl mb-8 opacity-90">
            Schedule a demo to see how EduDojo can revolutionize learning at your institution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Schedule Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Download Brochure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schools;
