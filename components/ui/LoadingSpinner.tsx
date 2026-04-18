"use client";

import { RefreshCcw } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Preparando información..." }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg)] pb-24 md:pb-0 animate-in fade-in duration-500">
      <div className="relative scale-150">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent-light)] border-t-[var(--accent)] shadow-xl shadow-cyan-500/20" />
        <div className="absolute inset-0 flex items-center justify-center">
           <RefreshCcw size={16} className="text-[var(--accent)] animate-pulse" />
        </div>
      </div>
      <p className="mt-12 font-black text-[var(--primary)] uppercase tracking-[0.5em] text-[10px] animate-pulse">
        {message}
      </p>
    </div>
  );
}
