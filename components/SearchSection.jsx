import React, { useState } from 'react'
import Image from 'next/image'
import { SearchResults } from './SearchResults'

/**
 * Component to display a complete search section with query, images, and results
 * @param {Object} props
 * @param {Object} props.searchData - Search results data
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.isOpen - Whether the section is expanded
 * @param {Function} props.onToggle - Function to toggle expansion
 * @returns {JSX.Element}
 */
export function SearchSection({ searchData, isLoading = false, isOpen = true, onToggle }) {
  const [imageError, setImageError] = useState({})

  if (!searchData && !isLoading) {
    return null
  }

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }))
  }

  return (
    <div className="border border-white/10 rounded-xl bg-white/5 overflow-hidden">
      {/* Header */}
      <div 
        className={`p-4 border-b border-white/10 ${onToggle ? 'cursor-pointer hover:bg-white/5' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Web Search</h3>
              {searchData?.query && (
                <p className="text-xs text-gray-400 mt-0.5">
                  "{searchData.query}"
                  {searchData.number_of_results && (
                    <span className="ml-2">• {searchData.number_of_results} results</span>
                  )}
                </p>
              )}
            </div>
          </div>
          
          {onToggle && (
            <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-24 bg-gray-700 rounded-lg"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Images Section */}
              {searchData?.images && searchData.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Images</h4>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {searchData.images.slice(0, 6).map((image, index) => {
                      const imageUrl = typeof image === 'string' ? image : image.url
                      const imageDesc = typeof image === 'object' ? image.description : ''
                      
                      return (
                        <div 
                          key={index} 
                          className="aspect-square rounded-lg overflow-hidden bg-gray-800 hover:scale-105 transition-transform"
                        >
                          {!imageError[index] ? (
                            <img
                              src={imageUrl}
                              alt={imageDesc || `Search result image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(index)}
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {searchData?.results && searchData.results.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Sources</h4>
                  <SearchResults results={searchData.results} displayMode="grid" />
                </div>
              )}

              {/* No Results */}
              {searchData && (!searchData.results || searchData.results.length === 0) && (
                <div className="text-center py-6 text-gray-500">
                  <p>No search results found for "{searchData.query}"</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchSection