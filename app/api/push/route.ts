import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@supabase/supabase-js";

type PushResult = {
  id: string;
  endpointHost: string;
  success: boolean;
  deleted?: boolean;
  error?: string;
  statusCode?: number;
};

export async function POST(request: Request) {
  try {
    const { titulo, mensaje } = await request.json();

    if (!titulo || !mensaje) {
      return NextResponse.json(
        { success: false, error: "Missing notification title or message" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY;

    if (!supabaseUrl || !supabaseKey || !vapidPublic || !vapidPrivate) {
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    webpush.setVapidDetails(
      "mailto:andreadigitaljobs@gmail.com",
      vapidPublic,
      vapidPrivate
    );

    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("*");

    if (error) throw error;

    if (!subscriptions?.length) {
      return NextResponse.json({
        success: false,
        error: "No hay dispositivos suscritos para recibir push.",
        count: 0,
        sent: 0,
        failed: 0,
        deleted: 0,
        results: [],
      });
    }

    const notifications = subscriptions.map(async (sub: any): Promise<PushResult> => {
      let endpointHost = "unknown";
      try {
        endpointHost = new URL(sub.endpoint).host;
      } catch {
        endpointHost = "invalid-url";
      }

      const pushConfig = {
        endpoint: sub.endpoint,
        keys: {
          auth: sub.keys_auth,
          p256dh: sub.keys_p256dh,
        },
      };

      try {
        await webpush.sendNotification(
          pushConfig,
          JSON.stringify({
            title: titulo,
            body: mensaje,
            url: "/",
          })
        );

        return {
          id: sub.id,
          endpointHost,
          success: true,
        };
      } catch (err: any) {
        let deleted = false;
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
          deleted = true;
        }

        console.error("Error sending push:", err.message);
        return {
          id: sub.id,
          endpointHost,
          success: false,
          deleted,
          error: err.message,
          statusCode: err.statusCode,
        };
      }
    });

    const results = await Promise.all(notifications);
    const sent = results.filter((result) => result.success).length;
    const failed = results.length - sent;
    const deleted = results.filter((result) => result.deleted).length;

    return NextResponse.json({
      success: sent > 0 && failed === 0,
      count: results.length,
      sent,
      failed,
      deleted,
      results,
    });
  } catch (error: any) {
    console.error("Push API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
