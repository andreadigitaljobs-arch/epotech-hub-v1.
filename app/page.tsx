"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { client, weeklyStats, services } from "@/data/sebastian";
import { 
  ArrowRight, 
  Bell, 
  Calendar, 
  Video, 
  Zap, 
  PlaySquare, 
  Clock,
  ChevronRight,
  Briefcase,
  Target,
  Sparkles
} from "lucide-react";
import { proyectos } from "@/data/proyectos";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { PushNotificationBanner } from "@/components/layout/PushNotificationBanner";

interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  fecha: string;
}

export default function Home() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [projectsCount, setProjectsCount] = useState(0);
  
  const activeServicesCount = services.filter((s) => s.status === "active").length;

  useEffect(() => {
    async function fetchData() {
      // Fetch Notifications
      const { data: nData } = await supabase
        .from("notificaciones")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (nData) setNotificaciones(nData);

      // Fetch Real Metrics
      const { data: sData } = await supabase.from("weekly_stats").select("*").single();
      if (sData) setStats(sData);

      // Fetch Project Count
      const { data: pData } = await supabase.from("proyectos").select("id");
      if (pData) setProjectsCount(pData.length);

      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="relative">
            <Image src="/logo.png" alt="Epotech Solutions" width={52} height={52} className="rounded-full md:hidden border-2 border-[var(--accent-light)]" />
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[var(--success)] border-2 border-white flex items-center justify-center">
               <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[var(--primary)] md:text-3xl">
              ¡Hola, {client.name}! <span className="animate-bounce inline-block">👋</span>
            </h1>
            <p className="text-sm font-bold text-[var(--accent)] md:text-base">
              Hoy es un gran día para hacer crecer a {client.businessName}
            </p>
          </div>
        </div>
      </header>

      <PushNotificationBanner />

      {/* Week Summary */}
      <section>
        <div className="mb-4">
          <h2 className="font-bold text-[var(--primary)] flex items-center gap-2">
            <Calendar size={18} className="text-[var(--accent)]" />
            Nuestro Avance Semanal
            <span className="text-[9px] font-black text-white bg-[var(--accent)] px-2 py-0.5 rounded-full">EN TIEMPO REAL</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          <Link href="/actividad" className="contents">
            <Card padding="sm" className="bg-[var(--accent-light)] border-[var(--accent)]/20 card-hover cursor-pointer relative group">
              <div className="text-2xl font-black text-[var(--primary)] text-center md:text-left">
                {loading ? "..." : (stats?.publicaciones || 0)} <span className="text-sm font-bold text-[var(--text-muted)]">/ {stats?.publicaciones_target || 5}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Publicaciones</div>
                <ChevronRight size={14} className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          </Link>
          
          <Link href="/referencias" className="contents">
            <Card padding="sm" className="card-hover cursor-pointer group">
              <div className="text-2xl font-black text-[var(--primary)] text-center md:text-left">
                {loading ? "..." : (stats?.reels || 0)} <span className="text-sm font-bold text-[var(--text-muted)]">/ {stats?.reels_target || 3}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Reels</div>
                <ChevronRight size={14} className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          </Link>
          
          <Link href="/referencias" className="contents">
            <Card padding="sm" className="card-hover cursor-pointer group">
              <div className="text-2xl font-black text-[var(--primary)] text-center md:text-left">
                {loading ? "..." : (stats?.carruseles || 0)} <span className="text-sm font-bold text-[var(--text-muted)]">/ {stats?.carruseles_target || 2}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Carruseles</div>
                <ChevronRight size={14} className="text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Card>
          </Link>

          <Link href="/proyectos" className="contents">
            <Card padding="sm" className="bg-blue-50 border-blue-100 card-hover cursor-pointer group ring-2 ring-blue-200 ring-offset-2 animate-pulse-subtle">
              <div className="text-2xl font-black text-[var(--primary)] text-center md:text-left">
                {loading ? "..." : projectsCount}
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-wider">Proyectos Activos</div>
                <div className="flex items-center gap-1 text-[8px] font-black text-[var(--accent)] uppercase animate-bounce-x">
                   Tocar <ChevronRight size={12} />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>


      <section className="py-2">
        <h2 className="font-bold text-[var(--primary)] mb-3 flex items-center gap-2">
          🎯 ¿Qué quieres revisar hoy?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/contenido" className="group sm:col-span-3">
            <Card className="h-full !bg-amber-500 text-white hover:!bg-amber-600 !border-transparent card-hover p-8 shadow-xl shadow-amber-500/20 ring-4 ring-amber-100 ring-offset-4 animate-pulse-subtle">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-6">
                   <div className="bg-white/20 p-4 rounded-[2rem]">
                     <Sparkles size={32} className="text-white" />
                   </div>
                   <div>
                     <h3 className="font-black text-2xl tracking-tight">Guía del Día</h3>
                     <p className="text-xs font-bold text-white/90 mt-1 uppercase tracking-widest">Toca aquí para saber qué grabar hoy</p>
                   </div>
                 </div>
                 <ArrowRight size={28} className="text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all" />
               </div>
            </Card>
          </Link>

          <Link href="/manual" className="group">
            <Card className="h-full !bg-[var(--primary)] text-white hover:!bg-[var(--primary-light)] !border-transparent card-hover">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="bg-white/20 p-2 rounded-xl">
                     <Video size={20} className="text-white" />
                   </div>
                   <div>
                     <h3 className="font-black text-sm">Cómo Grabar</h3>
                     <p className="text-[10px] font-bold text-white/80 mt-0.5 uppercase">Manual de Calidad</p>
                   </div>
                 </div>
               </div>
            </Card>
          </Link>
          
          <Link href="/proyectos" className="group">
            <Card className="h-full !bg-slate-950 text-white hover:!bg-slate-900 !border-transparent card-hover">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="bg-white/10 p-2 rounded-xl border border-white/5">
                     <Briefcase size={20} className="text-white" />
                   </div>
                   <div>
                     <h3 className="font-black text-sm">Proyectos Activos</h3>
                     <p className="text-[10px] font-bold text-white/80 mt-0.5 uppercase">Landing Page, CRM y más</p>
                   </div>
                 </div>
                 <ArrowRight size={18} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
               </div>
            </Card>
          </Link>

          <Link href="/referencias" className="group">
            <Card className="h-full !bg-[var(--accent)] text-white hover:!bg-[var(--accent-dark)] !border-transparent card-hover">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="bg-white/20 p-2 rounded-xl">
                     <PlaySquare size={20} className="text-white" />
                   </div>
                   <div>
                     <h3 className="font-black text-sm">Inspiración</h3>
                     <p className="text-[10px] font-bold text-white/80 mt-0.5 uppercase">Referencia y Videos Virales</p>
                   </div>
                 </div>
                 <ArrowRight size={18} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
               </div>
            </Card>
          </Link>

          <Link href="/actividad" className="group">
            <Card className="h-full !bg-slate-800 text-white hover:!bg-slate-900 !border-transparent card-hover">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="bg-white/20 p-2 rounded-xl">
                     <Clock size={20} className="text-white" />
                   </div>
                   <div>
                     <h3 className="font-black text-sm">Historial</h3>
                     <p className="text-[10px] font-bold text-white/80 mt-0.5 uppercase">Qué hemos hecho</p>
                   </div>
                 </div>
                 <ArrowRight size={18} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
               </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Announcements */}
      <section className="pb-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[var(--accent)]" />
            <h2 className="font-black text-[var(--primary)]">Mensajes del Equipo</h2>
          </div>
        </div>
        
        <div className="space-y-4">
          {loading ? (
             <Card className="flex flex-col items-center justify-center p-8 border-dashed border-2">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent mb-2" />
                <p className="text-xs font-bold text-[var(--text-muted)] animate-pulse">Sincronizando avisos...</p>
             </Card>
          ) : notificaciones.length > 0 ? (
            notificaciones.map((announcement) => (
              <Card key={announcement.id} className="border-l-4 border-l-[var(--accent)] overflow-hidden relative">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded bg-[var(--accent-light)] text-[var(--accent-dark)]">
                    {announcement.tipo}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg)] px-2 py-0.5 rounded-full">{announcement.fecha}</span>
                </div>
                <h3 className="font-black text-[var(--primary)] mb-2 text-base">
                  {announcement.titulo}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-medium">
                  {announcement.mensaje}
                </p>
              </Card>
            ))
          ) : (
            <Card className="text-center py-10 border-2 border-dashed border-[var(--border)]">
               <div className="bg-[var(--bg)] h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell size={24} className="text-[var(--text-muted)] opacity-50" />
               </div>
               <p className="text-sm font-bold text-[var(--text-muted)]">Sin avisos recientes por ahora.</p>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
