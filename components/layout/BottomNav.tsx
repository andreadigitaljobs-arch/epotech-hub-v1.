"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, Video, Clock, Sparkles, Briefcase, PlaySquare } from "lucide-react";
import { useEffect, useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = [
    { name: "Servicios", path: "/proyectos", icon: Briefcase },
    { name: "Contenido", path: "/contenido", icon: Sparkles },
    { name: "Grabación", path: "/manual", icon: Video },
    { name: "Inspiración", path: "/referencias", icon: PlaySquare },
    { name: "Brief", path: "/brief", icon: Target },
  ];

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.path === pathname);
    if (index !== -1) setActiveIndex(index);
  }, [pathname]);

  return (
    <div className="fixed bottom-6 left-0 right-0 z-[100] px-6 md:hidden pointer-events-none">
      <nav className="mx-auto max-w-[420px] flex bg-slate-900/95 backdrop-blur-2xl border border-white/10 p-3 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto relative overflow-hidden">
        
        {/* Area del Indicador: Sincronizada con el padding p-3 (12px) */}
        <div className="absolute inset-y-0 left-3 right-3 pointer-events-none">
          <div 
            className="absolute inset-y-0 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]"
            style={{ 
              left: `${activeIndex * 20}%`,
              width: "20%",
              opacity: activeIndex === -1 ? 0 : 1
            }}
          >
            <div className="h-[75%] w-[85%] bg-gradient-to-tr from-[#48c1d2] to-[#35a5b5] rounded-full shadow-[0_10px_25px_rgba(72,193,210,0.4)]" />
          </div>
        </div>

        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = activeIndex === i;

          return (
            <Link
              key={tab.path}
              href={tab.path}
              className="relative flex-1 flex flex-col items-center justify-center h-14 transition-all duration-300 active:scale-95"
            >
              <div className={`transition-all duration-500 z-10 flex items-center justify-center ${isActive ? "text-white scale-110" : "text-slate-500"}`}>
                <Icon size={isActive ? 22 : 20} strokeWidth={isActive ? 3 : 2} />
              </div>
              
              {/* Etiqueta del Botón */}
              <span className={`mt-1 text-[8px] font-black uppercase tracking-tight transition-all duration-500 z-10 ${isActive ? "text-white opacity-100" : "text-slate-500 opacity-60"}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
