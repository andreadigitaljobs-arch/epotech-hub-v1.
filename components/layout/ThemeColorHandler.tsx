"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ThemeColorHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Definimos los colores por ruta
    const themeColors: Record<string, string> = {
      "/": "#142d53",           // Academia (Navy)
      "/referencias": "#0a192f", // Inspiración (Dark Navy)
      "/contenido": "#F0F4F8",   // Contenido (Light Gray/Blue)
      "/proyectos": "#F0F4F8",   // Proyectos (Light)
      "/manual": "#142d53",      // Grabación (Navy)
      "/brief": "#0a192f",       // Brief (Dark Navy)
    };

    const color = themeColors[pathname] || "#142d53";
    
    // Actualizamos el meta tag theme-color
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', color);

    // También actualizamos el color de fondo del body para evitar flashes al hacer scroll
    document.body.style.backgroundColor = color;

  }, [pathname]);

  return null;
}
