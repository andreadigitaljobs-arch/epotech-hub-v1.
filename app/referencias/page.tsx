"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AccountCard } from "@/components/ui/AccountCard";
import { PlaySquare } from "lucide-react";
import { VideoCard } from "@/components/ui/VideoCard";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const InstagramIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TiktokIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
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
    <div className="space-y-8">
      <header className="mb-6 border-b border-[var(--border)] pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary)] flex items-center gap-2">
          <PlaySquare size={24} className="text-[var(--accent)]" /> 
          Referencias
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Mira estos ejemplos antes de grabar para entender qué estamos buscando.
        </p>
      </header>

      <section>
        <h2 className="text-lg font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
           Anatomía de Videos Virales
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Desglosamos los formatos exactos de los videos que más te gustaron. Copia esta estructura.
        </p>
        <div className="space-y-10">
          <div>
            <h3 className="font-bold text-[var(--primary)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <InstagramIcon className="text-pink-500" size={20} /> Videos Virales de Instagram
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {igVideos.map((video: any) => (
                 <div key={video.id}>
                   <VideoCard 
                     url={video.url}
                     platform={video.platform}
                     titleEs={video.titulo}
                     fuerte={video.fuerte}
                     porqueFunciona={video.porque_funciona}
                   />
                 </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[var(--primary)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <TiktokIcon size={20} /> Videos Virales de TikTok
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {ttVideos.map((video: any) => (
                 <div key={video.id}>
                   <VideoCard 
                     url={video.url}
                     platform={video.platform}
                     titleEs={video.titulo}
                     fuerte={video.fuerte}
                     porqueFunciona={video.porque_funciona}
                   />
                 </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
         <h2 className="text-lg font-bold text-[var(--primary)] mb-2 flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
           Análisis de Competencia (Top Cuentas)
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          No copies los videos que ves. Entiende *por qué* les funcionan tan bien y usa esa misma fórmula en tus proyectos.
        </p>
        <div className="space-y-10">
          <div>
            <h3 className="font-bold text-[var(--primary)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <InstagramIcon className="text-pink-500" size={20} /> Perfiles Top de Instagram
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
               {igAccounts.map((cuenta: any, idx: number) => (
                 <div key={idx}>
                   <AccountCard
                     nombre={cuenta.nombre}
                     url={cuenta.url}
                     fuerte={cuenta.fuerte}
                     porqueFunciona={cuenta.porque_funciona}
                     tipo={cuenta.tipo}
                   />
                 </div>
               ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-[var(--primary)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2">
              <TiktokIcon size={20} /> Perfiles Top de TikTok
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
               {ttAccounts.map((cuenta: any, idx: number) => (
                 <div key={idx}>
                   <AccountCard
                     nombre={cuenta.nombre}
                     url={cuenta.url}
                     fuerte={cuenta.fuerte}
                     porqueFunciona={cuenta.porque_funciona}
                     tipo={cuenta.tipo}
                   />
                 </div>
               ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
