import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

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
      <div className="flex flex-col gap-3">
        {results.map((result, index) => (
          <Link
            href={result.url}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 rounded-lg border border-white/10 hover:border-white/20 transition-colors bg-white/5 hover:bg-white/10"
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {displayedResults.map((result, index) => (
        <Link
          href={result.url}
          key={index}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 bg-white/5 hover:bg-white/10 hover:scale-[1.02]"
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