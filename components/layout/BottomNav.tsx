"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, Video, Clock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = [
    { name: "Inicio", path: "/", icon: Home },
    { name: "Fábrica", path: "/contenido", icon: Sparkles },
    { name: "Guía", path: "/manual", icon: Video },
    { name: "Avances", path: "/actividad", icon: Clock },
    { name: "Brief", path: "/brief", icon: Target },
  ];

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.path === pathname);
    if (index !== -1) setActiveIndex(index);
  }, [pathname]);

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] px-6 md:hidden pointer-events-none">
      <nav className="mx-auto max-w-[400px] flex items-center justify-around bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-2 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto relative overflow-hidden">
        
        {/* Indicador Líquido de Fondo */}
        <div 
          className="absolute h-12 w-[18%] bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          style={{ 
            left: `${2 + activeIndex * 19.6}%`,
            opacity: activeIndex === -1 ? 0 : 1
          }}
        />

        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = activeIndex === i;

          return (
            <Link
              key={tab.path}
              href={tab.path}
              className="relative flex flex-col items-center justify-center h-16 w-[19%] transition-all duration-300 active:scale-90"
            >
              <div className={`transition-all duration-500 ${isActive ? "text-white -translate-y-2 scale-110" : "text-slate-500"}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {/* Etiqueta del Botón */}
              <span className={`mt-1 text-[8px] font-black uppercase tracking-tighter transition-all duration-500 ${isActive ? "text-white opacity-100" : "text-slate-500 opacity-60"}`}>
                {tab.name}
              </span>
              
              {/* Punto indicador bajo el icono */}
              <div className={`absolute bottom-1 w-1 h-1 rounded-full bg-white transition-all duration-500 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
