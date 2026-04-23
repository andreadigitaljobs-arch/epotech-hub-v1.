"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
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
  Trophy,
  ShieldCheck,
  Award,
  Droplets,
  Paintbrush,
  Sparkles,
  Info,
  ArrowDownCircle
} from "lucide-react";

export default function BrandBriefPage() {
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
        setData({
          mision_desc: "Transformar espacios. Entregar resultados. Construir confianza.",
          propuesta_valor: "Elevamos el valor de las propiedades en Utah con servicios de limpieza y renovación de estándares impecables.",
          diferenciador: "No vendemos tecnicismos, vendemos resultados visibles. Enfoque 100% en la tranquilidad del cliente.",
          perfil_cliente: "Dueños de propiedades en Salt Lake City que valoran su tiempo y buscan un servicio profesional de alta gama.",
          tono_voz: "Profesional, Directo y de Confianza. Hablamos a través de los resultados, no de las promesas.",
          servicios_basicos: ["Pressure Washing", "Soft Wash", "Concrete Sealing", "Gutter Cleaning"],
          servicios_premium: ["Exterior Painting", "Epoxy Flooring", "Sports Courts", "Roof Coating"],
          mensajes_clave: ["Gratis Quote", "Transformación", "Salt Lake City Legacy"]
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Sincronizando Estrategia..." />;

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32 pt-8">
      
      {/* 1. HERO MINIMALISTA (Apple Style) */}
      <header className="relative py-16 px-12 rounded-[3rem] bg-slate-950 text-white overflow-hidden shadow-2xl ring-1 ring-white/10">
        <div className="absolute -top-20 -right-20 p-8 opacity-5">
          <Compass size={320} strokeWidth={1} />
        </div>
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-3 mb-8">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-[0.2em] text-blue-300">
              Brand Identity 2026
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 leading-tight uppercase italic">
            El Brief Maestro <span className="text-blue-400">Epotech Hub</span>
          </h1>
          <p className="text-lg font-light text-slate-400 max-w-2xl leading-relaxed">
            "{data.mision_desc}"
          </p>
        </div>
      </header>

      {/* 2. PILARES FUNDAMENTALES (Diseño de tarjetas Airy) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group">
           <Card className="h-full p-10 bg-white border-slate-100/60 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 ring-1 ring-slate-100">
             <div className="flex items-center justify-between mb-10">
                <div className="bg-blue-50/50 p-3 rounded-2xl text-blue-600 ring-1 ring-blue-100">
                   <Target size={22} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-300">Propuesta de Valor</span>
             </div>
             <p className="text-lg font-bold text-slate-800 leading-relaxed italic">
               "{data.propuesta_valor}"
             </p>
           </Card>
        </div>

        <div className="group">
           <Card className="h-full p-10 bg-slate-50/40 border-slate-200/50 rounded-[3rem] shadow-sm hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-500">
             <div className="flex items-center justify-between mb-10">
                <div className="bg-amber-50/50 p-3 rounded-2xl text-amber-600 ring-1 ring-amber-100">
                   <Star size={22} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-600/50">Diferenciador Clave</span>
             </div>
             <p className="text-lg font-bold text-slate-800 leading-relaxed italic">
               "{data.diferenciador}"
             </p>
           </Card>
        </div>
      </section>

      {/* 3. AUDIENCIA Y COMUNICACIÓN (Refinado) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="flex items-center gap-3 px-2">
              <Users size={18} strokeWidth={1.5} className="text-slate-400" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Audiencia</h3>
           </div>
           <Card className="p-8 bg-white border-slate-100/60 rounded-[2.5rem] shadow-sm ring-1 ring-slate-100">
              <p className="text-sm font-normal text-slate-500 leading-relaxed">
                 {data.perfil_cliente}
              </p>
           </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center gap-3 px-2">
              <MessageSquare size={18} strokeWidth={1.5} className="text-blue-500" />
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">Voz de Marca</h3>
           </div>
           <Card className="p-8 bg-slate-900 border-none rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                 <MessageSquare size={120} />
              </div>
              <div className="relative z-10">
                <p className="text-lg font-light text-white/90 leading-relaxed mb-8">
                   {data.tono_voz}
                </p>
                <div className="flex gap-2">
                   <span className="text-[9px] font-medium uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-white/40 tracking-[0.2em]">Sincero</span>
                   <span className="text-[9px] font-medium uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-white/40 tracking-[0.2em]">Experto</span>
                </div>
              </div>
           </Card>
        </div>
      </section>

      {/* 4. PORTAFOLIO (Minimalista) */}
      <section className="space-y-8">
         <div className="text-center space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">Portafolio de Soluciones</h3>
            <div className="h-0.5 w-12 bg-blue-100 mx-auto rounded-full"></div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-8 h-[1px] bg-emerald-100 hidden md:block"></div>
                  <h4 className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">Cleaning & Care</h4>
               </div>
               <div className="grid grid-cols-1 gap-3">
                  {(data.servicios_basicos || []).map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 hover:border-emerald-100 transition-all group">
                       <span className="text-sm font-medium text-slate-600">{s}</span>
                       <CheckCircle2 size={16} className="text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div className="w-8 h-[1px] bg-blue-100 hidden md:block"></div>
                  <h4 className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">Premium Renovation</h4>
               </div>
               <div className="grid grid-cols-1 gap-3">
                  {(data.servicios_premium || []).map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-3xl border border-slate-100 hover:border-blue-100 transition-all group">
                       <span className="text-sm font-medium text-slate-600">{s}</span>
                       <Zap size={16} className="text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* 5. PILARES VIRALES (Clean Bento Style) */}
      <section className="bg-slate-50/50 p-12 rounded-[4rem] border border-slate-100 shadow-inner">
         <div className="text-center mb-12 space-y-2">
            <Sparkles size={24} className="text-amber-400 mx-auto mb-2 opacity-50" />
            <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400">Viral Content Pillars</h3>
         </div>
         
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {(data.mensajes_clave || []).map((m: string, idx: number) => (
              <Card key={idx} className="p-8 text-center bg-white rounded-[2.5rem] border-slate-100/60 shadow-sm hover:scale-[1.03] transition-transform duration-500">
                 <span className="text-xs font-bold text-slate-200 block mb-3 font-mono">0{idx + 1}</span>
                 <p className="text-xs font-semibold text-slate-700 uppercase tracking-tighter leading-tight">{m}</p>
              </Card>
            ))}
         </div>
      </section>

      {/* 6. MASTER FILTER (Premium Glassmorphism) */}
      <footer className="relative group">
         <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-[4rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
         <div className="relative bg-white p-12 rounded-[3.5rem] border border-slate-100 text-center space-y-8 overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full bg-slate-50/20 backdrop-blur-3xl -z-10"></div>
            <div className="bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
               <ShieldCheck size={36} strokeWidth={1} className="text-emerald-600" />
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
               <h4 className="text-3xl font-light text-slate-900 tracking-tight">El <span className="font-semibold text-emerald-600">Filtro Maestro</span></h4>
               <p className="text-lg font-bold text-slate-500 leading-relaxed italic">
                  "Todo lo que hagamos debe pasar por aquí. Si no construye confianza o muestra transformación real, no pertenece a Epotech."
               </p>
               <div className="flex justify-center pt-4">
                  <div className="h-0.5 w-12 bg-slate-200 rounded-full"></div>
               </div>
            </div>
         </div>
      </footer>

    </div>
  );
}
