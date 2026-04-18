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
  Info,
  X,
  Eye
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ContenidoPage() {
  const [activeTab, setActiveTab] = useState('guiones');
  const [ideas, setIdeas] = useState<any[]>([]);
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScript, setSelectedScript] = useState<any>(null);

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
    <div className="space-y-6 pb-32">
      {/* Header Minimalista */}
      <header className="flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <Clapperboard size={14} className="text-blue-500" />
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-500/60 font-mono">Epotech Studio</span>
           </div>
           <h1 className="text-2xl font-black tracking-tight text-[var(--primary)] uppercase italic">Plan de Rodaje</h1>
        </div>
      </header>

      {/* Nota de la Directora - Elegante */}
      <Card className="p-5 bg-blue-900 border-none rounded-2xl shadow-lg relative overflow-hidden">
         <div className="flex items-start gap-4 relative z-10">
            <div className="bg-blue-400/20 p-2 rounded-xl border border-blue-400/30">
               <Info size={16} className="text-blue-400" />
            </div>
            <div className="space-y-1">
               <h3 className="text-[9px] font-black uppercase text-blue-400 tracking-widest font-mono">Dirección Creativa • Andrea</h3>
               <p className="text-[10px] font-bold text-blue-100/90 leading-snug">
                 Sé flexible. Estos guiones son solo tu base. Si no grabaste, yo te mandaré un guion para nota de voz y montamos la magia sobre el video.
               </p>
            </div>
         </div>
      </Card>

      {/* Tabs */}
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
        {activeTab === 'guiones' && <GuionesSection onSelect={setSelectedScript} />}
        {activeTab === 'ideas' && <IdeasSection ideas={ideas} />}
        {activeTab === 'academia' && <AcademiaSection />}
        {activeTab === 'publicado' && <PublicadoSection publicaciones={publicaciones} />}
      </div>

      {/* Script Detail Modal */}
      {selectedScript && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
           <Card className="w-full max-w-lg bg-white rounded-[32px] overflow-hidden animate-in slide-in-from-bottom-5 duration-300 border-none shadow-2xl">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                 <div>
                    <span className="text-[7px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-[0.2em]">{selectedScript.tag}</span>
                    <h3 className="text-lg font-black text-[var(--primary)] uppercase mt-1 leading-none tracking-tight">{selectedScript.title}</h3>
                 </div>
                 <button onClick={() => setSelectedScript(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} className="text-gray-400" />
                 </button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto space-y-8 no-scrollbar">
                 {selectedScript.steps.map((s: any, i: number) => (
                    <div key={i} className="flex gap-4 group">
                       <div className="flex flex-col items-center gap-2 pt-1">
                          <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                          {i !== selectedScript.steps.length - 1 && <div className="w-0.5 flex-1 bg-gray-100 rounded-full"></div>}
                       </div>
                       <div className="space-y-2 pb-6">
                          <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{s.label}</h4>
                          <p className="text-sm font-bold text-gray-700 italic leading-relaxed">"{s.txt}"</p>
                          <div className="flex items-center gap-2 text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-50/50 w-fit px-2 py-1 rounded-md">
                             <Camera size={10} /> Graba esto: {s.action || "Clip de 5 segundos"}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                 <button 
                  onClick={() => setSelectedScript(null)}
                  className="w-full bg-[var(--primary)] text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                 >
                    Entendido, ¡A Grabar!
                 </button>
              </div>
           </Card>
        </div>
      )}
    </div>
  );
}

function GuionesSection({ onSelect }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       <ScriptCard 
          title="Acompáñame un día de trabajo" 
          tag="Storytelling"
          steps={[
            { label: "0-3s", txt: "¡Ustedes no saben con qué nos encontramos hoy en este garaje!", action: "Muestra Sebas a cámara apuntando al piso sucio." },
            { label: "Media", txt: "Vlog rápido de la mezcla, el lijado industrial y el equipo trabajando.", action: "3 clips rápidos (1seg c/u) de acción intensa." },
            { label: "Final", txt: "Resultado espejo y adiós a cámara.", action: "Muestra el brillo final con Sebas despidiéndose." }
          ]}
          onClick={() => onSelect({
            title: "Acompáñame un día de trabajo",
            tag: "Storytelling",
            steps: [
              { label: "INICIO", txt: "¡Ustedes no saben con qué nos encontramos hoy en este garaje!", action: "Sebas a cámara apuntando al piso destruido." },
              { label: "ACCIÓN", txt: "Vlog rápido de la mezcla, el lijado industrial y el equipo trabajando.", action: "Clips POV de las máquinas moviéndose con fuerza." },
              { label: "EDUCATIVO", txt: "Aquí en Utah la sal destruye el concreto. Por eso el Epoxy es una inversión, no un lujo.", action: "Cerca de una grieta que se está llenando." },
              { label: "RESULTADO", txt: "¡Miren este brillo! Resultado espejo completo.", action: "Toma panorámica del garaje terminado." },
              { label: "CIERRE", txt: "Comenta INFO si quieres que tu garaje pase de esto... a esto.", action: "Antes vs Después flash." }
            ]
          })}
       />
       <ScriptCard 
          title="Explicación de un Proceso" 
          tag="Educativo"
          steps={[
            { label: "0-5s", txt: "¿Por qué nuestros pisos duran décadas y otros no? Secretos #1...", action: "Lijado diamante POV." },
            { label: "Media", txt: "La mezcla perfecta (Nivelación industrial). Cero grietas para siempre.", action: "Muestra el material nivelándose solo." },
            { label: "Final", txt: "Últimos espacios para mayo. Link en la bio.", action: "Sebas hablando a cámara con logo Epotech." }
          ]}
          onClick={() => onSelect({
            title: "Explicación de un Proceso",
            tag: "Educativo",
            steps: [
              { label: "HOOCK", txt: "¿Por qué nuestros pisos duran décadas y otros no? El secreto está aquí...", action: "Toma de cerca de la lija de diamante." },
              { label: "PROCESO", txt: "No solo es pintar. Es preparar la base para que el concreto respire.", action: "Muestra el polvo saliendo (ASMR)." },
              { label: "DETALLE", txt: "Usamos base niveladora premium. Cero grietas, cero humedad para siempre.", action: "Cerca de la mezcla siendo esparcida." },
              { label: "FINAL", txt: "Calidad industrial para tu casa. Agenda hoy.", action: "Muestra el camión de Epotech afuera de la casa." }
            ]
          })}
       />
       <ScriptCard 
          title="Experiencia de Cliente" 
          tag="Testimonio"
          steps={[
            { label: "0-3s", txt: "Lo que el cliente pensaba vs lo que le entregamos...", action: "Cara de duda del cliente o Sebas." },
            { label: "Media", txt: "Casi cancela por miedo al precio, hoy dice que es lo mejor que hizo.", action: "Cliente señalando el piso feliz." },
            { label: "Final", txt: "No te quedes con la duda. Escríbenos.", action: "Texto con el WhatsApp de ventas." }
          ]}
          onClick={() => onSelect({
            title: "Experiencia de Cliente",
            tag: "Testimonio",
            steps: [
              { label: "INICIO", txt: "Este cliente casi no se decide por miedo al mantenimiento...", action: "Muestra un garaje muy viejo y descuidado." },
              { label: "CAMBIO", txt: "Le mostramos nuestra técnica de sellado UV y no hubo vuelta atrás.", action: "Pasando la lija y viendo el cambio de tono." },
              { label: "CLIENTE", txt: "Miren esta cara... así se siente un trabajo bien hecho.", action: "Muestra al cliente orgulloso de su nuevo garaje." },
              { label: "CIERRE", txt: "Dignidad para tu garaje. Comenta EPOXY.", action: "Brillo final con luz del sol." }
            ]
          })}
       />
    </div>
  );
}

function ScriptCard({ title, tag, steps, onClick }: any) {
  return (
    <Card className="p-5 border border-gray-100 bg-white rounded-2xl shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-center mb-4">
           <span className="text-[7px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-widest">{tag}</span>
           <Clapperboard size={12} className="text-gray-200" />
        </div>
        <h3 className="text-[11px] font-black text-[var(--primary)] uppercase tracking-tight mb-5 leading-tight">{title}</h3>
        
        <div className="space-y-3">
          {steps.slice(0, 3).map((s: any, i: number) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="text-[8px] font-black text-gray-300 w-8 pt-0.5 uppercase font-mono">{s.label}</span>
              <p className="text-[10px] font-bold text-gray-400 leading-snug flex-1 italic line-clamp-1 group-hover:text-gray-600 transition-colors">"{s.txt}"</p>
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={onClick}
        className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between w-full hover:bg-gray-50 -mx-5 px-5 transition-colors"
      >
         <div className="flex gap-1">
            <div className="h-1 w-3 bg-blue-100 rounded-full"></div>
            <div className="h-1 w-1 bg-gray-100 rounded-full"></div>
         </div>
         <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform"> VER DETALLES <ChevronRight size={10} /></span>
      </button>
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
           <SerieCard name="Duelo de Suciedad" status="Avanzando" count={1} />
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
       <TipCard 
          title="Ángulo POV" 
          desc="Graba a la altura de tus ojos. A la gente le encanta ver lo que tú ves mientras trabajas."
          icon={<Eye size={16} className="text-blue-500" />}
       />
       <TipCard 
          title="Dopamina Sonora" 
          desc="Graba el sonido de las máquinas de cerca. El 'ruido' de limpieza es adictivo (ASMR industrial)."
          icon={<Mic size={16} className="text-emerald-500" />}
       />
       <TipCard 
          title="Lente Limpio" 
          desc="Limpia la cámara antes de cada toma. El secreto del brillo es un lente impecable."
          icon={<Zap size={16} className="text-amber-500" />}
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
      <Card className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm flex items-center gap-4">
         <div className="bg-gray-50 p-2 rounded-lg shrink-0">{icon}</div>
         <div className="space-y-0.5">
            <h4 className="text-[9px] font-black uppercase text-[var(--primary)]">{title}</h4>
            <p className="text-[10px] font-bold text-gray-400 opacity-90 italic leading-tight">
               "{desc}"
            </p>
         </div>
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
