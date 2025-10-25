import React, { useState } from 'react'
import Image from 'next/image'
import { SearchResults, SearchSkeleton } from './SearchResults'
import { CollapsibleMessage } from './CollapsibleMessage'
import { Section, ToolArgsSection } from './Section'

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

  const header = (
    <ToolArgsSection 
      tool="search" 
      number={searchData?.number_of_results}
    >
      {searchData?.query}
    </ToolArgsSection>
  )

  return (
    <CollapsibleMessage
      role="assistant"
      isCollapsible={true}
      header={header}
      isOpen={isOpen}
      onOpenChange={onToggle}
      showIcon={true}
    >
      {isLoading ? (
        <SearchSkeleton />
      ) : (
        <>
          {/* Images Section */}
          {searchData?.images && searchData.images.length > 0 && (
            <Section title="Images">
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {searchData.images.slice(0, 6).map((image, index) => {
                  const imageUrl = typeof image === 'string' ? image : image.url
                  const imageDesc = typeof image === 'object' ? image.description : ''
                  
                  return (
                    <div 
                      key={index} 
                      className="aspect-square rounded-lg overflow-hidden bg-gray-800 hover:scale-105 transition-transform optimized-animation"
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
            </Section>
          )}

          {/* Search Results */}
          {searchData?.results && searchData.results.length > 0 && (
            <Section title="Sources">
              <SearchResults results={searchData.results} displayMode="grid" />
            </Section>
          )}

          {/* No Results */}
          {searchData && (!searchData.results || searchData.results.length === 0) && (
            <div className="text-center py-6 text-gray-500">
              <p>No search results found for "{searchData.query}"</p>
            </div>
          )}
        </>
      )}
    </CollapsibleMessage>
  )
}

export default SearchSection