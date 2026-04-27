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
    <div className="space-y-8 pb-32 pt-6">
      
      {/* 1. HERO ESTRATÉGICO (Con detalles de diseño) */}
      <header className="relative p-10 md:p-20 rounded-[2.5rem] md:rounded-[4rem] bg-[var(--primary)] text-white overflow-hidden shadow-2xl ring-1 ring-white/10">
        <div className="absolute top-0 right-0 p-8 opacity-10 hidden md:block rotate-12">
          <Compass size={220} />
        </div>
        {/* Dibujos decorativos de fondo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
           <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
           <div className="absolute bottom-10 right-20 w-32 h-32 border-2 border-white rotate-45 opacity-50"></div>
           <div className="grid grid-cols-6 gap-4 p-4">
              {[...Array(24)].map((_, i) => <div key={i} className="w-1 h-1 bg-white rounded-full"></div>)}
           </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10 md:mb-12">
            <div className="bg-[var(--accent)] p-2 rounded-lg shadow-lg">
              <Target size={16} className="text-white" />
            </div>
            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">
              Arquitectura de Marca 2026
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-10 leading-[1.1] uppercase drop-shadow-2xl">
            El Brief Maestro <br /> <span className="text-[var(--accent)] drop-shadow-none">Epotech Hub</span>
          </h1>
          <div className="relative w-full max-w-2xl">
            <div className="absolute -left-6 md:-left-8 top-0 bottom-0 w-1.5 bg-[var(--accent)] rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
            <p className="text-sm md:text-lg font-bold text-white/90 italic pl-8 py-1 leading-relaxed">
              <span className="text-[var(--accent)] not-italic uppercase tracking-widest text-[10px] block mb-3">Tu Brújula de Marca:</span>
              "Todo lo que hagamos —desde un Reel hasta un presupuesto— debe pasar por este filtro. Consulta esta página para que tu tono, tus mensajes y tu promesa de valor sean siempre coherentes y profesionales frente a tu audiencia en Utah."
            </p>
          </div>
        </div>
      </header>

      {/* 2. EL CORAZÓN DE LA MARCA (Unificado con Fuerza Bruta) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 md:p-16 !bg-[#0a192f] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl relative overflow-hidden group">
          {/* Detalle decorativo */}
          <div className="absolute -right-10 -bottom-10 text-blue-500/10 group-hover:scale-110 transition-transform duration-1000">
             <Target size={250} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
               <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-500/20">
                  <Target size={24} />
               </div>
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Nuestra Propuesta</h2>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white leading-tight md:max-w-[95%]">
              {data.propuesta_valor}
            </p>
          </div>
        </Card>

        <Card className="p-8 md:p-16 !bg-[#0a192f] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl relative overflow-hidden group">
          {/* Detalle decorativo */}
          <div className="absolute -right-10 -bottom-10 text-amber-500/10 group-hover:scale-110 transition-transform duration-1000">
             <Star size={250} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
               <div className="bg-amber-500 p-3 rounded-2xl text-white shadow-xl shadow-amber-500/20">
                  <Star size={24} />
               </div>
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Lo que nos hace únicos</h2>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white leading-tight md:max-w-[95%]">
              {data.diferenciador}
            </p>
          </div>
        </Card>
      </section>

      {/* 3. AUDIENCIA Y COMUNICACIÓN (Refinado con dibujos) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
           <Card className="p-8 md:p-16 !bg-[#0a192f] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-[0.08]">
                 <div className="grid grid-cols-5 gap-3">
                    {[...Array(25)].map((_, i) => <div key={i} className="w-2 h-2 bg-[#48c1d2] rounded-full"></div>)}
                 </div>
              </div>
              <div className="flex items-center gap-3 mb-8">
                 <Users size={16} className="text-[#48c1d2]" />
                 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">A quién le hablamos</h2>
              </div>
              <p className="text-xl md:text-2xl font-bold text-white leading-tight relative z-10 md:max-w-[95%]">
                 {data.perfil_cliente}
              </p>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="p-8 md:p-16 !bg-[#0a192f] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl text-white overflow-hidden relative group">
              {/* Dibujo abstracto de fondo */}
              <div className="absolute -right-10 -bottom-10 text-[#48c1d2]/10 group-hover:scale-110 transition-transform duration-1000">
                 <MessageSquare size={250} />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                   <MessageSquare size={16} className="text-[#48c1d2]" />
                   <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Cómo hablamos</h2>
                </div>
                <p className="text-xl md:text-2xl font-bold text-white leading-tight mb-10 md:max-w-[95%]">
                   {data.tono_voz}
                </p>
                <div className="flex flex-wrap gap-3 relative z-10">
                   <span className="text-[9px] font-black uppercase bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-[#48c1d2] tracking-[0.2em] backdrop-blur-sm">Profesional</span>
                   <span className="text-[9px] font-black uppercase bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-[#48c1d2] tracking-[0.2em] backdrop-blur-sm">Directo</span>
                </div>
              </div>
           </Card>
        </div>
      </section>

      {/* 4. SERVICIOS (Diseño de tarjetas de ingeniería) */}
      <section className="space-y-10">
         <div className="flex items-center justify-between ml-4">
            <div className="flex items-center gap-3">
               <div className="bg-[#48c1d2]/10 p-2 rounded-lg">
                  <Wrench size={16} className="text-[#48c1d2]" />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">Portafolio Estratégico</h3>
            </div>
            <div className="h-px flex-1 bg-slate-200 mx-6"></div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 md:p-12 !bg-[#0a192f] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Droplets size={140} className="text-[#48c1d2]" />
               </div>
               <h4 className="text-[10px] font-black uppercase text-[#48c1d2] tracking-[0.3em] mb-12 flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-[#48c1d2]/50 rounded-full"></div>
                  Soluciones de Limpieza
               </h4>
               <div className="grid grid-cols-1 gap-4 relative z-10">
                  {(data.servicios_basicos || []).map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-3xl border border-[#48c1d2]/20 shadow-lg cursor-default">
                       <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-xl bg-[#48c1d2]/10 flex items-center justify-center text-[#48c1d2] font-mono text-xs font-black border border-[#48c1d2]/20">
                             {idx + 1}
                          </div>
                          <span className="text-xs font-black text-white uppercase tracking-tight">{s}</span>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-[#48c1d2]/5 flex items-center justify-center border border-[#48c1d2]/10">
                          <CheckCircle2 size={16} className="text-[#48c1d2]" />
                       </div>
                    </div>
                  ))}
               </div>
            </Card>

            <Card className="p-8 md:p-12 !bg-[#0a192f] border border-white/10 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden group shadow-2xl">
               <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Paintbrush size={140} className="text-amber-500" />
               </div>
               <h4 className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em] mb-12 flex items-center gap-4">
                  <div className="w-12 h-[2px] bg-amber-500/50 rounded-full"></div>
                  Renovación Premium
               </h4>
               <div className="grid grid-cols-1 gap-4 relative z-10">
                  {(data.servicios_premium || []).map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-amber-500/20 shadow-lg cursor-default">
                       <div className="flex items-center gap-5">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 font-mono text-xs font-black border border-amber-500/20">
                             {idx + 1}
                          </div>
                          <span className="text-xs font-black text-white uppercase tracking-tight">{s}</span>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-amber-500/5 flex items-center justify-center border border-amber-500/10">
                          <Zap size={16} className="text-amber-500" />
                       </div>
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      </section>

      {/* 5. ESTRATEGIA VIRAL */}
      <section className="p-8 md:p-16 bg-[#0a192f] rounded-[3.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
         {/* Fondo decorativo unificado */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-4 mb-12">
               <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-amber-500 border border-white/10 shadow-xl">
                  <Sparkles size={20} />
               </div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Pilares de Estrategia Viral</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {(data.mensajes_clave || []).map((m: string, idx: number) => (
                 <Card key={idx} className="p-10 text-center bg-white/5 backdrop-blur-md rounded-[3rem] border border-[#48c1d2]/20 relative overflow-hidden shadow-xl">
                    <span className="absolute -bottom-6 -right-6 text-9xl font-black text-[#48c1d2]/5 font-mono italic">
                       {idx + 1}
                    </span>
                    
                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="p-1 rounded-full bg-gradient-to-r from-[#48c1d2] to-blue-600">
                           <div className="bg-[#0a192f] p-3 rounded-full">
                              <Zap size={16} className="text-[#48c1d2]" />
                           </div>
                        </div>
                        <p className="text-lg font-black text-white uppercase leading-[1.2] tracking-tighter">
                          "{m}"
                        </p>
                    </div>
                 </Card>
               ))}
            </div>
         </div>
      </section>

      {/* 6. FOOTER BRÚJULA (Con el color de marca real) */}
      <footer className="group relative">
         <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[4rem] blur-2xl opacity-10 group-hover:opacity-25 transition duration-1000"></div>
         <div className="relative bg-[var(--primary)] p-10 md:p-16 rounded-[3.5rem] text-white text-center shadow-2xl overflow-hidden active:scale-[0.99] transition-transform">
            {/* Dibujos decorativos de fondo */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
               <div className="absolute top-0 right-0 w-64 h-64 border-[40px] border-white/10 rounded-full -mr-32 -mt-32"></div>
               <div className="absolute bottom-0 left-0 w-48 h-48 border-[20px] border-white/5 rounded-full -ml-24 -mb-24"></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
               <div className="bg-white p-4 w-16 h-16 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
                  <ShieldCheck size={32} className="text-[var(--primary)]" />
               </div>
               <h4 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">
                  Este Brief es <br /> <span className="text-blue-400">nuestra Brújula</span>
               </h4>
               <p className="text-slate-300 text-sm font-bold leading-relaxed italic opacity-80 max-w-lg mx-auto">
                  "Todo lo que hagamos —desde un Reel hasta un presupuesto— debe pasar por este filtro. Si no construye confianza o muestra transformación real, no pertenece a Epotech."
               </p>
               <div className="flex justify-center gap-2">
                  <div className="h-1.5 w-12 bg-blue-500 rounded-full opacity-50" />
                  <div className="h-1.5 w-4 bg-white rounded-full opacity-20" />
               </div>
            </div>
         </div>
      </footer>

    </div>
  );
}
