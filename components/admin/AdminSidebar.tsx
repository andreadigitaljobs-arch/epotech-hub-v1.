"use client";

import { 
  LayoutDashboard, 
  Briefcase, 
  Target, 
  Video, 
  History, 
  MessageSquare, 
  Lock,
  PlusCircle,
  BarChart3,
  Globe,
  Sparkles
} from "lucide-react";
import Image from "next/image";

interface AdminSidebarProps {
  activeView: string;
  setActiveView: (view: any) => void;
  onLogout: () => void;
}

export function AdminSidebar({ activeView, setActiveView, onLogout }: AdminSidebarProps) {
  const menuItems = [
    { id: "hedy", name: "Hedy: Asistente IA", icon: Sparkles },
    { id: "avisos", name: "Notificaciones", icon: MessageSquare },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[var(--border)] bg-white p-6 md:flex z-40">
      <div className="mb-10 flex items-center gap-3">
        <div className="bg-[var(--primary)] p-2 rounded-xl shadow-lg shadow-blue-900/20">
          <Image src="/logo.png" alt="Epotech" width={32} height={32} className="rounded-full invert" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-[var(--primary)] leading-tight">Admin Hub</span>
          <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest">Epotech 3.0</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? "bg-[var(--primary)] text-white shadow-md translate-x-1"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--primary)]"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 space-y-2 border-t border-[var(--border)]">
        <a
          href="/"
          className="flex w-full items-center gap-3 rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-4 py-3 text-sm font-black text-[var(--primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all shadow-sm group"
        >
          <Globe size={18} className="group-hover:rotate-12 transition-transform" />
          Vista Pública
        </a>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
        >
          <Lock size={18} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
