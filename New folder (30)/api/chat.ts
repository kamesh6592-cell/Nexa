import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ai, handleError } from './utils';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;
    
    // Convert our standard message format to the format the SDK expects for history
    const history = messages.slice(0, -1).map((msg: {role: 'user' | 'model', text: string}) => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    const latestMessage = messages[messages.length - 1];
    
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
    });

    const response = await chat.sendMessage({ message: latestMessage.text });

    res.status(200).json({ response: response.text });
  } catch (error) {
    handleError(res, error, 'Failed to get chat response.');
  }
}
