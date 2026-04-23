"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, Video, Briefcase, PlaySquare, Clock, Sparkles, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";

export function DesktopNav() {
  const pathname = usePathname();

  const primaryNav = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Servicios Activos", path: "/proyectos", icon: Briefcase },
    { name: "Fábrica de Contenido", path: "/contenido", icon: Sparkles },
    { name: "Brief de Marca", path: "/brief", icon: Target },
    { name: "Reporte de Avances", path: "/actividad", icon: Clock },
  ];

  return (
    <aside className="hidden md:flex w-72 flex-col p-6 h-screen sticky top-0 bg-slate-50/50">
      <div className="bg-slate-900 rounded-[2.5rem] flex-1 flex flex-col p-8 shadow-2xl shadow-blue-900/20 border border-white/5 relative overflow-hidden group">
        
        {/* Luces de fondo decorativas */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/30 transition-colors duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-600/10 blur-[50px] rounded-full -ml-12 -mb-12"></div>

        {/* Logo Section */}
        <div className="mb-6 flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000"></div>
            <Image src="/logo.png" alt="Epotech" width={40} height={40} className="rounded-full relative border border-white/20 shadow-2xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black text-white tracking-tighter uppercase italic leading-tight">Epotech <span className="text-blue-400">Hub</span></span>
          </div>
        </div>

        <div className="flex-1 space-y-4 relative z-10 overflow-hidden">
          {/* Principal */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-4">
               <Zap size={10} className="text-blue-500" fill="currentColor" />
               <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Navegación</h3>
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
                        ? "bg-white text-slate-900 shadow-[0_10px_25px_rgba(255,255,255,0.15)] scale-[1.02]"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 w-1 h-4 bg-blue-500 rounded-full -translate-x-1"></div>
                    )}
                    <Icon size={16} className={`transition-all duration-500 ${isActive ? "text-blue-600 scale-110" : "group-hover/item:text-white group-hover/item:rotate-12"}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Academia */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-4">
               <PlaySquare size={10} className="text-emerald-500" fill="currentColor" />
               <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500">Academia</h3>
            </div>
            <nav className="space-y-1">
              <Link
                href="/manual"
                className={`flex items-center gap-4 rounded-2xl px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-500 group/item ${
                  pathname === "/manual"
                    ? "bg-white text-slate-900 shadow-xl scale-[1.02]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Video size={16} className={`${pathname === "/manual" ? "text-blue-600" : "group-hover/item:text-white group-hover/item:scale-110"}`} />
                Guía de Rodaje
              </Link>
              <Link
                href="/referencias"
                className={`flex items-center gap-4 rounded-2xl px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-500 group/item ${
                  pathname === "/referencias"
                    ? "bg-white text-slate-900 shadow-xl scale-[1.02]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <PlaySquare size={16} className={`${pathname === "/referencias" ? "text-blue-600" : "group-hover/item:text-white group-hover/item:scale-110"}`} />
                Inspiración
              </Link>
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
