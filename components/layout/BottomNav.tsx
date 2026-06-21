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
          className="fixed z-[99] md:hidden right-4"
          style={{
            bottom: `calc(4.8rem + env(safe-area-inset-bottom))`,
            transition: "opacity 0.22s cubic-bezier(0.4,0,0.2,1), transform 0.22s cubic-bezier(0.4,0,0.2,1)",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.94)",
            transformOrigin: "bottom right",
            minWidth: 210,
          }}
        >
          <div style={{
            background: "rgba(10,22,44,0.97)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(72,193,210,0.08)",
          }}>
            {moreTabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.path;
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  onClick={closeMore}
                  className="flex items-center gap-3 px-4 py-4 transition-all active:scale-[0.97]"
                  style={{
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    background: isActive ? "rgba(72,193,210,0.1)" : "transparent",
                    color: isActive ? "#48c1d2" : "rgba(255,255,255,0.85)",
                  }}
                >
                  <div style={{
                    width: 34, height: 34,
                    borderRadius: 10,
                    background: isActive ? "rgba(72,193,210,0.18)" : "rgba(255,255,255,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    {tab.name}
                  </span>
                  {isActive && (
                    <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#48c1d2" }} />
                  )}
                </Link>
              );
            })}
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
