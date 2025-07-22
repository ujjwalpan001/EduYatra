import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Root pages
import Index from "./pages/intro/Index";

//Intro
import Features from "./pages/intro/Features";
import Courses from "./pages/intro/Courses";
import Tutoring from "./pages/intro/Tutoring";
import Schools from "./pages/intro/Schools";
import Signin from "./pages/auth/Signin";
import Signup from "./pages/auth/Signup";
import StudentAuth from "./pages/auth/StudentAuth";
import TeacherAuth from "./pages/auth/TeacherAuth";
import AdminAuth from "./pages/auth/AdminAuth";

// Common pages
import TeacherIndex from "./pages/Dashboard/common/Index";
import Analytics from "./pages/Dashboard/common/Analytics";
import AttendedEnrollment from "./pages/Dashboard/common/AttendedEnrollment";
import ConductTestOffline from "./pages/Dashboard/common/ConductTestOffline";
import ConductTestOnline from "./pages/Dashboard/common/ConductTestOnline";
import CreateQuestion from "./pages/Dashboard/common/CreateQuestion";
import Monitor from "./pages/Dashboard/common/monitor_test";
import GeneralSettings from "./pages/Dashboard/common/GeneralSettings";
import IndividualStudentAnalysis from "./pages/Dashboard/common/IndividualStudentAnalysis";
import ManageStudents from "./pages/Dashboard/common/ManageStudents";
import MyPerformance from "./pages/Dashboard/common/MyPerformance";
import NotFound from "./pages/Dashboard/common/NotFound";
import OngoingEnrollment from "./pages/Dashboard/common/OngoingEnrollment";
import OngoingTestExam from "./pages/Dashboard/common/OngoingTestExam";
import Reports from "./pages/Dashboard/common/Reports";
import ReviewQuestionSets from "./pages/Dashboard/common/ReviewQuestionSets";
import TestExamAnalysis from "./pages/Dashboard/common/TestExamAnalysis";

// Student pages
import StudentIndex from "./pages/Dashboard/student/Index";
import Enrollment from "./pages/Dashboard/student/Enrollment";
import SettingsStudent from "./pages/Dashboard/student/Settings";
import LearnByTopic from "./pages/Dashboard/student/LearnByTopic";
import MyPerformanceStudent from "./pages/Dashboard/student/MyPerformance";
import PracticeExams from "./pages/Dashboard/student/PracticeExams";
import TestPage from "./pages/Dashboard/student/TestPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/tutoring" element={<Tutoring />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/SIgnin" element={<Signin />} />
            <Route path="/SIgnup" element={<Signup />} />
            <Route path="/auth/student" element={<StudentAuth />} />
            <Route path="/auth/teacher" element={<TeacherAuth />} />
            <Route path="/auth/admin" element={<AdminAuth />} />
            <Route path="/teacher" element={<TeacherIndex/>} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/conduct-test/online" element={<ConductTestOnline />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/conduct-test/offline" element={<ConductTestOffline />} />
            <Route path="/questions/create" element={<CreateQuestion />} />
            <Route path="/questions/review" element={<ReviewQuestionSets />} />
            <Route path="/performance/analysis" element={<TestExamAnalysis />} />
            <Route path="/performance/individual" element={<IndividualStudentAnalysis />} />
            <Route path="/performance/ongoing" element={<OngoingTestExam />} />
            <Route path="/manage-students" element={<ManageStudents />} />
            <Route path="/student" element={<StudentIndex/>} />
            <Route path="/student/learn" element={<LearnByTopic />} />
            <Route path="/student/practice" element={<PracticeExams />} />
            <Route path="/student/performance" element={<MyPerformanceStudent />} />
            <Route path="/student/enrollment" element={<Enrollment />} />
            <Route path="/test" element={< TestPage />} />
            <Route path="/settings/general" element={<GeneralSettings />} />
            <Route path="/student/settings" element={<SettingsStudent />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;