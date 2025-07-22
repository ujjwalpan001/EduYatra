
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Clock, Star, ChevronRight } from "lucide-react";

const Courses = () => {
  const courses = [
    {
      id: 1,
      title: "Biology 2025",
      subtitle: "D - Continuity and Change",
      level: "A-Level",
      students: "12.5K",
      lessons: 45,
      duration: "8 weeks",
      rating: 4.9,
      color: "from-green-500 to-green-600",
      topics: ["Cell Biology", "Genetics", "Evolution", "Ecology"]
    },
    {
      id: 2,
      title: "Mathematics 2025",
      subtitle: "Pure Mathematics",
      level: "A-Level",
      students: "18.2K",
      lessons: 62,
      duration: "12 weeks",
      rating: 4.8,
      color: "from-blue-500 to-blue-600",
      topics: ["Calculus", "Algebra", "Statistics", "Mechanics"]
    },
    {
      id: 3,
      title: "Chemistry 2025",
      subtitle: "Organic Chemistry",
      level: "A-Level",
      students: "9.8K",
      lessons: 38,
      duration: "6 weeks",
      rating: 4.9,
      color: "from-purple-500 to-purple-600",
      topics: ["Organic Synthesis", "Reactions", "Mechanisms", "Spectroscopy"]
    },
    {
      id: 4,
      title: "Physics 2025",
      subtitle: "Quantum Physics",
      level: "A-Level",
      students: "7.3K",
      lessons: 41,
      duration: "10 weeks",
      rating: 4.7,
      color: "from-orange-500 to-orange-600",
      topics: ["Wave-Particle Duality", "Energy Levels", "Photoelectric Effect", "Uncertainty"]
    },
    {
      id: 5,
      title: "Computer Science 2025",
      subtitle: "Programming & Algorithms",
      level: "A-Level",
      students: "15.1K",
      lessons: 55,
      duration: "14 weeks",
      rating: 4.9,
      color: "from-indigo-500 to-indigo-600",
      topics: ["Python", "Data Structures", "Algorithms", "Databases"]
    },
    {
      id: 6,
      title: "English Literature 2025",
      subtitle: "Modern Poetry & Drama",
      level: "A-Level",
      students: "6.7K",
      lessons: 32,
      duration: "8 weeks",
      rating: 4.6,
      color: "from-red-500 to-red-600",
      topics: ["Poetry Analysis", "Dramatic Techniques", "Context", "Critical Theory"]
    }
  ];

  const levels = ["All Levels", "GCSE", "A-Level", "IB", "University"];
  const subjects = ["All Subjects", "Mathematics", "Sciences", "Languages", "Humanities", "Computer Science"];

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
          <Link to="/courses" className="text-blue-600 font-medium">Courses</Link>
          <Link to="/tutoring" className="text-gray-700 hover:text-blue-600 transition-colors">Tutoring</Link>
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
            Explore Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
              Course Library
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive courses designed by experts to help you master any subject and ace your exams.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <div className="flex gap-2">
            {levels.map((level) => (
              <Button
                key={level}
                variant={level === "All Levels" ? "default" : "outline"}
                size="sm"
                className={level === "All Levels" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {level}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant="outline"
                size="sm"
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
            <div className="text-gray-600">Total Courses</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1M+</div>
            <div className="text-gray-600">Students Enrolled</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
            <div className="text-gray-600">Expert Instructors</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">4.8</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {courses.map((course) => (
            <Card key={course.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${course.color}`}></div>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {course.level}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                <p className="text-gray-600 text-sm">{course.subtitle}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {course.topics.slice(0, 3).map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {course.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{course.topics.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Course
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Subjects */}
        <div className="bg-white rounded-3xl p-12 shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Subjects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Mathematics", courses: 85, color: "from-blue-500 to-blue-600", icon: "📐" },
              { name: "Biology", courses: 72, color: "from-green-500 to-green-600", icon: "🧬" },
              { name: "Chemistry", courses: 64, color: "from-purple-500 to-purple-600", icon: "⚗️" },
              { name: "Physics", courses: 58, color: "from-orange-500 to-orange-600", icon: "⚛️" }
            ].map((subject) => (
              <Card key={subject.name} className="border-0 shadow-md hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl`}>
                    {subject.icon}
                  </div>
                  <h3 className="font-bold mb-2">{subject.name}</h3>
                  <p className="text-gray-600 text-sm">{subject.courses} courses available</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Can't find the course you're looking for?</h2>
          <p className="text-xl mb-8 opacity-90">
            Request a new course or get personalized tutoring from our expert instructors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Request Course
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Get Tutoring
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
