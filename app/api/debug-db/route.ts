import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl) return NextResponse.json({ error: "Missing Env" });

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase.from('push_subscriptions').select('id, endpoint').limit(10);

  return NextResponse.json({
    count: data ? data.length : 0,
    error: error ? error.message : null,
    subscriptions: data
  });
}
