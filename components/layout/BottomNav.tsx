"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, Sparkles, Briefcase, PlaySquare, BookOpen, CalendarDays, MoreHorizontal, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMore = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMoreOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  };

  const closeMore = () => {
    setVisible(false);
    closeTimer.current = setTimeout(() => setMoreOpen(false), 260);
  };

  const toggleMore = () => (moreOpen ? closeMore() : openMore());

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

  const isMoreActive = moreTabs.some(t => t.path === pathname);

  useEffect(() => { closeMore(); }, [pathname]);

  return (
    <>
      {/* OVERLAY */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-[98] md:hidden"
          style={{
            transition: "opacity 0.25s",
            opacity: visible ? 1 : 0,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: visible ? "blur(2px)" : "none",
          }}
          onClick={closeMore}
        />
      )}

      {/* PANEL "MÁS" */}
      {moreOpen && (
        <div
          className="fixed z-[99] md:hidden right-3"
          style={{
            bottom: `calc(4.6rem + env(safe-area-inset-bottom))`,
            transition: "opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)",
            transformOrigin: "bottom right",
          }}
        >
          <div className="bg-[#0c1f3a]/98 border border-white/10 rounded-3xl shadow-2xl overflow-hidden" style={{ minWidth: 200 }}>
            {moreTabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  onClick={closeMore}
                  className={`flex items-center gap-3 px-5 py-4 transition-all active:scale-[0.97] ${
                    isActive ? "text-[#48c1d2] bg-[#48c1d2]/10" : "text-white/80 hover:bg-white/5"
                  } ${i > 0 ? "border-t border-white/5" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? "bg-[#48c1d2]/20" : "bg-white/8"
                  }`}
                    style={{ background: isActive ? "rgba(72,193,210,0.2)" : "rgba(255,255,255,0.05)" }}
                  >
                    <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-widest">{tab.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#48c1d2]" />
                  )}
                </Link>
              );
            })}
          </div>
          {/* Flechita apuntando a "Más" */}
          <div
            className="absolute -bottom-[7px] right-[28px] w-3.5 h-3.5 bg-[#0c1f3a] border-r border-b border-white/10 rotate-45"
          />
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
                onClick={() => { closeMore(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
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
            onClick={toggleMore}
            className="relative flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 active:scale-95"
          >
            <div className={`absolute top-0 w-8 h-[3px] rounded-b-full bg-[#48c1d2] transition-all duration-300 ${isMoreActive || moreOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`} />
            <div className={`transition-all duration-300 flex items-center justify-center ${isMoreActive || moreOpen ? "text-[#48c1d2] scale-110" : "text-slate-400"}`}
              style={{ transition: "transform 0.2s, color 0.2s" }}>
              <div style={{ transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1)", transform: moreOpen ? "rotate(90deg)" : "rotate(0deg)" }}>
                {moreOpen ? <X size={20} strokeWidth={2.5} /> : <MoreHorizontal size={20} strokeWidth={2} />}
              </div>
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
