// app/subjects/[subject]/practice/[topicSlug]/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Clock, ArrowLeft, ArrowRight, Flag, CheckCircle2, Bookmark, Loader2, } from "lucide-react";
import { toast } from "sonner";
import { useParams, useRouter } from 'next/navigation';

interface PracticeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface PracticeResults {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  answers: { questionId: string; userAnswer: number; isCorrect: boolean }[];
  subjectId: string;
  topic: string;
}

// Mock data for practice questions by subject and topic
const practiceQuestions: Record<string, Record<string, PracticeQuestion[]>> = {
  mathematics: {
    algebra: [
      {
        id: "math-alg-1",
        question: "Solve for x: 2x + 5 = 15",
        options: ["x = 5", "x = 10", "x = 7.5", "x = 20"],
        correctAnswer: 0,
        topic: "Algebra",
        difficulty: "easy",
        explanation: "Subtract 5 from both sides: 2x = 10. Then divide both sides by 2: x = 5."
      },
      {
        id: "math-alg-2",
        question: "Factor the expression: x² - 4",
        options: ["(x - 2)(x + 2)", "(x - 4)(x + 1)", "(x - 2)²", "(x + 2)²"],
        correctAnswer: 0,
        topic: "Algebra",
        difficulty: "medium",
        explanation: "This is a difference of squares: a² - b² = (a - b)(a + b). So x² - 4 = (x - 2)(x + 2)."
      },
      {
        id: "math-alg-3",
        question: "Solve the system of equations: y = 2x + 1 and y = -x + 4",
        options: ["(1, 3)", "(2, 5)", "(3, 7)", "(0, 4)"],
        correctAnswer: 0,
        topic: "Algebra",
        difficulty: "medium",
        explanation: "Set the equations equal: 2x + 1 = -x + 4. Solve for x: 3x = 3, x = 1. Then y = 2(1) + 1 = 3."
      },
      {
        id: "math-alg-4",
        question: "Simplify the expression: (3x³y²)²",
        options: ["9x⁶y⁴", "6x⁵y⁴", "9x⁵y⁴", "6x⁶y⁴"],
        correctAnswer: 0,
        topic: "Algebra",
        difficulty: "hard",
        explanation: "Apply the power to each factor: (3)² = 9, (x³)² = x⁶, (y²)² = y⁴. So the result is 9x⁶y⁴."
      }
    ],
    trigonometry: [
      {
        id: "math-trig-1",
        question: "What is the value of sin(90°)?",
        options: ["1", "0", "0.5", "√2/2"],
        correctAnswer: 0,
        topic: "Trigonometry",
        difficulty: "easy",
        explanation: "The sine of 90 degrees is 1."
      },
      {
        id: "math-trig-2",
        question: "What is the value of cos(0°)?",
        options: ["1", "0", "0.5", "√2/2"],
        correctAnswer: 0,
        topic: "Trigonometry",
        difficulty: "easy",
        explanation: "The cosine of 0 degrees is 1."
      },
      {
        id: "math-trig-3",
        question: "What is the Pythagorean identity?",
        options: [
          "sin²θ + cos²θ = 1",
          "sinθ + cosθ = 1",
          "tanθ = sinθ/cosθ",
          "1 + tan²θ = sec²θ"
        ],
        correctAnswer: 0,
        topic: "Trigonometry",
        difficulty: "medium",
        explanation: "The fundamental Pythagorean identity is sin²θ + cos²θ = 1."
      },
      {
        id: "math-trig-4",
        question: "What is the period of the sine function?",
        options: ["2π", "π", "π/2", "4π"],
        correctAnswer: 0,
        topic: "Trigonometry",
        difficulty: "medium",
        explanation: "The sine function has a period of 2π radians."
      },
      {
        id: "math-trig-5",
        question: "What is the value of tan(45°)?",
        options: ["1", "0", "√3", "√3/3"],
        correctAnswer: 0,
        topic: "Trigonometry",
        difficulty: "easy",
        explanation: "The tangent of 45 degrees is 1."
      }
    ],
    geometry: [
      {
        id: "math-geo-1",
        question: "What is the area of a circle with radius 5?",
        options: ["25π", "10π", "5π", "100π"],
        correctAnswer: 0,
        topic: "Geometry",
        difficulty: "easy",
        explanation: "The area of a circle is πr². With r = 5, area = π(5)² = 25π."
      },
      {
        id: "math-geo-2",
        question: "What is the Pythagorean theorem?",
        options: ["a² + b² = c²", "a + b = c", "a² - b² = c²", "a × b = c"],
        correctAnswer: 0,
        topic: "Geometry",
        difficulty: "easy",
        explanation: "The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides."
      }
    ],
    calculus: [
      {
        id: "math-calc-1",
        question: "What is the derivative of x²?",
        options: ["2x", "x", "2", "x³/3"],
        correctAnswer: 0,
        topic: "Calculus",
        difficulty: "medium",
        explanation: "Using the power rule, the derivative of xⁿ is n*xⁿ⁻¹. So derivative of x² is 2x."
      }
    ]
  },
  physics: {
    mechanics: [
      {
        id: "physics-mech-1",
        question: "What is the formula for force?",
        options: ["F = ma", "F = mv", "F = mg", "F = mgh"],
        correctAnswer: 0,
        topic: "Mechanics",
        difficulty: "easy",
        explanation: "Newton's second law states that force equals mass times acceleration: F = ma."
      },
      {
        id: "physics-mech-2",
        question: "What is the SI unit of force?",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        correctAnswer: 0,
        topic: "Mechanics",
        difficulty: "easy",
        explanation: "The SI unit of force is the Newton, named after Isaac Newton."
      }
    ],
    electricity: [
      {
        id: "physics-elec-1",
        question: "What is the formula for Ohm's Law?",
        options: ["V = IR", "I = VR", "R = IV", "P = IV"],
        correctAnswer: 0,
        topic: "Electricity",
        difficulty: "medium",
        explanation: "Ohm's Law states that voltage equals current times resistance: V = IR."
      }
    ]
  }
};

const getTopicNameFromSlug = (slug: string | undefined): string => {
  // Handle undefined or empty slug
  if (!slug) return (
    console.log("Topic slug is undefined or empty"),
    "Unknown Topic");

  const slugToName: Record<string, string> = {
    'algebra': 'Algebra',
    'geometry': 'Geometry',
    'calculus': 'Calculus',
    'mechanics': 'Mechanics',
    'trigonometry': 'Trigonometry',
    'electricity': 'Electricity'
  };
  
  return slugToName[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
};


export default function PracticeExamPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject as string;
  const topic = params.topic as string;
  const topicName = getTopicNameFromSlug(topic);
  console.log("All params:", params);
  console.log("Subject ID:", subjectId);
  console.log("Topic Slug:", topic);
  console.log("Topic Name:", topicName);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes for practice
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [savedQuestions, setSavedQuestions] = useState<Set<string>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);


  
  // Load questions on component mount
  useEffect(() => {
    setIsLoadingQuestions(true);
    const subjectQuestions = practiceQuestions[subjectId] || {};
    const topicQuestions = subjectQuestions[topic] || [];
    
    setQuestions(topicQuestions);
    setIsLoadingQuestions(false);
  }, [subjectId, topic]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;
  
  const handleExamComplete = useCallback(() => {
    const totalTime = 30 * 60;
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

    const results: PracticeResults = {
      score: Math.round((correctCount / questions.length) * 100),
      totalQuestions: questions.length,
      timeSpent,
      answers: examAnswers,
      subjectId,
      topic: topicName
    };

    // In a real app, you would save results to your database here
    toast.success('Practice completed!');
    
    // Navigate to results page
    router.push(`/subjects/${subjectId}/practice/results?score=${results.score}&total=${results.totalQuestions}&time=${results.timeSpent}&topic=${encodeURIComponent(topicName)}`);
  }, [questions, answers, timeLeft, router, subjectId, topicName]);
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
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }));
    
    // For practice mode, show explanation immediately after answering
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const toggleFlag = () => {
    if (!currentQuestion) return;
    
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
        toast.success('Question unflagged');
      } else {
        newSet.add(currentQuestion.id);
        toast.success('Question flagged for review');
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

//   const handleAnalytics = () => {
//     router.push(`/subjects/${subjectId}/analytics`);
//   };

  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading practice questions...</p>
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
              Sorry, no practice questions are available for {topicName} yet.
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
            <CardTitle>Practice: {topicName}</CardTitle>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{questions.length} Questions</p>
              <p>{formatTime(timeLeft)} Time Limit</p>
              <p>Multiple Choice Questions</p>
              <Badge variant="outline" className="capitalize">
                {questions[0]?.difficulty || 'mixed'} difficulty
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <h4 className="font-medium">Practice Features:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Immediate feedback with explanations</li>
                <li>Save questions for later review</li>
                <li>Flag challenging questions</li>
                <li>No penalty for wrong answers</li>
                <li>Learn at your own pace</li>
              </ul>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setIsExamStarted(true)} className="flex-1">
                Start Practice
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
              Exit Practice
            </Button>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatTime(timeLeft)}</span>
              </Badge>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">End Practice</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>End Practice Session?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have answered {answeredCount} out of {questions.length} questions. 
                      Are you sure you want to end your practice session?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Continue Practice</AlertDialogCancel>
                    <AlertDialogAction onClick={handleExamComplete}>
                      End Practice
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
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="capitalize">
                  {currentQuestion.difficulty}
                </Badge>
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                // const showAnswer = showExplanation && isSelected;
                
                return (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? isCorrect 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-red-500 bg-red-50'
                        : 'border-border hover:bg-muted/50'
                    } ${showExplanation && isCorrect ? 'border-green-500 bg-green-50' : ''}`}
                    onClick={() => !showExplanation && handleAnswerSelect(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 border rounded-full ${
                        isSelected
                          ? isCorrect 
                            ? 'border-green-500 bg-green-500' 
                            : 'border-red-500 bg-red-500'
                          : 'border-border'
                      } ${showExplanation && isCorrect ? 'border-green-500 bg-green-500' : ''}`}>
                        {(isSelected || (showExplanation && isCorrect)) && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation (shown after answer in practice mode) */}
            {showExplanation && currentQuestion.explanation && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Explanation:</h4>
                <p className="text-blue-700">{currentQuestion.explanation}</p>
              </div>
            )}
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
                    onClick={() => {
                      setCurrentQuestionIndex(index);
                      setShowExplanation(false);
                    }}
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