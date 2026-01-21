'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import CourseCard from '@/components/CourseCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BookOpen, Filter, Search, Grid3X3 } from 'lucide-react'

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
  videoUrl?: string
  quizQuestions?: QuizQuestion[]
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [sortBy, setSortBy] = useState('popular')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    // Generate mock courses data
    const mockCourses: Course[] = [
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
          }
        ]
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
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
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
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: '4',
        title: 'Machine Learning A-Z',
        description: 'Comprehensive guide to machine learning algorithms, from basic concepts to advanced implementations.',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=225&fit=crop',
        category: 'machine-learning',
        rating: 4.8,
        learners: 120456,
        duration: '12 hours',
        level: 'Intermediate',
        isFree: true,
        instructor: 'Dr. Emily Watson',
        lessons: 36,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: '5',
        title: 'Data Science with Python',
        description: 'Learn data analysis, visualization, and machine learning using Python and popular libraries.',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
        category: 'data-science',
        rating: 4.7,
        learners: 98765,
        duration: '10 hours',
        level: 'Intermediate',
        isFree: true,
        instructor: 'Dr. James Lee',
        lessons: 30,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: '6',
        title: 'Web Development Bootcamp',
        description: 'Full-stack web development with HTML, CSS, JavaScript, React, Node.js and modern tools.',
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
        category: 'web-development',
        rating: 4.9,
        learners: 234567,
        duration: '20 hours',
        level: 'Beginner',
        isFree: true,
        instructor: 'Sarah Johnson',
        lessons: 60,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: '7',
        title: 'UI/UX Design Principles',
        description: 'Master the fundamentals of user interface and user experience design for modern applications.',
        thumbnail: 'https://images.unsplash.com/photo-1559028006-44a26fcd6bee?w=400&h=225&fit=crop',
        category: 'ui-design',
        rating: 4.5,
        learners: 67890,
        duration: '6 hours',
        level: 'Beginner',
        isFree: true,
        instructor: 'Lisa Anderson',
        lessons: 18,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: '8',
        title: 'Advanced Mathematics for AI',
        description: 'Linear algebra, calculus, and statistics fundamentals essential for artificial intelligence.',
        thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop',
        category: 'mathematics',
        rating: 4.4,
        learners: 34567,
        duration: '8 hours',
        level: 'Advanced',
        isFree: true,
        instructor: 'Dr. Robert Chang',
        lessons: 24,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      }
    ]

    setCourses(mockCourses)
    setFilteredCourses(mockCourses)
  }, [])

  useEffect(() => {
    let filtered = courses

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort courses
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.learners - a.learners
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return b.id.localeCompare(a.id)
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration)
        default:
          return 0
      }
    })

    setFilteredCourses(filtered)
  }, [courses, selectedCategory, searchQuery, sortBy])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleEnroll = (courseId: string) => {
    if (!user) {
      router.push('/login')
      return
    }
    
    // Update course enrollment status
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isEnrolled: true, progress: 0 }
        : course
    ))
  }

  const handleStart = (courseId: string) => {
    router.push(`/course/${courseId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onSearch={handleSearch}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobileMenuOpen={isSidebarOpen}
      />
      
      <div className="flex">
        <Sidebar
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {selectedCategory === 'all' ? 'All Courses' : 
               categories.find(cat => cat.id === selectedCategory)?.name || 'Courses'}
            </h1>
            <p className="text-gray-400">
              Discover and learn from our comprehensive course catalog
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Filter:</span>
            </div>
            
            <div className="flex-1 max-w-xs">
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder-gray-500"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </div>

          {/* Course Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onEnroll={handleEnroll}
                  onStart={handleStart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="border-gray-700 text-white hover:bg-gray-800"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Helper categories data (should match sidebar)
const categories = [
  { id: 'all', name: 'All Courses' },
  { id: 'generative-ai', name: 'Generative AI' },
  { id: 'cyber-security', name: 'Cyber Security' },
  { id: 'machine-learning', name: 'Machine Learning' },
  { id: 'data-science', name: 'Data Science' },
  { id: 'web-development', name: 'Web Development' },
  { id: 'ui-design', name: 'UI Design' },
  { id: 'mathematics', name: 'Mathematics' }
]