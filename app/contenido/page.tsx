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
  const [activeTab, setActiveTab] = useState('ideas');

  const tabs = [
    { id: 'ideas', name: 'Ideas del Mes', icon: Lightbulb },
    { id: 'academia', name: 'Academia Epotech', icon: Video },
    { id: 'metricas', name: 'Resultados', icon: BarChart3 },
  ];

  return (
    <div className="space-y-10 pb-32">
      {/* Header Premium */}
      <header className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-amber-500 p-2 rounded-xl shadow-lg">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">Estrategia de Viralidad</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-[var(--primary)]">
          Creación de Contenido
        </h1>
        <p className="mt-3 text-sm font-bold text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Diseñado para que Sebastián sepa exactamente qué grabar y cómo hacerlo con calidad de cine.
        </p>
      </header>

      {/* Tabs Switcher */}
      <div className="flex gap-2 p-1.5 bg-gray-100 rounded-[28px] w-full max-w-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[22px] text-xs font-black transition-all ${
              activeTab === tab.id 
                ? "bg-white text-[var(--primary)] shadow-md translate-y-[-1px]" 
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <tab.icon size={16} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'ideas' && <IdeasSection />}
        {activeTab === 'academia' && <AcademiaSection />}
        {activeTab === 'metricas' && <MetricasSection />}
      </div>
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
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-6">Propuestas del Mes</h3>
          <div className="space-y-6">
            <IdeaItem 
              type="REEL VIRAL" 
              title="El satisfyer del concreto" 
              desc="Video POV usando la hidrolavadora en cámara lenta con música tipo ASMR."
            />
            <IdeaItem 
              type="EDUCATIVO" 
              title="¿Por qué usar epoxy en Utah?" 
              desc="Explicando los beneficios reales frente al clima de Utah."
            />
            <IdeaItem 
              type="TRANSFORMACIÓN" 
              title="De garaje viejo a hangar premium" 
              desc="Corte rápido antes/después con sonido de impacto."
            />
          </div>
        </Card>

        <Card className="p-8 border-2 border-[var(--border)] group">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Series en Curso</h3>
          <div className="space-y-4">
             <SerieCard name="Duelo de Suciedad" status="En curso" count={3} />
             <SerieCard name="El Experto Utah" status="Planeado" count={0} />
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
           <h3 className="text-lg font-black text-[var(--primary)]">Tips de Calidad Máxima</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <Card className="p-6 bg-emerald-50/50 border-emerald-100 border-2">
              <h4 className="font-black text-emerald-900 text-sm mb-2 flex items-center gap-2">
                <Star size={16} className="fill-emerald-500 text-emerald-500" /> Instagram Edit App
              </h4>
              <p className="text-xs font-bold text-emerald-800 leading-relaxed">
                Usa siempre la app de edición de Instagram para los toques finales; hemos descubierto que mantiene la nitidez original mejor que otros métodos.
              </p>
           </Card>
           <Card className="p-6 bg-blue-50/50 border-blue-100 border-2">
              <h4 className="font-black text-blue-900 text-sm mb-2 flex items-center gap-2">
                <Play size={16} className="fill-blue-500 text-blue-500" /> Formato POV (Punto de Vista)
              </h4>
              <p className="text-xs font-bold text-blue-800 leading-relaxed">
                A la gente le encanta ver lo que tú ves. Coloca la cámara a la altura de tus ojos mientras trabajas. Es el formato que más crece ahora mismo.
              </p>
           </Card>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-6">
           <Users size={20} className="text-purple-500" />
           <h3 className="text-lg font-black text-[var(--primary)]">Guía para Historias</h3>
        </div>
        <Card className="p-0 border-2 border-[var(--border)] overflow-hidden">
           <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Rutina de "Storytelling" Diaria</p>
           </div>
           <div className="p-6 space-y-4">
              <HistoryStep icon="🌅" step="Mañana" desc="Muestra el café y el camión listo para salir. Humaniza la marca." />
              <HistoryStep icon="⚙️" step="Durante" desc="Clip de 5 segundos nítido trabajando. Pura satisfacción visual." />
              <HistoryStep icon="✅" step="Resultado" desc="Foto del equipo orgulloso del trabajo de hoy." />
           </div>
        </Card>
      </section>
    </div>
  );
}

function MetricasSection() {
  return (
    <div className="space-y-8">
      <Card className="p-10 border-2 border-[var(--border)] text-center">
        <div className="bg-gray-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
           <BarChart3 size={32} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-black text-[var(--primary)] mb-2">Resumen de Impacto</h3>
        <p className="text-sm font-bold text-[var(--text-muted)] max-w-sm mx-auto">
          Aquí aparecerán las estadísticas de la semana una vez que Andrea empiece a publicar el contenido nuevo.
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
         <Card className="p-6 border-2 border-[var(--border)]">
            <div className="text-3xl font-black text-[var(--primary)] mb-1">0</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Posts Fijados (3/3)</div>
         </Card>
         <Card className="p-6 border-2 border-[var(--border)]">
            <div className="text-3xl font-black text-[var(--primary)] mb-1">0</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reels Semanales</div>
         </Card>
      </div>
    </div>
  );
}

function IdeaItem({ type, title, desc }: any) {
  return (
    <div className="group cursor-pointer">
      <span className="text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">{type}</span>
      <h4 className="text-base font-black text-[var(--primary)] mt-1 group-hover:text-amber-600 transition-colors">{title}</h4>
      <p className="text-xs font-bold text-gray-500 mt-1">{desc}</p>
    </div>
  );
}

function SerieCard({ name, status, count }: any) {
  return (
    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
      <div>
        <h4 className="text-sm font-black text-[var(--primary)]">{name}</h4>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{status}</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-black text-[var(--primary)]">{count}</div>
        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Videos</div>
      </div>
    </div>
  );
}

function HistoryStep({ icon, step, desc }: any) {
  return (
    <div className="flex gap-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <h4 className="text-xs font-black text-[var(--primary)] uppercase tracking-widest">{step}</h4>
        <p className="text-xs font-bold text-gray-500 mt-1">{desc}</p>
      </div>
    </div>
  );
}
