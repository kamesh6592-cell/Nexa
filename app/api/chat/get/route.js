import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(req) {
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

    // Connect to the database and fetch all chats for the user
    await connectDB();
    const data = await Chat.find({ userId: user.id });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Get chats error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
