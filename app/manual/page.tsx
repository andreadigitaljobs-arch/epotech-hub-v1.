"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { manual as staticManual } from "@/data/manual";
import { 
  Camera, 
  Settings, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Zap,
  Play,
  Video,
  HelpCircle,
  UserCheck,
  Trophy,
  Smartphone
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const phaseIcons: Record<string, any> = {
  antes: Camera,
  durante: Settings,
  despues: Sparkles,
  humano: UserCheck,
};

const phaseColors: Record<string, string> = {
  antes: "bg-blue-50 text-blue-600 border-blue-100",
  durante: "bg-amber-50 text-amber-600 border-amber-100",
  despues: "bg-emerald-50 text-emerald-600 border-emerald-100",
  humano: "bg-purple-50 text-purple-600 border-purple-100",
};

const phaseMessages: Record<string, string> = {
  antes: "El antes es lo que vende el después. Si el problema no se ve claro, la transformación perderá impacto.\n\n💡 Si no sabes cómo hacer una toma, dale al botón '¿CÓMO GRABARLO?'.",
  durante: "Múltiples ángulos = versátil. Clips cortos = dinámico. Valor agregado = diferenciador. Jenkryfer en video = humanidad.\n\n💡 Si no sabes cómo hacer una toma, dale al botón '¿CÓMO GRABARLO?'.",
  despues: "El espectador recuerda primero lo último que vio. Que sea satisfactorio.\n\n💡 Si no sabes cómo hacer una toma, dale al botón '¿CÓMO GRABARLO?'.",
  humano: "Estos videos son la pieza clave para tus STORIES. Al grabarlos, humanizas tu marca y generas confianza diaria.\n\n💡 Si no sabes cómo hacer una toma, dale al botón '¿CÓMO GRABARLO?'.",
};

export default function ManualPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState("antes");
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  useEffect(() => {
    // Failsafe: 3 segundos max de carga
    const timer = setTimeout(() => setLoading(false), 3000);

    async function fetchData() {
      try {
        const { data: mData } = await supabase
          .from("config_manual")
          .select("*")
          .maybeSingle();
        
        const fallback = {
          regla_oro: staticManual.regla.ruleEs,
          haz_list: staticManual.comoGrabar.haz.map(h => h.es),
          evita_list: staticManual.comoGrabar.evita.map(e => e.es),
          fases: staticManual.fases
        };

        if (mData) {
          setData({
            regla_oro: mData.regla_oro || fallback.regla_oro,
            haz_list: (mData.haz_list && mData.haz_list.length > 0) ? mData.haz_list : fallback.haz_list,
            evita_list: (mData.evita_list && mData.evita_list.length > 0) ? mData.evita_list : fallback.evita_list,
            fases: (mData.fases && mData.fases.length > 0) ? mData.fases : fallback.fases
          });
        } else {
          setData(fallback);
        }
      } catch (error) {
        console.error("Error loading manual:", error);
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    }
    fetchData();
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner message="Cargando protocolos..." />;

  const phases = (data.fases || staticManual.fases).map((fase: any) => {
    let itemsFinales = [...(fase.items || [])];

    // 1. CONFIGURACIÓN TÉCNICA (Antes)
    if (fase.id === 'antes') {
      const hasTecnica = itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('CONFIGURACIÓN TÉCNICA'));
      if (!hasTecnica) {
        itemsFinales = [
          {
            en: "⚙️ TECHNICAL SETUP",
            es: "⚙️ CONFIGURACIÓN TÉCNICA",
            tooltip: "Asegura la mejor calidad antes de grabar:\n\n• Resolución: 4K 60fps (si es posible)\n• Formato: Vertical (9:16) para redes\n• Iluminación: Luz natural, evitar contraluz\n• Movimiento: Suave, no abrupto\n• Audio: Que se escuche la máquina real\n\nDISPOSITIVOS:\n• iPhone = POV (punto de vista) + detalles\n• GoPro = Vista externa con trípode"
          },
          ...itemsFinales
        ];
      }
    }

    // 2. OPTIMIZACIONES DURANTE (Ángulos, Clips, Asistente, Valor Agregado)
    if (fase.id === 'durante') {
      itemsFinales = itemsFinales.map((item: any) => {
        const text = typeof item === 'string' ? item : item.es;
        if (text.includes("1 video del equipo trabajando")) {
          return {
            ...item,
            es: "5+ videos del equipo trabajando (variar ángulos)",
            en: "5+ videos of the team working (vary angles)",
            tooltip: "No grabes solo un video. Necesitas variedad para que el video final sea dinámico:\n\n• De frente\n• De lado\n• Desde arriba\n• Graba bien de cerca (los detalles)\n• Vista externa general"
          };
        }
        return item;
      });

      // Clips Cortos
      if (!itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('CLIPS CORTOS'))) {
        itemsFinales.push({
          en: "📍 DETAILS AND SHORT CLIPS (5-10 SEC)",
          es: "📍 DETALLES Y CLIPS CORTOS (5-10 SEG)",
          tooltip: "Necesitas MUCHOS clips cortos para que el video no sea aburrido. Graba mínimo 8-10 de estos:\n\n• Manchas/suciedad desapareciendo\n• Contraste agua sucia vs limpia\n• Presión del agua en acción\n• Texturas (antes vs después)\n• Expresión/técnica de Sebastián\n• Herramientas en detalle\n• Obstáculos siendo resueltos\n• Transformación visible"
        });
      }

      // Jenkryfer
      if (!itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('JENKRYFER'))) {
        itemsFinales.push({
          en: "👥 JENKRYFER / ASSISTANT",
          es: "👥 JENKRYFER / ASISTENTE",
          tooltip: "No es solo Sebastián, es un equipo. Si Jenkryfer o alguien está ayudando, graba:\n\n• Videos de ella montando herramientas\n• Videos de ella pasando accesorios\n• Videos de ella documentando (foto/video)\n• Videos de ambos trabajando en el mismo frame\n\nEsto humaniza todo y muestra equipo."
        });
      }

      // Valor Agregado
      if (!itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('VALOR AGREGADO'))) {
        itemsFinales.push({ 
          en: "⭐ EXTRA VALUE (DOORS, BINS, EXTRAS)", 
          es: "⭐ VALOR AGREGADO (PUERTAS, BOTES, EXTRAS)", 
          tooltip: "¿Hay algo extra que van a hacer hoy? (Ej: Puertas, botes de basura, etc.)\n\nSI → Grabar ANTES + PROCESO + DESPUÉS del extra.\nNO → Continuar con el trabajo normal.\n\nRecuerda: Esto es lo que te diferencia de la competencia. Si no lo grabas, es como si nunca lo hiciste." 
        });
      }
    }

    // 3. RESULTADO REALISTA (Al final)
    if (fase.id === 'despues') {
      if (!itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('RESULTADO FINAL REALISTA'))) {
        itemsFinales.push({
          en: "🔍 REALISTIC FINAL RESULT",
          es: "🔍 RESULTADO FINAL REALISTA",
          tooltip: "La honestidad genera confianza. No todo tiene que ser perfecto:\n\n• 1 video recorrido final (limpio, lento)\n• Graba bien de cerca las áreas difíciles (antes vs después)\n• Muestra áreas 100% limpias\n• Muestra áreas con limpieza parcial (ej: manchas de óxido persistentes)\n   → Graba el antes/después aunque sea parcial\n• Reacción del cliente (si existe)"
        });
      }
    }

    // 4. VALIDACIÓN RÁPIDA (Universal al final de CADA fase)
    if (!itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('VALIDACIÓN RÁPIDA'))) {
      itemsFinales.push({
        en: "✅ QUICK VALIDATION",
        es: "✅ VALIDACIÓN RÁPIDA",
        tooltip: "Antes de irte del cliente, verifica:\n\n• ¿Grabé ANTES (panorámica + problema)?\n• ¿Grabé DURANTE (múltiples ángulos)?\n• ¿Grabé DESPUÉS (recorrido + resultado)?\n• ¿Todos los videos se ven nítidos y bien iluminados?\n• ¿Tengo mínimo 15 minutos de material?\n\n⚠️ SI respondiste 'No' a alguno → REGRESA Y GRABA AHORA"
      });
    }

    return { ...fase, items: itemsFinales };
  });

  return (
    <div className="max-w-5xl mx-auto pb-32">
      <div className="space-y-6">
        <header className="relative bg-[#142d53] p-6 md:p-12 md:rounded-[2rem] text-white pt-[calc(1.5rem+env(safe-area-inset-top))]">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[var(--accent)] p-1.5 rounded-lg shadow-lg">
              <Video size={14} className="text-[#142d53]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Protocolo de Campo</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-4">
            Guía de Grabación Master
          </h1>
        </header>

        <div className="px-6 space-y-6">
          <div className="bg-white/50 border border-slate-200 p-6 rounded-[2rem] w-full">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
              <span className="text-[var(--accent)]">Protocolos de Grabación:</span> Sigue estos protocolos tácticos sobre luz, audio y encuadre para que cada video que grabes transmita la autoridad de una empresa líder en Utah. El profesionalismo visual genera confianza inmediata.
            </p>
          </div>

          {/* Nueva Sección de Estrategia Transplantada */}
          <div className="bg-[#48c1d2] p-6 rounded-[2.5rem] text-[#142d53] shadow-md mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-white/20 p-2 rounded-xl"><Trophy size={18} /></div>
              <h4 className="text-lg font-black tracking-tight">Nuestra Estrategia</h4>
            </div>
          <p className="text-sm font-bold leading-tight mb-4">
            Documental Real: Menos anuncios falsos, más realidad y autoridad.
          </p>
          
          <a 
            href="https://www.tiktok.com/@allsidespressurewashing" 
            target="_blank" 
            className="inline-flex items-center gap-2 bg-[#142d53] text-[#48c1d2] px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all mb-6 shadow-lg"
          >
            <Smartphone size={14} /> Ver Referencia
          </a>

            <div className="space-y-3">
              <h5 className="text-[8px] font-black uppercase tracking-[0.2em] opacity-60">Rutina Diaria:</h5>
              <div className="grid gap-2">
                {[
                  { step: "1. Captura en sitio", desc: "Sigue el checklist de las 4 fases: graba lo que hay Antes de empezar, clips del proceso Durante el trabajo, el resultado Al final, y tu Video Humano hablando a cámara." },
                  { step: "2. Tu Reporte Pro", desc: "Abre la app, ve a Tu Reporte Pro y graba un audio respondiendo las 6 preguntas del día: dónde estuviste, qué tan grave era, si fuiste solo o acompañado, qué fue lo difícil, qué herramienta fue el héroe y qué le gustó al cliente." },
                  { step: "3. Guion", desc: "Nosotros tomamos tu reporte y lo convertimos en un guion profesional listo para leer. Tú no escribes nada." },
                  { step: "4. Narración del Guion", desc: "Abre el guion en la app, lee cada escena en el teleprompter y graba tu voz en off. Cuando termines, envíanoslo con un clic." }
                ].map((s, idx) => (
                  <div key={idx} className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/20">
                    <span className="text-xl font-black opacity-30 leading-none mt-0.5">{idx + 1}</span>
                    <div>
                      <p className="text-xs font-black uppercase leading-none mb-1.5">{s.step}</p>
                      <p className="text-[11px] font-bold opacity-90 leading-tight">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>

        {/* Regla de Oro Compacta */}
        <div className="group bg-[var(--primary)] rounded-[2.5rem] p-6 text-white relative overflow-hidden shadow-xl">
          <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap size={120} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)] mb-2">La Regla de Oro Mundial</h3>
          <p className="text-lg font-black italic leading-tight text-balance">
            "{data.regla_oro}"
          </p>
        </div>

        {/* Selector de Fase Compacto */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {phases.map((fase: any) => {
            const Icon = phaseIcons[fase.id] || Camera;
            const isActive = activePhase === fase.id;
            return (
              <button
                key={fase.id}
                onClick={() => setActivePhase(fase.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all border ${
                  isActive 
                    ? "bg-white border-[var(--accent)] shadow-md" 
                    : "bg-gray-50 border-transparent text-[var(--text-muted)] opacity-70"
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? "bg-[var(--accent)] text-white" : "bg-white border"}`}>
                  <Icon size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-left leading-tight">
                  {fase.titulo}
                </span>
              </button>
            );
          })}
        </div>

        {/* Contenido de Fase */}
        <div className="min-h-[300px]">
          {phases.map((fase: any) => {
            if (activePhase !== fase.id) return null;
            const Icon = phaseIcons[fase.id] || Play;
            const colorStyles = phaseColors[fase.id] || "bg-gray-100";

            return (
              <div key={fase.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="p-6 border-t-8 shadow-xl rounded-[2.5rem]" style={{ borderTopColor: fase.id === 'antes' ? '#3b82f6' : fase.id === 'durante' ? '#f59e0b' : fase.id === 'despues' ? '#10b981' : '#a855f7' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl border ${colorStyles}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[var(--primary)] tracking-tighter">{fase.titulo}</h3>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Checklist de grabación</p>
                    </div>
                  </div>

                  <div className={`mb-6 p-5 rounded-2xl border transition-all ${activePhase === 'humano' ? 'bg-purple-50 border-purple-200' : 'bg-blue-50/50 border-blue-100/50'}`}>
                    <p className={`text-xs font-black uppercase tracking-tight leading-relaxed ${activePhase === 'humano' ? 'text-purple-700' : 'text-[#142d53]'}`}>
                      <span className={`inline-block text-white px-2 py-1 rounded mr-3 mb-1 ${activePhase === 'humano' ? 'bg-purple-600' : 'bg-[#142d53]'}`}>
                        ESTRATEGIA 2026:
                      </span>
                      {phaseMessages[activePhase]}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                    {fase.items.map((item: any, idx: number) => (
                      <div key={idx} className="group flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white hover:border-[var(--accent)] transition-all">
                        <div className="mt-0.5 bg-white border border-[var(--border)] group-hover:border-[var(--accent)] rounded-lg w-6 h-6 flex items-center justify-center shrink-0 text-[10px] font-black text-[var(--accent)]">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[var(--primary)] leading-tight pt-0.5 pr-6 relative flex items-center justify-between gap-2">
                            <span className="block">{(item.es || item)}</span>
                            {item.tooltip && (
                              <button
                                onClick={() => setActiveTooltip(activeTooltip === idx ? null : idx)}
                                className="shrink-0 px-3 py-1.5 bg-[#142d53] hover:bg-[#48c1d2] text-white text-[9px] font-black uppercase rounded-lg transition-all shadow-lg flex items-center gap-1 active:scale-95"
                              >
                                <HelpCircle size={10} /> ¿CÓMO GRABARLO?
                              </button>
                            )}
                          </p>
                          
                          {/* Tooltip Detallado */}
                          {activeTooltip === idx && item.tooltip && (
                            <div className="mt-4 p-4 bg-[#142d53] text-white rounded-xl text-[10px] font-medium leading-relaxed animate-in zoom-in-95 duration-200 shadow-2xl relative border border-white/10 whitespace-pre-line">
                              <div className="absolute -top-2 right-6 w-4 h-4 bg-[#142d53] rotate-45 border-l border-t border-white/10"></div>
                              <span className="text-[#48c1d2] font-black uppercase block mb-1">Instrucción Táctica:</span>
                              {item.tooltip}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3">
                    <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600">
                      <AlertCircle size={14} />
                    </div>
                    <p className="text-[11px] font-black text-amber-900 uppercase tracking-tight leading-tight">
                      Consejo Pro: Los clips deben durar máximo 5 segundos para que sean dinámicos.
                    </p>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Protocolos de acción compactos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-emerald-50/30 border-emerald-100 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-emerald-500 p-1.5 rounded-lg text-white">
                 <CheckCircle2 size={16} />
              </div>
              <h4 className="text-sm font-black text-emerald-900 uppercase">Protocolo "SÍ"</h4>
            </div>
            <ul className="space-y-2">
              {(data.haz_list || []).map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-xs font-bold text-emerald-800">
                  <div className="mt-1.5 h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 bg-red-50/30 border-red-100 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-red-500 p-1.5 rounded-lg text-white">
                 <AlertCircle size={16} />
              </div>
              <h4 className="text-sm font-black text-red-900 uppercase">Protocolo "NO"</h4>
            </div>
            <ul className="space-y-2">
              {(data.evita_list || []).map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-xs font-bold text-red-800">
                  <div className="mt-1.5 h-1 w-1 rounded-full bg-red-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
