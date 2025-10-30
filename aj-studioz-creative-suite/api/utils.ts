import { GoogleGenAI } from '@google/genai';
import type { VercelResponse } from '@vercel/node';

// Initialize the AI client once and share it across all functions
export const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});

// A helper to send structured error responses
export function handleError(res: VercelResponse, error: unknown, message = 'An unknown error occurred.') {
  console.error(error);
  const errorMessage = error instanceof Error ? error.message : message;
  res.status(500).json({ error: errorMessage });
}

// Helper to extract JSON from a string that might be wrapped in markdown.
export const extractJsonFromString = (text: string): string => {
  const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch && jsonBlockMatch[1]) {
    return jsonBlockMatch[1].trim();
  }
  const genericBlockMatch = text.match(/```\s*([\s\S]*?)\s*```/);
  if (genericBlockMatch && genericBlockMatch[1]) {
    return genericBlockMatch[1].trim();
  }
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return text.substring(firstBrace, lastBrace + 1).trim();
  }
  return text.trim();
};