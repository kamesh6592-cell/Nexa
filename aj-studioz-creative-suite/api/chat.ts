import { ai } from './utils';
import type { Content } from '@google/genai';

// Vercel Edge Function configuration
export const config = {
  runtime: 'edge',
};

// The default export needs to be a function that returns a Response
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
        return new Response('Invalid "messages" in body', { status: 400 });
    }

    // Convert the message history to the format required by the Gemini API
    const contents: Content[] = messages.map((msg: {role: 'user' | 'model', text: string}) => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    // Use the stateless generateContentStream method for robust streaming
    const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash-lite',
        contents: contents,
    });

    // Pipe the response from the Gemini API to the client
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of stream) {
          const chunkText = chunk.text;
          if (chunkText) {
            controller.enqueue(encoder.encode(chunkText));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });

  } catch (error) {
     console.error('Error in chat stream:', error);
     const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
     // For edge functions, the error response must also be a Response object
     return new Response(JSON.stringify({ error: errorMessage }), { 
         status: 500,
         headers: { 'Content-Type': 'application/json' }
     });
  }
}