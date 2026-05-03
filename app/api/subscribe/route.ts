import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const subscription = await request.json();
    console.log("Incoming subscription:", JSON.stringify(subscription));

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json({ success: false, error: "Invalid subscription object" }, { status: 400 });
    }
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json({ 
        success: false, 
        error: "Server configuration error: Missing DB credentials" 
      }, { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extraer keys con seguridad
    const keys_auth = subscription.keys?.auth || '';
    const keys_p256dh = subscription.keys?.p256dh || '';

    // Guardar la suscripción en la tabla 'push_subscriptions'
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert([
        { 
          endpoint: subscription.endpoint,
          keys_auth: keys_auth,
          keys_p256dh: keys_p256dh,
          updated_at: new Date().toISOString()
        }
      ], { onConflict: 'endpoint' });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("General API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
