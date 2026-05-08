"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export const ThemeColorContext = createContext<{
  color: string;
  setColor: (color: string) => void;
}>({
  color: "#142d53",
  setColor: () => {},
});

export function ThemeColorProvider({ children }: { children: ReactNode }) {
  const [color, setColor] = useState("#142d53");

  useEffect(() => {
    // Solo actualizamos el meta theme-color (controla la barra de estado en iOS)
    // NO tocamos body.style.backgroundColor para no filtrar color al contenido
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.setAttribute('content', color);
  }, [color]);

  return (
    <ThemeColorContext.Provider value={{ color, setColor }}>
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
