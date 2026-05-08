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
    // Un delay muy pequeño para asegurar que el componente ya empezó a renderizar
    const timer = setTimeout(() => {
      // Actualizamos el meta tag theme-color
      let metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', color);

      // Actualizamos el color de fondo del body y la variable CSS global
      document.body.style.backgroundColor = color;
      document.documentElement.style.setProperty('--bg', color);
    }, 50);

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
