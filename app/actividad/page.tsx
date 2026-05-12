"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { 
  BarChart3, 
  History, 
  Target, 
  CheckCircle2,
  Clock
} from "lucide-react";

interface Activity {
  id: string;
  fecha: string;
  categoria: string;
  logros: string[];
  siguiente_objetivo: string;
}

export default function AvancesPage() {
  const [activeTab, setActiveTab] = useState('reportes');

  // Memoria de Pestaña
  useEffect(() => {
    const savedTab = localStorage.getItem('epotech_activity_tab');
    if (savedTab) setActiveTab(savedTab);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    localStorage.setItem('epotech_activity_tab', tabId);
  };
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
          <span className="text-[10px] font-semibold text-[var(--accent)] font-mono">Estrategia y Análisis</span>
        </div>
        <h1 className="text-2xl md:text-5xl font-black tracking-tight text-[#142d53] leading-[1.1]">Centro de Avances</h1>
      </header>

      {/* Sub-Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-[9px] font-black whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? "bg-white text-[var(--primary)] shadow-sm scale-[1.02]" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon size={12} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Secciones Dinámicas */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
        
        {/* 1. REPORTES DE PROYECTO (Andrea documenta) */}
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

        {/* 3. HISTORIAL DE PERFORMANCE - CONECTADO REAL */}
        {activeTab === 'historial' && (
          <div className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <StatBox 
                  label="MEJOR FORMATO" 
                  value={actividades.length > 0 ? "REEL" : "S/D"} 
                  sub="Basado en frecuencia" 
                  color="blue" 
                />
                <StatBox 
                  label="PRODUCCIÓN" 
                  value="ACTIVA" 
                  sub="2026 Season" 
                  color="emerald" 
                />
             </div>
             
             <Card className="p-8 border-slate-100 rounded-[2.5rem] bg-white">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 italic">Contenidos Publicados (Base Real)</h3>
                <div className="space-y-4">
                   <PublishedHistoryList />
                </div>
             </Card>
          </div>
        )}

      </div>
    </div>
  );
}

function ReportCard({ activity }: { activity: Activity }) {
  return (
    <Card className="p-10 border border-slate-100 rounded-[3rem] bg-white shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-8 -mt-8 transition-all group-hover:bg-[#48c1d2]/10" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-3">
             <span className="text-[8px] font-black tracking-[0.4em] px-3 py-1 bg-[#142d53] text-[#48c1d2] rounded-full shadow-lg shadow-[#142d53]/20">Auditoría de resultados</span>
             <span className="text-[8px] font-black text-slate-300 tracking-widest">{new Date(activity.fecha).toLocaleDateString("es-ES", { month: 'long', year: 'numeric' })}</span>
          </div>
          <h3 className="text-3xl font-black text-[#142d53] leading-none tracking-tighter">{activity.categoria}</h3>
        </div>
        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-[#142d53] border border-slate-100 shadow-inner group-hover:scale-110 transition-transform">
           <CheckCircle2 size={24} />
        </div>
      </div>

      <div className="space-y-4 mb-10 text-left">
        <h4 className="text-[9px] font-black text-[#48c1d2] tracking-[0.3em] mb-4">Hitos de crecimiento alcanzados</h4>
        {activity.logros.map((logro, i) => (
          <div key={i} className="flex gap-4 p-5 bg-slate-50/50 rounded-3xl border border-slate-50 hover:bg-white hover:border-[#48c1d2]/20 transition-all">
             <div className="h-3 w-3 rounded-full bg-[#48c1d2] mt-1.5 shrink-0 shadow-lg shadow-[#48c1d2]/40 animate-pulse"></div>
             <p className="text-sm font-bold text-[#142d53] leading-relaxed">"{logro}"</p>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t border-slate-100 text-left">
         <div className="flex items-center gap-3 mb-3">
            <Target size={18} className="text-[#48c1d2]" />
            <span className="text-[9px] font-black tracking-[0.3em] text-slate-400">Hoja de ruta / Próximo objetivo</span>
         </div>
         <div className="p-6 bg-[#142d53] rounded-[2.5rem] shadow-xl">
            <p className="text-xs font-black text-[#48c1d2] italic tracking-wider leading-relaxed">"{activity.siguiente_objetivo}"</p>
         </div>
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

function PublishedHistoryList() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublished() {
      const { data } = await supabase
        .from("registro_publicaciones")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      if (data) setHistory(data);
      setLoading(false);
    }
    fetchPublished();
  }, []);

  if (loading) return <div className="text-[10px] font-black text-slate-300 uppercase animate-pulse">Sincronizando archivo...</div>;
  if (history.length === 0) return <div className="text-[10px] font-black text-slate-300 uppercase italic">Aún no hay videos publicados esta semana</div>;

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <MiniPerformanceItem 
          key={item.id} 
          title={`${item.tipo}: ${item.tema}`} 
          views={item.plataforma} 
          perf="success" 
        />
      ))}
    </div>
  );
}

function MiniPerformanceItem({ title, views, perf }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#48c1d2]/30 transition-all">
       <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${perf === 'success' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-amber-500'}`}></div>
          <span className="text-[10px] font-black text-[var(--primary)] uppercase italic leading-tight line-clamp-1">{title}</span>
       </div>
       <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-100">
          <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-tighter">{views}</span>
       </div>
    </div>
  );
}
