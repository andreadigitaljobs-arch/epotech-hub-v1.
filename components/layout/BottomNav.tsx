"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, Sparkles, Briefcase, PlaySquare, BookOpen, CalendarDays, MoreHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const mainTabs = [
    { name: "Academia", path: "/", icon: BookOpen },
    { name: "Servicios", path: "/proyectos", icon: Briefcase },
    { name: "Contenido", path: "/contenido", icon: Sparkles },
    { name: "Calendario", path: "/calendario", icon: CalendarDays },
  ];

  const moreTabs = [
    { name: "Inspiración", path: "/referencias", icon: PlaySquare },
    { name: "Brief", path: "/brief", icon: Target },
  ];

  const allPaths = [...mainTabs, ...moreTabs].map(t => t.path);
  const isMoreActive = moreTabs.some(t => t.path === pathname);

  useEffect(() => { setMoreOpen(false); }, [pathname]);

  return (
    <>
      {/* POPUP "MÁS" */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-[99] md:hidden"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 flex justify-end px-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-[#0c192c]/98 border border-slate-700/60 rounded-3xl p-3 shadow-2xl backdrop-blur-xl flex flex-col gap-1 min-w-[160px] animate-in slide-in-from-bottom-2 duration-200">
              {moreTabs.map(tab => {
                const Icon = tab.icon;
                const isActive = pathname === tab.path;
                return (
                  <Link
                    key={tab.path}
                    href={tab.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all active:scale-95 ${isActive ? "bg-[#48c1d2]/15 text-[#48c1d2]" : "text-slate-300 hover:bg-white/5"}`}
                    onClick={() => setMoreOpen(false)}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{tab.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden bg-[#0c192c]/95 backdrop-blur-xl border-t border-slate-800/80 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
        <nav className="flex items-center justify-around h-16 w-full max-w-lg mx-auto">

          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.path;
            return (
              <Link
                key={tab.path}
                href={tab.path}
                onClick={() => { setMoreOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-95"
              >
                <div className={`absolute top-0 w-8 h-[3px] rounded-b-full bg-[#48c1d2] transition-all duration-300 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`} />
                <div className={`transition-all duration-300 flex items-center justify-center ${isActive ? "text-[#48c1d2] scale-110" : "text-slate-400"}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`mt-1 text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? "text-[#48c1d2]" : "text-slate-500 text-[8px]"}`}>
                  {tab.name}
                </span>
              </Link>
            );
          })}

          {/* BOTÓN MÁS */}
          <button
            onClick={() => setMoreOpen(o => !o)}
            className="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-95"
          >
            <div className={`absolute top-0 w-8 h-[3px] rounded-b-full bg-[#48c1d2] transition-all duration-300 ${isMoreActive || moreOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`} />
            <div className={`transition-all duration-300 flex items-center justify-center ${isMoreActive || moreOpen ? "text-[#48c1d2] scale-110" : "text-slate-400"}`}>
              {moreOpen ? <X size={20} strokeWidth={2.5} /> : <MoreHorizontal size={20} strokeWidth={2} />}
            </div>
            <span className={`mt-1 text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${isMoreActive || moreOpen ? "text-[#48c1d2]" : "text-slate-500 text-[8px]"}`}>
              Más
            </span>
          </button>

        </nav>
      </div>
    </>
  );
}
