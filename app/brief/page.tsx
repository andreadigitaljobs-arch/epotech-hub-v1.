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
      
      {/* 1. HERO ESTRATÉGICO (Con detalles de diseño) */}
      <header className="relative p-8 md:p-14 rounded-[3.5rem] bg-[var(--primary)] text-white overflow-hidden shadow-2xl ring-1 ring-white/10">
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
          <div className="flex items-center gap-3 mb-8">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 px-5 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.4em] text-[var(--accent)]">
              Brand Architecture 2026
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-tight uppercase italic drop-shadow-2xl">
            El Brief Maestro <br /> <span className="text-[var(--accent)] drop-shadow-none">Epotech Hub</span>
          </h1>
          <div className="relative max-w-xl">
            <div className="absolute -left-6 top-0 bottom-0 w-1.5 bg-[var(--accent)] rounded-full shadow-[0_0_15px_rgba(251,191,36,0.5)]"></div>
            <p className="text-xs md:text-base font-bold text-white/80 italic pl-6 py-1 leading-relaxed">
              "{data.mision_desc}"
            </p>
          </div>
        </div>
      </header>

      {/* 2. EL CORAZÓN DE LA MARCA (Idéntico a captura) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Card className="p-10 bg-white border-slate-100 rounded-[3rem] shadow-sm relative overflow-hidden group">
          {/* Detalle decorativo */}
          <div className="absolute -right-4 -bottom-4 text-blue-50/50 group-hover:scale-110 transition-transform duration-700">
             <Target size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                  <Target size={20} />
               </div>
               <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Propuesta de Valor</h2>
            </div>
            <p className="text-xl md:text-2xl font-black text-[var(--primary)] leading-tight italic">
              {data.propuesta_valor}
            </p>
          </div>
        </Card>

        <Card className="p-10 bg-white border-slate-100 rounded-[3rem] shadow-sm relative overflow-hidden group">
          {/* Detalle decorativo */}
          <div className="absolute -right-4 -bottom-4 text-amber-50/50 group-hover:scale-110 transition-transform duration-700">
             <Star size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="bg-amber-500 p-2.5 rounded-2xl text-white shadow-lg shadow-amber-500/20">
                  <Star size={20} />
               </div>
               <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Diferenciador</h2>
            </div>
            <p className="text-xl md:text-2xl font-black text-[var(--primary)] leading-tight italic">
              {data.diferenciador}
            </p>
          </div>
        </Card>
      </section>

      {/* 3. AUDIENCIA Y COMUNICACIÓN (Refinado con dibujos) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
           <div className="flex items-center gap-3 ml-4">
              <Users size={16} className="text-slate-300" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Público Objetivo</h3>
           </div>
           <Card className="p-10 bg-white border-slate-100 rounded-[3rem] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
                 <div className="grid grid-cols-3 gap-1">
                    {[...Array(9)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-slate-900 rounded-full"></div>)}
                 </div>
              </div>
              <p className="text-base font-bold text-slate-600 leading-relaxed italic relative z-10">
                 {data.perfil_cliente}
              </p>
           </Card>
        </div>

        <div className="space-y-6">
           <div className="flex items-center gap-3 ml-4">
              <MessageSquare size={16} className="text-[var(--accent)]" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)]">Voz y Tono</h3>
           </div>
           <Card className="p-10 bg-slate-950 border-none rounded-[3rem] shadow-2xl text-white overflow-hidden relative group">
              {/* Dibujo abstracto de fondo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[var(--accent)]/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
              
              <p className="text-base font-bold text-white/90 leading-relaxed italic relative z-10">
                 {data.tono_voz}
              </p>
              <div className="mt-8 flex gap-3 relative z-10">
                 <span className="text-[8px] font-black uppercase bg-white/10 border border-white/10 px-4 py-2 rounded-full text-white/50 tracking-[0.2em]">Profesional</span>
                 <span className="text-[8px] font-black uppercase bg-white/10 border border-white/10 px-4 py-2 rounded-full text-white/50 tracking-[0.2em]">Directo</span>
              </div>
           </Card>
        </div>
      </section>

      {/* 4. SERVICIOS (Diseño de tarjetas de ingeniería) */}
      <section className="space-y-6">
         <div className="flex items-center justify-between ml-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Portafolio Estratégico</h3>
            <div className="h-px flex-1 bg-slate-100 mx-6"></div>
            <Wrench size={16} className="text-slate-200" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-slate-50/50 border-slate-100 rounded-[3.5rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Droplets size={120} />
               </div>
               <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-8 flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-blue-200"></div>
                  Soluciones de Limpieza
               </h4>
               <div className="grid grid-cols-1 gap-3 relative z-10">
                  {(data.servicios_basicos || []).map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-50 shadow-sm hover:translate-x-1 transition-transform group">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-blue-500 font-mono text-[10px] font-bold">
                             0{idx + 1}
                          </div>
                          <span className="text-[10px] font-black text-slate-900 uppercase italic tracking-tight">{s}</span>
                       </div>
                       <CheckCircle2 size={16} className="text-blue-200 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
               </div>
            </Card>

            <Card className="p-8 bg-blue-50/10 border-blue-100/50 rounded-[3.5rem] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Paintbrush size={120} />
               </div>
               <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-[0.3em] mb-8 flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-blue-200"></div>
                  Renovación Premium
               </h4>
               <div className="grid grid-cols-1 gap-3 relative z-10">
                  {(data.servicios_premium || []).map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-blue-50 shadow-sm hover:translate-x-1 transition-transform group">
                       <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 font-mono text-[10px] font-bold">
                             0{idx + 1}
                          </div>
                          <span className="text-[10px] font-black text-blue-900 uppercase italic tracking-tight">{s}</span>
                       </div>
                       <Zap size={16} className="text-blue-200 group-hover:text-blue-500 transition-colors" />
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      </section>

      {/* 5. ESTRATEGIA VIRAL */}
      <section className="p-8 md:p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <Sparkles size={18} className="text-amber-500" />
               <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Pilares de Estrategia Viral</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {(data.mensajes_clave || []).map((m: string, idx: number) => (
                 <Card key={idx} className="p-8 text-center bg-white/40 backdrop-blur-sm rounded-[2.5rem] shadow-sm border border-white/60 relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-500">
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
