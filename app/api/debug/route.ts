import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set (First 5: " + process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 5) + "...)" : "Not Set",
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not Set",
    nodeEnv: process.env.NODE_ENV
  });
}
