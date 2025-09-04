"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, TrendingUp, TrendingDown, Target, Clock, BarChart3, Calendar, Trophy, Brain, AlertTriangle, CheckCircle2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { redirect } from "next/navigation";



// Mock analytics data - in a real app, this would come from a database
const mockAnalyticsData = {
  overallStats: {
    totalExams: 23,
    totalQuestions: 1450,
    correctAnswers: 1089,
    averageScore: 75.1,
    totalStudyTime: 47.5, // hours
    streak: 12, // days
    improvement: 8.5 // percentage increase from last month
  },
  subjectPerformance: [
    { subject: "English", score: 91.2, questionsAttempted: 320, correct: 292, color: "#8b5cf6" },
    { subject: "Mathematics", score: 78.5, questionsAttempted: 280, correct: 220, color: "#06b6d4" },
    { subject: "Physics", score: 72.3, questionsAttempted: 250, correct: 181, color: "#10b981" },
    { subject: "Chemistry", score: 69.8, questionsAttempted: 240, correct: 167, color: "#f59e0b" },
    { subject: "Biology", score: 74.6, questionsAttempted: 230, correct: 172, color: "#ef4444" },
    { subject: "Aptitude", score: 64.2, questionsAttempted: 130, correct: 83, color: "#8b5cf6" }
  ],
  performanceTrend: [
    { week: "Week 1", score: 62, exams: 2 },
    { week: "Week 2", score: 68, exams: 3 },
    { week: "Week 3", score: 71, exams: 4 },
    { week: "Week 4", score: 69, exams: 3 },
    { week: "Week 5", score: 74, exams: 4 },
    { week: "Week 6", score: 78, exams: 3 },
    { week: "Week 7", score: 75, exams: 4 },
    { week: "Week 8", score: 81, exams: 2 }
  ],
  timeDistribution: [
    { subject: "Mathematics", hours: 12.5, percentage: 26.3 },
    { subject: "Physics", hours: 9.8, percentage: 20.6 },
    { subject: "Chemistry", hours: 8.2, percentage: 17.3 },
    { subject: "English", hours: 7.1, percentage: 14.9 },
    { subject: "Biology", hours: 6.4, percentage: 13.5 },
    { subject: "Aptitude", hours: 3.5, percentage: 7.4 }
  ],
  difficultyAnalysis: [
    { difficulty: "Easy", correct: 45, total: 50, percentage: 90 },
    { difficulty: "Medium", correct: 38, total: 50, percentage: 76 },
    { difficulty: "Hard", correct: 22, total: 40, percentage: 55 }
  ],
  topicStrengths: [
    { topic: "Grammar", subject: "English", score: 95, trend: "up" },
    { topic: "Algebra", subject: "Mathematics", score: 89, trend: "up" },
    { topic: "Mechanics", subject: "Physics", score: 82, trend: "stable" },
    { topic: "Cell Biology", subject: "Biology", score: 81, trend: "up" },
    { topic: "Organic Chemistry", subject: "Chemistry", score: 78, trend: "stable" }
  ],
  topicWeaknesses: [
    { topic: "Spatial Reasoning", subject: "Aptitude", score: 45, trend: "down" },
    { topic: "Modern Physics", subject: "Physics", score: 52, trend: "down" },
    { topic: "Physical Chemistry", subject: "Chemistry", score: 58, trend: "stable" },
    { topic: "Calculus", subject: "Mathematics", score: 61, trend: "up" },
    { topic: "Literature", subject: "English", score: 68, trend: "stable" }
  ],
  radarData: [
    { subject: "Speed", score: 78, fullMark: 100 },
    { subject: "Accuracy", score: 85, fullMark: 100 },
    { subject: "Consistency", score: 72, fullMark: 100 },
    { subject: "Problem Solving", score: 81, fullMark: 100 },
    { subject: "Time Management", score: 74, fullMark: 100 },
    { subject: "Concept Understanding", score: 88, fullMark: 100 }
  ]
};

const CHART_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <span className="h-4 w-4 bg-gray-400 rounded-full inline-block" />;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-blue-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
};

export default function Analytics() {
  const { overallStats, subjectPerformance, performanceTrend, timeDistribution, difficultyAnalysis, topicStrengths, topicWeaknesses, radarData } = mockAnalyticsData;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => redirect('/dashboard')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1>Performance Analytics</h1>
          </div>
          <p className="text-muted-foreground">
            Comprehensive insights into your exam preparation progress and performance
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getScoreColor(overallStats.averageScore)}`}>
                {overallStats.averageScore}%
              </div>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">+{overallStats.improvement}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{overallStats.totalStudyTime}h</div>
              <p className="text-xs text-muted-foreground mt-2">
                Across {overallStats.totalExams} exams
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{overallStats.streak}</div>
              <p className="text-xs text-muted-foreground mt-2">
                consecutive days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {Math.round((overallStats.correctAnswers / overallStats.totalQuestions) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {overallStats.correctAnswers}/{overallStats.totalQuestions} questions
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="recommendations">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Radar</CardTitle>
                  <CardDescription>Your performance across different skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" className="text-xs" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} className="text-xs" />
                      <Radar
                        name="Performance"
                        dataKey="score"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Difficulty Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Difficulty</CardTitle>
                  <CardDescription>How you perform across different question difficulties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {difficultyAnalysis.map((item) => (
                      <div key={item.difficulty} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.difficulty}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.correct}/{item.total} ({item.percentage}%)
                          </span>
                        </div>
                        <Progress 
                          value={item.percentage} 
                          className="h-2"
                          // style={{
                          //   '--progress-foreground': item.difficulty === 'Easy' ? '#10b981' : 
                          //     item.difficulty === 'Medium' ? '#f59e0b' : '#ef4444'
                          // }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Study Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Study Time Distribution</CardTitle>
                <CardDescription>How you allocate time across subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={timeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ subject, percentage }) => `${subject} (${percentage}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="hours"
                    >
                      {timeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}h`, 'Study Time']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            {/* Subject Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance Comparison</CardTitle>
                <CardDescription>Your performance across all subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={subjectPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'score' ? `${value}%` : value,
                        name === 'score' ? 'Score' : 'Questions Attempted'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="score" name="score" fill="#8b5cf6" />
                    <Bar dataKey="questionsAttempted" name="questionsAttempted" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subject Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectPerformance.map((subject) => {
                const accuracy = Math.round((subject.correct / subject.questionsAttempted) * 100);
                return (
                  <Card key={subject.subject}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{subject.subject}</CardTitle>
                        <Badge 
                          variant={subject.score >= 80 ? "default" : subject.score >= 60 ? "secondary" : "destructive"}
                        >
                          {subject.score}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Questions Attempted:</span>
                          <span className="font-medium">{subject.questionsAttempted}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Correct Answers:</span>
                          <span className="font-medium">{subject.correct}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Accuracy:</span>
                          <span className={`font-medium ${getScoreColor(accuracy)}`}>{accuracy}%</span>
                        </div>
                        <Progress value={subject.score} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Performance Trend Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>Your score progression over the last 8 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'score' ? `${value}%` : value,
                        name === 'score' ? 'Average Score' : 'Exams Taken'
                      ]}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                      name="score"
                    />
                    <Bar dataKey="exams" fill="#06b6d4" name="exams" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Score:</span>
                      <span className="font-medium text-purple-600">81%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Exams Taken:</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Study Hours:</span>
                      <span className="font-medium">8.5h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Last Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Score:</span>
                      <span className="font-medium text-blue-600">75%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Exams Taken:</span>
                      <span className="font-medium">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Study Hours:</span>
                      <span className="font-medium">12.2h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Score Change:</span>
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="font-medium text-green-600">+6%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Consistency:</span>
                      <Badge variant="secondary">Improving</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Focus:</span>
                      <Badge variant="default">Strong</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="strengths" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span>Top Strengths</span>
                  </CardTitle>
                  <CardDescription>Topics where you excel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topicStrengths.map((topic, index) => (
                      <div key={topic.topic} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                            <span className="text-sm font-medium text-green-800">#{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-green-900">{topic.topic}</p>
                            <p className="text-sm text-green-700">{topic.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(topic.trend)}
                          <span className="font-medium text-green-800">{topic.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Areas for Improvement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Areas for Improvement</span>
                  </CardTitle>
                  <CardDescription>Topics that need more attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topicWeaknesses.map((topic) => (
                      <div key={topic.topic} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-red-900">{topic.topic}</p>
                            <p className="text-sm text-red-700">{topic.subject}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(topic.trend)}
                          <span className="font-medium text-red-800">{topic.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Study Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    <span>Study Recommendations</span>
                  </CardTitle>
                  <CardDescription>Personalized suggestions to improve your performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2">Focus on Weak Areas</h4>
                      <p className="text-sm text-blue-800 mb-3">
                        Your lowest performing topics are Spatial Reasoning (45%) and Modern Physics (52%). 
                        Dedicate 30% more time to these areas.
                      </p>
                      <Badge className="bg-blue-100 text-blue-800">High Priority</Badge>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2">Leverage Your Strengths</h4>
                      <p className="text-sm text-green-800 mb-3">
                        You excel in Grammar (95%) and Algebra (89%). Use these as confidence boosters 
                        during study sessions.
                      </p>
                      <Badge className="bg-green-100 text-green-800">Medium Priority</Badge>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-900 mb-2">Improve Time Management</h4>
                      <p className="text-sm text-yellow-800 mb-3">
                        Your average time per question is slightly above optimal. Practice timed sessions 
                        to improve speed while maintaining accuracy.
                      </p>
                      <Badge className="bg-yellow-100 text-yellow-800">Medium Priority</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Goal Tracking */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    <span>Goal Progress</span>
                  </CardTitle>
                  <CardDescription>Track your progress towards your targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Overall Score Target: 85%</span>
                        <span className="text-sm text-muted-foreground">Current: 75.1%</span>
                      </div>
                      <Progress value={75.1} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-1">9.9% to go</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Daily Study Target: 2h</span>
                        <span className="text-sm text-muted-foreground">Average: 1.6h</span>
                      </div>
                      <Progress value={80} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-1">0.4h short daily</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Weekly Exam Target: 3</span>
                        <span className="text-sm text-muted-foreground">This week: 2</span>
                      </div>
                      <Progress value={67} className="h-3" />
                      <p className="text-sm text-muted-foreground mt-1">1 more exam needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Items */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Action Items</CardTitle>
                <CardDescription>Specific steps to improve your performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">This Week</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Complete 2 Spatial Reasoning practice tests</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Review Modern Physics concepts for 3 hours</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Take 1 full-length mock exam</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Next Week</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Focus on Physical Chemistry problems</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Practice Calculus integration techniques</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Improve English Literature analysis skills</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}