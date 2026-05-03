import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Guardar la suscripción en la tabla 'push_subscriptions'
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert([
        { 
          endpoint: subscription.endpoint,
          keys_auth: subscription.keys.auth,
          keys_p256dh: subscription.keys.p256dh,
          updated_at: new Date().toISOString()
        }
      ], { onConflict: 'endpoint' });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Subscription error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
