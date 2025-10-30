import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
import { ai, handleError } from './utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { formData } = req.body;

    const planPrompt = `
    You are a friendly AI web design assistant. Based on the user's prompt and any uploaded files, create a 5-step 'Plan of Action' for building their website. Your response must be only a raw JSON array of strings. Make the steps sound creative.
    User's Request: "${formData.prompt}"
    Uploaded Files: ${formData.uploadedFiles.map((f: any) => f.name).join(', ') || 'None'}
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: planPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                }
            }
        }
    });

    const jsonString = response.text.trim();
    const plan = JSON.parse(jsonString);
    res.status(200).json(plan);
  } catch (error) {
    handleError(res, error, 'Failed to generate website plan.');
  }
}