"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Play, ExternalLink, X, Zap } from "lucide-react";

const InstagramIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

interface VideoCardProps {
  url: string;
  platform: "tiktok" | "instagram" | "youtube";
  titleEs: string;
  fuerte: string;
  porqueFunciona: string;
}

export function VideoCard({
  url,
  platform,
  titleEs,
  fuerte,
  porqueFunciona,
}: VideoCardProps) {
  const isIg = platform === "instagram";
  const isTiktok = platform === "tiktok";

  return (
    <div className="group relative flex flex-col bg-[#142d53] rounded-[2rem] border border-white/5 hover:border-[#48c1d2]/50 transition-all duration-700 hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden shadow-2xl">
      
      {/* Visual Frame (Simulado) - Super Compacto */}
      <div className="relative h-32 bg-slate-900 overflow-hidden">
        {/* Gradiente de video */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#142d53] via-transparent to-black/20 z-10" />
        
        {/* Placeholder de Video Style */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity duration-700">
           <Play size={32} fill="white" className="text-white" />
        </div>

        {/* Platform Badge */}
        <div className="absolute top-4 left-4 z-20">
           <div className={`p-1 rounded-lg backdrop-blur-md border border-white/20 shadow-xl ${
             isIg ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white' : 
             isTiktok ? 'bg-black text-white' : 'bg-red-600 text-white'
           }`}>
             {isIg ? <InstagramIcon size={10} /> : isTiktok ? <TiktokIcon size={10} /> : <Play size={10} />}
           </div>
        </div>

        {/* Título sobre el "Video" */}
        <div className="absolute bottom-2 left-4 right-4 z-20">
           <h3 className="text-xs font-black text-white leading-tight tracking-tight uppercase italic line-clamp-1">
             {titleEs}
           </h3>
        </div>
      </div>

      {/* Production Insights (Glassmorphism) */}
      <div className="p-4 flex flex-col gap-3 relative z-20">
        {/* Fuerte (Hook) */}
        <div className="bg-[#48c1d2]/10 rounded-xl p-3 border border-[#48c1d2]/20 relative overflow-hidden group/hook">
          <div className="absolute top-0 right-0 p-1 opacity-5">
             <Zap size={24} fill="currentColor" className="text-[#48c1d2]" />
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#48c1d2] mb-1 block font-mono">Hook Maestro</span>
          <p className="text-xs font-bold text-blue-100 leading-tight italic">"{fuerte}"</p>
        </div>

        {/* Analisis (Director's Notes) */}
        <div className="px-1">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-1 block font-mono">Análisis Hedy</span>
          <p className="text-xs font-medium text-white/60 leading-tight italic">
            "{porqueFunciona}"
          </p>
        </div>

        {/* Action Link */}
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-[#48c1d2] text-white hover:text-[#142d53] border border-white/10 hover:border-transparent text-[9px] font-black uppercase tracking-widest transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(72,193,210,0.3)] mt-1"
        >
          Ver Referencia <ExternalLink size={12} />
        </a>
      </div>

      {/* Decoración Cine */}
      <div className="absolute bottom-0 right-0 p-1 opacity-10">
         <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
         </div>
      </div>
    </div>
  );
}
