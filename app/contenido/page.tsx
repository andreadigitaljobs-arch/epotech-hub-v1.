"use client";

import { useState } from "react";
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
  Users
} from "lucide-react";

export default function ContenidoPage() {
  const [activeTab, setActiveTab] = useState('guiones');

  const tabs = [
    { id: 'guiones', name: 'Escaletas', icon: Play },
    { id: 'ideas', name: 'Lluvia de Ideas', icon: Lightbulb },
    { id: 'academia', name: 'Tips Pro', icon: Video },
    { id: 'publicado', name: 'Lo que subimos', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-10 pb-32">
      {/* Header Premium */}
      <header className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-amber-500 p-2 rounded-xl shadow-lg">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Fábrica de Viralidad</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-[var(--primary)]">
          Creación de Contenido
        </h1>
        <p className="mt-3 text-sm font-bold text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Escaletas, guiones y estrategia para que Sebastián domine las redes en Utah.
        </p>
      </header>

      {/* Tabs Switcher - Centered and Premium */}
      <div className="flex gap-2 p-1.5 bg-gray-100/50 backdrop-blur-sm rounded-[28px] w-full overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-[22px] text-[10px] font-black whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? "bg-[var(--primary)] text-white shadow-lg shadow-blue-500/20 translate-y-[-1px]" 
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
        {activeTab === 'ideas' && <IdeasSection />}
        {activeTab === 'academia' && <AcademiaSection />}
        {activeTab === 'publicado' && <PublicadoSection />}
      </div>
    </div>
  );
}

function GuionesSection() {
  return (
    <div className="space-y-8">
       {/* Guion 1: Acompáñame a chambear */}
       <Card className="p-8 border-2 border-[var(--border)] relative overflow-hidden group">
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Formato: STORYTELLING</span>
              <h3 className="text-2xl font-black text-[var(--primary)] mt-3">"Un día de locos en Utah" 🚜</h3>
            </div>
            <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg">
               <Users size={24} />
            </div>
          </div>
          
          <div className="space-y-6">
             <div className="border-l-4 border-blue-500 pl-4 py-1">
                <h4 className="text-xs font-black uppercase text-blue-500 tracking-widest mb-1">Gancho (0-3 segundos)</h4>
                <p className="text-sm font-bold text-gray-700">"¡Ustedes no saben lo que nos encontramos hoy en este garaje!" (Muestra el antes extremo mientras lo dices).</p>
             </div>
             <div className="border-l-4 border-gray-200 pl-4 py-1">
                <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Cuerpo (3-45 segundos)</h4>
                <p className="text-sm font-bold text-gray-600 leading-relaxed italic">
                  - Clip de 5 seg preparando la mezcla rápido.<br/>
                  - Clip de 5 seg aplicando la primera capa POV.<br/>
                  - Habla a cámara: "Aquí en Utah la sal destruye el concreto, por eso el Epoxy no es un lujo, es una inversión."
                </p>
             </div>
             <div className="border-l-4 border-amber-500 pl-4 py-1">
                <h4 className="text-xs font-black uppercase text-amber-500 tracking-widest mb-1">Llamado a la acción</h4>
                <p className="text-sm font-bold text-gray-700">"Si tu garaje se ve como el del inicio, comenta EPOXY abajo."</p>
             </div>
          </div>
       </Card>

       {/* Guion 2: El Proceso Maestro */}
       <Card className="p-8 border-2 border-[var(--border)] relative overflow-hidden group">
          <div className="flex items-start justify-between mb-8">
            <div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Formato: EDUCATIVO / ASMR</span>
              <h3 className="text-2xl font-black text-[var(--primary)] mt-3">"Los 3 Secretos del Brillo" ✨</h3>
            </div>
            <div className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg">
               <Zap size={24} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-4 bg-gray-50 rounded-2xl">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Paso 1</h4>
                <p className="text-xs font-bold text-gray-600">Lija de diamante industrial (Muestra el ruido y el polvo).</p>
             </div>
             <div className="p-4 bg-gray-50 rounded-2xl">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Paso 2</h4>
                <p className="text-xs font-bold text-gray-600">Base niveladora premium (Muestra cómo desaparecen las grietas).</p>
             </div>
             <div className="p-4 bg-gray-50 rounded-2xl">
                <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Paso 3</h4>
                <p className="text-xs font-bold text-gray-600">Capa de sellado UV (Muestra el reflejo final).</p>
             </div>
          </div>
       </Card>
    </div>
  );
}

function IdeasSection() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 border-2 border-[var(--border)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <Zap size={100} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-6">Ideas Rápidas (Para Sebas)</h3>
          <div className="space-y-6">
            <IdeaItem 
              type="CURB APPEAL" 
              title="Driveway vs Mud" 
              desc="Lava solo la mitad de una entrada llena de barro y deja que la gente vea la diferencia."
            />
            <IdeaItem 
              type="HUMANO" 
              title="Story: Mi primera herramienta" 
              desc="Cuenta la historia de la primera máquina que compraste y dónde estás hoy."
            />
            <IdeaItem 
              type="TUTORIAL" 
              title="Cómo cuidar tu Epoxy" 
              desc="Video rápido de lo que NO debes tirar al suelo de tu garaje."
            />
          </div>
        </Card>

        <Card className="p-8 border-2 border-[var(--border)] group">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Series de Videos</h3>
          <div className="space-y-4">
             <SerieCard name="Duelo de Suciedad" status="Falta 1 video" count={2} />
             <SerieCard name="Mitos del Concreto en Utah" status="Planeado" count={0} />
             <SerieCard name="Epotech Responde" status="Próximamente" count={0} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function AcademiaSection() {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-3 mb-6">
           <Smartphone size={20} className="text-emerald-500" />
           <h2 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">Checklist de Grabación</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Card className="p-6 bg-emerald-50/50 border-emerald-100 border-2">
              <h4 className="font-black text-emerald-900 text-sm mb-2 flex items-center gap-2">
                <Star size={16} className="fill-emerald-500 text-emerald-500" /> Iluminación Natural
              </h4>
              <p className="text-[10px] font-bold text-emerald-800 leading-relaxed uppercase tracking-wider opacity-80">
                Graba siempre con el sol a favor, nunca en contra. Si el garaje está muy oscuro, abre las puertas al máximo.
              </p>
           </Card>
           <Card className="p-6 bg-blue-50/50 border-blue-100 border-2">
              <h4 className="font-black text-blue-900 text-sm mb-2 flex items-center gap-2">
                <Play size={16} className="fill-blue-500 text-blue-500" /> Sonido de Impacto
              </h4>
              <p className="text-[10px] font-bold text-blue-800 leading-relaxed uppercase tracking-wider opacity-80">
                Graba el sonido de las máquinas. El "ruido" de limpieza es adictivo en TikTok (ASMR industrial).
              </p>
           </Card>
        </div>
      </section>
    </div>
  );
}

function PublicadoSection() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <h3 className="text-lg font-black text-[var(--primary)] uppercase tracking-tight">Publicado esta semana</h3>
         <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Actualizado por Andrea</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         <PublishedItem 
            type="REEL" 
            platform="INSTAGRAM"
            title="Video satisfyer driveway" 
            date="Ayer"
            views="1.2k"
         />
         <PublishedItem 
            type="TIKTOK" 
            platform="TIKTOK"
            title="Antes/Después Garage Epoxy" 
            date="Hace 2 días"
            views="3.5k"
         />
         <PublishedItem 
            type="POST" 
            platform="INSTAGRAM"
            title="Carrusel Tips Mantenimiento" 
            date="Semana pasada"
            views="-- "
         />
      </div>

      <Card className="p-10 border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center flex-col text-center">
         <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <BarChart3 size={32} className="text-blue-500" />
         </div>
         <h4 className="font-black text-[var(--primary)]">Sincronización de Métricas</h4>
         <p className="text-xs font-bold text-gray-500 mt-1 max-w-xs">
           Cuando Andrea marca un video como "Subido", los widgets del Dashboard principal se actualizan automáticamente.
         </p>
      </Card>
    </div>
  );
}

function IdeaItem({ type, title, desc }: any) {
  return (
    <div className="group cursor-pointer p-4 hover:bg-amber-50 rounded-2xl transition-colors border-2 border-transparent hover:border-amber-100">
      <span className="text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 tracking-widest">{type}</span>
      <h4 className="text-base font-black text-[var(--primary)] mt-2 group-hover:text-amber-600 transition-colors uppercase tracking-tighter">{title}</h4>
      <p className="text-xs font-bold text-gray-500 mt-1">{desc}</p>
    </div>
  );
}

function SerieCard({ name, status, count }: any) {
  return (
    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between hover:border-blue-200 transition-all cursor-pointer">
      <div>
        <h4 className="text-sm font-black text-[var(--primary)]">{name}</h4>
        <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-1">{status}</p>
      </div>
      <div className="text-right">
        <div className="text-xl font-black text-[var(--primary)]">{count}</div>
        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Capítulos</div>
      </div>
    </div>
  );
}

function PublishedItem({ type, platform, title, date, views }: any) {
  return (
    <Card className="p-6 border-2 border-[var(--border)] group hover:border-[var(--accent)] transition-all">
       <div className="flex justify-between items-start mb-4">
          <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
            platform === 'TIKTOK' ? 'bg-black text-white' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
          }`}>
            {platform}
          </span>
          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{date}</span>
       </div>
       <h4 className="text-sm font-black text-[var(--primary)] line-clamp-1 group-hover:text-[var(--accent)] transition-colors">{title}</h4>
       <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{type}</div>
          <div className="flex items-center gap-1">
             <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black text-[var(--primary)]">{views}</span>
          </div>
       </div>
    </Card>
  );
}

