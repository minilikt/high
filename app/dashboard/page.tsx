"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Target, TrendingUp, BarChart3, NotebookPen } from "lucide-react";
import { redirect } from "next/navigation";

interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  totalQuestions: number;
  completedQuestions: number;
}

const subjects: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    description: "Algebra, Geometry, Trigonometry, Calculus",
    icon: "📐",
    totalQuestions: 500,
    completedQuestions: 120
  },
  {
    id: "physics",
    name: "Physics", 
    description: "Mechanics, Thermodynamics, Electromagnetism",
    icon: "⚛️",
    totalQuestions: 400,
    completedQuestions: 80
  },
  {
    id: "chemistry",
    name: "Chemistry",
    description: "Organic, Inorganic, Physical Chemistry",
    icon: "🧪",
    totalQuestions: 350,
    completedQuestions: 90
  },
  {
    id: "biology",
    name: "Biology",
    description: "Cell Biology, Genetics, Ecology, Human Biology",
    icon: "🧬",
    totalQuestions: 400,
    completedQuestions: 60
  },
  {
    id: "english",
    name: "English",
    description: "Grammar, Reading Comprehension, Vocabulary",
    icon: "📚",
    totalQuestions: 300,
    completedQuestions: 150
  },
  {
    id: "aptitude",
    name: "Aptitude",
    description: "Logical Reasoning, Quantitative Aptitude",
    icon: "🧠",
    totalQuestions: 250,
    completedQuestions: 45
  }
];


export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="mb-2">Ethiopian Grade 12 Entrance Exam Prep</h1>
              <p className="text-muted-foreground">
                Prepare for your university entrance exams with comprehensive mock tests and practice questions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={() => redirect('/dashboard')} variant="outline" className="flex items-center space-x-2">
                <NotebookPen className="h-4 w-4" />
                <span>Notes & Saved</span>
              </Button>
              <Button onClick={() => redirect('/analytics')} variant="outline" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Questions Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subjects.reduce((sum, subject) => sum + subject.completedQuestions, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {subjects.reduce((sum, subject) => sum + subject.totalQuestions, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  subjects.reduce((sum, subject) => 
                    sum + (subject.completedQuestions / subject.totalQuestions) * 100, 0
                  ) / subjects.length
                )}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const progress = (subject.completedQuestions / subject.totalQuestions) * 100;
            
            return (
              <Card key={subject.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{subject.icon}</span>
                      <CardTitle>{subject.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{subject.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{subject.completedQuestions}/{subject.totalQuestions}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1" 
                        onClick={() => redirect(`/study-interface?subjectId=${subject.id}`)}
                      >
                        Start Practice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}