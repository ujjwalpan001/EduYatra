
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Award, BookOpen, Clock } from "lucide-react";

const IndividualStudentAnalysis = () => {
  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Individual Student Analysis
            </h1>
            <p className="text-muted-foreground mt-2">Detailed performance analysis for individual students</p>
          </div>
        </div>

        {/* Student Search */}
        <Card className="glass-effect border-primary/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search student by name or ID..." className="pl-10" />
              </div>
              <Button variant="outline">Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Student List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Alice Johnson", id: "ST001", avatar: "/placeholder.svg", grade: "10th", avgScore: 92.5, testsCompleted: 15, rank: 1 },
            { name: "Bob Smith", id: "ST002", avatar: "/placeholder.svg", grade: "10th", avgScore: 88.3, testsCompleted: 14, rank: 3 },
            { name: "Carol Williams", id: "ST003", avatar: "/placeholder.svg", grade: "10th", avgScore: 85.7, testsCompleted: 13, rank: 5 },
            { name: "David Brown", id: "ST004", avatar: "/placeholder.svg", grade: "10th", avgScore: 90.1, testsCompleted: 15, rank: 2 },
            { name: "Emma Davis", id: "ST005", avatar: "/placeholder.svg", grade: "10th", avgScore: 87.9, testsCompleted: 14, rank: 4 },
            { name: "Frank Wilson", id: "ST006", avatar: "/placeholder.svg", grade: "10th", avgScore: 83.2, testsCompleted: 12, rank: 7 },
          ].map((student, index) => (
            <Card key={student.id} className="glass-effect border-primary/20 animate-scale-in hover-lift cursor-pointer" style={{ animationDelay: `${index * 100}ms` }}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{student.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{student.id} • {student.grade} Grade</p>
                  </div>
                  <Badge variant={student.rank <= 3 ? 'default' : 'secondary'}>
                    Rank #{student.rank}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span>Avg: {student.avgScore}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>{student.testsCompleted} Tests</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    View Detailed Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Student Analysis */}
        <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
          <CardHeader>
            <CardTitle>Performance Overview - Alice Johnson</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">92.5%</div>
                <p className="text-sm text-muted-foreground">Overall Average</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">15</div>
                <p className="text-sm text-muted-foreground">Tests Completed</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">#1</div>
                <p className="text-sm text-muted-foreground">Class Rank</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">42m</div>
                <p className="text-sm text-muted-foreground">Avg. Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default IndividualStudentAnalysis;
