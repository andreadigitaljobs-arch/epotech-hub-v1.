"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Globe, ExternalLink, X, ShieldCheck, Zap } from "lucide-react";

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

interface AccountCardProps {
  nombre: string;
  url: string;
  fuerte: string;
  porqueFunciona: string;
  tipo: string;
}

export function AccountCard({
  nombre,
  url,
  fuerte,
  porqueFunciona,
  tipo,
}: AccountCardProps) {
  const isIg = tipo === "Instagram";
  const isTiktok = tipo === "TikTok";

  return (
    <div className="group relative h-full flex flex-col bg-white rounded-[2.5rem] border border-slate-100 hover:border-[#48c1d2]/30 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden">
      
      {/* Badge Header (ID Style) */}
      <div className={`p-6 flex flex-col items-center text-center relative overflow-hidden ${
        isIg ? 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50' : 
        isTiktok ? 'bg-slate-50' : 'bg-blue-50'
      }`}>
        <div className="absolute top-0 left-0 w-full h-1 bg-[#48c1d2]/20" />
        
        {/* Avatar Placeholder / Brand Logo */}
        <div className="relative mb-4">
           <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-700 ${
             isIg ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white' : 
             isTiktok ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'
           }`}>
             {isIg ? <InstagramIcon size={32} /> : isTiktok ? <TiktokIcon size={32} /> : <Globe size={32} />}
           </div>
           <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
              <ShieldCheck size={16} className="text-[#48c1d2]" />
           </div>
        </div>

        <h3 className="text-lg font-black text-[#142d53] tracking-tighter uppercase italic leading-none mb-1">
          {nombre}
        </h3>
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Production Studio Pass</span>
      </div>

      {/* Specialty Insights */}
      <div className="p-8 flex-1 flex flex-col space-y-6">
        <div className="space-y-4 flex-1">
          {/* Especialidad */}
          <div className="space-y-1.5">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#48c1d2] font-mono">Especialidad</span>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-blue-50/50 transition-colors">
               <p className="text-xs font-bold text-[#142d53] leading-snug">{fuerte}</p>
            </div>
          </div>

          {/* Análisis */}
          <div className="space-y-1.5">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300 font-mono">Estrategia Viral</span>
            <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic line-clamp-3">
              "{porqueFunciona}"
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="pt-6 border-t border-slate-50">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#48c1d2] hover:text-[#142d53] transition-all duration-500 shadow-lg shadow-slate-900/10 hover:shadow-[#48c1d2]/20"
          >
            Visitar Canal <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
