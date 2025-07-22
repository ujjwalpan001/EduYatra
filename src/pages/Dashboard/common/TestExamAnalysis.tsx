
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, Clock, Download } from "lucide-react";

const TestExamAnalysis = () => {
  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Test/Exam Analysis
            </h1>
            <p className="text-muted-foreground mt-2">Detailed analysis of test and exam performance</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary/80">
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Total Tests", value: "45", icon: BarChart3, change: "+8%" },
            { title: "Average Score", value: "78.5%", icon: TrendingUp, change: "+5.2%" },
            { title: "Students Participated", value: "342", icon: Users, change: "+12%" },
            { title: "Avg. Completion Time", value: "42 min", icon: Clock, change: "-3 min" },
          ].map((stat, index) => (
            <Card key={stat.title} className="glass-effect border-primary/20 animate-scale-in hover-lift" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 font-medium">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Tests Analysis */}
        <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
          <CardHeader>
            <CardTitle>Recent Test Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { test: "Mathematics Mid-term", date: "Dec 5, 2024", participants: 45, avgScore: 82.5, status: "Completed" },
                { test: "Physics Chapter 5 Quiz", date: "Dec 3, 2024", participants: 38, avgScore: 76.8, status: "Completed" },
                { test: "Chemistry Lab Test", date: "Dec 1, 2024", participants: 42, avgScore: 88.2, status: "Completed" },
                { test: "Biology Assignment", date: "Nov 28, 2024", participants: 40, avgScore: 79.3, status: "Graded" },
              ].map((test, index) => (
                <div key={test.test} className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent/20 transition-colors animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{test.test}</p>
                      <p className="text-sm text-muted-foreground">{test.date} • {test.participants} participants</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-primary">{test.avgScore}%</p>
                      <p className="text-xs text-muted-foreground">Average Score</p>
                    </div>
                    <Badge variant={test.status === 'Completed' ? 'default' : 'secondary'}>
                      {test.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Charts */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-primary/30 rounded-xl bg-gradient-to-br from-accent/20 to-primary/5">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <p className="text-muted-foreground">Score Distribution Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-primary/30 rounded-xl bg-gradient-to-br from-accent/20 to-primary/5">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <p className="text-muted-foreground">Performance Trends Chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TestExamAnalysis;
