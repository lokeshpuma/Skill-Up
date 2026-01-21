'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
  rating: number
  learners: number
  duration: string
  level: string
  isFree: boolean
  instructor: string
  lessons: number
  videoUrl: string
  quizQuestions: QuizQuestion[]
}

export default function CourseDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [videoCompleted, setVideoCompleted] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [quizScore, setQuizScore] = useState(0)
  const [courseCompleted, setCourseCompleted] = useState(false)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    // Mock course data - in real app, fetch from API
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Generative AI for Beginners',
        description: 'Learn the fundamentals of generative AI, including GPT models, DALL-E, and prompt engineering techniques. This comprehensive course covers everything from basic concepts to advanced applications.',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
        category: 'generative-ai',
        rating: 4.5,
        learners: 70234,
        duration: '4 hours',
        level: 'Beginner',
        isFree: true,
        instructor: 'Dr. Sarah Chen',
        lessons: 12,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        quizQuestions: [
          {
            id: 'q1',
            question: 'What is Generative AI?',
            options: [
              'AI that creates new content',
              'AI that only analyzes data',
              'AI that controls robots',
              'AI that plays games'
            ],
            correctAnswer: 0
          },
          {
            id: 'q2',
            question: 'What does GPT stand for?',
            options: [
              'General Purpose Technology',
              'Generative Pre-trained Transformer',
              'Global Processing Tool',
              'Guided Performance Test'
            ],
            correctAnswer: 1
          },
          {
            id: 'q3',
            question: 'What is prompt engineering?',
            options: [
              'Building AI hardware',
              'Designing effective inputs for AI',
              'Programming AI models',
              'Testing AI systems'
            ],
            correctAnswer: 1
          },
          {
            id: 'q4',
            question: 'Which of these is a generative AI model?',
            options: [
              'MySQL',
              'DALL-E',
              'Apache',
              'Linux'
            ],
            correctAnswer: 1
          },
          {
            id: 'q5',
            question: 'What is a key benefit of generative AI?',
            options: [
              'It requires no training',
              'It can create original content',
              'It works without data',
              'It never makes mistakes'
            ],
            correctAnswer: 1
          }
        ]
      }
    ]

    const foundCourse = mockCourses.find(c => c.id === courseId)
    setCourse(foundCourse || null)
    setLoading(false)

    // Check if user is enrolled (in real app, this would come from backend)
    if (user) {
      setEnrolled(true)
    }
  }, [courseId, user])

  const handleEnroll = () => {
    if (!user) {
      router.push('/login')
      return
    }
    setEnrolled(true)
  }

  const handleVideoEnd = () => {
    setVideoCompleted(true)
  }

  const handleMarkComplete = () => {
    setVideoCompleted(true)
  }

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setQuizSubmitted(false)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (course?.quizQuestions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmitQuiz = () => {
    if (!course) return

    let correctAnswers = 0
    course.quizQuestions.forEach((question) => {
      if (answers[question.id] === question.options[question.correctAnswer]) {
        correctAnswers++
      }
    })

    const score = Math.round((correctAnswers / course.quizQuestions.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)

    // Pass if score is 60% or higher
    if (score >= 60) {
      setCourseCompleted(true)
    }
  }

  const handleDownloadCertificate = () => {
    // Generate a simple certificate (in real app, this would be a proper PDF)
    const certificateContent = `
Certificate of Completion

This is to certify that ${user?.name || 'Student'} has successfully completed
the course: ${course?.title}

Score: ${quizScore}%
Date: ${new Date().toLocaleDateString()}

Instructor: ${course?.instructor}
Duration: ${course?.duration}
    `

    const blob = new Blob([certificateContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${course?.title.replace(/\s+/g, '_')}_Certificate.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: course?.title,
        text: `Check out this course: ${course?.title}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Course link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading course...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Course Not Found</h1>
          <Button onClick={() => router.push('/')} className="bg-purple-600 hover:bg-purple-700">
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = course.quizQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / course.quizQuestions.length) * 100

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Course Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-purple-600 text-white">{course.category}</Badge>
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {course.level}
                </Badge>
                {course.isFree && (
                  <Badge className="bg-green-600 text-white">FREE</Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-3">{course.title}</h1>
              
              <p className="text-gray-300 mb-4">{course.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{course.learners.toLocaleString()} learners</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.lessons} lessons</span>
                </div>
              </div>
            </div>
            
            <div className="lg:w-64">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Instructor</p>
                <p className="text-white font-medium mb-4">{course.instructor}</p>
                
                {!enrolled ? (
                  <Button 
                    onClick={handleEnroll}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Enroll Now
                  </Button>
                ) : courseCompleted ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <p className="text-green-400 font-medium mb-3">Completed!</p>
                    <Button 
                      onClick={handleDownloadCertificate}
                      variant="outline"
                      className="w-full border-green-600 text-green-400 hover:bg-green-900/20"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Certificate
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    className="w-full border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Course
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-0">
              <div className="aspect-video">
                <iframe
                  src={course.videoUrl}
                  title={course.title}
                  className="w-full h-full"
                  allowFullScreen
                  onEnded={handleVideoEnd}
                />
              </div>
            </CardContent>
          </Card>
          
          {enrolled && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={handleMarkComplete}
                disabled={videoCompleted}
                className={`${
                  videoCompleted 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-purple-600 hover:bg-purple-700'
                } text-white`}
              >
                {videoCompleted ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Marked as Complete
                  </>
                ) : (
                  'Mark as Complete'
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Quiz Section */}
        {enrolled && (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-400" />
                Course Quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!quizStarted ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <Award className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Test Your Knowledge
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Take this quiz to test your understanding of the course material.
                      You need 60% or higher to pass.
                    </p>
                  </div>
                  <Button
                    onClick={handleStartQuiz}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!videoCompleted}
                  >
                    Start Quiz
                  </Button>
                  {!videoCompleted && (
                    <p className="text-sm text-gray-500 mt-3">
                      Complete the video first to unlock the quiz
                    </p>
                  )}
                </div>
              ) : !quizSubmitted ? (
                <div>
                  {/* Quiz Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Question {currentQuestionIndex + 1} of {course.quizQuestions.length}</span>
                      <span>{Math.round(progress)}% Complete</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Question */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      {currentQuestion.question}
                    </h3>
                    
                    <RadioGroup
                      value={answers[currentQuestion.id] || ''}
                      onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    >
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label 
                            htmlFor={`option-${index}`} 
                            className="text-gray-300 cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={handlePreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      Previous
                    </Button>
                    
                    {currentQuestionIndex === course.quizQuestions.length - 1 ? (
                      <Button
                        onClick={handleSubmitQuiz}
                        disabled={!answers[currentQuestion.id]}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Submit Quiz
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextQuestion}
                        disabled={!answers[currentQuestion.id]}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Results */
                <div className="text-center py-8">
                  {courseCompleted ? (
                    <>
                      <div className="mb-6">
                        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          🎉 Congratulations!
                        </h3>
                        <p className="text-gray-300 mb-2">
                          You have successfully completed the course!
                        </p>
                        <p className="text-4xl font-bold text-green-400 mb-2">
                          {quizScore}%
                        </p>
                        <p className="text-gray-400">
                          Great job! You've mastered the material.
                        </p>
                      </div>
                      
                      <div className="flex gap-4 justify-center">
                        <Button
                          onClick={handleDownloadCertificate}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Certificate
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => router.push('/')}
                          className="border-gray-600 text-white hover:bg-gray-800"
                        >
                          Browse More Courses
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-6">
                        <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl text-white">😔</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Keep Trying!
                        </h3>
                        <p className="text-4xl font-bold text-red-400 mb-2">
                          {quizScore}%
                        </p>
                        <p className="text-gray-400 mb-4">
                          You need 60% or higher to pass. Review the material and try again.
                        </p>
                      </div>
                      
                      <Button
                        onClick={handleStartQuiz}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Retake Quiz
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}