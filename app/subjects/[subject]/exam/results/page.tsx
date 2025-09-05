"use client";
import { useSearchParams, useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, Award, Home } from "lucide-react";

export default function ExamResultsPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subject as string;
  
  const score = parseInt(searchParams.get('score') || '0');
  const totalQuestions = parseInt(searchParams.get('total') || '0');
  const timeSpent = parseInt(searchParams.get('time') || '0');
  
  const correctAnswers = Math.round((score / 100) * totalQuestions);
  const incorrectAnswers = totalQuestions - correctAnswers;
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const getPerformanceMessage = () => {
    if (score >= 90) return "Excellent! You've mastered this material!";
    if (score >= 80) return "Great job! You have a strong understanding.";
    if (score >= 70) return "Good work! You're on the right track.";
    if (score >= 60) return "Not bad! With a bit more practice, you'll improve.";
    return "Keep studying! You'll get better with more practice.";
  };

  return (
    <div className="min-h-screen bg-background p-6 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Exam Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Award className="h-12 w-12 text-primary" />
            </div>
            <div className="text-4xl font-bold">{score}%</div>
            <p className="text-muted-foreground">{getPerformanceMessage()}</p>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <Progress value={score} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
                  <div className="text-2xl font-bold">{correctAnswers}</div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto" />
                  <div className="text-2xl font-bold">{incorrectAnswers}</div>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Time spent */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <Clock className="h-8 w-8 text-blue-600 mx-auto" />
                <div className="text-xl font-bold">{formatTime(timeSpent)}</div>
                <p className="text-sm text-muted-foreground">Time Spent</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push(`/subjects/${subjectId}`)}
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Subject
            </Button>
            <Button 
              className="flex-1"
              onClick={() => router.push(`/subjects/${subjectId}/exam/mock/2024`)}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}