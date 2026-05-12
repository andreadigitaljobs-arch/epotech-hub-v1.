"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { manual } from "@/data/manual";
import { ListTodo, Check, RotateCcw, Image, Mic, Video } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";

export default function ChecklistPage() {
  // Using simple local storage state so progress persists on device
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('epotech_checklist');
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
    setMounted(true);
  }, []);

  const toggleItem = (id: string) => {
    const newChecked = { ...checkedItems, [id]: !checkedItems[id] };
    setCheckedItems(newChecked);
    localStorage.setItem('epotech_checklist', JSON.stringify(newChecked));
  };

  const resetAll = () => {
    if(confirm("¿Seguro que quieres reiniciar la semana?")) {
      setCheckedItems({});
      localStorage.removeItem('epotech_checklist');
    }
  };

  if (!mounted) return null;

  // Extra requirements (10 clips, 5 photos, 1 note)
  const extras = [
    { id: "extra-clips", title: "10 Support Clips", subtitle: "10 clips de apoyo", max: 10, icon: Video },
    { id: "extra-photos", title: "5 Photos", subtitle: "5 fotos (abiertas y detalles)", max: 5, icon: Image },
    { id: "extra-voice", title: "1 Voice Note", subtitle: "1 nota de voz del trabajo", max: 1, icon: Mic },
  ];

  // Compute progress upfront
  let totalItems = 0;
  let completedItems = 0;

  manual.fases.forEach((fase) => {
    fase.items.forEach((item, i) => {
      const itemId = `${fase.id}-${i}`;
      totalItems++;
      if (checkedItems[itemId]) completedItems++;
    });
  });

  extras.forEach(extra => {
    totalItems++;
    if (checkedItems[extra.id]) completedItems++;
  });

  const renderSection = (fase: typeof manual.fases[0], index: number) => {
    return (
      <div key={fase.id} className="mb-6">
        <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3 flex items-center gap-2">
          {fase.emoji} {fase.titulo}
        </h3>
        <Card padding="none" className="divide-y divide-[var(--border)] overflow-hidden">
          {fase.items.map((item, i) => {
            const itemId = `${fase.id}-${i}`;
            const isChecked = !!checkedItems[itemId];

             return (
               <label key={i} className={`flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-[var(--bg)] ${isChecked ? 'bg-emerald-50/30' : ''}`}>
                 <div className="relative flex items-start mt-0.5">
                   <input
                     type="checkbox"
                     className="peer sr-only"
                     checked={isChecked}
                     onChange={() => toggleItem(itemId)}
                   />
                   <div className="h-6 w-6 rounded border-2 border-[var(--border)] bg-white peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)] transition-all flex items-center justify-center">
                     <Check size={16} className={`text-white transition-transform ${isChecked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} strokeWidth={3} />
                   </div>
                 </div>
                 
                 <div className={`flex flex-col flex-1 transition-all ${isChecked ? 'opacity-50' : 'opacity-100'} justify-center`}>
                   <span className="font-semibold text-[var(--primary)]">{item.es}</span>
                 </div>
               </label>
             );
          })}
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <header className="mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-5xl font-black tracking-tight text-[var(--primary)] flex items-center gap-2 leading-[1.1]">
              <ListTodo size={24} className="text-[var(--accent)]" /> 
              Checklist
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Tu paquete base para grabar
            </p>
          </div>
          <button onClick={resetAll} className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-lg hover:bg-[var(--bg)]">
            <RotateCcw size={14} /> Reiniciar
          </button>
        </div>
      </header>

      {/* Progress */}
      <Card className="sticky top-4 z-10 shadow-lg border-[var(--primary)] border-2">
         {(() => {
           const percentage = Math.round((completedItems / totalItems) * 100) || 0;
           return (
             <>
               <ProgressBar progress={percentage} label="Progreso del Trabajo" color="primary" />
               <div className="mt-2 text-center text-xs font-semibold text-[var(--text-muted)]">
                 {completedItems} de {totalItems} elementos completados
               </div>
             </>
           )
         })()}
      </Card>

      <div className="mt-6">
        {manual.fases.map((fase, i) => renderSection(fase, i))}
      </div>

      <div className="mt-10">
         <h3 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Material Extra Obligatorio
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           {extras.map(extra => {
             const isChecked = !!checkedItems[extra.id];
             return (
              <label key={extra.id} className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-colors hover:shadow-md ${isChecked ? 'bg-emerald-50 border-emerald-200' : 'bg-[var(--surface)] border-[var(--border)]'}`}>
                 <div className="relative flex items-start mt-0.5">
                   <input
                     type="checkbox"
                     className="peer sr-only"
                     checked={isChecked}
                     onChange={() => toggleItem(extra.id)}
                   />
                   <div className="h-6 w-6 rounded border-2 border-[var(--border)] bg-white peer-checked:border-[var(--primary)] peer-checked:bg-[var(--primary)] transition-all flex items-center justify-center">
                     <Check size={16} className={`text-white transition-transform ${isChecked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} strokeWidth={3} />
                   </div>
                 </div>
                 
                 <div className={`flex flex-col flex-1 transition-all ${isChecked ? 'opacity-50' : 'opacity-100'} justify-center`}>
                   <span className="font-semibold text-[var(--primary)]">{extra.subtitle}</span>
                 </div>
              </label>
             )
           })}
         </div>
      </div>
    </div>
  );
}
