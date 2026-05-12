import { Card } from "@/components/ui/Card";
import { Calendar, Repeat, Battery, BatteryCharging } from "lucide-react";
import { manual } from "@/data/manual";

export default function RutinaPage() {
  const flujo = [
    { dia: "Lunes", es: "Definir piezas a grabar según trabajos activos", color: "border-blue-500" },
    { dia: "Mar - Jue", es: "Grabar trabajos reales usando la checklist", color: "border-cyan-500" },
    { dia: "Viernes", es: "Mandar el paquete completo a Epotech HQ", color: "border-emerald-500" },
    { dia: "Domingo", es: "Revisar qué funcionó esta semana", color: "border-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <header className="mb-6 border-b border-[var(--border)] pb-6">
        <h1 className="text-2xl md:text-5xl font-black tracking-tight text-[var(--primary)] flex items-center gap-2 leading-[1.1]">
          <Calendar size={24} className="text-[var(--accent)]" /> 
          Rutina y Constancia
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          La constancia sale de reducir fricción, no de la motivación.
        </p>
      </header>

      {/* Tipo de producto y para qué sirve */}
      <section>
        <h2 className="text-lg font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
           <div className="h-2 w-2 rounded-full bg-[var(--accent)]" />
           Qué contar según el material
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {manual.tiposEpoxy.map((tipo, idx) => (
             <Card key={idx} className="bg-[var(--surface)]">
               <h3 className="font-bold text-[var(--primary)] text-lg mb-1">{tipo.nombre}</h3>
               <p className="text-sm text-[var(--text-muted)] mb-4">{tipo.descripcion}</p>
               <div className="bg-[var(--bg)] rounded-xl p-3">
                 <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">Ideal para mostrar:</div>
                 <ul className="space-y-2">
                   {tipo.paraQue.map((pq, i) => (
                     <li key={i} className="flex items-start gap-2">
                       <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                       <span className="text-xs text-[var(--text-main)] font-medium">{pq.es}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             </Card>
           ))}
        </div>
      </section>

      {/* Flujo Semanal */}
      <section>
         <h2 className="text-lg font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
           <Repeat size={20} className="text-[var(--accent)]" />
           Flujo Semanal
         </h2>
        <Card padding="none" className="overflow-hidden">
          <div className="divide-y divide-[var(--border)]">
             {flujo.map((item, idx) => (
                <div key={idx} className="flex items-stretch bg-[var(--surface)]">
                  <div className={`w-2 ${item.color} bg-current`} />
                  <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div className="font-bold text-[var(--primary)] w-24 shrink-0">{item.dia}</div>
                    <span className="text-sm text-[var(--text-main)]">{item.es}</span>
                  </div>
                </div>
             ))}
          </div>
        </Card>
      </section>

      {/* Lo que te sostiene vs Lo que te quema */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
            <BatteryCharging size={20} className="text-[var(--success)]" /> Lo que te sostiene
          </h3>
          <Card className="flex-1 border-t-4 border-t-[var(--success)] shadow-sm">
            <ul className="space-y-4">
               <li className="text-sm font-medium text-[var(--text-main)] flex items-start gap-2"><div className="h-2 w-2 rounded-full bg-[var(--success)] shrink-0 mt-1.5" /> Seguir la checklist fija por trabajo</li>
               <li className="text-sm font-medium text-[var(--text-main)] flex items-start gap-2"><div className="h-2 w-2 rounded-full bg-[var(--success)] shrink-0 mt-1.5" /> Grabar en bloques pequeños</li>
               <li className="text-sm font-medium text-[var(--text-main)] flex items-start gap-2"><div className="h-2 w-2 rounded-full bg-[var(--success)] shrink-0 mt-1.5" /> Repetir formatos que ya funcionan</li>
               <li className="text-sm font-medium text-[var(--text-main)] flex items-start gap-2"><div className="h-2 w-2 rounded-full bg-[var(--success)] shrink-0 mt-1.5" /> Guardar biblioteca de clips útiles</li>
               <li className="text-sm font-medium text-[var(--text-main)] flex items-start gap-2"><div className="h-2 w-2 rounded-full bg-[var(--success)] shrink-0 mt-1.5" /> Tener un día más liviano si hace falta</li>
            </ul>
          </Card>
        </div>
        
        <div className="flex flex-col">
           <h3 className="text-lg font-bold text-[var(--primary)] mb-4 flex items-center gap-2">
             <Battery size={20} className="text-[var(--danger)]" /> Lo que te quema
           </h3>
           <Card className="flex-1 border-t-4 border-t-[var(--danger)] shadow-sm">
             <ul className="space-y-4">
               <li className="text-sm font-medium text-[var(--text-main)] flex items-start gap-2"><div className="h-2 w-2 rounded-full bg-[var(--danger)] shrink-0 mt-1.5" /> Improvisar todo cada semana</li>
               <li className="text-sm font-medium text-[var(--text-main)] flex items-start gap-2"><div className="h-2 w-2 rounded-full bg-[var(--danger)] shrink-0 mt-1.5" /> Pensar que cada pieza debe ser 100% nueva</li>
               <li className="text-sm font-medium text-[var(--text-main)] flex items-start gap-2"><div className="h-2 w-2 rounded-full bg-[var(--danger)] shrink-0 mt-1.5" /> Grabar solo cuando hay trabajo &quot;espectacular&quot;</li>
               <li className="text-sm font-medium text-[var(--text-main)] flex items-start gap-2"><div className="h-2 w-2 rounded-full bg-[var(--danger)] shrink-0 mt-1.5" /> Depender de hablar siempre a cámara</li>
               <li className="text-sm font-medium text-[var(--text-main)] flex items-start gap-2"><div className="h-2 w-2 rounded-full bg-[var(--danger)] shrink-0 mt-1.5" /> Mandar material incompleto y re-grabar</li>
             </ul>
           </Card>
        </div>
      </section>
      
      <div className="text-center p-6 mt-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        <h3 className="font-bold text-[var(--primary)] text-lg mb-2">No tienes que ser creador full-time</h3>
        <p className="text-[var(--text-muted)] text-sm max-w-md mx-auto">
          Solo necesitas una rutina mínima, repetible y clara. Documentar bien cada trabajo ya es suficiente para que el sistema produzca contenido constante y profesional.
        </p>
      </div>

    </div>
  );
}
