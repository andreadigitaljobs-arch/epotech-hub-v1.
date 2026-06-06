"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, Video, Clock, Sparkles, Briefcase, PlaySquare, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  const tabs = [
    { name: "Academia", path: "/", icon: BookOpen },
    { name: "Servicios", path: "/proyectos", icon: Briefcase },
    { name: "Contenido", path: "/contenido", icon: Sparkles },
    { name: "Inspiración", path: "/referencias", icon: PlaySquare },
    { name: "Brief", path: "/brief", icon: Target },
  ];

  useEffect(() => {
    const index = tabs.findIndex(tab => tab.path === pathname);
    setActiveIndex(index);
  }, [pathname]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-[#0c192c]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
      <nav className="flex items-center justify-around h-16 w-full max-w-lg mx-auto">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          const isActive = activeIndex === i;

          return (
            <Link
              key={tab.path}
              href={tab.path}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-95"
            >
              {/* Indicador premium superior tipo barra corta */}
              <div 
                className={`absolute top-0 w-8 h-[3px] rounded-b-full bg-[#48c1d2] transition-all duration-300 ${
                  isActive ? "opacity-100 transform translate-y-0" : "opacity-0 transform -translate-y-1"
                }`} 
              />
              
              <div className={`transition-all duration-300 flex items-center justify-center ${isActive ? "text-[#48c1d2] scale-110" : "text-slate-400 hover:text-slate-300"}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              
              {/* Etiqueta del Botón */}
              <span className={`mt-1 text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? "text-[#48c1d2]" : "text-slate-500 text-[8px]"}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
