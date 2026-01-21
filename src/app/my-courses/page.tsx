'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import CourseCard from '@/components/CourseCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Award, Clock, TrendingUp, Download } from 'lucide-react'

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
  progress?: number
  isCompleted?: boolean
  isEnrolled?: boolean
  instructor?: string
  lessons?: number
  completedAt?: string
  score?: number
}

export default function MyCoursesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [completedCourses, setCompletedCourses] = useState<Course[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    // Mock enrolled courses data
    const mockEnrolledCourses: Course[] = [
      {
        id: '1',
        title: 'Generative AI for Beginners',
        description: 'Learn the fundamentals of generative AI, including GPT models, DALL-E, and prompt engineering techniques.',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
        category: 'generative-ai',
        rating: 4.5,
        learners: 70234,
        duration: '4 hours',
        level: 'Beginner',
        isFree: true,
        instructor: 'Dr. Sarah Chen',
        lessons: 12,
        progress: 75,
        isCompleted: false,
        isEnrolled: true
      },
      {
        id: '2',
        title: 'Advanced Prompt Engineering',
        description: 'Master advanced techniques for crafting effective prompts to get the best results from AI models.',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-4fc8a5a27ee0?w=400&h=225&fit=crop',
        category: 'generative-ai',
        rating: 4.7,
        learners: 45678,
        duration: '6 hours',
        level: 'Intermediate',
        isFree: true,
        instructor: 'Prof. Michael Roberts',
        lessons: 18,
        progress: 30,
        isCompleted: false,
        isEnrolled: true
      },
      {
        id: '3',
        title: 'Cyber Security Fundamentals',
        description: 'Essential cybersecurity concepts, threat detection, and protection strategies for modern systems.',
        thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop',
        category: 'cyber-security',
        rating: 4.6,
        learners: 89456,
        duration: '8 hours',
        level: 'Beginner',
        isFree: true,
        instructor: 'Alex Thompson',
        lessons: 24,
        progress: 100,
        isCompleted: true,
        isEnrolled: true,
        completedAt: '2024-01-15',
        score: 85
      }
    ]

    setEnrolledCourses(mockEnrolledCourses.filter(course => !course.isCompleted))
    setCompletedCourses(mockEnrolledCourses.filter(course => course.isCompleted))
  }, [user, loading, router])

  const handleStartCourse = (courseId: string) => {
    router.push(`/course/${courseId}`)
  }

  const handleDownloadCertificate = (course: Course) => {
    // Generate a simple certificate
    const certificateContent = `
Certificate of Completion

This is to certify that ${user?.name || 'Student'} has successfully completed
the course: ${course.title}

Score: ${course.score}%
Date: ${course.completedAt || new Date().toLocaleDateString()}

Instructor: ${course.instructor}
Duration: ${course.duration}
    `

    const blob = new Blob([certificateContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${course.title.replace(/\s+/g, '_')}_Certificate.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalCourses = enrolledCourses.length + completedCourses.length
  const totalProgress = enrolledCourses.reduce((acc, course) => acc + (course.progress || 0), 0)
  const averageProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0
  const totalHours = completedCourses.reduce((acc, course) => acc + parseInt(course.duration), 0)

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Courses</h1>
          <p className="text-gray-400">
            Track your learning progress and achievements
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalCourses}</div>
              <p className="text-xs text-gray-500">Enrolled courses</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                In Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{enrolledCourses.length}</div>
              <p className="text-xs text-gray-500">Active learning</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Completed
              </CardTitle>
              <Award className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{completedCourses.length}</div>
              <p className="text-xs text-gray-500">Courses finished</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Learning Time
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalHours}h</div>
              <p className="text-xs text-gray-500">Total completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Course Tabs */}
        <Tabs defaultValue="inprogress" className="space-y-6">
          <TabsList className="bg-gray-900 border-gray-800">
            <TabsTrigger 
              value="inprogress" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              In Progress ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Completed ({completedCourses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inprogress" className="space-y-6">
            {enrolledCourses.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-gray-400">
                    Average Progress: {averageProgress}%
                  </p>
                  <div className="text-sm text-gray-500">
                    {enrolledCourses.filter(c => (c.progress || 0) >= 50).length} courses at 50%+ progress
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onStart={handleStartCourse}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No courses in progress</h3>
                <p className="text-gray-400 mb-4">
                  Start learning by enrolling in some courses!
                </p>
                <Button
                  onClick={() => router.push('/')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Browse Courses
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => (
                  <Card key={course.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                    {/* Course Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-600 text-white text-xs font-semibold">
                          COMPLETED
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Award className="h-6 w-6 text-green-400" />
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4 text-green-400" />
                          <span>{course.score}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{course.duration}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 mb-4">
                        Completed on {course.completedAt}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/course/${course.id}`)}
                          className="flex-1 border-gray-600 text-white hover:bg-gray-800"
                        >
                          Review
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadCertificate(course)}
                          className="border-green-600 text-green-400 hover:bg-green-900/20"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No completed courses yet</h3>
                <p className="text-gray-400 mb-4">
                  Complete your first course to see it here!
                </p>
                <Button
                  onClick={() => router.push('/')}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Continue Learning
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}