import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl) return NextResponse.json({ error: "Missing Env" });

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { count, error } = await supabase
    .from('push_subscriptions')
    .select('*', { count: 'exact', head: true });

  return NextResponse.json({
    count: count || 0,
    error: error ? error.message : null,
  });
}
