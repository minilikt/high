"use client";
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Clock, ArrowLeft, ArrowRight, Flag, CheckCircle2, Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from 'next/navigation';

interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic?: string;
  explanation?: string;
}

interface ExamResults {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: { questionId: string; userAnswer: number; isCorrect: boolean }[];
  subjectId: string;
  examType: 'mock' | 'practice';
  year?: number;
  topic?: string;
}

// Mock data - in a real app, this would come from a database
const mockQuestions: Record<string, Record<string, ExamQuestion[]>> = {
  mathematics: {
    "2024": [
      {
        id: "math-2024-1",
        question: "What is the value of x in the equation 2x + 5 = 15?",
        options: ["5", "10", "7.5", "20"],
        correctAnswer: 0,
        topic: "Algebra"
      },
      {
        id: "math-2024-2",
        question: "What is the area of a circle with radius 5?",
        options: ["25π", "10π", "5π", "100π"],
        correctAnswer: 0,
        topic: "Geometry"
      },
      {
        id: "math-2024-3",
        question: "Solve for y: 3y - 7 = 8",
        options: ["5", "3", "7", "15"],
        correctAnswer: 0,
        topic: "Algebra"
      },
      {
        id: "math-2024-4",
        question: "What is the derivative of x²?",
        options: ["2x", "x", "2", "x³/3"],
        correctAnswer: 0,
        topic: "Calculus"
      },
      {
        id: "math-2024-5",
        question: "What is the value of sin(90°)?",
        options: ["1", "0", "0.5", "√2/2"],
        correctAnswer: 0,
        topic: "Trigonometry"
      }
    ],
    "2023": [
      {
        id: "math-2023-1",
        question: "What is 15% of 200?",
        options: ["30", "15", "20", "25"],
        correctAnswer: 0,
        topic: "Arithmetic"
      },
      {
        id: "math-2023-2",
        question: "Simplify: (2x³)(3x²)",
        options: ["6x⁵", "5x⁵", "6x⁶", "5x⁶"],
        correctAnswer: 0,
        topic: "Algebra"
      }
    ]
  },
  physics: {
    "mechanics": [
      {
        id: "physics-mech-1",
        question: "What is the formula for force?",
        options: ["F = ma", "F = mv", "F = mg", "F = mgh"],
        correctAnswer: 0,
        topic: "Newton's Laws"
      },
      {
        id: "physics-mech-2",
        question: "What is the SI unit of force?",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        correctAnswer: 0,
        topic: "Units"
      }
    ],
    "electricity": [
      {
        id: "physics-elec-1",
        question: "What is the formula for Ohm's Law?",
        options: ["V = IR", "I = VR", "R = IV", "P = IV"],
        correctAnswer: 0,
        topic: "Circuits"
      }
    ]
  }
};

// Load questions from mock data
const loadQuestions = (
  subjectId: string,
  examType: 'mock' | 'practice',
  year?: string,
  topic?: string
): ExamQuestion[] => {
  if (examType === 'mock' && year) {
    return mockQuestions[subjectId]?.[year] || [];
  } else if (examType === 'practice' && topic) {
    return mockQuestions[subjectId]?.[topic] || [];
  }
  return [];
};

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject as string;
  const examType = params.type as 'mock' | 'practice';
  const id = params.id as string; // This could be year for mock exams or topic for practice
  
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(examType === 'mock' ? 60 * 60 : 30 * 60);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [savedQuestions, setSavedQuestions] = useState<Set<string>>(new Set());

  // Load questions on component mount
  useEffect(() => {
    setIsLoadingQuestions(true);
    const loadedQuestions = loadQuestions(
      subjectId, 
      examType, 
      examType === 'mock' ? id : undefined,
      examType === 'practice' ? id : undefined
    );
    setQuestions(loadedQuestions);
    setIsLoadingQuestions(false);
  }, [subjectId, examType, id]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;
  const handleExamComplete = useCallback(() => {
  const totalTime = examType === 'mock' ? 60 * 60 : 30 * 60;
  const timeSpent = totalTime - timeLeft;
  
  // Calculate score and prepare answers
  const examAnswers = questions.map(q => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;
    return {
      questionId: q.id,
      userAnswer: userAnswer ?? -1,
      isCorrect
    };
  });

  const correctCount = examAnswers.filter(a => a.isCorrect).length;

  const results: ExamResults = {
    score: Math.round((correctCount / questions.length) * 100),
    totalQuestions: questions.length,
    timeSpent,
    answers: examAnswers,
    subjectId,
    examType,
    year: examType === 'mock' ? parseInt(id) : undefined,
    topic: examType === 'practice' ? id : undefined
  };

  // In a real app, you would save results to your database here
  toast.success('Exam completed!');
  
  // Navigate to results page
  router.push(`/subjects/${subjectId}/exam/results?score=${results.score}&total=${results.totalQuestions}&time=${results.timeSpent}`);
  }, [questions, answers, timeLeft, router, subjectId, examType, id]);
  useEffect(() => {
    if (!isExamStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleExamComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamStarted, timeLeft, handleExamComplete]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const toggleSaveQuestion = () => {
    if (!currentQuestion) return;
    
    setSavedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
        toast.success('Question removed from saved list');
      } else {
        newSet.add(currentQuestion.id);
        toast.success('Question saved for later review');
      }
      return newSet;
    });
  };



  const handleBack = () => {
    router.push(`/subjects/${subjectId}`);
  };

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading exam questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Sorry, no questions are available for this {examType === 'mock' ? 'exam' : 'topic'} yet.
            </p>
            <Button onClick={handleBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>
              {examType === 'mock' ? `Mock Exam ${id}` : `Practice: ${id}`}
            </CardTitle>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{questions.length} Questions</p>
              <p>{formatTime(timeLeft)} Time Limit</p>
              <p>Multiple Choice Questions</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <h4>Instructions:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Choose the best answer for each question</li>
                <li>You can save questions for later review</li>
                <li>You can flag questions for review</li>
                <li>Navigate between questions using the buttons</li>
                <li>Submit when you&apos;re finished or time runs out</li>
              </ul>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setIsExamStarted(true)} className="flex-1">
                Start Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Exit Exam
            </Button>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(timeLeft)}</span>
              </Badge>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Submit Exam</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have answered {answeredCount} out of {questions.length} questions. 
                      Are you sure you want to submit your exam?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continue Exam</AlertDialogCancel>
                    <AlertDialogAction onClick={handleExamComplete}>
                      Submit Exam
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
              <span>{answeredCount} answered</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {/* Question */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {currentQuestion.question}
              </CardTitle>
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleSaveQuestion}
                  className={savedQuestions.has(currentQuestion.id) ? 'text-blue-600' : ''}
                  title={savedQuestions.has(currentQuestion.id) ? 'Remove from saved' : 'Save question'}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleFlag}
                  className={flaggedQuestions.has(currentQuestion.id) ? 'text-yellow-600' : ''}
                  title={flaggedQuestions.has(currentQuestion.id) ? 'Remove flag' : 'Flag for review'}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {currentQuestion.topic && (
              <Badge variant="secondary">{currentQuestion.topic}</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === index
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 border rounded-full ${
                      answers[currentQuestion.id] === index
                        ? 'border-primary bg-primary'
                        : 'border-border'
                    }`}>
                      {answers[currentQuestion.id] === index && (
                        <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-2">
            {savedQuestions.size > 0 && (
              <Badge variant="outline" className="flex items-center space-x-1 text-blue-600 border-blue-600">
                <Bookmark className="h-3 w-3" />
                <span>{savedQuestions.size} saved</span>
              </Badge>
            )}
            {flaggedQuestions.size > 0 && (
              <Badge variant="outline" className="flex items-center space-x-1">
                <Flag className="h-3 w-3" />
                <span>{flaggedQuestions.size} flagged</span>
              </Badge>
            )}
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Question Navigation Grid */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Question Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, index) => {
                const questionId = questions[index].id;
                const isAnswered = answers[questionId] !== undefined;
                const isCurrent = index === currentQuestionIndex;
                const isFlagged = flaggedQuestions.has(questionId);
                const isSaved = savedQuestions.has(questionId);
                
                return (
                  <Button
                    key={index}
                    variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                    size="sm"
                    className={`relative ${isFlagged ? 'ring-2 ring-yellow-400' : ''} ${isSaved && !isFlagged ? 'ring-2 ring-blue-400' : ''}`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    {index + 1}
                    <div className="absolute -top-1 -right-1 flex space-x-1">
                      {isSaved && (
                        <Bookmark className="h-3 w-3 text-blue-600" />
                      )}
                      {isFlagged && (
                        <Flag className="h-3 w-3 text-yellow-600" />
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}