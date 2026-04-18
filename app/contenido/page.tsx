"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { 
  Sparkles, 
  Lightbulb, 
  Video, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  Smartphone,
  Play,
  RotateCcw,
  Star,
  Users,
  Mic,
  Clapperboard,
  Camera,
  Info
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ContenidoPage() {
  const [activeTab, setActiveTab] = useState('guiones');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    { id: 'ideas', name: 'Lluvia de Ideas', icon: Lightbulb },
    { id: 'academia', name: 'Tips Pro', icon: Video },
    { id: 'publicado', name: 'Registro', icon: CheckCircle2 },
  ];

  if (loading) return <LoadingSpinner message="Preparando Estudio..." />;

  return (
    <div className="space-y-8 pb-32">
      {/* Header Minimalista */}
      <header className="flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <Clapperboard size={14} className="text-blue-500" />
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500/60 font-mono">Epotech Content</span>
           </div>
           <h1 className="text-2xl font-black tracking-tight text-[var(--primary)] uppercase italic">Plan de Rodaje</h1>
        </div>
      </header>

      {/* Nota de la Directora - Más sutil */}
      <Card className="p-5 bg-blue-900 border-none rounded-2xl shadow-lg relative overflow-hidden">
         <div className="flex items-start gap-4 relative z-10">
            <div className="bg-blue-400/20 p-2 rounded-xl border border-blue-400/30">
               <Info size={16} className="text-blue-400" />
            </div>
            <div className="space-y-1">
               <h3 className="text-[9px] font-black uppercase text-blue-400 tracking-widest font-mono">Nota de Andrea</h3>
               <p className="text-[10px] font-bold text-blue-100/90 leading-snug">
                 Estos guiones son tu <span className="text-white font-black">punto de partida</span>. Sé flexible. Si no grabaste, yo te mandaré un mini guion para nota de voz y montamos la magia.
               </p>
            </div>
         </div>
      </Card>

      {/* Tabs Minimal */}
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
        {activeTab === 'guiones' && <GuionesSection />}
        {activeTab === 'ideas' && <IdeasSection ideas={ideas} />}
        {activeTab === 'academia' && <AcademiaSection />}
        {activeTab === 'publicado' && <PublicadoSection publicaciones={publicaciones} />}
      </div>
    </div>
  );
}

function GuionesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <ScriptCard 
          title="Día de Locos en Utah" 
          tag="Storytelling"
          steps={[
            { label: "0-3s", txt: "¡Ustedes no saben con qué nos encontramos hoy!" },
            { label: "3-30s", txt: "Lijado diamante + por qué el epoxy es inversión en Utah." },
            { label: "Final", txt: "Escribe INFO abajo para proteger tu garaje." }
          ]}
       />
       <ScriptCard 
          title="3 Secretos del Brillo" 
          tag="Educativo"
          steps={[
            { label: "0-5s", txt: "¿Por qué nuestros pisos duran más? El secreto #1..." },
            { label: "5-20s", txt: "No es pintura, es nivelación industrial. Cero grietas." },
            { label: "Final", txt: "Últimos espacios para mayo. Link en la bio." }
          ]}
       />
       <ScriptCard 
          title="Antes vs Después" 
          tag="Visual"
          steps={[
            { label: "Incio", txt: "POV del piso más feo que hayas visto." },
            { label: "Medio", txt: "Corte rápido con sonido de impacto." },
            { label: "Final", txt: "Revelación del brillo espejo total." }
          ]}
       />
    </div>
  );
}

function ScriptCard({ title, tag, steps }: any) {
  return (
    <Card className="p-5 border border-gray-100 bg-white rounded-2xl shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center mb-4">
           <span className="text-[7px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-widest">{tag}</span>
           <Clapperboard size={12} className="text-gray-200" />
        </div>
        <h3 className="text-xs font-black text-[var(--primary)] uppercase tracking-tight mb-5 leading-tight">{title}</h3>
        
        <div className="space-y-4">
          {steps.map((s: any, i: number) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="text-[8px] font-black text-gray-300 w-8 pt-0.5 uppercase font-mono">{s.label}</span>
              <p className="text-[10px] font-bold text-gray-600 leading-snug flex-1 italic">"{s.txt}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
         <div className="flex gap-1">
            <div className="h-1 w-3 bg-blue-100 rounded-full"></div>
            <div className="h-1 w-1 bg-gray-100 rounded-full"></div>
         </div>
         <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1"> Ver Detalles <ChevronRight size={10} /></span>
      </div>
    </Card>
  );
}

function IdeasSection({ ideas }: { ideas: any[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border border-gray-100 rounded-2xl shadow-sm bg-white">
          <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6 flex items-center gap-2">
            <Lightbulb size={14} /> Próximos Virales
          </h3>
          <div className="space-y-4">
            {ideas.map((idea) => (
               <IdeaItem 
                  key={idea.id}
                  type={idea.tipo || "QUICK TIP"} 
                  title={idea.titulo} 
                  desc={idea.descripcion}
               />
            ))}
            {ideas.length === 0 && (
               <p className="text-[9px] font-black text-gray-300 italic uppercase tracking-widest text-center py-6">Sin ideas nuevas aún.</p>
            )}
          </div>
        </Card>

        <div className="space-y-4">
           <SerieCard name="Duelo de Suciedad" status="Avanzando" count={2} />
           <SerieCard name="Mitos de Utah" status="Planeación" count={0} />
           <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl text-center">
              <p className="text-[9px] font-black text-blue-400 leading-relaxed uppercase tracking-[0.2em] italic">
                 "Graba hoy,<br/>triunfa mañana."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function AcademiaSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <TipCard 
          title="Ángulo de Oro" 
          desc="Cámara a la altura del pecho. Da una sensación de poder y nitidez profesional."
          icon={<Star size={16} className="text-amber-500 fill-amber-500" />}
       />
       <TipCard 
          title="Lente Limpio" 
          desc="Limpia la cámara antes de cada toma. El secreto del brillo es un lente impecable."
          icon={<Zap size={16} className="text-blue-500 fill-blue-500" />}
       />
    </div>
  );
}

function PublicadoSection({ publicaciones }: { publicaciones: any[] }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {publicaciones.map((pub) => (
           <PublishedItem 
              key={pub.id}
              type={pub.tipo} 
              platform={pub.plataforma}
              title={pub.tema} 
              date={new Date(pub.created_at).toLocaleDateString()}
              views="--"
           />
         ))}
         {publicaciones.length === 0 && (
           <p className="text-xs font-black text-gray-300 italic py-12 text-center col-span-full uppercase tracking-widest">Aún no hay registros este mes.</p>
         )}
      </div>
    </div>
  );
}

function IdeaItem({ type, title, desc }: any) {
  return (
    <div className="p-3 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-100 cursor-pointer">
      <span className="text-[7px] font-black text-blue-500 tracking-[0.2em] uppercase">{type}</span>
      <h4 className="text-[10px] font-black text-[var(--primary)] uppercase tracking-tight mt-1">{title}</h4>
      <p className="text-[9px] font-bold text-gray-400 mt-1 leading-tight line-clamp-2 italic">{desc}</p>
    </div>
  );
}

function SerieCard({ name, status, count }: any) {
  return (
    <div className="p-4 rounded-2xl border border-gray-100 flex items-center justify-between bg-white shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300">
           <Play size={14} fill="currentColor" />
        </div>
        <div>
          <h4 className="text-[10px] font-black text-[var(--primary)] uppercase tracking-tight leading-none">{name}</h4>
          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1.5 font-mono">{status}</p>
        </div>
      </div>
      <div className="text-center font-black text-[var(--primary)] text-sm">{count}</div>
    </div>
  );
}

function TipCard({ title, desc, icon }: any) {
   return (
      <Card className="p-5 border border-gray-100 rounded-2xl bg-white shadow-sm">
         <div className="flex items-center gap-3 mb-3">
            {icon}
            <h4 className="text-[9px] font-black uppercase tracking-widest text-[var(--primary)]">{title}</h4>
         </div>
         <p className="text-[10px] font-bold text-gray-500 leading-tight uppercase opacity-80 italic">
            "{desc}"
         </p>
      </Card>
   );
}

function PublishedItem({ type, platform, title, date, views }: any) {
  return (
    <Card className="p-0 border border-gray-100 overflow-hidden rounded-2xl bg-white shadow-sm">
       <div className={`px-4 py-2 flex justify-between items-center ${
            platform === 'TIKTOK' ? 'bg-zinc-900 text-white' : (platform === 'REEL' ? 'bg-gradient-to-r from-purple-700 to-pink-700 text-white' : 'bg-blue-800 text-white')
          }`}>
          <span className="text-[7px] font-black tracking-widest uppercase font-mono">{platform}</span>
          <span className="text-[7px] font-bold opacity-50 uppercase">{date}</span>
       </div>
       <div className="p-4">
          <h4 className="text-[9px] font-black text-[var(--primary)] line-clamp-1 uppercase tracking-tight mb-3">{title}</h4>
          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
             <div className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{type}</div>
             <div className="flex items-center gap-1.5">
                <BarChart3 size={10} className="text-blue-500" />
                <span className="text-[9px] font-black text-[var(--primary)]">{views}</span>
             </div>
          </div>
       </div>
    </Card>
  );
}
