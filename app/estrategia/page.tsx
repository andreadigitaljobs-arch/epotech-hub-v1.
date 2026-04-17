"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { estrategia as staticData } from "@/data/estrategia";
import {
  Target, Zap, Settings, Star, Heart, CheckCircle2,
  MessageSquare, RefreshCw, MousePointerClick,
  Camera, Users, Video, Globe, Award, Droplets,
  TrendingUp, ChevronRight, ClipboardList, Wrench,
  Compass
} from "lucide-react";
import { ComponentType } from "react";

const IconMap: Record<string, ComponentType<any>> = {
  zap: Zap,
  settings: Settings,
  star: Star,
  heart: Heart,
  target: Target,
  message: MessageSquare,
  refresh: RefreshCw,
  pointer: MousePointerClick,
  instagram: Camera,
  facebook: Users,
  video: Video,
  globe: Globe,
  users: Users,
  form: ClipboardList,
};

export default function EstrategiaPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: eData } = await supabase
        .from("config_estrategia")
        .select("*")
        .maybeSingle();
      
      if (eData) {
        setData(eData);
      } else {
        // Fallback to static if no DB config yet
        setData({
          mision_titulo: staticData.mision.titulo,
          mision_desc: staticData.mision.descripcion,
          diferenciador: staticData.diferenciador,
          objetivos: staticData.objetivosMarketing,
          mensajes_clave: staticData.mensajesClave.map(m => m.es)
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent mb-4"></div>
        <p className="font-bold">Sincronizando estrategia...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Banner */}
      <div className="relative rounded-[40px] overflow-hidden bg-[var(--primary)] p-10 shadow-2xl">
        <div className="absolute inset-0 opacity-10 flex items-center justify-end pr-8">
          <Target size={240} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[var(--accent)] text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full">
              Plan Maestro 2024
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
            Estrategia de <br />Crecimiento
          </h1>
          <p className="text-white/80 text-lg font-medium leading-relaxed max-w-xl italic">
            "{data.mision_desc}"
          </p>
        </div>
      </div>

      {/* Objetivos Globales */}
      <section>
        <div className="flex items-center gap-3 mb-8">
           <div className="h-2 w-10 bg-[var(--accent)] rounded-full" />
           <h2 className="text-2xl font-black text-[var(--primary)] uppercase tracking-tight">Objetivos de Marketing</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.objetivos || []).map((obj: string, idx: number) => (
            <div key={idx} className="group p-6 bg-white border border-[var(--border)] rounded-[32px] flex items-start gap-5 hover:border-[var(--accent)] transition-all hover:shadow-xl shadow-blue-900/5">
               <div className="bg-[var(--bg)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl text-lg font-black text-[var(--primary)]">
                 {idx + 1}
               </div>
               <p className="text-base font-black text-[var(--primary)] leading-snug pt-2">{obj}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Diferenciador */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-10 bg-blue-50 border-blue-100 relative overflow-hidden">
          <div className="absolute right-6 top-6 opacity-20 text-blue-300">
            <Award size={64} />
          </div>
          <h2 className="font-black text-blue-900 text-sm uppercase tracking-[0.25em] mb-4">El Diferenciador Epotech</h2>
          <p className="text-blue-950 text-xl leading-tight font-black max-w-lg">
            {data.diferenciador || staticData.diferenciador}
          </p>
        </Card>

        <Card className="p-8 border-2 border-dashed border-gray-200 flex flex-col justify-center text-center">
            <Compass className="mx-auto mb-4 text-[var(--accent)]" size={44} />
            <h4 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 font-black">Norte Estratégico</h4>
            <p className="text-sm font-bold text-[var(--primary)] leading-relaxed">
              Enfocados en resultados visibles e impecables para cada cliente.
            </p>
        </Card>
      </div>

      {/* Mensajes Clave */}
      <section className="pt-10 border-t">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-[var(--primary)] uppercase tracking-tighter">Mensajes de Alto Impacto</h2>
          <Zap size={24} className="text-[var(--accent)]" />
        </div>
        <div className="flex flex-wrap gap-4">
          {(data.mensajes_clave || []).map((msg: string, idx: number) => (
            <div key={idx} className="px-8 py-4 bg-white border-2 border-gray-100 rounded-[24px] text-sm font-black text-[var(--primary)] shadow-sm hover:border-[var(--accent)] transition-colors cursor-default">
               {msg}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
