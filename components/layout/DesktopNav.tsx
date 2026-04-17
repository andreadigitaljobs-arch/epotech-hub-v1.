"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, Target, Video, Briefcase, PlaySquare, Calendar, Clock } from "lucide-react";
import Image from "next/image";

export function DesktopNav() {
  const pathname = usePathname();

  const primaryNav = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Servicios Activos", path: "/proyectos", icon: Briefcase },
    { name: "Brief de Marca", path: "/brief", icon: Target },
    { name: "Reporte de Avances", path: "/actividad", icon: Clock },
  ];

  const contentNav = [
    { name: "Guía de Grabación", path: "/manual", icon: Video },
    { name: "Inspiración", path: "/referencias", icon: PlaySquare },
  ];

  return (
    <aside className="hidden w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] p-6 md:flex">
      <div className="mb-10 flex items-center gap-3">
        <Image src="/logo.png" alt="Epotech Solutions" width={44} height={44} className="rounded-full" />
        <span className="text-xl font-bold text-[var(--primary)] text-nowrap">Epotech Hub</span>
      </div>

      <div className="flex-1 space-y-8">
        <div>
          <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Principal
          </h3>
          <nav className="space-y-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-light)] text-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Creación de Contenido
          </h3>
          <nav className="space-y-1">
            {contentNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[var(--accent-light)] text-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--text-main)]"
                  }`}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

    </aside>
  );
}
