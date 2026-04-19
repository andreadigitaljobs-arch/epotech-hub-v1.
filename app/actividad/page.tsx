"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { 
  BarChart3, 
  Lightbulb, 
  History, 
  Target, 
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Camera,
  CheckCircle2,
  Clock,
  Flame
} from "lucide-react";

interface Activity {
  id: string;
  fecha: string;
  categoria: string;
  logros: string[];
  siguiente_objetivo: string;
}

export default function AvancesPage() {
  const [activeTab, setActiveTab] = useState('inspiracion');
  const [actividades, setActividades] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActividad() {
      const { data, error } = await supabase
        .from("actividad")
        .select("*")
        .order("fecha", { ascending: false });
      
      if (!error && data) {
        const grouped: Record<string, Activity> = {};
        data.forEach(item => {
          const key = `${item.fecha}-${item.categoria}`;
          if (grouped[key]) {
            grouped[key].logros = Array.from(new Set([...grouped[key].logros, ...item.logros]));
          } else {
            grouped[key] = { ...item };
          }
        });
        setActividades(Object.values(grouped));
      }
      setLoading(false);
    }
    fetchActividad();
  }, []);

  const tabs = [
    { id: 'inspiracion', name: 'Inspiración', icon: Lightbulb },
    { id: 'reportes', name: 'Reportes', icon: BarChart3 },
    { id: 'historial', name: 'Lo Subido', icon: History },
  ];

  if (loading) return <LoadingSpinner message="Analizando avances..." />;

  return (
    <div className="space-y-6 pb-32">
      {/* Header Premium */}
      <header>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 size={14} className="text-[var(--accent)]" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--accent)] font-mono">Estrategia & Análisis</span>
        </div>
        <h1 className="text-2xl font-black tracking-tight text-[var(--primary)] uppercase italic">Centro de Avances</h1>
      </header>

      {/* Sub-Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[9px] font-black whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? "bg-white text-[var(--primary)] shadow-sm scale-[1.02]" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon size={12} />
            {tab.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Secciones Dinámicas */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
        
        {/* 1. INSPIRACIÓN VIRAL */}
        {activeTab === 'inspiracion' && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 border-none rounded-[2rem] text-white overflow-hidden relative shadow-xl">
               <div className="relative z-10 flex gap-4">
                  <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md">
                     <TrendingUp className="text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase text-blue-300 tracking-widest mb-1 font-mono">Análisis de Andrea</h3>
                    <p className="text-[11px] font-bold text-white/80 leading-relaxed italic">
                      "No solo copies, entiende por qué funcionan. Estos creadores dominan el hook y el contraste visual."
                    </p>
                  </div>
               </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <CreatorCard 
                  name="Chris Fry" 
                  specialty="Limpieza Agua Pura" 
                  hook="Extensiones + Brillo extremo"
                  analysis="Usa el ASMR de flujo de agua y cristales para relajar al espectador. Contraste inmediato."
                  url="https://instagram.com"
               />
               <CreatorCard 
                  name="Gold Coast" 
                  specialty="Driveway King" 
                  hook="Surface Cleaner POV"
                  analysis="Sus videos muestran transformaciones radicales en menos de 15 segundos. Dinamismo puro."
                  url="https://instagram.com"
               />
               <CreatorCard 
                  name="Splash Kings" 
                  specialty="Educativo / Equipos" 
                  hook="Muestran soluciones de campo"
                  analysis="Venden autoridad técnica. Enseñan cómo cuidar el garage mientras limpian."
                  url="https://instagram.com"
               />
               <div className="p-10 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-center">
                  <Flame size={24} className="text-amber-500 mb-3 opacity-30" />
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Próximas referencias muy pronto</p>
               </div>
            </div>
          </div>
        )}

        {/* 2. REPORTES DE PROYECTO (Andrea documenta) */}
        {activeTab === 'reportes' && (
          <div className="space-y-4">
            {actividades.length > 0 ? actividades.map((act) => (
              <ReportCard key={act.id} activity={act} />
            )) : (
              <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Andrea está preparando el próximo reporte</p>
              </div>
            )}
          </div>
        )}

        {/* 3. HISTORIAL DE PERFORMANCE */}
        {activeTab === 'historial' && (
          <div className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatBox label="MEJOR FORMATO" value="REEL" sub="7.3% Engagement" color="blue" />
                <StatBox label="MEJOR HORA" value="2:00 PM" sub="Martes y Viernes" color="emerald" />
             </div>
             
             <Card className="p-8 border-slate-100 rounded-[2.5rem] bg-white">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Últimos Posts Analizados</h3>
                <div className="space-y-4">
                   <MiniPerformanceItem title="REEL: Antes/Después Garage" views="1.2K" perf="success" />
                   <MiniPerformanceItem title="CAROUSEL: Tips de Sellado" views="456" perf="warning" />
                   <MiniPerformanceItem title="REEL: ASMR Limpieza" views="890" perf="success" />
                </div>
             </Card>
          </div>
        )}

      </div>
    </div>
  );
}

function CreatorCard({ name, specialty, hook, analysis, url }: any) {
  return (
    <Card className="p-6 border-slate-100 rounded-[2rem] bg-white shadow-sm hover:border-[var(--accent)] transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Camera size={60} />
        </div>
       <div className="flex justify-between items-start mb-4">
          <span className="text-[8px] font-black text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full uppercase tracking-widest">Instagram Top</span>
          <ExternalLink size={14} className="text-slate-300 group-hover:text-pink-500 transition-colors" />
       </div>
       <h4 className="text-[13px] font-black text-[var(--primary)] uppercase italic mb-1">{name}</h4>
       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">{specialty}</p>
       
       <div className="space-y-3 pt-3 border-t border-slate-50">
          <div>
             <span className="text-[7px] font-black text-blue-500 uppercase tracking-[0.2em] block mb-1">Hook Maestro:</span>
             <p className="text-[10px] font-black text-slate-600">"{hook}"</p>
          </div>
          <div>
             <span className="text-[7px] font-black text-amber-500 uppercase tracking-[0.2em] block mb-1">Análisis Andrea:</span>
             <p className="text-[10px] font-bold text-slate-500 italic leading-snug">"{analysis}"</p>
          </div>
       </div>
    </Card>
  );
}

function ReportCard({ activity }: { activity: Activity }) {
  return (
    <Card className="p-8 border-2 border-slate-50 rounded-[2.5rem] bg-white hover:border-blue-200 transition-all shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <Clock size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">
                {new Date(activity.fecha).toLocaleDateString("es-ES", { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h3 className="text-lg font-black text-[var(--primary)] uppercase italic leading-none">{activity.categoria}</h3>
        </div>
        <div className="h-10 w-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
           <CheckCircle2 size={20} />
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {activity.logros.map((logro, i) => (
          <div key={i} className="flex gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
             <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-lg shadow-emerald-500/20"></div>
             <p className="text-xs font-bold text-[var(--primary)] leading-tight italic">"{logro}"</p>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-50">
         <div className="flex items-center gap-2 mb-2">
            <Target size={14} className="text-amber-500" />
            <span className="text-[8px] font-black uppercase tracking-widest text-amber-600">Plan de Acción / Siguiente Paso</span>
         </div>
         <p className="text-[10px] font-bold text-slate-400 italic">"{activity.siguiente_objetivo}"</p>
      </div>
    </Card>
  );
}

function StatBox({ label, value, sub, color }: any) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };
  return (
    <div className={`p-6 rounded-[2rem] border ${colors[color]} flex flex-col items-center text-center`}>
       <span className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-2">{label}</span>
       <h4 className="text-xl font-black italic mb-1">{value}</h4>
       <span className="text-[9px] font-bold opacity-80">{sub}</span>
    </div>
  );
}

function MiniPerformanceItem({ title, views, perf }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
       <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${perf === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
          <span className="text-[10px] font-black text-[var(--primary)] uppercase italic leading-none">{title}</span>
       </div>
       <div className="flex items-center gap-1.5">
          <BarChart3 size={10} className="text-slate-400" />
          <span className="text-[9px] font-black text-slate-500">{views}</span>
       </div>
    </div>
  );
}
