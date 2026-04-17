import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { titulo, mensaje, url = "/" } = await req.json();

    // 1. Get all subscriptions
    const { data: subscriptions, error } = await supabaseAdmin
      .from("push_subscriptions")
      .select("*");

    if (error) throw error;

    // 2. Send pushes
    const notifications = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.keys_p256dh,
          auth: sub.keys_auth,
        },
      };

      try {
        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify({
            title: titulo,
            body: mensaje,
            url: url,
          })
        );
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          // Subscription expired or gone, remove it
          console.log("Removing expired subscription:", sub.id);
          await supabaseAdmin.from("push_subscriptions").delete().eq("id", sub.id);
        } else {
          console.error("Error sending push:", err);
        }
      }
    });

    await Promise.all(notifications);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Push API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
