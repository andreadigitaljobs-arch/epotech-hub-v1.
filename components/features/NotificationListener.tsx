"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function NotificationListener() {
  useEffect(() => {
    // 1. Solicitar permiso para notificaciones
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    // 2. Suscribirse a cambios en la tabla de notificaciones
    const channel = supabase
      .channel("realtime_notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notificaciones" },
        (payload) => {
          const newNotif = payload.new;
          
          // Mostrar notificación nativa si tenemos permiso
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(newNotif.titulo, {
              body: newNotif.mensaje,
              icon: "/logo.png", // Asegúrate de que esta ruta sea correcta
            });
          }
          
          // Opcional: Sonido de notificación
          try {
            const audio = new Audio("/notification-sound.mp3"); // Si tienes un archivo de sonido
            audio.play();
          } catch (e) {
            console.log("Audio play blocked by browser");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null; // Este componente no renderiza nada, solo escucha
}
