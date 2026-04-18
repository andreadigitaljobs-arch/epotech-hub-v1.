"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";
import { 
  Rocket, 
  CheckCircle2, 
  TrendingUp, 
  Lightbulb, 
  Video, 
  BarChart3,
  Search,
  ArrowRight,
  Share2,
  ChevronRight,
  Zap,
  Star,
  Sparkles,
  Target,
  Database,
  Smartphone,
  Layout,
  FormInput,
  X,
  History
} from "lucide-react";

// Icon mapping by ID
const IconMap: any = {
  crm: Database,
  app: Smartphone,
  forms: FormInput,
  landing: Layout,
  social: Share2,
  Lightbulb,
  Sparkles,
  Share2,
  Target
};

export default function ServicesPage() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<any[]>([]);
  const [socialData, setSocialData] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [serviceHistory, setServiceHistory] = useState<any[]>([]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchHubData();
  }, []);

  const fetchHubData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Config
      const { data: config } = await supabase.from("config_estrategia").select("*").single();
      
      if (config) {
        setSocialData(config.hub_social_media);
        
        // 2. Fetch Achievements from Actividad for each service
        const infra = config.hub_infraestructura || [];
        const enrichedInfra = await Promise.all(infra.map(async (service: any) => {
           // Mapping name to category
           const category = service.name.includes('CRM') ? 'CRM Master' : 
                           service.name.includes('App') ? 'App de Seguimiento' : 
                           service.name.includes('Social') ? 'Estrategia de Redes' : 
                           service.name.includes('Formulario') ? 'Formulario Inteligente' : 'Landing Page';
           
            const recentLogros = service.achievements || [];
            
            return { ...service, achievements: recentLogros, category };
        }));
        
        setServices(enrichedInfra);
      }
    } catch (err) {
      console.error("Error fetching hub data:", err);
    } finally {
      setLoading(false);
    }
  };

  const openServiceDetail = async (service: any) => {
    setSelectedService(service);
    
    // 1. Map name to category for filtering
    const category = service.name.includes('CRM') ? 'CRM Master' : 
                     service.name.includes('App') ? 'App de Seguimiento' : 
                     service.name.includes('Social') ? 'Estrategia de Redes' : 
                     service.name.includes('Formulario') ? 'Formulario Inteligente' : 'Landing Page';

    // 2. Fetch History from Actividad table
    const { data: history, error } = await supabase
      .from("actividad")
      .select("*")
      .eq("categoria", category)
      .order("fecha", { ascending: false });

    if (!error && history) {
      setServiceHistory(history);
    } else {
      setServiceHistory([]);
    }
  };

  const updateStatus = async (e: React.MouseEvent, serviceId: string, currentStatus: string) => {
    e.stopPropagation(); // Evita abrir el modal al cambiar el estado
    
    const statusCycle: any = {
      'pending': 'active',
      'active': 'success',
      'success': 'pending'
    };
    
    const newStatus = statusCycle[currentStatus] || 'pending';
    
    try {
      const { data: config } = await supabase.from("config_estrategia").select("*").single();
      const updatedHub = config.hub_infraestructura.map((s: any) => 
        s.id === serviceId ? { ...s, status: newStatus } : s
      );
      
      await supabase.from("config_estrategia").update({ hub_infraestructura: updatedHub }).eq('id', config.id);
      
      // Update local state for immediate feedback
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, status: newStatus } : s));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center text-[var(--accent)] bg-[var(--bg)]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-current border-t-transparent mb-4" />
        <p className="font-black uppercase tracking-widest text-xs">Cargando Hub de Servicios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Header */}
      <header className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-[var(--accent)] p-2 rounded-xl shadow-lg">
            <Rocket size={18} className="text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Progreso de proyectos</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-[var(--primary)]">
          Servicios Activos
        </h1>
        <p className="mt-3 text-sm font-medium text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Resultados y entregas para Epotech. 
          Aquí puedes ver lo que hemos logrado paso a paso en cada proyecto.
        </p>
      </header>

      {/* Grid de Infraestructura Digital */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary)]">Infraestructura Digital</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = IconMap[service.id] || Database;
            return (
              <Card 
                key={service.id} 
                onClick={() => openServiceDetail(service)}
                className="p-6 border-2 border-[var(--border)] group cursor-pointer hover:border-[var(--accent)] transition-all flex flex-col justify-between min-h-[340px] shadow-sm hover:shadow-xl active:scale-[0.98]"
              >
                <div>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`p-3 rounded-2xl bg-gray-50 text-[var(--text-muted)] group-hover:bg-[var(--accent-light)] group-hover:text-[var(--accent)] transition-colors shadow-inner`}>
                      <Icon size={24} strokeWidth={2.5} />
                    </div>
                    <button 
                      onClick={(e) => updateStatus(e, service.id, service.status || 'pending')}
                      className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-lg border transition-all active:scale-95 ${
                        service.status === 'success' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' : 
                        service.status === 'active' ? 'bg-blue-100 text-blue-600 border-blue-200' : 
                        'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {service.status === 'success' ? 'Listo' : 
                       service.status === 'active' ? 'En proceso' : 'Por crear'}
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-black text-[var(--primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">
                    {service.name === 'Aplicación de Marca' ? 'App de Seguimiento' : 
                     service.id === 'app' ? 'App de Seguimiento' : service.name}
                  </h3>
                  
                  {/* LOGROS AUTOMÁTICOS */}
                  <div className="space-y-2.5 my-6">
                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Logros Recientes</p>
                    {service.achievements.map((logro: string, i: number) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="mt-1 bg-emerald-500 rounded-full p-0.5 shrink-0">
                          <CheckCircle2 size={10} className="text-white" />
                        </div>
                        <span className="text-[11px] font-bold text-[var(--primary)] leading-none">{logro}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Avance Total</span>
                    <span className="text-[12px] font-black text-[var(--primary)]">{service.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100 shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full transition-all duration-1000"
                      style={{ width: `${service.progress}%` }}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                     Ver historial <ChevronRight size={14} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>



      {/* DETAIL MODAL - TELEPORTADO AL BODY PARA CENTRADO PERFECTO */}
      {mounted && selectedService && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-10 bg-gray-500/20 animate-in fade-in duration-300">
          <Card className="w-full max-w-3xl bg-white rounded-[48px] shadow-[0_32px_120px_rgba(0,0,0,0.15)] border border-white overflow-hidden flex flex-col max-h-[90vh] relative animate-in zoom-in-95 duration-300">
            
            {/* Header Ligero */}
            <div className="p-8 sm:p-12 border-b border-gray-50 flex justify-between items-center bg-white">
              <div className="flex items-center gap-6">
                 <div className="bg-blue-50 p-4 rounded-3xl text-[var(--accent)] shadow-sm">
                    <History size={28} />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black tracking-tighter text-[var(--primary)] capitalize">{selectedService.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] mt-1">Lo que hemos logrado hasta ahora</p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedService(null)}
                className="p-3 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-[var(--primary)] active:scale-90"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-10 custom-scrollbar bg-white">
              {serviceHistory.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {serviceHistory.map((entry, idx) => (
                    <div key={idx} className="bg-gray-50/80 rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-[0.2em] bg-blue-50/50 px-4 py-2 rounded-xl border border-blue-100/30">
                          {new Date(entry.fecha).toLocaleDateString("es-ES", { day: 'numeric', month: 'long' })}
                        </span>
                        <div className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                      </div>
                      
                      <div className="space-y-3">
                         {entry.logros.map((logro: string, lIdx: number) => (
                           <div key={lIdx} className="flex gap-4 items-start">
                              <div className="bg-emerald-500 rounded-lg p-1 shrink-0 mt-0.5">
                                <CheckCircle2 size={12} className="text-white" />
                              </div>
                              <p className="text-sm font-bold text-[var(--primary)] leading-snug">{logro}</p>
                           </div>
                         ))}

                         {entry.siguiente_objetivo && (
                           <div className="mt-6 pt-6 border-t border-gray-200/50">
                              <div className="flex items-center gap-2 mb-2">
                                <Zap size={14} className="text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Siguiente Meta:</span>
                              </div>
                              <p className="text-xs font-bold text-gray-500 italic">"{entry.siguiente_objetivo}"</p>
                           </div>
                         )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Aún no hay registros en este historial.</p>
                </div>
              )}
            </div>
            
            <div className="p-8 sm:p-12 bg-white border-t border-gray-50 flex justify-center">
               <button 
                 onClick={() => setSelectedService(null)}
                 className="px-12 py-5 bg-[var(--primary)] text-white rounded-[24px] font-black text-sm shadow-2xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto"
               >
                 Entendido, ¡continuemos!
               </button>
            </div>
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}
