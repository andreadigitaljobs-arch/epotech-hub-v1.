"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
  useThemeColor("#f8fafc");
  const [data, setData] = useState<any>({
    mision_desc: "Transformar espacios. Entregar resultados. Construir confianza.",
    propuesta_valor: "Transformamos espacios haciendo que se vean como nuevos, de forma rápida, profesional y con resultados visibles. Ofrecemos soluciones tanto funcionales como estéticas, desde limpieza hasta acabados premium.",
    diferenciador: "Combinamos servicios de alto volumen (pressure washing) con servicios de alto valor (epoxy), lo que nos permite captar clientes fácilmente y luego ofrecer soluciones premium.",
    perfil_cliente: "Propietarios de vivienda (hombres y mujeres) en EE.UU. (principalmente Utah) que valoran calidad, rapidez, resultados visibles y servicio confiable.",
    tono_voz: "Directo (Mensajes claros y sin rodeos). Enfocado en resultados (Priorizamos beneficios visibles). Sin tecnicismos (Evitamos lenguaje complejo). Transformación antes/después (Mostramos el cambio real).",
    servicios_basicos: ["LAVADO DE CASAS (SOFT WASH)", "LIMPIEZA DE ENTRADAS (DRIVEWAYS)", "LIMPIEZA DE TECHOS", "LIMPIEZA EXTERIOR GENERAL"],
    servicios_premium: ["PISOS EPÓXICOS (FLAKE Y METÁLICO)", "ACABADOS PARA INTERIORES", "RECUBRIMIENTOS PARA CANCHAS DEPORTIVAS", "POSICIONAMIENTO GOOGLE MAPS"],
    mensajes_clave: ["HACEMOS QUE TU HOGAR SE VEA COMO NUEVO", "COTIZACIÓN GRATIS", "SERVICIO RÁPIDO Y CONFIABLE", "SALT LAKE CITY / UTAH"]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: eData } = await supabase
        .from("config_estrategia")
        .select("*")
        .maybeSingle();
      
      if (eData) {
        setData(eData);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const CARD_STYLE = "p-6 md:p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl relative overflow-hidden group";

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 pb-24">
      {/* 1. INSTRUCCIONES PREMIUM */}
      <div className="mb-4">
        <div className="bg-white/50 border border-slate-200 p-6 rounded-[2rem] w-full shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed text-left">
            <span className="text-[#48c1d2]">Arquitectura de Marca:</span> Este es el ADN de Epotech. Consulta tu misión, visión y perfil de cliente para que tu comunicación sea siempre coherente y profesional.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* 2. HERO ESTRATÉGICO */}
        <header className="relative p-6 md:p-6 md:rounded-[2rem] bg-transparent text-[#0a192f] overflow-visible">
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] hidden md:block rotate-12">
              <Compass size={220} />
            </div>
          </div>
          <div className="relative z-10 text-left flex flex-col items-start">

            <h1 className="text-2xl md:text-5xl font-black tracking-tighter mb-6 leading-[1.1] text-[#142d53] max-w-2xl">
              El Brief maestro <span className="text-[#48c1d2]">Epotech Hub</span>
            </h1>
            <p className="text-lg text-slate-500 font-medium italic max-w-2xl">
              "Consulta esta brújula para que tu tono y mensajes sean siempre coherentes."
            </p>
          </div>
        </header>

        {/* 2. PROPUESTA Y DIFERENCIADOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={CARD_STYLE}>
            <div className="absolute -right-10 -bottom-10 text-[#48c1d2]/5 group-hover:scale-110 transition-transform duration-1000">
               <Target size={200} />
            </div>
            <div className="relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#48c1d2]"></div>
                Propuesta de Valor
              </h2>
              <p className="text-xl font-bold text-[#142d53] leading-snug">
                {data.propuesta_valor}
              </p>
            </div>
          </div>

          <div className={CARD_STYLE}>
            <div className="absolute -right-10 -bottom-10 text-amber-500/5 group-hover:scale-110 transition-transform duration-1000">
               <Star size={200} />
            </div>
            <div className="relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                Diferenciador Único
              </h2>
              <p className="text-xl font-bold text-[#142d53] leading-snug">
                {data.diferenciador}
              </p>
            </div>
          </div>
        </div>

        {/* 3. AUDIENCIA Y TONO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={CARD_STYLE}>
            <div className="absolute top-0 right-0 p-10 opacity-20">
               <div className="grid grid-cols-5 gap-2">
                  {[...Array(15)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#48c1d2] rounded-full"></div>)}
               </div>
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
               <Users size={16} className="text-[#48c1d2]" />
               Audiencia Ideal
            </h2>
            <p className="text-xl font-bold text-[#142d53] leading-snug">
               {data.perfil_cliente}
            </p>
          </div>

          <div className={CARD_STYLE}>
            <div className="absolute -right-10 -bottom-10 text-[#48c1d2]/5 group-hover:scale-110 transition-transform duration-1000">
               <MessageSquare size={200} />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
               <MessageSquare size={16} className="text-[#48c1d2]" />
               Tono de Comunicación
            </h2>
            <p className="text-xl font-bold text-[#142d53] leading-snug mb-6 relative z-10">
               {data.tono_voz}
            </p>
            <div className="flex flex-wrap gap-2 relative z-10">
               {["Directo", "Profesional", "Visible"].map(tag => (
                 <span key={tag} className="text-[8px] font-black uppercase bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-[#48c1d2] tracking-widest">
                   {tag}
                 </span>
               ))}
            </div>
          </div>
        </div>

        {/* 4. SERVICIOS */}
        <div className="space-y-8">
           <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Portafolio de Servicios</h3>
              <div className="h-px flex-1 bg-slate-200"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={CARD_STYLE}>
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Droplets size={100} className="text-[#48c1d2]" />
                 </div>
                 <h4 className="text-[10px] font-black uppercase text-[#48c1d2] tracking-[0.3em] mb-4">Soluciones de Limpieza</h4>
                 <div className="space-y-3 relative z-10">
                    {(data.servicios_basicos || []).map((s: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <span className="text-xs font-bold text-[#142d53] uppercase">{s}</span>
                         <CheckCircle2 size={14} className="text-[#48c1d2] opacity-50" />
                      </div>
                    ))}
                 </div>
              </div>

              <div className={CARD_STYLE}>
                 <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                    <Paintbrush size={100} className="text-amber-500" />
                 </div>
                 <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em] mb-4">Renovación Premium</h4>
                 <div className="space-y-3 relative z-10">
                    {(data.servicios_premium || []).map((s: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                         <span className="text-xs font-bold text-[#142d53] uppercase">{s}</span>
                         <Zap size={14} className="text-amber-500 opacity-50" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* 5. PILARES DE ESTRATEGIA VIRAL */}
        <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#48c1d2]/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-12 relative z-10">Pilares de Estrategia Viral</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {(data.mensajes_clave || []).map((m: string, idx: number) => (
                <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center shadow-sm">
                   <div className="w-8 h-8 rounded-full bg-[#f8fafc] border border-slate-200 flex items-center justify-center mx-auto mb-4">
                      <Zap size={14} className="text-[#48c1d2]" />
                   </div>
                   <p className="text-[10px] font-black text-[#142d53] uppercase tracking-tight">&quot;{m}&quot;</p>
                </div>
              ))}
           </div>
        </div>

        {/* 6. CIERRE */}
        <footer className="bg-transparent p-12 md:p-20 text-center relative overflow-hidden">
           <div className="relative z-10 space-y-6">
              <div className="bg-white p-4 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                 <ShieldCheck size={28} className="text-[#0a192f]" />
              </div>
              <h4 className="text-2xl md:text-4xl font-black italic text-[#142d53]">
                 Este brief es <span className="text-[#48c1d2]">tu brújula</span>
              </h4>
              <p className="text-slate-500 text-sm font-bold italic max-w-lg mx-auto">
                 &quot;Si no construye confianza o transformación real, no pertenece a Epotech.&quot;
              </p>
           </div>
        </footer>

      </div>
    </div>
  );
}
