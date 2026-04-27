"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, Video, Briefcase, PlaySquare, Clock, Sparkles, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

export function DesktopNav() {
  const pathname = usePathname();

  const primaryNav = [
    { name: "Servicios", path: "/proyectos", icon: Briefcase },
    { name: "Contenido", path: "/contenido", icon: Sparkles },
    { name: "Grabación", path: "/manual", icon: Video },
    { name: "Inspiración", path: "/referencias", icon: PlaySquare },
    { name: "Brief", path: "/brief", icon: Target },
  ];

  return (
    <aside className="hidden md:flex w-72 flex-col p-6 h-screen sticky top-0 bg-slate-50/50">
      <div className="bg-[#142d53] rounded-[2.5rem] flex-1 flex flex-col p-8 shadow-2xl shadow-[#142d53]/20 border border-white/5 relative overflow-hidden group">
        
        {/* Luces de fondo decorativas */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#48c1d2]/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-[#48c1d2]/30 transition-colors duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/10 blur-[50px] rounded-full -ml-12 -mb-12"></div>

        {/* Logo Section */}
        <div className="mb-6 flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-[#48c1d2] to-purple-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
            <Image src="/logo.png" alt="Epotech" width={40} height={40} className="rounded-full relative border border-white/20 shadow-2xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-white tracking-tighter uppercase italic leading-tight">Epotech <span className="text-[#48c1d2]">Hub</span></span>
          </div>
        </div>

        <div className="flex-1 space-y-4 relative z-10 overflow-hidden">
          {/* Principal */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-4">
               <Zap size={10} className="text-[#48c1d2]" fill="currentColor" />
               <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500/80">Menú</h3>
            </div>
            <nav className="space-y-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-4 rounded-2xl px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-500 group/item relative ${
                      isActive
                        ? "bg-white text-[#142d53] shadow-[0_10px_25px_rgba(72,193,210,0.2)] scale-[1.02]"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 w-1 h-4 bg-[#48c1d2] rounded-full -translate-x-1"></div>
                    )}
                    <Icon size={16} className={`transition-all duration-500 ${isActive ? "text-[#48c1d2] scale-110" : "group-hover/item:text-white group-hover/item:rotate-12"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Master Panel Section */}
        <div className="mt-4 pt-4 border-t border-white/5 relative z-10">
          <Link
            href="/master"
            className={`flex items-center gap-4 rounded-2xl px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group/master ${
              pathname === "/master"
                ? "bg-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.3)]"
                : "text-red-400 bg-red-400/5 hover:bg-red-600 hover:text-white"
            }`}
          >
            <ShieldCheck size={18} className="group-hover/master:rotate-[360deg] transition-transform duration-1000" />
            Control Master
          </Link>
        </div>
      </div>
    </aside>
  );
}
