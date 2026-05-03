import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    if (!subscription?.endpoint || !subscription?.keys?.auth || !subscription?.keys?.p256dh) {
      return NextResponse.json(
        { success: false, error: "Invalid subscription object" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables");
      return NextResponse.json(
        { success: false, error: "Server configuration error: Missing DB credentials" },
        { status: 500 }
      );
    }

    let endpointHost = "unknown";
    try {
      endpointHost = new URL(subscription.endpoint).host;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid endpoint URL" },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase
      .from("push_subscriptions")
      .upsert(
        [
          {
            endpoint: subscription.endpoint,
            keys_auth: subscription.keys.auth,
            keys_p256dh: subscription.keys.p256dh,
            user_id: subscription.user_id || "sebastian",
          },
        ],
        { onConflict: "endpoint" }
      );

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, endpointHost, data });
  } catch (err: any) {
    console.error("General API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
