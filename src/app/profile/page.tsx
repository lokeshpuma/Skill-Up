'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { storage } from '@/lib/storage'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  Award, 
  Edit, 
  LogOut, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react'

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [message, setMessage] = useState('')
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])

  useState(() => {
    // Load enrolled courses
    const enrolledIds = storage.getEnrolledCourses()
    const progressData = enrolledIds.map(courseId => ({
      courseId,
      progress: storage.getCourseProgress(courseId)
    }))
    setEnrolledCourses(progressData)
  }, [user])

  const handleSaveProfile = async () => {
    if (!user) return

    try {
      updateUser({
        name: editForm.name,
        email: editForm.email,
      })
      
      setIsEditing(false)
      setMessage('Profile updated successfully!')
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Failed to update profile')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleEditToggle = () => {
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
    })
    setIsEditing(!isEditing)
    setMessage('')
  }

  const getCompletedCourses = () => {
    return enrolledCourses.filter(course => course.progress?.status === 'completed').length
  }

  const getInProgressCourses = () => {
    return enrolledCourses.filter(course => course.progress?.status === 'in_progress').length
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Please log in to view your profile</p>
          <Button onClick={() => router.push('/login')} className="bg-purple-600 hover:bg-purple-700">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-400" />
                    Profile Information
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {message && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    message.includes('success') 
                      ? 'bg-green-900/20 border border-green-800 text-green-400' 
                      : 'bg-red-900/20 border border-red-800 text-red-400'
                  }`}>
                    {message}
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-gray-400">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleEditToggle}
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Name</p>
                        <p className="text-white">{user.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="text-white">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">Member Since</p>
                        <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enrolled Courses */}
            <Card className="bg-gray-900 border-gray-800 mt-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  Enrolled Courses
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Courses you are currently taking or have completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-3">
                    {enrolledCourses.map((course) => (
                      <div key={course.courseId} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            course.progress?.status === 'completed' 
                              ? 'bg-green-400' 
                              : course.progress?.status === 'in_progress' 
                              ? 'bg-blue-400' 
                              : 'bg-gray-400'
                          }`} />
                          <div>
                            <p className="text-white font-medium">Course {course.courseId}</p>
                            <p className="text-sm text-gray-400">
                              {course.progress?.status === 'completed' 
                                ? 'Completed' 
                                : course.progress?.status === 'in_progress' 
                                ? 'In Progress' 
                                : 'Not Started'
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {course.progress?.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          )}
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {course.progress?.progress || 0}% Complete
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No courses enrolled yet</p>
                    <Button
                      onClick={() => router.push('/')}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Browse Courses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats & Actions */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" />
                  Learning Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Total Enrolled</span>
                    <span className="text-white font-semibold">{enrolledCourses.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Completed</span>
                    <span className="text-green-400 font-semibold">{getCompletedCourses()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">In Progress</span>
                    <span className="text-blue-400 font-semibold">{getInProgressCourses()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/my-courses')}
                  className="w-full border-gray-600 text-white hover:bg-gray-800"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  My Courses
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="w-full border-gray-600 text-white hover:bg-gray-800"
                >
                  Browse Courses
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}