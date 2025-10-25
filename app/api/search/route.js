import { NextResponse } from 'next/server'
import { search } from '@/lib/tools/search'

export async function POST(request) {
  try {
    const { query, maxResults, searchDepth, includeDomains, excludeDomains } = await request.json()

    // Validate required parameters
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      )
    }

    // Validate API key
    if (!process.env.TAVILY_API_KEY) {
      return NextResponse.json(
        { error: 'Search service is not configured. Please add TAVILY_API_KEY to environment variables.' },
        { status: 500 }
      )
    }

    console.log(`[Search API] Received search request for: "${query}"`)

    // Perform the search
    const results = await search(
      query,
      Math.min(maxResults || 10, 20), // Cap at 20 results max
      searchDepth || 'basic',
      Array.isArray(includeDomains) ? includeDomains : [],
      Array.isArray(excludeDomains) ? excludeDomains : []
    )

    console.log(`[Search API] Search completed: ${results.number_of_results} results found`)

    return NextResponse.json(results)

  } catch (error) {
    console.error('[Search API] Error:', error)
    
    return NextResponse.json(
      {
        error: 'Internal server error during search',
        message: error.message,
        results: [],
        query: '',
        images: [],
        number_of_results: 0
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST for search requests.' },
    { status: 405 }
  )
}