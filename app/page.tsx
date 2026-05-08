"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Play, 
  Video, 
  BookOpen, 
  ChevronRight, 
  ExternalLink,
  Smartphone,
  Star,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useThemeColor } from "@/components/layout/ThemeColorHandler";
import { Toast } from "@/components/ui/Toast";

const DEFAULT_ACADEMY_DATA = {
  recursos: [
    { titulo: "Guía de Inicio", descripcion: "Primeros pasos en el Hub", url: "#" },
    { titulo: "Manual de Marca", descripcion: "Identidad visual Epotech", url: "/brief" },
    { titulo: "Protocolos", descripcion: "Cómo grabar en campo", url: "/manual" }
  ],
  checklist: [
    "Configura tu perfil de Instagram",
    "Sube tu primer video de prueba",
    "Verifica la iluminación de tu equipo",
    "Crea tu cuenta de Google Business"
  ]
};

export default function AcademyPage() {
  useThemeColor("#142d53");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as "success" | "error" | "info" });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: aData } = await supabase.from("config_academia").select("*").maybeSingle();
        setData(aData || DEFAULT_ACADEMY_DATA);
      } catch (error) {
        console.error(error);
        setData(DEFAULT_ACADEMY_DATA);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 md:pb-8">
      {/* HEADER SIEMPRE VISIBLE */}
      <div className="bg-[#142d53] pt-[env(safe-area-inset-top)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#48c1d2]/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-20 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#48c1d2]/20 flex items-center justify-center border border-[#48c1d2]/30">
              <BookOpen size={20} className="text-[#48c1d2]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#48c1d2]">Academia Epotech</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-none">
            Domina Tu <span className="text-[#48c1d2]">Plataforma</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-white rounded-[3rem] shadow-xl">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#142d53]/10 border-t-[#48c1d2]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#142d53]/40 animate-pulse">Preparando tu formación...</p>
          </div>
        ) : (
          <div className="space-y-10 animate-in fade-in duration-700">
            {/* TUTORIAL PRINCIPAL */}
            <div className="group bg-[#0a192f] p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Video size={180} className="text-[#48c1d2]" /></div>
              <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#48c1d2] mb-4">Video de Bienvenida</h3>
                <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Cómo usar tu Epotech Hub</h2>
                <a href="https://youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" className="inline-flex items-center gap-3 bg-[#48c1d2] text-[#0a192f] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                  <Play size={16} fill="currentColor" /> Reproducir Tutorial
                </a>
              </div>
            </div>

            {/* RECURSOS RÁPIDOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Recursos Clave</h3>
                <div className="grid grid-cols-1 gap-4">
                  {(data?.recursos || []).map((r: any, idx: number) => (
                    <a key={idx} href={r.url} target="_blank" className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-[#48c1d2] hover:shadow-xl transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-[#48c1d2]"><ExternalLink size={20} /></div>
                        <div>
                          <p className="text-sm font-black text-[#142d53] uppercase">{r.titulo}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.descripcion}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-200 group-hover:text-[#48c1d2] group-hover:translate-x-1 transition-all" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Tu Checklist</h3>
                <Card className="p-8 rounded-[3rem] shadow-xl border-white bg-white/50 backdrop-blur-sm">
                  <div className="space-y-4">
                    {(data?.checklist || []).map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-white/80 rounded-2xl border border-slate-100">
                        <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center shrink-0"><div className="w-2 h-2 rounded-full bg-slate-200"></div></div>
                        <p className="text-xs font-bold text-[#142d53] leading-tight">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} />
    </div>
  );
}
