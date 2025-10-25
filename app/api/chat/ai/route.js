// When you deploy this code on vercel, vercel will wait for 10s - 15s for the response on this API route.
// To increase the wait time for the response
export const maxDuration = 60;

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Initialize OpenRouter client
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Initialize Gemini client
let genAI;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export async function POST(req) {
  try {
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

    // Extract chatId, prompt, model, and reasoning from the request body
    const { chatId, prompt, model = "openai/gpt-4o-mini", reasoning = false } = await req.json();

    // Define supported models and their API requirements
    const modelConfig = {
      "openai/gpt-4o-mini": { api: "openrouter", requiresKey: "OPENROUTER_API_KEY" },
      "gemini-2.0-flash-exp": { api: "gemini", requiresKey: "GEMINI_API_KEY" }
    };

    const config = modelConfig[model];
    if (!config) {
      return NextResponse.json({
        success: false,
        message: `Unsupported model: ${model}. Supported models: ${Object.keys(modelConfig).join(", ")}`,
      });
    }

    // Check if required API key is configured
    if (!process.env[config.requiresKey]) {
      return NextResponse.json({
        success: false,
        message: `${config.requiresKey} not configured. Please add it to your environment variables.`,
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

    let message;

    // Enhance prompt with reasoning instructions if reasoning is enabled
    let enhancedPrompt = prompt;
    if (reasoning) {
      enhancedPrompt = `Think step by step and show your reasoning process. Be thorough in your analysis and explain your thought process clearly.

User query: ${prompt}

Please provide:
1. Your reasoning process (thinking step by step)
2. Your final answer

Format your response with clear sections for reasoning and conclusion.`;
    }

    // Call appropriate API based on model configuration
    if (config.api === "openrouter") {
      // Use OpenRouter API
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: enhancedPrompt }],
        model: model,
        store: true,
        ...(reasoning && { 
          temperature: 0.7,
          max_tokens: 2000 
        })
      });
      message = completion.choices[0].message;
    } else if (config.api === "gemini") {
      // Use direct Gemini API
      const modelInstance = genAI.getGenerativeModel({ model: model });
      const result = await modelInstance.generateContent(enhancedPrompt);
      const response = await result.response;
      
      message = {
        role: "assistant",
        content: response.text(),
      };
    }

    // Add reasoning flag to message if reasoning was enabled
    if (reasoning) {
      message.reasoning = true;
    }

    message.timestamp = Date.now();
    data.messages.push(message);
    await data.save();

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error("Chat AI Error:", error);
    
    // Provide more specific error messages
    let errorMessage = "An error occurred while processing your request.";
    
    if (error.message?.includes("API key")) {
      errorMessage = "Invalid API key. Please check your configuration.";
    } else if (error.message?.includes("quota")) {
      errorMessage = "API quota exceeded. Please check your usage limits.";
    } else if (error.message?.includes("model")) {
      errorMessage = "Model not available. Please try a different model.";
    } else if (error.message?.includes("network") || error.code === 'ENOTFOUND') {
      errorMessage = "Network error. Please check your internet connection.";
    }
    
    return NextResponse.json({ 
      success: false, 
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
