
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Eye, Pause, Play, StopCircle } from "lucide-react";

const OngoingTestExam = () => {
  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Ongoing Tests & Exams
            </h1>
            <p className="text-muted-foreground mt-2">Monitor and manage live tests and examinations</p>
          </div>
          <Button className="bg-gradient-to-r from-primary to-primary/80">
            <Eye className="h-4 w-4 mr-2" />
            Monitor All
          </Button>
        </div>

        {/* Live Tests */}
        <div className="space-y-6">
          <Card className="glass-effect border-green-500/30 bg-green-50/20 animate-fade-in hover-lift">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    Mathematics Final Exam
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Started 45 minutes ago</p>
                </div>
                <Badge className="bg-green-500 text-white">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">32/45</div>
                  <p className="text-sm text-muted-foreground">Students Active</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">75 min</div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">25/50</div>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">50%</span>
                </div>
                <Progress value={50} className="h-3" />
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-1" />
                  Pause Test
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Monitor
                </Button>
                <Button variant="destructive" size="sm">
                  <StopCircle className="h-4 w-4 mr-1" />
                  End Test
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect border-yellow-500/30 bg-yellow-50/20 animate-fade-in hover-lift">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    Physics Quiz - Chapter 7
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Started 20 minutes ago</p>
                </div>
                <Badge className="bg-yellow-500 text-white">Live</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">28/30</div>
                  <p className="text-sm text-muted-foreground">Students Active</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">10 min</div>
                  <p className="text-sm text-muted-foreground">Remaining</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">18/20</div>
                  <p className="text-sm text-muted-foreground">Avg Progress</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">5</div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">90%</span>
                </div>
                <Progress value={90} className="h-3" />
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Monitor
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="h-4 w-4 mr-1" />
                  Extend Time
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Tests */}
        <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
          <CardHeader>
            <CardTitle>Scheduled Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { test: "Chemistry Lab Test", time: "2:00 PM", participants: 35, duration: "90 min" },
                { test: "Biology Assignment", time: "4:30 PM", participants: 40, duration: "60 min" },
                { test: "Mathematics Practice", time: "Tomorrow 10:00 AM", participants: 45, duration: "120 min" },
              ].map((test, index) => (
                <div key={test.test} className="flex justify-between items-center p-4 border rounded-lg hover:bg-accent/20 transition-colors animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div>
                    <p className="font-medium">{test.test}</p>
                    <p className="text-sm text-muted-foreground">{test.time} • {test.duration}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {test.participants}
                    </div>
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OngoingTestExam;
