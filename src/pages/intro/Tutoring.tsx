
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, Video, MessageCircle, Calendar, CheckCircle, Users, BookOpen } from "lucide-react";

const Tutoring = () => {
  const tutors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      subject: "Mathematics",
      specialties: ["Calculus", "Statistics", "Linear Algebra"],
      rating: 4.9,
      reviews: 234,
      hourlyRate: 45,
      experience: "8 years",
      avatar: "/api/placeholder/64/64",
      qualifications: ["PhD Mathematics", "MIT Graduate"],
      nextAvailable: "Today 3:00 PM"
    },
    {
      id: 2,
      name: "Prof. James Wilson",
      subject: "Physics",
      specialties: ["Quantum Physics", "Mechanics", "Thermodynamics"],
      rating: 4.8,
      reviews: 189,
      hourlyRate: 50,
      experience: "12 years",
      avatar: "/api/placeholder/64/64",
      qualifications: ["PhD Physics", "Oxford Professor"],
      nextAvailable: "Tomorrow 10:00 AM"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      subject: "Chemistry",
      specialties: ["Organic Chemistry", "Biochemistry", "Lab Techniques"],
      rating: 4.9,
      reviews: 156,
      hourlyRate: 42,
      experience: "6 years",
      avatar: "/api/placeholder/64/64",
      qualifications: ["PhD Chemistry", "Research Scientist"],
      nextAvailable: "Today 7:00 PM"
    },
    {
      id: 4,
      name: "Mr. David Kim",
      subject: "Computer Science",
      specialties: ["Python", "Data Structures", "Machine Learning"],
      rating: 4.9,
      reviews: 298,
      hourlyRate: 55,
      experience: "10 years",
      avatar: "/api/placeholder/64/64",
      qualifications: ["MS Computer Science", "Senior Engineer"],
      nextAvailable: "Today 5:00 PM"
    }
  ];

  const features = [
    {
      icon: Video,
      title: "1-on-1 Video Sessions",
      description: "Personal attention with live video calls and screen sharing capabilities."
    },
    {
      icon: MessageCircle,
      title: "24/7 Chat Support",
      description: "Get quick answers to your questions anytime with instant messaging."
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your schedule with easy rescheduling options."
    },
    {
      icon: CheckCircle,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed session reports and feedback."
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
          <Link to="/tutoring" className="text-blue-600 font-medium">Tutoring</Link>
          <Link to="/schools" className="text-gray-700 hover:text-blue-600 transition-colors">Schools</Link>
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
            Get{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
              Expert Tutoring
            </span>
            {" "}On-Demand
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with qualified tutors for personalized learning sessions. Available 24/7 to help you succeed.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-3xl p-12 shadow-lg mb-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Expert Tutors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">50K+</div>
              <div className="text-gray-600">Sessions Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">4.9</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Availability</div>
            </div>
          </div>
        </div>

        {/* Tutors Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Top Tutors</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {tutors.map((tutor) => (
              <Card key={tutor.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={tutor.avatar} alt={tutor.name} />
                      <AvatarFallback>{tutor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{tutor.name}</CardTitle>
                      <p className="text-blue-600 font-medium">{tutor.subject}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{tutor.rating}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{tutor.reviews} reviews</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">${tutor.hourlyRate}</div>
                      <div className="text-sm text-gray-600">per hour</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {tutor.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      <span>{tutor.qualifications.join(", ")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{tutor.experience} of experience</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Next available: {tutor.nextAvailable}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                      Book Session
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-12 mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="font-bold mb-2">Choose Your Tutor</h3>
              <p className="text-gray-600">Browse our expert tutors and select the perfect match for your needs.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="font-bold mb-2">Schedule Your Session</h3>
              <p className="text-gray-600">Pick a time that works for you and book your session instantly.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="font-bold mb-2">Start Learning</h3>
              <p className="text-gray-600">Join your video session and get personalized help from your tutor.</p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold mb-8">Flexible Pricing Options</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Pay As You Go</CardTitle>
                <div className="text-3xl font-bold">$35-60<span className="text-lg font-normal">/hour</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• No commitment</li>
                  <li>• Book individual sessions</li>
                  <li>• Access to all tutors</li>
                  <li>• 24/7 support</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-blue-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500">Most Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle>Weekly Package</CardTitle>
                <div className="text-3xl font-bold">$120<span className="text-lg font-normal">/week</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 4 hours per week</li>
                  <li>• 25% discount</li>
                  <li>• Priority booking</li>
                  <li>• Progress tracking</li>
                </ul>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">Choose Plan</Button>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle>Monthly Package</CardTitle>
                <div className="text-3xl font-bold">$400<span className="text-lg font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• 16 hours per month</li>
                  <li>• 35% discount</li>
                  <li>• Dedicated tutor</li>
                  <li>• Custom study plan</li>
                </ul>
                <Button className="w-full mt-6" variant="outline">Choose Plan</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to accelerate your learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your first session today and experience personalized tutoring that gets results.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Find Your Tutor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tutoring;
