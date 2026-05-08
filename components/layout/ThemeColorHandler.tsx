"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const ThemeColorContext = createContext<{
  setColor: (color: string) => void;
}>({
  setColor: () => {},
});

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState("#142d53");

  useEffect(() => {
    // Añadimos un pequeño delay para sincronizar con la animación de fade-in de la página (.25s)
    // Cambiamos el color a mitad de camino para que se sienta atómico
    const timer = setTimeout(() => {
      // Actualizamos el meta tag theme-color
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', color);

      // También actualizamos el color de fondo del body
      document.body.style.backgroundColor = color;
    }, 150);

    return () => clearTimeout(timer);
  }, [color]);

  return (
    <ThemeColorContext.Provider value={{ setColor }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export function useThemeColor(color: string) {
  const { setColor } = useContext(ThemeColorContext);

  useEffect(() => {
    setColor(color);
  }, [color, setColor]);
}
