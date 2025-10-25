import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
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

    // Prepare the chat data to be saved in the database
    const chatData = {
      userId: user.id,
      messages: [],
      name: "New Chat",
    };

    // Connect to the database and create a new chat
    await connectDB();
    await Chat.create(chatData);

    return NextResponse.json({ success: true, message: "Chat created" });
  } catch (error) {
    console.error("Create chat error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
