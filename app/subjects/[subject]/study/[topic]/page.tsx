// app/subjects/[subject]/study/[topic]/page.tsx
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Clock, CheckCircle2, Circle, NotebookPen, Bookmark, HelpCircle, ChevronLeft, ChevronRight, List, Search, ExternalLink, Target } from "lucide-react";
import { toast } from "sonner";
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface QuizData {
  questions: QuizQuestion[];
}

interface QuizStates {
  [contentId: string]: {
    selectedAnswers: { [key: number]: number };
    showResults: { [key: number]: boolean };
  };
}

interface StudyChapter {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  content: StudyContent[];
  completed: boolean;
  progress: number;
}

interface StudyContent {
  id: string;
  type: 'text' | 'image' | 'video' | 'table' | 'graph' | 'quiz' | 'practice' | 'formula';
  title?: string;
  content: string;
  metadata?: { [key: string]: string };
}

// interface StudyNote {
//   id: string;
//   chapterId: string;
//   contentId: string;
//   note: string;
//   timestamp: Date;
// }

// Mock study data - in a real app, this would come from a database
const getStudyData = (subjectId: string, topicId: string): StudyChapter[] => {
  const mathAlgebraChapters: StudyChapter[] = [
    {
      id: 'linear-equations',
      title: 'Linear Equations',
      description: 'Understanding and solving linear equations in one variable',
      estimatedTime: 45,
      completed: false,
      progress: 0,
      content: [
        {
          id: 'intro',
          type: 'text',
          title: 'Introduction to Linear Equations',
          content: `# Linear Equations

A **linear equation** is an algebraic equation in which each term is either a constant or the product of a constant and a single variable.

## Definition
A linear equation in one variable x has the form:
\`ax + b = 0\`

Where:
- \`a\` and \`b\` are constants
- \`a ≠ 0\`
- \`x\` is the variable

## Key Properties
- The graph of a linear equation is always a straight line
- A linear equation has exactly one solution
- The highest power of the variable is 1`
        },
        {
          id: 'examples-table',
          type: 'table',
          title: 'Examples of Linear vs Non-Linear Equations',
          content: `| Equation | Type | Reason |
|----------|------|--------|
| 2x + 5 = 0 | Linear | Highest power of x is 1 |
| 3x - 7 = 2x + 1 | Linear | Can be simplified to linear form |
| x² + 2x = 0 | Non-Linear | Contains x² term |
| 5x + 3y = 10 | Linear (two variables) | Both variables have power 1 |
| 1/x + 2 = 0 | Non-Linear | Contains 1/x which is x⁻¹ |`
        },
        {
          id: 'solving-steps',
          type: 'text',
          title: 'Steps to Solve Linear Equations',
          content: `## Method: Isolation of Variable

### Step 1: Simplify both sides
- Remove parentheses using distributive property
- Combine like terms

### Step 2: Move variable terms to one side
- Add or subtract terms to get all variable terms on one side

### Step 3: Move constant terms to the other side
- Add or subtract constants to isolate variable terms

### Step 4: Divide by the coefficient
- Divide both sides by the coefficient of the variable

### Example:
Solve: \`3x + 7 = 2x - 5\`

**Step 1:** Already simplified
**Step 2:** \`3x - 2x = -5 - 7\`
**Step 3:** \`x = -12\`

**Verification:** \`3(-12) + 7 = -36 + 7 = -29\` and \`2(-12) - 5 = -24 - 5 = -29\` ✓`
        },
        {
          id: 'examples-image',
          type: 'image',
          title: 'Linear Equation Examples',
          content: 'https://images.unsplash.com/photo-1581089778245-3ce67677f718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljYWwlMjBlcXVhdGlvbnMlMjBibGFja2JvYXJkJTIwYWxnZWJyYXxlbnwxfHx8fDE3NTY3NDYyMzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
          metadata: {
            alt: 'Mathematical equations on a blackboard',
            caption: 'Examples of linear equations written on a blackboard - Click to explore more resources',
            clickUrl: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:linear-equations-slope'
          }
        },
        {
          id: 'video-tutorial',
          type: 'video',
          title: 'Solving Linear Equations - Video Tutorial',
          content: 'dQw4w9WgXcQ',
          metadata: {
            duration: '8:45',
            description: 'Watch this comprehensive tutorial on solving linear equations step by step'
          }
        },
        {
          id: 'practice-quiz',
          type: 'quiz',
          title: 'Quick Practice Quiz',
          content: JSON.stringify({
            questions: [
              {
                question: "Solve: 2x + 5 = 15",
                options: ["x = 5", "x = 10", "x = -5", "x = 0"],
                correct: 0,
                explanation: "2x + 5 = 15 → 2x = 10 → x = 5"
              },
              {
                question: "Which is a linear equation?",
                options: ["x² + 2 = 0", "3x + 7 = 0", "1/x = 5", "x³ - 1 = 0"],
                correct: 1,
                explanation: "3x + 7 = 0 is linear because the highest power of x is 1"
              }
            ]
          })
        },
        {
          id: 'key-formulas',
          type: 'formula',
          title: 'Key Formulas to Remember',
          content: `## Essential Linear Equation Formulas

### Standard Form
\`ax + b = 0\`
**Solution:** \`x = -b/a\` (where a ≠ 0)

### General Solution Process
\`ax + b = cx + d\`
1. \`ax - cx = d - b\`
2. \`(a - c)x = d - b\`
3. \`x = (d - b)/(a - c)\`

### Special Cases
- **No solution:** When coefficients are equal but constants differ
- **Infinite solutions:** When both sides are identical after simplification`
        }
      ]
    },
    {
      id: 'quadratic-equations',
      title: 'Quadratic Equations',
      description: 'Understanding and solving quadratic equations using various methods',
      estimatedTime: 60,
      completed: false,
      progress: 0,
      content: [
        {
          id: 'quad-intro',
          type: 'text',
          title: 'Introduction to Quadratic Equations',
          content: `# Quadratic Equations

A **quadratic equation** is a polynomial equation of degree 2.

## Standard Form
\`ax² + bx + c = 0\`

Where:
- \`a\`, \`b\`, and \`c\` are constants
- \`a ≠ 0\` (if a = 0, it becomes linear)
- \`x\` is the variable

## Key Characteristics
- The graph is a parabola
- Can have 0, 1, or 2 real solutions
- The highest power of the variable is 2

Learn more about [quadratic equations](https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratics-multiplying-factoring) on Khan Academy.`
        }
      ]
    },
    {
      id: 'geometry-basics',
      title: 'Basic Geometry',
      description: 'Fundamental concepts of shapes, angles, and spatial relationships',
      estimatedTime: 40,
      completed: false,
      progress: 0,
      content: [
        {
          id: 'geometry-intro',
          type: 'text',
          title: 'Introduction to Geometry',
          content: `# Basic Geometry

Geometry is the branch of mathematics concerned with **shapes, sizes, properties of figures**, and the relationships between different geometric objects.

## Fundamental Concepts

### Points, Lines, and Planes
- **Point:** A location with no dimension (represented by a dot)
- **Line:** Extends infinitely in both directions
- **Plane:** A flat surface extending infinitely in all directions

### Basic Shapes
- **Triangle:** 3 sides, 3 angles
- **Square:** 4 equal sides, 4 right angles  
- **Rectangle:** 4 sides, opposite sides equal, 4 right angles
- **Circle:** All points equidistant from center

### Angle Types
- **Acute:** Less than 90°
- **Right:** Exactly 90°
- **Obtuse:** Between 90° and 180°
- **Straight:** Exactly 180°`
        },
        {
          id: 'geometry-shapes',
          type: 'image',
          title: 'Geometric Shapes and Figures',
          content: 'https://images.unsplash.com/photo-1545841729-10c1118027a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyeSUyMHNoYXBlcyUyMG1hdGhlbWF0aWNhbHxlbnwxfHx8fDE3NTY3NDYzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
          metadata: {
            alt: 'Colorful geometric shapes and mathematical figures',
            caption: 'Various geometric shapes demonstrating basic geometry principles - Click to explore interactive geometry tools',
            clickUrl: 'https://www.geogebra.org/geometry'
          }
        },
        {
          id: 'geometry-quiz',
          type: 'quiz',
          title: 'Geometry Basics Quiz',
          content: JSON.stringify({
            questions: [
              {
                question: "How many degrees are in the angles of a triangle?",
                options: ["90°", "180°", "270°", "360°"],
                correct: 1,
                explanation: "The sum of angles in any triangle is always 180°"
              },
              {
                question: "What type of angle measures exactly 90°?",
                options: ["Acute", "Right", "Obtuse", "Straight"],
                correct: 1,
                explanation: "A right angle measures exactly 90°, forming a perfect corner"
              },
              {
                question: "How many sides does a pentagon have?",
                options: ["4", "5", "6", "8"],
                correct: 1,
                explanation: "A pentagon has 5 sides (penta = five in Greek)"
              }
            ]
          })
        }
      ]
    }
  ];

  const physicsChapters: StudyChapter[] = [
    {
      id: 'motion',
      title: 'Motion in One Dimension',
      description: 'Understanding displacement, velocity, and acceleration',
      estimatedTime: 50,
      completed: false,
      progress: 0,
      content: [
        {
          id: 'motion-intro',
          type: 'text',
          title: 'Basic Concepts of Motion',
          content: `# Motion in One Dimension

Motion is the change in position of an object with respect to time.

## Key Terms

### Displacement (s)
- Change in position
- Vector quantity (has direction)
- Unit: meters (m)

### Velocity (v)
- Rate of change of displacement
- Vector quantity
- Unit: meters per second (m/s)

### Acceleration (a)
- Rate of change of velocity
- Vector quantity  
- Unit: meters per second squared (m/s²)`
        },
        {
          id: 'motion-graph',
          type: 'image',
          title: 'Motion Graphs and Diagrams',
          content: 'https://images.unsplash.com/photo-1673825495120-76de8651ff0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwbW90aW9uJTIwZGlhZ3JhbSUyMGdyYXBofGVufDF8fHx8MTc1Njc0NjI0NXww&ixlib=rb-4.1.0&q=80&w=1080',
          metadata: {
            alt: 'Physics motion graphs and diagrams',
            caption: 'Position vs Time and Velocity vs Time graphs - Click to explore interactive physics simulations',
            clickUrl: 'https://phet.colorado.edu/en/simulation/moving-man'
          }
        },
        {
          id: 'physics-video',
          type: 'video',
          title: 'Motion in Physics - Educational Video',
          content: 'tIc6x8VlPn0',
          metadata: {
            duration: '12:35',
            description: 'Comprehensive explanation of motion concepts with real-world examples'
          }
        },
        {
          id: 'motion-quiz',
          type: 'quiz',
          title: 'Motion Concepts Quiz',
          content: JSON.stringify({
            questions: [
              {
                question: "A car moves 100m north, then 50m south. What is its displacement?",
                options: ["150m", "50m north", "100m", "50m south"],
                correct: 1,
                explanation: "Displacement is the net change in position: 100m north - 50m south = 50m north"
              },
              {
                question: "If velocity is constant, what can we say about acceleration?",
                options: ["It is positive", "It is negative", "It is zero", "It varies"],
                correct: 2,
                explanation: "When velocity is constant, there is no change in velocity, so acceleration = 0"
              },
              {
                question: "What is the SI unit of velocity?",
                options: ["m/s²", "m/s", "m", "km/h"],
                correct: 1,
                explanation: "Velocity is measured in meters per second (m/s) in the SI system"
              }
            ]
          })
        },
        {
          id: 'motion-formulas',
          type: 'formula',
          title: 'Essential Motion Equations',
          content: `## Kinematic Equations

### Basic Definitions
- **Displacement:** \`s = s_f - s_i\`
- **Average Velocity:** \`v_{avg} = Δs/Δt\`
- **Average Acceleration:** \`a_{avg} = Δv/Δt\`

### Kinematic Equations (constant acceleration)
1. \`v = v_0 + at\`
2. \`s = v_0t + ½at²\`
3. \`v² = v_0² + 2as\`
4. \`s = ½(v_0 + v)t\`

### Special Cases
- **Free Fall:** \`a = g = 9.8 m/s²\` (downward)
- **At rest:** \`v_0 = 0\`
- **From rest to stop:** \`v = 0\``
        }
      ]
    }
  ];

  if (subjectId === 'mathematics' && topicId === 'algebra') {
    return mathAlgebraChapters;
  }
  if (subjectId === 'physics' && topicId === 'mechanics') {
    return physicsChapters;
  }
  
  return mathAlgebraChapters; 
};

export default function StudyPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject as string;
  const topicId = params.topic as string;
  
  const [chapters] = useState<StudyChapter[]>(() => getStudyData(subjectId, topicId));
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
//   const [studyNotes, setStudyNotes] = useState<StudyNote[]>([]);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChapterList, setShowChapterList] = useState(false);
  const [completedContent, setCompletedContent] = useState<Set<string>>(new Set());
  const [quizStates, setQuizStates] = useState<QuizStates>({});

  const currentChapter = chapters[currentChapterIndex];
  const currentContent = currentChapter?.content[currentContentIndex];
  const totalContent = chapters.reduce((sum, chapter) => sum + chapter.content.length, 0);
  const completedCount = completedContent.size;
  const overallProgress = totalContent > 0 ? (completedCount / totalContent) * 100 : 0;

  const markContentComplete = (contentId: string) => {
    setCompletedContent(prev => new Set([...prev, contentId]));
    toast.success('Content marked as complete!');
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !currentContent) return;

    // const note: StudyNote = {
    //   id: Date.now().toString(),
    //   chapterId: currentChapter.id,
    //   contentId: currentContent.id,
    //   note: newNote,
    //   timestamp: new Date()
    // };

    // setStudyNotes(prev => [note, ...prev]);
    setNewNote('');
    setIsNoteDialogOpen(false);
    toast.success('Note added successfully!');
  };

  const handleNextContent = () => {
    if (currentContentIndex < currentChapter.content.length - 1) {
      setCurrentContentIndex(prev => prev + 1);
    } else if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      setCurrentContentIndex(0);
    }
  };

  const handlePrevContent = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(prev => prev - 1);
    } else if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      const prevChapter = chapters[currentChapterIndex - 1];
      setCurrentContentIndex(prevChapter.content.length - 1);
    }
  };

  const handleNotesSelect = () => {
    router.push(`/subjects/${subjectId}/notes`);
  };

  const handleBack = () => {
    router.push(`/subjects/${subjectId}`);
  };

  const renderContent = (content: StudyContent) => {
    switch (content.type) {
      case 'text':
        return (
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ 
              __html: content.content
                .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-medium mb-4 text-foreground">$1</h1>')
                .replace(/^## (.*$)/gm, '<h2 class="text-xl font-medium mb-3 mt-6 text-foreground">$2</h2>')
                .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mb-2 mt-4 text-foreground">$3</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-foreground">$1</strong>')
                .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="text-muted-foreground">$1</em>')
                .replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono border">$1</code>')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1 <span class="inline-block ml-1 text-xs">↗</span></a>')
                .replace(/\n\n/g, '</p><p class="mb-3 text-foreground leading-relaxed">')
                .replace(/^(?!<[h|p|u|o|c])/gm, '<p class="mb-3 text-foreground leading-relaxed">')
                .replace(/\n- /g, '</p><ul class="list-disc pl-6 mb-3 text-foreground"><li class="mb-1">')
                .replace(/\n(\d+)\. /g, '</p><ol class="list-decimal pl-6 mb-3 text-foreground"><li class="mb-1">')
                .replace(/<\/li>(?=\n|$)/g, '</li></ul>')
                .replace(/<\/li><\/ul><ul[^>]*><li/g, '</li><li>')
            }} 
            />
          </div>
        );

      case 'table':
        const tableHtml = content.content
          .split('\n')
          .filter(line => line.trim())
          .map((line, index) => {
            const cells = line.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
            if (index === 0) {
              return `<tr class="border-b">${cells.map(cell => `<th class="text-left p-3 font-medium">${cell}</th>`).join('')}</tr>`;
            } else if (index === 1) {
              return '';
            } else {
              return `<tr class="border-b">${cells.map(cell => `<td class="p-3">${cell}</td>`).join('')}</tr>`;
            }
          })
          .filter(row => row)
          .join('');

        return (
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg">
              <tbody dangerouslySetInnerHTML={{ __html: tableHtml }} />
            </table>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div className="relative group cursor-pointer" onClick={() => {
              if (content.metadata?.clickUrl) {
                window.open(content.metadata.clickUrl, '_blank');
                toast.info('Opening external resource...');
              }
            }}>
              <Image
                width={800}
                height={450}
                src={content.content}
                alt={content.metadata?.alt || content.title || 'Study material'}
                className="w-full h-auto rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
              />
              {content.metadata?.clickUrl && (
                <div className="absolute top-2 right-2 bg-background/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-4 w-4" />
                </div>
              )}
            </div>
            {content.metadata?.caption && (
              <p className="text-sm text-muted-foreground text-center italic">
                {content.metadata.caption}
                {content.metadata?.clickUrl && (
                  <span className="ml-2 text-primary">Click to learn more →</span>
                )}
              </p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${content.content}`}
                title={content.title || 'Video Tutorial'}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                {content.metadata?.description && (
                  <p className="text-sm text-muted-foreground">{content.metadata.description}</p>
                )}
              </div>
              {content.metadata?.duration && (
                <Badge variant="secondary">
                  <Clock className="mr-1 h-3 w-3" />
                  {content.metadata.duration}
                </Badge>
              )}
            </div>
          </div>
        );

      case 'quiz':
        const quizData = JSON.parse(content.content) as QuizData;
        const currentQuizState = quizStates[content.id] || { selectedAnswers: {}, showResults: {} };
        const { selectedAnswers, showResults } = currentQuizState;
        
        const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
          const newSelectedAnswers = {
            ...selectedAnswers,
            [questionIndex]: optionIndex
          };
          
          const newShowResults = {
            ...showResults,
            [questionIndex]: true
          };
          
          setQuizStates(prev => ({
            ...prev,
            [content.id]: {
              selectedAnswers: newSelectedAnswers,
              showResults: newShowResults
            }
          }));
          
          const question = quizData.questions[questionIndex];
          if (optionIndex === question.correct) {
            toast.success(`Correct! ${question.explanation}`);
          } else {
            toast.error(`Incorrect. ${question.explanation}`);
          }
        };

        const resetQuiz = () => {
          setQuizStates(prev => ({
            ...prev,
            [content.id]: { selectedAnswers: {}, showResults: {} }
          }));
          toast.info('Quiz reset! Try again.');
        };

        const correctCount = Object.keys(selectedAnswers).filter(key => 
          selectedAnswers[parseInt(key)] === quizData.questions[parseInt(key)].correct
        ).length;
        
        const totalAnswered = Object.keys(selectedAnswers).length;
        const totalQuestions = quizData.questions.length;
        const isCompleted = totalAnswered === totalQuestions;

        return (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Interactive Quiz</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  {isCompleted && (
                    <Badge variant={correctCount === totalQuestions ? "default" : "secondary"}>
                      Score: {correctCount}/{totalQuestions}
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" onClick={resetQuiz}>
                    Reset Quiz
                  </Button>
                </div>
              </div>
              {isCompleted && (
                <div className="mt-2">
                  <Progress value={(correctCount / totalQuestions) * 100} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {correctCount === totalQuestions 
                      ? "Perfect score! 🎉" 
                      : `You got ${correctCount} out of ${totalQuestions} correct.`
                    }
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {quizData.questions.map((q: QuizQuestion, index: number) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-medium">{index + 1}. {q.question}</h4>
                    <div className="space-y-2">
                      {q.options.map((option: string, optIndex: number) => {
                        const isSelected = selectedAnswers[index] === optIndex;
                        const isCorrect = optIndex === q.correct;
                        const showResult = showResults[index];
                        
                        let buttonVariant: "outline" | "default" | "destructive" | "secondary" = "outline";
                        let buttonClass = "w-full justify-start text-left h-auto p-3";
                        
                        if (showResult && isSelected) {
                          if (isCorrect) {
                            buttonVariant = "default";
                            buttonClass += " bg-green-100 border-green-300 text-green-800 hover:bg-green-200";
                          } else {
                            buttonVariant = "destructive";
                            buttonClass += " bg-red-100 border-red-300 text-red-800 hover:bg-red-200";
                          }
                        } else if (showResult && isCorrect) {
                          buttonClass += " bg-green-50 border-green-200 text-green-700";
                        }
                        
                        return (
                          <Button
                            key={optIndex}
                            variant={buttonVariant}
                            className={buttonClass}
                            onClick={() => !showResults[index] && handleAnswerSelect(index, optIndex)}
                            disabled={showResults[index]}
                          >
                            <span className="mr-3 font-medium">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            {option}
                            {showResult && isCorrect && (
                              <CheckCircle2 className="ml-auto h-4 w-4 text-green-600" />
                            )}
                          </Button>
                        );
                      })}
                    </div>
                    {showResults[index] && (
                      <div className="mt-2 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case 'formula':
        return (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg text-blue-900">Key Formulas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-blue-900">
                <div dangerouslySetInnerHTML={{ 
                  __html: content.content
                    .replace(/^# (.*$)/gm, '<h3 class="text-lg font-medium mb-3">$1</h3>')
                    .replace(/^## (.*$)/gm, '<h4 class="text-base font-medium mb-2 mt-4">$2</h4>')
                    .replace(/^### (.*$)/gm, '<h5 class="text-sm font-medium mb-2 mt-3">$3</h5>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/`(.*?)`/g, '<code class="bg-blue-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
                    .replace(/\n\n/g, '</p><p class="mb-2">')
                    .replace(/^(?!<[h|p|u|o|c])/gm, '<p class="mb-2">')
                    .replace(/\n- /g, '</p><ul class="list-disc pl-4 mb-2"><li>')
                    .replace(/\n(\d+)\. /g, '</p><ol class="list-decimal pl-4 mb-2"><li>')
                }} 
                />
              </div>
            </CardContent>
          </Card>
        );

      default:
        return <div>Unsupported content type</div>;
    }
  };

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${showChapterList ? 'w-80' : 'w-16'} transition-all duration-300 border-r bg-card`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
                {showChapterList && <span className="ml-2">Back</span>}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowChapterList(!showChapterList)}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {showChapterList && (
              <>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search chapters..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
                    <Progress value={overallProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {completedCount} of {totalContent} completed
                    </p>
                  </div>

                  <Separator />

                  <ScrollArea className="h-[calc(100vh-300px)]">
                    {filteredChapters.map((chapter, index) => (
                      <Button
                        key={chapter.id}
                        variant={currentChapterIndex === index ? "secondary" : "ghost"}
                        className="w-full justify-start mb-2 h-auto p-3"
                        onClick={() => {
                          setCurrentChapterIndex(index);
                          setCurrentContentIndex(0);
                        }}
                      >
                        <div className="flex items-start space-x-3 text-left">
                          <div className="flex-shrink-0 mt-1">
                            {chapter.completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{chapter.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{chapter.description}</p>
                            <div className="flex items-center mt-2 space-x-2">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{chapter.estimatedTime} min</span>
                            </div>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </ScrollArea>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="border-b bg-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-medium">{currentChapter?.title}</h1>
                <p className="text-muted-foreground">{currentChapter?.description}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleNotesSelect}>
                  <NotebookPen className="mr-2 h-4 w-4" />
                  My Notes
                </Button>
                
                <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Bookmark className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Study Note</DialogTitle>
                      <DialogDescription>
                        Add a note about this content section for future reference.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="note">Note</Label>
                        <Textarea
                          id="note"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Enter your note here..."
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddNote}>
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Content {currentContentIndex + 1} of {currentChapter?.content.length}</span>
                <span>{Math.round(((currentContentIndex + 1) / currentChapter?.content.length) * 100)}% complete</span>
              </div>
              <Progress value={((currentContentIndex + 1) / currentChapter?.content.length) * 100} className="h-2" />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            {currentContent && (
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    {currentContent.title && (
                      <h2 className="text-xl font-medium">{currentContent.title}</h2>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="capitalize">
                        {currentContent.type}
                      </Badge>
                      
                      {!completedContent.has(currentContent.id) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markContentComplete(currentContent.id)}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Complete
                        </Button>
                      )}
                      
                      {completedContent.has(currentContent.id) && (
                        <Badge variant="secondary" className="text-green-700 bg-green-100">
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <Separator className="mb-6" />
                </div>

                {/* Render content based on type */}
                <div className="mb-8">
                  {renderContent(currentContent)}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevContent}
                    disabled={currentChapterIndex === 0 && currentContentIndex === 0}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      Chapter {currentChapterIndex + 1} of {chapters.length}
                    </span>
                  </div>

                  <Button
                    onClick={handleNextContent}
                    disabled={
                      currentChapterIndex === chapters.length - 1 &&
                      currentContentIndex === currentChapter?.content.length - 1
                    }
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}