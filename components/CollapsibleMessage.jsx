'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CollapsibleMessageProps {
  role: 'user' | 'assistant'
  isCollapsible?: boolean
  header?: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  showIcon?: boolean
  children: React.ReactNode
  className?: string
}

export function CollapsibleMessage({
  role,
  isCollapsible = true,
  header,
  isOpen: controlledIsOpen,
  onOpenChange,
  showIcon = true,
  children,
  className
}: CollapsibleMessageProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(true)
  
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen
  const setIsOpen = onOpenChange || setInternalIsOpen

  const toggleOpen = () => {
    if (isCollapsible) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={cn("border border-white/10 rounded-xl bg-white/5 overflow-hidden message-container", className)}>
      {header && (
        <div 
          className={cn(
            "p-4 border-b border-white/10 flex items-center justify-between",
            isCollapsible && "cursor-pointer hover:bg-white/5 transition-colors"
          )}
          onClick={toggleOpen}
        >
          <div className="flex-1">{header}</div>
          {isCollapsible && showIcon && (
            <div className="ml-2">
              {isOpen ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </div>
          )}
        </div>
      )}
      
      {isOpen && (
        <div className="p-4 search-results-container">
          {children}
        </div>
      )}
    </div>
  )
}

export default CollapsibleMessage