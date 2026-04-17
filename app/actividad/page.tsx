"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { 
  Clock, 
  CheckCircle2, 
  Target, 
  Calendar,
  Archive,
  ArrowRight
} from "lucide-react";

interface Activity {
  id: string;
  fecha: string;
  categoria: string;
  logros: string[];
  siguiente_objetivo: string;
}

export default function ActividadPage() {
  const [actividades, setActividades] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActividad() {
      const { data, error } = await supabase
        .from("actividad")
        .select("*")
        .order("fecha", { ascending: false });
      
      if (!error && data) {
        // Agrupación visual para evitar duplicados en el mismo día/categoría
        const grouped: Record<string, Activity> = {};
        data.forEach(item => {
          const key = `${item.fecha}-${item.categoria}`;
          if (grouped[key]) {
            grouped[key].logros = Array.from(new Set([...grouped[key].logros, ...item.logros]));
          } else {
            grouped[key] = { ...item };
          }
        });

        // Strictly filter out all legacy data. Only show things from April 18th 2026 onwards.
        const cleanData = Object.values(grouped).filter(a => {
          const entryDate = new Date(a.fecha);
          return entryDate >= new Date('2026-04-18'); 
        });
        setActividades(cleanData);
      }
      setLoading(false);
    }
    fetchActividad();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
        <p className="mt-4 font-black text-[var(--text-muted)] uppercase tracking-widest text-xs">Preparando información...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-32">
      {/* Header Estilo Premium */}
      <header className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-[var(--accent)] p-2 rounded-xl shadow-lg">
            <Archive size={18} className="text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Actualizaciones Diarias</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-[var(--primary)]">
          Reporte de Avances
        </h1>
        <p className="mt-3 text-sm font-bold text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Detalle diario de lo que hemos hecho para Epotech. Aquí registramos cada paso que damos.
        </p>
      </header>

      {/* Grid Original de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        {actividades.map((act) => (
          <Card key={act.id} className="p-8 border-2 border-[var(--border)] hover:border-[var(--accent)] transition-all flex flex-col justify-between min-h-[380px] group shadow-sm hover:shadow-2xl bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--bg)] rounded-bl-full opacity-20 -mr-10 -mt-10" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 text-[var(--accent)] mb-1">
                    <Calendar size={14} className="font-bold" />
                    <span className="text-[11px] font-black uppercase tracking-widest">
                       {new Date(act.fecha).toLocaleDateString("es-ES", {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors">
                    {act.categoria}
                  </h3>
                </div>
                <div className="bg-[var(--bg)] p-3 rounded-2xl shadow-inner text-[var(--text-muted)] group-hover:bg-[var(--accent-light)] group-hover:text-[var(--accent)] transition-colors">
                  <Clock size={24} />
                </div>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Logros Alcanzados</p>
                {act.logros.map((logro, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 bg-emerald-500 rounded-full p-0.5 shrink-0">
                      <CheckCircle2 size={10} className="text-white" />
                    </div>
                    <span className="text-[13px] font-bold text-[var(--primary)] leading-tight">{logro}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-6 border-t border-gray-50 bg-gray-50/30 -mx-8 px-8 -mb-8 mt-auto rounded-b-3xl">
              <div className="flex items-center gap-2 mb-2">
                <Target size={14} className="text-amber-500" />
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Siguiente Paso</p>
              </div>
              <p className="text-xs font-bold text-gray-600 line-clamp-2 italic">
                "{act.siguiente_objetivo}"
              </p>
              <div className="h-2" />
            </div>
          </Card>
        ))}
      </div>

      {actividades.length === 0 && (
        <Card className="p-20 text-center border-dashed border-2 flex flex-col items-center justify-center bg-gray-50/50">
           <p className="text-sm font-bold text-[var(--text-muted)] italic">
             Esperando los reportes de Andrea para documentar el éxito de Epotech.
           </p>
        </Card>
      )}
    </div>
  );
}
