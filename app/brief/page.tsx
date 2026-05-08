"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { 
  Target, 
  Zap, 
  Users, 
  MessageSquare, 
  Star, 
  CheckCircle2, 
  Wrench, 
  Compass,
  ShieldCheck,
  Droplets,
  Paintbrush,
  Sparkles,
  MapPin
} from "lucide-react";
import { useThemeColor } from "@/components/layout/ThemeColorHandler";

export default function BrandBriefPage() {
  useThemeColor("#142d53");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: eData } = await supabase.from("config_estrategia").select("*").maybeSingle();
        const fallback = {
          mision_desc: "Transformar espacios. Entregar resultados. Construir confianza.",
          propuesta_valor: "Transformamos espacios haciendo que se vean como nuevos, de forma rápida, profesional y con resultados visibles.",
          diferenciador: "Combinamos servicios de alto volumen (pressure washing) con servicios de alto valor (epoxy).",
          perfil_cliente: "Propietarios de vivienda en Utah que valoran calidad y rapidez.",
          tono_voz: "Directo, enfocado en resultados, sin tecnicismos.",
          servicios_basicos: ["LAVADO DE CASAS", "LIMPIEZA DE ENTRADAS", "LIMPIEZA DE TECHOS"],
          servicios_premium: ["PISOS EPÓXICOS", "ACABADOS INTERIORES", "RECUBRIMIENTOS"],
          mensajes_clave: ["HACEMOS QUE TU HOGAR SE VEA COMO NUEVO", "COTIZACIÓN GRATIS", "SERVICIO RÁPIDO"]
        };
        setData(eData || fallback);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const CARD_STYLE = "p-8 md:p-12 bg-[#0a192f] border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group";

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* HEADER SIEMPRE VISIBLE */}
      <div className="bg-[#142d53] pt-[env(safe-area-inset-top)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#48c1d2]/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-20 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#48c1d2] p-2 rounded-lg">
              <Target size={16} className="text-[#142d53]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#48c1d2]">Arquitectura de Marca</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-6 leading-none uppercase">
            El Brief <span className="text-[#48c1d2]">Maestro</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#142d53]/10 border-t-[#48c1d2]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#142d53]/40 animate-pulse">Sincronizando Estrategia...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in duration-700">
            {/* PROPUESTA Y DIFERENCIADOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={CARD_STYLE}>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> Propuesta de Valor
                </h2>
                <p className="text-xl font-bold text-white leading-snug">{data.propuesta_valor}</p>
              </div>
              <div className={CARD_STYLE}>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div> Diferenciador Único
                </h2>
                <p className="text-xl font-bold text-white leading-snug">{data.diferenciador}</p>
              </div>
            </div>

            {/* AUDIENCIA Y TONO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={CARD_STYLE}>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                   <Users size={16} className="text-[#48c1d2]" /> Audiencia Ideal
                </h2>
                <p className="text-xl font-bold text-white leading-snug">{data.perfil_cliente}</p>
              </div>
              <div className={CARD_STYLE}>
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                   <MessageSquare size={16} className="text-[#48c1d2]" /> Tono de Voz
                </h2>
                <p className="text-xl font-bold text-white leading-snug mb-6">{data.tono_voz}</p>
              </div>
            </div>

            {/* SERVICIOS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={CARD_STYLE}>
                 <h4 className="text-[10px] font-black uppercase text-[#48c1d2] tracking-[0.3em] mb-8">Limpieza</h4>
                 <div className="space-y-3">
                    {(data.servicios_basicos || []).map((s: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                         <span className="text-xs font-bold text-white uppercase">{s}</span>
                         <CheckCircle2 size={14} className="text-[#48c1d2] opacity-50" />
                      </div>
                    ))}
                 </div>
              </div>
              <div className={CARD_STYLE}>
                 <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em] mb-8">Premium</h4>
                 <div className="space-y-3">
                    {(data.servicios_premium || []).map((s: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                         <span className="text-xs font-bold text-white uppercase">{s}</span>
                         <Zap size={14} className="text-amber-500 opacity-50" />
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
