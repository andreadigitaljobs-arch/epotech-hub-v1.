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
  ArrowRight,
  Zap,
  Play,
  Video,
  HelpCircle,
  UserCheck
} from "lucide-react";

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

export default function ManualPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState("antes");
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: mData } = await supabase
        .from("config_manual")
        .select("*")
        .maybeSingle();
      
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
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent mb-4"></div>
        <p className="font-bold">Cargando protocolos...</p>
      </div>
    );
  }

  // Use dynamic phases if available, otherwise static
  const phases = data.fases || staticManual.fases;

  return (
    <div className="space-y-10 pb-16">
      <header className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-[var(--accent)] p-2 rounded-xl shadow-lg shadow-blue-900/20">
            <Video size={20} className="text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Protocolo de Campo</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-[var(--primary)] text-balance">
          Guía de Grabación Master
        </h1>
        <p className="mt-3 text-base font-medium text-[var(--text-muted)] max-w-xl leading-relaxed">
          Cómo capturar el contenido que vende. Sigue estos pasos en cada trabajo para asegurar calidad premium.
        </p>
      </header>

      {/* Regla de Oro */}
      <div className="group bg-[var(--primary)] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl transition-transform hover:scale-[1.01]">
        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
          <Zap size={240} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] mb-4">La Regla de Oro Mundial</h3>
        <p className="text-3xl font-black italic leading-tight text-balance">
          "{data.regla_oro}"
        </p>
      </div>

      {/* Selector de Fase */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {phases.map((fase: any) => {
          const Icon = phaseIcons[fase.id] || Camera;
          const isActive = activePhase === fase.id;
          return (
            <button
              key={fase.id}
              onClick={() => setActivePhase(fase.id)}
              className={`flex items-center gap-4 p-5 rounded-[32px] transition-all border-2 ${
                isActive 
                  ? "bg-white border-[var(--accent)] shadow-xl translate-y-[-4px]" 
                  : "bg-gray-50 border-transparent text-[var(--text-muted)] opacity-70 hover:opacity-100"
              }`}
            >
              <div className={`p-3 rounded-2xl ${isActive ? "bg-[var(--accent)] text-white shadow-lg shadow-blue-500/30" : "bg-white border"}`}>
                <Icon size={24} />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-left leading-tight">
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
            <div key={fase.id} className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              <Card className="p-10 border-t-[12px] shadow-2xl rounded-[48px]" style={{ borderTopColor: fase.id === 'antes' ? '#3b82f6' : fase.id === 'durante' ? '#f59e0b' : fase.id === 'despues' ? '#10b981' : '#a855f7' }}>
                <div className="flex items-center gap-5 mb-10">
                  <div className={`p-4 rounded-[24px] border-2 ${colorStyles}`}>
                    <Icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-[var(--primary)] tracking-tighter">{fase.titulo}</h3>
                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Checklist de grabación</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {fase.items.map((item: any, idx: number) => (
                    <div key={idx} className="group flex items-start gap-4 p-6 bg-gray-50/50 rounded-[32px] border border-gray-100 hover:bg-white hover:border-[var(--accent)] transition-all relative">
                      <div className="mt-1 bg-white border-2 border-[var(--border)] group-hover:border-[var(--accent)] rounded-2xl w-8 h-8 flex items-center justify-center shrink-0 text-xs font-black text-[var(--accent)] transition-colors">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-bold text-[var(--primary)] leading-tight pt-1 pr-6 relative">
                          <span className="md:max-w-[85%] block">{(item.es || item)}</span>
                          {item.tooltip && (
                            <button
                              onClick={() => setActiveTooltip(activeTooltip === idx ? null : idx)}
                              className="absolute top-0 right-0 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                              title="¿Qué significa esto?"
                            >
                              <HelpCircle size={20} />
                            </button>
                          )}
                        </p>
                        {item.tooltip && activeTooltip === idx && (
                          <div className="mt-3 text-sm text-[var(--accent)] bg-blue-50/50 p-4 border border-blue-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
                             <span className="font-bold flex items-center gap-1 mb-1">
                               <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /> 
                               En español simple:
                             </span>
                             {item.tooltip}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4">
                  <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                    <AlertCircle size={20} />
                  </div>
                  <p className="text-xs font-black text-amber-900 uppercase tracking-widest">
                    Consejo Pro: Los clips deben durar máximo 5 segundos para que sean dinámicos.
                  </p>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Haz y Evita - Updated for Hub 3.0 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-10 bg-emerald-50/30 border-emerald-100 rounded-[40px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-emerald-500 p-2 rounded-xl text-white shadow-lg shadow-emerald-500/20">
               <CheckCircle2 size={24} />
            </div>
            <h4 className="text-xl font-black text-emerald-900 uppercase tracking-tighter">Protocolo "SÍ"</h4>
          </div>
          <ul className="space-y-4">
            {(data.haz_list || []).map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-4 text-sm font-bold text-emerald-800">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-10 bg-red-50/30 border-red-100 rounded-[40px]">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-red-500 p-2 rounded-xl text-white shadow-lg shadow-red-500/20">
               <AlertCircle size={24} />
            </div>
            <h4 className="text-xl font-black text-red-900 uppercase tracking-tighter">Protocolo "NO"</h4>
          </div>
          <ul className="space-y-4">
            {(data.evita_list || []).map((item: string, idx: number) => (
              <li key={idx} className="flex items-start gap-4 text-sm font-bold text-red-800">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

    </div>
  );
}
