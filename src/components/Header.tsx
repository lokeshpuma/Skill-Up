'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Search, 
  BookOpen, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Home,
  GraduationCap
} from 'lucide-react'

interface HeaderProps {
  onSearch?: (query: string) => void
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export default function Header({ onSearch, onMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  const handleMyCourses = () => {
    if (user) {
      router.push('/my-courses')
    } else {
      router.push('/login')
    }
  }

  const handleProfile = () => {
    router.push('/profile')
    setIsProfileDropdownOpen(false)
  }

  const handleSettings = () => {
    router.push('/profile')
    setIsProfileDropdownOpen(false)
  }

  const handleLogout = () => {
    logout()
    router.push('/')
    setIsProfileDropdownOpen(false)
  }

  const handleHome = () => {
    router.push('/')
  }

  const isHomePage = pathname === '/'
  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isAdminPage = pathname.startsWith('/admin')

  // Don't show header on auth pages or admin pages
  if (isAuthPage || isAdminPage) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side - Logo and Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <button 
            onClick={handleHome}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">SkillUP</span>
          </button>
        </div>

        {/* Center - Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-xl mx-4">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 transition-colors w-full"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 h-7 px-3"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Right side - Mobile Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* My Courses Button (Desktop) */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleMyCourses}
            className="hidden sm:flex border-gray-700 text-white hover:bg-gray-800 items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>My Courses</span>
          </Button>

          {/* Mobile My Courses Icon */}
          <button
            onClick={handleMyCourses}
            className="sm:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            <BookOpen className="h-5 w-5" />
          </button>

          {/* Profile Dropdown */}
          <div ref={dropdownRef} className="relative">
            <DropdownMenu open={isProfileDropdownOpen} onOpenChange={setIsProfileDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-sm">
                      {user?.name?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-900 border-gray-800">
                {user ? (
                  <>
                    <div className="px-2 py-1.5 text-sm text-gray-400">
                      {user.name}
                    </div>
                    <div className="px-2 py-1 text-xs text-gray-500">
                      {user.email}
                    </div>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem 
                      onClick={handleProfile}
                      className="text-gray-300 hover:text-white hover:bg-gray-800 focus:text-white focus:bg-gray-800"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleSettings}
                      className="text-gray-300 hover:text-white hover:bg-gray-800 focus:text-white focus:bg-gray-800"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-800" />
                    <DropdownMenuItem 
                      onClick={handleLogout}
                      className="text-gray-300 hover:text-white hover:bg-gray-800 focus:text-white focus:bg-gray-800"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem 
                      onClick={() => router.push('/login')}
                      className="text-gray-300 hover:text-white hover:bg-gray-800 focus:text-white focus:bg-gray-800"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => router.push('/signup')}
                      className="text-gray-300 hover:text-white hover:bg-gray-800 focus:text-white focus:bg-gray-800"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Sign Up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="md:hidden px-4 pb-3 border-t border-gray-800">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 bg-gray-900 border-gray-700 text-white placeholder-gray-500 focus:border-purple-500 transition-colors w-full"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700 h-7 px-3"
            >
              Search
            </Button>
          </form>
        </div>
      )}
    </header>
  )
}