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
  Smartphone,
  Compass,
  Mic,
  Clock,
  FileText,
  Ban,
  Star,
  Flag,
  Flame,
  Award,
  Target,
  ShieldCheck,
  XCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useThemeColor } from "@/components/layout/ThemeColorHandler";

const phaseIcons: Record<string, any> = {
  antes: Camera,
  durante: Settings,
  despues: Sparkles,
  humano: UserCheck,
};

const phaseColors: Record<string, string> = {
  antes: "bg-[#142d53]/5 text-[#142d53] border-[#142d53]/10",
  durante: "bg-[#48c1d2]/10 text-[#142d53] border-[#48c1d2]/20",
  despues: "bg-[#142d53]/5 text-[#142d53] border-[#142d53]/10",
  humano: "bg-[#48c1d2]/10 text-[#142d53] border-[#48c1d2]/20",
};

const phaseMessages: Record<string, any> = {
  antes: "Aquí tienes la lista de lo que debes grabar al llegar. Es vital capturar el problema real antes de empezar para que luego se note la diferencia.",
  durante: "Aquí verás los clips que necesitamos mientras trabajas. Captura el proceso y los detalles para mostrar cómo resuelves el problema.",
  despues: "Aquí tienes lo que debes grabar al terminar. Muestra el resultado final impecable para probar que el servicio se cumplió con éxito.",
  humano: {
    id: "humano",
    titulo: "Stories Diarias",
    subtitulo: "Aquí tienes ideas para tus historias diarias. Muestra tu cara o narra lo que haces para generar confianza.",
    regla_oro: {
      titulo: "⚠️ REGLA IMPORTANTE",
      items: [
        "No necesitas hablar inglés frente a cámara.",
        "Puedes grabar el lugar, tus manos o POV y narrar en español.",
        "Nosotros traducimos la voz después."
      ]
    },
    reglas_generales: {
      titulo: "🎬 REGLAS GENERALES",
      items: [
        "Clips cortos (3-10 segundos)",
        "Grabar siempre en vertical",
        "Movimientos lentos y suaves",
        "NO usar zoom digital",
        "Limpiar el lente antes de empezar",
        "Grabar múltiples ángulos",
        "NO música de fondo mientras hablas/narras"
      ]
    }
  },
};

export default function ManualPage() {
  useThemeColor("#f8fafc");
  const [data, setData] = useState<any>({
    regla_oro: staticManual.regla.ruleEs,
    haz_list: staticManual.comoGrabar.haz.map(h => h.es),
    evita_list: staticManual.comoGrabar.evita.map(e => e.es),
    fases: staticManual.fases
  });
  const [loading, setLoading] = useState(true);
  const [activePhase, setActivePhase] = useState("antes");
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [expandedProtocol, setExpandedProtocol] = useState<string | null>("reglas");

  useEffect(() => {
    // Failsafe: 3 segundos max de carga
    const timer = setTimeout(() => setLoading(false), 3000);

    /* async function fetchData() {
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
    fetchData(); */
    setData({
      regla_oro: staticManual.regla.ruleEs,
      haz_list: staticManual.comoGrabar.haz.map(h => h.es),
      evita_list: staticManual.comoGrabar.evita.map(e => e.es),
      fases: staticManual.fases
    });
    setLoading(false);
    clearTimeout(timer);
    return () => clearTimeout(timer);
  }, []);

  const phases = (data.fases || staticManual.fases)
    .filter((f: any) => f.id !== 'protocolo')
    .map((fase: any) => {
    let itemsFinales = [...(fase.items || [])];

    // 1. CONFIGURACIÓN TÉCNICA (Antes)
    if (fase.id === 'antes') {
      const hasTecnica = itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('CONFIGURACIÓN TÉCNICA'));
      if (!hasTecnica) {
        itemsFinales = [
          {
            en: "⚙️ HOW TO SETUP YOUR PHONE",
            es: "⚙️ CÓMO PREPARAR EL CELULAR",
            tooltip: "Asegúrate de que todo esté bien antes de empezar:\n\n• Calidad: Usa la máxima resolución de tu celular\n• Posición: Graba con el celular parado (vertical)\n• Luz: Trata de que el sol te dé de frente, no por detrás\n• Lente: Limpia la cámara con tu camisa antes de grabar\n• Audio: Acércate al celular si vas a hablar para que se escuche bien"
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
          en: "DETAILS AND SHORT CLIPS (5-10 SEC)",
          es: "DETALLES Y CLIPS CORTOS (5-10 SEG)",
          tooltip: "Necesitas MUCHOS clips cortos para que el video no sea aburrido. Graba mínimo 8-10 de estos:\n\n• Manchas/suciedad desapareciendo\n• Contraste agua sucia vs limpia\n• Presión del agua en acción\n• Texturas (antes vs después)\n• Expresión/técnica de Sebastián\n• Herramientas en detalle\n• Obstáculos siendo resueltos\n• Transformación visible"
        });
      }

      // Jenkryfer
      if (!itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('JENKRYFER'))) {
        itemsFinales.push({
          en: "JENKRYFER / ASSISTANT",
          es: "JENKRYFER / ASISTENTE",
          tooltip: "No es solo Sebastián, es un equipo. Si Jenkryfer o alguien está ayudando, graba:\n\n• Videos de ella montando herramientas\n• Videos de ella pasando accesorios\n• Videos de ella documentando (foto/video)\n• Videos de ambos trabajando en el mismo frame\n\nEsto humaniza todo y muestra equipo."
        });
      }

      // Valor Agregado
      if (!itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('VALOR AGREGADO'))) {
        itemsFinales.push({ 
          en: "EXTRA VALUE (DOORS, BINS, EXTRAS)", 
          es: "VALOR AGREGADO (PUERTAS, BOTES, EXTRAS)", 
          tooltip: "¿Hay algo extra que van a hacer hoy? (Ej: Puertas, botes de basura, etc.)\n\nSI → Grabar ANTES + PROCESO + DESPUÉS del extra.\nNO → Continuar con el trabajo normal.\n\nRecuerda: Mostrar estos detalles ayuda a que se aprecie todo el esfuerzo que pones en el trabajo." 
        });
      }
    }

    // 3. RESULTADO REALISTA (Al final)
    if (fase.id === 'despues') {
      if (!itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('RESULTADO FINAL REALISTA'))) {
        itemsFinales.push({
          en: "REALISTIC FINAL RESULT",
          es: "RESULTADO FINAL REALISTA",
          tooltip: "La honestidad genera confianza. No todo tiene que ser perfecto:\n\n• 1 video recorrido final (limpio, lento)\n• Graba bien de cerca las áreas difíciles (antes vs después)\n• Muestra áreas 100% limpias\n• Muestra áreas con limpieza parcial (ej: manchas de óxido persistentes)\n   → Graba el antes/después aunque sea parcial\n• Reacción del cliente (si existe)"
        });
      }
    }


    return { ...fase, items: itemsFinales };
  });

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 pb-24">
      {/* 1. INSTRUCCIONES PREMIUM */}
      <div className="mb-4">
        <div className="bg-white/50 border border-slate-200 p-6 rounded-[2rem] w-full shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed text-left">
            <span className="text-[#48c1d2]">Guía completa de grabación:</span> Esta página te muestra exactamente qué necesitamos que grabes o fotografíes en cada momento del día. Navega por las pestañas para conocer lo que debes capturar en el "Antes", "Durante" y "Después" del trabajo, además de ideas para tus historias diarias. <span className="text-[#142d53] bg-[#48c1d2]/20 px-1 rounded">(Toca los elementos con "?" para ver consejos técnicos)</span>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <header className="relative p-6 md:p-8 bg-transparent text-[#0a192f] overflow-visible">
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2rem]">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
              <Compass size={220} />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-[#48c1d2]/10 p-1.5 rounded-lg">
              <Video size={14} className="text-[#48c1d2]" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Manual de Grabación</span>
          </div>
          <h1 className="text-2xl md:text-5xl font-black tracking-tighter text-[#142d53] mb-4 leading-[1.1]">
            Guía para grabar <span className="text-[#48c1d2]">Videos</span>
          </h1>
        </header>


        {/* Regla de Oro Compacta - Premium Glassmorphism */}
        <div className="group bg-gradient-to-br from-[#142d53] to-[#1e3a8a] rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute -right-6 -bottom-6 opacity-[0.1] group-hover:opacity-20 transition-all duration-700 group-hover:scale-110">
            <Zap size={140} className="text-[#48c1d2]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-[#48c1d2] flex items-center justify-center text-[#142d53]">
                <Star size={12} fill="currentColor" />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#48c1d2]">Lo más importante</h3>
            </div>
            <p className="text-xl md:text-2xl font-black italic leading-tight text-white tracking-tight">
              "{data.regla_oro}"
            </p>
            <div className="mt-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#48c1d2] animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Calidad Epotech</span>
            </div>
          </div>
        </div>

        {/* Selector de Fase Compacto */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
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
                <Card className="p-6 border-t-8 shadow-xl rounded-[2.5rem]" style={{ borderTopColor: fase.id === 'durante' || fase.id === 'humano' ? '#48c1d2' : '#142d53' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`p-3 rounded-xl border ${colorStyles}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[var(--primary)] tracking-tighter">{fase.titulo}</h3>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] tracking-widest mt-0.5">Checklist de grabación</p>
                    </div>
                  </div>

                  <div className={`mb-8 p-6 rounded-3xl border border-slate-100 bg-slate-50/50 transition-all`}>
                    {activePhase === 'humano' ? (
                      <div className="space-y-6">
                        <p className={`text-xs font-black uppercase tracking-tight leading-relaxed text-[#142d53] mb-4`}>
                          <span className={`inline-block text-white px-2 py-1 rounded mr-3 mb-1 bg-[#142d53]`}>
                            Qué hacer aquí:
                          </span>
                          Aquí tienes ideas y reglas básicas para crear historias que generen confianza. No se trata de vender, sino de mostrar quién está detrás del trabajo y cómo es el día a día.
                        </p>
                        <div className="text-center pt-4">
                          <p className="text-[11px] font-black text-[#142d53] uppercase tracking-widest italic opacity-80">
                            "No necesitas actuar. Solo cuenta lo que estás haciendo como si se lo explicaras a un amigo."
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className={`text-xs font-black uppercase tracking-tight leading-relaxed text-[#142d53]`}>
                        <span className={`inline-block text-white px-2 py-1 rounded mr-3 mb-1 bg-[#142d53]`}>
                          Qué hacer aquí:
                        </span>
                        {phaseMessages[activePhase]}
                      </p>
                    )}
                  </div>

                  {/* 📋 LISTADO DE ITEMS (Fases normales) */}
                  {activePhase !== 'protocolo' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                      {fase.items.map((item: any, idx: number) => (
                        <div 
                          key={idx} 
                          onClick={() => {
                            if (item.tooltip || activePhase === 'humano') {
                              setActiveTooltip(activeTooltip === idx ? null : idx);
                            }
                          }}
                          className={`group w-full flex flex-col items-start text-left p-5 bg-white rounded-[2rem] border transition-all active:scale-[0.98] cursor-pointer ${activeTooltip === idx ? 'border-[#48c1d2] bg-white shadow-xl ring-4 ring-[#48c1d2]/5' : 'border-slate-100 bg-gray-50/50 hover:bg-white hover:border-[#48c1d2]/50 hover:shadow-lg'}`}
                        >
                          <div className="flex items-start gap-3 w-full">
                            <div className={`mt-0.5 rounded-xl w-8 h-8 flex items-center justify-center shrink-0 text-xs font-black transition-all ${activeTooltip === idx ? 'bg-[#142d53] text-[#48c1d2]' : 'bg-white border border-slate-100 text-slate-400 group-hover:text-[#48c1d2]'}`}>
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <p className={`text-sm md:text-base font-black leading-tight transition-colors whitespace-normal ${activeTooltip === idx ? 'text-[#142d53]' : 'text-slate-600 group-hover:text-[#142d53]'}`}>
                                  {(item.es || item)}
                                </p>
                                <div className={`shrink-0 self-start sm:self-center px-2 py-1 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 transition-all ${activeTooltip === idx ? 'bg-[#48c1d2] text-[#142d53]' : 'bg-slate-200/50 text-slate-500 group-hover:bg-[#142d53] group-hover:text-white'}`}>
                                  <HelpCircle size={10} /> 
                                  <span className="hidden md:inline">{activeTooltip === idx ? 'CERRAR' : '¿CÓMO GRABARLO?'}</span>
                                  <span className="md:hidden">{activeTooltip === idx ? 'CERRAR' : 'TOCA PARA VER'}</span>
                                </div>
                              </div>
                              
                              {activePhase === 'humano' && !activeTooltip && (
                                <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.objetivo}</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Tooltip Detallado (Phase Humano) */}
                          {activeTooltip === idx && activePhase === 'humano' && (
                            <div className="mt-6 w-full space-y-3 animate-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
                              <div className="grid grid-cols-1 gap-3">
                                  {/* Objetivo */}
                                  <div className="bg-white p-4 rounded-2xl border-l-4 border-[#48c1d2] shadow-sm">
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-[0.2em]">Objetivo Táctico</span>
                                    </div>
                                    <p className="text-[12px] font-bold text-[#142d53] leading-relaxed">{item.objetivo}</p>
                                  </div>
                                  
                                  {/* Grabación */}
                                  <div className="bg-slate-50/80 p-4 rounded-2xl border-l-4 border-[#142d53] shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Smartphone size={14} className="text-[#142d53]" />
                                      <span className="text-[8px] font-black text-[#142d53] uppercase tracking-[0.2em]">Guía de Grabación</span>
                                    </div>
                                    <p className="text-[12px] font-bold text-slate-700 leading-relaxed mb-3">{item.grabar}</p>
                                    
                                    {(item.ejemplos || item.detalles) && (
                                      <div className="flex flex-wrap gap-1.5 pt-1">
                                        {item.ejemplos?.map((ej: string, i: number) => (
                                          <span key={i} className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[8px] font-black text-[#48c1d2] uppercase">{ej}</span>
                                        ))}
                                        {item.detalles?.map((det: string, i: number) => (
                                          <span key={i} className="px-2 py-1 bg-white border border-red-100 rounded-lg text-[8px] font-black text-red-500 uppercase">Aviso: {det}</span>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Narración */}
                                  <div className="bg-white p-4 rounded-2xl border-l-4 border-[#48c1d2] shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Mic size={14} className="text-[#48c1d2]" />
                                      <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-[0.2em]">Guía de Narración</span>
                                    </div>
                                    <p className="text-[12px] font-bold text-[#142d53] leading-relaxed mb-4">{item.narrar}</p>
                                    
                                    {item.demo && (
                                      <div className="bg-[#142d53]/5 p-4 rounded-xl border border-[#142d53]/10 relative group/demo transition-all hover:bg-[#142d53]/10">
                                        <div className="absolute -top-2 left-4 bg-[#142d53] text-white px-3 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest">Ejemplo de guion</div>
                                        <p className="text-[11px] font-medium text-[#142d53] italic leading-relaxed pt-1">"{item.demo}"</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Duración/Reglas */}
                                  {(item.duracion || item.regla) && (
                                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                      {item.duracion && (
                                        <div className="flex items-center gap-2 text-[#142d53]/60">
                                          <Clock size={12} />
                                          <span className="text-[9px] font-black uppercase tracking-wider">{item.duracion}</span>
                                        </div>
                                      )}
                                      {item.regla && (
                                        <div className="bg-red-50 px-4 py-2 rounded-full border border-red-100 flex items-center gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                          <span className="text-[9px] font-black text-red-600 uppercase tracking-wider">{item.regla}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          )}

                          {/* Tooltip Detallado (Original Phases) */}
                          {activeTooltip === idx && activePhase !== 'humano' && item.tooltip && (
                            <div className="mt-4 p-4 bg-[#142d53] text-white rounded-xl text-[10px] font-medium leading-relaxed animate-in zoom-in-95 duration-200 shadow-2xl relative border border-white/10 whitespace-pre-line w-full" onClick={(e) => e.stopPropagation()}>
                              <div className="absolute -top-2 left-6 w-4 h-4 bg-[#142d53] rotate-45 border-l border-t border-white/10"></div>
                              <span className="text-[#48c1d2] font-black uppercase block mb-1">Instrucción Táctica:</span>
                              {item.tooltip}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
          
          {/* 📂 ACORDEONES DE CALIDAD (Movidos FUERA del loop para evitar redundancia "infinita") */}
          <div className="mt-12 space-y-4 pt-10 border-t-2 border-slate-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#48c1d2]/10 flex items-center justify-center text-[#48c1d2]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#142d53] tracking-tighter">Protocolos de Calidad Globales</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reglas maestras para todo el contenido</p>
                </div>
              </div>
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                Aplica para: Todas las Fases
              </p>
            </div>

            {/* ACORDEÓN: REGLAS TÁCTICAS */}
            <div className="space-y-2">
              <button 
                onClick={() => setExpandedProtocol(expandedProtocol === 'reglas' ? null : 'reglas')}
                className={`w-full flex items-center justify-between p-5 rounded-[2rem] border transition-all ${expandedProtocol === 'reglas' ? 'bg-[#142d53] border-transparent shadow-xl' : 'bg-white border-slate-100 hover:border-[#48c1d2]/30 shadow-sm'}`}
              >
                <div className="flex-1 min-w-0 flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${expandedProtocol === 'reglas' ? 'bg-[#48c1d2] border-white/10 text-[#142d53]' : 'bg-[#48c1d2]/5 border-[#48c1d2]/10 text-[#48c1d2]'}`}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="text-left min-w-0">
                    <h4 className={`text-base font-black tracking-tight leading-tight whitespace-normal ${expandedProtocol === 'reglas' ? 'text-white' : 'text-[#142d53]'}`}>Guía de estilo: Así sí / Evitar</h4>
                    <p className={`text-[8px] font-black uppercase tracking-widest opacity-60 ${expandedProtocol === 'reglas' ? 'text-[#48c1d2]' : 'text-slate-400'}`}>Protocolo visual básico</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className={`text-[8px] font-black uppercase tracking-widest ${expandedProtocol === 'reglas' ? 'text-[#48c1d2]' : 'text-slate-300'}`}>
                    {expandedProtocol === 'reglas' ? 'Cerrar' : 'Toca para abrir'}
                  </span>
                  <div className={`${expandedProtocol === 'reglas' ? 'text-[#48c1d2]' : 'text-slate-300'}`}>
                    {expandedProtocol === 'reglas' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
              </button>

              {expandedProtocol === 'reglas' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in zoom-in-95 duration-300 mt-2">
                  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-[#48c1d2]/20 flex items-center justify-center text-[#48c1d2]">
                        <CheckCircle2 size={12} />
                      </div>
                      <h4 className="text-xs font-black text-[#142d53] uppercase tracking-widest">Lo que genera impacto (Así sí)</h4>
                    </div>
                    <ul className="grid grid-cols-1 gap-2.5">
                      {(staticManual.fases.find(f => f.id === 'protocolo')?.secciones as any)?.si.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:border-[#48c1d2]/30 group/item">
                          <div className="mt-0.5 text-[#48c1d2] opacity-40 group-hover/item:opacity-100 transition-opacity">
                            <CheckCircle2 size={12} />
                          </div>
                          <span className="text-[11px] font-bold text-[#142d53] leading-tight uppercase tracking-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
 
                  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-lg space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                        <XCircle size={12} />
                      </div>
                      <h4 className="text-xs font-black text-[#142d53] uppercase tracking-widest">Lo que daña el video (Evitar)</h4>
                    </div>
                    <ul className="grid grid-cols-1 gap-2.5">
                      {(staticManual.fases.find(f => f.id === 'protocolo')?.secciones as any)?.no.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 bg-red-50/20 p-3.5 rounded-2xl border border-red-100/20 transition-all hover:bg-white hover:border-red-200 group/item">
                          <div className="mt-0.5 text-red-300 group-hover/item:text-red-500 transition-colors">
                            <Ban size={12} />
                          </div>
                          <span className="text-[11px] font-bold text-slate-500 leading-tight uppercase tracking-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="bg-[#48c1d2]/10 p-1 rounded-lg text-[#48c1d2]">
              <AlertCircle size={12} />
            </div>
            <p className="text-[10px] font-bold text-[#142d53] uppercase tracking-tight">
              Tip: Clips de 5 segundos máximo para dinamismo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
