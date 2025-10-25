import { tool } from 'ai'
import { searchSchema } from '@/lib/schema/search'

/**
 * Creates a search tool that can be used by AI models to search the web
 * @param {string} fullModel - The AI model being used
 * @returns {Object} AI tool for web search
 */
export function createSearchTool(fullModel) {
  return tool({
    description: 'Search the web for information',
    parameters: searchSchema,
    execute: async ({
      query,
      max_results = 10,
      search_depth = 'basic',
      include_domains = [],
      exclude_domains = []
    }) => {
      try {
        // Ensure max_results is at least 5
        const effectiveMaxResults = Math.max(max_results || 5, 5)
        
        console.log(`Searching for: "${query}" with ${effectiveMaxResults} results`)

        // Use Tavily API for search (like morphic)
        const response = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: query,
            max_results: effectiveMaxResults,
            search_depth: search_depth,
            include_images: true,
            include_image_descriptions: true,
            include_answer: false,
            include_raw_content: false,
            include_domains: include_domains.length > 0 ? include_domains : undefined,
            exclude_domains: exclude_domains.length > 0 ? exclude_domains : undefined
          })
        })

        if (!response.ok) {
          throw new Error(`Search API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        // Format the results to match our SearchResults type
        const searchResults = {
          results: (data.results || []).map(result => ({
            title: result.title || '',
            url: result.url || '',
            content: result.content || result.raw_content || ''
          })),
          query: query,
          images: data.images || [],
          number_of_results: data.results?.length || 0
        }

        console.log(`Search completed: ${searchResults.number_of_results} results found`)
        
        return searchResults

      } catch (error) {
        console.error('Search error:', error)
        
        // Return empty results on error
        return {
          results: [],
          query: query,
          images: [],
          number_of_results: 0,
          error: error.message
        }
      }
    }
  })
}

// Default export for backward compatibility
export const searchTool = createSearchTool('default')

/**
 * Direct search function for use outside of AI tools
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum number of results
 * @param {string} searchDepth - Search depth ('basic' or 'advanced')
 * @param {string[]} includeDomains - Domains to include
 * @param {string[]} excludeDomains - Domains to exclude
 * @returns {Promise<SearchResults>} Search results
 */
export async function search(
  query,
  maxResults = 10,
  searchDepth = 'basic',
  includeDomains = [],
  excludeDomains = []
) {
  const tool = createSearchTool('default')
  
  return await tool.execute({
    query,
    max_results: maxResults,
    search_depth: searchDepth,
    include_domains: includeDomains,
    exclude_domains: excludeDomains
  }, {
    toolCallId: 'search',
    messages: []
  })
}