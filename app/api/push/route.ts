import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { titulo, mensaje } = await request.json();

    // 0. Inicializar clientes de forma perezosa (solo cuando se llama a la API)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    // Configurar Web Push solo cuando se necesita
    const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BH_P35zpHYXFD-I_YGrPwEKd6MJWxvwb1spwBZgNX01GWX5APZFTab9MwDkcZnTiCizPXTD7W99W08cE7BYXIWY";
    const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || "gP4gIYT-zrHJqA1N93dRTm8moqdOAEmiEzH64esOAlo";

    if (VAPID_PUBLIC && VAPID_PRIVATE) {
      webpush.setVapidDetails(
        'mailto:andreadigitaljobs@gmail.com',
        VAPID_PUBLIC,
        VAPID_PRIVATE
      );
    } else {
      console.warn("VAPID keys missing. Push notification skipped.");
      return NextResponse.json({ success: false, error: "VAPID keys not configured" }, { status: 500 });
    }

    // 1. Obtener todas las suscripciones
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error) throw error;

    console.log(`Enviando push a ${subscriptions?.length || 0} dispositivos...`);

    // 2. Enviar a cada suscripción
    const notifications = (subscriptions || []).map((sub: any) => {
      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.keys_auth,
          p256dh: sub.keys_p256dh
        }
      };

      return webpush.sendNotification(
        pushConfig,
        JSON.stringify({
          title: titulo,
          body: mensaje,
          url: '/' // Puedes cambiar esto para que lleve a una página específica
        })
      ).catch(async (err) => {
        // Si la suscripción ha expirado o es inválida, borrarla
        if (err.statusCode === 410 || err.statusCode === 404) {
          console.log("Subscription expired, deleting...");
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        }
        console.error("Error sending push:", err.message);
      });
    });

    await Promise.all(notifications);

    return NextResponse.json({ success: true, count: notifications.length });
  } catch (error: any) {
    console.error("Push API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
