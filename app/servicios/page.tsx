import { Card } from "@/components/ui/Card";
import { services } from "@/data/sebastian";
import { Briefcase, Video, Share2, Target, Scissors, CalendarClock } from "lucide-react";
import { ComponentType } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { BilingualText } from "@/components/ui/BilingualText";

const IconMap: Record<string, ComponentType<any>> = {
  video: Video,
  share: Share2,
  target: Target,
  scissors: Scissors,
};

export default function ServiciosPage() {
  return (
    <div className="space-y-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-[var(--primary)] flex items-center gap-2">
          <Briefcase size={24} className="text-[var(--accent)]" /> 
          Servicios Activos
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Estado actual de todo lo que estamos trabajando para Epotech.
        </p>
      </header>

      <div className="space-y-4">
        {services.map((service) => {
          const IconComponent = IconMap[service.icon] || Briefcase;

          return (
            <Card key={service.id} className="relative overflow-hidden group">
              {/* Top Accent line if active */}
              {service.status === 'active' && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent)]" />
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${service.status === 'active' ? 'bg-[var(--accent-light)] text-[var(--accent-dark)]' : 'bg-[var(--bg)] text-[var(--text-muted)]'}`}>
                        <IconComponent size={20} />
                      </div>
                      <div>
                         <BilingualText 
                           en={service.nameEn} 
                           es={service.name} 
                           enStyle="primary" 
                           esStyle="muted" 
                         />
                      </div>
                    </div>
                    <StatusBadge status={service.status} />
                  </div>
                  
                  <p className="text-sm text-[var(--text-muted)] mb-5 pl-12 border-l-2 border-transparent">
                    {service.description}
                  </p>
                  
                  <div className="bg-[var(--bg)] rounded-xl p-3 sm:p-4 mt-2">
                    <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      <CalendarClock size={14} /> Próximo paso / Entrega
                      <span className="ml-auto normal-case text-sm text-[var(--primary)]">{service.nextDelivery}</span>
                    </div>
                    <ProgressBar 
                      progress={service.progress} 
                      color={service.status === 'active' ? 'accent' : 'primary'}
                    />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
