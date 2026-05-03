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
          propuesta_valor: "Transformamos espacios haciendo que se vean como nuevos, de forma rápida, profesional y con resultados visibles. Ofrecemos soluciones tanto funcionales como estéticas, desde limpieza hasta acabados premium.",
          diferenciador: "Combinamos servicios de alto volumen (pressure washing) con servicios de alto valor (epoxy), lo que nos permite captar clientes fácilmente y luego ofrecer soluciones premium.",
          perfil_cliente: "Propietarios de vivienda (hombres y mujeres) en EE.UU. (principalmente Utah) que valoran calidad, rapidez, resultados visibles y servicio confiable.",
          tono_voz: "Directo (Mensajes claros y sin rodeos). Enfocado en resultados (Priorizamos beneficios visibles). Sin tecnicismos (Evitamos lenguaje complejo). Transformación antes/después (Mostramos el cambio real).",
          servicios_basicos: ["LAVADO DE CASAS (SOFT WASH)", "LIMPIEZA DE ENTRADAS (DRIVEWAYS)", "LIMPIEZA DE TECHOS", "LIMPIEZA EXTERIOR GENERAL"],
          servicios_premium: ["PISOS EPÓXICOS (FLAKE Y METÁLICO)", "ACABADOS PARA INTERIORES", "RECUBRIMIENTOS PARA CANCHAS DEPORTIVAS", "POSICIONAMIENTO GOOGLE MAPS"],
          mensajes_clave: ["HACEMOS QUE TU HOGAR SE VEA COMO NUEVO", "COTIZACIÓN GRATIS", "SERVICIO RÁPIDO Y CONFIABLE", "SALT LAKE CITY / UTAH"]
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Sincronizando Estrategia..." />;

  const CARD_STYLE = "p-8 md:p-12 bg-[#0a192f] border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group";

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 pb-32">
      <div className="max-w-5xl mx-auto px-6 space-y-6">
        
        {/* Texto Tutorial Contextual Premium */}
        <div className="bg-white/50 border border-slate-200 p-6 rounded-[2rem] w-full">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
            <span className="text-[#48c1d2]">Arquitectura de Marca:</span> Este es el ADN de Epotech. Consulta tu misión, visión y perfil de cliente para que tu comunicación sea siempre coherente y profesional.
          </p>
        </div>

        {/* 1. HERO ESTRATÉGICO */}
        <header className="relative p-6 md:p-12 rounded-[2rem] bg-[#0a192f] text-white overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block rotate-12">
            <Compass size={220} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-[#48c1d2] p-2 rounded-lg">
                <Target size={16} className="text-[#0a192f]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#48c1d2]">Arquitectura de Marca 2026</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-[1.1] uppercase">
              El Brief Maestro <br /> <span className="text-[#48c1d2]">Epotech Hub</span>
            </h1>
            <p className="text-lg text-slate-300 italic border-l-4 border-[#48c1d2] pl-6 max-w-2xl">
              "Consulta esta brújula para que tu tono y mensajes sean siempre coherentes."
            </p>
          </div>
        </header>

        {/* 2. PROPUESTA Y DIFERENCIADOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={CARD_STYLE}>
            <div className="absolute -right-10 -bottom-10 text-blue-500/10 group-hover:scale-110 transition-transform duration-1000">
               <Target size={200} />
            </div>
            <div className="relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Propuesta de Valor
              </h2>
              <p className="text-xl font-bold text-white leading-snug">
                {data.propuesta_valor}
              </p>
            </div>
          </div>

          <div className={CARD_STYLE}>
            <div className="absolute -right-10 -bottom-10 text-amber-500/10 group-hover:scale-110 transition-transform duration-1000">
               <Star size={200} />
            </div>
            <div className="relative z-10">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                Diferenciador Único
              </h2>
              <p className="text-xl font-bold text-white leading-snug">
                {data.diferenciador}
              </p>
            </div>
          </div>
        </div>

        {/* 3. AUDIENCIA Y TONO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={CARD_STYLE}>
            <div className="absolute top-0 right-0 p-10 opacity-[0.05]">
               <div className="grid grid-cols-5 gap-2">
                  {[...Array(15)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-[#48c1d2] rounded-full"></div>)}
               </div>
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
               <Users size={16} className="text-[#48c1d2]" />
               Audiencia Ideal
            </h2>
            <p className="text-xl font-bold text-white leading-snug">
               {data.perfil_cliente}
            </p>
          </div>

          <div className={CARD_STYLE}>
            <div className="absolute -right-10 -bottom-10 text-[#48c1d2]/10 group-hover:scale-110 transition-transform duration-1000">
               <MessageSquare size={200} />
            </div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
               <MessageSquare size={16} className="text-[#48c1d2]" />
               Tono de Comunicación
            </h2>
            <p className="text-xl font-bold text-white leading-snug mb-6">
               {data.tono_voz}
            </p>
            <div className="flex flex-wrap gap-2">
               {["Directo", "Profesional", "Visible"].map(tag => (
                 <span key={tag} className="text-[8px] font-black uppercase bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-[#48c1d2] tracking-widest">
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
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Droplets size={100} className="text-[#48c1d2]" />
                 </div>
                 <h4 className="text-[10px] font-black uppercase text-[#48c1d2] tracking-[0.3em] mb-8">Soluciones de Limpieza</h4>
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
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Paintbrush size={100} className="text-amber-500" />
                 </div>
                 <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em] mb-8">Renovación Premium</h4>
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

        {/* 5. PILARES DE ESTRATEGIA VIRAL */}
        <div className="bg-[#0a192f] p-10 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#48c1d2]/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-12">Pilares de Estrategia Viral</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(data.mensajes_clave || []).map((m: string, idx: number) => (
                <div key={idx} className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center">
                   <div className="w-8 h-8 rounded-full bg-[#142d53] flex items-center justify-center mx-auto mb-4">
                      <Zap size={14} className="text-[#48c1d2]" />
                   </div>
                   <p className="text-[10px] font-black text-white uppercase tracking-tight">&quot;{m}&quot;</p>
                </div>
              ))}
           </div>
        </div>

        {/* 6. CIERRE */}
        <footer className="bg-[#0a192f] p-12 md:p-20 rounded-[3rem] text-center border border-white/10 shadow-2xl relative overflow-hidden">
           <div className="relative z-10 space-y-6">
              <div className="bg-white p-4 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
                 <ShieldCheck size={28} className="text-[#0a192f]" />
              </div>
              <h4 className="text-2xl md:text-4xl font-black uppercase italic text-white">
                 Este Brief es <span className="text-[#48c1d2]">Tu Brújula</span>
              </h4>
              <p className="text-slate-400 text-sm font-bold italic max-w-lg mx-auto">
                 &quot;Si no construye confianza o transformación real, no pertenece a Epotech.&quot;
              </p>
           </div>
        </footer>

      </div>
    </div>
  );
}
