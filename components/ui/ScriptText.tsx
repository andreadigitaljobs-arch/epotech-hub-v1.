"use client";

import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

const PRONUNCIATIONS: Record<string, string> = {
  "property": "próperti",
  "properties": "própertis",
  "stand out": "stand áut",
  "specialize": "spéshalais",
  "exterior": "ekstírior",
  "epoxy": "ipóksi",
  "finishes": "fínishes",
  "spotless": "spótles",
  "schedule": "skédyul",
  "appointment": "apóintment",
  "driveway": "dráivuei",
  "buildup": "bíldap",
  "deteriorate": "detírioreit",
  "restore": "restór",
  "aesthetics": "estétics",
  "reviews": "reviús",
  "pressure": "présher",
  "complications": "complikéishons",
  "confidence": "cónfidens",
  "high-level": "jái lével",
  "professional": "proféshonal",
  "hook": "juk",
  "reel": "ril",
  "reels": "rils",
  "trending": "trénding",
  "storytelling": "stori-téling",
  "engagement": "engéich-ment",
  "content": "cóntent",
  "marketing": "márketing",
  "solutions": "solúshons",
  "exterior cleaning": "ekstírior clíning",
  "garages": "garásh-es",
  "sports areas": "sports érias",
  "ceiling": "síling",
  "hiring": "jáiring",
  "peace of mind": "pis of máind",
  "driveways": "dráivuies",
  "damaged": "dá-madsht",
  "dirt": "dert",
  "sinking": "sínking",
  "wear": "uér",
  "expensive": "ekspénsiv",
  "transform": "transfórm",
  "money": "móni",
  "profile": "prófáil",
  "worked": "uórkt",
  "different": "díferent",
  "message": "mésads",
  "explain": "ekspléin",
  "exactly": "eksáctli",
  "need": "nid",
  "result": "risólt"
};

interface ScriptTextProps {
  text: string;
  className?: string;
}

export const ScriptText: React.FC<ScriptTextProps> = ({ text, className = "" }) => {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLParagraphElement>(null);

  // Cerrar al tocar fuera
  useEffect(() => {
    const handleClickOutside = () => setActiveWord(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleWordClick = (e: React.MouseEvent, word: string, pronunciation: string) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();

    if (containerRect) {
      setTooltipPos({
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top - 10
      });
      setActiveWord(pronunciation);
    }
  };

  // Función para procesar el texto y encontrar frases o palabras
  const renderContent = () => {
    let content = text;
    
    // Primero buscamos frases compuestas (más de una palabra) para que no se separen
    const sortedKeys = Object.keys(PRONUNCIATIONS).sort((a, b) => b.length - a.length);
    
    // Regex para encontrar cualquiera de las palabras/frases de la lista (case insensitive)
    // Usamos word boundaries \b para evitar matches parciales en otras palabras
    const escapedKeys = sortedKeys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(\\b(?:${escapedKeys.join('|')})\\b)`, 'gi');

    const parts = content.split(regex);

    return parts.map((part, i) => {
      const lowerPart = part.toLowerCase();
      const pronunciation = PRONUNCIATIONS[lowerPart];

      if (pronunciation) {
        return (
          <span
            key={i}
            onClick={(e) => handleWordClick(e, part, pronunciation)}
            className="relative inline-block cursor-pointer text-[#48c1d2] border-b border-[#48c1d2]/30 hover:bg-[#48c1d2]/10 px-0.5 rounded transition-colors font-bold"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="relative inline-block w-full">
      <p ref={containerRef} className={`relative z-10 ${className}`}>
        {renderContent()}
      </p>

      {/* Tooltip de Pronunciación */}
      {activeWord && (
        <div 
          className="absolute z-50 bg-[#48c1d2] text-[#0a192f] px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-[0_10px_30px_rgba(72,193,210,0.3)] animate-in zoom-in-95 fade-in duration-200 pointer-events-none whitespace-nowrap"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="flex items-center gap-1.5">
            <span className="opacity-60 text-[9px]">DI:</span>
            {activeWord}
          </div>
          {/* Flechita */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#48c1d2] rotate-45"></div>
        </div>
      )}
    </div>
  );
};
