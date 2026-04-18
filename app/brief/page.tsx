"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
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
  ArrowRight,
  Droplets,
  Paintbrush
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

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
        // Fallback or Initial State
        setData({
          mision_titulo: "Nuestra Misión",
          mision_desc: "Transformar espacios. Entregar resultados. Construir confianza.",
          propuesta_valor: "Elevamos el valor y la estética de las propiedades en Utah a través de servicios de limpieza y renovación con estándares de calidad impecables.",
          diferenciador: "No vendemos tecnicismos, vendemos resultados visibles. Enfoque 100% en la tranquilidad del cliente y la perfección del acabado.",
          perfil_cliente: "Dueños de propiedades en Salt Lake City y alrededores que valoran su tiempo y buscan un servicio profesional, honesto y de alta gama.",
          tono_voz: "Profesional, Directo y de Confianza. Hablamos a través de los resultados, no de las promesas.",
          servicios_basicos: ["Pressure Washing", "Soft Wash", "Concrete Sealing", "Gutter Cleaning"],
          servicios_premium: ["Exterior Painting", "Epoxy Flooring", "Sports Courts", "Roof Coating"],
          mensajes_clave: ["Gratis Quote", "New Home", "Salt Lake City / Utah"]
        });
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Cargando Centro de Marca..." />;

  return (
    <div className="space-y-6 md:space-y-10 pb-20">
      
      {/* 1. HERO - EL CORAZÓN DE EPOTECH */}
      <header className="relative pt-6 pb-6 md:pt-10 md:pb-10 px-6 md:px-10 rounded-[20px] md:rounded-[32px] bg-[var(--primary)] text-white overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award className="w-20 h-20 md:w-32 md:h-32" />
        </div>
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-2 mb-3 md:mb-5">
            <span className="bg-[var(--accent)] px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">
              Centro de Marca v3.0
            </span>
            <div className="h-0.5 w-4 md:w-8 bg-white/20" />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter mb-2 md:mb-4 leading-tight">
            Brief de Estrategia <br /> <span className="text-[var(--accent)] font-outline">Epotech Solutions</span>
          </h1>
          <p className="text-xs md:text-sm lg:text-base font-medium text-white/80 italic leading-relaxed max-w-xl border-l-2 border-[var(--accent)] pl-4 md:pl-5 py-0.5">
            "{data.mision_desc}"
          </p>
        </div>
      </header>

      {/* 2. IDENTIDAD CORE */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 px-1 relative z-20">
        <Card className="p-5 md:p-7 bg-white shadow-md hover:shadow-lg transition-all border-none rounded-[16px] md:rounded-[24px]">
          <div className="flex items-center gap-2 mb-3">
             <div className="bg-blue-100 p-1.5 rounded-lg text-[var(--accent)]">
                <Compass size={16} />
             </div>
             <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-muted)]">Propuesta de Valor</h2>
          </div>
          <p className="text-base md:text-lg font-bold text-[var(--primary)] leading-snug">
            {data.propuesta_valor}
          </p>
        </Card>

        <Card className="p-5 md:p-7 bg-[var(--bg)] shadow-md hover:shadow-lg transition-all border-none rounded-[16px] md:rounded-[24px]">
          <div className="flex items-center gap-2 mb-3">
             <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600">
                <Star size={16} />
             </div>
             <h2 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-muted)]">El Diferenciador</h2>
          </div>
          <p className="text-base md:text-lg font-bold text-[var(--primary)] leading-snug">
            {data.diferenciador}
          </p>
        </Card>
      </section>

      {/* 3. PERFIL Y TONO */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mt-12 md:mt-24 mb-16 md:mb-24">
        <div className="space-y-6 md:space-y-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] ml-1 opacity-80">Público Objetivo</h3>
          <Card className="p-8 md:p-10 bg-white border border-gray-100 rounded-[32px] md:rounded-[40px] h-full flex flex-col shadow-sm">
            <div className="flex items-center gap-4 mb-5">
              <Users className="text-[var(--primary)] w-5 h-5" />
              <h4 className="text-base md:text-lg font-black text-[var(--primary)]">Perfil del Cliente</h4>
            </div>
            <p className="text-sm md:text-base font-medium text-[var(--text-muted)] leading-relaxed md:leading-loose">
              {data.perfil_cliente}
            </p>
          </Card>
        </div>

        <div className="space-y-6 md:space-y-8">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] ml-1 opacity-80">Voz y Tono</h3>
          <div className="p-8 md:p-10 bg-[#0F172A] text-white rounded-[32px] md:rounded-[40px] h-full relative overflow-hidden shadow-2xl border border-white/5">
            <div className="absolute right-[-15px] bottom-[-15px] opacity-10">
              <MessageSquare className="w-24 h-24 md:w-40 md:h-40" />
            </div>
            <div className="flex items-center gap-4 mb-5 relative z-10">
              <MessageSquare className="text-[var(--accent)] w-6 h-6" />
              <h4 className="text-base md:text-lg font-black text-white">Guía de Comunicación</h4>
            </div>
            <p className="text-sm md:text-base font-medium text-white/90 leading-relaxed md:leading-loose relative z-10">
              {data.tono_voz}
            </p>
          </div>
        </div>
      </section>

      {/* 4. PORTAFOLIO DE SERVICIOS */}
      <section className="space-y-4 pt-6 md:pt-10">
        <div className="flex items-center justify-between">
           <div>
              <h3 className="text-xl md:text-2xl font-black text-[var(--primary)] tracking-tighter">Servicios Epotech</h3>
              <p className="text-[9px] md:text-[10px] font-semibold text-[var(--text-muted)] mt-0.5 uppercase tracking-widest">Desglose de soluciones para el cliente</p>
           </div>
           <Wrench className="text-[var(--border)] w-6 h-6 md:w-8 md:h-8 hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <Card className="p-6 md:p-8 border-t-[6px] md:border-t-8 border-emerald-500 rounded-[32px] md:rounded-[40px] bg-emerald-50/20">
            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-600 mb-4 md:mb-6 flex items-center gap-2">
              <Droplets size={16} /> Soluciones de Exterior (Básicos)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {(data.servicios_basicos || []).map((s: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 md:p-4 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                  <span className="h-1.5 w-1.5 md:h-2 md:w-2 shrink-0 rounded-full bg-emerald-500" />
                  <span className="text-xs md:text-sm font-bold text-emerald-900">{s}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 md:p-8 border-t-[6px] md:border-t-8 border-[var(--accent)] rounded-[32px] md:rounded-[40px] bg-blue-50/20">
            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[var(--accent)] mb-4 md:mb-6 flex items-center gap-2">
              <Paintbrush size={16} /> Renovaciones Premium
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {(data.servicios_premium || []).map((s: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 p-3 md:p-4 bg-white rounded-2xl border-2 border-blue-50 shadow-sm hover:border-[var(--accent)] transition-colors">
                  <Zap size={14} className="text-[var(--accent)] shrink-0" />
                  <span className="text-xs md:text-sm font-bold text-[var(--primary)]">{s}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* 5. MARKETING Y MENSAJES */}
      <section className="bg-gray-50 rounded-[32px] md:rounded-[50px] p-6 md:p-12 relative overflow-hidden mt-8">
        <div className="absolute left-[-20px] top-[-20px] opacity-10">
           <Zap className="w-32 h-32 md:w-48 md:h-48" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="w-full md:w-1/3 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-black text-[var(--primary)] tracking-tighter mb-3 md:mb-4">Estrategia Viral</h3>
            <p className="text-xs md:text-sm font-medium text-[var(--text-muted)] leading-relaxed">
              Mensajes clave para conectar con la audiencia en Utah. Enfocados en despertar el sentido de orgullo por su propiedad.
            </p>
          </div>
          <div className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {(data.mensajes_clave || []).map((m: string, idx: number) => (
              <Card key={idx} className="p-6 md:p-8 text-center bg-white shadow-xl md:hover:scale-105 transition-transform border-none rounded-[24px] md:rounded-[32px]">
                <h5 className="text-xl md:text-2xl font-black text-[var(--accent)] font-outline">#{idx + 1}</h5>
                <p className="text-sm md:text-lg font-black text-[var(--primary)] mt-2 md:mt-3 leading-tight uppercase tracking-tighter italic">"{m}"</p>
                <div className="mt-4 flex justify-center text-gray-300">
                   <Target size={16} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION TEAM */}
      <footer className="bg-emerald-600 rounded-[32px] md:rounded-[40px] p-8 md:p-10 text-center text-white relative overflow-hidden mt-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-90" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <ShieldCheck size={40} className="mx-auto mb-4 md:mb-6" />
          <h4 className="text-2xl md:text-3xl font-black mb-3 md:mb-4">Este Brief es nuestra Brújula</h4>
          <p className="text-emerald-50 text-xs md:text-base font-medium mb-6 md:mb-8">
            Cada contenido, mensaje o presupuesto debe pasar por el filtro de este documento. Si no suma confianza y transformación, no lo hacemos.
          </p>
          <div className="h-1 w-16 md:w-20 bg-emerald-300 mx-auto rounded-full" />
        </div>
      </footer>

    </div>
  );
}
