import { useState, useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BookOpen, Search, Edit, Trash2, Eye, Filter, Lock, Globe, Users, Save, X } from "lucide-react";
import { toast } from 'sonner';
import axios from "axios";

// Utility to format dates as "X days ago"
const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  return `${diffInDays} days ago`;
};

// Type definitions for API responses
interface QuestionBank {
  _id: string;
  name: string;
  course_code: string;
  questions: number;
  difficulty: string;
  visibility: 'public' | 'private' | 'shared';
  created_at: string;
  updated_at: string;
}

interface Question {
  _id: string;
  text: string;
  difficulty_rating: number;
  subject: string;
  options?: string[];
}

interface QuestionBankResponse {
  success: boolean;
  data?: QuestionBank[];
  error?: string;
}

interface CreateQuestionBankResponse {
  success: boolean;
  questionBank: QuestionBank;
  error?: string;
}

interface QuestionsResponse {
  success: boolean;
  questions: Question[];
  error?: string;
}

const ReviewQuestionSets = () => {
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<QuestionBank | null>(null);
  const [newBank, setNewBank] = useState({ name: "", course_code: "", visibility: "private" });
  const [searchQuery, setSearchQuery] = useState("");
  const [questionSearchQuery, setQuestionSearchQuery] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);

  // Mock questions for preview (example questions)
  const [mockQuestions, setMockQuestions] = useState<Question[]>([
    {
      _id: "q1",
      text: "What is the primary source of energy for Earth's climate system?",
      difficulty_rating: 1,
      subject: "Environmental Science",
      options: ["Sun", "Geothermal", "Wind", "Ocean currents"],
    },
    {
      _id: "q2",
      text: "Which gas is most abundant in Earth's atmosphere?",
      difficulty_rating: 2,
      subject: "Atmospheric Science",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
    },
    {
      _id: "q3",
      text: "What is the main cause of ozone depletion?",
      difficulty_rating: 3,
      subject: "Environmental Science",
      options: ["CFCs", "CO2", "Methane", "Nitrous Oxide"],
    },
    {
      _id: "q4",
      text: "Which layer of the atmosphere contains the ozone layer?",
      difficulty_rating: 2,
      subject: "Atmospheric Science",
      options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"],
    },
  ]);

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("❌ Please log in to view question banks");
          return;
        }

        const res = await axios.get<QuestionBankResponse>('http://localhost:5000/api/question-banks/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.data) {
          const enrichedData = await Promise.all(
            res.data.data.map(async (bank) => {
              try {
                const questionsRes = await axios.get<QuestionsResponse>(
                  `http://localhost:5000/api/question-banks/questions?questionBankId=${bank._id}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                const questions = questionsRes.data.success ? questionsRes.data.questions : [];
                const totalDifficulty = questions.reduce(
                  (sum, q) => sum + (q.difficulty_rating || 1),
                  0
                );
                const avgDifficulty = questions.length > 0 ? totalDifficulty / questions.length : 1;
                const difficultyLabel =
                  avgDifficulty >= 3 ? 'Hard' : avgDifficulty >= 2 ? 'Medium' : 'Easy';

                return {
                  _id: bank._id,
                  name: bank.name,
                  course_code: bank.course_code,
                  questions: questions.length,
                  difficulty: difficultyLabel,
                  visibility: bank.visibility,
                  created_at: bank.created_at,
                  updated_at: bank.updated_at,
                };
              } catch (error) {
                console.error(`Error fetching questions for bank ${bank._id}:`, error);
                return {
                  _id: bank._id,
                  name: bank.name || 'Untitled Question Bank',
                  course_code: bank.course_code || 'Unknown',
                  questions: 0,
                  difficulty: 'Unknown',
                  visibility: bank.visibility || 'private',
                  created_at: bank.created_at,
                  updated_at: bank.updated_at || bank.created_at,
                };
              }
            })
          );

          setQuestionBanks(enrichedData);
        } else {
          toast.error(`❌ Failed to fetch question banks: ${res.data.error || 'Unknown error'}`);
        }
      } catch (error: any) {
        console.error('Error fetching question banks:', error);
        toast.error(error.response?.data?.error || "⚠️ Error fetching question banks");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionBanks();
  }, []);

  const handleCreateBank = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("❌ Please log in to create a question bank");
        return;
      }

      if (!newBank.name || !newBank.course_code) {
        toast.error("❌ Name and course code are required");
        return;
      }

      const res = await axios.post<CreateQuestionBankResponse>(
        'http://localhost:5000/api/question-banks/create',
        newBank,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const bank = res.data.questionBank;
        setQuestionBanks([
          ...questionBanks,
          {
            _id: bank._id,
            name: bank.name,
            course_code: bank.course_code,
            questions: bank.questions,
            difficulty: bank.difficulty,
            visibility: bank.visibility,
            created_at: bank.created_at,
            updated_at: bank.updated_at,
          },
        ]);
        setNewBank({ name: "", course_code: "", visibility: "private" });
        setIsCreateOpen(false);
        toast.success("✅ Question bank created successfully!");
      } else {
        toast.error(`❌ Failed to create question bank: ${res.data.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error("Error creating question bank:", error);
      toast.error(error.response?.data?.error || "⚠️ Failed to create question bank");
    }
  };

  const handlePreview = (bank: QuestionBank) => {
    setSelectedBank(bank);
    setIsPreviewOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question._id);
    setEditedQuestion({ ...question, options: question.options ? [...question.options] : [] });
  };

  const handleSaveQuestion = (questionId: string) => {
    if (!editedQuestion) return;

    setMockQuestions((prev) =>
      prev.map((q) =>
        q._id === questionId ? { ...editedQuestion } : q
      )
    );
    setEditingQuestionId(null);
    setEditedQuestion(null);
    toast.success("✅ Question updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditedQuestion(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!editedQuestion) return;
    const newOptions = [...(editedQuestion.options || [])];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, options: newOptions });
  };

  // Filter question banks based on search query
  const filteredBanks = questionBanks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.course_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter questions based on question search query
  const filteredQuestions = mockQuestions.filter(
    (question) =>
      question.text.toLowerCase().includes(questionSearchQuery.toLowerCase()) ||
      question.subject.toLowerCase().includes(questionSearchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Review Question Sets
            </h1>
            <p className="text-muted-foreground mt-2">Manage and review all question sets</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-primary/80">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create New Set
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] glass-effect border-primary/20">
                <DialogHeader>
                  <DialogTitle>Create New Question Set</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Set Name</Label>
                    <Input
                      id="name"
                      value={newBank.name}
                      onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
                      placeholder="Enter set name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course_code">Course Code</Label>
                    <Input
                      id="course_code"
                      value={newBank.course_code}
                      onChange={(e) => setNewBank({ ...newBank, course_code: e.target.value })}
                      placeholder="Enter course code (e.g., CS101)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <select
                      id="visibility"
                      value={newBank.visibility}
                      onChange={(e) => setNewBank({ ...newBank, visibility: e.target.value })}
                      className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                      <option value="shared">Shared</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateBank}>Create</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="glass-effect border-primary/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search question sets..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">Search</Button>
            </div>
          </CardContent>
        </Card>

        {/* Question Sets Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-muted-foreground">Loading question banks...</p>
          ) : filteredBanks.length === 0 ? (
            <p className="text-destructive">No question banks available.</p>
          ) : (
            filteredBanks.map((set, index) => (
              <Card
                key={set._id}
                className="glass-effect border-primary/20 animate-scale-in hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{set.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          set.difficulty === 'Hard'
                            ? 'destructive'
                            : set.difficulty === 'Medium'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {set.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {set.visibility === 'public' ? (
                          <Globe className="h-3 w-3 mr-1" />
                        ) : set.visibility === 'shared' ? (
                          <Users className="h-3 w-3 mr-1" />
                        ) : (
                          <Lock className="h-3 w-3 mr-1" />
                        )}
                        {set.visibility}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline">{set.course_code}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">{set.questions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Modified:</span>
                      <span className="font-medium">{formatRelativeTime(set.updated_at)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handlePreview(set)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="sm:max-w-[900px] glass-effect border-primary/20">
            <DialogHeader>
              <DialogTitle>{selectedBank?.name} - Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Search for Questions */}
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions..."
                    className="pl-10"
                    value={questionSearchQuery}
                    onChange={(e) => setQuestionSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline">Search</Button>
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Set
                </Button>
              </div>
              {/* Questions List */}
              <div className="max-h-[500px] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {filteredQuestions.length === 0 ? (
                    <p className="text-destructive col-span-2">No questions found.</p>
                  ) : (
                    filteredQuestions.map((question, index) => (
                      <Card key={question._id} className="glass-effect border-primary/20">
                        <CardContent className="p-4">
                          {editingQuestionId === question._id ? (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`text-${question._id}`}>Question Text</Label>
                                <Input
                                  id={`text-${question._id}`}
                                  value={editedQuestion?.text || ''}
                                  onChange={(e) =>
                                    setEditedQuestion({ ...editedQuestion!, text: e.target.value })
                                  }
                                  placeholder="Enter question text"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`subject-${question._id}`}>Subject</Label>
                                <Input
                                  id={`subject-${question._id}`}
                                  value={editedQuestion?.subject || ''}
                                  onChange={(e) =>
                                    setEditedQuestion({ ...editedQuestion!, subject: e.target.value })
                                  }
                                  placeholder="Enter subject"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`difficulty-${question._id}`}>Difficulty Rating (1-5)</Label>
                                <Input
                                  id={`difficulty-${question._id}`}
                                  type="number"
                                  min="1"
                                  max="5"
                                  value={editedQuestion?.difficulty_rating || 1}
                                  onChange={(e) =>
                                    setEditedQuestion({
                                      ...editedQuestion!,
                                      difficulty_rating: parseInt(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Options</Label>
                                {editedQuestion?.options?.map((option, idx) => (
                                  <Input
                                    key={idx}
                                    value={option}
                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                    placeholder={`Option ${idx + 1}`}
                                    className="mb-2"
                                  />
                                ))}
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveQuestion(question._id)}
                                >
                                  <Save className="h-4 w-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between items-start">
                                <p className="font-medium">{question.text}</p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditQuestion(question)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-sm text-muted-foreground">Subject: {question.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                Difficulty: {question.difficulty_rating >= 3 ? 'Hard' : question.difficulty_rating >= 2 ? 'Medium' : 'Easy'}
                              </p>
                              {question.options && (
                                <ul className="list-disc pl-5 text-sm">
                                  {question.options.map((option, idx) => (
                                    <li key={idx}>{option}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ReviewQuestionSets;