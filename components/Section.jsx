'use client'

import React from 'react'
import { Search, Image as ImageIcon, Film, Newspaper, BookCheck, File } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Section component props
 * @typedef {Object} SectionProps
 * @property {string} [title] - Section title
 * @property {React.ReactNode} children - Section content
 * @property {string} [className] - Additional CSS classes
 */

/**
 * ToolArgsSection component props  
 * @typedef {Object} ToolArgsSectionProps
 * @property {string} tool - Tool name
 * @property {number} [number] - Number of results
 * @property {React.ReactNode} [children] - Content
 */

export function Section({ title, children, className }) {
  if (!title) {
    return <div className={cn("space-y-3", className)}>{children}</div>
  }

  let icon = null
  let iconSize = 16
  let iconClassName = "text-primary"

  switch (title) {
    case 'Images':
      icon = <ImageIcon size={iconSize} className={iconClassName} />
      break
    case 'Videos':
      icon = <Film size={iconSize} className={iconClassName} />
      break
    case 'Sources':
      icon = <Newspaper size={iconSize} className={iconClassName} />
      break
    case 'Answer':
      icon = <BookCheck size={iconSize} className={iconClassName} />
      break
    case 'Content':
      icon = <File size={iconSize} className={iconClassName} />
      break
    default:
      icon = <Search size={iconSize} className={iconClassName} />
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-medium text-white">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export function ToolArgsSection({ tool, number, children }) {
  const getToolIcon = () => {
    switch (tool) {
      case 'search':
        return <Search className="w-4 h-4 text-primary" />
      case 'videoSearch':
        return <Film className="w-4 h-4 text-primary" />
      case 'retrieve':
        return <File className="w-4 h-4 text-primary" />
      default:
        return <Search className="w-4 h-4 text-primary" />
    }
  }

  const getToolLabel = () => {
    switch (tool) {
      case 'search':
        return 'Web Search'
      case 'videoSearch':
        return 'Video Search'
      case 'retrieve':
        return 'Retrieve'
      default:
        return 'Search'
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
        {getToolIcon()}
      </div>
      <div>
        <h3 className="font-semibold text-white text-sm">{getToolLabel()}</h3>
        {children && (
          <p className="text-xs text-gray-400 mt-0.5">
            "{children}"
            {number && (
              <span className="ml-2">• {number} results</span>
            )}
          </p>
        )}
      </div>
    </div>
  )
}