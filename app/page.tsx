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

import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Home() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [projectsCount, setProjectCount] = useState(0);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00'); // Ensure local time
      return date.toLocaleDateString("es-ES", { day: 'numeric', month: 'short' }).replace('.', '');
    } catch (e) {
      return dateStr;
    }
  };
  
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
      if (pData) setProjectCount(pData.length);

      // Fetch Real Content Counts for the Week
      const { data: rData } = await supabase.from("registro_publicaciones").select("tipo");
      if (rData) {
        const counts = {
          reels: rData.filter(r => r.tipo === 'REEL' || r.tipo === 'TIKTOK').length,
          carruseles: rData.filter(r => r.tipo === 'CARRUSEL').length,
          posts: rData.filter(r => r.tipo === 'POST').length,
          total: rData.length
        };
        // Update stats with real counts
        setStats((prev: any) => ({
          ...prev,
          reels: counts.reels,
          carruseles: counts.carruseles,
          publicaciones: counts.total,
          publicaciones_target: 5,
          reels_target: 3,
          carruseles_target: 2
        }));
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Sincronizando Dashboard..." />;

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
              ¡Hola, {client.name}! <span className="animate-bounce inline-block">👋🏻</span>
            </h1>
            <p className="text-sm font-bold text-[var(--accent)] md:text-base">
              Hoy es un gran día para hacer crecer a {client.businessName}
            </p>
          </div>
        </div>
      </header>

      <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
            <Zap size={20} className="fill-amber-600" />
          </div>
          <h2 className="font-black text-xl text-[var(--primary)] tracking-tight">
            ¿Qué trabajo tienes hoy?
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Link href="/contenido?type=presion" className="group">
            <div className="bg-blue-50 hover:bg-blue-600 p-6 rounded-[2rem] transition-all duration-300 border border-blue-100 group-hover:border-transparent cursor-pointer">
              <div className="bg-white p-3 rounded-2xl w-fit mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Sparkles size={24} className="text-blue-600" />
              </div>
              <span className="block font-black text-[var(--primary)] group-hover:text-white transition-colors text-lg">Presión</span>
              <span className="block text-[10px] font-bold text-blue-400 group-hover:text-blue-100 uppercase tracking-widest mt-1">Siding & Driveways</span>
            </div>
          </Link>

          <Link href="/contenido?type=ventanas" className="group">
            <div className="bg-emerald-50 hover:bg-emerald-600 p-6 rounded-[2rem] transition-all duration-300 border border-emerald-100 group-hover:border-transparent cursor-pointer">
              <div className="bg-white p-3 rounded-2xl w-fit mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Video size={24} className="text-emerald-600" />
              </div>
              <span className="block font-black text-[var(--primary)] group-hover:text-white transition-colors text-lg">Ventanas</span>
              <span className="block text-[10px] font-bold text-emerald-400 group-hover:text-emerald-100 uppercase tracking-widest mt-1">Interior & Exterior</span>
            </div>
          </Link>

          <Link href="/contenido?type=epoxy" className="group">
            <div className="bg-purple-50 hover:bg-purple-600 p-6 rounded-[2rem] transition-all duration-300 border border-purple-100 group-hover:border-transparent cursor-pointer">
              <div className="bg-white p-3 rounded-2xl w-fit mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Zap size={24} className="text-purple-600" />
              </div>
              <span className="block font-black text-[var(--primary)] group-hover:text-white transition-colors text-lg">Epoxy</span>
              <span className="block text-[10px] font-bold text-purple-400 group-hover:text-purple-100 uppercase tracking-widest mt-1">Garage Floors</span>
            </div>
          </Link>

          <Link href="/referencias" className="group">
            <div className="bg-slate-50 hover:bg-slate-900 p-6 rounded-[2rem] transition-all duration-300 border border-slate-200 group-hover:border-transparent cursor-pointer">
              <div className="bg-white p-3 rounded-2xl w-fit mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <PlaySquare size={24} className="text-slate-600" />
              </div>
              <span className="block font-black text-[var(--primary)] group-hover:text-white transition-colors text-lg">Inspiración</span>
              <span className="block text-[10px] font-bold text-slate-400 group-hover:text-slate-300 uppercase tracking-widest mt-1">Ver qué funciona</span>
            </div>
          </Link>
        </div>
      </section>

      {/* Week Summary with Bars */}
      <section>
        <div className="mb-4">
          <h2 className="font-bold text-[var(--primary)] flex items-center gap-2">
            <Calendar size={18} className="text-[var(--accent)]" />
            Nuestro Avance Semanal
          </h2>
        </div>
        
        <Card className="p-6 space-y-6 bg-slate-50/50 border-none">
          {/* Progress Item: Total */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Publicaciones Totales</span>
              <span className="text-sm font-black text-[var(--primary)]">{stats?.publicaciones || 0} / {stats?.publicaciones_target || 5}</span>
            </div>
            <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-slate-100">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min(((stats?.publicaciones || 0) / (stats?.publicaciones_target || 5)) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Reels</span>
                <span className="text-xs font-black text-[var(--primary)]">{stats?.reels || 0}/3</span>
              </div>
              <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                <div 
                  className="h-full bg-[var(--accent)] rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(((stats?.reels || 0) / 3) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Carruseles</span>
                <span className="text-xs font-black text-[var(--primary)]">{stats?.carruseles || 0}/2</span>
              </div>
              <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-100">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min(((stats?.carruseles || 0) / 2) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="py-2">
        <h2 className="font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
          📚 Acciones de Apoyo
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/manual" className="group">
            <Card className="h-full !bg-white hover:!bg-slate-50 card-hover p-5 border-slate-100">
              <div className="bg-slate-100 p-3 rounded-2xl w-fit mb-3">
                <Video size={20} className="text-slate-600" />
              </div>
              <h3 className="font-black text-sm text-[var(--primary)]">Cómo Grabar</h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1 uppercase tracking-wider">Manual de Calidad</p>
            </Card>
          </Link>
          
          <Link href="/brief" className="group">
            <Card className="h-full !bg-white hover:!bg-slate-50 card-hover p-5 border-slate-100">
              <div className="bg-blue-50 p-3 rounded-2xl w-fit mb-3">
                <Target size={20} className="text-blue-600" />
              </div>
              <h3 className="font-black text-sm text-[var(--primary)]">Mi Brief</h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1 uppercase tracking-wider">Estrategia Viral</p>
            </Card>
          </Link>

          <Link href="/proyectos" className="group">
            <Card className="h-full !bg-white hover:!bg-slate-50 card-hover p-5 border-slate-100">
              <div className="bg-emerald-50 p-3 rounded-2xl w-fit mb-3">
                <Briefcase size={20} className="text-emerald-600" />
              </div>
              <h3 className="font-black text-sm text-[var(--primary)]">Servicios</h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1 uppercase tracking-wider">Dashboard Técnico</p>
            </Card>
          </Link>

          <Link href="/actividad" className="group">
            <Card className="h-full !bg-white hover:!bg-slate-50 card-hover p-5 border-slate-100">
              <div className="bg-slate-100 p-3 rounded-2xl w-fit mb-3">
                <Clock size={20} className="text-slate-600" />
              </div>
              <h3 className="font-black text-sm text-[var(--primary)]">Historial</h3>
              <p className="text-[10px] font-bold text-[var(--text-muted)] mt-1 uppercase tracking-wider">Qué hemos hecho</p>
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
                  <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg)] px-2 py-0.5 rounded-full">{formatDate(announcement.fecha)}</span>
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
