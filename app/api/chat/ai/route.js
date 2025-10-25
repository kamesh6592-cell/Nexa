// When you deploy this code on vercel, vercel will wait for 10s - 15s for the response on this API route.
// To increase the wait time for the response
export const maxDuration = 60;

import { NextResponse } from "next/server";
import OpenAI from "openai";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Initialize OpenRouter client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req) {
  try {
    // Check if OpenRouter API key is configured
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({
        success: false,
        message: "OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment variables.",
      });
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: false,
        message: "Authentication not configured. Please set up Supabase environment variables.",
      });
    }

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({
        success: false,
        message: "No authorization token provided",
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return NextResponse.json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // Extract chatId, prompt, and model from the request body
    const { chatId, prompt, model = "openai/gpt-4o-mini" } = await req.json();

    // Validate model selection
    const supportedModels = [
      "openai/gpt-4o-mini",
      "google/gemini-2.0-flash-exp"
    ];

    if (!supportedModels.includes(model)) {
      return NextResponse.json({
        success: false,
        message: `Unsupported model. Supported models: ${supportedModels.join(", ")}`,
      });
    }

    // Find the chat document in the database based on userId and chatId
    await connectDB();
    const data = await Chat.findOne({ userId: user.id, _id: chatId });

    if (!data) {
      return NextResponse.json({
        success: false,
        message: "Chat not found",
      });
    }

    // Create a user message object
    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    data.messages.push(userPrompt);

    // Call the OpenRouter API to get a chat completion
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: model,
      store: true,
    });

    const message = completion.choices[0].message;
    message.timestamp = Date.now();
    data.messages.push(message);
    await data.save();

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Chat AI Error:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
