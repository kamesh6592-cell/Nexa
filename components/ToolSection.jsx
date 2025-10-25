'use client'

import React from 'react'
import { SearchSection } from './SearchSection'
import { SearchSkeleton } from './SearchResults'

interface ToolSectionProps {
  tool: {
    toolName: string
    state: 'call' | 'result'
    result?: any
    args?: any
  }
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  chatId?: string
}

export function ToolSection({
  tool,
  isOpen,
  onOpenChange,
  chatId
}: ToolSectionProps) {
  switch (tool.toolName) {
    case 'search':
      const isLoading = tool.state === 'call'
      const searchResults = tool.state === 'result' ? tool.result : undefined
      
      return (
        <SearchSection
          searchData={searchResults}
          isLoading={isLoading}
          isOpen={isOpen}
          onToggle={onOpenChange}
        />
      )
    default:
      return null
  }
}

export default ToolSection