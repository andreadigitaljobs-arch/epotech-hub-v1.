"use client";

import { RefreshCcw } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Preparando información..." }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[70vh] w-full">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent-light)] border-t-[var(--accent)]" />
        <div className="absolute inset-0 flex items-center justify-center">
           <RefreshCcw size={14} className="text-[var(--accent)] animate-pulse" />
        </div>
      </div>
      <p className="mt-6 font-black text-[var(--primary)] uppercase tracking-[0.3em] text-[10px] animate-pulse">
        {message}
      </p>
    </div>
  );
}
