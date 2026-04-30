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

export default function ReferenciasPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({ videos: [], cuentas: [] });
  const [activeSubTab, setActiveSubTab] = useState<'videos' | 'cuentas'>('videos');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'tiktok'>('all');

  useEffect(() => {
    async function loadData() {
      const { data: videos } = await supabase.from('referencias_videos').select('*');
      const { data: cuentas } = await supabase.from('referencias_cuentas').select('*');
      setData({ 
        videos: videos || [], 
        cuentas: cuentas || [] 
      });
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) return <LoadingSpinner message="Cargando Inspiración..." />;

  const filteredVideos = data.videos.filter((v: any) => 
    platformFilter === 'all' ? true : v.platform === platformFilter
  );

  const filteredAccounts = data.cuentas.filter((c: any) => {
    const p = c.tipo.toLowerCase();
    return platformFilter === 'all' ? true : p.includes(platformFilter);
  });

  return (
    <div className="space-y-6 pb-32 max-w-6xl mx-auto pt-4 px-4 md:px-0 text-left">
      
      {/* 1. HERO COMPACTO */}
      <header className="relative p-6 md:p-10 rounded-[2.5rem] bg-[#142d53] text-white overflow-hidden shadow-xl border border-white/5 group">
         <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
            <PlaySquare size={120} />
         </div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
               <span className="bg-[#48c1d2]/20 backdrop-blur-md border border-[#48c1d2]/30 px-4 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.3em] text-[#48c1d2]">
                  Creative Intelligence 2026
               </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 leading-none uppercase italic">
               Motor de <span className="text-[#48c1d2]">Inspiración</span>
            </h1>
            <p className="text-[10px] md:text-sm font-bold text-slate-300 italic max-w-md leading-tight opacity-70">
               "No grabes por grabar. Entiende el código visual de lo que funciona."
            </p>
         </div>
      </header>

      {/* 2. NAVEGACIÓN DE CONSOLA (Sticky) */}
      <div className="sticky top-4 z-[100] space-y-3">
         {/* Pestañas Principales */}
         <div className="flex bg-[#142d53] p-1.5 rounded-[2rem] shadow-2xl border border-white/5">
            <button 
               onClick={() => setActiveSubTab('videos')}
               className={`flex-1 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSubTab === 'videos' ? 'bg-[#48c1d2] text-[#142d53]' : 'text-white/40 hover:text-white'}`}
            >
               <Zap size={12} /> Biblioteca Viral
            </button>
            <button 
               onClick={() => setActiveSubTab('cuentas')}
               className={`flex-1 py-3 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSubTab === 'cuentas' ? 'bg-[#48c1d2] text-[#142d53]' : 'text-white/40 hover:text-white'}`}
            >
               <ShieldCheck size={12} /> Referentes Top
            </button>
         </div>

         {/* Filtros de Plataforma */}
         <div className="flex justify-center gap-2">
            {[
               { id: 'all', label: 'Todos', icon: Sparkles, color: 'bg-white/5' },
               { id: 'instagram', label: 'Instagram', icon: InstagramIcon, color: 'bg-pink-500/10 text-pink-500' },
               { id: 'tiktok', label: 'TikTok', icon: TiktokIcon, color: 'bg-slate-900 text-white' }
            ].map((p) => (
               <button 
                  key={p.id}
                  onClick={() => setPlatformFilter(p.id as any)}
                  className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${platformFilter === p.id ? 'bg-[#142d53] text-[#48c1d2] border-[#48c1d2] shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
               >
                  <p.icon size={10} /> {p.label}
               </button>
            ))}
         </div>
      </div>

      {/* 3. CONTENIDO DINÁMICO */}
      <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         {activeSubTab === 'videos' ? (
            <div className="space-y-8">
               <div className="flex items-center gap-3 ml-2">
                  <div className="w-1 h-8 bg-[#48c1d2] rounded-full" />
                  <div>
                     <h2 className="text-xl font-black text-[#142d53] tracking-tighter uppercase italic">Anatomía Viral</h2>
                     <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-400">Breakdown de Rendimiento</span>
                  </div>
               </div>

               {filteredVideos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                     {filteredVideos.map((video: any) => (
                        <VideoCard 
                           key={video.id}
                           url={video.url}
                           platform={video.platform}
                           titleEs={video.titulo}
                           fuerte={video.fuerte}
                           porqueFunciona={video.porque_funciona}
                        />
                     ))}
                  </div>
               ) : (
                  <div className="py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No hay videos en esta categoría</p>
                  </div>
               )}
            </div>
         ) : (
            <div className="space-y-8">
               <div className="flex items-center gap-3 ml-2">
                  <div className="w-1 h-8 bg-[#142d53] rounded-full" />
                  <div>
                     <h2 className="text-xl font-black text-[#142d53] tracking-tighter uppercase italic">Canales de Élite</h2>
                     <span className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-400">Competitive Analysis</span>
                  </div>
               </div>

               {filteredAccounts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {filteredAccounts.map((cuenta: any, idx: number) => (
                        <AccountCard
                           key={idx}
                           nombre={cuenta.nombre}
                           url={cuenta.url}
                           fuerte={cuenta.fuerte}
                           porqueFunciona={cuenta.porque_funciona}
                           tipo={cuenta.tipo}
                        />
                     ))}
                  </div>
               ) : (
                  <div className="py-20 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No hay referentes en esta red social</p>
                  </div>
               )}
            </div>
         )}
      </main>

      {/* 4. FOOTER COMPACTO */}
      <footer className="pt-10 text-center">
         <div className="inline-flex items-center gap-3 px-6 py-4 bg-[#142d53] text-white rounded-[2rem] shadow-xl relative overflow-hidden group">
            <Sparkles size={14} className="text-[#48c1d2]" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] italic">Inspiración es Ejecución</span>
            <Sparkles size={14} className="text-[#48c1d2]" />
         </div>
      </footer>
    </div>
  );
}
