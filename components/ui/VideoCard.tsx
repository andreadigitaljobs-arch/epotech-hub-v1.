"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Play, ExternalLink, X, Zap, PlaySquare } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const isIg = platform === "instagram";
  const isTiktok = platform === "tiktok";

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="group relative flex flex-col bg-[#142d53] rounded-2xl border border-white/5 hover:border-[#48c1d2]/50 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden shadow-xl text-left w-full"
      >
        {/* Visual Frame - Ultra Compacto */}
        <div className="relative h-24 sm:h-28 bg-slate-900 overflow-hidden">
          {/* Gradiente de video */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#142d53] via-transparent to-black/20 z-10" />
          
          {/* Placeholder de Video Style */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-30 transition-opacity duration-500">
             <Play size={24} fill="white" className="text-white" />
          </div>

          {/* Platform Badge */}
          <div className="absolute top-2 left-2 z-20">
             <div className={`p-1 rounded-md backdrop-blur-md border border-white/10 ${
               isIg ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white' : 
               isTiktok ? 'bg-black text-white' : 'bg-red-600 text-white'
             }`}>
               {isIg ? <InstagramIcon size={8} /> : isTiktok ? <TiktokIcon size={8} /> : <Play size={8} />}
             </div>
          </div>

          {/* Título sobre el "Video" */}
          <div className="absolute bottom-2 left-3 right-3 z-20">
             <h3 className="text-[10px] font-black text-white leading-tight tracking-tight uppercase italic line-clamp-2">
               {titleEs}
             </h3>
          </div>
        </div>
        
        {/* Info Indicator */}
        <div className="px-3 py-1.5 flex items-center justify-between bg-[#0a192f]/50">
           <span className="text-[7px] font-black uppercase tracking-widest text-[#48c1d2]">Ver Análisis</span>
           <Zap size={8} className="text-[#48c1d2] opacity-50" />
        </div>
      </button>

      {/* Modal de Detalles (Portal) */}
      {isOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="absolute inset-0" 
            onClick={() => setIsOpen(false)} 
          />
          
          <div className="relative bg-[#142d53] w-full max-w-lg rounded-[2.5rem] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header del Modal */}
            <div className="relative h-48 bg-slate-900 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-[#142d53] to-transparent z-10" />
               <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <PlaySquare size={80} className="text-[#48c1d2]" />
               </div>
               
               <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 z-30 p-3 bg-black/40 hover:bg-white/10 text-white rounded-full backdrop-blur-xl transition-all"
               >
                  <X size={20} />
               </button>

               <div className="absolute bottom-6 left-8 right-8 z-20">
                  <div className={`inline-flex p-1.5 rounded-lg mb-3 ${
                    isIg ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white' : 
                    isTiktok ? 'bg-black text-white' : 'bg-red-600 text-white'
                  }`}>
                    {isIg ? <InstagramIcon size={12} /> : isTiktok ? <TiktokIcon size={12} /> : <Play size={12} />}
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase italic leading-tight tracking-tighter">
                    {titleEs}
                  </h2>
               </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-8 space-y-6">
               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#48c1d2]">
                     <Zap size={14} />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Hook Maestro</span>
                  </div>
                  <p className="text-lg font-bold text-blue-50 text-left italic leading-tight">
                    "{fuerte}"
                  </p>
               </div>

               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/40">
                     <Play size={14} />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Análisis Estratégico</span>
                  </div>
                  <p className="text-sm font-medium text-blue-100/70 text-left leading-relaxed italic">
                    "{porqueFunciona}"
                  </p>
               </div>

               <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 px-6 rounded-2xl bg-[#48c1d2] text-[#0a192f] text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] hover:shadow-[0_15px_30px_rgba(72,193,210,0.3)] active:scale-95"
               >
                  Ver Video Original <ExternalLink size={16} />
               </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
