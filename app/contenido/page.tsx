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
  BarChart3,
  MessageSquare
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

  // Bloqueo de scroll para evitar el "Doble Scroll"
  useEffect(() => {
    if (selectedScript) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedScript]);

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

      {/* Script Focus Mode: REDISEÑO STORY PAPER */}
      {selectedScript && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/95 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-500">
           
           {/* Botón de Cerrar Flotante (Fuera de la hoja, fijo en pantalla) */}
           <div className="fixed top-6 right-6 z-[100]">
               <button 
                  onClick={() => setSelectedScript(null)}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 shadow-2xl border border-white/10 backdrop-blur-md"
               >
                  <X size={24} />
               </button>
           </div>

           {/* Contenedor del Documento (Story Paper) */}
           <div className="min-h-screen py-10 md:py-20 px-4">
               <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-100">
                     
                     {/* Encabezado del Documento (Integrado) */}
                     <div className="bg-slate-50 px-8 md:px-12 py-8 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="w-2 h-2 rounded-full bg-[#48c1d2] animate-pulse" />
                           <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[0.3em] font-mono">{selectedScript.category}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#142d53] tracking-tighter leading-none">
                           {selectedScript.title}
                        </h2>
                     </div>

                     {/* El Papel del Guion */}
                     <div className="p-8 md:p-12 space-y-10">
                        
                        {/* SECCIÓN 1: LECTURA MAESTRA */}
                        <section className="space-y-4">
                           <div className="flex items-center gap-2">
                              <MessageSquare size={12} className="text-blue-500" />
                              <h4 className="text-[9px] font-black text-blue-600 uppercase tracking-widest font-mono">Guion Maestro</h4>
                           </div>
                           <p className="text-xl md:text-2xl font-bold text-slate-900 leading-tight italic tracking-tight">
                              "{selectedScript.steps.map((s: any) => s.txt).join(" ")}"
                           </p>
                        </section>

                        <div className="h-px w-full bg-slate-100" />

                        {/* SECCIÓN 2: PASOS DE PRODUCCIÓN */}
                        <section className="space-y-8">
                           <div className="flex items-center gap-2">
                              <Camera size={12} className="text-slate-300" />
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Desglose de Cámara</h4>
                           </div>
                           
                           <div className="space-y-10">
                              {selectedScript.steps.map((s: any, i: number) => (
                                 <div key={i} className="group space-y-4">
                                    <div className="inline-flex items-center gap-2 bg-[#142d53] text-white px-4 py-1.5 rounded-xl shadow-lg">
                                       <Zap size={12} fill="currentColor" className="text-[#48c1d2]" />
                                       <span className="text-[10px] font-black uppercase tracking-widest font-mono">{s.action}</span>
                                    </div>

                                    <div className="pl-6 border-l-2 border-slate-100 group-hover:border-[#48c1d2] transition-all duration-500">
                                       <p className="text-lg font-medium text-slate-700 leading-snug">
                                          {s.txt}
                                       </p>
                                       <span className="mt-2 block text-[8px] font-black text-slate-300 uppercase tracking-widest font-mono italic">{s.label}</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </section>

                        {/* TIPS Y OBJETIVOS FINAL */}
                        <footer className="pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="bg-amber-50 p-6 rounded-3xl">
                              <h5 className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-3 font-mono">Tip</h5>
                              <p className="text-xs font-bold text-amber-900 leading-tight italic">
                                 "{selectedScript.tips[0]}"
                              </p>
                           </div>
                           <div className="bg-emerald-50 p-6 rounded-3xl">
                              <h5 className="text-[8px] font-black text-emerald-600 uppercase tracking-widest mb-3 font-mono">Objetivo</h5>
                              <p className="text-xs font-bold text-emerald-900 leading-tight italic">
                                 "{selectedScript.checklist[0]}"
                              </p>
                           </div>
                        </footer>
                     </div>
                  </div>

                  {/* Botón de Cierre Inferior Sutil */}
                  <div className="mt-12 text-center pb-10">
                      <button 
                        onClick={() => setSelectedScript(null)}
                        className="text-white/20 hover:text-white/50 text-[9px] font-black uppercase tracking-[0.4em] transition-all"
                      >
                         Cerrar Documento
                      </button>
                  </div>
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
