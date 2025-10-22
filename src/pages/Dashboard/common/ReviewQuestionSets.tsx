import { useState, useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BookOpen, Search, Edit, Trash2, Eye, Filter, Lock, Globe, Users, Save, X } from "lucide-react";
import { toast } from 'sonner';
import axios from "axios";
import { KatexRenderer } from "@/lib/katex-rendering";
import 'katex/dist/katex.min.css';

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
  latex_code: string;
  katex_code: string;
  difficulty_rating: number;
  subject: string;
  question_type: string;
  correct_option_latex?: string;
  correct_option_katex?: string;
  incorrect_option_latex?: string[];
  incorrect_option_katex?: string[];
  topic?: string;
  Sub_topic?: string;
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

interface UpdateQuestionResponse {
  success: boolean;
  question?: Question;
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
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("❌ Please log in to view question banks");
          return;
        }

        const res = await axios.get<QuestionBankResponse>('https://eduyatrabackend.onrender.com/api/question-banks/all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.data) {
          const enrichedData = await Promise.all(
            res.data.data.map(async (bank) => {
              try {
                const questionsRes = await axios.get<QuestionsResponse>(
                  `https://eduyatrabackend.onrender.com/api/question-banks/questions?questionBankId=${bank._id}`,
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
      } catch (error: unknown) {
        console.error('Error fetching question banks:', error);
        const axiosError = error as { response?: { data?: { error?: string } } };
        toast.error(axiosError.response?.data?.error || "⚠️ Error fetching question banks");
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
        'https://eduyatrabackend.onrender.com/api/question-banks/create',
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
    } catch (error: unknown) {
      console.error("Error creating question bank:", error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      toast.error(axiosError.response?.data?.error || "⚠️ Failed to create question bank");
    }
  };

  const handlePreview = async (bank: QuestionBank) => {
    setSelectedBank(bank);
    setIsPreviewOpen(true);
    setLoadingQuestions(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("❌ Please log in to view questions");
        return;
      }

      console.log('🔍 Fetching questions for bank:', bank._id);
      const response = await axios.get<QuestionsResponse>(
        `https://eduyatrabackend.onrender.com/api/question-banks/questions?questionBankId=${bank._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('📥 Questions response:', response.data);

      if (response.data.success && response.data.questions) {
        console.log('✅ Setting preview questions:', response.data.questions);
        console.log('📊 Number of questions:', response.data.questions.length);
        
        // Log first question details for debugging
        if (response.data.questions.length > 0) {
          const firstQ = response.data.questions[0];
          console.log('🔍 First question details:', {
            id: firstQ._id,
            hasKatexCode: !!firstQ.katex_code,
            hasLatexCode: !!firstQ.latex_code,
            katexCodeLength: firstQ.katex_code?.length || 0,
            latexCodeLength: firstQ.latex_code?.length || 0,
            katexCodePreview: firstQ.katex_code?.substring(0, 100),
            latexCodePreview: firstQ.latex_code?.substring(0, 50),
            subject: firstQ.subject,
            questionType: firstQ.question_type,
            correctOption: !!firstQ.correct_option_katex,
            incorrectOptions: firstQ.incorrect_option_katex?.length || 0
          });
        }
        
        setPreviewQuestions(response.data.questions);
        console.log(`✅ Loaded ${response.data.questions.length} questions`);
        
        if (response.data.questions.length === 0) {
          toast.info("ℹ️ This question bank has no questions yet");
        }
      } else {
        setPreviewQuestions([]);
        toast.warning("⚠️ No questions found in this question bank");
      }
    } catch (error: unknown) {
      console.error('❌ Error fetching questions:', error);
      toast.error("⚠️ Failed to load questions");
      setPreviewQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestionId(question._id);
    setEditedQuestion({ 
      ...question, 
      incorrect_option_katex: question.incorrect_option_katex ? [...question.incorrect_option_katex] : [] 
    });
  };

  const handleSaveQuestion = async (questionId: string) => {
    if (!editedQuestion) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("❌ Please log in to save changes");
        return;
      }

      console.log('💾 Saving question:', questionId, editedQuestion);

      // Update the question via API
      const response = await axios.put<UpdateQuestionResponse>(
        `https://eduyatrabackend.onrender.com/api/questions/${questionId}`,
        editedQuestion,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update local state
        setPreviewQuestions((prev) =>
          prev.map((q) =>
            q._id === questionId ? { ...editedQuestion } : q
          )
        );
        setEditingQuestionId(null);
        setEditedQuestion(null);
        toast.success("✅ Question updated successfully!");
      } else {
        toast.error("❌ Failed to update question");
      }
    } catch (error: unknown) {
      console.error('❌ Error saving question:', error);
      toast.error("⚠️ Failed to save question changes");
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestionId(null);
    setEditedQuestion(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    if (!editedQuestion) return;
    const newOptions = [...(editedQuestion.incorrect_option_katex || [])];
    newOptions[index] = value;
    setEditedQuestion({ ...editedQuestion, incorrect_option_katex: newOptions });
  };

  // Filter question banks based on search query
  const filteredBanks = questionBanks.filter(
    (bank) =>
      bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.course_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter questions based on question search query
  const filteredQuestions = previewQuestions.filter(
    (question) =>
      (question.katex_code && question.katex_code.toLowerCase().includes(questionSearchQuery.toLowerCase())) ||
      (question.subject && question.subject.toLowerCase().includes(questionSearchQuery.toLowerCase())) ||
      (question.topic && question.topic.toLowerCase().includes(questionSearchQuery.toLowerCase()))
  );
  
  // Log filtered questions
  console.log('🔍 Preview Dialog - filteredQuestions:', filteredQuestions.length, 'questions');
  if (filteredQuestions.length > 0) {
    console.log('📊 First filtered question:', {
      id: filteredQuestions[0]._id,
      hasKatex: !!filteredQuestions[0].katex_code,
      hasLatex: !!filteredQuestions[0].latex_code,
      katexLength: filteredQuestions[0].katex_code?.length,
      latexLength: filteredQuestions[0].latex_code?.length
    });
  }

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
              <div className="max-h-[600px] overflow-y-auto pr-2">
                {loadingQuestions ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading questions...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredQuestions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No questions found.</p>
                        <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or add questions to this bank.</p>
                      </div>
                    ) : (
                    filteredQuestions.map((question, index) => {
                      console.log(`🎯 Mapping question ${index + 1}:`, question._id, 'has katex:', !!question.katex_code, 'has latex:', !!question.latex_code);
                      return (
                      <Card key={question._id} className="glass-effect border-primary/20 hover:border-primary/40 transition-all">
                        <CardContent className="p-4">
                          {/* Question Number Badge */}
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline" className="text-xs">
                              Question #{index + 1}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {question.question_type || 'Multiple Choice'}
                            </Badge>
                          </div>
                          
                          {editingQuestionId === question._id ? (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor={`katex-${question._id}`}>Question Text (KaTeX/LaTeX)</Label>
                                <Textarea
                                  id={`katex-${question._id}`}
                                  value={editedQuestion?.katex_code || ''}
                                  onChange={(e) =>
                                    setEditedQuestion({ ...editedQuestion!, katex_code: e.target.value })
                                  }
                                  placeholder="Enter question in KaTeX/LaTeX format"
                                  rows={4}
                                  className="font-mono text-sm"
                                />
                                {/* Live Preview */}
                                {editedQuestion?.katex_code && (
                                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">Preview:</p>
                                    <div className="text-sm">
                                      <KatexRenderer isRawLatex={true}>
                                        {editedQuestion.katex_code}
                                      </KatexRenderer>
                                    </div>
                                  </div>
                                )}
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
                                <Label htmlFor={`topic-${question._id}`}>Topic</Label>
                                <Input
                                  id={`topic-${question._id}`}
                                  value={editedQuestion?.topic || ''}
                                  onChange={(e) =>
                                    setEditedQuestion({ ...editedQuestion!, topic: e.target.value })
                                  }
                                  placeholder="Enter topic"
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
                                <Label htmlFor={`correct-${question._id}`}>Correct Answer (KaTeX/LaTeX)</Label>
                                <Textarea
                                  id={`correct-${question._id}`}
                                  value={editedQuestion?.correct_option_katex || ''}
                                  onChange={(e) =>
                                    setEditedQuestion({ ...editedQuestion!, correct_option_katex: e.target.value })
                                  }
                                  placeholder="Enter correct answer in KaTeX/LaTeX format"
                                  rows={2}
                                  className="font-mono text-sm"
                                />
                                {/* Preview */}
                                {editedQuestion?.correct_option_katex && (
                                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                                    <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">Preview:</p>
                                    <div className="text-sm">
                                      <KatexRenderer isRawLatex={true}>
                                        {editedQuestion.correct_option_katex}
                                      </KatexRenderer>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <Label>Incorrect Options (KaTeX/LaTeX)</Label>
                                {editedQuestion?.incorrect_option_katex?.map((option, idx) => (
                                  <div key={idx} className="space-y-2">
                                    <Textarea
                                      value={option}
                                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                                      placeholder={`Incorrect option ${idx + 1}`}
                                      rows={2}
                                      className="font-mono text-sm"
                                    />
                                    {/* Preview */}
                                    {option && (
                                      <div className="p-2 bg-gray-50 dark:bg-gray-900/20 rounded border border-gray-200 dark:border-gray-800">
                                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Preview:</p>
                                        <div className="text-sm">
                                          <KatexRenderer isRawLatex={true}>
                                            {option}
                                          </KatexRenderer>
                                        </div>
                                      </div>
                                    )}
                                  </div>
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
                            <div className="space-y-3">
                              {/* Question Text - Make it prominent */}
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">QUESTION:</p>
                                    <div className="text-base font-medium text-gray-900 dark:text-gray-100">
                                      {/* katex_code contains pre-rendered HTML, render it directly */}
                                      {question.katex_code ? (
                                        <>
                                          {console.log('🎨 Rendering katex_code HTML for question:', question._id, 'Length:', question.katex_code.length, 'Preview:', question.katex_code.substring(0, 100))}
                                          <div dangerouslySetInnerHTML={{ __html: question.katex_code }} />
                                        </>
                                      ) : question.latex_code ? (
                                        <>
                                          {console.log('🎨 Rendering latex_code through KatexRenderer for question:', question._id, 'Content:', question.latex_code)}
                                          <KatexRenderer isRawLatex={true}>
                                            {question.latex_code}
                                          </KatexRenderer>
                                        </>
                                      ) : (
                                        <>
                                          {console.log('❌ No question content for:', question._id)}
                                          <span className="italic text-gray-500">No question text available</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  {question.topic && (
                                    <p className="text-xs text-muted-foreground mt-2">📚 Topic: {question.topic}</p>
                                  )}
                                  {question.Sub_topic && (
                                    <p className="text-xs text-muted-foreground">📖 Sub-topic: {question.Sub_topic}</p>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditQuestion(question)}
                                  className="flex-shrink-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {/* Metadata */}
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                {question.subject && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">Subject:</span>
                                    <span className="font-medium">{question.subject}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <span className="text-muted-foreground">Difficulty:</span>
                                  <Badge variant={question.difficulty_rating >= 3 ? 'destructive' : question.difficulty_rating >= 2 ? 'default' : 'secondary'}>
                                    {question.difficulty_rating >= 3 ? 'Hard' : question.difficulty_rating >= 2 ? 'Medium' : 'Easy'}
                                  </Badge>
                                </div>
                                {question.question_type && (
                                  <div className="flex items-center gap-1 col-span-2">
                                    <span className="text-muted-foreground">Type:</span>
                                    <span className="font-medium">{question.question_type}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Correct Answer */}
                              {(question.correct_option_katex || question.correct_option_latex) && (
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                                  <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">✓ Correct Answer:</p>
                                  <div className="text-sm text-green-900 dark:text-green-100">
                                    {/* correct_option_katex contains pre-rendered HTML */}
                                    {question.correct_option_katex ? (
                                      <div dangerouslySetInnerHTML={{ __html: question.correct_option_katex }} />
                                    ) : question.correct_option_latex ? (
                                      <KatexRenderer isRawLatex={true}>
                                        {question.correct_option_latex}
                                      </KatexRenderer>
                                    ) : null}
                                  </div>
                                </div>
                              )}
                              
                              {/* Incorrect Options */}
                              {question.incorrect_option_katex && question.incorrect_option_katex.length > 0 && (
                                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                                  <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-2">✗ Incorrect Options:</p>
                                  <ul className="space-y-2">
                                    {question.incorrect_option_katex.map((option, idx) => (
                                      <li key={idx} className="text-sm text-red-900 dark:text-red-100 flex items-start gap-2">
                                        <span className="text-red-500 mt-1">•</span>
                                        <div className="flex-1">
                                          {/* Pre-rendered HTML from database */}
                                          <div dangerouslySetInnerHTML={{ __html: option }} />
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                    })
                  )}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ReviewQuestionSets;