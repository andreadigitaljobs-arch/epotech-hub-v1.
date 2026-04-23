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
          propuesta_valor: "Transformamos espacios haciendo que se vean como nuevos, de forma rápida, profesional y con resultados visibles. Ofrecemos soluciones tanto funcionales como estéticas, desde limpieza hasta acabados premium.",
          diferenciador: "Combinamos servicios de alto volumen (pressure washing) con servicios de alto valor (epoxy), lo que nos permite captar clientes fácilmente y luego ofrecer soluciones premium.",
          perfil_cliente: "Propietarios de vivienda (hombres y mujeres) en EE.UU. (principalmente Utah) que valoran calidad, rapidez, resultados visibles y servicio confiable.",
          tono_voz: "Directo (Mensajes claros y sin rodeos). Enfocado en resultados (Priorizamos beneficios visibles). Sin tecnicismos (Evitamos lenguaje complejo). Transformación antes/después (Mostramos el cambio real).",
          servicios_basicos: ["LAVADO DE CASAS (SOFT WASH)", "LIMPIEZA DE ENTRADAS (DRIVEWAYS)", "LIMPIEZA DE TECHOS", "LIMPIEZA EXTERIOR GENERAL"],
          servicios_premium: ["PIBOS EPÓXICOS (FLAKE Y METÁLICO)", "ACABADOS PARA INTERIORES", "RECUBRIMIENTOS PARA CANCHAS DEPORTIVAS"],
          mensajes_clave: ["HACEMOS QUE TU HOGAR SE VEA COMO NUEVO", "COTIZACIÓN GRATIS", "SERVICIO RÁPIDO Y CONFIABLE", "SALT LAKE CITY / UTAH"]
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Sincronizando Estrategia..." />;

  return (
    <div className="space-y-8 pb-32 max-w-4xl mx-auto px-4 md:px-0 pt-6">
      
      {/* 1. HERO ESTRATÉGICO (Idéntico a captura) */}
      <header className="relative p-8 md:p-12 rounded-[2.5rem] bg-[var(--primary)] text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block">
          <Compass size={160} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[var(--accent)] px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.3em]">
              Manual de Estrategia
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 leading-tight uppercase italic">
            El Brief Maestro <br /> <span className="text-[var(--accent)]">Epotech Hub</span>
          </h1>
          <p className="text-xs md:text-sm font-bold text-white/70 italic max-w-xl border-l-4 border-[var(--accent)] pl-6 py-1 leading-relaxed">
            "{data.mision_desc}"
          </p>
        </div>
      </header>

      {/* 2. EL CORAZÓN DE LA MARCA (Idéntico a captura) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="p-8 bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Target size={18} />
             </div>
             <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-300">Propuesta de Valor</h2>
          </div>
          <p className="text-lg font-bold text-[var(--primary)] leading-relaxed">
            {data.propuesta_valor}
          </p>
        </Card>

        <Card className="p-8 bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Star size={18} />
             </div>
             <h2 className="text-[9px] font-black uppercase tracking-widest text-slate-300">Diferenciador</h2>
          </div>
          <p className="text-lg font-bold text-[var(--primary)] leading-relaxed">
            {data.diferenciador}
          </p>
        </Card>
      </section>

      {/* 3. AUDIENCIA Y COMUNICACIÓN (Idéntico a captura) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3 ml-2">
              <Users size={16} className="text-slate-300" />
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Público Objetivo</h3>
           </div>
           <Card className="p-8 bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
              <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                 {data.perfil_cliente}
              </p>
           </Card>
        </div>

        <div className="space-y-4">
           <div className="flex items-center gap-3 ml-2">
              <MessageSquare size={16} className="text-[var(--accent)]" />
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Voz y Tono</h3>
           </div>
           <Card className="p-8 bg-slate-900 border-none rounded-[2.5rem] shadow-2xl text-white overflow-hidden relative">
              <p className="text-sm font-semibold text-white/90 leading-relaxed relative z-10">
                 {data.tono_voz}
              </p>
              <div className="mt-6 flex gap-2 relative z-10">
                 <span className="text-[7px] font-black uppercase bg-white/10 px-3 py-1 rounded-full text-white/60 tracking-widest">Profesional</span>
                 <span className="text-[7px] font-black uppercase bg-white/10 px-3 py-1 rounded-full text-white/60 tracking-widest">Directo</span>
              </div>
           </Card>
        </div>
      </section>

      {/* 4. SERVICIOS (Idéntico a captura) */}
      <section className="space-y-4">
         <div className="flex items-center justify-between ml-2">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Portafolio de Soluciones</h3>
            <Wrench size={16} className="text-slate-100" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Card className="p-6 bg-emerald-50/20 border-emerald-50 rounded-[2.5rem]">
               <h4 className="text-[9px] font-black uppercase text-emerald-600 tracking-widest mb-6 flex items-center gap-2">
                  <Droplets size={14} /> Soluciones de Limpieza
               </h4>
               <div className="grid grid-cols-1 gap-2">
                  {(data.servicios_basicos || []).map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm">
                       <CheckCircle2 size={14} className="text-emerald-500" />
                       <span className="text-[9px] font-black text-emerald-900 uppercase italic leading-none">{s}</span>
                    </div>
                  ))}
               </div>
            </Card>

            <Card className="p-6 bg-blue-50/20 border-blue-50 rounded-[2.5rem]">
               <h4 className="text-[9px] font-black uppercase text-blue-600 tracking-widest mb-6 flex items-center gap-2">
                  <Paintbrush size={14} /> Renovación Premium
               </h4>
               <div className="grid grid-cols-1 gap-2">
                  {(data.servicios_premium || []).map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                       <Zap size={14} className="text-blue-500" />
                       <span className="text-[9px] font-black text-blue-900 uppercase italic leading-none">{s}</span>
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      </section>

      {/* 5. ESTRATEGIA VIRAL (Idéntico a captura) */}
      <section className="p-8 md:p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <Sparkles size={18} className="text-amber-500" />
               <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Pilares de Estrategia Viral</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {(data.mensajes_clave || []).map((m: string, idx: number) => (
                 <Card key={idx} className="p-8 text-center bg-white/40 backdrop-blur-sm rounded-[2.5rem] shadow-sm border border-white/60 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-500">
                    {/* Número de fondo estilizado */}
                    <span className="absolute -bottom-4 -right-4 text-8xl font-black text-slate-900/5 group-hover:text-blue-500/5 transition-colors duration-500 font-mono">
                       {idx + 1}
                    </span>
                    
                    <div className="relative z-10 flex flex-col items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                          <Sparkles size={16} />
                       </div>
                       <p className="text-[11px] font-black text-[var(--primary)] uppercase italic leading-tight tracking-tight">
                          "{m}"
                       </p>
                    </div>
                 </Card>
               ))}
            </div>
         </div>
      </section>

      {/* 6. FOOTER BRÚJULA (Idéntico a captura) */}
      <footer className="group">
         <div className="bg-emerald-600 p-8 md:p-12 rounded-[2.5rem] text-white text-center shadow-xl relative overflow-hidden transition-all active:scale-[0.98]">
            <div className="relative z-10 max-w-xl mx-auto space-y-6">
               <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <ShieldCheck size={24} />
               </div>
               <h4 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">Este Brief es nuestra Brújula</h4>
               <p className="text-emerald-50 text-xs font-bold leading-relaxed italic opacity-90">
                  "Todo lo que hagamos —desde un Reel hasta un presupuesto— debe pasar por este filtro. Si no construye confianza o muestra transformación real, no pertenece a Epotech."
               </p>
               <div className="h-1.5 w-16 bg-emerald-300 mx-auto rounded-full mt-4 opacity-50" />
            </div>
         </div>
      </footer>

    </div>
  );
}
