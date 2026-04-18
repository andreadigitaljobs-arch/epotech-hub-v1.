"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, Target, Video, Clock, PlaySquare, Briefcase, Sparkles } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Inicio", path: "/", icon: Home },
    { name: "Contenido", path: "/contenido", icon: Sparkles },
    { name: "Avances", path: "/actividad", icon: Clock },
    { name: "Brief", path: "/brief", icon: Target },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-[var(--border)] bg-[var(--surface)] pb-[calc(env(safe-area-inset-bottom,0px)+24px)] pt-3 md:hidden shadow-[0_-8px-24px_rgba(0,0,0,0.06)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.path;

        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={`flex flex-col items-center gap-0.5 p-1.5 transition-colors ${
              isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
            }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                isActive ? "bg-[var(--accent-light)] nav-active-pill" : "bg-transparent"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-medium">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
