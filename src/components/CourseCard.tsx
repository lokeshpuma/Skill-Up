'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, Clock, Users, Play, CheckCircle } from 'lucide-react'

interface CourseCardProps {
  course: {
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
  }
  onEnroll?: (courseId: string) => void
  onStart?: (courseId: string) => void
}

export default function CourseCard({ course, onEnroll, onStart }: CourseCardProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  const handleCourseClick = () => {
    router.push(`/course/${course.id}`)
  }

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEnroll) {
      onEnroll(course.id)
    } else {
      // For demo, just navigate to course
      router.push(`/course/${course.id}`)
    }
  }

  const handleStartClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onStart) {
      onStart(course.id)
    } else {
      router.push(`/course/${course.id}`)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner': return 'bg-green-600'
      case 'intermediate': return 'bg-yellow-600'
      case 'advanced': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <Card 
      className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-600 transition-all duration-300 cursor-pointer group"
      onClick={handleCourseClick}
    >
      {/* Course Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {!imageError ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
            <Play className="h-12 w-12 text-white/80" />
          </div>
        )}
        
        {/* Overlay badges */}
        <div className="absolute top-2 left-2 flex gap-2">
          {course.isFree && (
            <Badge className="bg-green-600 text-white text-xs font-semibold">
              FREE
            </Badge>
          )}
          <Badge className={`${getLevelColor(course.level)} text-white text-xs`}>
            {course.level}
          </Badge>
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <Play className="h-6 w-6 text-gray-900 ml-1" />
          </div>
        </div>

        {/* Completion indicator */}
        {course.isCompleted && (
          <div className="absolute top-2 right-2">
            <CheckCircle className="h-6 w-6 text-green-400" />
          </div>
        )}
      </div>

      <CardContent className="p-4">
        {/* Course Title */}
        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors">
          {course.title}
        </h3>

        {/* Course Description */}
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        {course.instructor && (
          <p className="text-gray-500 text-xs mb-3">By {course.instructor}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.learners.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Progress Bar (for enrolled courses) */}
        {course.isEnrolled && course.progress !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-2">
          {!course.isEnrolled ? (
            <Button 
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleEnrollClick}
            >
              {course.isFree ? 'Enroll Now' : 'Buy Course'}
            </Button>
          ) : course.isCompleted ? (
            <Button 
              variant="outline" 
              className="flex-1 border-green-600 text-green-400 hover:bg-green-900/20"
              onClick={handleCourseClick}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Completed
            </Button>
          ) : (
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleStartClick}
            >
              {course.progress && course.progress > 0 ? 'Continue' : 'Start Learning'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}