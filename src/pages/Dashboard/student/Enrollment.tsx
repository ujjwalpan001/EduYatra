import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Clock, Play, CheckCircle, Info } from "lucide-react";
import { TestInstructionsModal } from "@/components/students/TestInstructionsModal";
import { toast } from "sonner";

// Utility function for authenticated API calls (copied from ConductTestOnline.tsx and TestPage.tsx)
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No authentication token found in localStorage');
    throw new Error('No authentication token found. Please log in.');
  }
  console.log(`Making request to ${url} with token: ${token.substring(0, 10)}...`);
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const contentType = response.headers.get('content-type');
    if (!response.ok) {
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        console.error(`API request failed: ${url}`, data);
        throw new Error(data.error || `HTTP ${response.status}: Failed to fetch data`);
      } else {
        const text = await response.text();
        console.error(`Non-JSON response from ${url}:`, text.substring(0, 100));
        throw new Error(`HTTP ${response.status}: Non-JSON response received (likely 404 or server error)`);
      }
    }
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error(`Expected JSON but received: ${text.substring(0, 100)}`);
      throw new Error('Invalid response format: Expected JSON');
    }
    return response;
  } catch (error) {
    console.error(`fetchWithAuth error for ${url}:`, error);
    throw error;
  }
};

interface Test {
  examId: string; // Added examId
  name: string;
  duration: string;
  totalQuestions: number;
  maxMarks: number;
}

interface Exam {
  _id: string;
  title: string;
  instructor: string;
  progress: number;
  deadline: string;
  totalQuestions: number; // Should map to numberOfQuestionsPerSet
  completedQuestions: number;
  timeRemaining: string;
  category: string;
  duration_minutes: number;
  numberOfQuestionsPerSet: number; // Added for consistency
}

interface AttendedTest {
  _id?: string;
  examId?: string;
  test: string;
  score: number;
  date: string;
  instructor: string;
  grade: string;
  totalQuestions: number;
  correctAnswers?: number;
  timeSpent: string;
  submittedAt?: Date;
}

const Enrollment: React.FC = () => {
  const navigate = useNavigate();
  const [isTestStarting, setIsTestStarting] = useState<boolean>(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showAttendedDetails, setShowAttendedDetails] = useState<string | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [attendedTests, setAttendedTests] = useState<AttendedTest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingAttended, setLoadingAttended] = useState<boolean>(true);

  // Fetch assigned (ongoing) exams
  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth('https://eduyatrabackend.onrender.com/api/exams/assigned');
        const data = await response.json();
        console.log('Assigned exams response:', data);

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch exams');
        }

        if (!data.success || !data.exams) {
          throw new Error('Invalid response format');
        }

        if (data.exams.length === 0) {
          console.warn('No exams found for the student');
          toast("No exams are assigned to your classes yet.", {
            description: "Please check back later or contact your instructor.",
          });
        } else {
          console.log('Exams fetched successfully:', data.exams);
        }

        // Map backend exams to Exam interface
        const mappedExams = data.exams.map((exam: any) => ({
          _id: exam._id,
          title: exam.title || 'Untitled Exam',
          instructor: exam.instructor || 'Unknown',
          progress: exam.progress || 0,
          deadline: exam.deadline || 'Unknown',
          totalQuestions: exam.number_of_questions_per_set || exam.totalQuestions || 0,
          completedQuestions: exam.completedQuestions || 0,
          timeRemaining: exam.timeRemaining || 'Unknown',
          category: exam.category || 'Unknown',
          duration_minutes: exam.duration_minutes || 60,
          numberOfQuestionsPerSet: exam.number_of_questions_per_set || exam.totalQuestions || 0,
        }));
        setExams(mappedExams);
      } catch (error) {
        console.error('Fetch exams error:', error);
        toast.error(`Failed to load exams: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setExams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [navigate]);

  // Fetch attended tests
  useEffect(() => {
    const fetchAttendedTests = async () => {
      setLoadingAttended(true);
      try {
        console.log('🔍 Fetching attended tests from backend...');
        const response = await fetchWithAuth('http://eduyatrabackend.onrender.com/api/exams/attended-tests');
        const data = await response.json();
        console.log('📥 Attended tests RAW response:', data);
        console.log('📊 Response status:', response.status, response.ok);

        if (!response.ok) {
          console.error('❌ Response not OK:', data);
          throw new Error(data.error || 'Failed to fetch attended tests');
        }

        if (data.success && data.attendedTests) {
          console.log('✅ Setting attended tests:', data.attendedTests);
          console.log('📈 Number of attended tests:', data.attendedTests.length);
          setAttendedTests(data.attendedTests);
        } else {
          console.warn('⚠️ No attended tests in response or success=false');
          setAttendedTests([]);
        }
      } catch (error) {
        console.error('❌ Fetch attended tests error:', error);
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
        // Show error toast to help debug
        toast.error(`Failed to load attended tests: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setAttendedTests([]);
      } finally {
        setLoadingAttended(false);
        console.log('🏁 Attended tests loading finished');
      }
    };

    fetchAttendedTests();
  }, []);

  const handleContinueTest = (test: Pick<Exam, '_id' | 'title' | 'numberOfQuestionsPerSet' | 'duration_minutes'>) => {
    console.log('handleContinueTest called with test:', test); // Debug log
    setSelectedTest({
      examId: test._id,
      name: test.title,
      duration: test.duration_minutes.toString(),
      totalQuestions: test.numberOfQuestionsPerSet,
      maxMarks: test.numberOfQuestionsPerSet * 1, // Adjust marks per question as needed
    });
    setIsTestStarting(true);
  };

  const handleTestStart = () => {
    if (selectedTest) {
      console.log('Navigating to /test with state:', selectedTest); // Debug log
      navigate('/test', {
        state: {
          examId: selectedTest.examId,
          testName: selectedTest.name,
          totalQuestions: selectedTest.totalQuestions,
          duration: selectedTest.duration,
          maxMarks: selectedTest.maxMarks,
          redirectPath: '/student/enrollment'
        }
      });
      setIsTestStarting(false);
      setSelectedTest(null);
    } else {
      console.error('No selectedTest found in handleTestStart');
      toast.error('Failed to start test: No test selected');
    }
  };

  const toggleDetails = (id: string) => {
    setShowDetails(showDetails === id ? null : id);
  };

  const toggleAttendedDetails = (test: string) => {
    setShowAttendedDetails(showAttendedDetails === test ? null : test);
  };

  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Enrollment
            </h1>
            <p className="text-gray-500 mt-2">Manage your ongoing and completed enrollments</p>
          </div>
        </div>

        <Card className="border border-gray-200 shadow-md animate-fade-in">
          <CardContent className="p-6">
            <Tabs defaultValue="ongoing" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                <TabsTrigger value="ongoing">Ongoing Tests</TabsTrigger>
                <TabsTrigger value="attended">Attended Tests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ongoing" className="space-y-6 mt-6">
                {loading ? (
                  <p className="text-sm text-gray-500">Loading exams...</p>
                ) : exams.length === 0 ? (
                  <p className="text-sm text-destructive">No exams assigned to your classes.</p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {exams.map((test, index) => (
                      <div key={test._id}>
                        <Card className="border border-gray-200 transition-all duration-200 hover:shadow-lg animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg text-gray-800">{test.title}</CardTitle>
                              <Badge variant={test.deadline === 'Expired' ? 'destructive' : test.progress > 80 ? 'default' : test.progress > 50 ? 'secondary' : 'destructive'} className={test.deadline === 'Expired' ? 'bg-red-500' : test.progress > 80 ? 'bg-blue-500' : test.progress > 50 ? 'bg-gray-500' : 'bg-red-500'}>
                                {test.deadline}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">by {test.instructor}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-gray-700">Progress</span>
                                  <span className="text-sm text-gray-500">{test.completedQuestions}/{test.numberOfQuestionsPerSet} questions</span>
                                </div>
                                <Progress value={test.progress} className="h-3" />
                                <p className="text-xs text-gray-500 mt-1">{test.progress}% complete</p>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-4 w-4 text-blue-500" />
                                  <span className="font-medium text-gray-700">Time Remaining:</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{test.timeRemaining}</p>
                              </div>

                              <div className="flex gap-2">
                                <Button 
                                  variant="default" 
                                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                                  onClick={() => handleContinueTest({
                                    _id: test._id,
                                    title: test.title,
                                    numberOfQuestionsPerSet: test.numberOfQuestionsPerSet,
                                    duration_minutes: test.duration_minutes
                                  })}
                                  disabled={test.deadline === 'Expired'}
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Continue
                                </Button>
                                <Button 
                                  variant="outline" 
                                  className="border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                                  onClick={() => toggleDetails(test._id)}
                                >
                                  <Info className="h-4 w-4 mr-1" />
                                  {showDetails === test._id ? 'Hide Details' : 'Details'}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        {showDetails === test._id && (
                          <Card className="mt-4 border border-gray-200 shadow-md animate-fade-in">
                            <CardHeader>
                              <CardTitle className="text-lg text-gray-800">Exam Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2 text-gray-700">
                                <p><strong>Title:</strong> {test.title}</p>
                                <p><strong>Instructor:</strong> {test.instructor}</p>
                                <p><strong>Category:</strong> {test.category}</p>
                                <p><strong>Total Questions:</strong> {test.numberOfQuestionsPerSet}</p>
                                <p><strong>Completed Questions:</strong> {test.completedQuestions}</p>
                                <p><strong>Progress:</strong> {test.progress}%</p>
                                <p><strong>Duration:</strong> {test.duration_minutes} minutes</p>
                                <p><strong>Deadline:</strong> {test.deadline}</p>
                                <p><strong>Time Remaining:</strong> {test.timeRemaining}</p>
                              </div>
                              <Button
                                className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                                onClick={() => toggleDetails(test._id)}
                              >
                                Close
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="attended" className="space-y-6 mt-6">
                {loadingAttended ? (
                  <p className="text-sm text-gray-500">Loading attended tests...</p>
                ) : attendedTests.length === 0 ? (
                  <p className="text-sm text-gray-500">No tests attended yet.</p>
                ) : (
                  <>
                    <div className="space-y-4">
                      {attendedTests.map((result, index) => (
                        <div key={result._id || result.test}>
                          <Card className="border border-gray-200 transition-all duration-200 hover:shadow-lg animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <h3 className="font-medium text-gray-800">{result.test}</h3>
                                  </div>
                                  <p className="text-sm text-gray-500">by {result.instructor}</p>
                                  <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <span>{result.date}</span>
                                    <span>•</span>
                                    <span>{result.totalQuestions} questions</span>
                                    <span>•</span>
                                    <span>Completed in {result.timeSpent}</span>
                                  </div>
                                </div>
                                <div className="text-right space-y-2">
                                  <div className="text-2xl font-bold text-blue-500">{result.score}%</div>
                                  <Badge variant={result.score >= 90 ? 'default' : 'secondary'} className={result.score >= 90 ? 'bg-blue-500' : 'bg-gray-500'}>
                                    Grade: {result.grade}
                                  </Badge>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                                      onClick={() => toggleAttendedDetails(result._id || result.test)}
                                    >
                                      <Info className="h-4 w-4 mr-1" />
                                      {showAttendedDetails === (result._id || result.test) ? 'Hide Details' : 'View Details'}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          {showAttendedDetails === (result._id || result.test) && (
                            <Card className="mt-4 border border-gray-200 shadow-md animate-fade-in">
                              <CardHeader>
                                <CardTitle className="text-lg text-gray-800">Test Details</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2 text-gray-700">
                                  <p><strong>Test Name:</strong> {result.test}</p>
                                  <p><strong>Instructor:</strong> {result.instructor}</p>
                                  <p><strong>Score:</strong> {result.score}%</p>
                                  <p><strong>Grade:</strong> {result.grade}</p>
                                  <p><strong>Date:</strong> {result.date}</p>
                                  <p><strong>Total Questions:</strong> {result.totalQuestions}</p>
                                  {result.correctAnswers !== undefined && (
                                    <p><strong>Correct Answers:</strong> {result.correctAnswers}/{result.totalQuestions}</p>
                                  )}
                                  <p><strong>Time Spent:</strong> {result.timeSpent}</p>
                                </div>
                                <Button
                                  className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
                                  onClick={() => toggleAttendedDetails(result._id || result.test)}
                                >
                                  Close
                                </Button>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      ))}
                    </div>

                    <Card className="border border-gray-200 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-gray-800">Attendance Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">{attendedTests.length}</div>
                            <p className="text-sm text-gray-500">Total Tests</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-500">
                              {attendedTests.length > 0 
                                ? (attendedTests.reduce((sum, t) => sum + t.score, 0) / attendedTests.length).toFixed(1)
                                : 0}%
                            </div>
                            <p className="text-sm text-gray-500">Average Score</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-500">
                              {attendedTests.length > 0 ? Math.max(...attendedTests.map(t => t.score)) : 0}%
                            </div>
                            <p className="text-sm text-gray-500">Best Score</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-500">
                              {attendedTests.length > 0 
                                ? attendedTests.reduce((sum, t) => {
                                    const time = t.timeSpent.match(/(\d+)/g);
                                    if (!time) return sum;
                                    if (t.timeSpent.includes('h')) {
                                      return sum + parseInt(time[0]) * 60 + (time[1] ? parseInt(time[1]) : 0);
                                    }
                                    return sum + parseInt(time[0]);
                                  }, 0)
                                : 0} min
                            </div>
                            <p className="text-sm text-gray-500">Total Time</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {selectedTest && (
        <TestInstructionsModal
          isOpen={isTestStarting}
          onClose={() => {
            console.log('TestInstructionsModal closed'); // Debug log
            setIsTestStarting(false);
            setSelectedTest(null);
          }}
          onStartTest={() => {
            console.log('TestInstructionsModal onStartTest triggered'); // Debug log
            handleTestStart();
          }}
          testName={selectedTest.name}
          duration={selectedTest.duration}
          totalQuestions={selectedTest.totalQuestions}
          maxMarks={selectedTest.maxMarks}
        />
      )}
    </Layout>
  );
};

export default Enrollment;