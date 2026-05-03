"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function NotificationListener() {
  useEffect(() => {
    const channel = supabase
      .channel("realtime_notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notificaciones" },
        (payload) => {
          console.log("Nueva notificacion registrada:", payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
