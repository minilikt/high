"use client"
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Search, Edit3, Trash2, BookOpen, Save, Star, Clock, Tag, Filter, Download } from "lucide-react";
import { toast } from "sonner";
import { redirect } from 'next/navigation';


interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  topic?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface SavedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  subject: string;
  topic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  savedAt: Date;
  examType: 'mock' | 'practice';
  year?: number;
}

// Mock data - in a real app, this would come from a database/localStorage
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Calculus Integration Techniques',
    content: 'Key integration techniques to remember:\n\n1. Integration by parts: ∫u dv = uv - ∫v du\n2. Substitution method\n3. Partial fractions\n4. Trigonometric substitution\n\nRemember to always check your answer by differentiating!',
    subject: 'Mathematics',
    topic: 'Calculus',
    tags: ['integration', 'formulas', 'important'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '2',
    title: 'Physics - Newton\'s Laws Summary',
    content: 'Newton\'s Three Laws of Motion:\n\n1st Law (Inertia): An object at rest stays at rest, an object in motion stays in motion unless acted upon by an external force.\n\n2nd Law: F = ma (Force equals mass times acceleration)\n\n3rd Law: For every action, there is an equal and opposite reaction.\n\nApplications: Car safety, rocket propulsion, walking',
    subject: 'Physics',
    topic: 'Mechanics',
    tags: ['fundamentals', 'laws', 'motion'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    title: 'English Grammar - Tenses Review',
    content: 'Common tense mistakes to avoid:\n\n• Present Perfect vs Simple Past\n• Future tenses (will vs going to)\n• Past Perfect usage\n\nTip: Pay attention to time markers in sentences to determine the correct tense.',
    subject: 'English',
    topic: 'Grammar',
    tags: ['grammar', 'tenses', 'common-mistakes'],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-18')
  }
];

const mockSavedQuestions: SavedQuestion[] = [
  {
    id: '1',
    question: 'What is the derivative of sin(x²)?',
    options: ['cos(x²)', '2x cos(x²)', 'cos(2x)', '2x sin(x²)'],
    correctAnswer: 1,
    explanation: 'Using the chain rule: d/dx[sin(x²)] = cos(x²) × d/dx[x²] = cos(x²) × 2x = 2x cos(x²)',
    subject: 'Mathematics',
    topic: 'Calculus',
    difficulty: 'medium',
    tags: ['chain-rule', 'derivatives'],
    savedAt: new Date('2024-01-16'),
    examType: 'practice',
  },
  {
    id: '2',
    question: 'Which of the following is a strong acid?',
    options: ['CH₃COOH', 'HCl', 'NH₃', 'H₂O'],
    correctAnswer: 1,
    explanation: 'HCl (Hydrochloric acid) is a strong acid that completely ionizes in water.',
    subject: 'Chemistry',
    topic: 'Acids and Bases',
    difficulty: 'easy',
    tags: ['acids', 'ionization'],
    savedAt: new Date('2024-01-14'),
    examType: 'mock',
    year: 2023
  }
];

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Aptitude'];

export default function NotesAndSaved() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [savedQuestions, setSavedQuestions] = useState<SavedQuestion[]>(mockSavedQuestions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  
  // Form states for new note
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    subject: '',
    topic: '',
    tags: ''
  });

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const filteredQuestions = savedQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.explanation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === 'all' || question.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim() || !newNote.subject) {
      toast.error('Please fill in all required fields');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      subject: newNote.subject,
      topic: newNote.topic || undefined,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', subject: '', topic: '', tags: '' });
    setIsCreateNoteOpen(false);
    toast.success('Note created successfully!');
  };

  const handleUpdateNote = () => {
    if (!editingNote || !newNote.title.trim() || !newNote.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setNotes(prev => prev.map(note => 
      note.id === editingNote.id 
        ? {
            ...note,
            title: newNote.title,
            content: newNote.content,
            subject: newNote.subject,
            topic: newNote.topic || undefined,
            tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            updatedAt: new Date()
          }
        : note
    ));

    setEditingNote(null);
    setNewNote({ title: '', content: '', subject: '', topic: '', tags: '' });
    toast.success('Note updated successfully!');
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    toast.success('Note deleted successfully!');
  };

  const handleDeleteQuestion = (questionId: string) => {
    setSavedQuestions(prev => prev.filter(q => q.id !== questionId));
    toast.success('Question removed from saved list!');
  };

  const startEditNote = (note: Note) => {
    setEditingNote(note);
    setNewNote({
      title: note.title,
      content: note.content,
      subject: note.subject,
      topic: note.topic || '',
      tags: note.tags.join(', ')
    });
  };

  const exportNotes = () => {
    const dataStr = JSON.stringify({ notes, savedQuestions }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exam-prep-notes.json';
    link.click();
    toast.success('Notes exported successfully!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
            <Button variant="ghost" onClick={() => redirect('/dashboard')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
            </Button>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1>Notes & Saved Questions</h1>
                <p className="text-muted-foreground">
                  Organize your study materials and review saved questions
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={exportNotes} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              
              <Dialog open={isCreateNoteOpen || !!editingNote} onOpenChange={() => {
                setIsCreateNoteOpen(false);
                setEditingNote(null);
                setNewNote({ title: '', content: '', subject: '', topic: '', tags: '' });
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsCreateNoteOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    New Note
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</DialogTitle>
                    <DialogDescription>
                      {editingNote ? 'Update your note details below.' : 'Add a new note to your study collection.'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newNote.title}
                        onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter note title..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Select value={newNote.subject} onValueChange={(value) => setNewNote(prev => ({ ...prev, subject: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map(subject => (
                              <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="topic">Topic</Label>
                        <Input
                          id="topic"
                          value={newNote.topic}
                          onChange={(e) => setNewNote(prev => ({ ...prev, topic: e.target.value }))}
                          placeholder="Enter topic..."
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={newNote.tags}
                        onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                        placeholder="Enter tags separated by commas..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={newNote.content}
                        onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Write your note content here..."
                        rows={8}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => {
                        setIsCreateNoteOpen(false);
                        setEditingNote(null);
                        setNewNote({ title: '', content: '', subject: '', topic: '', tags: '' });
                      }}>
                        Cancel
                      </Button>
                      <Button onClick={editingNote ? handleUpdateNote : handleCreateNote}>
                        <Save className="mr-2 h-4 w-4" />
                        {editingNote ? 'Update Note' : 'Create Note'}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search notes and questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="notes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes">
              <BookOpen className="mr-2 h-4 w-4" />
              My Notes ({filteredNotes.length})
            </TabsTrigger>
            <TabsTrigger value="questions">
              <Star className="mr-2 h-4 w-4" />
              Saved Questions ({filteredQuestions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="space-y-6">
            {filteredNotes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notes found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchQuery || selectedSubject !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Create your first note to get started with organizing your study materials.'
                    }
                  </p>
                  <Button onClick={() => setIsCreateNoteOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Note
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => (
                  <Card key={note.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{note.title}</CardTitle>
                          <CardDescription className="flex items-center space-x-2 mt-1">
                            <span>{note.subject}</span>
                            {note.topic && (
                              <>
                                <span>•</span>
                                <span>{note.topic}</span>
                              </>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditNote(note)}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {note.content}
                      </p>
                      
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Tag className="mr-1 h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        <span>Updated {note.updatedAt.toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            {filteredQuestions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Star className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No saved questions</h3>
                  <p className="text-muted-foreground text-center">
                    {searchQuery || selectedSubject !== 'all' 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Save questions during practice sessions to review them later.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <Card key={question.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{question.subject}</Badge>
                            {question.topic && <Badge variant="secondary">{question.topic}</Badge>}
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              {question.examType} {question.year && `(${question.year})`}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg">{question.question}</CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-destructive hover:text-destructive ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-2">
                          {question.options.map((option, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-lg border ${
                                index === question.correctAnswer
                                  ? 'bg-green-50 border-green-200 text-green-800'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <span className="font-medium">{String.fromCharCode(65 + index)}. </span>
                              {option}
                              {index === question.correctAnswer && (
                                <span className="ml-2 text-green-600">✓ Correct</span>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {question.explanation && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-1">Explanation:</h4>
                            <p className="text-blue-800">{question.explanation}</p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center space-x-4">
                            {question.tags.length > 0 && (
                              <div className="flex items-center space-x-1">
                                <Tag className="h-3 w-3" />
                                <span>{question.tags.join(', ')}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            <span>Saved {question.savedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}