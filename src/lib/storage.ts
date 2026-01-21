// LocalStorage utilities for session and data persistence

const STORAGE_KEYS = {
  USER: 'skillup_user',
  ENROLLED_COURSES: 'skillup_enrolled_courses',
  COURSE_PROGRESS: 'skillup_course_progress',
  QUIZ_ATTEMPTS: 'skillup_quiz_attempts'
}

export interface User {
  id: string
  name: string
  email: string
  password: string
  avatar?: string
  createdAt: string
}

export interface CourseProgress {
  courseId: string
  enrolledAt: string
  completedAt?: string
  progress: number
  status: 'not_started' | 'in_progress' | 'completed'
  quizScore?: number
  videoWatched: boolean
}

export interface QuizAttempt {
  courseId: string
  answers: number[]
  score: number
  attemptedAt: string
}

// User Management
export const storage = {
  // User operations
  getUser(): User | null {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    return userStr ? JSON.parse(userStr) : null
  },

  setUser(user: User): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  updateUser(updates: Partial<User>): void {
    const user = this.getUser()
    if (user) {
      const updatedUser = { ...user, ...updates }
      this.setUser(updatedUser)
    }
  },

  removeUser(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  // Course enrollment operations
  getEnrolledCourses(): string[] {
    if (typeof window === 'undefined') return []
    const courses = localStorage.getItem(STORAGE_KEYS.ENROLLED_COURSES)
    return courses ? JSON.parse(courses) : []
  },

  enrollCourse(courseId: string): void {
    const courses = this.getEnrolledCourses()
    if (!courses.includes(courseId)) {
      courses.push(courseId)
      localStorage.setItem(STORAGE_KEYS.ENROLLED_COURSES, JSON.stringify(courses))
      
      // Initialize progress
      this.updateCourseProgress(courseId, {
        courseId,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        status: 'not_started',
        videoWatched: false
      })
    }
  },

  // Course progress operations
  getCourseProgress(courseId: string): CourseProgress | null {
    if (typeof window === 'undefined') return null
    const progress = localStorage.getItem(`${STORAGE_KEYS.COURSE_PROGRESS}_${courseId}`)
    return progress ? JSON.parse(progress) : null
  },

  updateCourseProgress(courseId: string, updates: Partial<CourseProgress>): void {
    if (typeof window === 'undefined') return
    const existing = this.getCourseProgress(courseId) || {
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      status: 'not_started' as const,
      videoWatched: false
    }
    
    const updated = { ...existing, ...updates }
    localStorage.setItem(`${STORAGE_KEYS.COURSE_PROGRESS}_${courseId}`, JSON.stringify(updated))
  },

  getAllCourseProgress(): CourseProgress[] {
    if (typeof window === 'undefined') return []
    const progress: CourseProgress[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_KEYS.COURSE_PROGRESS)) {
        const progressStr = localStorage.getItem(key)
        if (progressStr) {
          progress.push(JSON.parse(progressStr))
        }
      }
    }
    
    return progress
  },

  // Quiz operations
  getQuizAttempts(courseId: string): QuizAttempt[] {
    if (typeof window === 'undefined') return []
    const attempts = localStorage.getItem(`${STORAGE_KEYS.QUIZ_ATTEMPTS}_${courseId}`)
    return attempts ? JSON.parse(attempts) : []
  },

  saveQuizAttempt(courseId: string, attempt: QuizAttempt): void {
    if (typeof window === 'undefined') return
    const attempts = this.getQuizAttempts(courseId)
    attempts.push(attempt)
    localStorage.setItem(`${STORAGE_KEYS.QUIZ_ATTEMPTS}_${courseId}`, JSON.stringify(attempts))
  },

  // Clear all data (for logout)
  clearAll(): void {
    if (typeof window === 'undefined') return
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    
    // Clear course progress data
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key && (key.startsWith(STORAGE_KEYS.COURSE_PROGRESS) || key.startsWith(STORAGE_KEYS.QUIZ_ATTEMPTS))) {
        localStorage.removeItem(key)
      }
    }
  }
}