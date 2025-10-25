'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * CollapsibleMessage component props
 * @typedef {Object} CollapsibleMessageProps
 * @property {'user' | 'assistant'} role - Message role
 * @property {boolean} [isCollapsible=true] - Whether the message can be collapsed
 * @property {React.ReactNode} [header] - Header content
 * @property {boolean} [isOpen] - Controlled open state
 * @property {Function} [onOpenChange] - Open state change handler
 * @property {boolean} [showIcon=true] - Whether to show collapse icon
 * @property {React.ReactNode} children - Message content
 * @property {string} [className] - Additional CSS classes
 */

export function CollapsibleMessage({
  role,
  isCollapsible = true,
  header,
  isOpen: controlledIsOpen,
  onOpenChange,
  showIcon = true,
  children,
  className
}) {
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