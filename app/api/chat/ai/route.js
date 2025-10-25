// When you deploy this code on vercel, vercel will wait for 10s - 15s for the response on this API route.
// To increase the wait time for the response
export const maxDuration = 60;

import { NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { createSearchTool } from "@/lib/tools/search";

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

    // Extract chatId, prompt, model, reasoning, and enableSearch from the request body
    const { chatId, prompt, model = "openai/gpt-4o-mini", reasoning = false, enableSearch = true } = await req.json();

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
    let searchResults = null;

    // Check if the query would benefit from web search
    const shouldSearch = enableSearch && isSearchQuery(prompt);
    
    if (shouldSearch) {
      try {
        // Perform web search
        const searchTool = createSearchTool();
        const searchParams = {
          query: prompt,
          max_results: 5,
          search_depth: "basic",
          include_answer: false,
          include_domains: [],
          exclude_domains: []
        };
        
        searchResults = await searchTool.execute(searchParams);
        console.log('Search results obtained:', searchResults ? 'success' : 'failed');
      } catch (searchError) {
        console.error('Search error:', searchError);
        // Continue without search results if search fails
      }
    }

    // Enhance prompt with search results and reasoning instructions
    let enhancedPrompt = prompt;
    
    if (searchResults && searchResults.results && searchResults.results.length > 0) {
      const searchContext = searchResults.results.map(result => 
        `Source: ${result.title}\nURL: ${result.url}\nContent: ${result.content}`
      ).join('\n\n');
      
      enhancedPrompt = `You have access to current web search results. Use this information to provide accurate, up-to-date answers.

Search Query: ${prompt}

Web Search Results:
${searchContext}

Based on the search results above and your knowledge, please provide a comprehensive answer to the user's question. If the search results are relevant, incorporate the information and cite the sources. If the search results are not relevant or you need to provide additional context, use your general knowledge while noting what information comes from the search results.

User Question: ${prompt}`;
    }
    
    if (reasoning) {
      enhancedPrompt = `Think step by step and show your reasoning process. Be thorough in your analysis and explain your thought process clearly.

${enhancedPrompt}

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

    // Add search results to message if search was performed
    if (searchResults) {
      message.searchData = searchResults;
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

/**
 * Determines if a query would benefit from web search
 * @param {string} query - The user's query
 * @returns {boolean} - Whether to perform a search
 */
function isSearchQuery(query) {
  const lowerQuery = query.toLowerCase();
  
  // Keywords that indicate current/real-time information needs
  const searchIndicators = [
    'latest', 'recent', 'current', 'today', 'now', 'update', 'news',
    'what happened', 'when did', 'price of', 'stock price', 'weather',
    'events', 'breaking', 'trending', 'this year', 'this month',
    'compare prices', 'reviews of', 'best', 'top', 'ranking',
    'how to', 'tutorial', 'guide', 'instructions', 'steps'
  ];
  
  // Patterns that suggest real-time information needs
  const searchPatterns = [
    /\b(what is|what are|who is|where is|when is|how is)\b.*\b(today|now|currently|latest|recent)\b/,
    /\b(price|cost|worth|value)\b.*\bof\b/,
    /\b(how much|how many)\b.*\b(cost|costs|price|worth)\b/,
    /\b(compare|comparison|vs|versus)\b/,
    /\b(review|reviews|rating|ratings)\b/,
    /\b(where to|where can|how to)\b.*\b(buy|purchase|get|find)\b/,
    /\b(what happened|what's happening)\b/,
    /\b(when did|when will|when is)\b/
  ];
  
  // Check for search indicators
  const hasSearchIndicator = searchIndicators.some(indicator => 
    lowerQuery.includes(indicator)
  );
  
  // Check for search patterns
  const matchesSearchPattern = searchPatterns.some(pattern => 
    pattern.test(lowerQuery)
  );
  
  // Questions that likely need current information
  const isQuestion = /^(what|who|where|when|how|why|which|is|are|can|could|would|should|do|does|did)/i.test(query);
  
  return hasSearchIndicator || matchesSearchPattern || (isQuestion && query.length > 10);
}
