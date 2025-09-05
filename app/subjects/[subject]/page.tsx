'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock, BookOpen, BarChart3, NotebookPen, GraduationCap, Play, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import { use } from "react";

// Define the subject data structure
interface SubjectData {
  name: string;
  icon: string;
  mockExams: Array<{
    year: number;
    ethiopianYear: string;
    questions: number;
    duration: number;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    attempts: number;
    bestScore?: number;
  }>;
  topics: Array<{
    name: string;
    description: string;
    questions: number;
    completed: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  }>;
}

// Define the subject data
const subjectData: Record<string, SubjectData> = {
  mathematics: {
    name: "Mathematics",
    icon: "📐",
    mockExams: [
      { year: 2024, ethiopianYear: "2016 E.C.", questions: 50, duration: 120, difficulty: 'Hard', attempts: 0 },
      { year: 2023, ethiopianYear: "2015 E.C.", questions: 50, duration: 120, difficulty: 'Hard', attempts: 2, bestScore: 85 },
      { year: 2022, ethiopianYear: "2014 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 1, bestScore: 78 },
      { year: 2021, ethiopianYear: "2013 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 3, bestScore: 92 },
      { year: 2020, ethiopianYear: "2012 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 1, bestScore: 72 },
    ],
    topics: [
      { name: "Algebra", description: "Linear equations, quadratic equations, polynomials", questions: 80, completed: 45, difficulty: 'Intermediate' },
      { name: "Geometry", description: "Shapes, angles, area, volume calculations", questions: 60, completed: 30, difficulty: 'Intermediate' },
      { name: "Trigonometry", description: "Sin, cos, tan functions and applications", questions: 50, completed: 20, difficulty: 'Advanced' },
      { name: "Calculus", description: "Derivatives, integrals, limits", questions: 70, completed: 15, difficulty: 'Advanced' },
      { name: "Statistics", description: "Mean, median, mode, probability", questions: 40, completed: 25, difficulty: 'Beginner' },
    ]
  },
  physics: {
    name: "Physics", 
    icon: "⚛️",
    mockExams: [
      { year: 2024, ethiopianYear: "2016 E.C.", questions: 50, duration: 120, difficulty: 'Hard', attempts: 0 },
      { year: 2023, ethiopianYear: "2015 E.C.", questions: 50, duration: 120, difficulty: 'Hard', attempts: 1, bestScore: 68 },
      { year: 2022, ethiopianYear: "2014 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 2, bestScore: 75 },
      { year: 2021, ethiopianYear: "2013 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 0 },
      { year: 2020, ethiopianYear: "2012 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 1, bestScore: 82 },
    ],
    topics: [
      { name: "Mechanics", description: "Motion, forces, energy, momentum", questions: 70, completed: 25, difficulty: 'Intermediate' },
      { name: "Thermodynamics", description: "Heat, temperature, gas laws", questions: 45, completed: 15, difficulty: 'Advanced' },
      { name: "Electromagnetism", description: "Electric fields, magnetic fields, circuits", questions: 65, completed: 20, difficulty: 'Advanced' },
      { name: "Optics", description: "Light, reflection, refraction, lenses", questions: 40, completed: 18, difficulty: 'Intermediate' },
      { name: "Modern Physics", description: "Atomic structure, quantum mechanics", questions: 35, completed: 8, difficulty: 'Advanced' },
    ]
  },
  chemistry: {
    name: "Chemistry",
    icon: "🧪", 
    mockExams: [
      { year: 2024, ethiopianYear: "2016 E.C.", questions: 50, duration: 120, difficulty: 'Hard', attempts: 0 },
      { year: 2023, ethiopianYear: "2015 E.C.", questions: 50, duration: 120, difficulty: 'Hard', attempts: 1, bestScore: 73 },
      { year: 2022, ethiopianYear: "2014 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 2, bestScore: 80 },
      { year: 2021, ethiopianYear: "2013 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 1, bestScore: 65 },
      { year: 2020, ethiopianYear: "2012 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 0 },
    ],
    topics: [
      { name: "Organic Chemistry", description: "Carbon compounds, functional groups, reactions", questions: 60, completed: 30, difficulty: 'Advanced' },
      { name: "Inorganic Chemistry", description: "Elements, compounds, periodic table", questions: 55, completed: 25, difficulty: 'Intermediate' },
      { name: "Physical Chemistry", description: "Chemical bonding, thermochemistry, kinetics", questions: 50, completed: 20, difficulty: 'Advanced' },
      { name: "Analytical Chemistry", description: "Qualitative and quantitative analysis", questions: 40, completed: 10, difficulty: 'Intermediate' },
      { name: "Environmental Chemistry", description: "Pollution, green chemistry, sustainability", questions: 30, completed: 5, difficulty: 'Beginner' },
    ]
  },
  biology: {
    name: "Biology",
    icon: "🧬",
    mockExams: [
      { year: 2024, ethiopianYear: "2016 E.C.", questions: 50, duration: 120, difficulty: 'Hard', attempts: 0 },
      { year: 2023, ethiopianYear: "2015 E.C.", questions: 50, duration: 120, difficulty: 'Hard', attempts: 1, bestScore: 70 },
      { year: 2022, ethiopianYear: "2014 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 0 },
      { year: 2021, ethiopianYear: "2013 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 2, bestScore: 88 },
      { year: 2020, ethiopianYear: "2012 E.C.", questions: 50, duration: 120, difficulty: 'Medium', attempts: 1, bestScore: 77 },
    ],
    topics: [
      { name: "Cell Biology", description: "Cell structure, organelles, cell division", questions: 50, completed: 20, difficulty: 'Intermediate' },
      { name: "Genetics", description: "DNA, RNA, inheritance, mutations", questions: 45, completed: 15, difficulty: 'Advanced' },
      { name: "Ecology", description: "Ecosystems, food chains, environmental interactions", questions: 40, completed: 18, difficulty: 'Intermediate' },
      { name: "Human Biology", description: "Body systems, physiology, health", questions: 55, completed: 25, difficulty: 'Intermediate' },
      { name: "Evolution", description: "Natural selection, species formation, phylogeny", questions: 35, completed: 8, difficulty: 'Advanced' },
    ]
  },
  english: {
    name: "English",
    icon: "📚",
    mockExams: [
      { year: 2024, ethiopianYear: "2016 E.C.", questions: 60, duration: 90, difficulty: 'Hard', attempts: 0 },
      { year: 2023, ethiopianYear: "2015 E.C.", questions: 60, duration: 90, difficulty: 'Hard', attempts: 3, bestScore: 95 },
      { year: 2022, ethiopianYear: "2014 E.C.", questions: 60, duration: 90, difficulty: 'Medium', attempts: 2, bestScore: 88 },
      { year: 2021, ethiopianYear: "2013 E.C.", questions: 60, duration: 90, difficulty: 'Medium', attempts: 1, bestScore: 82 },
      { year: 2020, ethiopianYear: "2012 E.C.", questions: 60, duration: 90, difficulty: 'Medium', attempts: 2, bestScore: 90 },
    ],
    topics: [
      { name: "Grammar", description: "Tenses, parts of speech, sentence structure", questions: 80, completed: 60, difficulty: 'Intermediate' },
      { name: "Reading Comprehension", description: "Text analysis, inference, main ideas", questions: 70, completed: 45, difficulty: 'Advanced' },
      { name: "Vocabulary", description: "Word meanings, synonyms, antonyms", questions: 60, completed: 40, difficulty: 'Beginner' },
      { name: "Writing Skills", description: "Essays, letter writing, composition", questions: 40, completed: 15, difficulty: 'Advanced' },
      { name: "Literature", description: "Poetry, prose, literary devices", questions: 50, completed: 20, difficulty: 'Advanced' },
    ]
  },
  aptitude: {
    name: "Aptitude",
    icon: "🧠",
    mockExams: [
      { year: 2024, ethiopianYear: "2016 E.C.", questions: 40, duration: 60, difficulty: 'Hard', attempts: 0 },
      { year: 2023, ethiopianYear: "2015 E.C.", questions: 40, duration: 60, difficulty: 'Hard', attempts: 1, bestScore: 62 },
      { year: 2022, ethiopianYear: "2014 E.C.", questions: 40, duration: 60, difficulty: 'Medium', attempts: 2, bestScore: 75 },
      { year: 2021, ethiopianYear: "2013 E.C.", questions: 40, duration: 60, difficulty: 'Medium', attempts: 0 },
      { year: 2020, ethiopianYear: "2012 E.C.", questions: 40, duration: 60, difficulty: 'Medium', attempts: 1, bestScore: 68 },
    ],
    topics: [
      { name: "Logical Reasoning", description: "Patterns, sequences, logical deduction", questions: 50, completed: 20, difficulty: 'Advanced' },
      { name: "Quantitative Aptitude", description: "Number systems, arithmetic, percentages", questions: 60, completed: 25, difficulty: 'Intermediate' },
      { name: "Spatial Reasoning", description: "Visual patterns, 3D reasoning, shapes", questions: 40, completed: 10, difficulty: 'Advanced' },
      { name: "Verbal Reasoning", description: "Analogies, word relationships, coding", questions: 45, completed: 15, difficulty: 'Intermediate' },
      { name: "Data Interpretation", description: "Charts, graphs, tables, analysis", questions: 35, completed: 8, difficulty: 'Advanced' },
    ]
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
    case 'Beginner':
      return 'bg-green-100 text-green-800';
    case 'Medium':
    case 'Intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'Hard':
    case 'Advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface SubjectPageProps {
 params: Promise<{ subject: string }>;
}

export default function SubjectPage({ params }: SubjectPageProps) {
  const router = useRouter();
  const { subject } = use(params);
  const subjectInfo = subjectData[subject];
  
  if (!subjectInfo) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subject Not Found</h1>
          <p className="text-muted-foreground mb-6">The subject you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/')}>
            Go Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Handler functions for navigation
  const handleMockExamSelect = (year: number) => {
    router.push(`/subjects/${subject}/exam/mock/${year}`);
  };

  const handlePracticeSelect = (topic: string) => {
    const topicSlug = topic.toLowerCase().replace(/\s+/g, '-');
    router.push(`/subjects/${subject}/practice/${topicSlug}`);
  };

  const handleStudySelect = (topic: string) => {
    const topicSlug = topic.toLowerCase().replace(/\s+/g, '-');
    router.push(`/subjects/${subject}/study/${topicSlug}`);
  };

  const handleAnalyticsSelect = () => {
    router.push(`/subjects/${subject}/analytics`);
  };

  const handleNotesSelect = () => {
    router.push(`/subjects/${subject}/notes`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button onClick={handleNotesSelect} variant="outline" className="flex items-center space-x-2">
                <NotebookPen className="h-4 w-4" />
                <span>Notes</span>
              </Button>
              <Button onClick={handleAnalyticsSelect} variant="outline" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-3xl">{subjectInfo.icon}</span>
            <h1 className="text-3xl font-bold">{subjectInfo.name}</h1>
          </div>
          <p className="text-muted-foreground">
            Study comprehensive materials, take mock exams from previous years, or practice specific topics
          </p>
        </div>

        <Tabs defaultValue="study" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="study" className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span>Study Materials</span>
            </TabsTrigger>
            <TabsTrigger value="mock-exams" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Mock Exams</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Practice</span>
            </TabsTrigger>
          </TabsList>

          {/* Study Materials Tab */}
          <TabsContent value="study" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectInfo.topics.map((topic) => {
                const progress = (topic.completed / topic.questions) * 100;
                
                return (
                  <Card key={topic.name} className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <span>{topic.name}</span>
                        </CardTitle>
                        <Badge className={getDifficultyColor(topic.difficulty)}>
                          {topic.difficulty}
                        </Badge>
                      </div>
                      <CardDescription>{topic.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Study Progress</span>
                          <span>{Math.round(progress)}% complete</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-2">
                          <Button 
                            className="w-full"
                            onClick={() => handleStudySelect(topic.name)}
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Start Studying
                          </Button>
                          
                          {/* <Button 
                            variant="outline"
                            className="w-full"
                            onClick={() => handlePracticeSelect(topic.name)}
                          >
                            <Brain className="mr-2 h-4 w-4" />
                            Practice Questions
                          </Button> */}
                        </div>

                        <div className="text-xs text-muted-foreground pt-2 border-t">
                          <div className="flex justify-between">
                            <span>Practice completed:</span>
                            <span>{topic.completed}/{topic.questions} questions</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          {/* Mock Exams Tab */}
          <TabsContent value="mock-exams" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectInfo.mockExams.map((exam) => (
                <Card key={exam.year} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{exam.ethiopianYear}</span>
                      </CardTitle>
                      <Badge className={getDifficultyColor(exam.difficulty)}>
                        {exam.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>
                      University Entrance Exam {exam.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {exam.questions} Questions
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {exam.duration} min
                        </span>
                      </div>
                      
                      {exam.attempts > 0 && (
                        <div className="text-sm">
                          <div className="flex justify-between">
                            <span>Attempts:</span>
                            <span>{exam.attempts}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Best Score:</span>
                            <span className="font-medium">{exam.bestScore}%</span>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        className="w-full"
                        onClick={() => handleMockExamSelect(exam.year)}
                      >
                        {exam.attempts > 0 ? 'Retake Exam' : 'Start Exam'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Practice Tab */}
          <TabsContent value="practice" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectInfo.topics.map((topic) => {
                const progress = (topic.completed / topic.questions) * 100;
                
                return (
                  <Card key={topic.name} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{topic.name}</CardTitle>
                        <Badge className={getDifficultyColor(topic.difficulty)}>
                          {topic.difficulty}
                        </Badge>
                      </div>
                      <CardDescription>{topic.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{topic.completed}/{topic.questions}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => handlePracticeSelect(topic.name)}
                        >
                          Continue Practice
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}