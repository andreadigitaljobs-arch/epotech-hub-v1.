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
      const { data: eData } = await supabase.from("config_estrategia").select("*").maybeSingle();
      if (eData) {
        setData(eData);
      } else {
        setData({
          mision_desc: "Transformar espacios. Entregar resultados. Construir confianza.",
          propuesta_valor: "Transformamos espacios haciendo que se vean como nuevos, de forma rápida, profesional y con resultados visibles. Ofrecemos soluciones tanto funcionales como estéticas, desde limpieza hasta acabados premium.",
          diferenciador: "Combinamos servicios de alto volumen (pressure washing) con servicios de alto valor (epoxy), lo que nos permite captar clientes fácilmente y luego ofrecer soluciones premium.",
          perfil_cliente: "Propietarios de vivienda (hombres y mujeres) en EE.UU. (principalmente Utah) que valoran calidad, rapidez, resultados visibles y servicio confiable.",
          tono_voz: "Directo (Mensajes claros y sin rodeos). Enfocado en resultados. Sin tecnicismos. Transformación antes/después.",
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
    <div className="min-h-screen bg-[#f8fafc] pb-32">
      {/* HEADER INTEGRADO CON STATUS BAR (MISMO COLOR QUE ACADEMIA) */}
      <div className="bg-[#142d53] pt-[env(safe-area-inset-top)] relative overflow-hidden">
        {/* Glows Premium */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#48c1d2]/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#48c1d2]/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

        <div className="max-w-5xl mx-auto px-6 pt-10 pb-20 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#48c1d2] p-2 rounded-lg">
              <Target size={16} className="text-[#142d53]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#48c1d2]">Arquitectura de Marca</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 leading-none uppercase">
            El Brief <br />
            <span className="text-[#48c1d2]">Maestro</span>
          </h1>

          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md max-w-xl">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-tight">
              <span className="text-[#48c1d2]">Brújula Epotech:</span> Este es el ADN de tu marca. Consulta tu misión y visión para que tu comunicación sea siempre profesional y coherente.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20 space-y-8">
        {/* PROPUESTA Y DIFERENCIADOR */}
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

        {/* AUDIENCIA Y TONO */}
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
               Tono de Voz
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

        {/* SERVICIOS */}
        <div className="space-y-8">
           <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Portafolio</h3>
              <div className="h-px flex-1 bg-slate-200"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className={CARD_STYLE}>
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Droplets size={100} className="text-[#48c1d2]" />
                 </div>
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
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Paintbrush size={100} className="text-amber-500" />
                 </div>
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
      </div>
    </div>
  );
}
