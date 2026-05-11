"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

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
      }, 4000); // 4 segundos es lo ideal
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender || !mounted) return null;

  const config = {
    success: {
      icon: <CheckCircle2 className="text-[#48c1d2]" size={18} />,
      bg: "bg-[#142d53]/95",
      border: "border-[#48c1d2]/30",
      accent: "bg-[#48c1d2]"
    },
    error: {
      icon: <XCircle className="text-red-400" size={18} />,
      bg: "bg-red-950/95",
      border: "border-red-500/50",
      accent: "bg-red-500"
    },
    info: {
      icon: <AlertCircle className="text-[#48c1d2]" size={18} />,
      bg: "bg-[#142d53]/95",
      border: "border-[#48c1d2]/30",
      accent: "bg-[#48c1d2]"
    }
  };

  const { icon, bg, border, accent } = config[type];

  const content = (
    <div 
      className={`fixed top-16 left-0 right-0 mx-auto z-[99999] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform w-fit ${
        isVisible 
          ? "translate-y-0 opacity-100 scale-100" 
          : "-translate-y-12 opacity-0 scale-90 pointer-events-none"
      }`}
    >
      <div className={`flex items-center gap-4 px-6 py-4 rounded-[2rem] ${bg} backdrop-blur-xl border border-white/10 shadow-2xl min-w-[280px] max-w-[90vw] overflow-hidden relative`}>
        {/* Barra de progreso animada - se vacía con el tiempo */}
        <div 
          className={`absolute bottom-0 left-0 h-[2px] ${accent} opacity-50 transition-all duration-[4000ms] ease-linear`} 
          style={{ width: isVisible ? '0%' : '100%' }} 
        />
        
        <div className="p-2 rounded-full bg-white/5 border border-white/10 shrink-0">
          {icon}
        </div>
        
        <div className="flex-1 text-left">
          <p className="text-[8px] font-black text-[#48c1d2] uppercase tracking-[0.2em] mb-0.5 opacity-70 italic">Notificación Epotech</p>
          <p className="text-xs font-bold text-white italic leading-tight tracking-tight mb-3">{message}</p>
          <button 
            onClick={onClose}
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 border border-white/10"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
