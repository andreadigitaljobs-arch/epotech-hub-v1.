"use client";

import { 
  Target,
  History, 
  Globe,
  MessageSquare,
  Sparkles,
  Briefcase,
  Video
} from "lucide-react";

interface AdminBottomNavProps {
  activeView: string;
  setActiveView: (view: any) => void;
}

export function AdminBottomNav({ activeView, setActiveView }: AdminBottomNavProps) {
  const tabs = [
    { id: "hedy", name: "Hedy AI", icon: Sparkles },
    { id: "avisos", name: "Avisos", icon: MessageSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-100 bg-white/80 px-4 backdrop-blur-lg md:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${
              isActive ? "text-[var(--accent)]" : "text-gray-400"
            }`}
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
              isActive ? "bg-blue-50" : ""
            }`}>
              <Icon size={isActive ? 20 : 18} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold tracking-tighter ${isActive ? "opacity-100" : "opacity-60"}`}>
              {tab.name}
            </span>
            {isActive && (
              <span className="absolute -top-1 h-1 w-4 rounded-full bg-[var(--accent)]" />
            )}
          </button>
        );
      })}

      {/* Botón Ver App */}
      <a
        href="/"
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-[var(--primary)] transition-all"
      >
        <div className="flex h-8 w-8 items-center justify-center">
          <Globe size={18} />
        </div>
        <span className="text-[10px] font-bold tracking-tighter opacity-60">Ver App</span>
      </a>
    </nav>
  );
}
