"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AccountCard } from "@/components/ui/AccountCard";
import { VideoCard } from "@/components/ui/VideoCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PlaySquare, Sparkles, Zap, ShieldCheck } from "lucide-react";

const InstagramIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TiktokIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

import { referencias as staticRefs } from "@/data/referencias";

export default function ReferenciasPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({ videos: [], cuentas: [] });
  const [activeSubTab, setActiveSubTab] = useState<'videos' | 'cuentas'>('videos');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'tiktok'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        // Priorizamos la información de alta calidad que ya investigamos
        // Esto asegura que Sebastian vea la información corregida inmediatamente
        setData({ 
          videos: staticRefs.videos, 
          cuentas: staticRefs.cuentas 
        });

        // Intentamos cargar de Supabase, pero solo si quisiéramos actualizar dinámicamente
        // Por ahora, el "Master" es el archivo estático para garantizar precisión del 100%
        const { data: vDb } = await supabase.from('referencias_videos').select('*');
        const { data: cDb } = await supabase.from('referencias_cuentas').select('*');
        
        if (vDb && vDb.length > 0 && cDb && cDb.length > 0) {
          // Si quisiéramos usar la DB, podríamos activarlo aquí, 
          // pero hoy priorizamos la corrección manual que pidió el usuario.
          // setData({ videos: vDb, cuentas: cDb });
        }
      } catch (e) {
        console.error("Error loading refs:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <LoadingSpinner message="Cargando Inspiración..." />;

  const filteredVideos = data.videos
    .filter((v: any) => platformFilter === 'all' ? true : v.platform === platformFilter)
    .sort((a: any, b: any) => a.platform.localeCompare(b.platform)); // Instagram before TikTok

  const filteredAccounts = data.cuentas.filter((c: any) => {
    const p = c.tipo.toLowerCase();
    return platformFilter === 'all' ? true : p.includes(platformFilter);
  });

  const viralVideos = filteredVideos.filter((v: any) => v.categoria === 'VIRAL');
  const autoridadVideos = filteredVideos.filter((v: any) => v.categoria === 'AUTORIDAD');
  const ventasVideos = filteredVideos.filter((v: any) => v.categoria === 'VENTAS');

  return (
    <div className="max-w-5xl mx-auto pb-32 text-left space-y-6">
      
      {/* 1. HERO COMPACTO */}
      <header className="relative p-6 md:p-12 md:rounded-[2rem] bg-[#0a192f] text-white overflow-hidden shadow-2xl border-b border-white/10 md:border group pt-[calc(1.5rem+env(safe-area-inset-top))]">
         <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-15 transition-opacity duration-1000 rotate-12">
            <PlaySquare size={180} />
         </div>
         
         <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-none uppercase text-white">
               Motor de <span className="text-[#48c1d2]">Inspiración</span>
            </h1>
            <p className="text-xs font-bold text-slate-400 italic max-w-xl leading-relaxed opacity-80 border-l-2 border-[#48c1d2]/30 pl-6">
               "No grabes por grabar. Entiende el código visual de lo que funciona para elevar Epotech al siguiente nivel."
            </p>
         </div>
      </header>

      <div className="px-6 space-y-6">
        {/* Texto Tutorial Contextual Premium */}
        <div className="bg-white/50 border border-slate-200 p-6 rounded-[2rem] w-full">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
            <span className="text-[#48c1d2]">Motor de Inspiración:</span> Mira los videos y tendencias que usamos como referencia para tus Reels. No inventamos la rueda, la hacemos girar más rápido para Epotech.
          </p>
        </div>


      {/* 2. NAVEGACIÓN Y FILTROS */}
      <div className="space-y-8">
         {/* Pestañas Principales */}
         <div className="flex bg-[#0a192f] p-2 rounded-[2rem] shadow-2xl border border-white/10 max-w-md mx-auto">
            <button 
               onClick={() => setActiveSubTab('videos')}
               className={`flex-1 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeSubTab === 'videos' ? 'bg-[#48c1d2] text-[#0a192f] shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
               <Zap size={14} /> Videos de Referencia
            </button>
            <button 
               onClick={() => setActiveSubTab('cuentas')}
               className={`flex-1 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeSubTab === 'cuentas' ? 'bg-[#48c1d2] text-[#0a192f] shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
               <ShieldCheck size={14} /> Referentes Top
            </button>
         </div>

         {/* Filtros de Plataforma */}
         <div className="flex justify-center gap-3">
            {[
               { id: 'all', label: 'Todos', icon: Sparkles },
               { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
               { id: 'tiktok', label: 'TikTok', icon: TiktokIcon }
            ].map((p) => (
               <button 
                  key={p.id}
                  onClick={() => setPlatformFilter(p.id as any)}
                  className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border flex items-center gap-3 ${platformFilter === p.id ? 'bg-[#0a192f] text-[#48c1d2] border-[#48c1d2] shadow-xl scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 shadow-sm'}`}
               >
                  <p.icon size={12} /> {p.label}
               </button>
            ))}
         </div>
      </div>

      {/* 3. CONTENIDO DINÁMICO */}
      <main className="animate-in fade-in slide-in-from-bottom-6 duration-700">
          {activeSubTab === 'videos' ? (
            <div className="space-y-16">
               {/* CATEGORÍA 1: VIRAL */}
               {viralVideos.length > 0 && (
                  <div className="space-y-8">
                     <div className="flex items-center gap-4 ml-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#48c1d2] flex items-center justify-center text-[#0a192f] shadow-lg shadow-[#48c1d2]/20">
                           <Zap size={24} />
                        </div>
                        <div>
                           <h2 className="text-2xl font-black text-[#0a192f] tracking-tighter uppercase italic leading-none">Para Volverte Viral</h2>
                           <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Contenido de alta retención y satisfacción visual</span>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {viralVideos.map((video: any) => (
                           <VideoCard 
                              key={video.id}
                              url={video.url}
                              platform={video.platform}
                              titleEs={video.titulo}
                              fuerte={video.fuerte}
                              porqueFunciona={video.porqueFunciona}
                           />
                        ))}
                     </div>
                  </div>
               )}

               {/* CATEGORÍA 2: AUTORIDAD */}
               {autoridadVideos.length > 0 && (
                  <div className="space-y-8">
                     <div className="flex items-center gap-4 ml-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#142d53] flex items-center justify-center text-white shadow-lg shadow-[#142d53]/20">
                           <ShieldCheck size={24} />
                        </div>
                        <div>
                           <h2 className="text-2xl font-black text-[#0a192f] tracking-tighter uppercase italic leading-none">Construye Tu Autoridad</h2>
                           <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Demuestra tu conocimiento técnico y equipo profesional</span>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {autoridadVideos.map((video: any) => (
                           <VideoCard 
                              key={video.id}
                              url={video.url}
                              platform={video.platform}
                              titleEs={video.titulo}
                              fuerte={video.fuerte}
                              porqueFunciona={video.porqueFunciona}
                           />
                        ))}
                     </div>
                  </div>
               )}

               {/* CATEGORÍA 3: VENTAS */}
               {ventasVideos.length > 0 && (
                  <div className="space-y-8">
                     <div className="flex items-center gap-4 ml-2">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-[#48c1d2] shadow-lg shadow-black/20">
                           <Sparkles size={24} />
                        </div>
                        <div>
                           <h2 className="text-2xl font-black text-[#0a192f] tracking-tighter uppercase italic leading-none">Cierra Más Ventas</h2>
                           <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Resultados finales, testimonios y ganchos de venta</span>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {ventasVideos.map((video: any) => (
                           <VideoCard 
                              key={video.id}
                              url={video.url}
                              platform={video.platform}
                              titleEs={video.titulo}
                              fuerte={video.fuerte}
                              porqueFunciona={video.porqueFunciona}
                           />
                        ))}
                     </div>
                  </div>
               )}

               {filteredVideos.length === 0 && (
                  <div className="py-24 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No hay contenido disponible bajo este filtro</p>
                  </div>
               )}
            </div>
          ) : (
            <div className="space-y-10">
               <div className="flex items-center gap-4 ml-2">
                  <div className="w-1.5 h-10 bg-[#0a192f] rounded-full" />
                  <div>
                     <h2 className="text-2xl font-black text-[#0a192f] tracking-tighter uppercase italic leading-none">Canales de Referencia</h2>
                     <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Cuentas del sector que puedes estudiar y aplicar</span>
                  </div>
               </div>

               {filteredAccounts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {filteredAccounts.map((account: any) => (
                        <AccountCard 
                           key={account.id}
                           nombre={account.nombre}
                           fuerte={account.fuerte || account.descripcion}
                           tipo={account.tipo}
                           url={account.url}
                           porqueFunciona={account.porqueFunciona || account.porque_seguirlo || account.porque_funciona}
                        />
                     ))}
                  </div>
               ) : (
                  <div className="py-24 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No hay canales en esta categoría</p>
                  </div>
               )}
            </div>
          )}
      </main>
    </div>
  </div>
);
}
