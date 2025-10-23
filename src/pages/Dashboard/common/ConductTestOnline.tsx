import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Clock, Check, X, Settings, Users, Calendar, Save, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast, Toaster } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { KatexRenderer } from '@/lib/katex-rendering';
import 'katex/dist/katex.min.css';

// Utility function for authenticated API calls with enhanced error handling
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

// Form validation schemas
const testFormSchema = z.object({
  testName: z.string().min(3, 'Test name must be at least 3 characters'),
  duration: z.coerce.number().min(5, 'Minimum 5 minutes').max(240, 'Maximum 240 minutes'),
  numberOfSets: z.coerce.number().min(1, 'At least 1 set required'),
  numberOfQuestionsPerSet: z.coerce.number().min(1, 'At least 1 question per set'),
  instructions: z.string().optional(),
});

const editExamSchema = z.object({
  testName: z.string().min(3, 'Test name must be at least 3 characters'),
  duration: z.coerce.number().min(5, 'Minimum 5 minutes').max(240, 'Maximum 240 minutes'),
  numberOfSets: z.coerce.number().min(1, 'At least 1 set required'),
  numberOfQuestionsPerSet: z.coerce.number().min(1, 'At least 1 question per set'),
  instructions: z.string().optional(),
});

type TestFormValues = z.infer<typeof testFormSchema>;
type EditExamFormValues = z.infer<typeof editExamSchema>;

interface Question {
  id: string;
  text: string;
  type: string;
  marks: number;
}

interface QuestionBank {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
}

interface Exam {
  id: string;
  title: string;
  status: 'Draft' | 'Scheduled' | 'Live' | 'Completed';
  duration: number;
  numberOfSets: number;
  numberOfQuestionsPerSet: number;
  instructions?: string;
  questionIds: string[];
}

interface SecuritySettings {
  disableTabSwitching: boolean;
  disableRightClick: boolean;
  enableScreenSharing: boolean;
  enableProctoring: boolean;
  enableWebcam: boolean;
  restrictIP: boolean;
}

interface ExamSchedule {
  startTime: string;
  endTime: string;
}

const ConductTestOnline: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [questionBanks, setQuestionBanks] = useState<QuestionBank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    disableTabSwitching: true,
    disableRightClick: true,
    enableScreenSharing: false,
    enableProctoring: false,
    enableWebcam: false,
    restrictIP: false,
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [schedule, setSchedule] = useState<ExamSchedule>({ startTime: '', endTime: '' });
  const [timeLimit, setTimeLimit] = useState('60');
  const [customTimeLimit, setCustomTimeLimit] = useState('');
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isManageExamOpen, setIsManageExamOpen] = useState(true);
  const [showQuestionSets, setShowQuestionSets] = useState(false);
  const [questionBankId, setQuestionBankId] = useState('');
  const manageExamRef = useRef<HTMLDivElement>(null);
  const previewQuestionPaperRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      testName: '',
      duration: 60,
      numberOfSets: 1,
      numberOfQuestionsPerSet: 1,
      instructions: '',
    },
  });

  const { register: registerEdit, handleSubmit: handleEditSubmit, formState: { errors: editErrors }, reset: resetEdit } = useForm<EditExamFormValues>({
    resolver: zodResolver(editExamSchema),
    defaultValues: {
      testName: '',
      duration: 60,
      numberOfSets: 1,
      numberOfQuestionsPerSet: 1,
      instructions: '',
    },
  });

  const numberOfQuestionsPerSet = watch('numberOfQuestionsPerSet');

  // Check authentication and redirect if no token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please log in to continue');
      navigate('/signin');
    }
  }, [navigate]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoadingBanks(true);
      try {
        const [banksRes, groupsRes, examsRes] = await Promise.all([
          fetchWithAuth('https://eduyatrabackend.onrender.com/api/exams/question-banks'),
          fetchWithAuth('https://eduyatrabackend.onrender.com/api/exams/groups'),
          fetchWithAuth('https://eduyatrabackend.onrender.com/api/exams/all'),
        ]);

        const [banksData, groupsData, examsData] = await Promise.all([
          banksRes.json(),
          groupsRes.json(),
          examsRes.json(),
        ]);

        console.log('Question Banks Response:', banksData);
        if (!banksRes.ok) throw new Error(banksData.error || 'Failed to fetch question banks');
        setQuestionBanks(
          (banksData.success ? banksData.questionBanks : banksData.data?.questionBanks || banksData.question_banks || banksData || []).map(bank => ({
            id: bank._id || bank.id || '',
            name: bank.name || `Unnamed Bank (${bank._id || bank.id || 'unknown'})`
          }))
        );

        console.log('Groups Response:', groupsData);
        if (!groupsRes.ok) throw new Error(groupsData.error || 'Failed to fetch groups');
        const newGroups = (groupsData.success ? groupsData.classes : groupsData.data?.classes || groupsData || []).map(group => ({
          id: group._id || group.id || '',
          name: group.class_name || `Unnamed Group (${group._id || group.id || 'unknown'})`
        }));
        setGroups(newGroups);
        console.log('Parsed Groups:', newGroups);

        if (!examsRes.ok) throw new Error(examsData.error || 'Failed to fetch exams');
        setExams((examsData.success ? examsData.exams : examsData.data?.exams || []).map((e: any) => ({
          id: e._id,
          title: e.title || 'Untitled Exam',
          status: e.status || 'Draft',
          duration: e.duration_minutes || 60,
          numberOfSets: e.number_of_sets || 1,
          numberOfQuestionsPerSet: e.number_of_questions_per_set || 1,
          instructions: e.description || '',
          questionIds: e.question_ids || [],
        })));
      } catch (error) {
        console.error('Fetch Data Error:', error);
        toast.error(`Failed to load data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setQuestionBanks([]);
        setGroups([]);
        setExams([]);
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchData();
  }, []);

  // Scroll to exam when examId is present in URL
  useEffect(() => {
    const examId = searchParams.get('examId');
    if (examId && exams.length > 0) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        const examElement = examRefs.current[examId];
        if (examElement) {
          examElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          // Add highlight effect
          examElement.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
          // Remove highlight after 3 seconds
          setTimeout(() => {
            examElement.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
          }, 3000);
        }
      }, 300);
    }
  }, [searchParams, exams]);

  // Fetch questions when question bank changes
  useEffect(() => {
    if (!questionBankId) {
      setQuestions([]);
      return;
    }
    const fetchQuestions = async () => {
      setLoadingQuestions(true);
      try {
        const res = await fetchWithAuth(`https://eduyatrabackend.onrender.com/api/exams/questions?questionBankId=${questionBankId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch questions');
        setQuestions(data.questions?.map((q: any) => ({
          id: q._id,
          text: q.latex_code || q.text || 'Untitled Question',
          type: q.question_type || 'MCQ',
          marks: q.difficulty_rating || 1,
        })) || []);
      } catch (error) {
        toast.error(`Failed to fetch questions: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };
    fetchQuestions();
  }, [questionBankId]);

  // Sync edit form with selected exam
  useEffect(() => {
    const exam = exams.find(e => e.id === selectedExamId);
    if (exam) {
      resetEdit({
        testName: exam.title,
        duration: exam.duration,
        numberOfSets: exam.numberOfSets,
        numberOfQuestionsPerSet: exam.numberOfQuestionsPerSet,
        instructions: exam.instructions || '',
      });
      setTimeLimit(exam.duration.toString());
      setCustomTimeLimit('');
    }
  }, [selectedExamId, exams, resetEdit]);

  const handleAddToTest = (question: Question) => {
    setSelectedQuestions(prev => prev.some(q => q.id === question.id) ? prev : [...prev, question]);
  };

  const handleRemoveFromTest = (questionId: string) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const handleSecuritySettingChange = (setting: keyof SecuritySettings) => {
    setSecuritySettings(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handleSaveSecuritySettings = async () => {
    if (!selectedExamId) {
      toast.error('Please select an exam');
      return;
    }
    try {
      const res = await fetchWithAuth(`https://eduyatrabackend.onrender.com/api/exams/${selectedExamId}/security`, {
        method: 'PATCH',
        body: JSON.stringify(securitySettings),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save security settings');
      }
      toast.success('Security settings saved');
    } catch (error) {
      toast.error(`Failed to save security settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAssignGroup = async (examId: string, groupId: string) => {
    if (!examId || !groupId) {
      toast.error('Please select an exam and a group');
      console.error('handleAssignGroup: Missing examId or groupId', { examId, groupId });
      return;
    }
    try {
      console.log(`Assigning exam ${examId} to group ${groupId}`);
      const res = await fetchWithAuth(`https://eduyatrabackend.onrender.com/api/exams/${examId}/assign-group`, {
        method: 'POST',
        body: JSON.stringify({ groupId }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error('Assign group failed:', data);
        throw new Error(data.error || 'Failed to assign exam');
      }
      toast.success('Exam assigned to class successfully');
      console.log('Assign group success:', data);
      setExams(exams.map(exam =>
        exam.id === examId ? { ...exam, status: 'Scheduled' } : exam
      ));
    } catch (error) {
      toast.error(`Failed to assign exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('handleAssignGroup error:', error);
    }
  };

  const handleSaveTimeLimit = async () => {
    if (!selectedExamId) {
      toast.error('Please select an exam');
      return;
    }
    const duration = timeLimit === 'custom' ? parseInt(customTimeLimit) : parseInt(timeLimit);
    if (isNaN(duration) || duration < 5 || duration > 240) {
      toast.error('Time limit must be between 5 and 240 minutes');
      return;
    }
    try {
      const res = await fetchWithAuth(`https://eduyatrabackend.onrender.com/api/exams/${selectedExamId}`, {
        method: 'PATCH',
        body: JSON.stringify({ duration_minutes: duration }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update time limit');
      }
      setExams(exams.map(exam => 
        exam.id === selectedExamId ? { ...exam, duration } : exam
      ));
      toast.success('Time limit updated');
    } catch (error) {
      toast.error(`Failed to update time limit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEditExam = async (data: EditExamFormValues) => {
    if (!selectedExamId) {
      toast.error('Please select an exam to edit');
      return;
    }
    try {
      const res = await fetchWithAuth(`https://eduyatrabackend.onrender.com/api/exams/${selectedExamId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: data.testName,
          duration_minutes: data.duration,
          number_of_sets: data.numberOfSets,
          number_of_questions_per_set: data.numberOfQuestionsPerSet,
          description: data.instructions,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update exam');
      }
      setExams(exams.map(exam => 
        exam.id === selectedExamId ? { 
          ...exam, 
          title: data.testName,
          duration: data.duration,
          numberOfSets: data.numberOfSets,
          numberOfQuestionsPerSet: data.numberOfQuestionsPerSet,
          instructions: data.instructions,
        } : exam
      ));
      toast.success('Exam updated successfully');
      setIsEditFormOpen(false);
    } catch (error) {
      toast.error(`Failed to update exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleScheduleExam = async () => {
    if (!selectedExamId || !schedule.startTime || !schedule.endTime) {
      toast.error('Please select an exam and provide valid schedule times');
      return;
    }
    try {
      const res = await fetchWithAuth(`https://eduyatrabackend.onrender.com/api/exams/${selectedExamId}/schedule`, {
        method: 'PATCH',
        body: JSON.stringify(schedule),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to schedule exam');
      }
      setExams(exams.map(exam => 
        exam.id === selectedExamId ? { ...exam, status: 'Scheduled' } : exam
      ));
      toast.success('Exam scheduled');
    } catch (error) {
      toast.error(`Failed to schedule exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handlePreviewQuestionPaper = () => {
    if (!selectedExamId) {
      toast.error('Please select an exam to preview');
      return;
    }
    setShowQuestionSets(true); // Automatically show question sets when previewing
    toast.success('Question paper preview opened (simulated)');
    console.log('Preview question paper:', { examId: selectedExamId });
  };

  const toggleQuestionSets = () => setShowQuestionSets(!showQuestionSets);
  const toggleManageExam = () => setIsManageExamOpen(!isManageExamOpen);

  const handleSelectExam = (examId: string, action: 'view' | 'manage') => {
    setSelectedExamId(examId);
    setIsManageExamOpen(true);
    if (action === 'view' && previewQuestionPaperRef.current) {
      setShowQuestionSets(true); // Show question sets for view action
      previewQuestionPaperRef.current.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'manage' && manageExamRef.current) {
      manageExamRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: TestFormValues) => {
    if (!selectedGroup) {
      toast.error('Please select a group');
      return;
    }
    if (!questionBankId) {
      toast.error('Please select a question bank');
      return;
    }
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question');
      return;
    }
    if (selectedQuestions.length < data.numberOfQuestionsPerSet) {
      toast.error(`Please select at least ${data.numberOfQuestionsPerSet} question${data.numberOfQuestionsPerSet > 1 ? 's' : ''}`);
      return;
    }

    const examData = {
      title: data.testName,
      description: data.instructions,
      class_id: selectedGroup,
      question_bank_id: questionBankId,
      question_ids: selectedQuestions.map(q => q.id),
      number_of_sets: data.numberOfSets,
      number_of_questions_per_set: data.numberOfQuestionsPerSet,
      duration_minutes: data.duration,
      start_time: new Date(),
      end_time: new Date(Date.now() + data.duration * 60000),
      is_published: false,
      allow_review: true,
      shuffle_questions: true,
      shuffle_options: false,
      security_settings: securitySettings,
    };

    try {
      const res = await fetchWithAuth('https://eduyatrabackend.onrender.com/api/exams/create', {
        method: 'POST',
        body: JSON.stringify(examData),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to create exam');
      setExams([...exams, {
        id: result.exam._id,
        title: data.testName,
        status: 'Draft',
        duration: data.duration,
        numberOfSets: data.numberOfSets,
        numberOfQuestionsPerSet: data.numberOfQuestionsPerSet,
        instructions: data.instructions,
        questionIds: selectedQuestions.map(q => q.id),
      }]);
      toast.success('Exam created successfully');
      reset();
      setSelectedQuestions([]);
      setSelectedGroup('');
      setQuestionBankId('');
    } catch (error) {
      toast.error(`Failed to create exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Layout>
      <Toaster position="top-center" richColors />
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Online Test
            </h1>
            <p className="text-muted-foreground mt-2">Create and manage online examinations</p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="glass-effect border-primary/20 animate-scale-in hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Create New Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testName">Test Name *</Label>
                  <Input
                    id="testName"
                    placeholder="E.g., Mid-term Mathematics"
                    className={cn(errors.testName && 'border-destructive')}
                    {...register('testName')}
                  />
                  {errors.testName && <p className="text-sm text-destructive">{errors.testName.message}</p>}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Assign to Group</h3>
                  <div className="flex items-center gap-4">
                    <Select value={selectedGroup} onValueChange={(value) => { console.log('Selected Group ID:', value); setSelectedGroup(value); }}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="duration"
                        type="number"
                        placeholder="60"
                        className={cn('pl-10', errors.duration && 'border-destructive')}
                        {...register('duration')}
                      />
                    </div>
                    {errors.duration && <p className="text-sm text-destructive">{errors.duration.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalQuestions">Total Questions</Label>
                    <Input
                      id="totalQuestions"
                      type="number"
                      value={selectedQuestions.length}
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">{selectedQuestions.length} questions selected</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numberOfSets">Number of Sets *</Label>
                    <Input
                      id="numberOfSets"
                      type="number"
                      placeholder="1"
                      className={cn(errors.numberOfSets && 'border-destructive')}
                      {...register('numberOfSets')}
                    />
                    {errors.numberOfSets && <p className="text-sm text-destructive">{errors.numberOfSets.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberOfQuestionsPerSet">Questions per Set *</Label>
                    <Input
                      id="numberOfQuestionsPerSet"
                      type="number"
                      placeholder="1"
                      className={cn(errors.numberOfQuestionsPerSet && 'border-destructive')}
                      {...register('numberOfQuestionsPerSet')}
                    />
                    {errors.numberOfQuestionsPerSet && <p className="text-sm text-destructive">{errors.numberOfQuestionsPerSet.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    rows={3}
                    placeholder="Enter test instructions..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground prioritize-visible:outline-none prioritize-visible:ring-2 prioritize-visible:ring-ring prioritize-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...register('instructions')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="questionBank">Question Bank *</Label>
                  <Select value={questionBankId} onValueChange={setQuestionBankId} disabled={loadingBanks}>
                    <SelectTrigger id="questionBank">
                      <SelectValue placeholder={loadingBanks ? 'Loading...' : 'Select a question bank'} />
                    </SelectTrigger>
                    <SelectContent>
                      {questionBanks.length ? (
                        questionBanks.map(bank => {
                          console.log('Rendering Question Bank:', bank);
                          return bank.id && (
                            <SelectItem key={bank.id} value={bank.id}>
                              {bank.name || `Unnamed Bank (${bank.id})`}
                            </SelectItem>
                          );
                        }).filter(Boolean)
                      ) : (
                        <div className="text-sm text-muted-foreground p-2">No question banks available</div>
                      )}
                    </SelectContent>
                  </Select>
                  {!questionBankId && <p className="text-sm text-destructive">Please select a question bank</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-primary/80"
                  disabled={selectedQuestions.length === 0}
                >
                  Create Test
                </Button>
              </form>
            </CardContent>
          </Card>

          {questionBankId && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  Questions in Selected Bank ({questions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingQuestions ? (
                  <p className="text-sm text-muted-foreground">Loading questions...</p>
                ) : !questions.length ? (
                  <p className="text-sm text-destructive">No questions available</p>
                ) : (
                  <div className="max-h-[500px] overflow-y-auto space-y-2 pr-2">
                    {questions.map(q => (
                      <div key={q.id} className="text-sm p-3 bg-muted/50 rounded flex justify-between items-center">
                        <div>
                          <div className="font-medium">
                            <KatexRenderer>{q.text}</KatexRenderer>
                          </div>
                          <div className="text-muted-foreground">{q.type} • {q.marks} marks</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => selectedQuestions.some(sq => sq.id === q.id) ? handleRemoveFromTest(q.id) : handleAddToTest(q)}
                        >
                          {selectedQuestions.some(sq => sq.id === q.id) ? (
                            <>
                              <X className="h-4 w-4 mr-1" /> Remove
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" /> Add to Test
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div ref={manageExamRef}>
          {isManageExamOpen && (
            <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Manage Exam
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={toggleManageExam}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="examSelect">Select Exam *</Label>
                  <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                    <SelectTrigger id="examSelect">
                      <SelectValue placeholder={exams.length ? 'Select an exam' : 'No exams available'} />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.length ? (
                        exams.map(exam => (
                          exam.id && (
                            <SelectItem key={exam.id} value={exam.id}>
                              {exam.title} ({exam.status})
                            </SelectItem>
                          )
                        )).filter(Boolean)
                      ) : (
                        <div className="text-sm text-muted-foreground p-2">No exams available</div>
                      )}
                    </SelectContent>
                  </Select>
                  {!exams.length && <p className="text-sm text-destructive">No exams available</p>}
                </div>

                {selectedExamId && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Assign to Group</h3>
                      <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                        <SelectTrigger>
                          <SelectValue placeholder={groups.length ? 'Select a group' : 'No groups available'} />
                        </SelectTrigger>
                        <SelectContent>
                          {groups.length ? (
                            groups.map(group => (
                              group.id && (
                                <SelectItem key={group.id} value={group.id}>
                                  {group.name || `Unnamed Group (${group.id})`}
                                </SelectItem>
                              )
                            )).filter(Boolean)
                          ) : (
                            <div className="text-sm text-muted-foreground p-2">No groups available</div>
                          )}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => handleAssignGroup(selectedExamId, selectedGroup)}
                        disabled={!selectedExamId || !selectedGroup}
                        className="bg-green-600 hover:bg-green-700 w-32"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Security Settings</h3>
                        <div className="space-y-3">
                          {[
                            { id: 'disableTabSwitching', label: 'Disable Tab Switching' },
                            { id: 'disableRightClick', label: 'Disable Right Click' },
                            { id: 'enableScreenSharing', label: 'Enable Screen Sharing' },
                            { id: 'enableProctoring', label: 'Enable AI Proctoring' },
                            { id: 'enableWebcam', label: 'Require Webcam Monitoring' },
                            { id: 'restrictIP', label: 'Restrict IP Addresses' },
                          ].map(setting => (
                            <div key={setting.id} className="flex items-center justify-between">
                              <Label htmlFor={setting.id}>{setting.label}</Label>
                              <Switch
                                id={setting.id}
                                checked={securitySettings[setting.id as keyof SecuritySettings]}
                                onCheckedChange={() => handleSecuritySettingChange(setting.id as keyof SecuritySettings)}
                              />
                            </div>
                          ))}
                        </div>
                        <Button onClick={handleSaveSecuritySettings} className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Save Security Settings
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Time Limit</h3>
                        <div className="space-y-2">
                          <Label htmlFor="timeLimit">Select Time Limit (minutes)</Label>
                          <Select value={timeLimit} onValueChange={value => {
                            setTimeLimit(value);
                            if (value !== 'custom') setCustomTimeLimit('');
                          }}>
                            <SelectTrigger id="timeLimit">
                              <SelectValue placeholder="Select time limit" />
                            </SelectTrigger>
                            <SelectContent>
                              {['30', '60', '90', '120', 'custom'].map(value => (
                                <SelectItem key={value} value={value}>
                                  {value === 'custom' ? 'Custom' : `${value} minutes`}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {timeLimit === 'custom' && (
                          <div className="space-y-2">
                            <Label htmlFor="customTimeLimit">Custom Time Limit (minutes)</Label>
                            <Input
                              id="customTimeLimit"
                              type="number"
                              value={customTimeLimit}
                              onChange={e => setCustomTimeLimit(e.target.value)}
                              placeholder="Enter custom time limit"
                              min={5}
                              max={240}
                            />
                          </div>
                        )}
                        <Button onClick={handleSaveTimeLimit} className="w-full">
                          <Clock className="h-4 w-4 mr-2" />
                          Save Time Limit
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Edit Exam</h3>
                      <Button
                        onClick={() => setIsEditFormOpen(!isEditFormOpen)}
                        className="w-full"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {isEditFormOpen ? 'Close Edit Form' : 'Edit Exam'}
                      </Button>
                      {isEditFormOpen && (
                        <form onSubmit={handleEditSubmit(handleEditExam)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="editTestName">Test Name *</Label>
                            <Input
                              id="editTestName"
                              placeholder="E.g., Mid-term Mathematics"
                              className={cn(editErrors.testName && 'border-destructive')}
                              {...registerEdit('testName')}
                            />
                            {editErrors.testName && <p className="text-sm text-destructive">{editErrors.testName.message}</p>}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="editDuration">Duration (minutes) *</Label>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                  id="editDuration"
                                  type="number"
                                  placeholder="60"
                                  className={cn('pl-10', editErrors.duration && 'border-destructive')}
                                  {...registerEdit('duration')}
                                />
                              </div>
                              {editErrors.duration && <p className="text-sm text-destructive">{editErrors.duration.message}</p>}
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="editNumberOfSets">Number of Sets *</Label>
                              <Input
                                id="editNumberOfSets"
                                type="number"
                                placeholder="1"
                                className={cn(editErrors.numberOfSets && 'border-destructive')}
                                {...registerEdit('numberOfSets')}
                              />
                              {editErrors.numberOfSets && <p className="text-sm text-destructive">{editErrors.numberOfSets.message}</p>}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="editNumberOfQuestionsPerSet">Questions per Set *</Label>
                            <Input
                              id="editNumberOfQuestionsPerSet"
                              type="number"
                              placeholder="1"
                              className={cn(editErrors.numberOfQuestionsPerSet && 'border-destructive')}
                              {...registerEdit('numberOfQuestionsPerSet')}
                            />
                            {editErrors.numberOfQuestionsPerSet && <p className="text-sm text-destructive">{editErrors.numberOfQuestionsPerSet.message}</p>}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="editInstructions">Instructions (Optional)</Label>
                            <Textarea
                              id="editInstructions"
                              rows={3}
                              placeholder="Enter test instructions..."
                              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground prioritize-visible:outline-none prioritize-visible:ring-2 prioritize-visible:ring-ring prioritize-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...registerEdit('instructions')}
                            />
                          </div>

                          <Button type="submit" className="w-full">
                            <Save className="h-4 w-4 mr-2" />
                            Save Exam Changes
                          </Button>
                        </form>
                      )}
                    </div>

                    <div ref={previewQuestionPaperRef} className="space-y-4">
                      <h3 className="text-lg font-semibold">Preview Question Paper</h3>
                      <Button onClick={toggleQuestionSets} className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        {showQuestionSets ? 'Hide Question Sets' : 'Show Question Sets'}
                      </Button>
                      {showQuestionSets && (
                        exams.find(exam => exam.id === selectedExamId)?.questionIds.length ? (
                          Array.from({ length: exams.find(exam => exam.id === selectedExamId)?.numberOfSets || 1 }, (_, setIndex) => (
                            <div key={setIndex} className="p-4 bg-muted/50 rounded">
                              <h4 className="font-medium">Set {setIndex + 1}</h4>
                              <ul className="mt-2 space-y-2">
                                {exams.find(exam => exam.id === selectedExamId)?.questionIds
                                  .slice(0, exams.find(exam => exam.id === selectedExamId)?.numberOfQuestionsPerSet)
                                  .map((questionId, qIndex) => (
                                    <li key={questionId} className="text-sm">
                                      Question {qIndex + 1}: <KatexRenderer>{questions.find(q => q.id === questionId)?.text || `Question ${questionId}`}</KatexRenderer>
                                      <span className="text-muted-foreground"> ({questions.find(q => q.id === questionId)?.type || 'MCQ'}, {questions.find(q => q.id === questionId)?.marks || 1} marks)</span>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-destructive">No questions assigned to this exam</p>
                        )
                      )}
                      <Button onClick={handlePreviewQuestionPaper} className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Full Question Paper
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {!isManageExamOpen && (
          <Button
            onClick={toggleManageExam}
            className="w-full bg-gradient-to-r from-primary to-primary/80"
          >
            <Settings className="h-4 w-4 mr-2" />
            Open Manage Exam
          </Button>
        )}

        <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
          <CardHeader>
            <CardTitle>Active Tests</CardTitle>
          </CardHeader>
          <CardContent>
            {exams.length ? (
              exams.map((test, index) => (
                <div
                  key={test.id}
                  ref={(el) => { examRefs.current[test.id] = el; }}
                  className="flex justify-between items-center p-4 border rounded-lg animate-slide-in transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${test.status === 'Live' ? 'bg-green-500' : test.status === 'Scheduled' ? 'bg-yellow-500' : 'bg-gray-500'}`} />
                    <div>
                      <p className="font-medium">{test.title}</p>
                      <p className="text-sm text-muted-foreground">{test.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleSelectExam(test.id, 'view')}>View</Button>
                    <Button variant="outline" size="sm" onClick={() => handleSelectExam(test.id, 'manage')}>Manage</Button>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/common/monitor/${test.id}`)}>Monitor</Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-destructive">No active or scheduled exams</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ConductTestOnline;