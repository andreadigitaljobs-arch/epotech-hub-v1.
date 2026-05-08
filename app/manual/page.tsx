"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { manual as staticManual } from "@/data/manual";
import { 
  Camera, 
  Settings, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Zap,
  Play,
  Video,
  HelpCircle,
  UserCheck,
  Trophy,
  Smartphone
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useThemeColor } from "@/components/layout/ThemeColorHandler";

const phaseIcons: Record<string, any> = {
  antes: Camera,
  durante: Settings,
  despues: Sparkles,
  humano: UserCheck,
};

const phaseColors: Record<string, string> = {
  antes: "bg-blue-50 text-blue-600 border-blue-100",
  durante: "bg-amber-50 text-amber-600 border-amber-100",
  despues: "bg-emerald-50 text-emerald-600 border-emerald-100",
  humano: "bg-purple-50 text-purple-600 border-purple-100",
};

const phaseMessages: Record<string, string> = {
  antes: "El antes es lo que vende el después. Si el problema no se ve claro, la transformación perderá impacto.\n\n💡 Si no sabes cómo hacer una toma, dale al botón '¿CÓMO GRABARLO?'.",
  durante: "Múltiples ángulos = versátil. Clips cortos = dinámico. Valor agregado = diferenciador. Jenkryfer en video = humanidad.\n\n💡 Si no sabes cómo hacer una toma, dale al botón '¿CÓMO GRABARLO?'.",
  despues: "El espectador recuerda primero lo último que vio. Que sea satisfactorio.\n\n💡 Si no sabes cómo hacer una toma, dale al botón '¿CÓMO GRABARLO?'.",
  humano: "Estos videos son la pieza clave para tus STORIES. Al grabarlos, humanizas tu marca y generas confianza diaria.\n\n💡 Si no sabes cómo hacer una toma, dale al botón '¿CÓMO GRABARLO?'.",
};

export default function ManualPage() {
  useThemeColor("#142d53");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState("antes");
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    async function fetchData() {
      try {
        const { data: mData } = await supabase.from("config_manual").select("*").maybeSingle();
        const fallback = {
          regla_oro: staticManual.regla.ruleEs,
          haz_list: staticManual.comoGrabar.haz.map(h => h.es),
          evita_list: staticManual.comoGrabar.evita.map(e => e.es),
          fases: staticManual.fases
        };
        if (mData) {
          setData({
            regla_oro: mData.regla_oro || fallback.regla_oro,
            haz_list: (mData.haz_list && mData.haz_list.length > 0) ? mData.haz_list : fallback.haz_list,
            evita_list: (mData.evita_list && mData.evita_list.length > 0) ? mData.evita_list : fallback.evita_list,
            fases: (mData.fases && mData.fases.length > 0) ? mData.fases : fallback.fases
          });
        } else {
          setData(fallback);
        }
      } catch (error) {
        console.error("Error loading manual:", error);
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    }
    fetchData();
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner message="Cargando protocolos..." />;

  const phases = (data.fases || staticManual.fases).map((fase: any) => {
    let itemsFinales = [...(fase.items || [])];
    if (fase.id === 'antes') {
      itemsFinales = [
        {
          en: "⚙️ TECHNICAL SETUP",
          es: "⚙️ CONFIGURACIÓN TÉCNICA",
          tooltip: "Asegura la mejor calidad antes de grabar:\n\n• Resolución: 4K 60fps\n• Formato: Vertical (9:16)\n• Iluminación: Luz natural\n• Movimiento: Suave\n• Audio: Real"
        },
        ...itemsFinales
      ];
    }
    return { ...fase, items: itemsFinales };
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* HEADER INTEGRADO CON STATUS BAR */}
      <div className="bg-[#142d53] pt-[env(safe-area-inset-top)] relative overflow-hidden">
        {/* Glows Premium */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#48c1d2]/10 rounded-full blur-[100px] -mr-48 -mt-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#48c1d2]/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

        <div className="max-w-5xl mx-auto px-6 pt-8 pb-16 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#48c1d2] p-1.5 rounded-lg shadow-lg">
              <Video size={14} className="text-[#142d53]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#48c1d2]">Protocolo de Campo</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-6 leading-none">
            Guía de Grabación <br />
            <span className="text-[#48c1d2]">Master</span>
          </h1>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md max-w-2xl">
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-tight">
              <span className="text-[#48c1d2]">Instrucción Táctica:</span> Sigue estos protocolos sobre luz, audio y encuadre para transmitir la autoridad de una empresa líder en Utah.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-20">
        <div className="space-y-6">
          {/* Estrategia Card */}
          <div className="bg-[#48c1d2] p-8 rounded-[2.5rem] text-[#142d53] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
               <Trophy size={120} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-xl"><Trophy size={20} /></div>
                <h4 className="text-xl font-black tracking-tight">Nuestra Estrategia</h4>
              </div>
              <p className="text-sm font-bold leading-tight mb-6 max-w-md">
                Documental Real: Menos anuncios falsos, más realidad y autoridad.
              </p>
              <a 
                href="https://www.tiktok.com/@allsidespressurewashing" 
                target="_blank" 
                className="inline-flex items-center gap-3 bg-[#142d53] text-[#48c1d2] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                <Smartphone size={16} /> Ver Referencia Real
              </a>
            </div>
          </div>

          {/* Regla de Oro */}
          <div className="bg-[#0a192f] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute -right-6 -bottom-6 opacity-10">
              <Zap size={140} className="text-[#48c1d2]" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#48c1d2] mb-3">La Regla de Oro</h3>
            <p className="text-xl font-black italic leading-tight text-balance text-white">
              "{data.regla_oro}"
            </p>
          </div>

          {/* Selector de Fase */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {phases.map((fase: any) => {
              const Icon = phaseIcons[fase.id] || Camera;
              const isActive = activePhase === fase.id;
              return (
                <button
                  key={fase.id}
                  onClick={() => setActivePhase(fase.id)}
                  className={`flex items-center gap-3 p-4 rounded-2xl transition-all border ${
                    isActive 
                      ? "bg-white border-[#48c1d2] shadow-xl scale-105 z-10" 
                      : "bg-gray-50 border-transparent text-slate-400 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-[#48c1d2] text-[#142d53]" : "bg-white border"}`}>
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-left leading-tight">
                    {fase.titulo}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contenido de Fase */}
          <div className="min-h-[400px]">
            {phases.map((fase: any) => {
              if (activePhase !== fase.id) return null;
              const Icon = phaseIcons[fase.id] || Play;
              const colorStyles = phaseColors[fase.id] || "bg-gray-100";

              return (
                <div key={fase.id} className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                  <Card className="p-8 border-t-8 shadow-2xl rounded-[3rem] border-white" style={{ borderTopColor: fase.id === 'antes' ? '#3b82f6' : fase.id === 'durante' ? '#f59e0b' : fase.id === 'despues' ? '#10b981' : '#a855f7' }}>
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`p-4 rounded-2xl border shadow-sm ${colorStyles}`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-[#142d53] tracking-tighter uppercase italic">{fase.titulo}</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Checklist Táctico</p>
                      </div>
                    </div>

                    <div className={`mb-8 p-6 rounded-[2rem] border transition-all ${activePhase === 'humano' ? 'bg-purple-50 border-purple-100' : 'bg-blue-50/50 border-blue-100/50'}`}>
                      <p className={`text-[11px] font-bold uppercase tracking-tight leading-relaxed ${activePhase === 'humano' ? 'text-purple-700' : 'text-[#142d53]'}`}>
                        <span className={`inline-block text-white px-2 py-1 rounded-md mr-3 mb-1 ${activePhase === 'humano' ? 'bg-purple-600' : 'bg-[#142d53]'}`}>
                          ESTRATEGIA 2026:
                        </span>
                        {phaseMessages[activePhase]}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fase.items.map((item: any, idx: number) => (
                        <div key={idx} className="group flex items-start gap-4 p-5 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:border-[#48c1d2] hover:shadow-xl transition-all duration-300">
                          <div className="mt-1 bg-white border border-slate-200 group-hover:border-[#48c1d2] rounded-xl w-8 h-8 flex items-center justify-center shrink-0 text-[11px] font-black text-[#48c1d2] shadow-sm">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-black text-[#142d53] leading-tight pt-1 flex items-center justify-between gap-4">
                              <span>{(item.es || item)}</span>
                              {item.tooltip && (
                                <button
                                  onClick={() => setActiveTooltip(activeTooltip === idx ? null : idx)}
                                  className="shrink-0 p-2 bg-[#142d53] hover:bg-[#48c1d2] text-white rounded-xl transition-all shadow-lg active:scale-95"
                                >
                                  <HelpCircle size={14} />
                                </button>
                              )}
                            </p>
                            
                            {activeTooltip === idx && item.tooltip && (
                              <div className="mt-4 p-5 bg-[#142d53] text-white rounded-2xl text-[10px] font-bold leading-relaxed animate-in zoom-in-95 duration-200 shadow-2xl relative border border-white/10 whitespace-pre-line">
                                <div className="absolute -top-2 right-4 w-4 h-4 bg-[#142d53] rotate-45 border-l border-t border-white/10"></div>
                                <span className="text-[#48c1d2] font-black uppercase block mb-2 tracking-widest">Protocolo:</span>
                                {item.tooltip}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 bg-emerald-50/30 border-emerald-100 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-200">
                   <CheckCircle2 size={18} />
                </div>
                <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest">Protocolo "SÍ"</h4>
              </div>
              <ul className="space-y-3">
                {(data.haz_list || []).map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-xs font-bold text-emerald-800">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-8 bg-red-50/30 border-red-100 rounded-[2.5rem]">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-500 p-2 rounded-xl text-white shadow-lg shadow-red-200">
                   <AlertCircle size={18} />
                </div>
                <h4 className="text-sm font-black text-red-900 uppercase tracking-widest">Protocolo "NO"</h4>
              </div>
              <ul className="space-y-3">
                {(data.evita_list || []).map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-3 text-xs font-bold text-red-800">
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
