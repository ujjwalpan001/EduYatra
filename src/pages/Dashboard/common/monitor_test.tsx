import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Monitor, 
  Users, 
  Clock, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Camera,
  Shield,
  Activity,
  User,
  Mail,
  Timer,
  BookOpen,
  Flag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Submitted';
  timeRemaining: number; // in minutes
  totalTime: number;
  questionSet: number;
  currentQuestion: number;
  totalQuestions: number;
  proctoring: {
    webcamEnabled: boolean;
    tabSwitches: number;
    suspiciousActivity: number;
    lastActivity: string;
  };
  answers: {
    attempted: number;
    marked: number;
  };
}

interface TestDetails {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  startTime: string;
  endTime: string;
  questionSets: number;
  questionsPerSet: number;
  securitySettings: {
    disableTabSwitching: boolean;
    disableRightClick: boolean;
    enableProctoring: boolean;
    enableWebcam: boolean;
  };
}

interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  type: 'tab_switch' | 'suspicious_activity' | 'webcam_disabled' | 'time_warning';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const MonitorTest: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [testDetails, setTestDetails] = useState<TestDetails | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Simulate real-time data fetching
  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock test details
        const mockTestDetails: TestDetails = {
          id: testId || 'test1',
          title: 'Mathematics Mid-term Exam',
          subject: 'Mathematics',
          duration: 90,
          totalStudents: 45,
          activeStudents: 38,
          completedStudents: 7,
          startTime: '2025-06-23T10:00:00',
          endTime: '2025-06-23T11:30:00',
          questionSets: 3,
          questionsPerSet: 15,
          securitySettings: {
            disableTabSwitching: true,
            disableRightClick: true,
            enableProctoring: true,
            enableWebcam: true
          }
        };

        // Mock student data
        const mockStudents: Student[] = [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@school.edu',
            status: 'In Progress',
            timeRemaining: 45,
            totalTime: 90,
            questionSet: 1,
            currentQuestion: 8,
            totalQuestions: 15,
            proctoring: {
              webcamEnabled: true,
              tabSwitches: 0,
              suspiciousActivity: 0,
              lastActivity: '2 mins ago'
            },
            answers: {
              attempted: 7,
              marked: 2
            }
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@school.edu',
            status: 'In Progress',
            timeRemaining: 38,
            totalTime: 90,
            questionSet: 2,
            currentQuestion: 12,
            totalQuestions: 15,
            proctoring: {
              webcamEnabled: true,
              tabSwitches: 2,
              suspiciousActivity: 1,
              lastActivity: '1 min ago'
            },
            answers: {
              attempted: 11,
              marked: 3
            }
          },
          {
            id: '3',
            name: 'Michael Davis',
            email: 'michael.davis@school.edu',
            status: 'Completed',
            timeRemaining: 0,
            totalTime: 90,
            questionSet: 1,
            currentQuestion: 15,
            totalQuestions: 15,
            proctoring: {
              webcamEnabled: true,
              tabSwitches: 0,
              suspiciousActivity: 0,
              lastActivity: '15 mins ago'
            },
            answers: {
              attempted: 15,
              marked: 1
            }
          },
          {
            id: '4',
            name: 'Emily Wilson',
            email: 'emily.wilson@school.edu',
            status: 'In Progress',
            timeRemaining: 52,
            totalTime: 90,
            questionSet: 3,
            currentQuestion: 5,
            totalQuestions: 15,
            proctoring: {
              webcamEnabled: false,
              tabSwitches: 1,
              suspiciousActivity: 0,
              lastActivity: '30 secs ago'
            },
            answers: {
              attempted: 4,
              marked: 1
            }
          },
          {
            id: '5',
            name: 'David Brown',
            email: 'david.brown@school.edu',
            status: 'Not Started',
            timeRemaining: 90,
            totalTime: 90,
            questionSet: 2,
            currentQuestion: 0,
            totalQuestions: 15,
            proctoring: {
              webcamEnabled: false,
              tabSwitches: 0,
              suspiciousActivity: 0,
              lastActivity: 'Never'
            },
            answers: {
              attempted: 0,
              marked: 0
            }
          }
        ];

        // Mock alerts
        const mockAlerts: Alert[] = [
          {
            id: '1',
            studentId: '2',
            studentName: 'Sarah Johnson',
            type: 'tab_switch',
            message: 'Student switched tabs 2 times',
            timestamp: '2025-06-23T10:25:00',
            severity: 'medium'
          },
          {
            id: '2',
            studentId: '4',
            studentName: 'Emily Wilson',
            type: 'webcam_disabled',
            message: 'Webcam has been disabled',
            timestamp: '2025-06-23T10:30:00',
            severity: 'high'
          },
          {
            id: '3',
            studentId: '2',
            studentName: 'Sarah Johnson',
            type: 'suspicious_activity',
            message: 'Suspicious activity detected',
            timestamp: '2025-06-23T10:28:00',
            severity: 'high'
          }
        ];

        setTestDetails(mockTestDetails);
        setStudents(mockStudents);
        setAlerts(mockAlerts);
      } catch (error) {
        console.error('Error fetching test data:', error);
        toast.error("❌ Failed to load test data");
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, [testId]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // Simulate real-time updates
      setStudents(prev => prev.map(student => ({
        ...student,
        timeRemaining: Math.max(0, student.timeRemaining - 1),
        currentQuestion: student.status === 'In Progress' ? 
          Math.min(student.totalQuestions, student.currentQuestion + Math.random() > 0.8 ? 1 : 0) : 
          student.currentQuestion
      })));
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const getStatusColor = (status: Student['status']) => {
    switch (status) {
      case 'Not Started': return 'bg-gray-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Submitted': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'tab_switch': return <Eye className="h-4 w-4" />;
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4" />;
      case 'webcam_disabled': return <Camera className="h-4 w-4" />;
      case 'time_warning': return <Clock className="h-4 w-4" />;
      default: return <Flag className="h-4 w-4" />;
    }
  };

  const filteredStudents = filterStatus === 'all' 
    ? students 
    : students.filter(student => student.status === filterStatus);

  const handleRefresh = () => {
    toast.success("🔄 Data refreshed");
    // In real implementation, this would trigger a data fetch
  };

  const handleStudentAction = (studentId: string, action: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      toast.success(`${action} applied to ${student.name}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">Loading test monitoring data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!testDetails) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-lg font-medium">Test not found</p>
            <Button onClick={() => navigate(-1)} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
              className="hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Test Monitor
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time monitoring for "{testDetails.title}"
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn(autoRefresh && "bg-green-50 border-green-200")}
            >
              {autoRefresh ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Auto-refresh On
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Auto-refresh Off
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Test Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-scale-in">
          <Card className="glass-effect border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{testDetails.totalStudents}</p>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{testDetails.activeStudents}</p>
                  <p className="text-sm text-muted-foreground">Active Now</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{testDetails.completedStudents}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-effect border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{alerts.length}</p>
                  <p className="text-sm text-muted-foreground">Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student List */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Students ({filteredStudents.length})
                  </CardTitle>
                  <div className="flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-1 text-sm border rounded-md bg-background"
                    >
                      <option value="all">All Status</option>
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Submitted">Submitted</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[600px] overflow-y-auto">
                  {filteredStudents.map((student, index) => (
                    <div 
                      key={student.id} 
                      className={cn(
                        "p-4 border-b hover:bg-muted/50 transition-colors cursor-pointer animate-slide-in",
                        selectedStudent === student.id && "bg-primary/10"
                      )}
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-white", getStatusColor(student.status))}>
                            {student.status}
                          </Badge>
                          {testDetails.securitySettings.enableWebcam && (
                            <div className="flex items-center gap-1">
                              <Camera className={cn(
                                "h-4 w-4",
                                student.proctoring.webcamEnabled ? "text-green-500" : "text-red-500"
                              )} />
                            </div>
                          )}
                          {student.proctoring.tabSwitches > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {student.proctoring.tabSwitches} tabs
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {selectedStudent === student.id && (
                        <div className="mt-4 p-4 bg-muted/30 rounded-lg space-y-3 animate-fade-in">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Time Remaining</p>
                              <p className="font-medium flex items-center gap-1">
                                <Timer className="h-4 w-4" />
                                {student.timeRemaining}m
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Question Set</p>
                              <p className="font-medium flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                Set {student.questionSet}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Progress</p>
                              <p className="font-medium">
                                {student.currentQuestion}/{student.totalQuestions}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Attempted</p>
                              <p className="font-medium">
                                {student.answers.attempted}/{student.totalQuestions}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStudentAction(student.id, 'Send Message')}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStudentAction(student.id, 'View Screen')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Screen
                            </Button>
                            {student.status === 'In Progress' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStudentAction(student.id, 'Pause Test')}
                              >
                                <Pause className="h-4 w-4 mr-1" />
                                Pause
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Security Panel */}
          <div className="space-y-4">
            {/* Security Status */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Tab Switch Detection</span>
                  <Badge className={testDetails.securitySettings.disableTabSwitching ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {testDetails.securitySettings.disableTabSwitching ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Right Click Disabled</span>
                  <Badge className={testDetails.securitySettings.disableRightClick ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {testDetails.securitySettings.disableRightClick ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>AI Proctoring</span>
                  <Badge className={testDetails.securitySettings.enableProctoring ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {testDetails.securitySettings.enableProctoring ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Webcam Monitoring</span>
                  <Badge className={testDetails.securitySettings.enableWebcam ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {testDetails.securitySettings.enableWebcam ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card className="glass-effect border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No alerts at this time
                  </p>
                ) : (
                  alerts.slice(0, 5).map((alert, index) => (
                    <div 
                      key={alert.id} 
                      className={cn(
                        "p-3 rounded-lg border animate-fade-in",
                        getAlertColor(alert.severity)
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-2">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{alert.studentName}</p>
                          <p className="text-xs">{alert.message}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Test Info */}
            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Test Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{testDetails.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Question Sets:</span>
                  <span className="font-medium">{testDetails.questionSets}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Questions/Set:</span>
                  <span className="font-medium">{testDetails.questionsPerSet}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Time:</span>
                  <span className="font-medium">
                    {new Date(testDetails.startTime).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Time:</span>
                  <span className="font-medium">
                    {new Date(testDetails.endTime).toLocaleTimeString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MonitorTest;