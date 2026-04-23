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

  const igVideos = data.videos.filter((v: any) => v.platform === "instagram");
  const ttVideos = data.videos.filter((v: any) => v.platform === "tiktok");
  const igAccounts = data.cuentas.filter((c: any) => c.tipo === "Instagram");
  const ttAccounts = data.cuentas.filter((c: any) => c.tipo === "TikTok");

  return (
    <div className="space-y-16 pb-32 max-w-6xl mx-auto pt-6 px-4 md:px-0">
      
      {/* 1. HERO INSPIRACIONAL (Cinematic Style) */}
      <header className="relative p-8 md:p-16 rounded-[3.5rem] bg-[#142d53] text-white overflow-hidden shadow-2xl border border-white/5 group">
         <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000 rotate-12">
            <PlaySquare size={260} />
         </div>
         
         {/* Decoración de fondo */}
         <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-20 w-40 h-40 border border-white rounded-full"></div>
            <div className="absolute bottom-10 right-40 w-64 h-64 border-2 border-[#48c1d2] rotate-45"></div>
         </div>

         <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
               <span className="bg-[#48c1d2]/20 backdrop-blur-md border border-[#48c1d2]/30 px-5 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.4em] text-[#48c1d2]">
                  Creative Intelligence 2026
               </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight uppercase italic">
               El Motor de <br /> <span className="text-[#48c1d2] drop-shadow-[0_0_15px_rgba(72,193,210,0.4)]">Inspiración</span>
            </h1>
            <p className="text-sm md:text-lg font-bold text-slate-300 italic max-w-lg leading-relaxed">
               "No grabes por grabar. Entiende el código visual de lo que funciona y úsalo para dominar el algoritmo."
            </p>
         </div>
      </header>

      {/* 2. VIDEOS VIRALES (Galería Inmersiva) */}
      <section className="space-y-10">
         <div className="flex items-center justify-between ml-4">
            <div className="flex items-center gap-4">
               <div className="w-1.5 h-12 bg-[#48c1d2] rounded-full shadow-[0_0_15px_rgba(72,193,210,0.5)]" />
               <div>
                  <h2 className="text-2xl font-black text-[#142d53] tracking-tighter uppercase italic">Anatomía Viral</h2>
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Video Performance Breakdown</span>
               </div>
            </div>
         </div>

         {/* Instagram Section */}
         <div className="space-y-8">
            <div className="flex items-center gap-4 px-6 py-3 bg-slate-50 rounded-full border border-slate-100 w-fit">
               <InstagramIcon className="text-pink-500" size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest text-[#142d53]">Master Library (IG)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {igVideos.map((video: any) => (
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
         </div>

         {/* TikTok Section */}
         <div className="space-y-8 pt-10">
            <div className="flex items-center gap-4 px-6 py-3 bg-slate-900 rounded-full border border-white/5 w-fit">
               <TiktokIcon size={18} className="text-white" />
               <span className="text-[10px] font-black uppercase tracking-widest text-white">Algorithm Killers (TT)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ttVideos.map((video: any) => (
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
         </div>
      </section>

      {/* 3. COMPETENCIA (Studio Passes) */}
      <section className="space-y-10 pt-20">
         <div className="flex items-center justify-between ml-4">
            <div className="flex items-center gap-4">
               <div className="w-1.5 h-12 bg-[#142d53] rounded-full" />
               <div>
                  <h2 className="text-2xl font-black text-[#142d53] tracking-tighter uppercase italic">Canales de Élite</h2>
                  <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Competitive Landscape Analysis</span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.cuentas.map((cuenta: any, idx: number) => (
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
      </section>

      {/* 4. FOOTER CINE */}
      <footer className="pt-20 text-center">
         <div className="inline-flex items-center gap-4 px-10 py-6 bg-[#142d53] text-white rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
            <div className="absolute inset-0 bg-[#48c1d2]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles size={20} className="text-[#48c1d2]" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Inspiración es Ejecución</span>
            <Sparkles size={20} className="text-[#48c1d2]" />
         </div>
      </footer>
    </div>
  );
}
