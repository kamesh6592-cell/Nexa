import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
import { ai, handleError } from './utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, description, style, color } = req.body;

    // Step 1: Brainstorm concepts
    const brainstormPrompt = `
      You are an expert logo designer. Based on the provided company information, generate 4 distinct logo concepts.
      For each concept, provide:
      1. A short, compelling 'description'.
      2. A detailed 'imagePrompt' for an AI image generator. This prompt must describe a simple, iconic, modern, vector-style logo on a solid white background.
      Company Name: "${name}", Description: "${description}", Style: "${style}", Color: "${color}".
      Your response MUST be only a raw JSON array of objects.
    `;

    const brainstormResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: brainstormPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, imagePrompt: { type: Type.STRING } }, required: ["description", "imagePrompt"] }
            }
        }
    });

    const ideas = JSON.parse(brainstormResponse.text);

    // Step 2: Generate images for each concept
    const imageGenerationPromises = ideas.map(async (idea: { imagePrompt: string }) => {
        try {
            const imageResponse = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: idea.imagePrompt,
                config: { numberOfImages: 1, outputMimeType: 'image/png' },
            });
            if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
              const base64 = imageResponse.generatedImages[0].image.imageBytes;
              return { ...idea, imageUrl: `data:image/png;base64,${base64}` };
            }
            return idea; // Return without image if generation fails
        } catch (error) {
            console.error(`Failed to generate image for prompt: ${idea.imagePrompt}`, error);
            return idea;
        }
    });

    const finalConcepts = await Promise.all(imageGenerationPromises);
    res.status(200).json(finalConcepts);
  } catch (error) {
    handleError(res, error, 'Failed to generate logo ideas.');
  }
}
