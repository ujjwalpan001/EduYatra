import { useState, useRef, useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Save, Eye, X, Upload } from "lucide-react";
import 'katex/dist/katex.min.css';
import { renderKatex, KatexRenderer } from '@/lib/katex-rendering';
import ReactDOMServer from 'react-dom/server';
import { toast } from "sonner";
import { jwtDecode } from 'jwt-decode';

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology"];
const questionTypes = ["MCQ", "True/False", "Fill in the Blanks", "Short Answer"];
const difficultyLevels = ["Easy", "Medium", "Hard"];

interface FormData {
  question: string;
  subject: string;
  difficulty: string;
  correctOption: string;
  incorrectOptions: string[];
  image: File | null;
  courseCode: string;
  visibility: 'public' | 'private';
  topic: string;
  isDefault: boolean;
  solution: string;
  questionType: string;
  instituteName: string;
  questionBankName: string;
}

const CreateQuestion = () => {
  const [formData, setFormData] = useState<FormData>({
    question: '',
    subject: '',
    difficulty: 'Medium',
    correctOption: '',
    incorrectOptions: ['', '', ''],
    image: null,
    courseCode: '',
    visibility: 'public',
    topic: '',
    isDefault: false,
    solution: '',
    questionType: 'MCQ',
    instituteName: '',
    questionBankName: ''
  });

  const [questionBanks, setQuestionBanks] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [institutes, setInstitutes] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Authenticate user and fetch data
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("⚠️ Please log in to create a question");
      window.location.href = "/signin";
      return;
    }
    try {
      const decodedToken: { id: string } = jwtDecode(token);
      setUserId(decodedToken.id);
    } catch (error) {
      console.error("Error decoding token:", error);
      toast.error("⚠️ Invalid authentication token");
      window.location.href = "/signin";
    }

    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

        const qbResponse = await fetch("https://eduyatrabackend.onrender.com/api/questions/questionBanks", { headers });
        const qbResult = await qbResponse.json();
        if (qbResponse.ok) {
          setQuestionBanks(qbResult.questionBanks.map((qb: any) => qb.name));
        }

        const courseResponse = await fetch("https://eduyatrabackend.onrender.com/api/questions/courses", { headers });
        const courseResult = await courseResponse.json();
        if (courseResponse.ok) {
          setCourses(courseResult.courses.map((course: any) => course.course_code));
        }

        const instituteResponse = await fetch("https://eduyatrabackend.onrender.com/api/questions/institutes", { headers });
        const instituteResult = await instituteResponse.json();
        if (instituteResponse.ok) {
          setInstitutes(instituteResult.institutes.map((institute: any) => institute.name));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIncorrectOptionChange = (index: number, value: string) => {
    const newIncorrectOptions = [...formData.incorrectOptions];
    newIncorrectOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      incorrectOptions: newIncorrectOptions
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("⚠️ Please log in to create a question");
      return;
    }

    if (!formData.questionBankName.trim()) {
      toast.error("❌ Please enter a question bank name.");
      return;
    }
    if (!formData.courseCode.trim()) {
      toast.error("❌ Please enter a course code.");
      return;
    }
    if (!formData.instituteName.trim()) {
      toast.error("❌ Please enter an institute name.");
      return;
    }

    let imageUrl = "";

    if (formData.image) {
      const imageData = new FormData();
      imageData.append("file", formData.image);
      imageData.append("upload_preset", "ExamZone");

      try {
        const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dxfgcelyx/image/upload", {
          method: "POST",
          body: imageData
        });
        const cloudinaryData = await cloudinaryRes.json();
        imageUrl = cloudinaryData.secure_url;
      } catch (err) {
        toast.error("❌ Failed to upload image to Cloudinary.");
        return;
      }
    }

    const payload = {
      latex_code: formData.question,
      katex_code: ReactDOMServer.renderToString(<>{renderKatex(formData.question)}</>),
      level: formData.difficulty,
      image: imageUrl,
      uploaded_by: userId,
      created_by: userId,
      question_type: formData.questionType,
      correct_option_latex: formData.correctOption,
      correct_option_katex: ReactDOMServer.renderToString(<>{renderKatex(formData.correctOption)}</>),
      incorrect_option_latex: formData.incorrectOptions,
      incorrect_option_katex: formData.incorrectOptions.map(option => ReactDOMServer.renderToString(<>{renderKatex(option)}</>)),
      topic: formData.topic,
      Sub_topic: "",
      bloom_level: "",
      solution_latex: formData.solution,
      katex_solution: ReactDOMServer.renderToString(<>{renderKatex(formData.solution)}</>),
      subject: formData.subject,
      question_stats: {},
      courseCode: formData.courseCode,
      instituteName: formData.instituteName,
      visibility: formData.visibility,
      questionBankName: formData.questionBankName,
      difficulty_rating: 0,
      updated_at: new Date()
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("https://eduyatrabackend.onrender.com/api/questions", {
        method: "POST",
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("✅ Question saved successfully!");
        console.log(result);
        const refreshData = async () => {
          const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
          const qbResponse = await fetch("https://eduyatrabackend.onrender.com/api/questions/questionBanks", { headers });
          if (qbResponse.ok) {
            const qbResult = await qbResponse.json();
            setQuestionBanks(qbResult.questionBanks.map((qb: any) => qb.name));
          }
          const courseResponse = await fetch("https://eduyatrabackend.onrender.com/api/questions/courses", { headers });
          if (courseResponse.ok) {
            const courseResult = await courseResponse.json();
            setCourses(courseResult.courses.map((course: any) => course.course_code));
          }
          const instituteResponse = await fetch("https://eduyatrabackend.onrender.com/api/questions/institutes", { headers });
          if (instituteResponse.ok) {
            const instituteResult = await instituteResponse.json();
            setInstitutes(instituteResult.institutes.map((institute: any) => institute.name));
          }
        };
        await refreshData();
        // Reset only Question Details fields
        setFormData(prev => ({
          ...prev,
          question: '',
          subject: '',
          difficulty: 'Medium',
          correctOption: '',
          incorrectOptions: ['', '', ''],
          image: null,
          topic: '',
          solution: '',
          questionType: 'MCQ'
        }));
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(`❌ Failed to save question: ${result.error || result.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      toast.error(`⚠️ Error submitting form: ${err.message}`);
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Create Question
            </h1>
            <p className="text-muted-foreground mt-2">Add new questions to your question bank</p>
          </div>
          <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80">
            <Save className="h-4 w-4 mr-2" />
            Save Question
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass-effect border-primary/20 animate-scale-in hover-lift">
              <CardHeader>
                <CardTitle>Question Details</CardTitle>
                <CardDescription>Enter the question and its details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="question">Question (LaTeX supported)</Label>
                  <Textarea
                    id="question"
                    name="question"
                    value={formData.question}
                    onChange={handleInputChange}
                    placeholder="Enter your question here..."
                    className="min-h-24 font-mono"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use $...$ for inline LaTeX and $$...$$ for block LaTeX
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select 
                      value={formData.subject}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select 
                      value={formData.difficulty}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="questionType">Question Type</Label>
                    <Select 
                      value={formData.questionType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, questionType: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select question type" />
                      </SelectTrigger>
                      <SelectContent>
                        {questionTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleInputChange}
                      placeholder="Enter topic"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="correctOption">Correct Option (LaTeX supported)</Label>
                    <Textarea
                      id="correctOption"
                      name="correctOption"
                      value={formData.correctOption}
                      onChange={handleInputChange}
                      placeholder="Enter the correct answer..."
                      className="min-h-20 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label>Incorrect Options (LaTeX supported, min 3)</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          incorrectOptions: [...prev.incorrectOptions, '']
                        }))}
                        className="text-primary"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Option
                      </Button>
                    </div>
                    
                    {formData.incorrectOptions.map((option, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Textarea
                          value={option}
                          onChange={(e) => handleIncorrectOptionChange(index, e.target.value)}
                          placeholder={`Incorrect option ${index + 1}...`}
                          className="flex-1 font-mono min-h-16"
                          required={index < 3}
                        />
                        {formData.incorrectOptions.length > 3 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              incorrectOptions: prev.incorrectOptions.filter((_, i) => i !== index)
                            }))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Image (Optional)</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-accent/20 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          SVG, PNG, JPG or GIF (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      />
                    </label>
                  </div>
                  {previewUrl && (
                    <div className="mt-2 relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-32 w-auto rounded-md border"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white hover:bg-destructive/90"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="solution">Solution (Optional, LaTeX supported)</Label>
                  <Textarea
                    id="solution"
                    name="solution"
                    value={formData.solution}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed solution..."
                    className="min-h-24 font-mono"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/20">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Additional settings for this question</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="courseCode">Course Code</Label>
                    <Input
                      id="courseCode"
                      name="courseCode"
                      value={formData.courseCode}
                      onChange={handleInputChange}
                      placeholder="Enter course code"
                      list="courses"
                      required
                    />
                    <datalist id="courses">
                      {courses.map((code) => (
                        <option key={code} value={code} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="questionBankName">Question Bank Name</Label>
                    <Input
                      id="questionBankName"
                      name="questionBankName"
                      value={formData.questionBankName}
                      onChange={handleInputChange}
                      placeholder="Enter question bank name"
                      list="questionBanks"
                      required
                    />
                    <datalist id="questionBanks">
                      {questionBanks.map((name) => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instituteName">Institute Name</Label>
                    <Input
                      id="instituteName"
                      name="instituteName"
                      value={formData.instituteName}
                      onChange={handleInputChange}
                      placeholder="Enter institute name"
                      list="institutes"
                      required
                    />
                    <datalist id="institutes">
                      {institutes.map((name) => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="visibility">Visibility</Label>
                      <p className="text-xs text-muted-foreground">
                        {formData.visibility === 'public' ? 'Visible to all' : 'Private'}
                      </p>
                    </div>
                    <Switch
                      id="visibility"
                      checked={formData.visibility === 'public'}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          visibility: checked ? 'public' : 'private'
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-1">
                      <Label htmlFor="isDefault">Set as default template</Label>
                      <p className="text-xs text-muted-foreground">
                        {formData.isDefault ? 'Will be used as default' : 'Not set as default'}
                      </p>
                    </div>
                    <Switch
                      id="isDefault"
                      checked={formData.isDefault}
                      onCheckedChange={(checked) =>
                        setFormData(prev => ({
                          ...prev,
                          isDefault: checked
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Preview
                </CardTitle>
                <CardDescription>See how your question will appear to students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-background">
                    <h3 className="font-medium mb-2">Question Preview</h3>
                    {formData.question ? (
                      <div className="prose max-w-none">
                        <KatexRenderer>{formData.question}</KatexRenderer>
                        
                        <div className="mt-4 space-y-2">
                          {formData.correctOption && (
                            <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md">
                              <span className="text-green-600 dark:text-green-400 font-medium">A.</span>
                              <KatexRenderer>{formData.correctOption}</KatexRenderer>
                            </div>
                          )}
                          
                          {formData.incorrectOptions.map((option, index) => (
                            option && (
                              <div key={index} className="flex items-start gap-2 p-2 border rounded-md">
                                <span className="text-muted-foreground">{String.fromCharCode(66 + index)}.</span>
                                <KatexRenderer>{option}</KatexRenderer>
                              </div>
                            )
                          ))}
                        </div>
                        
                        {formData.solution && (
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-2">Solution:</h4>
                            <KatexRenderer>{formData.solution}</KatexRenderer>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Your question will appear here as you type...
                      </p>
                    )}
                  </div>
                  
                  <Button variant="outline" className="w-full" type="button">
                    Preview Full Screen
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/20 animate-fade-in hover-lift">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common actions for this question</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" type="button">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Another Question
                </Button>
                <Button variant="outline" className="w-full justify-start" type="button">
                  <Upload className="h-4 w-4 mr-2" />
                  Import from Template
                </Button>
                <Button variant="outline" className="w-full justify-start" type="button">
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Layout>
  );
};

export default CreateQuestion;