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

    const { chatId, name } = await req.json();
    // Connect to the database and update the chat name
    await connectDB();
    await Chat.findOneAndUpdate({ _id: chatId, userId: user.id }, { name });

    return NextResponse.json({ success: true, message: "Chat Renamed" });
  } catch (error) {
    console.error("Rename chat error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
