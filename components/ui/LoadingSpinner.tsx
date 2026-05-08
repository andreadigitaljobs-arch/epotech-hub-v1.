"use client";

import { RefreshCcw } from "lucide-react";
import { useContext } from "react";
import { ThemeColorContext } from "@/components/layout/ThemeColorHandler";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Preparando información..." }: LoadingSpinnerProps) {
  const { color } = useContext(ThemeColorContext);
  const isDark = color === "#142d53" || color === "#0a192f";

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center pb-24 md:pb-0 animate-in fade-in duration-500"
      style={{ backgroundColor: color }}
    >
      <div className="relative scale-150">
        <div className={`h-12 w-12 animate-spin rounded-full border-4 ${isDark ? 'border-white/10 border-t-[#48c1d2]' : 'border-[var(--accent-light)] border-t-[var(--accent)]'} shadow-xl shadow-cyan-500/20`} />
        <div className="absolute inset-0 flex items-center justify-center">
           <RefreshCcw size={16} className="text-[var(--accent)] animate-pulse" />
        </div>
      </div>
      <p className={`mt-12 font-black uppercase tracking-[0.5em] text-[10px] animate-pulse ${isDark ? 'text-white/40' : 'text-[var(--primary)]'}`}>
        {message}
      </p>
    </div>
  );
}
