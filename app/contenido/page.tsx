"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { guiones, Script } from "@/data/scripts";
import { 
  Clapperboard, 
  Play, 
  Camera, 
  Calendar, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Lightbulb, 
  Clock,
  Mic,
  Zap,
  Eye,
  BarChart3
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";


export default function ContenidoPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Conectando con el Estudio..." />}>
      <ContenidoContent />
    </Suspense>
  );
}

function ContenidoContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || 'presion';
  
  const [activeTab, setActiveTab] = useState('guiones');
  const [serviceType, setServiceType] = useState(typeParam);
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: iData } = await supabase.from('ideas_contenido').select('*').order('creada_at', { ascending: false });
      if (iData) setIdeas(iData);

      const { data: pData } = await supabase.from('registro_publicaciones').select('*').order('created_at', { ascending: false });
      if (pData) setPublicaciones(pData);

      setLoading(false);
    }
    fetchData();
  }, []);

  const tabs = [
    { id: 'guiones', name: 'Guiones', icon: Clapperboard },
    { id: 'series', name: 'Series', icon: Play },
    { id: 'broll', name: 'B-Rolls', icon: Camera },
    { id: 'calendario', name: 'Calendario', icon: Calendar },
  ];

  const categories = ['Todas', 'Antes/Después', 'Satisfying', 'Educativo', 'Storytelling'];

  const filteredGuiones = guiones.filter(g => 
    g.service === serviceType && 
    (activeCategory === 'Todas' || g.category === activeCategory)
  );

  if (loading) return <LoadingSpinner message="Preparando Estudio..." />;

  return (
    <div className="space-y-6 pb-32">
      {/* Header Minimalista */}
      <header className="flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <Clapperboard size={14} className="text-blue-500" />
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500/60 font-mono">Epotech Studio</span>
           </div>
           <h1 className="text-2xl font-black tracking-tight text-[var(--primary)] uppercase italic">Fábrica de Contenido</h1>
        </div>
      </header>

      {/* Selector de Servicio Principal */}
      <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl">
        <button 
          onClick={() => setServiceType('presion')}
          className={`py-2 px-3 rounded-xl text-[10px] font-black transition-all ${serviceType === 'presion' ? 'bg-[var(--primary)] text-white shadow-md' : 'text-slate-400'}`}
        >
          PRESIÓN
        </button>
        <button 
          onClick={() => setServiceType('ventanas')}
          className={`py-2 px-3 rounded-xl text-[10px] font-black transition-all ${serviceType === 'ventanas' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'}`}
        >
          VENTANAS
        </button>
        <button 
          onClick={() => setServiceType('epoxy')}
          className={`py-2 px-3 rounded-xl text-[10px] font-black transition-all ${serviceType === 'epoxy' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400'}`}
        >
          EPOXY
        </button>
      </div>

      {/* Tabs Principales de la Fábrica */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-[9px] font-black whitespace-nowrap transition-all ${
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

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {/* GUIONES SECTION */}
        {activeTab === 'guiones' && (
          <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-[9px] font-black whitespace-nowrap border-2 transition-all ${
                    activeCategory === cat 
                      ? "bg-blue-50 border-blue-500 text-blue-600" 
                      : "bg-white border-gray-100 text-gray-400"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGuiones.map(script => (
                <ScriptCard 
                  key={script.id}
                  title={script.title} 
                  tag={script.category}
                  steps={script.steps}
                  onClick={() => setSelectedScript(script)}
                />
              ))}
            </div>
          </div>
        )}

        {/* SERIES SECTION */}
        {activeTab === 'series' && <SeriesSection ideas={ideas} />}

        {/* B-ROLL SECTION */}
        {activeTab === 'broll' && <BRollSection service={serviceType} />}

        {/* CALENDARIO SECTION */}
        {activeTab === 'calendario' && <CalendarioSection />}
      </div>

      {/* Script Focus Mode */}
      {selectedScript && (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col">
           {/* Header */}
           <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                 <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">{selectedScript.category}</span>
                 <h3 className="text-2xl font-light text-slate-900 mt-2 tracking-tight leading-tight">{selectedScript.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedScript(null)} 
                className="h-12 w-12 bg-white border border-gray-100 shadow-sm flex items-center justify-center rounded-2xl text-gray-500"
              >
                 <X size={24} />
              </button>
           </div>

           {/* Content */}
           <div className="flex-1 overflow-y-auto p-8 space-y-12 no-scrollbar">
              <div className="max-w-md mx-auto space-y-12 py-6">
                 <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                       <span className="text-[9px] font-semibold text-slate-400 uppercase block tracking-widest mb-1">Duración</span>
                       <span className="text-sm font-medium text-slate-800">{selectedScript.duration}</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
                       <span className="text-[9px] font-semibold text-slate-400 uppercase block tracking-widest mb-1">Tomas Req.</span>
                       <span className="text-sm font-medium text-slate-800">{selectedScript.tomas} CLIPS</span>
                    </div>
                 </div>

                 <section className="space-y-10">
                     <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Secuencia de Rodaje</h4>
                     <div className="space-y-4">
                        {selectedScript.steps.map((s, i) => (
                           <div key={i} className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                              <div className="absolute -right-2 -top-2 text-6xl font-black text-slate-50/50 -z-0">
                                 {i + 1}
                              </div>
                              
                              <div className="relative z-10 space-y-5">
                                 <div className="flex items-center gap-3">
                                    <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                                       <Camera size={18} strokeWidth={2.5} />
                                    </div>
                                    <h5 className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Paso {i + 1} • {s.label}</h5>
                                 </div>

                                 <div className="space-y-4">
                                    <h4 className="text-xl font-semibold text-slate-900 leading-tight">
                                       {s.action}
                                    </h4>
                                    
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100/50">
                                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-2">Texto / Guion:</span>
                                       <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                          "{s.txt}"
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                 </section>

                 <section className="space-y-4 pt-6">
                    <h4 className="text-[10px] font-black text-amber-600 bg-amber-50 w-fit px-4 py-1 rounded-full uppercase tracking-widest">Tips Pro</h4>
                    <div className="space-y-3">
                       {selectedScript.tips.map((tip, i) => (
                          <div key={i} className="flex gap-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                             <Sparkles size={16} className="text-amber-500 shrink-0" />
                             <p className="text-xs font-bold text-amber-900 leading-tight">"{tip}"</p>
                          </div>
                       ))}
                    </div>
                 </section>

                 <section className="space-y-4 pt-6">
                    <h4 className="text-[10px] font-black text-emerald-600 bg-emerald-50 w-fit px-4 py-1 rounded-full uppercase tracking-widest">Checklist de Tomas</h4>
                    <div className="grid grid-cols-1 gap-2">
                       {selectedScript.checklist.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                             <div className="h-5 w-5 rounded-md border-2 border-emerald-500/30 flex items-center justify-center">
                               <CheckCircle2 size={12} className="text-emerald-500 opacity-0" />
                             </div>
                             <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.05em]">{item}</span>
                          </div>
                       ))}
                    </div>
                 </section>
              </div>
           </div>

           {/* Footer */}
           <div className="p-8 border-t border-gray-100 bg-white">
              <div className="max-w-md mx-auto">
                 <button 
                  onClick={() => setSelectedScript(null)}
                  className="w-full bg-[var(--primary)] text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-xl"
                 >
                    Terminar y Salir
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function BRollSection({ service }: { service: string }) {
  const brolls: Record<string, any[]> = {
    presion: [
      { title: "Hero Shot: El Experto", desc: "Tú de espaldas manejando la máquina con fuerza.", cat: "Hero" },
      { title: "Detail: La Mugre vuela", desc: "Cerca de la boquilla mientras el agua barriendo.", cat: "Detalle" },
      { title: "Action: POV Driveway", desc: "Cámara en mano moviéndose sobre el piso limpio.", cat: "Proceso" },
    ],
    ventanas: [
      { title: "Hero Shot: El Reflejo", desc: "Tu cara concentrada reflejada en el vidrio.", cat: "Hero" },
      { title: "Detail: Espuma satisfying", desc: "Primer plano de las burbujas desapareciendo.", cat: "Detalle" },
      { title: "Action: La transición mano", desc: "Tu mano tapando el lente y descubriendo limpieza.", cat: "Transición" },
    ],
    epoxy: [
      { title: "Hero Shot: El Maestro", desc: "Tú esparciendo la mezcla con el rodillo.", cat: "Hero" },
      { title: "Detail: El brillo espejo", desc: "La luz de una lámpara reflejándose en el piso.", cat: "Detalle" },
      { title: "Action: Lijado diamante", desc: "POV de la máquina industrial sacando polvo.", cat: "Proceso" },
    ]
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-slate-900 border-none rounded-[2rem] text-white overflow-hidden relative">
         <div className="relative z-10">
            <h3 className="text-xs font-black uppercase text-blue-400 tracking-[0.2em] mb-2 font-mono italic">¿Qué es un B-Roll?</h3>
            <p className="text-sm font-bold text-blue-100 leading-relaxed italic">
              "Son clips extras de apoyo que grabas para que el video no sea aburrido y se vea profesional. Sirven para cualquier guion."
            </p>
         </div>
         <div className="absolute -right-6 -bottom-6 text-white/5">
            <Camera size={120} />
         </div>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        {brolls[service]?.map((b, i) => (
          <Card key={i} className="p-5 border-slate-100 rounded-3xl hover:border-blue-200 transition-all">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-2 py-1 rounded-full uppercase tracking-widest">{b.cat}</span>
              <Camera size={14} className="text-slate-200" />
            </div>
            <h4 className="text-sm font-black text-[var(--primary)] uppercase tracking-tight italic">{b.title}</h4>
            <p className="text-[10px] font-bold text-slate-400 mt-2 leading-tight italic">"{b.desc}"</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SeriesSection({ ideas }: { ideas: any[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <SerieCard name="Duelo de Suciedad" status="Avanzando" count={1} total={3} />
        <SerieCard name="Mitos de Utah" status="Planeación" count={0} total={3} />
        <SerieCard name="Transformación Radical" status="Avanzando" count={2} total={5} />
      </div>

      <Card className="p-8 border border-gray-100 rounded-[2.5rem] shadow-sm bg-white">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-8 flex items-center gap-2">
          <Lightbulb size={16} /> Otras Ideas Virales
        </h3>
        <div className="space-y-6">
          {ideas.slice(0, 3).map((idea) => (
              <IdeaItem 
                key={idea.id}
                type={idea.tipo} 
                title={idea.titulo} 
                desc={idea.descripcion}
              />
          ))}
        </div>
      </Card>
    </div>
  );
}

function CalendarioSection() {
  const days = [
    { day: 'LUNES 14', type: 'REEL', theme: 'Antes/Después Split', done: true, views: '1.2K' },
    { day: 'MARTES 15', type: 'CAROUSEL', theme: '5 Slides de Proceso', done: true, views: '456' },
    { day: 'MIÉRCOLES 16', type: 'REEL', theme: 'ASMR Satisfying', done: false, views: '-' },
    { day: 'JUEVES 17', type: 'STORY', theme: 'Educativo / Tips', done: false, views: '-' },
  ];

  return (
    <div className="space-y-6">
       <Card className="p-6 bg-emerald-50 border-emerald-100 rounded-[2rem]">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Plan Semanal</h3>
            <span className="text-xs font-black text-emerald-800">2/5 LISTO</span>
          </div>
          <div className="h-3 w-full bg-white rounded-full overflow-hidden border border-emerald-100">
             <div className="h-full bg-emerald-500 w-[40%] rounded-full shadow-lg shadow-emerald-500/20"></div>
          </div>
       </Card>

       <div className="space-y-3">
          {days.map((d, i) => (
            <Card key={i} className="p-5 border-slate-100 rounded-3xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${d.done ? 'bg-emerald-100 text-emerald-600 shadow-sm' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>
                    {d.done ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                 </div>
                 <div>
                    <div className="flex items-center gap-2">
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">{d.day}</span>
                       <span className="text-[7px] font-black text-blue-500 bg-blue-50 px-1.5 rounded uppercase">{d.type}</span>
                    </div>
                    <h4 className="text-sm font-black text-[var(--primary)] uppercase tracking-tight italic mt-1">{d.theme}</h4>
                 </div>
              </div>
              {d.done && <div className="text-[10px] font-black text-slate-400">{d.views}</div>}
            </Card>
          ))}
       </div>
    </div>
  );
}

function ScriptCard({ title, tag, steps, onClick }: { title: string, tag: string, steps: any[], onClick: () => void }) {
  return (
    <Card className="p-6 border border-gray-100 bg-white rounded-[2rem] shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between group cursor-pointer" onClick={onClick}>
      <div>
        <div className="flex justify-between items-center mb-6">
           <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 uppercase tracking-widest">{tag}</span>
           <Clapperboard size={14} className="text-gray-200" />
        </div>
        <h3 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight mb-6 leading-tight italic">{title}</h3>
        <div className="space-y-4">
          {steps.slice(0, 2).map((s: any, i: number) => (
            <div key={i} className="flex gap-4 items-start border-l-2 border-slate-50 pl-4">
              <p className="text-[10px] font-bold text-gray-400 leading-relaxed italic line-clamp-2">"{s.txt}"</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 pt-4 border-t border-gray-50 flex items-center justify-between w-full">
         <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-1 transition-transform"> GRABAR AHORA <ChevronRight size={12} /></span>
      </div>
    </Card>
  );
}

function SerieCard({ name, status, count, total }: any) {
  return (
    <Card className="p-6 rounded-[2rem] border border-gray-100 flex items-center justify-between bg-white shadow-sm hover:border-blue-100 transition-all">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
           <Play size={18} fill="currentColor" />
        </div>
        <div>
          <h4 className="text-sm font-black text-[var(--primary)] uppercase tracking-tight leading-none italic">{name}</h4>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2">{status}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs font-black text-[var(--primary)]">{count}/{total}</div>
        <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Episodios</div>
      </div>
    </Card>
  );
}

function IdeaItem({ type, title, desc }: any) {
  return (
    <div className="p-4 hover:bg-gray-50 rounded-2xl transition-all border border-transparent hover:border-gray-100">
      <span className="text-[8px] font-black text-blue-500 tracking-[0.2em] uppercase">{type}</span>
      <h4 className="text-sm font-black text-[var(--primary)] uppercase tracking-tight mt-1 italic">{title}</h4>
      <p className="text-[10px] font-bold text-gray-400 mt-2 leading-tight italic line-clamp-2">"{desc}"</p>
    </div>
  );
}

function AcademiaSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <TipCard 
          title="Ángulo POV" 
          desc="Graba a la altura de tus ojos. A la gente le encanta ver lo que tú ves mientras trabajas."
          icon={<Eye size={18} className="text-blue-500" />}
       />
       <TipCard 
          title="Dopamina Sonora" 
          desc="Graba el sonido de las máquinas de cerca. El 'ruido' de limpieza es adictivo (ASMR industrial)."
          icon={<Mic size={18} className="text-emerald-500" />}
       />
       <TipCard 
          title="Lente Limpio" 
          desc="Limpia la cámara antes de cada toma. El secreto del brillo es un lente impecable."
          icon={<Zap size={18} className="text-amber-500" />}
       />
    </div>
  );
}

function PublicadoSection({ publicaciones }: { publicaciones: any[] }) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-ES", { day: 'numeric', month: 'short' }).replace('.', '');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
       {publicaciones.map((pub) => (
         <PublishedItem 
            key={pub.id}
            type={pub.tipo} 
            platform={pub.plataforma}
            title={pub.tema} 
            date={formatDate(pub.created_at)}
            views="1.2K"
         />
       ))}
    </div>
  );
}

function TipCard({ title, desc, icon }: any) {
   return (
      <Card className="p-6 border border-gray-100 rounded-[2rem] bg-white shadow-sm flex items-start gap-5 hover:border-blue-100 transition-all">
         <div className="bg-gray-50 p-3 rounded-2xl shrink-0">{icon}</div>
         <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase text-[var(--primary)] tracking-widest">{title}</h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
               "{desc}"
            </p>
         </div>
      </Card>
   );
}

function PublishedItem({ type, platform, title, date, views }: any) {
  return (
    <Card className="p-0 border border-gray-100 overflow-hidden rounded-[2rem] bg-white shadow-md shadow-black/5 hover:translate-y-[-4px] transition-all">
       <div className={`px-5 py-3 flex justify-between items-center ${
            platform === 'TIKTOK' ? 'bg-zinc-900 text-white' : (platform === 'REEL' ? 'bg-gradient-to-r from-purple-700 to-pink-700 text-white' : 'bg-blue-800 text-white')
          }`}>
          <span className="text-[8px] font-black tracking-widest uppercase font-mono">{platform}</span>
          <span className="text-[8px] font-bold opacity-60 uppercase">{date}</span>
       </div>
       <div className="p-6">
          <h4 className="text-[11px] font-black text-[var(--primary)] line-clamp-2 uppercase tracking-tight mb-5 italic h-8">{title}</h4>
          <div className="flex items-center justify-between border-t border-gray-50 pt-4">
              <div className="bg-slate-50 px-3 py-1 rounded-full">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{type}</span>
              </div>
               <div className="flex items-center gap-1.5">
                  <BarChart3 size={12} className="text-blue-500" />
                  <span className="text-[10px] font-black text-[var(--primary)]">{views}</span>
               </div>
          </div>
       </div>
    </Card>
  );
}

