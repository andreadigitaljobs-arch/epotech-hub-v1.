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
    <div className="space-y-12 pb-32">
      
      {/* 1. HERO ESTRATÉGICO */}
      <header className="relative pt-12 pb-12 px-8 rounded-[3rem] bg-[var(--primary)] text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Compass size={160} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[var(--accent)] px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.3em]">
              Manual de Estrategia
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-4 leading-tight uppercase italic">
            El Brief Maestro <br /> <span className="text-[var(--accent)]">Epotech Hub</span>
          </h1>
          <p className="text-sm font-bold text-white/70 italic max-w-xl border-l-4 border-[var(--accent)] pl-6 py-1">
            "{data.mision_desc}"
          </p>
        </div>
      </header>

      {/* 2. EL CORAZÓN DE LA MARCA */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 bg-white border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                <Target size={20} />
             </div>
             <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Propuesta de Valor</h2>
          </div>
          <p className="text-xl font-black text-[var(--primary)] leading-tight italic">
            {data.propuesta_valor}
          </p>
        </Card>

        <Card className="p-8 bg-blue-50/30 border-blue-100 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                <Star size={20} />
             </div>
             <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-600/60">Diferenciador</h2>
          </div>
          <p className="text-xl font-black text-[var(--primary)] leading-tight italic">
            {data.diferenciador}
          </p>
        </Card>
      </section>

      {/* 3. AUDIENCIA Y COMUNICACIÓN */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <div className="flex items-center gap-3 ml-2">
              <Users size={16} className="text-slate-300" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Público Objetivo</h3>
           </div>
           <Card className="p-8 bg-white border-slate-100 rounded-[2.5rem] shadow-sm">
              <p className="text-base font-bold text-slate-600 leading-relaxed italic">
                 {data.perfil_cliente}
              </p>
           </Card>
        </div>

        <div className="space-y-4">
           <div className="flex items-center gap-3 ml-2">
              <MessageSquare size={16} className="text-[var(--accent)]" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Voz y Tono</h3>
           </div>
           <Card className="p-8 bg-slate-900 border-none rounded-[2.5rem] shadow-2xl text-white">
              <p className="text-base font-bold text-white/90 leading-relaxed italic">
                 {data.tono_voz}
              </p>
              <div className="mt-6 flex gap-2">
                 <span className="text-[8px] font-black uppercase bg-white/10 px-3 py-1 rounded-full text-white/60 tracking-widest">Profesional</span>
                 <span className="text-[8px] font-black uppercase bg-white/10 px-3 py-1 rounded-full text-white/60 tracking-widest">Directo</span>
              </div>
           </Card>
        </div>
      </section>

      {/* 4. SERVICIOS DEFINIDOS */}
      <section className="space-y-6">
         <div className="flex items-center justify-between ml-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Portafolio de Soluciones</h3>
            <Wrench size={16} className="text-slate-200" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-8 bg-emerald-50/30 border-emerald-100 rounded-[2.5rem]">
               <h4 className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-6 flex items-center gap-2">
                  <Droplets size={14} /> Soluciones de Limpieza
               </h4>
               <div className="grid grid-cols-1 gap-2">
                  {(data.servicios_basicos || []).map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-emerald-50 shadow-sm">
                       <CheckCircle2 size={14} className="text-emerald-500" />
                       <span className="text-xs font-black text-emerald-900 uppercase italic">{s}</span>
                    </div>
                  ))}
               </div>
            </Card>

            <Card className="p-8 bg-blue-50/30 border-blue-100 rounded-[2.5rem]">
               <h4 className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-6 flex items-center gap-2">
                  <Paintbrush size={14} /> Renovación Premium
               </h4>
               <div className="grid grid-cols-1 gap-2">
                  {(data.servicios_premium || []).map((s: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-blue-50 shadow-sm">
                       <Zap size={14} className="text-blue-500" />
                       <span className="text-xs font-black text-blue-900 uppercase italic">{s}</span>
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      </section>

      {/* 5. ESTRATEGIA VIRAL */}
      <section className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative overflow-hidden">
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <Sparkles size={20} className="text-amber-500" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Pilares de Estrategia Viral</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {(data.mensajes_clave || []).map((m: string, idx: number) => (
                 <Card key={idx} className="p-8 text-center bg-white rounded-[2rem] shadow-lg border-none hover:translate-y-[-5px] transition-all">
                    <span className="text-3xl font-black text-slate-100 block mb-2">0{idx + 1}</span>
                    <p className="text-sm font-black text-[var(--primary)] uppercase italic leading-tight">"{m}"</p>
                 </Card>
               ))}
            </div>
         </div>
      </section>

      {/* 6. LA BRÚJULA (Master Filter) */}
      <footer className="group cursor-pointer">
         <div className="bg-emerald-600 p-10 rounded-[3rem] text-white text-center shadow-2xl shadow-emerald-900/20 relative overflow-hidden transition-all group-hover:scale-[1.01]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500 to-teal-700 opacity-50" />
            <div className="relative z-10 max-w-xl mx-auto space-y-6">
               <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                  <ShieldCheck size={32} />
               </div>
               <h4 className="text-2xl font-black uppercase italic tracking-tighter">Este Brief es nuestra Brújula</h4>
               <p className="text-emerald-50 text-sm font-bold leading-relaxed italic opacity-90">
                  "Todo lo que hagamos —desde un Reel hasta un presupuesto— debe pasar por este filtro. Si no construye confianza o muestra transformación real, no pertenece a Epotech."
               </p>
               <div className="h-1.5 w-20 bg-emerald-300 mx-auto rounded-full mt-8 opacity-50" />
            </div>
         </div>
      </footer>

    </div>
  );
}
