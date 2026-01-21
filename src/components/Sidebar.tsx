'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  Shield, 
  Cpu, 
  Database, 
  Globe, 
  Palette, 
  Calculator, 
  BookOpen, 
  ChevronRight,
  Layers
} from 'lucide-react'

interface Category {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  courseCount: number
  color: string
}

interface SidebarProps {
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  isOpen: boolean
  onClose: () => void
}

const categories: Category[] = [
  {
    id: 'all',
    name: 'All Courses',
    icon: Layers,
    courseCount: 24,
    color: 'text-gray-400'
  },
  {
    id: 'generative-ai',
    name: 'Generative AI',
    icon: Brain,
    courseCount: 8,
    color: 'text-purple-400'
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security',
    icon: Shield,
    courseCount: 6,
    color: 'text-green-400'
  },
  {
    id: 'machine-learning',
    name: 'Machine Learning',
    icon: Cpu,
    courseCount: 7,
    color: 'text-blue-400'
  },
  {
    id: 'data-science',
    name: 'Data Science',
    icon: Database,
    courseCount: 5,
    color: 'text-orange-400'
  },
  {
    id: 'web-development',
    name: 'Web Development',
    icon: Globe,
    courseCount: 9,
    color: 'text-cyan-400'
  },
  {
    id: 'ui-design',
    name: 'UI Design',
    icon: Palette,
    courseCount: 4,
    color: 'text-pink-400'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    icon: Calculator,
    courseCount: 6,
    color: 'text-yellow-400'
  }
]

export default function Sidebar({ selectedCategory, onCategoryChange, isOpen, onClose }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCategoryClick = (categoryId: string) => {
    onCategoryChange(categoryId)
    if (isMobile) {
      onClose()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-gray-900 border-r border-gray-800
        transform transition-transform duration-200 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:top-0 lg:h-screen lg:z-30
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Categories</h2>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              )}
            </div>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon
                const isSelected = selectedCategory === category.id
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
                      ${isSelected 
                        ? 'bg-purple-600/20 border border-purple-500/30 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-purple-400' : category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-400">
                        {category.courseCount}
                      </Badge>
                      {isSelected && <ChevronRight className="h-4 w-4 text-purple-400" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">Learning Platform</p>
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-gray-400">SkillUP</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}