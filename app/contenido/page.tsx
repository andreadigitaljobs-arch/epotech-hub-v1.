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

  if (loading) return <LoadingSpinner message="Preparando Estudio de Contenido..." />;

  return (
    <div className="space-y-10 pb-32">
      {/* Header Premium Estilo Agencia */}
      <header className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-[var(--primary)] p-2 rounded-xl shadow-lg border border-blue-400/20">
            <Clapperboard size={18} className="text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Epotech Content Studio</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-[var(--primary)]">
          Plan de Rodaje
        </h1>
        <p className="mt-3 text-sm font-bold text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Diseñamos tu éxito visual. Aquí tienes tus guiones maestros y la estrategia para dominar las redes.
        </p>
      </header>

      {/* Agencia Disclaimer - Nota de la Directora */}
      <Card className="p-8 bg-gradient-to-br from-blue-900 to-blue-950 border-none shadow-2xl relative overflow-hidden group rounded-[32px]">
         <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Mic size={100} className="text-white" />
         </div>
         <div className="flex items-start gap-6 relative z-10">
            <div className="bg-blue-500/20 p-4 rounded-3xl backdrop-blur-md border border-blue-400/30">
               <Info size={28} className="text-blue-400" />
            </div>
            <div className="space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 font-mono">Dirección • Andrea</h3>
               <p className="text-sm font-bold text-blue-100/90 leading-relaxed max-w-xl">
                 Estos guiones son tu <span className="text-white font-black underline decoration-blue-500 underline-offset-4 decoration-2">punto de partida</span>. Úsalos como guía para entender el estilo de lo que queremos decir. 
                 <br/><br/>
                 <span className="text-blue-400 font-black">RECUERDA:</span> Todo es flexible. Si no pudiste grabar algo, no te preocupes. Si es necesario, yo te mandaré un mini guion por nota de voz para que te grabes hablando y yo lo pondré sobre el video. 
                 <br/><br/>
                 ¡Suéltate y muestra el orgullo de tu trabajo!
               </p>
            </div>
         </div>
      </Card>

      {/* Tabs Switcher - Premium Glassmorphism */}
      <div className="flex gap-2 p-1.5 bg-gray-100/50 backdrop-blur-md rounded-[28px] w-full overflow-x-auto no-scrollbar border border-white/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-[22px] text-[10px] font-black whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? "bg-[var(--primary)] text-white shadow-xl shadow-blue-500/30 translate-y-[-2px]" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon size={14} />
            {tab.name.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
    <div className="space-y-12">
       {/* Script Item 1 */}
       <ScriptCard 
          scene="01" 
          format="STORYTELLING" 
          title="EL DÍA DE LOCOS EN UTAH"
          labels={["POV", "4K/60FPS"]}
          steps={[
            { time: "0-3s", title: "EL GANCHO", desc: '"¡Ustedes no saben lo que nos encontramos hoy en este garaje!"', action: "Muestra el piso destruido, grietas y suciedad.", icon: <Zap size={16}/> },
            { time: "3-30s", title: "DESARROLLO", desc: "Clip de 3s lijando. 'Aquí en Utah la sal destruye el concreto. El Epoxy es una INVERSIÓN'.", action: "Alterna tomas de ti y tomas de cerca.", icon: <Camera size={16}/> },
            { time: "Final", title: "CIERRE", desc: '"Si quieres proteger tu garaje este invierno, escribe INFO abajo".', action: "Sonrisa a cámara con el equipo.", icon: <Mic size={16}/> }
          ]}
          color="blue"
       />

       {/* Script Item 2 */}
       <ScriptCard 
          scene="02" 
          format="EDUCATIVO" 
          title="LOS 3 SECRETOS DEL BRILLO"
          labels={["ASMR", "DETALLE"]}
          steps={[
            { time: "0-5s", title: "SECRETOS", desc: '"¿Por qué nuestros pisos duran más? Aquí el secreto #1..."', action: "Lija de diamante en cámara lenta.", icon: <Sparkles size={16}/> },
            { time: "5-20s", title: "PROCESO", desc: '"No solo es pintura, es nivelación industrial. Cero grietas para siempre."', action: "Muestra la base niveladora aplicándose.", icon: <Clapperboard size={16}/> },
            { time: "Final", title: "OFERTA", desc: '"Últimos espacios para mayo. Link en la bio."', action: "Clip rápido del resultado brillante.", icon: <Zap size={16}/> }
          ]}
          color="emerald"
       />
    </div>
  );
}

function ScriptCard({ scene, format, title, labels, steps, color }: any) {
  const colorClass = color === 'blue' ? 'blue' : 'emerald';
  const accentColor = color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500';
  const textColor = color === 'blue' ? 'text-blue-600' : 'text-emerald-600';
  const bgColor = color === 'blue' ? 'bg-blue-50' : 'bg-emerald-50';

  return (
    <div className="relative group">
       <div className={`absolute -left-3 top-10 w-1.5 ${accentColor} h-32 rounded-full opacity-40 group-hover:opacity-100 transition-opacity shadow-[0_0_20px_rgba(59,130,246,0.5)]`}></div>
       <Card className="p-10 border-2 border-gray-100 overflow-hidden bg-white/70 backdrop-blur-sm group-hover:border-gray-200 transition-all rounded-[40px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                   <span className={`text-[10px] font-black ${textColor} ${bgColor} px-4 py-1 rounded-full border border-current opacity-70 tracking-widest uppercase`}>Escena #{scene}</span>
                   <span className="text-[10px] font-black text-gray-400 tracking-[0.3em] uppercase italic">• {format}</span>
                </div>
                <h3 className="text-4xl font-black text-[var(--primary)] tracking-tighter leading-none">{title}</h3>
             </div>
             <div className="flex items-center gap-2">
                {labels.map((l: string) => (
                   <span key={l} className="bg-gray-900 text-white px-4 py-1.5 rounded-2xl text-[10px] font-black tracking-widest border border-white/20 shadow-xl">{l}</span>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 gap-10">
             {steps.map((step: any, idx: number) => (
                <div key={idx} className="flex gap-8 items-start group/step">
                   <div className="flex flex-col items-center gap-3">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] font-mono">{step.time}</div>
                      <div className="h-14 w-14 rounded-[22px] bg-gray-50 flex items-center justify-center text-[var(--primary)] group-hover/step:bg-[var(--primary)] group-hover/step:text-white transition-all shadow-inner border border-gray-100">
                         {step.icon}
                      </div>
                      {idx !== steps.length - 1 && <div className="w-0.5 h-12 bg-gray-100 rounded-full"></div>}
                   </div>
                   <div className="space-y-4 flex-1 pt-1">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--primary)] opacity-60 font-mono">{step.title}</h4>
                      <div className="relative">
                         <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-100 rounded-full opacity-0 group-hover/step:opacity-100 transition-opacity"></div>
                         <p className="text-lg font-bold text-gray-700 leading-relaxed italic bg-gray-50 p-6 rounded-[28px] border border-gray-100/50 shadow-sm">
                            {step.desc}
                         </p>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] bg-blue-50 w-fit px-4 py-1.5 rounded-full border border-blue-100/50">
                         <Camera size={14} className="animate-pulse" /> {step.action}
                      </div>
                   </div>
                </div>
             ))}
          </div>
       </Card>
    </div>
  );
}

function IdeasSection({ ideas }: { ideas: any[] }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-10 border-2 border-gray-100 relative overflow-hidden group rounded-[40px]">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform text-[var(--primary)]">
            <Lightbulb size={120} />
          </div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 mb-10 pb-5 border-b border-blue-50 flex items-center gap-3">
            <Play size={14} fill="currentColor" /> Próximos Virales
          </h3>
          <div className="space-y-6">
            {ideas.map((idea) => (
               <IdeaItem 
                  key={idea.id}
                  type={idea.tipo || "QUICK TIP"} 
                  title={idea.titulo} 
                  desc={idea.descripcion}
               />
            ))}
            {ideas.length === 0 && (
               <div className="py-20 text-center space-y-4">
                  <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto opacity-50">
                     <Star size={32} className="text-gray-300" />
                  </div>
                  <p className="text-xs font-bold text-gray-400 italic uppercase tracking-widest leading-relaxed">Solo estamos a una gran idea<br/>del próximo contenido viral.</p>
               </div>
            )}
          </div>
        </Card>

        <Card className="p-10 border-2 border-gray-100 group bg-gray-50/30 rounded-[40px] flex flex-col justify-between">
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-10 pb-5 border-b border-emerald-100 flex items-center gap-3">
               <Video size={14} fill="currentColor" /> Series en Producción
            </h3>
            <div className="space-y-4">
               <SerieCard name="Duelo de Suciedad" status="Avanzando" count={2} color="emerald" />
               <SerieCard name="El Experto Utah" status="Planeación" count={0} color="gray" />
               <SerieCard name="Transformación" status="Próximamente" count={0} color="gray" />
            </div>
          </div>
          <div className="mt-12 p-8 bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/20 text-center relative overflow-hidden">
             <div className="absolute -left-10 -top-10 h-32 w-32 bg-blue-500/5 rounded-full blur-3xl"></div>
             <p className="text-[11px] font-black text-[var(--primary)] leading-relaxed uppercase tracking-[0.2em] italic opacity-70">
                "La constancia vence al talento.<br/>Graba hoy, triunfa mañana."
             </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AcademiaSection() {
  return (
    <div className="space-y-12">
      <section>
        <div className="flex items-center gap-4 mb-10">
           <div className="h-14 w-14 rounded-3xl bg-black flex items-center justify-center text-white shadow-2xl">
              <Smartphone size={24} />
           </div>
           <div>
              <h2 className="text-2xl font-black text-[var(--primary)] tracking-tighter uppercase italic">Academia 2026</h2>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mt-1 italic">Producción de Élite</p>
           </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <TipCard 
              title="EL ÁNGULO CINEMÁTICO" 
              desc="Cámara a la altura del pecho, no de los ojos. Esto da una sensación de poder y nitidez profesional."
              icon={<Star size={20} className="text-amber-500 fill-amber-500" />}
           />
           <TipCard 
              title="LIMPIEZA DE ÓPTICA" 
              desc="Limpia tu lente antes de cada toma. La diferencia entre un video 'sucio' y uno 'premium' es un trapo."
              icon={<Zap size={20} className="text-blue-500 fill-blue-500" />}
           />
        </div>
      </section>
    </div>
  );
}

function PublicadoSection({ publicaciones }: { publicaciones: any[] }) {
  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between border-b-2 border-gray-100 pb-10">
         <div className="space-y-2">
            <h3 className="text-3xl font-black text-[var(--primary)] tracking-tighter uppercase italic">Victory Log</h3>
            <p className="text-[11px] font-black text-gray-400 tracking-[0.4em] uppercase italic">Archivo histórico de producción</p>
         </div>
         <div className="bg-white border-2 border-gray-100 px-8 py-4 rounded-[28px] shadow-sm">
            <span className="text-4xl font-black text-[var(--primary)] tracking-tighter">{publicaciones.length}</span>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-4 italic">Posts</span>
         </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
           <div className="col-span-full py-24 text-center space-y-6">
              <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-2xl opacity-40">
                 <Clapperboard size={36} className="text-gray-200" />
              </div>
              <p className="text-xs font-black text-gray-300 uppercase tracking-[0.4em] italic leading-relaxed">Cámara lista.<br/>Acción pendiente.</p>
           </div>
         )}
      </div>
    </div>
  );
}

function IdeaItem({ type, title, desc }: any) {
  return (
    <div className="group cursor-pointer p-6 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/15 rounded-[32px] transition-all border-2 border-transparent hover:border-blue-100 bg-gray-50/50">
      <div className="flex items-center gap-3 mb-4">
         <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,1)]"></div>
         <span className="text-[9px] font-black text-blue-600 tracking-[0.3em] uppercase italic font-mono">{type}</span>
      </div>
      <h4 className="text-xl font-black text-[var(--primary)] group-hover:text-blue-600 transition-colors uppercase tracking-widest leading-none mb-3">{title}</h4>
      <p className="text-[13px] font-bold text-gray-500 leading-relaxed opacity-80 italic">{desc}</p>
    </div>
  );
}

function SerieCard({ name, status, count, color }: any) {
  const accent = color === 'emerald' ? 'emerald' : 'blue';
  return (
    <div className="p-6 rounded-[32px] border border-gray-100 flex items-center justify-between hover:scale-[1.03] transition-all bg-white shadow-sm hover:shadow-xl hover:shadow-gray-200/50 cursor-pointer">
      <div className="flex items-center gap-5">
        <div className={`h-11 w-11 rounded-[18px] flex items-center justify-center ${color === 'emerald' ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-300'}`}>
           <Play size={20} fill="currentColor" />
        </div>
        <div>
          <h4 className="text-[14px] font-black text-[var(--primary)] uppercase tracking-tight leading-none">{name}</h4>
          <p className={`text-[9px] font-black ${color === 'emerald' ? 'text-emerald-500' : 'text-gray-400'} uppercase tracking-[0.3em] mt-2 italic font-mono`}>{status}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-black text-[var(--primary)] tracking-tighter">{count}</div>
      </div>
    </div>
  );
}

function TipCard({ title, desc, icon }: any) {
   return (
      <Card className="p-8 border-2 border-gray-100 relative overflow-hidden group hover:border-[var(--primary)] transition-all rounded-[32px] bg-white">
         <div className="flex items-center gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-2xl group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">{icon}</div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary)] italic">{title}</h4>
         </div>
         <p className="text-[12px] font-bold text-gray-500 leading-relaxed uppercase tracking-wider opacity-90 italic">
            "{desc}"
         </p>
      </Card>
   );
}

function PublishedItem({ type, platform, title, date, views }: any) {
  return (
    <Card className="p-0 border-2 border-gray-100 group hover:border-[var(--primary)] transition-all overflow-hidden rounded-[40px] bg-white shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 active:scale-95">
       <div className={`px-8 py-5 flex justify-between items-center ${
            platform === 'TIKTOK' ? 'bg-zinc-950 text-white' : (platform === 'REEL' ? 'bg-gradient-to-r from-purple-900 to-pink-900 text-white' : 'bg-blue-950 text-white')
          }`}>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase font-mono italic">{platform}</span>
          <span className="text-[9px] font-black opacity-50 uppercase tracking-widest">{date}</span>
       </div>
       <div className="p-8">
          <h4 className="text-lg font-black text-[var(--primary)] line-clamp-2 uppercase tracking-tighter mb-10 leading-tight h-14 italic">{title}</h4>
          <div className="flex items-center justify-between border-t border-gray-50 pt-6">
             <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] font-mono italic">{type}</div>
             <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                <BarChart3 size={14} className="text-blue-500" />
                <span className="text-[11px] font-black text-[var(--primary)]">{views}</span>
             </div>
          </div>
       </div>
    </Card>
  );
}
