"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AccountCard } from "@/components/ui/AccountCard";
import { VideoCard } from "@/components/ui/VideoCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { PlaySquare, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { referencias as staticRefs } from "@/data/referencias";
import { useThemeColor } from "@/components/layout/ThemeColorHandler";

const InstagramIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const TiktokIcon = ({ size = 12 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
);

export default function ReferenciasPage() {
  useThemeColor("#142d53");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>({ videos: [], cuentas: [] });
  const [activeSubTab, setActiveSubTab] = useState<'videos' | 'cuentas'>('videos');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'instagram' | 'tiktok'>('all');

  useEffect(() => {
    async function loadData() {
      try {
        setData({ videos: staticRefs.videos, cuentas: staticRefs.cuentas });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredVideos = (data.videos || []).filter((v: any) => platformFilter === 'all' || v.platform === platformFilter);
  const viralVideos = filteredVideos.filter((v: any) => v.categoria === 'VIRAL');
  const autoridadVideos = filteredVideos.filter((v: any) => v.categoria === 'AUTORIDAD');
  const ventasVideos = filteredVideos.filter((v: any) => v.categoria === 'VENTAS');

  const filteredAccounts = (data.cuentas || []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      <div className="bg-[#142d53] pt-[env(safe-area-inset-top)] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#48c1d2]/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-20 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-none uppercase text-white">
             Motor de <br /> <span className="text-[#48c1d2]">Inspiración</span>
          </h1>
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md max-w-xl">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-tight">
              <span className="text-[#48c1d2]">Directiva Creativa:</span> Analiza estos videos no para copiarlos, sino para entender su estructura de retención.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem] shadow-xl">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#142d53]/10 border-t-[#48c1d2]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#142d53]/40 animate-pulse">Cargando Inspiración...</p>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-700">
            <div className="space-y-6">
              <div className="flex bg-[#0a192f] p-2 rounded-[2rem] shadow-2xl border border-white/10 max-w-md mx-auto">
                <button onClick={() => setActiveSubTab('videos')} className={`flex-1 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeSubTab === 'videos' ? 'bg-[#48c1d2] text-[#0a192f]' : 'text-slate-500'}`}>
                  <Zap size={14} /> Videos de Referencia
                </button>
                <button onClick={() => setActiveSubTab('cuentas')} className={`flex-1 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeSubTab === 'cuentas' ? 'bg-[#48c1d2] text-[#0a192f]' : 'text-slate-500'}`}>
                  <ShieldCheck size={14} /> Referentes Top
                </button>
              </div>
              <div className="flex justify-center gap-3">
                {['all', 'instagram', 'tiktok'].map((id) => (
                  <button key={id} onClick={() => setPlatformFilter(id as any)} className={`px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all border ${platformFilter === id ? 'bg-[#0a192f] text-[#48c1d2] border-[#48c1d2]' : 'bg-white text-slate-400 border-slate-100'}`}>
                    {id === 'instagram' ? <InstagramIcon /> : id === 'tiktok' ? <TiktokIcon /> : <Sparkles size={12} />} {id}
                  </button>
                ))}
              </div>
            </div>

            <main>
              {activeSubTab === 'videos' ? (
                <div className="space-y-16">
                  {viralVideos.length > 0 && (
                    <div className="space-y-8">
                       <div className="flex items-center gap-4 ml-2">
                          <div className="w-12 h-12 rounded-2xl bg-[#48c1d2] flex items-center justify-center text-[#0a192f] shadow-lg"><Zap size={24} /></div>
                          <div>
                             <h2 className="text-2xl font-black text-[#0a192f] tracking-tighter uppercase italic leading-none">Para Volverte Viral</h2>
                             <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Contenido de alta retención y satisfacción visual</span>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                          {viralVideos.map((video: any) => <VideoCard key={video.id} {...video} titleEs={video.titulo} />)}
                       </div>
                    </div>
                  )}
                  {autoridadVideos.length > 0 && (
                    <div className="space-y-8">
                       <div className="flex items-center gap-4 ml-2">
                          <div className="w-12 h-12 rounded-2xl bg-[#142d53] flex items-center justify-center text-white shadow-lg"><ShieldCheck size={24} /></div>
                          <div>
                             <h2 className="text-2xl font-black text-[#0a192f] tracking-tighter uppercase italic leading-none">Construye Tu Autoridad</h2>
                             <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Demuestra tu conocimiento técnico y equipo profesional</span>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                          {autoridadVideos.map((video: any) => <VideoCard key={video.id} {...video} titleEs={video.titulo} />)}
                       </div>
                    </div>
                  )}
                  {ventasVideos.length > 0 && (
                    <div className="space-y-8">
                       <div className="flex items-center gap-4 ml-2">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-[#48c1d2] shadow-lg"><Sparkles size={24} /></div>
                          <div>
                             <h2 className="text-2xl font-black text-[#0a192f] tracking-tighter uppercase italic leading-none">Cierra Más Ventas</h2>
                             <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Resultados finales, testimonios y ganchos de venta</span>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                          {ventasVideos.map((video: any) => <VideoCard key={video.id} {...video} titleEs={video.titulo} />)}
                       </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAccounts.map((account: any) => <AccountCard key={account.id} {...account} fuerte={account.fuerte || account.descripcion} />)}
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
