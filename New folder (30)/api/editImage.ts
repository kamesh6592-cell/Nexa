import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Modality } from '@google/genai';
import { ai, handleError } from './utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { base64ImageData, mimeType, prompt } = req.body;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64ImageData, mimeType: mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        res.status(200).json({ imageBase64: part.inlineData.data });
        return;
      }
    }
    throw new Error('No image data found in the AI response.');
  } catch (error) {
    handleError(res, error, 'Failed to edit image.');
  }
}
