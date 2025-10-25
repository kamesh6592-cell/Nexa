export const SearchResults = {
  images: [],
  results: [],
  number_of_results: 0,
  query: ''
}

export const SearchResultImage = {
  url: '',
  description: ''
}

export const SearchResultItem = {
  title: '',
  url: '',
  content: ''
}

// Define TypeScript-like interfaces as JSDoc comments for better IDE support

/**
 * @typedef {Object} SearchResultImage
 * @property {string} url - The URL of the image
 * @property {string} description - Description of the image
 */

/**
 * @typedef {Object} SearchResultItem
 * @property {string} title - The title of the search result
 * @property {string} url - The URL of the search result
 * @property {string} content - The content/snippet of the search result
 */

/**
 * @typedef {Object} SearchResults
 * @property {SearchResultImage[]} images - Array of image results
 * @property {SearchResultItem[]} results - Array of search results
 * @property {number} number_of_results - Total number of results
 * @property {string} query - The search query
 */