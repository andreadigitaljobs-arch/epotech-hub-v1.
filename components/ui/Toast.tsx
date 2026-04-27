"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, AlertCircle, X, Sparkles } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, type, isVisible, onClose }: ToastProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender || !mounted) return null;

  const config = {
    success: {
      icon: <CheckCircle2 className="text-[#48c1d2]" size={20} />,
      bg: "bg-[#142d53]/95",
      border: "border-[#48c1d2]/50",
      accent: "bg-[#48c1d2]"
    },
    error: {
      icon: <XCircle className="text-red-400" size={20} />,
      bg: "bg-red-950/95",
      border: "border-red-500/50",
      accent: "bg-red-500"
    },
    info: {
      icon: <AlertCircle className="text-blue-400" size={20} />,
      bg: "bg-[#142d53]/95",
      border: "border-blue-500/50",
      accent: "bg-blue-500"
    }
  };

  const { icon, bg, border, accent } = config[type];

  const content = (
    <div 
      className={`fixed top-10 left-1/2 z-[99999] transition-all duration-500 transform ${
        isVisible ? "-translate-x-1/2 translate-y-0 opacity-100 scale-100" : "-translate-x-1/2 -translate-y-4 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl ${bg} backdrop-blur-xl border ${border} shadow-2xl shadow-black/20 min-w-[320px] overflow-hidden relative`}>
        {/* Barra de progreso animada */}
        <div className={`absolute bottom-0 left-0 h-1 ${accent} transition-all duration-[5000ms] ease-linear`} style={{ width: isVisible ? '100%' : '0%' }} />
        
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
          {icon}
        </div>
        
        <div className="flex-1 pr-4">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-0.5">Notificación Epotech</p>
          <p className="text-sm font-bold text-white italic leading-tight">{message}</p>
        </div>

        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 absolute top-4 right-4"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
