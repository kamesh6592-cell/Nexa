import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Skeleton } from './ui/skeleton'

/**
 * Enhanced search skeleton for loading states
 */
export function SearchSkeleton() {
  return (
    <div className="flex flex-col gap-2 pb-4 pt-2 search-results-container">
      <div className="flex flex-wrap gap-2 pb-0.5">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="w-[calc(50%-0.5rem)] md:w-[calc(25%-0.5rem)]"
          >
            <Skeleton className="h-20 w-full search-skeleton" />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Component to display search results in a grid or list format
 * @param {Object} props
 * @param {Array} props.results - Array of search result items
 * @param {string} props.displayMode - 'grid' or 'list' display mode
 * @returns {JSX.Element}
 */
export function SearchResults({ results = [], displayMode = 'grid' }) {
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No search results found.</p>
      </div>
    )
  }

  const displayUrlName = (url) => {
    try {
      const hostname = new URL(url).hostname
      const parts = hostname.split('.')
      return parts.length > 2 ? parts.slice(1, -1).join('.') : parts[0]
    } catch {
      return url
    }
  }

  // List Mode Rendering
  if (displayMode === 'list') {
    return (
      <div className="flex flex-col gap-3 search-results-container">
        {results.map((result, index) => (
          <Link
            href={result.url}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
            className="group block p-3 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200 bg-white/5 hover:bg-white/10 optimized-animation"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-medium text-white">
                {displayUrlName(result.url).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white text-sm mb-1 line-clamp-2">
                  {result.title}
                </h3>
                <p className="text-xs text-gray-400 mb-2">
                  {displayUrlName(result.url)}
                </p>
                <p className="text-sm text-gray-300 line-clamp-2">
                  {result.content}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  // Grid Mode Rendering (default)
  const displayedResults = results.slice(0, 6) // Show max 6 in grid
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 search-results-container">
      {displayedResults.map((result, index) => (
        <Link
          href={result.url}
          key={index}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 bg-white/5 hover:bg-white/10 hover:scale-[1.02] optimized-animation"
        >
          <div className="flex items-start gap-3 h-full">
            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center text-sm font-bold text-white">
              {displayUrlName(result.url).charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 leading-tight">
                {result.title}
              </h3>
              <p className="text-xs text-gray-400 mb-2 font-medium">
                {displayUrlName(result.url)}
              </p>
              <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                {result.content}
              </p>
            </div>
          </div>
        </Link>
      ))}
      
      {results.length > 6 && (
        <div className="col-span-full text-center py-2">
          <p className="text-xs text-gray-400">
            Showing 6 of {results.length} results
          </p>
        </div>
      )}
    </div>
  )
}

export default SearchResults