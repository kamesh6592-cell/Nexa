import { z } from 'zod'

export const searchSchema = z.object({
  query: z.string().describe('The query to search for'),
  max_results: z
    .number()
    .optional()
    .describe('The maximum number of results to return. default is 10'),
  search_depth: z
    .string()
    .optional()
    .describe(
      'The depth of the search. Allowed values are "basic" or "advanced"'
    ),
  include_domains: z
    .array(z.string())
    .optional()
    .describe(
      'A list of domains to specifically include in the search results. Default is None, which includes all domains.'
    ),
  exclude_domains: z
    .array(z.string())
    .optional()
    .describe(
      "A list of domains to specifically exclude from the search results. Default is None, which doesn't exclude any domains."
    )
})

// Strict schema with all fields required
export const strictSearchSchema = z.object({
  query: z.string().describe('The query to search for'),
  max_results: z
    .number()
    .describe('The maximum number of results to return'),
  search_depth: z
    .string()
    .describe('The depth of the search. Allowed values are "basic" or "advanced"'),
  include_domains: z
    .array(z.string())
    .describe('A list of domains to specifically include in the search results'),
  exclude_domains: z
    .array(z.string())
    .describe('A list of domains to specifically exclude from the search results')
})

export function getSearchSchemaForModel(fullModel) {
  // Use strict schema for better model compatibility
  return strictSearchSchema
}