"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card } from "./Card";
import { supabase } from "@/lib/supabase";

interface WeekSummary {
  semana_label: string;
  videos: number;
  clips: number;
  fotos: number;
  completada: boolean;
}

export function WeeklyHistoryModal({ onClose }: { onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<WeekSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    // In a real scenario, we'd fetch this from a 'semanas' table in Supabase
    // For now, I'll provide mock data that we can later make dynamic
    const mockHistory: WeekSummary[] = [
      { semana_label: "Semana 1 (Abr 01 - 07)", videos: 7, clips: 10, fotos: 5, completada: true },
      { semana_label: "Semana 2 (Abr 08 - 14)", videos: 7, clips: 8, fotos: 4, completada: true },
      { semana_label: "Semana Actual (Abr 15 - 21)", videos: 0, clips: 3, fotos: 0, completada: false },
    ];
    
    setTimeout(() => {
      setHistory(mockHistory);
      setLoading(false);
    }, 500);
  }, []);

  // Bloqueo de Scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const modal = (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "start",
        paddingTop: "2.5rem",
        justifyContent: "center",
        padding: "0.5rem",
        background: "rgba(10, 25, 47, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        overflowY: "auto"
      }}
      onClick={onClose}
    >
      <div
        className="modal-panel"
        style={{
          width: "100%",
          maxWidth: "450px",
          maxHeight: "95vh",
          background: "#fff",
          borderRadius: "2rem",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 30px 70px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.1)",
          overflow: "hidden"
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-[var(--bg)]/50">
          <div>
            <h2 className="text-xl font-black text-[var(--primary)] flex items-center gap-2">
              <HistoryIcon size={22} className="text-[var(--accent)]" />
              Historial de Avances
            </h2>
            <p className="text-xs text-[var(--text-muted)] font-medium">Progreso acumulado por semana</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={24} className="text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
               <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
               <p className="mt-4 text-sm font-bold text-[var(--text-muted)]">Cargando historial...</p>
            </div>
          ) : (
            history.reverse().map((week, idx) => (
              <Card key={idx} className={`border-2 ${week.completada ? "border-[var(--success)]/20 shadow-sm" : "border-dashed border-[var(--border)]"}`}>
                <div className="flex justify-between items-center mb-4">
                  <div className="font-black text-sm text-[var(--primary)]">{week.semana_label}</div>
                  {week.completada ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--success)] bg-[var(--success)]/10 px-2 py-0.5 rounded-full uppercase">
                      <CheckCircle2 size={10} /> Completado
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                      En progreso
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-black text-[var(--primary)]">{week.videos}</div>
                    <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Videos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-[var(--primary)]">{week.clips}</div>
                    <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Clips</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black text-[var(--primary)]">{week.fotos}</div>
                    <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase">Fotos</div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="p-6 bg-[var(--bg)]/50 border-t">
          <p className="text-[10px] text-center text-[var(--text-muted)] font-medium leading-relaxed italic">
            "Este historial permite ver la evolución constante de la marca Epotech Solutions."
          </p>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(modal, document.body) : null;
}

const HistoryIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);
