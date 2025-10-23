import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNavigation } from "@/components/TopNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Users, FileText, Settings } from "lucide-react";
import { toast } from "sonner";

interface DashboardData {
  totalStudents: number;
  totalClasses: number;
  totalExams: number;
  ongoingExams: number;
  upcomingExams: number;
  recentExams: Array<{
    _id: string;
    title: string;
    class_name: string;
    start_time: string;
    status: string;
  }>;
}

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalStudents: 0,
    totalClasses: 0,
    totalExams: 0,
    ongoingExams: 0,
    upcomingExams: 0,
    recentExams: []
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        navigate('/auth/teacher');
        return;
      }

      console.log('📊 Fetching dashboard data...');

      // Fetch exams
      const examsResponse = await fetch('https://eduyatrabackend.onrender.com/api/exams/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Fetch classes
      const classesResponse = await fetch('https://eduyatrabackend.onrender.com/api/classes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!examsResponse.ok || !classesResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const examsData = await examsResponse.json();
      const classesData = await classesResponse.json();

      console.log('✅ Dashboard data received');

      const now = new Date();
      const exams = examsData.data?.exams || examsData.exams || [];
      const classes = classesData.data?.classes || classesData.classes || [];

      // Calculate total students across all classes
      const totalStudents = classes.reduce((sum: number, cls: any) => {
        return sum + (cls.students?.length || 0);
      }, 0);

      // Categorize exams
      let ongoing = 0;
      let upcoming = 0;
      const recent: any[] = [];

      exams.forEach((exam: any) => {
        const startTime = new Date(exam.start_time);
        const endTime = new Date(exam.end_time);

        if (now >= startTime && now <= endTime) {
          ongoing++;
        } else if (now < startTime) {
          upcoming++;
          if (recent.length < 5) {
            recent.push({
              _id: exam._id,
              title: exam.title,
              class_name: exam.class_id?.class_name || 'Unknown Class',
              start_time: exam.start_time,
              status: 'upcoming'
            });
          }
        } else if (recent.length < 5) {
          recent.push({
            _id: exam._id,
            title: exam.title,
            class_name: exam.class_id?.class_name || 'Unknown Class',
            start_time: exam.start_time,
            status: 'completed'
          });
        }
      });

      setDashboardData({
        totalStudents,
        totalClasses: classes.length,
        totalExams: exams.length,
        ongoingExams: ongoing,
        upcomingExams: upcoming,
        recentExams: recent.slice(0, 5)
      });

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-accent/10 to-primary/5">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden ml-16">
            <TopNavigation />
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium">Loading dashboard...</p>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-accent/10 to-primary/5">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden ml-16">
          <TopNavigation />
          <main className="flex-1 p-6 space-y-8 overflow-auto">
            <div className="flex items-center justify-between animate-fade-in">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening with your classes.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border glass-effect animate-slide-in">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchDashboardData}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="hover-lift glass-effect animate-scale-in border-primary/20 hover:border-primary/40 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {dashboardData.totalStudents}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Across {dashboardData.totalClasses} classes
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass-effect animate-scale-in border-primary/20 hover:border-primary/40 transition-all duration-300" style={{ animationDelay: '100ms' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Exams</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    {dashboardData.totalExams}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Created exams
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass-effect animate-scale-in border-primary/20 hover:border-primary/40 transition-all duration-300" style={{ animationDelay: '200ms' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ongoing Tests</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/30 flex items-center justify-center">
                    <span className="text-lg">🟢</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1 bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
                    {dashboardData.ongoingExams}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Currently in progress
                  </p>
                </CardContent>
              </Card>

              <Card className="hover-lift glass-effect animate-scale-in border-primary/20 hover:border-primary/40 transition-all duration-300" style={{ animationDelay: '300ms' }}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Tests</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/30 flex items-center justify-center">
                    <span className="text-lg">📅</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                    {dashboardData.upcomingExams}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                    Scheduled tests
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Recent Exams */}
              <div className="lg:col-span-2">
                <Card className="glass-effect border-primary/20 animate-fade-in">
                  <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-xl">📋</span>
                      Recent Exams
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    {dashboardData.recentExams.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.recentExams.map((exam, index) => (
                          <div 
                            key={exam._id} 
                            className="flex items-center justify-between space-x-4 p-4 border rounded-xl hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] animate-slide-in bg-gradient-to-r from-background to-accent/20 cursor-pointer"
                            style={{ animationDelay: `${index * 100}ms` }}
                            onClick={() => navigate(`/conduct-test/online?examId=${exam._id}`)}
                          >
                            <div className="space-y-2 flex-1">
                              <p className="text-sm font-semibold text-foreground">{exam.title}</p>
                              <p className="text-xs text-muted-foreground flex items-center gap-2">
                                <span className="inline-flex items-center gap-1">
                                  <span>🏫</span>
                                  {exam.class_name}
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <span>📅</span>
                                  {formatDate(exam.start_time)}
                                </span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  <span>⏰</span>
                                  {formatTime(exam.start_time)}
                                </span>
                              </p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                                exam.status === 'upcoming' 
                                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                                  : 'bg-gray-100 text-gray-700 border border-gray-200'
                              }`}>
                                {exam.status}
                              </span>
                              <Button size="sm" variant="outline" className="hover-lift">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No recent exams found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="glass-effect border-primary/20 animate-scale-in hover-lift">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <button 
                    onClick={() => navigate('/conduct-test/online')}
                    className="w-full p-4 text-left border rounded-xl hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-background to-accent/20 animate-slide-in"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                        <Plus className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Create New Test</p>
                        <p className="text-xs text-muted-foreground">Set up a new exam or quiz</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => navigate('/manage-students')}
                    className="w-full p-4 text-left border rounded-xl hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-background to-accent/20 animate-slide-in"
                    style={{ animationDelay: '100ms' }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Manage Students</p>
                        <p className="text-xs text-muted-foreground">View and manage student batches</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => navigate('/performance/ongoing')}
                    className="w-full p-4 text-left border rounded-xl hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-background to-accent/20 animate-slide-in"
                    style={{ animationDelay: '200ms' }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/30 flex items-center justify-center">
                        <span className="text-lg">🟢</span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Ongoing Tests</p>
                        <p className="text-xs text-muted-foreground">Monitor live exams</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => navigate('/settings/general')}
                    className="w-full p-4 text-left border rounded-xl hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-background to-accent/20 animate-slide-in"
                    style={{ animationDelay: '300ms' }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Settings</p>
                        <p className="text-xs text-muted-foreground">Configure your preferences</p>
                      </div>
                    </div>
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Classes Overview */}
            <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">🏫</span>
                    Classes Overview
                  </CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/manage-students')}
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-background to-accent/10">
                    <div className="text-2xl font-bold text-primary mb-1">{dashboardData.totalClasses}</div>
                    <p className="text-sm text-muted-foreground">Total Classes</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-background to-accent/10">
                    <div className="text-2xl font-bold text-primary mb-1">{dashboardData.totalStudents}</div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                  </div>
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-background to-accent/10">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {dashboardData.totalClasses > 0 ? Math.round(dashboardData.totalStudents / dashboardData.totalClasses) : 0}
                    </div>
                    <p className="text-sm text-muted-foreground">Avg Students/Class</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
