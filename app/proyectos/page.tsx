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
                           service.name.includes('Formulario') ? 'Formulario Inteligente' : 'Landing Page';
           
            // Reset achievements to empty initially as part of the nuclear purge
            const recentLogros = ["En fase de planeación estratégica"];
            
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
    const { data } = await supabase
      .from("actividad")
      .select("*")
      .eq("categoria", service.category)
      .order("fecha", { ascending: false });
    
    setServiceHistory(data || []);
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
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Service Mastery Hub</span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-[var(--primary)]">
          Servicios Master
        </h1>
        <p className="mt-3 text-sm font-medium text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Resultados y entregables estratégicos para Epotech. 
          Aquí puedes ver lo que hemos **logrado** automáticamente desde nuestra bitácora diaria.
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

      {/* Estrategia Social Media */}
      {socialData && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary)]">Estrategia Master de Redes Sociales</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-[var(--border)] to-transparent" />
          </div>

          <Card className="p-0 border-2 border-[var(--accent)] overflow-hidden shadow-2xl rounded-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              
              {/* Columna Izquierda: Ideas y Series */}
              <div className="lg:col-span-2 p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-[var(--border)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-5">
                    <div className="bg-[var(--accent)] p-4 rounded-3xl text-white shadow-xl rotate-[-3deg]">
                      <Share2 size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-[var(--primary)] tracking-tighter">Gestión de Redes Sociales</h3>
                      <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mt-1">Status de Gestión Activa</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Ideas del Mes */}
                  <div>
                    <h4 className="flex items-center gap-2.5 text-xs font-black uppercase text-[var(--primary)] tracking-widest mb-8 border-b pb-4 border-gray-100">
                      <Zap size={18} className="text-amber-500 fill-amber-500" /> Propuestas del Mes
                    </h4>
                    <ul className="space-y-6">
                      {socialData.monthlyIdeas?.map((idea: any) => {
                        const IdeaIcon = IconMap[idea.icon] || Lightbulb;
                        return (
                          <li key={idea.id} className="group relative pl-10">
                            <div className="absolute left-0 top-0 h-8 w-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[var(--accent-light)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-all">
                              <IdeaIcon size={16} strokeWidth={2.5} />
                            </div>
                            <div className="flex flex-col gap-0.5">
                               <span className="text-[9px] font-black uppercase text-[var(--accent)] tracking-widest">{idea.type}</span>
                               <p className="text-sm font-black text-[var(--primary)] leading-tight">{idea.text}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Series en Proceso */}
                  <div>
                    <h4 className="flex items-center gap-2.5 text-xs font-black uppercase text-[var(--primary)] tracking-widest mb-8 border-b pb-4 border-gray-100">
                      <Star size={18} className="text-blue-500 fill-blue-500" /> Series en Marcha
                    </h4>
                    <div className="space-y-5">
                      {socialData.activeSeries?.map((serie: any) => (
                        <div key={serie.id} className="p-5 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-lg transition-all border-l-4 hover:border-l-[var(--accent)] group">
                          <div className="flex justify-between items-start mb-3">
                             <p className="text-base font-black text-[var(--primary)] group-hover:text-[var(--accent)] transition-all tracking-tight">{serie.name}</p>
                             <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full ${serie.status === 'En curso' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>
                               {serie.status}
                             </span>
                          </div>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--text-muted)]">
                                 <Video size={14} />
                                 <span className="text-[var(--primary)]">{serie.count}</span> Publicados
                              </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Resultados y Observaciones */}
              <div className="p-8 lg:p-12 bg-gray-50/70">
                 <h4 className="flex items-center gap-2.5 text-xs font-black uppercase text-[var(--primary)] tracking-widest mb-10 border-b pb-4 border-gray-100">
                  <BarChart3 size={18} className="text-[var(--accent)]" /> Resultados Logrados
                 </h4>
                 
                 <div className="space-y-4 mb-12">
                    {socialData.results?.map((res: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:translate-x-1 transition-transform">
                        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                          <TrendingUp size={16} strokeWidth={2.5} />
                        </div>
                        <p className="text-xs font-black text-gray-700 leading-tight">{res}</p>
                      </div>
                    ))}
                 </div>

                 <div className="mt-auto">
                   <h4 className="flex items-center gap-2.5 text-xs font-black uppercase text-[var(--primary)] tracking-widest mb-5">
                    <Search size={18} className="text-indigo-500" /> Observaciones Estratégicas
                   </h4>
                   <div className="bg-[var(--accent)] text-white p-7 rounded-[2rem] shadow-xl relative overflow-hidden group">
                     <p className="text-xs font-bold italic leading-relaxed relative z-10">
                       "{socialData.observations}"
                     </p>
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Rocket size={40} />
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          </Card>
        </section>
      )}

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
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--accent)] mt-1">Historial de Avances Estratégicos</p>
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
                serviceHistory.map((entry, idx) => (
                  <div key={idx} className="relative pl-12 border-l-2 border-dashed border-gray-100 pb-4 last:pb-0">
                    <div className="absolute left-[-11px] top-0 h-5 w-5 rounded-full bg-white border-4 border-[var(--accent)] shadow-md" />
                    
                    <div className="mb-4">
                       <span className="text-[11px] font-black text-[var(--accent)] uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100/50">{entry.fecha}</span>
                    </div>

                    <div className="space-y-4">
                       {entry.logros.map((logro: string, lIdx: number) => (
                         <div key={lIdx} className="flex gap-4 bg-gray-50/50 p-5 rounded-3xl border border-gray-100/50 hover:bg-white hover:shadow-sm transition-all group">
                            <div className="bg-emerald-500 rounded-full p-1 shrink-0 h-5 w-5 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                              <CheckCircle2 size={12} className="text-white" />
                            </div>
                            <p className="text-base font-bold text-[var(--primary)] leading-tight">{logro}</p>
                         </div>
                       ))}

                       {entry.siguiente_objetivo && (
                         <div className="p-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl text-white shadow-lg shadow-blue-500/10 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                               <div className="bg-white/20 p-2 rounded-xl group-hover:rotate-12 transition-transform">
                                  <Zap size={16} className="fill-white" />
                                </div>
                               <span className="text-[13px] font-black tracking-tight italic">Próximo Hito: {entry.siguiente_objetivo}</span>
                            </div>
                         </div>
                       )}
                    </div>
                  </div>
                ))
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
