
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNavigation } from "@/components/TopNavigation";
import { DashboardStats } from "@/components/DashboardStats";
import { RecentActivity } from "@/components/RecentActivity";
import { UpcomingTests } from "@/components/UpcomingTests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
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
                  Insights
                </h1>
                <p className="text-muted-foreground mt-2">Welcome back! Here's what's happening on your learning journey.</p>
              </div>
              <div className="text-sm text-muted-foreground bg-card px-4 py-2 rounded-lg border glass-effect animate-slide-in">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            {/* Stats Cards */}
            <DashboardStats />

            {/* Main Content Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <RecentActivity />
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
                  {[
                    { icon: "➕", title: "Create New Test", desc: "Set up a new exam or quiz", delay: 0 },
                    { icon: "📊", title: "View Analytics", desc: "Check performance metrics", delay: 100 },
                    { icon: "👥", title: "Manage Students", desc: "Add or edit student profiles", delay: 200 }
                  ].map((action, index) => (
                    <button 
                      key={action.title}
                      className="w-full p-4 text-left border rounded-xl hover:border-primary/40 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-r from-background to-accent/20 animate-slide-in"
                      style={{ animationDelay: `${action.delay}ms` }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center">
                          <span className="text-lg">{action.icon}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Tests */}
            <UpcomingTests />

            {/* Performance Overview */}
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">📈</span>
                    Class Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-48 flex items-center justify-center border-2 border-dashed border-primary/30 rounded-xl bg-gradient-to-br from-accent/20 to-primary/5">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📊</div>
                      <p className="text-muted-foreground">Chart visualization would go here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    Test Completion Rates
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {[
                      { subject: "Mathematics", rate: 85, color: "bg-blue-500" },
                      { subject: "Physics", rate: 78, color: "bg-green-500" },
                      { subject: "Chemistry", rate: 92, color: "bg-purple-500" }
                    ].map((item, index) => (
                      <div key={item.subject} className="animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{item.subject}</span>
                          <span className="text-sm text-muted-foreground font-semibold">{item.rate}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-3 rounded-full ${item.color} transition-all duration-1000 ease-out`} 
                            style={{ 
                              width: `${item.rate}%`,
                              animationDelay: `${500 + index * 200}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
