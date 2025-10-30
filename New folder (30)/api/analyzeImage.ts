import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Type } from '@google/genai';
import { ai, handleError, extractJsonFromString } from './utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { base64ImageData, mimeType, prompt } = req.body;

    const ocrPrompt = `
    You are an expert AI tutor with powerful OCR capabilities. Your task is two-fold:
    1.  First, perform OCR on the provided image to accurately transcribe all text, paying special attention to handwritten notes (even if the handwriting is messy), diagrams, and mathematical equations.
    2.  Second, based on the transcribed text, provide a helpful and clear answer to the user's question.

    User's question: "${prompt}"

    Your response MUST be a raw JSON object with two keys:
    - "ocrText": A string containing the full transcribed text from the image. If no text is found, it should be an empty string.
    - "answer": A string containing your detailed answer to the user's question, formatted in Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          { text: ocrPrompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                ocrText: { type: Type.STRING },
                answer: { type: Type.STRING }
            },
            required: ["ocrText", "answer"],
        }
      }
    });

    const jsonString = extractJsonFromString(response.text);
    const analysisResult = JSON.parse(jsonString);

    res.status(200).json(analysisResult);
  } catch (error) {
    handleError(res, error, 'Failed to analyze image.');
  }
}