"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const ThemeColorContext = createContext<{
  color: string;
  setColor: (color: string) => void;
}>({
  color: "#142d53",
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

      // Actualizamos el color de fondo del body (para inmersión en Safari móvil)
      document.body.style.backgroundColor = color;
    }, 50);

    return () => clearTimeout(timer);
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
