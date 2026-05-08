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
