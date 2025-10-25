'use client'

import React from 'react'
import { SearchSection } from './SearchSection'
import { SearchSkeleton } from './SearchResults'

/**
 * ToolSection component props
 * @typedef {Object} ToolSectionProps
 * @property {Object} tool - Tool invocation object
 * @property {string} tool.toolName - Name of the tool
 * @property {'call' | 'result'} tool.state - Tool execution state
 * @property {any} [tool.result] - Tool result data
 * @property {any} [tool.args] - Tool arguments
 * @property {boolean} isOpen - Whether section is open
 * @property {Function} onOpenChange - Open state change handler
 * @property {string} [chatId] - Chat ID
 */

export function ToolSection({
  tool,
  isOpen,
  onOpenChange,
  chatId
}) {
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