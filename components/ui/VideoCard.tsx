"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Play, ExternalLink, X } from "lucide-react";

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
  const isTiktok = platform === "tiktok";
  const isIg = platform === "instagram";

  return (
    <div className="group relative h-full flex flex-col bg-slate-50/50 rounded-[32px] border-2 border-slate-200 hover:border-[var(--accent)] transition-all duration-500 hover:shadow-2xl overflow-hidden shadow-sm">
      {/* Icon & Platform Header */}
      <div className={`p-4 flex items-center justify-between ${
        isIg ? 'bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10' : 
        isTiktok ? 'bg-slate-900/5' : 'bg-red-500/5'
      }`}>
        <div className={`p-2.5 rounded-2xl shadow-sm ${
          isIg ? 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 text-white' : 
          isTiktok ? 'bg-slate-900 text-white' : 'bg-red-600 text-white'
        }`}>
          {isIg ? <InstagramIcon size={20} /> : isTiktok ? <TiktokIcon size={20} /> : <Play size={20} />}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          {platform}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-sm font-black text-[var(--primary)] leading-tight mb-4 group-hover:text-[var(--accent)] transition-colors">
          {titleEs}
        </h3>

        <div className="space-y-4 flex-1">
          {/* Fuerte */}
          <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100/50">
            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-1 block">🎯 Hook Maestro</span>
            <p className="text-[11px] font-bold text-blue-900 leading-snug">{fuerte}</p>
          </div>

          {/* Analisis */}
          <div>
            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2 block">🧠 Análisis Hedy</span>
            <p className="text-[11px] font-bold text-gray-500 leading-relaxed line-clamp-4 italic">
              "{porqueFunciona}"
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-6 pt-4 border-t border-gray-50">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gray-50 text-[var(--primary)] text-[11px] font-black uppercase tracking-widest hover:bg-[var(--primary)] hover:text-white transition-all group-hover:gap-3"
          >
            Ver Referencia <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
