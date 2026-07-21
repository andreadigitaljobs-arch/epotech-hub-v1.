"use client";
// Refined Narrative Workflow & Brand Colors Alignment

import { useState, useEffect, useRef, Suspense } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import { useThemeColor } from "@/components/layout/ThemeColorHandler";
import { supabase } from "@/lib/supabase";
import Tesseract from 'tesseract.js';
import { motion, AnimatePresence } from "framer-motion";
import {
  Clapperboard,
  Calendar,
  X,
  AlertCircle,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft, Clock,
  Circle,
  History,
  User,
  Users,
  Video,
  Mic,
  BookOpen,
  Library,
  ClipboardCheck,
  Zap,
  MapPin,
  Trash2,
  CalendarDays,
  Plus,
  Filter,
  Eye,
  Camera,
  PlayCircle,
  FileVideo,
  Layout,
  Star,
  Settings,
  MoreVertical,
  Check,
  ChevronUp,
  Search,
  MessageSquare,
  MessageCircle,
  Share2,
  Download,
  WifiOff,
  CheckCircle,
  Clock3,
  CalendarRange,
  Target,
  Smartphone,
  Globe,
  Bell,
  Heart,
  Lightbulb,
  Trophy,
  Coffee,
  Sun,
  Moon,
  Cloud,
  Droplets,
  Wind,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Home,
  Database,
  Briefcase,
  TrendingUp,
  PauseCircle,
  Play,
  Pause,
  Volume2,
  Square,
  Edit3,
  UserCheck,
  Compass,
  GripVertical,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown
} from "lucide-react";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ScriptText } from "@/components/ui/ScriptText";
import { guiones, guionesPresentacion, Script, PILARES_INFO, type PilarContenido } from "@/data/scripts";

const PILAR_COLORS: Record<PilarContenido, string> = {
  Transformaciones: "#34d399",
  Errores:          "#fb7185",
  Herramientas:     "#60a5fa",
  Proceso:          "#a78bfa",
  Experiencia:      "#fbbf24",
};
import { mergeBlobsToWav } from "./audioUtils";
import { Card } from "@/components/ui/Card";
import { manual as staticManual } from "@/data/manual";

// --- FUNCIÓN GLOBAL PARA FORZAR DESCARGA EN MÓVIL ---
const forceDownload = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename.endsWith('.wav') ? filename : `${filename}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Error al forzar descarga:", err);
    window.open(url, '_blank');
  }
};

// --- INDEXED DB PARA AUTO-GUARDADO DE AUDIOS (ANTI-RELOAD) ---
const DB_NAME = 'EpotechAudioDB';
const STORE_NAME = 'drafts';

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e: any) => {
      e.target.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = (e: any) => resolve(e.target.result);
    request.onerror = (e) => reject(e);
  });
};

const saveDraftAudio = async (blob: Blob, duration: number) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put({ blob, duration }, 'currentDraft');
  } catch (err) {
    console.error("No se pudo guardar el borrador", err);
  }
};

const loadDraftAudio = async (): Promise<{ blob: Blob, duration: number } | null> => {
  try {
    const db = await initDB();
    if (!db.objectStoreNames.contains(STORE_NAME)) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get('currentDraft');
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
};

const deleteDraftAudio = async () => {
  try {
    const db = await initDB();
    if (!db.objectStoreNames.contains(STORE_NAME)) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete('currentDraft');
  } catch (err) { }
};

// --- AUTOGUARDADO DE FRAGMENTOS DE VOZ EN OFF ---
const saveVoiceoverDraft = async (scriptId: string, fragments: { blob: Blob, stepIdx: number }[]) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    // Save without the URL, just Blob and index
    const dataToSave = fragments.map(f => ({ blob: f.blob, stepIdx: f.stepIdx }));
    tx.objectStore(STORE_NAME).put(dataToSave, `voiceover_draft_${scriptId}`);
  } catch (err) {
    console.error("No se pudo guardar borrador de locución", err);
  }
};

const loadVoiceoverDraft = async (scriptId: string): Promise<{ blob: Blob, stepIdx: number }[] | null> => {
  try {
    const db = await initDB();
    if (!db.objectStoreNames.contains(STORE_NAME)) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const request = tx.objectStore(STORE_NAME).get(`voiceover_draft_${scriptId}`);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (err) {
    return null;
  }
};

const deleteVoiceoverDraft = async (scriptId: string) => {
  try {
    const db = await initDB();
    if (!db.objectStoreNames.contains(STORE_NAME)) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(`voiceover_draft_${scriptId}`);
  } catch (err) { }
};
// -------------------------------------------------------------

const CustomAudioPlayer = ({ src, title = "Reporte de Audio", light = false }: { src: string, title?: string, light?: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    if (src) {
      const audio = new Audio(src);
      audio.onloadedmetadata = () => {
        setDuration(audio.duration);
      };
      audio.onended = () => {
        setIsPlaying(false);
        setProgress(100);
        setCurrentTime(audio.duration);
      };
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setProgress((audio.currentTime / audio.duration) * 100);
          setCurrentTime(audio.currentTime);
        }
      };
      audioRef.current = audio;
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [src]);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: [#48c1d2];
          cursor: pointer;
          box-shadow: 0 0 10px rgba(72,193,210,0.5);
        }
      `}} />
      <div className={`w-full flex flex-col p-4 rounded-[2rem] border shadow-inner gap-4 ${light ? 'bg-[#142d53]/15 border-[#142d53]/15' : 'bg-[#142d53] border-white/10'}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleAudio}
              className="w-12 h-12 shrink-0 rounded-full bg-[#48c1d2] text-[#0a192f] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(72,193,210,0.3)]"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            <div className="flex flex-col text-left overflow-hidden">
              <span className={`text-[10px] font-black uppercase tracking-[2px] ${light ? 'text-[#142d53]/50' : 'text-white/50'}`}>{title}</span>
              <span className={`text-[11px] font-black uppercase tracking-widest truncate ${isPlaying ? 'text-[#48c1d2] animate-pulse' : light ? 'text-[#142d53]' : 'text-white'}`}>
                {isPlaying ? 'Reproduciendo...' : 'Listo para oír'}
              </span>
            </div>
          </div>

          <div className="flex gap-[3px] items-end h-6 shrink-0 opacity-80 mr-2">
            <div className={`w-1.5 bg-[#48c1d2] rounded-full transition-all ${isPlaying ? 'animate-[bounce_1s_infinite] h-full' : 'h-2'}`}></div>
            <div className={`w-1.5 bg-[#48c1d2] rounded-full transition-all ${isPlaying ? 'animate-[bounce_0.8s_infinite] h-4' : 'h-2'}`}></div>
            <div className={`w-1.5 bg-[#48c1d2] rounded-full transition-all ${isPlaying ? 'animate-[bounce_1.2s_infinite] h-5' : 'h-2'}`}></div>
            <div className={`w-1.5 bg-[#48c1d2] rounded-full transition-all ${isPlaying ? 'animate-[bounce_0.9s_infinite] h-3' : 'h-2'}`}></div>
          </div>
        </div>

        <div className="w-full px-2 flex flex-col gap-2">
          <div className="flex justify-between items-center px-1 mb-[-4px]">
            <span className="text-[9px] font-black text-[#48c1d2] tracking-wider">{formatTime(currentTime)}</span>
            <span className={`text-[9px] font-bold tracking-wider ${light ? 'text-[#142d53]/40' : 'text-white/40'}`}>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setProgress(val);
              if (audioRef.current && audioRef.current.duration) {
                const newTime = (val / 100) * audioRef.current.duration;
                audioRef.current.currentTime = newTime;
                setCurrentTime(newTime);
              }
            }}
            className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer custom-slider outline-none ${light ? 'bg-[#142d53]/10' : 'bg-white/10'}`}
            style={{
              background: `linear-gradient(to right, #48c1d2 ${progress}%, ${light ? 'rgba(20,45,83,0.1)' : 'rgba(255,255,255,0.1)'} ${progress}%)`
            }}
          />
        </div>
      </div>
    </>
  );
};

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const ConfirmationDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmText, 
  onConfirm, 
  onCancel 
}: { 
  isOpen: boolean, 
  title: string, 
  message: string, 
  confirmText: string, 
  onConfirm: () => void, 
  onCancel: () => void 
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return createPortal(
    <div className={`fixed inset-0 z-[20001] flex items-center justify-center p-4 bg-[#0a192f]/80 backdrop-blur-md overflow-y-auto transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in'}`}>
      <div className={`bg-white rounded-[2rem] md:rounded-[3rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto transition-all duration-300 ${isClosing ? 'scale-95 opacity-0 translate-y-10' : 'scale-100 opacity-100 translate-y-0 animate-in zoom-in-95'}`}>
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-black text-[#142d53] text-center mb-2 uppercase tracking-tight">{title}</h3>
        <p className="text-sm font-medium text-slate-500 text-center mb-8 leading-relaxed">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onConfirm(); }}
            className="w-full py-4 bg-red-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
          >
            {confirmText}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onCancel(); }}
            className="w-full py-4 bg-slate-100 text-slate-400 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const MISIONES = [
  {
    id: 'vozoff',
    title: "🎙️ Grabar Guiones",
    desc: "Estudio interactivo para grabar tu voz sobre los guiones que el equipo ya ha preparado.",
    icon: Mic,
    tag: "Guiones",
    tab: 'guiones',
    sub: 'reels',
    colorClasses: { bg: 'bg-purple-500', bgLight: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/30', hoverBorder: 'group-hover:border-purple-500/40' }
  },
  {
    id: 'checklist',
    title: "📷 ¿Qué grabar cuando voy a hacer un trabajo?",
    desc: "Instrucciones paso a paso sobre qué videos capturar antes, durante y después de un trabajo.",
    icon: ClipboardCheck,
    tag: "Checklist",
    tab: 'guiones',
    sub: 'checklist',
    colorClasses: { bg: 'bg-sky-500', bgLight: 'bg-sky-500/10', text: 'text-sky-600', border: 'border-sky-500/30', hoverBorder: 'group-hover:border-sky-500/40' }
  },
  {
    id: 'narracion',
    title: "🗣️ Reportar Día de Trabajo",
    desc: "Envía un audio corto describiendo tus tareas de hoy para que podamos crear nuevos guiones.",
    icon: MessageSquare,
    tag: "Reporte",
    tab: 'guiones',
    sub: 'checklist',
    colorClasses: { bg: 'bg-blue-600', bgLight: 'bg-blue-600/10', text: 'text-blue-600', border: 'border-blue-600/30', hoverBorder: 'group-hover:border-blue-600/40' }
  },
  {
    id: 'historias',
    title: "🚗 Guía de Videos para Historias",
    desc: "Ideas rápidas y fáciles para grabar contenido informal en tu día a día (rutas, equipo, pausas).",
    icon: Users,
    tag: "Historias",
    tab: 'guiones',
    sub: 'historias',
    colorClasses: { bg: 'bg-orange-500', bgLight: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/30', hoverBorder: 'group-hover:border-orange-500/40' }
  },
  {
    id: 'pro',
    title: "🎥 Grabación Hablando a Cámara",
    desc: "Guías avanzadas para grabarte a ti mismo explicando procesos o mostrando resultados finales.",
    icon: Video,
    tag: "A Cámara",
    tab: 'guiones',
    sub: 'presentacion',
    colorClasses: { bg: 'bg-emerald-500', bgLight: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/30', hoverBorder: 'group-hover:border-emerald-500/40' }
  },
  {
    id: 'historial',
    title: "📂 Historial de Contenido",
    desc: "Accede al registro completo y archivo de todos tus audios, guiones aprobados e ideas del pasado.",
    icon: History,
    tag: "Historial",
    tab: 'historial',
    sub: 'reels',
    colorClasses: { bg: 'bg-slate-600', bgLight: 'bg-slate-600/10', text: 'text-slate-600', border: 'border-slate-600/30', hoverBorder: 'group-hover:border-slate-600/40' }
  }
];

export default function ContenidoPage() {
  useThemeColor("#F0F4F8");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || 'presion';

  const [activeMision, setActiveMision] = useState<string | null>(null);
  const [showMissionModal, setShowMissionModal] = useState<boolean>(false);

  // Estados de Entrenamiento (Onboarding)
  const [onboardingDone, setOnboardingDone] = useState<boolean>(false);
  const [onboardingProgress, setOnboardingProgress] = useState<{ voiceDone: boolean, reportDone: boolean }>({ voiceDone: false, reportDone: false });
  const [isOnboardingTour, setIsOnboardingTour] = useState<boolean>(false);
  const [tourStep, setTourStep] = useState<number>(0); // 1 = Voz en off, 2 = Reporte
  const [tourSubStep, setTourSubStep] = useState<number>(0);
  const [onboardingSuccessModal, setOnboardingSuccessModal] = useState<{ isOpen: boolean, type: 'voice' | 'report' }>({ isOpen: false, type: 'voice' });
  const [streakDays, setStreakDays] = useState<number>(1);

  // Cargar progreso del Onboarding al montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDone = localStorage.getItem('epotech_onboarding_done') === 'true';
      setOnboardingDone(isDone);
      
      const savedProgress = localStorage.getItem('epotech_onboarding_progress');
      if (savedProgress) {
        try {
          setOnboardingProgress(JSON.parse(savedProgress));
        } catch (e) {
          console.error(e);
        }
      }
      // --- Lógica de Racha Diaria ---
      const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
      const lastVisit = localStorage.getItem('epotech_last_visit');
      const savedStreak = parseInt(localStorage.getItem('epotech_streak') || '1', 10);

      if (!lastVisit) {
        // Primera visita
        localStorage.setItem('epotech_last_visit', today);
        localStorage.setItem('epotech_streak', '1');
        setStreakDays(1);
      } else if (lastVisit === today) {
        // Ya visitó hoy, mantener racha
        setStreakDays(savedStreak);
      } else {
        const last = new Date(lastVisit);
        const now = new Date(today);
        const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          // Visitó ayer → racha sube
          const newStreak = savedStreak + 1;
          localStorage.setItem('epotech_streak', String(newStreak));
          localStorage.setItem('epotech_last_visit', today);
          setStreakDays(newStreak);
        } else {
          // Saltó un día → resetear
          localStorage.setItem('epotech_streak', '1');
          localStorage.setItem('epotech_last_visit', today);
          setStreakDays(1);
        }
      }
    }
  }, []);


  const updateOnboardingProgress = (key: 'voiceDone' | 'reportDone', val: boolean) => {
    setOnboardingProgress(prev => {
      const newProg = { ...prev, [key]: val };
      localStorage.setItem('epotech_onboarding_progress', JSON.stringify(newProg));
      
      if (newProg.voiceDone && newProg.reportDone) {
        setOnboardingDone(true);
        localStorage.setItem('epotech_onboarding_done', 'true');
        setIsOnboardingTour(false);
        setTourStep(0);
        setTourSubStep(0);
        showToast("🎉 ¡Entrenamiento completado! Tu Hub de Contenido está 100% activo.", "success");
      }
      return newProg;
    });
  };

  const handleSelectMision = (misionId: string | null) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (misionId === 'narracion') {
      setActiveMision('checklist');
      localStorage.setItem('epotech_active_mision', 'checklist');
      setActiveTab('guiones');
      localStorage.setItem('epotech_production_tab', 'guiones');
      setGuionTab('checklist');
      localStorage.setItem('epotech_guion_tab', 'checklist');
      setShowAudioReport(true);
      setReportHelpStep(1);
    } else if (misionId) {
      setActiveMision(misionId);
      localStorage.setItem('epotech_active_mision', misionId);
      const mision = MISIONES.find(m => m.id === misionId);
      if (mision) {
        setActiveTab(mision.tab);
        localStorage.setItem('epotech_production_tab', mision.tab);
        if (mision.tab === 'guiones') {
          setGuionTab(mision.sub as any);
          localStorage.setItem('epotech_guion_tab', mision.sub);
        }
      }
    } else {
      setActiveMision(null);
      localStorage.removeItem('epotech_active_mision');
      // Reset activeTab back to 'guiones' to avoid showing the history section under the menu
      setActiveTab('guiones');
      localStorage.setItem('epotech_production_tab', 'guiones');
      // Clear URL search params without page reload
      router.replace(window.location.pathname, { scroll: false });
    }
  };

  const [grabados, setGrabados] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchGrabados = () =>
      supabase.from('grabados').select('script_id').then(({ data }) => {
        if (data) setGrabados(new Set(data.map((r: any) => r.script_id)));
      });

    fetchGrabados();

    const channel = supabase
      .channel('grabados-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'grabados' }, fetchGrabados)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const toggleGrabado = async (_e: any, scriptId: string) => {
    const isGrabado = grabados.has(scriptId);
    setGrabados(prev => {
      const next = new Set(prev);
      isGrabado ? next.delete(scriptId) : next.add(scriptId);
      return next;
    });
    if (isGrabado) {
      await supabase.from('grabados').delete().eq('script_id', scriptId);
    } else {
      await supabase.from('grabados').upsert({ script_id: scriptId });
    }
  };

  const [ordenGuiones, setOrdenGuiones] = useState<string[]>([]);
  const [modoReorden, setModoReorden] = useState(false);

  useEffect(() => {
    supabase.from('configuracion').select('valor').eq('clave', 'orden_guiones').single().then(({ data }) => {
      if (data?.valor) setOrdenGuiones(data.valor as string[]);
    });
  }, []);

  // Mueve dentro de su sección (sectionIds = IDs ya ordenados de esa sección)
  const moverScript = async (scriptId: string, dir: 'up' | 'down' | 'top' | 'bottom', sectionIds: string[]) => {
    const allIds = guiones.filter(s => s.category.toUpperCase() !== 'PLANTILLA DE ENTRENAMIENTO').map(s => s.id);
    const fullOrdered = [
      ...ordenGuiones.filter(id => allIds.includes(id)),
      ...allIds.filter(id => !ordenGuiones.includes(id)),
    ];
    const secIdx = sectionIds.indexOf(scriptId);
    if (secIdx === -1) return;
    const newSection = [...sectionIds];
    newSection.splice(secIdx, 1);
    if (dir === 'up')     newSection.splice(Math.max(0, secIdx - 1), 0, scriptId);
    else if (dir === 'down')   newSection.splice(Math.min(newSection.length, secIdx + 1), 0, scriptId);
    else if (dir === 'top')    newSection.unshift(scriptId);
    else                        newSection.push(scriptId);
    // Reconstruir el orden global reemplazando solo los IDs de esta sección
    const newFull: string[] = [];
    let inserted = false;
    for (const id of fullOrdered) {
      if (sectionIds.includes(id)) {
        if (!inserted) { newFull.push(...newSection); inserted = true; }
      } else {
        newFull.push(id);
      }
    }
    if (!inserted) newFull.push(...newSection);
    setOrdenGuiones(newFull);
    await supabase.from('configuracion').upsert({ clave: 'orden_guiones', valor: newFull });
  };

  const [activeTab, setActiveTab] = useState('guiones');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirmar',
    onConfirm: () => {}
  });

  const requestConfirm = (title: string, message: string, onConfirm: () => void, confirmText = 'ELIMINAR') => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmText,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };
  const [guionTab, setGuionTab] = useState<'reels' | 'historias' | 'checklist' | 'presentacion'>('reels');

  // --- ESTADOS INTEGRADOS DEL CHECKLIST DE OBRA ---
  const [checklistActivePhase, setChecklistActivePhase] = useState("antes");
  const [checklistActiveTooltip, setChecklistActiveTooltip] = useState<number | null>(null);
  const [checklistExpandedProtocol, setChecklistExpandedProtocol] = useState<string | null>("reglas");
  const [checklistData, setChecklistData] = useState<any>(() => {
    const fasesInyectadas = staticManual.fases.map((fase: any) => {
      let itemsFinales = [...fase.items];
      
      // 1. CÓMO PREPARAR EL CELULAR (Antes)
      if (fase.id === 'antes') {
        const hasTecnica = itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('CELULAR'));
        if (!hasTecnica) {
          itemsFinales = [
            {
              en: "⚙️ HOW TO SETUP YOUR PHONE",
              es: "⚙️ CÓMO PREPARAR EL CELULAR",
              tooltip: "Asegúrate de que todo esté bien antes de empezar:\n\n• Calidad: Configura tu cámara en 4K a 60 fps o 1080 a 60 fps\n• Posición: Graba con el celular parado (vertical)\n• Luz: Trata de que el sol te dé de frente, no por detrás\n• Lente: Limpia la cámara con un paño limpio antes de grabar\n• Audio: Acércate al celular si vas a hablar para que se escuche bien"
            },
            ...itemsFinales
          ];
        }
      }
      
      // 2. OPTIMIZACIONES DURANTE
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

        if (!itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('CLIPS CORTOS'))) {
          itemsFinales.push({
            en: "DETAILS AND SHORT CLIPS (5-10 SEC)",
            es: "DETALLES Y CLIPS CORTOS (5-10 SEG)",
            tooltip: "Necesitas MUCHOS clips cortos para que el video no sea aburrido. Graba mínimo 8-10 de estos:\n\n• Manchas/suciedad desapareciendo\n• Contraste agua sucia vs limpia\n• Presión del agua en acción\n• Texturas (antes vs después)\n• Expresión/técnica de Sebastián\n• Herramientas en detalle\n• Obstáculos siendo resueltos\n• Transformación visible"
          });
        }

        if (!itemsFinales.some((item: any) => (typeof item === 'string' ? item : item.es).includes('JENKRYFER'))) {
          itemsFinales.push({
            en: "JENKRYFER / ASSISTANT",
            es: "JENKRYFER / ASISTENTE",
            tooltip: "No es solo Sebastián, es un equipo. Si Jenkryfer o alguien está ayudando, graba:\n\n• Videos de ella montando herramientas\n• Videos de ella pasando accesorios\n• Videos de ella documentando (foto/video)\n• Videos de ambos trabajando en el mismo frame\n\nEsto humaniza todo y muestra equipo."
          });
        }

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

    return {
      regla_oro: staticManual.regla.ruleEs,
      haz_list: staticManual.comoGrabar.haz.map((h: any) => h.es),
      evita_list: staticManual.comoGrabar.evita.map((e: any) => e.es),
      fases: fasesInyectadas
    };
  });
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [activeFormat, setActiveFormat] = useState<string>('Todos');
  const [serviceType, setServiceType] = useState(typeParam);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(0.85);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  
  // Detector de Conexión
  useEffect(() => {
    setMounted(true);
    setIsOffline(typeof navigator !== 'undefined' ? !navigator.onLine : false);

    const handleOnline = () => { setIsOffline(false); showToast("Conexión recuperada", "success"); };
    const handleOffline = () => { setIsOffline(true); showToast("Modo Offline activado", "info"); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-mostrar selector de misiones si no hay misión activa al montar
  useEffect(() => {
    if (mounted && !activeMision && activeTab !== 'historial') {
      const savedTab = localStorage.getItem('epotech_production_tab');
      if (savedTab !== 'historial') {
        setShowMissionModal(true);
      }
    }
  }, [mounted, activeMision, activeTab]);

  
  // NUEVOS ESTADOS: Búsqueda y Organización
  const [scriptSearchQuery, setScriptSearchQuery] = useState("");
  const [scriptFilter, setScriptFilter] = useState<'todos' | 'grabados' | 'pendientes'>('todos');
  const [selectedWeek, setSelectedWeek] = useState<string>("");
  const [selectedSerie, setSelectedSerie] = useState<any>(null);
  const [isClosingSerie, setIsClosingSerie] = useState(false);

  const normalizeText = (text: string) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Función para agrupar guiones por semana
  const groupScriptsByWeek = (scripts: Script[]) => {
    const groups: { [key: string]: Script[] } = {};
    const sorted = [...scripts].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA; // Más recientes primero
    });

    sorted.forEach(script => {
      const date = script.createdAt ? new Date(script.createdAt) : new Date();
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let key = "";
      if (diffDays <= 7) key = "Esta Semana";
      else if (diffDays <= 14) key = "Semana Pasada";
      else {
        const month = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
        key = month.charAt(0).toUpperCase() + month.slice(1);
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(script);
    });
    return groups;
  };

  const handleSpeak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking || window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      setIsSpeaking(true);
      const selection = window.getSelection()?.toString().trim();
      const textToRead = selection ? selection : text;
      
      const cleanText = textToRead.replace(/[“”]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'es-ES';
      utterance.rate = voiceSpeed; 
      
      const voices = window.speechSynthesis.getVoices();
      let esVoice = voices.find(v => v.lang.startsWith('es-') && (v.name.includes('Premium') || v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Monica') || v.name.includes('Paulina') || v.name.includes('Jorge') || v.name.includes('Helena')));
      if (!esVoice) esVoice = voices.find(v => v.lang.startsWith('es-'));
      if (esVoice) utterance.voice = esVoice;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const [toast, setToast] = useState<{ message: string, type: ToastType, isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  // Memoria de Pestana e Inteligencia de URL
  useEffect(() => {
    const tabParam = searchParams.get('tab') || (searchParams.get('sub') ? 'guiones' : null);
    const subTabParam = searchParams.get('sub');
    
    // Check if there is an active mission in localStorage
    const savedMision = localStorage.getItem('epotech_active_mision');
    const isOnboardingComplete = localStorage.getItem('epotech_onboarding_done') === 'true';
    
    if (tabParam) {
      setActiveTab(tabParam);
      if (tabParam === 'historial') {
        setActiveMision('historial');
        localStorage.setItem('epotech_active_mision', 'historial');
      } else if (tabParam === 'guiones' && subTabParam) {
        setGuionTab(subTabParam as any);
        const matched = MISIONES.find(m => m.tab === tabParam && m.sub === subTabParam);
        if (matched) {
          setActiveMision(matched.id);
          localStorage.setItem('epotech_active_mision', matched.id);
        }
      }
    } else {
      // Restaurar la mision activa guardada si existe, de lo contrario empezar sin ella
      if (savedMision) {
        setActiveMision(savedMision);
      } else {
        setActiveMision(null);
      }
    }

    if (!tabParam) {
      const savedTab = localStorage.getItem('epotech_production_tab');
      if (savedTab) {
        setActiveTab(savedTab);
        if (savedTab === 'historial') {
          setActiveMision('historial');
          localStorage.setItem('epotech_active_mision', 'historial');
        }
      }
    }

    if (subTabParam) {
      setGuionTab(subTabParam as any);
    } else if (!tabParam) {
      const savedSubTab = localStorage.getItem('epotech_guion_tab');
      if (savedSubTab) setGuionTab(savedSubTab as any);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    localStorage.setItem('epotech_production_tab', tabId);
    
    // Actualizar URL sin recargar para mantener consistencia
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    params.set('tab', tabId);
    router.replace(`?${params.toString()}`, { scroll: false });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuionTabChange = (tabId: 'reels' | 'historias' | 'checklist' | 'presentacion') => {
    setGuionTab(tabId);
    setSelectedWeek("");
    localStorage.setItem('epotech_guion_tab', tabId);
    
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    params.set('sub', tabId);
    router.replace(`?${params.toString()}`, { scroll: false });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseStory = () => {
    setIsClosingStory(true);
    setTimeout(() => {
      setSelectedStory(null);
      setIsClosingStory(false);
    }, 500);
  };

  const filteredGuiones = guiones.filter(g =>
    (activeCategory === 'Todas' || g.service === activeCategory) &&
    (activeFormat === 'Todos' || g.category === activeFormat)
  );

  const historiasSituacionales = [
    {
      id: 'h1',
      title: 'Buenos Días Familia ☀️',
      mood: 'Humano y Auténtico',
      color: '#48c1d2',
      icon: Sun,
      sequence: [
        {
          title: 'Historia 1: El Saludo',
          desc: 'Vídeo corto grabándote al despertar o ya en la camioneta.',
          script: '¡Buenos días familia! Ya activados por aquí, preparándonos para un gran día en Utah. ¿Cómo amanecieron ustedes?',
          tips: 'No necesitas filtro, la luz de la mañana es la mejor.'
        },
        {
          title: 'Historia 2: El Desayuno',
          desc: 'Foto de tu café, tu desayuno o tú comiendo algo rápido.',
          script: 'Cargando energías para lo que viene hoy. Sin un buen café no somos nadie, ¿verdad?',
          tips: 'Pon un sticker de hora o de "Buenos Días".'
        }
      ]
    },
    {
      id: 'h2',
      title: 'En Ruta al Trabajo 🚛',
      mood: 'Energía y Acción',
      color: '#fbbf24',
      icon: MapPin,
      sequence: [
        {
          title: 'Historia 1: El Destino',
          desc: 'Foto de tu mano en el volante o el paisaje desde el parabrisas.',
          script: 'Hoy nos movemos a [Lugar, ej: Park City] a dejar unas ventanas impecables. ¡El clima está perfecto para trabajar!',
          tips: 'Usa el sticker de ubicación de Instagram.'
        },
        {
          title: 'Historia 2: Llegada',
          desc: 'Vídeo rápido bajando de la camioneta o mostrando la casa/driveway.',
          script: 'Ya llegamos. Miren esta vista... pero miren este driveway, ¡necesita un rescate Epotech urgente!',
          tips: 'Muestra un "Antes" rápido de la suciedad.'
        }
      ]
    },
    {
      id: 'h3',
      title: 'Cualquier Cosa es Historia 📸',
      mood: 'Educativo y Cercano',
      color: '#10b981',
      icon: Camera,
      sequence: [
        {
          title: 'Historia 1: Tu Perspectiva',
          desc: 'Foto de algo que te llame la atención en el trabajo (una herramienta, un reflejo).',
          script: 'A veces me detengo a ver estos detalles. La limpieza no es solo pasar agua, es cuidar cada rincón.',
          tips: 'Cualquier cosa que tú veas normal, para el cliente es interesante.'
        },
        {
          title: 'Historia 2: El Equipo',
          desc: 'Foto de tus herramientas organizadas o tú preparándolas.',
          script: 'Herramientas listas. Un profesional se nota en cómo cuida su equipo.',
          tips: 'La organización genera mucha confianza.'
        }
      ]
    },
    {
      id: 'h4',
      title: 'Fuera de Servicio 🏡',
      mood: 'Personal y Real',
      color: '#f87171',
      icon: Heart,
      sequence: [
        {
          title: 'Historia 1: Relax',
          desc: 'Foto saliendo con tu esposa, en el gym o descansando en casa.',
          script: 'Día terminado. Ahora toca lo más importante: tiempo de calidad en familia.',
          tips: 'Esto hace que la gente te sienta como un vecino, no solo como una empresa.'
        },
        {
          title: 'Historia 2: Gratitud',
          desc: 'Tú hablando a cámara relajado.',
          script: 'Gracias a todos por sus mensajes y por confiarme sus hogares hoy. ¡Mañana vamos por más!',
          tips: 'Usa un tono muy natural, como si hablaras con un amigo.'
        }
      ]
    }
  ];

  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const [isClosingStory, setIsClosingStory] = useState(false);
  const [serviceContext, setServiceContext] = useState<'active' | 'brand'>('active');
  const [productionMode, setProductionMode] = useState<'historias' | 'biblioteca' | 'manual'>('historias');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [showAudioReport, setShowAudioReport] = useState(false);
  const [reportSentSuccessfully, setReportSentSuccessfully] = useState(false);

  const [enCamaraSubTab, setEnCamaraSubTab] = useState<'pinned' | 'pro' | 'series'>('pinned');
  const [showFullScript, setShowFullScript] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isClosingAudioReport, setIsClosingAudioReport] = useState(false);
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // --- GRABADORA 2: VOZ EN OFF POR FRAGMENTOS ---
  const [voiceoverFragments, setVoiceoverFragments] = useState<{ blob: Blob, stepIdx: number, url: string }[]>([]);
  const [isRecordingVoiceover, setIsRecordingVoiceover] = useState(false);
  const voiceoverRecorder = useRef<MediaRecorder | null>(null);
  const voiceoverChunks = useRef<Blob[]>([]);
  const stopRecordingResolver = useRef<((value: any) => void) | null>(null);
  const [mergedVoiceoverUrl, setMergedVoiceoverUrl] = useState<string | null>(null);
  const [activeVoiceoverAudio, setActiveVoiceoverAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlayingVoiceover, setIsPlayingVoiceover] = useState(false);
  const [initialHistorialSubTab, setInitialHistorialSubTab] = useState<'stats' | 'audios'>('stats');

  // --- GRABADORA 3: VOZ EN OFF POR ESCENA (GUIONES A CÁMARA) ---
  const [sceneIsRecording, setSceneIsRecording] = useState(false);
  const [sceneRecordedUrl, setSceneRecordedUrl] = useState<string | null>(null);
  const [sceneRecordedBlob, setSceneRecordedBlob] = useState<Blob | null>(null);
  const [sceneRecordTime, setSceneRecordTime] = useState(0);
  const sceneMediaRecorder = useRef<MediaRecorder | null>(null);
  const sceneAudioChunks = useRef<Blob[]>([]);
  const sceneVideoRef = useRef<HTMLDivElement | null>(null);
  const sceneIframeRef = useRef<HTMLIFrameElement | null>(null);
  const [videoAutoplay, setVideoAutoplay] = useState(false);
  const [isUploadingVozCamara, setIsUploadingVozCamara] = useState(false);
  const [vozCamaraSent, setVozCamaraSent] = useState(false);
  const [vocesCamara, setVocesCamara] = useState<any[]>([]);

  // --- CONFIGURACIÓN DE ESCENAS ---
  const [sceneConfig, setSceneConfig] = useState<Record<string, { audio_enabled: boolean; video_url: string | null }>>({});
  const [showSceneConfigPanel, setShowSceneConfigPanel] = useState(false);

  // Sincronizar reactivamente el sub-paso de guía basado en si la toma del paso actual ya fue grabada
  useEffect(() => {
    if (isOnboardingTour && tourStep === 1) {
      const hasFragment = voiceoverFragments.some(f => f.stepIdx === currentStepIdx);
      if (hasFragment) {
        setTourSubStep(3);
      } else {
        if (!isRecordingVoiceover) {
          setTourSubStep(1);
        }
      }
    }
  }, [currentStepIdx, voiceoverFragments, isOnboardingTour, tourStep, isRecordingVoiceover]);




  const toggleVoiceoverPlayback = (url: string) => {
    if (activeVoiceoverAudio && isPlayingVoiceover) {
      activeVoiceoverAudio.pause();
      setIsPlayingVoiceover(false);
    } else {
      if (activeVoiceoverAudio) activeVoiceoverAudio.pause();
      const audio = new Audio(url);
      audio.onended = () => setIsPlayingVoiceover(false);
      setActiveVoiceoverAudio(audio);
      setIsPlayingVoiceover(true);
      audio.play();
    }
  };

  const startVoiceoverRecording = async (targetIdx: number = currentStepIdx) => {
    if (isOnboardingTour && tourStep === 1 && tourSubStep === 1) {
      setTourSubStep(2);
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      voiceoverChunks.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) voiceoverChunks.current.push(e.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(voiceoverChunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setVoiceoverFragments(prev => {
          const filtered = prev.filter(f => f.stepIdx !== targetIdx);
          const updated = [...filtered, { blob: audioBlob, stepIdx: targetIdx, url }];
          if (stopRecordingResolver.current) {
            stopRecordingResolver.current(updated);
            stopRecordingResolver.current = null;
          }
          return updated;
        });
        stream.getTracks().forEach(track => track.stop());
      };
      voiceoverRecorder.current = recorder;
      recorder.start();
      setIsRecordingVoiceover(true);
    } catch (err) {
      console.error(err);
      showToast("Error al acceder al micrófono", "error");
    }
  };

  const stopVoiceoverRecording = () => {
    if (voiceoverRecorder.current && voiceoverRecorder.current.state === "recording") {
      voiceoverRecorder.current.stop();
    }
    setIsRecordingVoiceover(false);
    if (isOnboardingTour && tourStep === 1 && tourSubStep === 2) {
      setTourSubStep(3);
    }
  };

  const deleteVoiceoverFragment = (targetIdx: number) => {
    setVoiceoverFragments(prev => prev.filter(f => f.stepIdx !== targetIdx));
    if (activeVoiceoverAudio) {
      activeVoiceoverAudio.pause();
      setIsPlayingVoiceover(false);
    }
    showToast("Toma eliminada", "info");
  };

  // Efecto para cargar el borrador de locución al abrir un guion
  useEffect(() => {
    if (selectedScript) {
      loadVoiceoverDraft(selectedScript.id).then((draft) => {
        if (draft && draft.length > 0) {
          // Re-create URLs for the blobs
          const fragmentsWithUrls = draft.map(f => ({
            blob: f.blob,
            stepIdx: f.stepIdx,
            url: URL.createObjectURL(f.blob)
          }));
          setVoiceoverFragments(fragmentsWithUrls);
          showToast("Borrador de locución recuperado", "info");
        }
      });
    }
  }, [selectedScript]);

  // Efecto para autoguardar la locución cada vez que cambia
  useEffect(() => {
    if (selectedScript) {
      if (voiceoverFragments.length > 0) {
        saveVoiceoverDraft(selectedScript.id, voiceoverFragments);
      } else {
        // Si no hay fragmentos, borramos el borrador de la memoria permanentemente
        deleteVoiceoverDraft(selectedScript.id);
      }
    }
  }, [voiceoverFragments, selectedScript]);

  const mergeVoiceoverFragments = async () => {
    let currentFragments = voiceoverFragments;

    // Verificar en tiempo real si el grabador del navegador está activo
    if (voiceoverRecorder.current && voiceoverRecorder.current.state === "recording") {
      showToast("Procesando última toma...", "info");
      
      // Detener grabación y esperar a que el callback 'onstop' resuelva con los fragmentos actualizados
      currentFragments = await new Promise<any[]>((resolve) => {
        let resolved = false;
        
        // Timeout de seguridad para evitar que la promesa quede colgada si ocurre un error inesperado
        const safetyTimeout = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            stopRecordingResolver.current = null;
            resolve(voiceoverFragments);
          }
        }, 3000);

        stopRecordingResolver.current = (updatedList) => {
          if (!resolved) {
            resolved = true;
            clearTimeout(safetyTimeout);
            resolve(updatedList);
          }
        };

        stopVoiceoverRecording();
      });
    } else {
      // Truco para obtener los fragmentos más frescos de React si ya no estaba grabando
      currentFragments = await new Promise<any[]>((resolve) => {
        setVoiceoverFragments(prev => {
          resolve(prev);
          return prev;
        });
      });
    }

    if (currentFragments.length === 0) {
      showToast("No has grabado ninguna toma aún", "info");
      return;
    }

    showToast("Fusionando audios en alta calidad...", "info");

    try {
      const sorted = [...currentFragments].sort((a, b) => a.stepIdx - b.stepIdx);
      const blobs = sorted.map(f => f.blob);
      // Usamos el motor de decodificación para armar un solo WAV
      const mergedWavBlob = await mergeBlobsToWav(blobs);
      const mergedUrl = URL.createObjectURL(mergedWavBlob);
      setMergedVoiceoverUrl(mergedUrl);
      showToast("Locución unida con éxito", "success");
      
      // LIMPIAR BORRADOR TRAS UNIR (Ya no es necesario recuperarlo)
      if (selectedScript) {
        deleteVoiceoverDraft(selectedScript.id);
      }
    } catch (err) {
      console.error("Error uniendo fragments", err);
      showToast("Error al unir el audio. Intenta de nuevo.", "error");
    }
  };

  const [contentDB, setContentDB] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [reportHelpStep, setReportHelpStep] = useState(1);
  const [dashHelpStep, setDashHelpStep] = useState(1);
  const [teleHelpStep, setTeleHelpStep] = useState(1);
  const [reportTitle, setReportTitle] = useState('');
  const [locucionTitle, setLocucionTitle] = useState('');

  // Recuperar borrador al cargar la app
  useEffect(() => {
    loadDraftAudio().then((draft) => {
      if (draft && draft.blob) {
        setAudioBlob(draft.blob);
        setRecordedAudio(URL.createObjectURL(draft.blob));
        setRecordTime(draft.duration || 0);
        setIsClosingAudioReport(false);
        // NO abrir el modal automáticamente para no ser invasivo
      }
    });
  }, []);

  // Auto-Scroll Inteligente para la Guía
  useEffect(() => {
    if (showHelp || isOnboardingTour) {
      setTimeout(() => {
        const bubbles = document.querySelectorAll('.guide-bubble-active');
        // Usamos la última burbuja en el DOM para priorizar los Modales/Portals que se renderizan al final
        const activeBubble = bubbles[bubbles.length - 1];
        if (activeBubble) {
          activeBubble.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [showHelp, isOnboardingTour, dashHelpStep, teleHelpStep, reportHelpStep]);

  const handleCloseAudioReport = () => {
    setIsClosingAudioReport(true);
    
    // REGRESA SIEMPRE AL MODAL PRINCIPAL DE MISIONES AL CERRAR ESTO, DE INMEDIATO
    setShowMissionModal(true);
    setActiveMision(null);
    localStorage.removeItem('epotech_active_mision');

    if (isOnboardingTour) {
      setIsOnboardingTour(false);
      setTourStep(0);
      setTourSubStep(0);
    }

    setTimeout(() => {
      setShowAudioReport(false);
      setIsClosingAudioReport(false);
      setReportSentSuccessfully(false);
    }, 500); // Aumentado a 500ms para sincronizar con la animación más dramática
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordTime((prev) => {
          if (prev >= 3600) { // Límite de 60 minutos
            stopRecording();
            showToast("Límite de 60 min alcanzado", "info");
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  useEffect(() => {
    let interval: any;
    if (sceneIsRecording) {
      interval = setInterval(() => setSceneRecordTime(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [sceneIsRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : 'audio/webm';
      const mediaRecorderInstance = new MediaRecorder(stream, { mimeType });
      mediaRecorder.current = mediaRecorderInstance;
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const mimeType = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : 'audio/webm';
        const blob = new Blob(audioChunks.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedAudio(url);
        setAudioBlob(blob);

        // Auto-guardar en IndexedDB por si recarga la página
        saveDraftAudio(blob, recordTime);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordTime(0);
    } catch (err) {
      showToast("Error al acceder al micrófono", "error");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.resume();
      setIsPaused(false);
    }
  };

  const handleSendReport = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    try {
      // Convertir a WAV antes de enviar para máxima compatibilidad con iOS
      const wavBlob = await mergeBlobsToWav([audioBlob]);
      const fileName = `reporte_${Date.now()}.wav`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audios')
        .upload(fileName, wavBlob, { contentType: 'audio/wav' });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('audios')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from('reportes_audio').insert({
        proyecto_id: selectedScript?.id || 'manual',
        titulo: reportTitle || 'Reporte de Campo',
        audio_url: publicUrl.publicUrl,
        duracion: formatTime(recordTime)
      });

      if (insertError) throw insertError;

      showToast("¡Audio enviado al equipo con éxito!", "success");
      fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: '🎤 Nuevo Reporte de Campo',
          mensaje: `Se recibió un reporte de audio${reportTitle ? ': ' + reportTitle : ''}. Entra al Hub para revisarlo.`
        })
      }).catch(e => console.error('Push error:', e));
      setRecordedAudio(null);
      setAudioBlob(null);
      setRecordTime(0);
      deleteDraftAudio(); // Borrar de emergencia tras envío exitoso

      // Si está en el simulacro de bienvenida, finaliza el onboarding para reporte
      if (isOnboardingTour && tourStep === 2) {
        updateOnboardingProgress('reportDone', true);
        setOnboardingSuccessModal({ isOpen: true, type: 'report' });
      } else {
        setReportSentSuccessfully(true);
      }
    } catch (err) {
      console.error(err);
      showToast("Error al enviar el reporte", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const [isUploadingLocucion, setIsUploadingLocucion] = useState(false);
  const [locucionSent, setLocucionSent] = useState(false);

  const handleSendLocucion = async () => {
    if (!mergedVoiceoverUrl || !selectedScript) return;
    setIsUploadingLocucion(true);
    try {
      const response = await fetch(mergedVoiceoverUrl);
      const blob = await response.blob();
      const fileName = `locucion_${selectedScript.id}_${Date.now()}.wav`;

      const { error: uploadError } = await supabase.storage
        .from('audios')
        .upload(fileName, blob, { contentType: 'audio/wav' });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('audios')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from('locuciones').insert({
        script_id: selectedScript.id,
        script_title: locucionTitle || selectedScript.title,
        audio_url: publicUrlData.publicUrl
      });

      if (insertError) throw insertError;

      // LIMPIAR BORRADOR TRAS ENVÍO EXITOSO
      setVoiceoverFragments([]);
      setMergedVoiceoverUrl(null);
      deleteVoiceoverDraft(selectedScript.id);

      // MARCAR COMO GRABADO AUTOMÁTICAMENTE
      setGrabados(prev => { const next = new Set(prev); next.add(selectedScript.id); return next; });
      supabase.from('grabados').upsert({ script_id: selectedScript.id });

      // PUSH AL DUEÑO
      fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: '🎙️ Nueva Locución Lista',
          mensaje: `Se subió la locución: "${locucionTitle || selectedScript.title}". Entra al Hub para revisarla.`
        })
      }).catch(e => console.error('Push error:', e));

      // Si está en el simulacro de bienvenida, finaliza el onboarding
      if (isOnboardingTour && tourStep === 1) {
        updateOnboardingProgress('voiceDone', true);
        setOnboardingSuccessModal({ isOpen: true, type: 'voice' });
      } else {
        setLocucionSent(true);
        setTimeout(() => {
          setLocucionSent(false);
          setSelectedScript(null);
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      showToast('Error al enviar la locución', 'error');
    } finally {
      setIsUploadingLocucion(false);
    }
  };

  const startSceneRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      sceneMediaRecorder.current = recorder;
      sceneAudioChunks.current = [];
      recorder.ondataavailable = (e) => sceneAudioChunks.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(sceneAudioChunks.current, { type: mimeType });
        setSceneRecordedBlob(blob);
        setSceneRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      setSceneIsRecording(true);
      setSceneRecordTime(0);
    } catch {
      showToast("Error al acceder al micrófono", "error");
    }
  };

  const stopSceneRecording = () => {
    sceneMediaRecorder.current?.stop();
    setSceneIsRecording(false);
  };

  const handleSendVozCamara = async () => {
    if (!sceneRecordedBlob || !selectedScript) return;
    setIsUploadingVozCamara(true);
    try {
      const scene = selectedScript.scenes?.[currentStepIdx];
      const wavBlob = await mergeBlobsToWav([sceneRecordedBlob]);
      const fileName = `voz_camara_${scene?.id}_${Date.now()}.wav`;
      const { error: uploadError } = await supabase.storage.from('audios').upload(fileName, wavBlob, { contentType: 'audio/wav' });
      if (uploadError) throw uploadError;
      const { data: publicUrlData } = supabase.storage.from('audios').getPublicUrl(fileName);
      const { error: insertError } = await supabase.from('voces_camara').insert({
        scene_id: scene?.id,
        script_id: selectedScript.id,
        scene_title: scene?.title,
        script_title: selectedScript.title,
        audio_url: publicUrlData.publicUrl
      });
      if (insertError) throw insertError;
      setSceneRecordedBlob(null);
      setSceneRecordedUrl(null);
      setVozCamaraSent(true);
      setTimeout(() => setVozCamaraSent(false), 3000);
      fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: '🎙️ Nueva Voz en Off (Guión a Cámara)',
          mensaje: `Se grabó la voz de: "${scene?.title}" — ${selectedScript.title}`
        })
      }).catch(() => {});
    } catch (err) {
      console.error(err);
      showToast('Error al enviar la voz', 'error');
    } finally {
      setIsUploadingVozCamara(false);
    }
  };

  useEffect(() => {
    supabase.from('scene_config').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string, { audio_enabled: boolean; video_url: string | null }> = {};
        data.forEach((c: any) => { map[c.scene_id] = { audio_enabled: c.audio_enabled, video_url: c.video_url }; });
        setSceneConfig(map);
      }
    });
  }, []);

  const updateSceneConfig = async (sceneId: string, field: 'audio_enabled' | 'video_url', value: any) => {
    const current = sceneConfig[sceneId] || { audio_enabled: false, video_url: null };
    const updated = { ...current, [field]: value };
    setSceneConfig(prev => ({ ...prev, [sceneId]: updated }));
    await supabase.from('scene_config').upsert({ scene_id: sceneId, audio_enabled: updated.audio_enabled, video_url: updated.video_url });
  };

  useEffect(() => {
    async function fetchProductionPlan() {
      // Cargar caché inicial si existe
      const cachedPlan = localStorage.getItem('epotech_production_plan');
      if (cachedPlan) {
        try {
          setContentDB(JSON.parse(cachedPlan));
          setLoading(false);
        } catch(e) {}
      }

      try {
        const { data: ideas } = await supabase
          .from('ideas_contenido')
          .select('*')
          .order('created_at', { ascending: false });

        if (ideas && ideas.length > 0) {
          const mappedPlan: any = {};
          const now = new Date();
          const currentMonthShort = now.toLocaleString('es-ES', { month: 'short' });
          ideas.forEach((idea, index) => {
            const day = (index + 1).toString().padStart(2, '0');
            mappedPlan[day] = {
              status: idea.status || 'Pendiente',
              title: idea.titulo,
              type: idea.tipo || 'Reel',
              objetivo: 'Branding',
              desc: idea.descripcion,
              copy: 'Cargando texto estratégico...',
              hashtags: '#EpotechSolutions #PisosEpoxy',
              date: `${day} ${currentMonthShort}`
            };
          });
          setContentDB(mappedPlan);
          localStorage.setItem('epotech_production_plan', JSON.stringify(mappedPlan));
        }
      } catch (err) {
        console.error("Error al cargar plan de producción:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProductionPlan();
  }, []);

  const [selectedProduction, setSelectedProduction] = useState<any>(null);

  // --- BLOQUEO MAESTRO DE SCROLL (EVITA DOBLE SCROLL EN MÓVIL) ---
  useEffect(() => {
    const isAnyModalOpen = !!(selectedScript || selectedStory || showAudioReport || selectedProduction || selectedSerie || confirmDialog.isOpen || onboardingSuccessModal.isOpen);
    
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.classList.remove('modal-open');
    };
  }, [selectedScript, selectedStory, showAudioReport, selectedProduction, selectedSerie, confirmDialog.isOpen, onboardingSuccessModal.isOpen]);

  const toggleGlobalStatus = async (day: string) => {
    const newDB = { ...contentDB };
    if (!newDB[day]) return;
    const states = ['PENDIENTE', 'PROGRAMADO', 'PUBLICADO'];
    const nextIdx = (states.indexOf(newDB[day].status) + 1) % states.length;
    const nextStatus = states[nextIdx];
    newDB[day].status = nextStatus;
    setContentDB(newDB);

    if (nextStatus === 'PUBLICADO') {
      try {
        await supabase.from('registro_publicaciones').insert([
          {
            tipo: newDB[day].type === 'EDUCATIVO' ? 'REEL' : newDB[day].type,
            tema: newDB[day].title,
            plataforma: 'INSTAGRAM'
          }
        ]);
      } catch (e) {
        console.error("Error Supabase:", e);
      }
    }

    if (selectedProduction && selectedProduction.day === day) {
      setSelectedProduction({ ...selectedProduction, status: nextStatus });
    }
  };

  const saveProduction = (updated: any) => {
    const newDB = { ...contentDB };
    newDB[updated.day] = updated;
    setContentDB(newDB);
    setSelectedProduction(updated);
  };




  const [isClosing, setIsClosing] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'solo' | 'ayuda' | 'tips'>('solo');
  const [openAdviceIdx, setOpenAdviceIdx] = useState<number | null>(null);

  // Sincronización de animaciones para Guion Abierto
  useEffect(() => {
    if (selectedScript) {
      const timer = setTimeout(() => setIsAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimate(false);
      setOpenAdviceIdx(null);
    }
  }, [selectedScript]);

  const handleCloseScript = () => {
    setIsClosing(true);
    if (isRecordingVoiceover) stopVoiceoverRecording();
    setTimeout(() => {
      setSelectedScript(null);
      setIsClosing(false);
      setActiveModalTab('solo');
      setOpenAdviceIdx(null);
      setCurrentStepIdx(0);
      setShowFullScript(false);
      setVoiceoverFragments([]);
      setMergedVoiceoverUrl(null);
      // No borramos el draft de la DB aquí por si quiere seguir después
      
      // SI ESTÁ EN EL TOUR, ABORTA ESTE PASO PERO REGRESA AL MODAL DE MISIONES
      if (isOnboardingTour) {
        setIsOnboardingTour(false);
        setTourStep(0);
        setTourSubStep(0);
        setShowMissionModal(true);
        setActiveMision(null);
        localStorage.removeItem('epotech_active_mision');
      }
    }, 500);
  };

  const modalContent = selectedScript && mounted ? createPortal(
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center px-4 overflow-hidden ${isClosing ? 'modal-backdrop-out' : 'modal-backdrop'} bg-black/90`}
      style={{
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleCloseScript(); }}
    >
      <div className={`relative w-full max-w-lg bg-[#0a192f] border border-white/10 rounded-[40px] overflow-y-auto flex flex-col shadow-2xl ${isClosing ? 'modal-panel-out' : 'modal-panel'}`}
        style={{ maxHeight: '100%' }}
      >
        {locucionSent && (
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#48c1d2]/10 border border-[#48c1d2]/30 flex items-center justify-center">
              <span className="text-4xl">🎙️</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[3px] mb-2">¡Listo!</p>
              <h3 className="text-xl font-black text-white leading-tight mb-3">Audio enviado al equipo</h3>
              <p className="text-sm text-white/50 font-medium leading-relaxed">Tu locución fue guardada correctamente en el historial. El equipo la recibirá para edición.</p>
            </div>
            <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full bg-[#48c1d2] animate-shrink-bar" />
            </div>
          </div>
        )}
        {/* Encabezado 2 filas */}
        {!locucionSent && <div className="border-b border-white/5 bg-black/20">
          {/* Fila 1: X + Título + Ícono libro */}
          <div className="px-6 sm:px-8 pt-8 sm:pt-10 pb-4 flex items-center gap-4">
            <button onClick={handleCloseScript} className="w-10 h-10 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors border border-white/5 active:scale-95">
              <X size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px] block leading-none mb-1">{selectedScript.category}</span>
              <p className="text-base sm:text-lg font-black text-white leading-tight truncate">{selectedScript.title}</p>
            </div>
            <button
              onClick={() => setShowFullScript(!showFullScript)}
              className={`shrink-0 h-11 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 ${showFullScript ? "bg-white/5 text-white/40 border border-white/5" : "bg-[#48c1d2] text-[#0a192f] shadow-lg shadow-[#48c1d2]/20"}`}
            >
              {showFullScript ? <Zap size={16} /> : <BookOpen size={16} />}
              <span className="text-[10px] font-black uppercase tracking-wider">
                {showFullScript ? "Grabar" : "Ver Guion"}
              </span>
            </button>
          </div>
        </div>}

        {/* Contenido principal */}
        {!locucionSent && <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col">
          {selectedScript.isProductionMode ? (
            /* NUEVO MODO: EN CÁMARA (PRODUCCIÓN DUAL) */
            <div className="px-6 sm:px-8 py-8 space-y-10">
              {showFullScript ? (
                /* Vista del Guion Completo para Producción */
                <div className="animate-in fade-in zoom-in-95 duration-500 text-left space-y-8">
                  <div className="p-8 sm:p-10 bg-white/5 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5"><Mic size={80} className="text-[#48c1d2]" /></div>
                    <div className="mb-6 relative z-20">
                      <span className="text-xs font-black text-[#48c1d2] uppercase tracking-[3px] block mt-2">Guion de Referencia</span>
                    </div>
                    <ScriptText 
                      text={selectedScript.fullDialogue}
                      className="text-xl font-medium text-white/90 leading-relaxed  relative z-10"
                    />
                  </div>
                </div>
              ) : (
                /* Vista de Escenas (Producción Dual) */
                <>
                  <div className="flex justify-between items-center mb-6 px-2">
                    <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[3px]">Escena {currentStepIdx + 1} de {selectedScript.scenes?.length}</span>
                    <div className="flex gap-1">
                      {selectedScript.scenes?.map((_: any, i: number) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentStepIdx ? 'w-6 bg-[#48c1d2]' : 'w-2 bg-white/10'}`} />
                      ))}
                    </div>
                  </div>

                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentStepIdx}
                      custom={direction}
                      variants={{
                        enter: (direction: number) => ({
                          x: direction > 0 ? 50 : -50,
                          opacity: 0
                        }),
                        center: {
                          x: 0,
                          opacity: 1
                        },
                        exit: (direction: number) => ({
                          x: direction < 0 ? 50 : -50,
                          opacity: 0
                        })
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                      }}
                      className="space-y-10 text-left"
                    >
                      {selectedScript.scenes?.[currentStepIdx] && (
                        <>
                          {(() => {
                            const sceneId = selectedScript.scenes[currentStepIdx].id;
                            const raw = sceneConfig[sceneId]?.video_url || selectedScript.scenes[currentStepIdx].videoUrl || '';
                            const hasVideo = !!(raw && (raw.includes('youtu.be/') || raw.includes('shorts/') || raw.includes('v=')));
                            return (
                              <div className="flex items-center justify-between gap-3">
                                <h3 className="text-2xl font-black text-white tracking-tighter">
                                  {selectedScript?.scenes?.[currentStepIdx]?.title}
                                </h3>
                                {hasVideo && (
                                  <button
                                    onClick={() => {
                                      setVideoAutoplay(true);
                                      setTimeout(() => {
                                        sceneVideoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                      }, 50);
                                    }}
                                    className="shrink-0 flex items-center gap-1.5 bg-[#48c1d2]/10 border border-[#48c1d2]/30 text-[#48c1d2] text-[9px] font-black uppercase tracking-wider px-3 py-2 rounded-xl hover:bg-[#48c1d2]/20 transition-all"
                                  >
                                    <PlayCircle size={13} />
                                    Tutorial
                                  </button>
                                )}
                              </div>
                            );
                          })()}

                          {/* INSTRUCCIONES SEBASTIÁN */}
                          <div className="bg-[#48c1d2]/5 rounded-[2.5rem] border border-[#48c1d2]/20 overflow-hidden">
                            <div className="p-6 border-b border-[#48c1d2]/10 bg-[#48c1d2]/10 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#48c1d2] flex items-center justify-center text-[#142d53]">
                                <User size={18} />
                              </div>
                              <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[3px]">Para Sebastián (Talento)</span>
                            </div>
                            <div className="p-6 space-y-6">
                              {selectedScript?.scenes?.[currentStepIdx]?.talent?.whatToSay && (
                                <div className="space-y-2">
                                  <div className="mb-2 relative z-20">
                                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mt-1">Qué decir:</span>
                                  </div>
                                  <ScriptText 
                                    text={selectedScript?.scenes?.[currentStepIdx]?.talent?.whatToSay || ""}
                                    className="text-xl font-black text-white leading-tight "
                                  />
                                </div>
                              )}
                              {(() => {
                                const howToMove = selectedScript?.scenes?.[currentStepIdx]?.talent?.howToMove || '';
                                const gesture = selectedScript?.scenes?.[currentStepIdx]?.talent?.gesture || '';
                                const isLong = howToMove.includes('\n\n') || howToMove.length > 120;

                                if (isLong) {
                                  // Layout expandido para instrucciones largas con pasos
                                  const blocks = howToMove.split('\n\n').filter(Boolean);
                                  return (
                                    <div className="space-y-4">
                                      {blocks.map((block, bi) => {
                                        const lines = block.split('\n').filter(Boolean);
                                        const isNumberedList = lines.some(l => /^\d+\./.test(l.trim()));
                                        const header = !isNumberedList ? lines[0] : null;
                                        const items = isNumberedList ? lines : lines.slice(1);
                                        return (
                                          <div key={bi} className={`rounded-2xl p-4 space-y-2 ${bi === 0 ? 'bg-[#48c1d2]/10 border border-[#48c1d2]/20' : bi === blocks.length - 1 ? 'bg-white/5 border border-white/10' : 'bg-white/5 border border-white/10'}`}>
                                            {header && (
                                              <p className="text-[10px] font-black text-[#48c1d2] uppercase tracking-wider">{header}</p>
                                            )}
                                            {isNumberedList ? (
                                              <div className="space-y-2">
                                                {items.map((item, ii) => {
                                                  const match = item.trim().match(/^(\d+)\.\s(.+)/);
                                                  if (!match) return <p key={ii} className="text-[11px] font-bold text-white/80">{item}</p>;
                                                  return (
                                                    <div key={ii} className="flex gap-3 items-start">
                                                      <span className="shrink-0 w-6 h-6 rounded-full bg-[#48c1d2] text-[#142d53] text-[10px] font-black flex items-center justify-center mt-0.5">{match[1]}</span>
                                                      <p className="text-[11px] font-bold text-white/80 leading-snug flex-1">{match[2]}</p>
                                                    </div>
                                                  );
                                                })}
                                              </div>
                                            ) : (
                                              items.map((line, li) => (
                                                <p key={li} className="text-[11px] font-bold text-white/80 leading-snug">{line}</p>
                                              ))
                                            )}
                                          </div>
                                        );
                                      })}
                                      {gesture && (
                                        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-4">
                                          <span className="text-[8px] font-black text-yellow-400 uppercase tracking-widest block mb-1">Actitud</span>
                                          <p className="text-[11px] font-bold text-white/80 leading-snug">{gesture}</p>
                                        </div>
                                      )}
                                    </div>
                                  );
                                }

                                // Layout compacto para instrucciones cortas
                                return (
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-[#48c1d2]/10 border border-[#48c1d2]/20 rounded-2xl p-3 space-y-1">
                                      <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-wider block">Cómo moverse</span>
                                      <p className="text-[11px] font-bold text-white/80 leading-snug">{howToMove}</p>
                                    </div>
                                    <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-3 space-y-1">
                                      <span className="text-[8px] font-black text-yellow-400 uppercase tracking-wider block">Actitud</span>
                                      <p className="text-[11px] font-bold text-white/80 leading-snug">{gesture}</p>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* GRABADOR DE VOZ EN OFF — dentro de la tarjeta de Sebastián */}
                              {(() => {
                                const sid = selectedScript.scenes[currentStepIdx].id;
                                if (!sceneConfig[sid]?.audio_enabled) return null;
                                return (
                                  <div className="border-t border-[#48c1d2]/20 pt-5 space-y-4">
                                    <div className="flex items-center gap-2">
                                      <Mic size={13} className="text-[#48c1d2]" />
                                      <span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px]">Grabar Voz en Off</span>
                                    </div>
                                    {vozCamaraSent ? (
                                      <div className="flex items-center gap-3 py-2">
                                        <CheckCircle2 size={20} className="text-[#48c1d2]" />
                                        <div>
                                          <p className="text-sm font-black text-white">¡Voz enviada!</p>
                                          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Guardada en el historial</p>
                                        </div>
                                      </div>
                                    ) : sceneRecordedUrl ? (
                                      <div className="space-y-3">
                                        <CustomAudioPlayer title="Voz grabada" src={sceneRecordedUrl} />
                                        <div className="flex gap-2">
                                          <button
                                            onClick={() => { setSceneRecordedUrl(null); setSceneRecordedBlob(null); setSceneRecordTime(0); }}
                                            className="flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 transition-all"
                                          >
                                            Grabar de nuevo
                                          </button>
                                          <button
                                            onClick={handleSendVozCamara}
                                            disabled={isUploadingVozCamara}
                                            className="flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-[#48c1d2] text-[#142d53] hover:bg-[#48c1d2]/80 transition-all disabled:opacity-50"
                                          >
                                            {isUploadingVozCamara ? 'Enviando...' : 'Enviar Voz'}
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex flex-col items-center gap-3 py-2">
                                        {sceneIsRecording && (
                                          <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                                            <span className="text-lg font-black text-white tabular-nums">{formatTime(sceneRecordTime)}</span>
                                          </div>
                                        )}
                                        <button
                                          onClick={sceneIsRecording ? stopSceneRecording : startSceneRecording}
                                          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${sceneIsRecording ? 'bg-red-500 shadow-red-500/40 animate-pulse' : 'bg-[#48c1d2] shadow-[#48c1d2]/40 hover:scale-105 active:scale-95'}`}
                                        >
                                          {sceneIsRecording
                                            ? <div className="w-6 h-6 rounded-md bg-white" />
                                            : <Mic size={32} className="text-[#142d53]" />}
                                        </button>
                                        <p className="text-sm font-black text-white/80">
                                          {sceneIsRecording ? 'Toca para detener' : 'Toca para grabar tu voz'}
                                        </p>
                                        {!sceneIsRecording && (
                                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest text-center">
                                            Lee la frase de arriba en voz alta
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          {/* INSTRUCCIONES JENKRYFER */}
                          <div className="bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden">
                            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                                <Camera size={18} />
                              </div>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Para Jenkryfer (Cámara)</span>
                            </div>
                            <div className="p-6 space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1 ">Dónde ponerse:</span>
                                  <p className="text-[11px] font-bold text-white/80 leading-snug">
                                    {selectedScript.scenes[currentStepIdx].camera.whereToStand}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1 ">Ángulo:</span>
                                  <p className="text-[11px] font-bold text-white/80 leading-snug">
                                    {selectedScript.scenes[currentStepIdx].camera.angle}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1 ">Movimiento:</span>
                                  <p className="text-[11px] font-bold text-white/80 leading-snug">
                                    {selectedScript.scenes[currentStepIdx].camera.movement}
                                  </p>
                                </div>
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                  <span className="text-[8px] font-black text-red-500 uppercase tracking-widest block mb-1 ">Evitar:</span>
                                  <p className="text-[11px] font-bold text-red-400 leading-snug">
                                    {selectedScript.scenes[currentStepIdx].camera.avoid}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* VIDEO TUTORIAL — al final, se abre con el botón */}
                          {(() => {
                            const sceneId = selectedScript.scenes[currentStepIdx].id;
                            const raw = sceneConfig[sceneId]?.video_url || selectedScript.scenes[currentStepIdx].videoUrl || '';
                            if (!raw) return null;
                            const videoId = raw.includes('youtu.be/')
                              ? raw.split('youtu.be/')[1]?.split('?')[0]
                              : raw.includes('shorts/')
                              ? raw.split('shorts/')[1]?.split('?')[0]
                              : raw.split('v=')[1]?.split('&')[0];
                            if (!videoId) return null;
                            return (
                              <div ref={sceneVideoRef} className="flex flex-col items-center gap-3">
                                <div className="flex items-center gap-2 w-full">
                                  <PlayCircle size={13} className="text-[#48c1d2]" />
                                  <span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px]">Video tutorial</span>
                                </div>
                                <div className="rounded-[2rem] overflow-hidden border border-white/10 w-full max-w-[280px] aspect-[9/16]">
                                  <iframe
                                    key={`${videoId}-${videoAutoplay}`}
                                    ref={sceneIframeRef}
                                    src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1${videoAutoplay ? '&autoplay=1' : ''}`}
                                    title="Video de instrucción"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                    onLoad={() => {
                                      if (videoAutoplay) {
                                        sceneIframeRef.current?.contentWindow?.postMessage(
                                          '{"event":"command","func":"playVideo","args":""}', '*'
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })()}

                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </>
              )}
            </div>
          ) : (
            /* MODO NORMAL: REELS / HISTORIAS (TELEPROMPTER) */
            <div className="px-6 sm:px-8 py-8 flex flex-col flex-1">
              {showFullScript ? (
                <div className="animate-in fade-in zoom-in-95 duration-500 text-left space-y-10 w-full flex-1">
                  <div className="space-y-10">
                    {selectedScript.steps.map((s: any, i: number) => (
                      <div key={i} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[3px]">ACTO {i + 1}</span>
                          <div className="flex-1 h-[1px] bg-white/10" />
                        </div>
                        <ScriptText 
                          text={s.script}
                          className="text-lg font-medium text-white/90 leading-relaxed "
                        />
                        {s.visualField && !s.visualField.startsWith('N/A') && (
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                            <h5 className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Video size={10} /> Referencia Visual</h5>
                            <p className="text-[11px] font-bold text-white/40 leading-snug uppercase">{s.visualField}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {isOnboardingTour && tourStep === 1 && (
                    <div className="mt-8 p-5 bg-[#0a192f] border border-white/10 rounded-[2rem] shadow-xl flex items-start gap-3 max-w-md mx-auto relative z-50 text-left text-white animate-bounce">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 font-black text-sm">💡</div>
                      <div className="flex-1">
                        <span className="text-[9px] font-black text-[#48c1d2] bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                          GUION COMPLETO
                        </span>
                        <p className="text-[11px] font-bold text-slate-300 leading-snug">
                          Aquí puedes ver todo el texto del guion corrido para practicar o leerlo completo. Cuando estés listo para comenzar el simulacro de grabación por partes, presiona el botón azul "GRABAR" arriba a la derecha (o "GRABAR POR PARTES" abajo).
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : mergedVoiceoverUrl ? (
                <div className="flex flex-col items-center justify-center flex-1 space-y-6 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30"><CheckCircle2 size={48} className="text-green-400" /></div>
                  <div className="text-center">
                    <h3 className="text-xl font-black text-white uppercase tracking-widest">Locución Completada</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Dale un nombre a tu audio:</p>
                  </div>
                  
                  <div className="w-full max-w-xs">
                    <input 
                      type="text" 
                      value={locucionTitle || selectedScript.title} 
                      onChange={(e) => setLocucionTitle(e.target.value)}
                      placeholder="Ej: Locución Final V1"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#48c1d2]/50 transition-all mb-4"
                    />
                    <CustomAudioPlayer title={locucionTitle || selectedScript.title} src={mergedVoiceoverUrl} />
                  </div>
                  <div className="flex flex-col w-full max-w-xs gap-3 mt-4">
                    <button 
                      onClick={handleSendLocucion} 
                      disabled={isUploadingLocucion} 
                      className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                        isUploadingLocucion 
                          ? 'bg-white/10 text-white/30' 
                          : 'bg-[#48c1d2] text-[#0a192f] hover:scale-105 shadow-xl shadow-[#48c1d2]/20'
                      }`}
                    >
                      {isUploadingLocucion ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</>
                      ) : (
                        <><Share2 size={16} /> Enviar al Equipo</>
                      )}
                    </button>
                    <a href={mergedVoiceoverUrl} download={`Locucion_${selectedScript.id}.wav`}
                      onClick={() => {
                        setGrabados(prev => { const next = new Set(prev); next.add(selectedScript.id); return next; });
                        supabase.from('grabados').upsert({ script_id: selectedScript.id });
                      }}
                      className="w-full py-4 bg-white/5 text-white hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10">
                      <Download size={16} /> Descargar Audio Final
                    </a>
                    {!isOnboardingTour && (
                      <button onClick={() => setMergedVoiceoverUrl(null)} className="w-full py-4 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                        Revisar Tomas
                      </button>
                    )}
                  </div>

                  {isOnboardingTour && tourStep === 1 && (
                    <div className="mt-6 p-5 bg-[#0a192f] border border-white/10 rounded-[2rem] shadow-xl flex items-start gap-3 w-full relative z-50 text-left text-white animate-bounce">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 font-black text-sm">💡</div>
                      <div className="flex-1">
                        <span className="text-[9px] font-black text-[#48c1d2] bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                          PASO FINAL: ENVIAR AUDIO
                        </span>
                        <p className="text-[11px] font-bold text-slate-300 leading-snug">
                          Una vez que ya está todo listo, dale clic al botón de Play en el reproductor de arriba para escuchar tu locución completa, y pausa para detenerla. Cuando termines de revisarla, presiona el botón azul "ENVIAR AL EQUIPO" para registrar tu audio de prueba en nuestra base de datos y completar este simulacro.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-8 px-1">
                    <span className="text-xs font-black text-[#48c1d2] uppercase tracking-[3px]">Paso {currentStepIdx + 1} de {selectedScript.steps.length}</span>
                    <div className="flex gap-1.5">
                      {selectedScript.steps.map((_: any, i: number) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStepIdx ? 'w-8 bg-[#48c1d2]' : 'w-2.5 bg-white/10'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left flex-1">
                    <div className="bg-[#48c1d2] px-8 pt-8 pb-10 rounded-[40px] relative shadow-2xl shadow-[#48c1d2]/20">
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Sparkles size={60} className="text-[#0a192f]" /></div>
                      <h4 className="text-[9px] font-black text-[#0a192f] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Mic size={14} /> Tu guion para leer:
                      </h4>
                      <ScriptText 
                        text={selectedScript.steps[currentStepIdx].script}
                        className="text-2xl font-black text-[#0a192f] leading-[1.1] tracking-tight "
                        wordClassName="text-[#142d53] border-b border-[#142d53]/40 hover:bg-[#142d53]/10"
                      />
                      <div className="mt-10 mb-2 flex flex-col items-center">
                        {isRecordingVoiceover ? (
                          <div className="flex flex-col items-center gap-2">
                            <button onClick={stopVoiceoverRecording} className="w-16 h-16 rounded-full bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center text-white animate-pulse border-4 border-red-400"><div className="w-5 h-5 bg-white rounded-sm" /></button>
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Grabando toma...</span>
                          </div>
                        ) : voiceoverFragments.find(f => f.stepIdx === currentStepIdx) ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-2">
                              <button onClick={() => { const audioUrl = voiceoverFragments.find(f => f.stepIdx === currentStepIdx)?.url; if (audioUrl) toggleVoiceoverPlayback(audioUrl); }} className="px-4 py-2 bg-green-500/20 text-green-600 rounded-full text-[8px] font-black uppercase tracking-tighter border border-green-500/30 hover:bg-green-500/30 flex items-center gap-2 w-[100px] justify-center">{isPlayingVoiceover ? <PauseCircle size={14} /> : <PlayCircle size={14} />} {isPlayingVoiceover ? 'Pausar' : 'Escuchar'}</button>
                              <button onClick={() => startVoiceoverRecording(currentStepIdx)} className="px-4 py-2 bg-white/40 text-[#0a192f] rounded-full text-[8px] font-black uppercase tracking-tighter border border-white/40 hover:bg-white/60 flex items-center gap-2"><History size={14} /> REHACER</button>
                              <button onClick={() => deleteVoiceoverFragment(currentStepIdx)} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-[8px] font-black uppercase tracking-tighter border border-red-500/20 hover:bg-red-500/20 flex items-center gap-2"><Trash2 size={14} /> Eliminar</button>
                            </div>
                            <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Toma Guardada</span>
                          </div>
                        ) : (
                          <button onClick={() => startVoiceoverRecording(currentStepIdx)} className="w-16 h-16 rounded-full bg-[#142d53] shadow-[0_0_20px_rgba(20,45,83,0.3)] flex items-center justify-center text-[#48c1d2] hover:scale-105 active:scale-95 transition-all border-2 border-[#142d53]"><Mic size={28} /></button>
                        )}
                      </div>

                      {/* Globo de ayuda interactiva para el Simulacro 1 */}
                      {isOnboardingTour && tourStep === 1 && (
                        <div className="mt-8 p-5 bg-[#0a192f] border border-white/10 rounded-[2rem] animate-bounce shadow-xl flex items-start gap-3 max-w-md mx-auto relative z-50 text-left text-white">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 font-black text-sm">💡</div>
                          <div className="flex-1">
                            <span className="text-[9px] font-black text-[#48c1d2] bg-white/5 border border-white/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
                              PASO A PASO DEL SIMULACRO
                            </span>
                            <p className="text-[11px] font-bold text-slate-300 leading-snug">
                              {/* Paso 1 (Primera Frase) */}
                              {currentStepIdx === 0 && (
                                <>
                                  {tourSubStep === 1 && "1. Haz clic en el icono del micrófono negro y azul arriba para comenzar a grabar tu primera frase. (O pulsa 'VER GUION' arriba a la derecha si deseas leer todo el texto completo primero, y luego 'GRABAR' para volver a este modo por partes)."}
                                  {tourSubStep === 2 && "2. Lee la frase en voz alta con tono firme. ¡No te preocupes por detenerla manualmente! Al pulsar 'Siguiente Toma' se guardará sola. (Si te equivocas o quieres escucharla antes, pulsa el micrófono rojo para detener la grabación y verás las opciones de Escuchar, Rehacer o Eliminar)."}
                                  {tourSubStep === 3 && "3. ¡Excelente! Tu toma está guardada. Puedes usar los botones de arriba para 'Escuchar' tu voz, 'Rehacer' para grabarla de nuevo o 'Eliminar' para borrarla. Si todo está bien, pulsa 'Siguiente Toma' abajo para continuar."}
                                </>
                              )}

                              {/* Pasos Intermedios */}
                              {currentStepIdx > 0 && currentStepIdx < selectedScript.steps.length - 1 && (
                                <>
                                  {tourSubStep === 1 && "1. ¡La grabación se inició automáticamente! Lee la frase con energía. Al terminar, pulsa 'Siguiente Toma' para avanzar. (Si quieres escuchar tu voz o corregir, pulsa el micrófono rojo para detener la grabación y ver las opciones de Escuchar, Rehacer o Eliminar)."}
                                  {tourSubStep === 2 && "2. Lee la frase con energía. Al terminar, simplemente pulsa 'Siguiente Toma' para guardar y avanzar. (Si quieres escuchar tu voz o corregir, pulsa el micrófono rojo para detener la grabación y ver las opciones de Escuchar, Rehacer o Eliminar)."}
                                  {tourSubStep === 3 && "3. ¡Toma registrada! Puedes 'Escuchar', 'Rehacer' o 'Eliminar' usando los botones de arriba, o presionar el botón azul 'Siguiente Toma' abajo para avanzar."}
                                </>
                              )}

                              {/* Último Paso (Frase Final) */}
                              {currentStepIdx === selectedScript.steps.length - 1 && (
                                <>
                                  {tourSubStep === 1 && "1. ¡Última frase! La grabación ya se inició automáticamente. Léela con fuerza. Al terminar, pulsa directamente 'UNIR Y DESCARGAR'. (Si quieres revisar la toma, pulsa el micrófono rojo para ver las opciones de Escuchar, Rehacer o Eliminar)."}
                                  {tourSubStep === 2 && "2. Lee la frase final con fuerza. Al terminar, presiona directamente el botón azul 'UNIR Y DESCARGAR' para compilar todo. (Si quieres revisarla, pulsa el micrófono rojo para ver las opciones de Escuchar, Rehacer o Eliminar)."}
                                  {tourSubStep === 3 && "3. ¡Perfecto! Todas tus tomas están guardadas. Puedes 'Escuchar', 'Rehacer' o 'Eliminar' esta toma arriba, o presionar el botón azul 'UNIR Y DESCARGAR' abajo para finalizar el simulacro."}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>}

        {/* Pie de Página (Controles Navegación) */}
        <div className="px-6 sm:px-8 py-6 border-t border-white/5 bg-[#0a192f]/80 backdrop-blur-md flex gap-3">
          {selectedScript.isProductionMode ? (
            /* Controles Modo Producción */
            !showFullScript && (
              <>
                <button
                  disabled={currentStepIdx === 0}
                  onClick={() => {
                    setDirection(-1);
                    setCurrentStepIdx(prev => prev - 1);
                    setSceneRecordedUrl(null); setSceneRecordedBlob(null); setSceneRecordTime(0);
                    setVideoAutoplay(false);
                  }}
                  className={`flex-1 py-5 px-4 rounded-[24px] text-[10px] font-black uppercase tracking-tight transition-all ${currentStepIdx === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 active:scale-95'}`}
                >
                  ESCENA ANTERIOR
                </button>
                {currentStepIdx < (selectedScript.scenes?.length || 0) - 1 ? (
                  <button
                    onClick={() => {
                      setDirection(1);
                      setCurrentStepIdx(prev => prev + 1);
                      setSceneRecordedUrl(null); setSceneRecordedBlob(null); setSceneRecordTime(0);
                      setVideoAutoplay(false);
                    }}
                    className="flex-[2] py-5 px-4 bg-[#48c1d2] text-[#0a192f] text-[10px] font-black uppercase tracking-tight rounded-[24px] shadow-xl shadow-[#48c1d2]/20 transition-all active:scale-95 border-b-4 border-[#3aa8b8]"
                  >
                    SIGUIENTE ESCENA 🎬
                  </button>
                ) : (
                  <button
                    onClick={handleCloseScript}
                    className="flex-[2] py-5 bg-green-500 text-[#0a192f] text-[10px] font-black uppercase tracking-[2px] rounded-[24px] shadow-xl shadow-green-500/20 transition-all active:scale-95 border-b-4 border-green-700"
                  >
                    FINALIZAR PRODUCCIÓN ✅
                  </button>
                )}
              </>
            )
          ) : (
            /* Controles Modo Teleprompter (Existentes) */
            !showFullScript && !mergedVoiceoverUrl && (
              <>
                {currentStepIdx > 0 && (
                  <button 
                    onClick={() => {
                      if (isRecordingVoiceover) {
                        stopVoiceoverRecording();
                        setTimeout(() => {
                          setCurrentStepIdx(prev => prev - 1);
                          startVoiceoverRecording(currentStepIdx - 1);
                        }, 200);
                      } else {
                        setCurrentStepIdx(prev => prev - 1);
                      }
                    }} 
                    className="flex-1 py-5 px-4 bg-white/10 text-white text-[10px] font-black uppercase tracking-tight rounded-[24px] border border-white/10 transition-all active:scale-95"
                  >
                    Anterior
                  </button>
                )}
                {currentStepIdx < selectedScript.steps.length - 1 ? (
                  <button 
                    onClick={() => {
                      if (isRecordingVoiceover) {
                        stopVoiceoverRecording();
                        setTimeout(() => {
                          setCurrentStepIdx(prev => prev + 1);
                          startVoiceoverRecording(currentStepIdx + 1);
                        }, 200);
                      } else {
                        setCurrentStepIdx(prev => prev + 1);
                      }
                    }} 
                    className="flex-[2] py-5 px-4 bg-[#48c1d2] text-[#0a192f] text-[10px] font-black uppercase tracking-tight rounded-[24px] shadow-xl shadow-[#48c1d2]/20 transition-all active:scale-95 border-b-4 border-[#3aa8b8]"
                  >
                    Siguiente Toma
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      mergeVoiceoverFragments();
                    }} 
                    className="flex-[2] py-5 px-4 bg-[#48c1d2] text-[#0a192f] text-[10px] font-black uppercase tracking-tight rounded-[24px] shadow-xl shadow-[#48c1d2]/20 transition-all active:scale-95 border-b-4 border-[#3aa8b8] flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} /> UNIR Y DESCARGAR
                  </button>
                )}
              </>
            )
          )}

          {showFullScript && (
            <>
              <button
                onClick={() => {
                  setShowFullScript(false);
                }}
                className="w-full py-5 bg-[#48c1d2] text-[#0a192f] text-[10px] font-black uppercase tracking-[2px] rounded-[24px] shadow-xl shadow-[#48c1d2]/20 transition-all active:scale-95 border-b-4 border-[#3aa8b8]"
              >
                {selectedScript.isProductionMode ? "GRABAR POR ESCENAS 🎬" : "GRABAR POR PARTES 🎙️"}
              </button>
              {showHelp && teleHelpStep === 5 && createPortal(
                <div className="fixed inset-0 z-[30000] flex items-center justify-center p-6 animate-in fade-in duration-500">
                  <div className="absolute inset-0 bg-[#0a192f]/80 backdrop-blur-sm" />
                  <div className="bg-[#48c1d2] text-[#142d53] p-10 rounded-[4rem] text-[12px] font-black shadow-[0_0_150px_rgba(72,193,210,0.6)] w-80 max-w-[calc(100vw-40px)] border-8 border-white animate-in zoom-in duration-500 text-center relative z-10">
                    <div className="flex flex-col gap-5">
                      <div className="w-20 h-20 bg-[#142d53] rounded-full flex items-center justify-center mx-auto shadow-xl ring-4 ring-white/20">
                        <Sparkles size={40} className="text-[#48c1d2] animate-bounce" />
                      </div>
                      <div>
                        <h3 className="text-xl uppercase  tracking-tighter mb-1 leading-none">PASO 10: ¡ERES UN PRO!</h3>
                        <div className="h-1 w-12 bg-[#142d53]/20 mx-auto rounded-full" />
                      </div>
                      <p className="leading-tight font-bold text-sm">Ya sabes cómo crear contenido de élite para Epotech.</p>
                      <p className="text-[10px] opacity-70">Tu voz es el motor de todo lo que hacemos. ¡A darle!</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsClosing(true);
                          setTimeout(() => {
                            setSelectedScript(null);
                            setIsClosing(false);
                            setDashHelpStep(0);
                            setShowHelp(false);
                          }, 500);
                        }}
                        className="bg-[#142d53] text-white py-4 rounded-2xl hover:scale-105 transition-all text-[11px] font-black shadow-2xl mt-4 uppercase tracking-[0.2em] border-b-4 border-black"
                      >
                        ¡LISTO, A TRABAJAR!
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}
            </>
          )}
        </div>

      </div>
    </div>, document.body
  ) : null;

  return (
    <div className="min-h-screen bg-white pb-4">
      {/* INDICADOR OFF-LINE */}
      {mounted && isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-red-500 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top duration-300">
          <WifiOff size={14} />
          <span>Trabajando en Modo Offline - Datos Cargados de Caché</span>
        </div>
      )}



      {mounted && showMissionModal && (
        <div className="max-w-2xl lg:max-w-5xl mx-auto px-3 md:px-6 lg:px-8 py-6 lg:py-10 pb-4 animate-in fade-in duration-300 content-transition">
          <div className="relative w-full bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-[0_8px_40px_rgba(20,45,83,0.12)] overflow-hidden flex flex-col">

            {/* Cabecera */}
            <div className="relative p-6 md:p-8 lg:p-12 flex justify-between items-end bg-gradient-to-br from-[#142d53] to-[#0a192f] border-b border-[#48c1d2]/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#48c1d2]/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="relative z-10 text-left flex-1">
                {!onboardingDone ? (
                  <>
                    <span className="text-[10px] sm:text-xs font-black text-[#48c1d2] bg-[#48c1d2]/10 border border-[#48c1d2]/20 px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 flex items-center w-fit shadow-sm">
                      🥇 Entrenamiento Obligatorio
                    </span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight mt-1">
                      ¡Bienvenido, <span className="text-[#48c1d2]">Sebastián!</span>
                    </h2>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
                      <span className="whitespace-nowrap text-[9px] font-black text-[#142d53] bg-[#48c1d2] px-3 py-1.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1 shrink-0 shadow-[0_0_15px_rgba(72,193,210,0.4)]">
                        📋 Panel de Actividades
                      </span>
                      <div className="whitespace-nowrap shrink-0 flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-inner">
                        <span className="text-xs">🔥</span>
                        <span className="text-[9px] font-bold text-white uppercase tracking-wider">Racha: {streakDays} {streakDays === 1 ? 'Día' : 'Días'}</span>
                      </div>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight mt-1">
                      ¿Qué vas a hacer hoy, <span className="text-[#48c1d2]">Sebastián?</span>
                    </h2>
                  </>
                )}
              </div>

              {/* Avatar de Sebastián */}
              <div className="relative z-10 shrink-0 ml-4 mr-4 md:mr-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-full border-2 border-[#48c1d2]/50 shadow-[0_0_20px_rgba(72,193,210,0.25)] overflow-hidden">
                  <img
                    src="/sebastian.jpg"
                    alt="Sebastián"
                    className="w-full h-full object-cover object-[center_15%]"
                  />
                </div>
                {/* Punto verde de "activo" */}
                <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#142d53] shadow-sm" />
              </div>

              {onboardingDone && activeMision && (
                <button 
                  onClick={() => setShowMissionModal(false)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-white/70 transition-all border border-white/10 shadow-lg"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Contenido Modal */}
            <div className="p-5 md:p-8 lg:p-10 space-y-5 lg:space-y-8">
              {!onboardingDone ? (
                /* Contenido Onboarding */
                <div className="space-y-6 text-left">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide leading-relaxed">
                    Para activar la recepción de tus guiones diarios de élite, completa estos dos simulacros rápidos e interactivos de las herramientas clave del Hub.
                  </p>
                  
                  {/* Barra de progreso */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PROGRESO REQUERIDO</span>
                      <span className="text-[9px] font-black text-[#48c1d2]">
                        { (onboardingProgress.voiceDone ? 1 : 0) + (onboardingProgress.reportDone ? 1 : 0) } / 2 COMPLETADO
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#48c1d2] transition-all duration-500"
                        style={{ width: `${((onboardingProgress.voiceDone ? 50 : 0) + (onboardingProgress.reportDone ? 50 : 0))}%` }}
                      />
                    </div>
                  </div>

                  {/* Simulacros Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Simulacro 1 */}
                    <div 
                      onClick={() => {
                        setIsOnboardingTour(true);
                        setTourStep(1);
                        setTourSubStep(1);
                        
                        // Cargar el guion de ejemplo
                        const scriptDeEjemplo = guiones[0] || {
                          id: 'sample-1',
                          title: 'Guion de Prueba',
                          steps: [
                            { es: 'Esta es tu primera toma de prueba en el Epotech Hub.', en: 'This is your first test take in the Epotech Hub.' },
                            { es: 'Leo en voz alta y firme para grabar la voz en off.', en: 'I read out loud and firm to record the voice-over.' }
                          ]
                        };
                        setSelectedScript(scriptDeEjemplo);
                        setGuionTab('reels');
                        setActiveMision('vozoff');
                        setActiveTab('guiones');
                        setShowMissionModal(false); // Cerrar para hacer la grabación

                        if (onboardingProgress.voiceDone) {
                          setOnboardingProgress(prev => {
                            const newProg = { ...prev, voiceDone: false };
                            localStorage.setItem('epotech_onboarding_progress', JSON.stringify(newProg));
                            return newProg;
                          });
                          showToast("Simulacro 1 restablecido para repetir. 🎙️", "info");
                        }
                      }}
                      className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer group flex flex-col justify-between hover:shadow-lg active:scale-95 duration-200 ${
                        onboardingProgress.voiceDone 
                          ? 'border-emerald-500/20 bg-emerald-50/10' 
                          : 'border-slate-100 bg-slate-50/50 hover:border-[#48c1d2]/40'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${onboardingProgress.voiceDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {onboardingProgress.voiceDone ? <CheckCircle2 size={20} /> : <Mic size={20} />}
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${onboardingProgress.voiceDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {onboardingProgress.voiceDone ? "Hecho" : "Pendiente"}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-[#142d53]  leading-tight mb-1">1. Grabar Guion de Prueba</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-snug">Aprende a usar el grabador interactivo de Voz en Off.</p>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#48c1d2] mt-4 block">Hacer Simulacro 🎙️ →</span>
                    </div>

                    {/* Simulacro 2 */}
                    <div 
                      onClick={() => {
                        setIsOnboardingTour(true);
                        setTourStep(2);
                        setTourSubStep(1);
                        setActiveMision('checklist');
                        localStorage.setItem('epotech_active_mision', 'checklist');
                        setActiveTab('guiones');
                        localStorage.setItem('epotech_production_tab', 'guiones');
                        setGuionTab('checklist');
                        localStorage.setItem('epotech_guion_tab', 'checklist');
                        setShowAudioReport(true);
                        setReportHelpStep(1);
                        setShowMissionModal(false); // Cerrar para el modal de reportes

                        if (onboardingProgress.reportDone) {
                          setOnboardingProgress(prev => {
                            const newProg = { ...prev, reportDone: false };
                            localStorage.setItem('epotech_onboarding_progress', JSON.stringify(newProg));
                            return newProg;
                          });
                          showToast("Simulacro 2 restablecido para repetir. 🗣️", "info");
                        }
                      }}
                      className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer group flex flex-col justify-between hover:shadow-lg active:scale-95 duration-200 ${
                        onboardingProgress.reportDone 
                          ? 'border-emerald-500/20 bg-emerald-50/10' 
                          : 'border-slate-100 bg-slate-50/50 hover:border-[#48c1d2]/40'
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${onboardingProgress.reportDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                            {onboardingProgress.reportDone ? <CheckCircle2 size={20} /> : <MessageSquare size={20} />}
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${onboardingProgress.reportDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                            {onboardingProgress.reportDone ? "Hecho" : "Pendiente"}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-[#142d53]  leading-tight mb-1">2. Reportar un Trabajo</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-snug">Simula responder las 5 preguntas clave del día en audio.</p>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#48c1d2] mt-4 block">Hacer Simulacro 🗣️ →</span>
                    </div>
                  </div>

                  {/* Saltar Entrenamiento */}
                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={() => {
                        localStorage.setItem('epotech_onboarding_done', 'true');
                        localStorage.setItem('epotech_onboarding_progress', JSON.stringify({ voiceDone: true, reportDone: true }));
                        setOnboardingDone(true);
                        setOnboardingProgress({ voiceDone: true, reportDone: true });
                        setIsOnboardingTour(false);
                        setTourStep(0);
                        setTourSubStep(0);
                        showToast("Entrenamiento omitido. Bienvenido al Hub 🚀", "success");
                      }}
                      className="text-[9px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors underline underline-offset-2"
                    >
                      Saltar entrenamiento
                    </button>
                  </div>

                  {/* Reset Onboarding Button inside Onboarding stage */}
                  <div className="pt-4 border-t border-slate-100 flex justify-center">
                    <button
                      onClick={() => {
                        localStorage.removeItem('epotech_onboarding_done');
                        localStorage.removeItem('epotech_onboarding_progress');
                        setOnboardingDone(false);
                        setOnboardingProgress({ voiceDone: false, reportDone: false });
                        setIsOnboardingTour(false);
                        setTourStep(0);
                        setTourSubStep(0);
                        setSelectedScript(null);
                        setMergedVoiceoverUrl(null);
                        setActiveMision(null);
                        showToast("¡Progreso de entrenamiento restablecido! 🔄", "info");
                      }}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shadow-sm border border-slate-200"
                    >
                      🔄 Reiniciar Progreso de Simulacros
                    </button>
                  </div>
                </div>
              ) : (
                /* Contenido Selector Real de Misiones */
                <div className="space-y-6 text-left">
                  <p className="text-xs font-bold text-slate-500 tracking-wide leading-relaxed">
                    Selecciona una tarea para comenzar. La interfaz se adaptará para mostrarte únicamente las herramientas que necesitas.
                  </p>
                  
                  {/* Grid de Botones Directos */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                    {MISIONES.map((mision) => {
                      const Icon = mision.icon;
                      const isActive = activeMision === mision.id;
                      const colors = mision.colorClasses;
                      
                      // Calcular pendientes reales (Dynamic Badge)
                      let dynamicBadge = undefined;
                      if (mision.id === 'vozoff' && guiones) {
                        const count = guiones.filter(s => s.category.toUpperCase() !== 'PLANTILLA DE ENTRENAMIENTO' && !grabados.has(s.id)).length;
                        if (count > 0) dynamicBadge = `${count} Pendiente${count !== 1 ? 's' : ''}`;
                      } else if (mision.id === 'pro' && guionesPresentacion) {
                        const count = guionesPresentacion.filter(s => s.category.toUpperCase() !== 'PLANTILLA DE ENTRENAMIENTO' && !grabados.has(s.id)).length;
                        if (count > 0) dynamicBadge = `${count} Pendiente${count !== 1 ? 's' : ''}`;
                      }

                      return (
                        <div
                          key={mision.id}
                          onClick={() => {
                            handleSelectMision(mision.id);
                            setShowMissionModal(false);
                          }}
                          className={`relative p-5 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2rem] border transition-all cursor-pointer group flex flex-col justify-between hover:shadow-xl active:scale-[0.98] duration-300 overflow-hidden col-span-1 ${
                            isActive 
                              ? `border-[#48c1d2] bg-[#48c1d2]/5 shadow-md shadow-[#48c1d2]/10` 
                              : `border-slate-200/60 bg-white ${colors.hoverBorder}`
                          }`}
                        >
                          {/* Gradient Hover Effect */}
                          <div className={`absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
                          
                          <div className="relative z-10 flex-1 flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4 gap-3">
                              <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-[14px] lg:rounded-[18px] flex items-center justify-center shrink-0 transition-colors duration-300 shadow-sm ${isActive ? 'bg-[#48c1d2] text-white' : `${colors.bgLight} ${colors.text} group-hover:${colors.bg} group-hover:text-white`}`}>
                                <Icon size={20} className="lg:w-7 lg:h-7" />
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                {dynamicBadge && (
                                  <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest bg-red-100 text-red-600 px-2 sm:px-2.5 py-1 rounded-full shadow-sm animate-pulse border border-red-200">
                                    {dynamicBadge}
                                  </span>
                                )}
                                <span className={`text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-2 sm:px-2.5 py-1 rounded-full transition-all text-center border ${isActive ? 'bg-[#48c1d2] text-white border-[#48c1d2]' : `bg-slate-50 text-slate-500 border-slate-200 group-hover:${colors.border} group-hover:${colors.text}`}`}>
                                  {mision.tag}
                                </span>
                              </div>
                            </div>
                            <h4 className="text-[13px] sm:text-[15px] lg:text-lg font-black text-[#142d53] leading-tight mb-2 tracking-tight">{mision.title}</h4>
                            <p className="text-[10px] sm:text-[11px] lg:text-sm text-slate-500 font-medium leading-relaxed">{mision.desc}</p>
                          </div>
                          
                          <div className="relative z-10 mt-5 flex justify-end">
                            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-[#48c1d2] text-white shadow-md' : 'bg-slate-100 text-slate-400 group-hover:bg-[#142d53] group-hover:text-white group-hover:scale-110 group-hover:shadow-lg'}`}>
                              <ArrowRight size={14} className={isActive ? '' : '-translate-x-0.5 group-hover:translate-x-0 transition-transform'} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Reset Onboarding Button */}
                  <div className="pt-4 border-t border-slate-100 flex justify-center">
                    <button
                      onClick={() => {
                        localStorage.removeItem('epotech_onboarding_done');
                        localStorage.removeItem('epotech_onboarding_progress');
                        setOnboardingDone(false);
                        setOnboardingProgress({ voiceDone: false, reportDone: false });
                        setIsOnboardingTour(false);
                        setTourStep(0);
                        setTourSubStep(0);
                        setSelectedScript(null);
                        setMergedVoiceoverUrl(null);
                        setActiveMision(null);
                        showToast("¡Entrenamiento restablecido! 🔄", "info");
                      }}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shadow-sm border border-slate-200"
                    >
                      🔄 Reiniciar Entrenamiento de Bienvenida
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Pie de Página */}
            <div className="p-6 md:p-8 lg:p-10 bg-slate-50 border-t border-slate-100 text-center shrink-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                El Hub Epotech configura tu entorno de producción de forma autónoma.
              </p>
            </div>
          </div>
        </div>
      )}

      {mounted && activeMision && (
        <div className={`max-w-5xl mx-auto px-4 md:px-8 ${activeMision ? 'pt-8 md:pt-12' : 'py-6'} pb-8 text-left transition-all duration-300 ${mounted && isOffline ? 'pt-14' : ''}`}>
        
        {/* Mission Control Bar */}
        {activeMision && (() => {
          const mision = MISIONES.find(m => m.id === activeMision);
          if (!mision) return null;
          const MisionIcon = mision.icon;
          return (
            <div className="mx-1 sm:mx-0 mb-10 relative bg-gradient-to-br from-[#142d53] to-[#0a192f] rounded-[2rem] border border-white/8 shadow-2xl shadow-[#142d53]/30 overflow-hidden animate-in slide-in-from-bottom-4 duration-350">
              {/* Glow decorativo */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#48c1d2]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#48c1d2]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

              {/* Contenido */}
              <div className="relative z-10 p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-center gap-5">
                  {/* Ícono */}
                  <div className="w-14 h-14 shrink-0 bg-[#48c1d2]/15 rounded-2xl flex items-center justify-center shadow-lg border border-[#48c1d2]/25 backdrop-blur-sm">
                    <MisionIcon className="text-[#48c1d2]" size={26} />
                  </div>
                  {/* Texto */}
                  <div>
                    <span className="text-[9px] sm:text-[10px] font-black text-[#48c1d2] uppercase tracking-[3px] mb-2 block">{mision.tag}</span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tighter leading-tight">
                      {mision.title.split(':').pop()?.trim() || mision.title}
                    </h2>
                  </div>
                </div>

                {/* Botón */}
                <button
                  onClick={() => {
                    handleSelectMision(null);
                    setShowMissionModal(true);
                  }}
                  className="shrink-0 flex items-center gap-2 px-5 py-3 bg-white/8 hover:bg-white/15 text-white/70 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 active:scale-95 shadow-inner"
                >
                  <span className="text-base leading-none">←</span>
                  Volver al Menú
                </button>
              </div>
            </div>
          );
        })()}

        {!activeMision && (
          <>
            <div className="mb-6 animate-in fade-in slide-in-from-bottom-3 duration-400 content-transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-5xl font-black text-[#142d53] leading-[1.1] tracking-tighter">
                  Estudio de <span className="text-[#48c1d2]">Producción</span>
                </h1>
              </div>
              {onboardingDone && (
                <button
                  onClick={() => {
                    localStorage.removeItem('epotech_onboarding_done');
                    localStorage.removeItem('epotech_onboarding_progress');
                    setOnboardingDone(false);
                    setOnboardingProgress({ voiceDone: false, reportDone: false });
                    setIsOnboardingTour(false);
                    setTourStep(0);
                    setTourSubStep(0);
                    setSelectedScript(null);
                    setMergedVoiceoverUrl(null);
                    setActiveMision(null);
                    setShowMissionModal(true);
                    showToast("¡Entrenamiento de Bienvenida restablecido! 🔄", "info");
                  }}
                  className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-[#142d53] rounded-xl text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  🔄 Reiniciar Entrenamiento
                </button>
              )}
            </div>

            {/* REPORTE DE AUDIO - ACCESO DIRECTO DE ELITE */}
            <div className={`mb-8 animate-in fade-in slide-in-from-top-6 duration-1000 delay-200 relative`}>
              {showHelp && dashHelpStep === 1 && (
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 bg-[#48c1d2] text-[#142d53] p-5 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-64 max-w-[calc(100vw-40px)] z-50 border-2 border-white/20 animate-in zoom-in duration-300 guide-bubble-active">
                  <div className="flex flex-col gap-2">
                    <span>PASO 1: ¡Aquí empieza todo! Antes de los guiones, necesitamos tu narración. Cuéntanos la historia de lo que grabaste hoy.</span>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowAudioReport(true); setReportHelpStep(1); }}
                        className="bg-[#142d53] text-[#48c1d2] px-3 py-1.5 rounded-xl hover:scale-105 transition-all text-[8px] font-black shadow-lg"
                      >
                        VER CÓMO SE HACE
                      </button>
                    </div>
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#48c1d2] rotate-45 border-r-2 border-b-2 border-white/20"></div>
                </div>
              )}
              <button
                onClick={() => setShowAudioReport(true)}
                className={`w-full bg-[#142d53] hover:bg-[#0a192f] text-white p-4 rounded-[2rem] flex items-center justify-between group transition-all shadow-xl shadow-slate-200/50 active:scale-95 border-b-4 border-slate-950 relative overflow-hidden ${showHelp && dashHelpStep === 1 ? 'ring-4 ring-[#48c1d2] animate-pulse z-40 scale-[1.02]' : ''}`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform">
                  <Mic size={60} className="text-white" />
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-[#48c1d2]/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg backdrop-blur-md border border-[#48c1d2]/30">
                    <Mic className="text-[#48c1d2]" size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.2em] leading-none mb-1 text-white ">TU NARRACIÓN DEL DÍA</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">MIRA TU DRIVE Y CUÉNTANOS LA HISTORIA</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center relative z-10 border border-white/10 group-hover:bg-white/10 transition-all">
                  <ChevronRight size={20} className="text-[#48c1d2]" />
                </div>

                {recordedAudio && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#48c1d2] text-[#142d53] px-2 py-0.5 rounded-full text-[6px] font-black animate-pulse border border-[#142d53]/20 shadow-lg z-20">
                    <div className="w-1 h-1 bg-[#142d53] rounded-full"></div>
                    BORRADOR PENDIENTE
                  </div>
                )}
              </button>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-3 opacity-60">* Úsalo al terminar tu día para transformar tus videos crudos en historias reales.</p>
            </div>

            <div className="flex bg-slate-50 p-1 rounded-2xl mb-6 border border-slate-100">
              {[
                { id: 'guiones', name: 'Guiones', icon: Clapperboard, step: 1, help: 'Toca aquí para empezar tu día de grabación.' },
                { id: 'historial', name: 'Historial', icon: History }
              ].map((tab) => (
                <div key={tab.id} className="flex-1 relative">
                  <button
                    onClick={() => { handleTabChange(tab.id); if (tab.step === 1) setDashHelpStep(1); }}
                    className={`w-full py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-[#142d53] text-[#48c1d2]' : 'text-slate-400'} ${showHelp && tab.step === 1 && dashHelpStep === 1 ? 'ring-4 ring-[#48c1d2] animate-pulse z-40' : ''}`}
                  >
                    <tab.icon size={12} /> {tab.name}
                  </button>
                  {/* PASO 4: EXPLICACIÓN DE GUIONES DESPUÉS DEL REPORTE */}
                  {showHelp && tab.id === 'guiones' && dashHelpStep === 4 && (
                    <div className="absolute -top-44 left-0 right-0 mx-auto bg-[#142d53] text-[#48c1d2] p-6 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-64 max-w-[calc(100vw-40px)] z-50 border-2 border-[#48c1d2]/30 animate-in zoom-in duration-300 guide-bubble-active">
                      <div className="flex flex-col gap-2 text-center">
                        <span className="text-white uppercase tracking-wider text-[11px]">¡Excelente!</span>
                        <p className="leading-tight opacity-90">Con tu reporte generamos tus guiones profesionales.</p>
                        <div className="flex gap-2 justify-center mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAudioReport(true);
                              setReportHelpStep(2);
                              setDashHelpStep(0);
                            }}
                            className="bg-white/5 text-[#48c1d2] px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all text-[8px] border border-[#48c1d2]/20"
                          >
                            VOLVER
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTabChange('guiones');
                              setDashHelpStep(5);
                            }}
                            className="bg-[#48c1d2] text-[#142d53] px-4 py-2 rounded-xl hover:scale-105 transition-all text-[9px] font-black shadow-lg"
                          >
                            VER MIS GUIONES
                          </button>
                        </div>
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#142d53] rotate-45 border-r-2 border-b-2 border-[#48c1d2]/30"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}



      <div className="min-h-[400px] content-transition" key={activeTab}>
        {activeTab === 'guiones' && (
          <div className="space-y-4">
            {/* Navegación del Estudio de Producción Compacta pero Espaciada */}
            {/* Navegación del Estudio de Producción - Ahora Simplificada */}
            {!activeMision && (
              <div className="grid grid-cols-2 md:grid-cols-4 bg-[#0a192f]/5 p-1.5 rounded-[2rem] mb-6 gap-2 border border-slate-200/60">
                <button
                  onClick={() => handleGuionTabChange('reels')}
                  className={`py-3 px-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${guionTab === 'reels'
                      ? 'bg-[#142d53] text-[#48c1d2] scale-[1.02]'
                      : 'text-slate-500 hover:text-[#142d53] hover:bg-white/70'
                    }`}
                >
                  <Mic size={15} /> Guiones
                </button>
                <button
                  onClick={() => handleGuionTabChange('historias')}
                  className={`py-3 px-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${guionTab === 'historias'
                      ? 'bg-[#142d53] text-[#48c1d2] scale-[1.02]'
                      : 'text-slate-500 hover:text-[#142d53] hover:bg-white/70'
                    }`}
                >
                  <Sparkles size={15} /> Historias de Conexión
                </button>
                <button
                  onClick={() => handleGuionTabChange('checklist')}
                  className={`py-3 px-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${guionTab === 'checklist'
                      ? 'bg-[#142d53] text-[#48c1d2] scale-[1.02]'
                      : 'text-slate-500 hover:text-[#142d53] hover:bg-white/70'
                    }`}
                >
                  <CheckCircle2 size={15} /> Checklist de Obra
                </button>
                <button
                  onClick={() => handleGuionTabChange('presentacion')}
                  className={`py-3 px-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 ${guionTab === 'presentacion'
                      ? 'bg-[#142d53] text-[#48c1d2] scale-[1.02]'
                      : 'text-slate-500 hover:text-[#142d53] hover:bg-white/70'
                    }`}
                >
                  <Clapperboard size={15} /> Grabación Pro
                </button>
              </div>
            )}

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
              <div className="bg-[#142d53]/5 p-6 rounded-[2.5rem] border border-[#142d53]/10">

                
                {/* Tarjeta de Instrucciones Dinámica */}
                {guionTab !== 'historias' && guionTab !== 'checklist' && (
                  <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-[#142d53]/5 mb-6 flex items-start gap-3 shadow-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    guionTab === 'reels' ? 'bg-[#142d53] text-[#48c1d2]' : 'bg-[#48c1d2] text-[#142d53]'
                  }`}>
                    {guionTab === 'reels' && <Mic size={16} />}
                    {guionTab === 'presentacion' && <Clapperboard size={16} />}
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 leading-relaxed ">
                    {guionTab === 'reels' && 'Graba tu voz palabra por palabra siguiendo el guion. Este audio servirá como la narración profesional (voice-over) para tus videos.'}
                    {guionTab === 'presentacion' && (
                      enCamaraSubTab === 'series' 
                      ? 'Crea videos que cuenten una historia por capítulos. Esta es la mejor forma de que tus seguidores en Utah se acostumbren a verte y siempre estén esperando tu próximo video.'
                      : 'Sigue el desglose por escenas para grabarte a ti mismo o dirigir a alguien más. Incluye ángulos, movimientos y guiones exactos.'
                    )}
                  </p>
                  </div>
                )}

                {guionTab === 'presentacion' && (
                  <div className="flex bg-white/50 p-1.5 rounded-2xl border border-slate-200/50 mb-8 max-w-md">
                    <button
                      onClick={() => setEnCamaraSubTab('pinned')}
                      className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${enCamaraSubTab === 'pinned' ? 'bg-[#142d53] text-[#48c1d2] shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      📌 Videos a Fijar
                    </button>
                    <button
                      onClick={() => setEnCamaraSubTab('pro')}
                      className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${enCamaraSubTab === 'pro' ? 'bg-[#48c1d2] text-[#0a192f] shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      🎥 Contenido Pro
                    </button>
                    <button
                      onClick={() => setEnCamaraSubTab('series')}
                      className={`flex-1 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${enCamaraSubTab === 'series' ? 'bg-[#48c1d2] text-[#0a192f] shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      🎬 Series
                    </button>
                  </div>
                )}

                <div className="grid gap-4 content-transition" key={guionTab}>
                  {guionTab === 'reels' ? (
                    <>
                      {/* Barra de Búsqueda — visible solo con más de 3 guiones */}
                      {guiones.length > 3 && <div className="mb-6 space-y-4">
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#48c1d2]">
                            <Search size={18} />
                          </div>
                          <input
                            type="text"
                            placeholder="Buscar guion..."
                            value={scriptSearchQuery}
                            onChange={(e) => {
                              setScriptSearchQuery(e.target.value);
                              setSelectedWeek(""); // Reset tab on search to auto-select best match
                            }}
                            className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[#48c1d2] focus:ring-4 focus:ring-[#48c1d2]/5 transition-all shadow-sm"
                          />
                        </div>
                        {/* Filtro grabado / pendiente + reordenar */}
                        <div className="flex gap-2 mt-3">
                          {([
                            { id: 'todos',      label: 'Todos' },
                            { id: 'pendientes', label: '⏳ Pendientes' },
                            { id: 'grabados',   label: '✓ Grabados' },
                          ] as const).map(f => (
                            <button key={f.id} onClick={() => setScriptFilter(f.id)}
                              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${scriptFilter === f.id ? 'bg-[#142d53] text-white border-[#142d53]' : 'bg-white text-slate-400 border-slate-200'}`}>
                              {f.label}
                            </button>
                          ))}
                        </div>
                      </div>}

                      {(() => {
                        const MESES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
                        const fmtDate = (d?: string) => {
                          if (!d) return '';
                          const [,m,day] = d.split('-');
                          return `${parseInt(day)} ${MESES[parseInt(m)-1]}`;
                        };

                        const allFiltered = guiones.filter(s => {
                          if (s.category.toUpperCase() === 'PLANTILLA DE ENTRENAMIENTO') return false;
                          if (scriptFilter === 'grabados' && !grabados.has(s.id)) return false;
                          if (scriptFilter === 'pendientes' && grabados.has(s.id)) return false;
                          if (!scriptSearchQuery) return true;
                          const query = normalizeText(scriptSearchQuery);
                          return normalizeText(s.title).includes(query) ||
                                 normalizeText(s.service).includes(query) ||
                                 normalizeText(s.category).includes(query);
                        });

                        // Ordenar cada sección independientemente usando el orden personalizado
                        const applyOrder = (scripts: Script[]) => {
                          if (ordenGuiones.length === 0) return [...scripts].reverse();
                          return [...scripts].sort((a, b) => {
                            const ia = ordenGuiones.indexOf(a.id);
                            const ib = ordenGuiones.indexOf(b.id);
                            if (ia === -1 && ib === -1) return 0;
                            if (ia === -1) return 1;
                            if (ib === -1) return -1;
                            return ia - ib;
                          });
                        };
                        const pendientes  = applyOrder(allFiltered.filter(s => !grabados.has(s.id)));
                        const grabadosList = applyOrder(allFiltered.filter(s => grabados.has(s.id)));

                        const renderCard = (script: Script, idxInSection: number, sectionList: Script[]) => {
                          const sectionIds = sectionList.map(s => s.id);
                          return (
                          <div key={script.id} className={`rounded-[2rem] border shadow-sm flex items-center group transition-all relative overflow-hidden ${grabados.has(script.id) ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'}`}>
                            {modoReorden && (
                              <div className="shrink-0 pl-3 flex items-center text-slate-300">
                                <GripVertical size={16} />
                              </div>
                            )}
                            <button
                              onClick={() => {
                                if (modoReorden) return;
                                setSelectedScript(script);
                                setCurrentStepIdx(0);
                                setShowFullScript(true);
                                if (showHelp) setTeleHelpStep(1);
                              }}
                              className={`flex items-center gap-3 flex-1 min-w-0 px-4 py-4 text-left transition-all ${modoReorden ? 'opacity-70' : 'active:scale-95'}`}
                            >
                              <div className={`w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${grabados.has(script.id) ? 'bg-emerald-100 text-emerald-500' : 'bg-slate-50 text-slate-300 group-hover:text-[#48c1d2]'}`}>
                                {grabados.has(script.id) ? <CheckCircle size={18} /> : <Clapperboard size={18} />}
                              </div>
                              <div className="text-left min-w-0">
                                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                  <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-[2px]">{script.category}</span>
                                  {grabados.has(script.id)
                                    ? <span className="shrink-0 text-[8px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">✓ Grabado</span>
                                    : <span className="shrink-0 text-[8px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full uppercase tracking-wider">⏳ Pendiente</span>
                                  }
                                  {script.pilar && (
                                    <span className="shrink-0 text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ color: PILAR_COLORS[script.pilar], background: `${PILAR_COLORS[script.pilar]}18` }}>
                                      {PILARES_INFO[script.pilar].emoji} Pilar: {script.pilar}
                                    </span>
                                  )}
                                </div>
                                <h4 className={`text-sm font-black leading-snug ${grabados.has(script.id) ? 'text-emerald-700' : 'text-[#142d53]'}`}>{script.title}</h4>
                                {script.createdAt && (
                                  <p className="text-[9px] font-bold text-slate-400 mt-0.5">{fmtDate(script.createdAt)} · {script.duration}</p>
                                )}
                              </div>
                            </button>
                            {modoReorden ? (
                              <div className="shrink-0 flex flex-col border-l border-slate-100">
                                <button onClick={() => moverScript(script.id, 'top', sectionIds)} className="px-3 py-2 text-slate-400 hover:text-[#142d53] active:scale-90 transition-all border-b border-slate-100">
                                  <ChevronsUp size={13} />
                                </button>
                                <button onClick={() => moverScript(script.id, 'up', sectionIds)} disabled={idxInSection === 0} className="px-3 py-2 text-slate-400 hover:text-[#142d53] active:scale-90 transition-all border-b border-slate-100 disabled:opacity-20">
                                  <ArrowUp size={13} />
                                </button>
                                <button onClick={() => moverScript(script.id, 'down', sectionIds)} disabled={idxInSection === sectionList.length - 1} className="px-3 py-2 text-slate-400 hover:text-[#142d53] active:scale-90 transition-all border-b border-slate-100 disabled:opacity-20">
                                  <ArrowDown size={13} />
                                </button>
                                <button onClick={() => moverScript(script.id, 'bottom', sectionIds)} className="px-3 py-2 text-slate-400 hover:text-[#142d53] active:scale-90 transition-all">
                                  <ChevronsDown size={13} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => toggleGrabado(null, script.id)}
                                className={`shrink-0 w-12 self-stretch flex items-center justify-center transition-all active:scale-90 border-l ${grabados.has(script.id) ? 'border-emerald-200 text-emerald-500' : 'border-slate-100 text-slate-300 hover:text-emerald-500'}`}
                              >
                                <Check size={15} />
                              </button>
                            )}
                          </div>
                          );
                        };

                        return (
                          <div className="space-y-2">
                            {/* Botón reordenar encima de la lista */}
                            <div className="flex justify-end mb-1">
                              <button
                                onClick={() => setModoReorden(v => !v)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${modoReorden ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-violet-600'}`}
                              >
                                <GripVertical size={11} /> {modoReorden ? 'Listo ✓' : 'Reordenar'}
                              </button>
                            </div>

                            {allFiltered.length === 0 ? (
                              <div className="py-12 text-center rounded-[2rem] border border-dashed border-slate-200">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No se encontraron guiones</p>
                              </div>
                            ) : (
                              <>
                                {pendientes.length > 0 && (
                                  <>
                                    {grabadosList.length > 0 && scriptFilter === 'todos' && (
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 pb-1">⏳ Por grabar ({pendientes.length})</p>
                                    )}
                                    {pendientes.map((s, i) => renderCard(s, i, pendientes))}
                                  </>
                                )}
                                {grabadosList.length > 0 && (
                                  <>
                                    {pendientes.length > 0 && scriptFilter === 'todos' && (
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 pt-3 pb-1">✓ Grabados ({grabadosList.length})</p>
                                    )}
                                    {grabadosList.map((s, i) => renderCard(s, i, grabadosList))}
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  ) : guionTab === 'presentacion' ? (
                    <div className="grid gap-4">
                      {enCamaraSubTab === 'pinned' ? (
                        <>
                          <div className="p-6 bg-[#48c1d2]/5 rounded-[2.5rem] border border-[#48c1d2]/20 mb-2 text-left">
                            <h5 className="text-[10px] font-black text-[#48c1d2] uppercase tracking-widest mb-2 flex items-center gap-2">
                              <ShieldCheck size={12} /> Estrategia de Marca (Video Fijado)
                            </h5>
                            <p className="text-[11px] font-bold text-slate-900/70 leading-relaxed ">
                              "Estos 3 videos son los pilares de tu perfil. Al fijarlos (Pin), aseguras que cualquier persona nueva entienda de inmediato quién eres y cómo contratarte."
                            </p>
                          </div>

                          {/* Barra de Búsqueda para Grabación Pro */}
                          <div className="mb-6 space-y-4">
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#48c1d2]">
                                <Search size={18} />
                              </div>
                              <input
                                type="text"
                                placeholder="Buscar en Grabación Pro..."
                                value={scriptSearchQuery}
                                onChange={(e) => setScriptSearchQuery(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[#48c1d2] focus:ring-4 focus:ring-[#48c1d2]/5 transition-all shadow-sm"
                              />
                            </div>
                          </div>

                          <div className="grid gap-4">
                            {guionesPresentacion
                              .filter(s => {
                                if (!s.isPinned) return false;
                                if (!scriptSearchQuery) return true;
                                const query = normalizeText(scriptSearchQuery);
                                return normalizeText(s.title).includes(query) ||
                                       normalizeText(s.service).includes(query) ||
                                       normalizeText(s.category).includes(query);
                              })
                              .map((script) => (
                                <div
                                  key={script.id}
                                  onClick={() => {
                                    setSelectedScript(script);
                                    setCurrentStepIdx(0);
                                    setShowFullScript(true);
                                  }}
                                  className="bg-white px-4 py-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3 group hover:border-[#48c1d2] transition-all cursor-pointer relative overflow-hidden"
                                >
                                  <div className="w-10 h-10 shrink-0 bg-[#48c1d2]/5 rounded-2xl flex items-center justify-center text-[#48c1d2] group-hover:bg-[#48c1d2]/20 transition-all">
                                    <Video size={18} />
                                  </div>
                                  <div className="text-left flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                      <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-[2px]">{script.category}</span>
                                      {script.pilar && (
                                        <span className="shrink-0 text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ color: PILAR_COLORS[script.pilar], background: `${PILAR_COLORS[script.pilar]}18` }}>
                                          {PILARES_INFO[script.pilar].emoji} Pilar: {script.pilar}
                                        </span>
                                      )}
                                    </div>
                                    <h4 className="text-sm font-black text-[#142d53] leading-snug">{script.title}</h4>
                                    <p className="text-[10px] font-medium text-slate-400 mt-1">{script.duration} • Estratégico</p>
                                  </div>
                                  <ChevronRight size={16} className="shrink-0 text-slate-200 group-hover:text-[#48c1d2] group-hover:translate-x-1 transition-all" />
                                </div>
                              ))}
                          </div>
                        </>
                      ) : enCamaraSubTab === 'pro' ? (
                          <>
                            {/* Barra de Búsqueda para Contenido Pro */}
                            <div className="mb-6 space-y-4">
                              <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-[#48c1d2]">
                                  <Search size={18} />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Buscar en Contenido Pro..."
                                  value={scriptSearchQuery}
                                  onChange={(e) => setScriptSearchQuery(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[#48c1d2] focus:ring-4 focus:ring-[#48c1d2]/5 transition-all shadow-sm"
                                />
                              </div>
                            </div>

                            {(() => {
                              const filtered = guionesPresentacion.filter(s => {
                                if (s.isPinned) return false;
                                if (!scriptSearchQuery) return true;
                                const query = normalizeText(scriptSearchQuery);
                                return normalizeText(s.title).includes(query) || 
                                       normalizeText(s.service).includes(query) ||
                                       normalizeText(s.category).includes(query);
                              });
                              const groups = groupScriptsByWeek(filtered);
                              const groupKeys = Object.keys(groups);
                              
                              const activeWeek = selectedWeek || groupKeys[0] || "";
                              
                              return (
                                <div className="space-y-6">
                                  {groupKeys.length > 1 && (
                                    <div className="flex flex-wrap gap-2">
                                      {groupKeys.map(key => (
                                        <button
                                          key={key}
                                          onClick={() => setSelectedWeek(key)}
                                          className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${activeWeek === key ? 'bg-[#142d53] text-white border-[#142d53] shadow-md' : 'bg-white text-slate-400 border-slate-200'}`}
                                        >
                                          {key}
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  <div className="grid gap-4">
                                    {groups[activeWeek]?.map((script) => (
                                      <div
                                        key={script.id}
                                        onClick={() => {
                                          setSelectedScript(script);
                                          setCurrentStepIdx(0);
                                          setShowFullScript(true);
                                        }}
                                        className="bg-white px-4 py-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-3 group hover:border-[#48c1d2] transition-all cursor-pointer relative overflow-hidden"
                                      >
                                        <div className="w-10 h-10 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center text-[#142d53] group-hover:bg-slate-100 transition-all">
                                          <Clapperboard size={18} />
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                            <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-[2px]">{script.category}</span>
                                            {script.pilar && (
                                              <span className="shrink-0 text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ color: PILAR_COLORS[script.pilar], background: `${PILAR_COLORS[script.pilar]}18` }}>
                                                {PILARES_INFO[script.pilar].emoji} Pilar: {script.pilar}
                                              </span>
                                            )}
                                          </div>
                                          <h4 className="text-sm font-black text-[#142d53] leading-snug">{script.title}</h4>
                                          <p className="text-[10px] font-medium text-slate-400 mt-1">{script.duration} • Grabación Pro</p>
                                        </div>
                                        <ChevronRight size={16} className="shrink-0 text-slate-200 group-hover:text-[#48c1d2] group-hover:translate-x-1 transition-all" />
                                      </div>
                                    ))}

                                    {groupKeys.length === 0 && (
                                      <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No hay guiones nuevos aún</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })()}
                          </>
                        ) : enCamaraSubTab === 'series' ? (
                        <div className="grid gap-4">
                          {[
                            {
                              id: 'ser1',
                              title: 'Un día conmigo (El Dueño)',
                              description: 'Muestra tu rutina real. Desde que preparas el equipo hasta que terminas el trabajo. Así la gente confía en la persona detrás de Epotech.',
                              icon: User,
                              color: '[#48c1d2]',
                              benefit: 'Genera confianza y autoridad inmediata.'
                            },
                            {
                              id: 'ser2',
                              title: 'Limpieza de Regalo (En la calle)',
                              description: 'Busca algo muy sucio en la calle y límpialo gratis. El cambio visual es increíble y a la gente le encanta ver cómo ayudas a la comunidad.',
                              icon: Heart,
                              color: '#ff4d4d',
                              benefit: 'Formato con mayor potencial viral.'
                            },
                            {
                              id: 'ser3',
                              title: 'Reto: Haciendo crecer a Epotech',
                              description: 'Muestra cuánto dinero quieres ganar este mes y muestra el progreso. "¿Lograremos llegar a la meta hoy?".',
                              icon: TrendingUp,
                              color: '#4ade80',
                              benefit: 'Crea fans reales de tu negocio.'
                            }
                          ].map((serie) => (
                            <div 
                              key={serie.id} 
                              onClick={() => setSelectedSerie(serie)}
                              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group cursor-pointer hover:border-[#48c1d2] transition-all"
                            >
                              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                                <serie.icon size={60} style={{ color: serie.color }} />
                              </div>
                              <div className="relative z-10 flex flex-col md:flex-row gap-5 items-start">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md" style={{ backgroundColor: `${serie.color}15`, color: serie.color }}>
                                  <serie.icon size={28} />
                                </div>
                                <div className="text-left flex-1">
                                  <span className="text-[8px] font-black uppercase tracking-[2px] mb-1 block" style={{ color: serie.color }}>Serie Recomendada</span>
                                  <h4 className="text-lg font-black text-[#142d53] leading-tight mb-2 ">{serie.title}</h4>
                                  <p className="text-xs font-bold text-slate-500 leading-relaxed  mb-4">"{serie.description}"</p>
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full w-fit">
                                    <Sparkles size={10} className="text-[#48c1d2]" />
                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{serie.benefit}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <div className="py-20 px-8 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
                              <Sparkles size={40} className="animate-pulse" />
                            </div>
                            <h5 className="text-xl font-black text-[#142d53]  mb-2 tracking-tighter">Laboratorio de Contenido Pro</h5>
                            <p className="text-sm font-bold text-slate-400 max-w-[280px] leading-relaxed ">
                              "Próximamente se estarán colocando guiones estratégicos por aquí."
                            </p>
                            <div className="mt-8 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#48c1d2] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-[#48c1d2] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-1.5 h-1.5 rounded-full bg-[#48c1d2] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : guionTab === 'checklist' ? (
                    <div className="grid grid-cols-1 gap-6 text-left">


                      <div className="space-y-6">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                          Navega por cada etapa y graba lo que corresponde en ese momento del trabajo.
                        </p>

                        {/* Selector de Fase Compacto */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {checklistData.fases.filter((fase: any) => fase.id !== 'protocolo').map((fase: any) => {
                            const phaseIcons: Record<string, any> = {
                              antes: Camera,
                              durante: Settings,
                              despues: Sparkles,
                              humano: UserCheck,
                            };
                            const Icon = phaseIcons[fase.id] || Camera;
                            const isActive = checklistActivePhase === fase.id;
                            return (
                              <button
                                key={fase.id}
                                onClick={() => {
                                  setChecklistActivePhase(fase.id);
                                  setChecklistActiveTooltip(null);
                                }}
                                className={`flex items-center gap-3 p-3 rounded-2xl transition-all border ${
                                  isActive 
                                    ? "bg-white border-[#48c1d2] shadow-md" 
                                    : "bg-gray-50 border-transparent text-slate-400 opacity-70"
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-[#48c1d2] text-[#142d53]" : "bg-white border border-slate-100"}`}>
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
                          {checklistData.fases.filter((fase: any) => fase.id !== 'protocolo').map((fase: any) => {
                            if (checklistActivePhase !== fase.id) return null;
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
                            const phaseMessages: Record<string, string> = {
                              antes: "Registra el estado inicial. La suciedad extrema y el abandono son la clave para enganchar al espectador en los primeros 2 segundos.",
                              durante: "Documenta el proceso con clips dinámicos de acción. Se debe apreciar la técnica de Sebastián, la presión del agua y la eliminación de suciedad.",
                              despues: "Muestra el resultado final brillante. Debe verse impecable, nítido y transmitir la sensación de lujo/restauración de Epotech.",
                              humano: "Reglas de oro para crear historias diarias rápidas sin esfuerzo. Muestra el detrás de cámaras, humaniza la marca y conecta en un nivel personal."
                            };
                            const Icon = phaseIcons[fase.id] || Play;
                            const colorStyles = phaseColors[fase.id] || "bg-gray-100";

                            return (
                              <div key={fase.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <Card className="p-6 border-t-8 shadow-xl rounded-[2.5rem]" style={{ borderTopColor: fase.id === 'durante' || fase.id === 'humano' ? '#48c1d2' : '#142d53' }}>

                                  {/* 📋 LISTADO DE ITEMS (Fases normales) */}
                                  {checklistActivePhase !== 'protocolo' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative">
                                      {fase.items.map((item: any, idx: number) => (
                                        <div 
                                          key={idx} 
                                          onClick={() => {
                                            if (item.tooltip || checklistActivePhase === 'humano') {
                                              setChecklistActiveTooltip(checklistActiveTooltip === idx ? null : idx);
                                            }
                                          }}
                                          className={`group w-full flex flex-col items-start text-left p-5 bg-white rounded-[2rem] border transition-all active:scale-[0.98] cursor-pointer ${checklistActiveTooltip === idx ? 'border-[#48c1d2] bg-white shadow-xl ring-4 ring-[#48c1d2]/5' : 'border-slate-100 bg-gray-50/50 hover:bg-white hover:border-[#48c1d2]/50 hover:shadow-lg'}`}
                                        >
                                          <div className="flex items-start gap-3 w-full">
                                            <div className={`mt-0.5 rounded-xl w-8 h-8 flex items-center justify-center shrink-0 text-xs font-black transition-all ${checklistActiveTooltip === idx ? 'bg-[#142d53] text-[#48c1d2]' : 'bg-white border border-slate-100 text-slate-400 group-hover:text-[#48c1d2]'}`}>
                                              {idx + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <p className={`text-sm md:text-base font-black leading-tight transition-colors whitespace-normal ${checklistActiveTooltip === idx ? 'text-[#142d53]' : 'text-slate-600 group-hover:text-[#142d53]'}`}>
                                                  {(item.es || item)}
                                                </p>
                                                <div className={`shrink-0 self-start sm:self-center px-2 py-1 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 transition-all ${checklistActiveTooltip === idx ? 'bg-[#48c1d2] text-[#142d53]' : 'bg-slate-200/50 text-slate-500 group-hover:bg-[#142d53] group-hover:text-white'}`}>
                                                  <HelpCircle size={10} /> 
                                                  <span className="hidden md:inline">{checklistActiveTooltip === idx ? 'CERRAR' : '¿CÓMO GRABARLO?'}</span>
                                                  <span className="md:hidden">{checklistActiveTooltip === idx ? 'CERRAR' : 'TOCA PARA VER'}</span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          
                                          {/* Tooltip Detallado (Phase Humano / Stories Diarias) */}
                                          {checklistActiveTooltip === idx && checklistActivePhase === 'humano' && (
                                            <div className="mt-6 w-full space-y-3 animate-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
                                              <div className="grid grid-cols-1 gap-3">
                                                  {/* Objetivo */}
                                                  <div className="bg-white p-4 rounded-2xl border-l-4 border-[#48c1d2] shadow-sm text-left">
                                                    <div className="flex items-center gap-2 mb-1.5">
                                                      <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-[0.2em]">Propósito de esta historia</span>
                                                    </div>
                                                    <p className="text-[12px] font-bold text-[#142d53] leading-relaxed">{item.objetivo}</p>
                                                  </div>
                                                  
                                                  {/* Grabación */}
                                                  <div className="bg-slate-50/80 p-4 rounded-2xl border-l-4 border-[#142d53] shadow-sm text-left">
                                                    <div className="flex items-center gap-2 mb-2">
                                                      <Smartphone size={14} className="text-[#142d53]" />
                                                      <span className="text-[8px] font-black text-[#142d53] uppercase tracking-[0.2em]">Qué grabar en video</span>
                                                    </div>
                                                    <p className="text-[12px] font-bold text-slate-700 leading-relaxed mb-3">{item.grabar}</p>
                                                    
                                                    {(item.ejemplos || item.detalles) && (
                                                      <div className="pt-2 border-t border-slate-200 mt-2">
                                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Detalles para enfocar en la toma:</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                          {item.ejemplos?.map((ej: string, i: number) => (
                                                            <span key={`ej-${i}`} className="px-2.5 py-1 bg-white border border-[#48c1d2]/40 rounded-lg text-[10px] font-bold text-[#142d53]">{ej}</span>
                                                          ))}
                                                          {item.detalles?.map((det: string, i: number) => (
                                                            <span key={`det-${i}`} className="px-2.5 py-1 bg-white border border-[#142d53]/30 rounded-lg text-[10px] font-bold text-[#142d53]">{det}</span>
                                                          ))}
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>

                                                  {/* Narración */}
                                                  <div className="bg-white p-4 rounded-2xl border-l-4 border-[#48c1d2] shadow-sm text-left">
                                                    <div className="flex items-center gap-2 mb-2">
                                                      <Mic size={14} className="text-[#48c1d2]" />
                                                      <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-[0.2em]">Qué decir al hablar</span>
                                                    </div>
                                                    <p className="text-[12px] font-bold text-[#142d53] leading-relaxed mb-4">{item.narrar}</p>
                                                    
                                                    {item.demo && (
                                                      <div className="bg-[#142d53]/5 p-4 rounded-xl border border-[#142d53]/10 relative group/demo transition-all hover:bg-[#142d53]/10 text-left">
                                                        <div className="absolute -top-2 left-4 bg-[#142d53] text-white px-3 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest">Ejemplo práctico</div>
                                                        <p className="text-[11px] font-medium text-[#142d53]  leading-relaxed pt-1">{item.demo.replace(/^["“”]+|["“”]+$/g, '')}</p>
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
                                                        <div className="bg-[#142d53]/5 px-4 py-2.5 rounded-2xl border border-[#142d53]/10 flex items-center gap-2 text-left">
                                                          <div className="w-1.5 h-1.5 rounded-full bg-[#48c1d2] shrink-0" />
                                                          <span className="text-[10px] font-bold text-[#142d53] leading-snug">{item.regla.replace('❌ ', '')}</span>
                                                        </div>
                                                      )}
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                          )}

                                          {/* Tooltip Detallado (Original Phases) */}
                                          {checklistActiveTooltip === idx && checklistActivePhase !== 'humano' && item.tooltip && (
                                            <div className="mt-4 p-4 bg-[#142d53] text-white rounded-xl text-[10px] font-medium leading-relaxed animate-in zoom-in-95 duration-200 shadow-2xl relative border border-white/10 whitespace-pre-line w-full" onClick={(e) => e.stopPropagation()}>
                                              <div className="absolute -top-2 left-6 w-4 h-4 bg-[#142d53] rotate-45 border-l border-t border-white/10"></div>
                                              <span className="text-[#48c1d2] font-black uppercase block mb-1">Cómo hacerlo:</span>
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
                        </div>
                        
                        {/* ACORDEONES DE CALIDAD */}
                        <div className="mt-12 space-y-4 pt-10 border-t-2 border-slate-100">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-[#48c1d2]/10 flex items-center justify-center text-[#48c1d2]">
                                <ShieldCheck size={24} />
                              </div>
                              <div>
                                <h3 className="text-xl font-black text-[#142d53] tracking-tighter">Buenas Prácticas de Grabación</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consejos clave para todo tu contenido</p>
                              </div>
                            </div>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                              Aplica para: Todas las Fases
                            </p>
                          </div>

                          {/* ACORDEÓN: BUENAS PRÁCTICAS */}
                          <div className="space-y-2">
                            <button 
                              onClick={() => setChecklistExpandedProtocol(checklistExpandedProtocol === 'reglas' ? null : 'reglas')}
                              className={`w-full flex items-center justify-between p-5 rounded-[2rem] border transition-all ${checklistExpandedProtocol === 'reglas' ? 'bg-[#142d53] border-transparent shadow-xl text-white' : 'bg-white border-slate-100 hover:border-[#48c1d2]/30 shadow-sm'}`}
                            >
                              <div className="flex-1 min-w-0 flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl border shrink-0 ${checklistExpandedProtocol === 'reglas' ? 'bg-[#48c1d2] border-white/10 text-[#142d53]' : 'bg-[#48c1d2]/5 border-[#48c1d2]/10 text-[#48c1d2]'}`}>
                                  <CheckCircle2 size={18} />
                                </div>
                                <div className="text-left min-w-0">
                                  <h4 className={`text-base font-black tracking-tight leading-tight whitespace-normal ${checklistExpandedProtocol === 'reglas' ? 'text-white' : 'text-[#142d53]'}`}>Guía Rápida para el Equipo en Campo</h4>
                                  <p className={`text-[8px] font-black uppercase tracking-widest opacity-60 ${checklistExpandedProtocol === 'reglas' ? 'text-[#48c1d2]' : 'text-slate-400'}`}>Lo más importante al usar tu cámara</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 shrink-0 ml-4">
                                <span className={`text-[8px] font-black uppercase tracking-widest ${checklistExpandedProtocol === 'reglas' ? 'text-[#48c1d2]' : 'text-slate-300'}`}>
                                  {checklistExpandedProtocol === 'reglas' ? 'Cerrar' : 'Toca para abrir'}
                                </span>
                                <div className={`${checklistExpandedProtocol === 'reglas' ? 'text-[#48c1d2]' : 'text-slate-300'}`}>
                                  {checklistExpandedProtocol === 'reglas' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                              </div>
                            </button>

                            {checklistExpandedProtocol === 'reglas' && (
                              <div className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-lg space-y-4 animate-in zoom-in-95 duration-300 mt-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-[#48c1d2]/20 flex items-center justify-center text-[#48c1d2] shrink-0">
                                    <CheckCircle2 size={16} />
                                  </div>
                                  <div>
                                    <h4 className="text-xs md:text-sm font-black text-[#142d53] uppercase tracking-widest">Checklist de Calidad Visual</h4>
                                    <p className="text-[10px] md:text-[11px] font-medium text-slate-500">Asegúrate de cumplir estos puntos antes de dar por terminado un video</p>
                                  </div>
                                </div>
                                <ul className="grid grid-cols-2 gap-2">
                                  {checklistData.haz_list.map((item: string, i: number) => (
                                    <li key={i} className="flex items-center gap-2 bg-slate-50/80 py-2.5 px-3 rounded-xl border border-slate-100 transition-all hover:bg-white hover:border-[#48c1d2]/40 hover:shadow-sm group/item">
                                      <div className="text-[#48c1d2] opacity-60 group-hover/item:opacity-100 transition-opacity shrink-0">
                                        <CheckCircle2 size={14} />
                                      </div>
                                      <span className="text-[10px] md:text-[11px] font-bold text-[#142d53] leading-tight">{item}</span>
                                    </li>
                                  ))}
                                </ul>
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
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {/* GUÍA ESTRATÉGICA UNIFICADA */}
                      <div className="bg-gradient-to-br from-[#142d53] to-[#1e3a8a] rounded-[2.5rem] p-8 mb-6 border border-white/10 shadow-2xl relative overflow-hidden group">
                        {/* Fondo decorativo */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                          <Sparkles size={120} className="text-[#48c1d2]" />
                        </div>
                        
                        <div className="relative z-10 space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-[#48c1d2] flex items-center justify-center text-[#142d53] shadow-lg shadow-[#48c1d2]/20">
                              <Sparkles size={24} />
                            </div>
                            <div>
                              <h5 className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[3px] mb-0.5">Asistente de Contenido Epotech</h5>
                              <h4 className="text-xl font-black text-white  tracking-tighter">Guía Estratégica para Historias</h4>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-left">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-3xl">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-widest block">💡 Autenticidad</span>
                              </div>
                              <p className="text-[11px] font-bold text-slate-200 leading-relaxed ">
                                "Cualquier detalle de tu día sirve para conectar. Si estás muy ocupado para subir historias, mándanos fotos o vídeos crudos y nosotros los editamos por ti."
                              </p>
                            </div>
                            
                            <div className="bg-[#48c1d2]/10 border border-[#48c1d2]/30 p-5 rounded-3xl">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-widest block">🤖 Doblaje con IA</span>
                              </div>
                              <p className="text-[11px] font-bold text-white leading-relaxed ">
                                "Sebastián, habla tranquilamente en <span className="text-[#48c1d2] font-black underline decoration-2 underline-offset-2">español</span>. Nuestra Inteligencia Artificial traducirá tu voz al <span className="text-[#48c1d2] font-black underline decoration-2 underline-offset-2">inglés</span> manteniendo, en lo posible, tu esencia."
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {historiasSituacionales.map((story) => (
                        <div
                          key={story.id}
                          onClick={() => setSelectedStory(story)}
                          className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-[#48c1d2] transition-all cursor-pointer group relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                            <story.icon size={50} style={{ color: story.color }} />
                          </div>
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${story.color}20` }}>
                            <story.icon size={20} style={{ color: story.color }} />
                          </div>
                          <div className="text-left">
                            <span className="text-[8px] font-black uppercase tracking-widest block mb-1" style={{ color: story.color }}>{story.mood}</span>
                            <h4 className="text-sm font-black text-[#142d53] leading-tight mb-2">{story.title}</h4>
                            <p className="text-[10px] font-medium text-slate-400 line-clamp-2">
                              {story.sequence[0].script}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'historial' && (
          <HistorialSection 
            contentDB={contentDB} 
            onSelect={(key: string) => setSelectedProduction({ ...contentDB[key], day: key })} 
            showToast={showToast} 
            activeTab={activeTab} 
            requestConfirm={requestConfirm}
            initialSubTab={initialHistorialSubTab}
          />
        )}
      </div>

      {modalContent}
      
      {/* MODAL DE DETALLES DE SERIE */}
      {selectedSerie && createPortal(
        <div className="fixed inset-0 z-[20000] flex items-center justify-center px-4 py-12 md:px-8 md:py-14 overflow-hidden">
          <div 
            onClick={() => {
              setIsClosingSerie(true);
              setTimeout(() => {
                setSelectedSerie(null);
                setIsClosingSerie(false);
              }, 300);
            }}
            className={`absolute inset-0 bg-[#0a192f]/90 ${isClosingSerie ? 'modal-backdrop-out' : 'modal-backdrop'}`}
          />
          <div 
            onClick={e => e.stopPropagation()}
            className={`relative z-10 bg-white w-full max-w-lg rounded-[2rem] md:rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[82vh] md:max-h-[80vh] my-auto overflow-hidden ${isClosingSerie ? 'modal-panel-out' : 'modal-panel'}`}
          >
            <div className="p-8 pb-4 flex justify-between items-start bg-slate-50 border-b border-slate-100 shrink-0">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: `${selectedSerie.color}15` }}>
                  <selectedSerie.icon size={14} style={{ color: selectedSerie.color }} />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: selectedSerie.color }}>Hoja de Ruta: Series</span>
                </div>
                <h2 className="text-2xl font-black text-[#142d53] leading-tight tracking-tighter">{selectedSerie.title}</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 custom-scrollbar text-left">
              {/* Instrucción General */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-[11px] shrink-0 shadow-lg" style={{ backgroundColor: selectedSerie.color }}>
                    <Sparkles size={14} />
                  </div>
                  <h4 className="text-[11px] font-black text-[#142d53] uppercase tracking-[0.2em]">Instrucciones Clave</h4>
                </div>
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative">
                  <div className="absolute -left-2 top-6 w-1 h-12 rounded-full" style={{ backgroundColor: selectedSerie.color }} />
                  <p className="text-sm font-bold text-[#142d53] leading-relaxed ">
                    {selectedSerie.id === 'ser1' && "En este formato no es necesario que te grabes hablando todo el tiempo. Buscamos un estilo 'Vlog' natural."}
                    {selectedSerie.id === 'ser2' && "Esta serie es 'oro puro' para viralizar: ayudas a la comunidad y muestras tu trabajo al mismo tiempo."}
                    {selectedSerie.id === 'ser3' && "El objetivo aquí es crear una conexión real con tu audiencia compartiendo tus metas de negocio."}
                  </p>
                </div>
              </section>

              {/* Requerimientos */}
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-[11px] shrink-0">
                    <CheckCircle2 size={14} />
                  </div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Lo que necesitamos</h4>
                </div>
                <div className="grid gap-3">
                  {selectedSerie.id === 'ser1' && (
                    <>
                      <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <h5 className="text-[10px] font-black text-[#142d53] uppercase mb-2 flex items-center gap-2">
                          <Mic size={12} className="text-blue-500" /> El Audio (Vlog)
                        </h5>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                          Graba una nota de voz contándonos tu día. Ej: "Acompáñame hoy... empezamos a las 9am, llevé a mi esposa al trabajo y luego me preparé para un driveway difícil..."
                        </p>
                      </div>
                      <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <h5 className="text-[10px] font-black text-[#142d53] uppercase mb-2 flex items-center gap-2">
                          <Video size={12} className="text-purple-500" /> Los Videos (B-Roll)
                        </h5>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                          Graba clips cortos de <strong>todo</strong> lo que menciones en el audio: manejando, preparando el equipo, desayunando, trabajando, etc.
                        </p>
                      </div>
                    </>
                  )}
                  {selectedSerie.id === 'ser2' && (
                    <>
                      <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <h5 className="text-[10px] font-black text-[#142d53] uppercase mb-2 flex items-center gap-2">
                          <Camera size={12} className="text-[#48c1d2]" /> Equipo Necesario
                        </h5>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                          Usa un trípode para tomas lejanas de antes/después y un micrófono en el cuerpo para captar bien cuando hables con los vecinos.
                        </p>
                      </div>
                      <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <h5 className="text-[10px] font-black text-[#142d53] uppercase mb-2 flex items-center gap-2">
                          <Users size={12} className="text-emerald-500" /> El Gancho (Pitch)
                        </h5>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                          Toca puertas y ofrece limpiar gratis para tus redes. "Hola, estoy creando contenido y me gustaría limpiar tu driveway gratis para publicidad y ayudar al barrio".
                        </p>
                      </div>
                    </>
                  )}
                  {selectedSerie.id === 'ser3' && (
                    <>
                      <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <h5 className="text-[10px] font-black text-[#142d53] uppercase mb-2 flex items-center gap-2">
                          <TrendingUp size={12} className="text-green-500" /> Reto Diario
                        </h5>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                          Establece una meta (ej: $2000 al mes) y comparte el progreso en cada video. Crea suspenso: "¿Lo lograremos hoy?".
                        </p>
                      </div>
                      <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm">
                        <h5 className="text-[10px] font-black text-[#142d53] uppercase mb-2 flex items-center gap-2">
                          <MessageSquare size={12} className="text-blue-500" /> Contenido Transparente
                        </h5>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">
                          "Hoy salió este trabajo, gané tanto... sígueme para ver si llego a la meta". Esto crea fans reales que quieren verte ganar.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Referencias (Solo para Serie 1 por ahora) */}
              {selectedSerie.id === 'ser1' && (
                <section className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-[11px] shrink-0">
                      <Camera size={14} />
                    </div>
                    <h4 className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em]">Referencias Visuales</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <a 
                      href="https://www.instagram.com/reel/DW7NShpDn7H/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-2xl group hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                          <PlayCircle size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-black text-[#142d53] uppercase tracking-wider">Referencia #1</p>
                          <p className="text-[9px] font-bold text-blue-500">instagram.com/reel/DW7...</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-blue-300 group-hover:translate-x-1 transition-all" />
                    </a>
                    <a 
                      href="https://www.instagram.com/reel/DUjMet9Dg5v/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-2xl group hover:bg-blue-50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                          <PlayCircle size={20} />
                        </div>
                        <div className="text-left">
                          <p className="text-[10px] font-black text-[#142d53] uppercase tracking-wider">Referencia #2</p>
                          <p className="text-[9px] font-bold text-blue-500">instagram.com/reel/DUj...</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-blue-300 group-hover:translate-x-1 transition-all" />
                    </a>
                  </div>
                </section>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => {
                  setIsClosingSerie(true);
                  setTimeout(() => {
                    setSelectedSerie(null);
                    setIsClosingSerie(false);
                  }, 300);
                }}
                className="flex-1 py-4 bg-[#142d53] text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-[#142d53]/20 active:scale-95 transition-all"
              >
                ENTENDIDO
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {/* PANEL DE CONFIGURACIÓN DE ESCENAS */}
      {showSceneConfigPanel && mounted && createPortal(
        <div className="fixed inset-0 z-[25000] flex items-end sm:items-center justify-center px-0 sm:px-4 py-0 sm:py-8">
          <div onClick={() => setShowSceneConfigPanel(false)} className="absolute inset-0 bg-[#0a192f]/80 backdrop-blur-sm" />
          <div
            onClick={e => e.stopPropagation()}
            className="relative z-10 bg-[#0d1f3c] w-full sm:max-w-2xl rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col max-h-[90vh] overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#48c1d2]/20 flex items-center justify-center">
                  <Settings size={16} className="text-[#48c1d2]" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white">Configurar Escenas</h2>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Activa micrófono o pega URL de YouTube por escena</p>
                </div>
              </div>
              <button onClick={() => setShowSceneConfigPanel(false)} className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
              {guionesPresentacion.filter(s => s.isPinned && s.scenes && s.scenes.length > 0).map(script => (
                <div key={script.id} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <Video size={12} className="text-[#48c1d2]" />
                    <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-widest">{script.title}</span>
                  </div>
                  {script.scenes!.map(scene => {
                    const cfg = sceneConfig[scene.id] || { audio_enabled: false, video_url: null };
                    return (
                      <div key={scene.id} className="bg-white/5 rounded-[1.5rem] border border-white/10 p-4 space-y-4">
                        <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{scene.title}</p>

                        {/* Toggle audio */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mic size={13} className={cfg.audio_enabled ? 'text-[#48c1d2]' : 'text-white/30'} />
                            <span className={`text-[10px] font-bold ${cfg.audio_enabled ? 'text-white' : 'text-white/40'}`}>Grabador de Voz en Off</span>
                          </div>
                          <button
                            onClick={() => updateSceneConfig(scene.id, 'audio_enabled', !cfg.audio_enabled)}
                            className={`w-12 h-6 rounded-full transition-all relative ${cfg.audio_enabled ? 'bg-[#48c1d2]' : 'bg-white/10'}`}
                          >
                            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${cfg.audio_enabled ? 'left-7' : 'left-1'}`} />
                          </button>
                        </div>

                        {/* URL de YouTube */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <PlayCircle size={13} className={cfg.video_url ? 'text-[#48c1d2]' : 'text-white/30'} />
                            <span className={`text-[10px] font-bold ${cfg.video_url ? 'text-white' : 'text-white/40'}`}>Video de YouTube</span>
                          </div>
                          <input
                            type="text"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={cfg.video_url || ''}
                            onChange={e => updateSceneConfig(scene.id, 'video_url', e.target.value || null)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[11px] font-bold text-white/80 placeholder:text-white/20 outline-none focus:border-[#48c1d2]/50"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 shrink-0">
              <button onClick={() => setShowSceneConfigPanel(false)} className="w-full py-4 bg-[#48c1d2] text-[#142d53] font-black text-[11px] uppercase tracking-widest rounded-2xl">
                Listo
              </button>
            </div>
          </div>
        </div>
      , document.body)}

      {selectedStory && createPortal(
        <div className="fixed inset-0 z-[20000] flex items-center justify-center px-4 py-12 md:px-8 md:py-14 overflow-hidden">
          <div
            onClick={handleCloseStory}
            className={`absolute inset-0 bg-[#0a192f]/90 ${isClosingStory ? 'modal-backdrop-out' : 'modal-backdrop'}`}
          />
          <div 
            onClick={e => e.stopPropagation()}
            className={`relative z-10 bg-white w-full max-w-lg rounded-[2rem] md:rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[82vh] md:max-h-[80vh] my-auto overflow-hidden ${isClosingStory ? 'modal-panel-out' : 'modal-panel'}`}
          >
            <div className="p-6 md:p-8 pb-4 flex justify-between items-start bg-slate-50 border-b border-slate-100 shrink-0">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: `${selectedStory.color}15` }}>
                  <selectedStory.icon size={14} style={{ color: selectedStory.color }} />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: selectedStory.color }}>Hoja de Ruta: Historias</span>
                </div>
                <h2 className="text-2xl font-black text-[#142d53] leading-tight tracking-tighter">{selectedStory.title}</h2>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-10 custom-scrollbar">
              {selectedStory.sequence.map((step: any, idx: number) => (
                <section key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-[11px] shrink-0 shadow-lg" style={{ backgroundColor: selectedStory.color }}>{idx + 1}</div>
                    <h4 className="text-[11px] font-black text-[#142d53] uppercase tracking-[0.2em]">{step.title}</h4>
                  </div>

                  <div className="space-y-3 pl-11">
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100  text-[#142d53] font-medium text-sm leading-relaxed relative text-left">
                      <div className="absolute -left-2 top-4 w-1 h-8 rounded-full" style={{ backgroundColor: selectedStory.color }} />
                      <span className="text-[8px] font-bold text-slate-400 uppercase block mb-2 tracking-widest ">Guion Sugerido:</span>
                      "{step.script}"
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-[#142d53]/5 rounded-2xl border border-[#142d53]/5">
                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Lo que se ve:</span>
                        <p className="text-sm font-bold text-[#142d53] leading-snug">{step.desc}</p>
                      </div>
                      <div className="p-4 bg-[#48c1d2]/5 rounded-2xl border border-[#48c1d2]/10">
                        <span className="text-[9px] font-black text-[#48c1d2] uppercase block mb-1 tracking-widest">Pro Tip:</span>
                        <p className="text-sm font-bold text-slate-500  leading-snug">{step.tips}</p>
                      </div>
                    </div>
                  </div>
                </section>
              ))}

              <div className="p-8 bg-[#142d53] rounded-[3rem] text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                  <selectedStory.icon size={80} className="text-white" />
                </div>
                <p className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[0.3em] mb-2 relative z-10">Misión de Marca</p>
                <p className="text-base font-medium text-white  relative z-10 leading-tight">"Haz que la gente confíe en el hombre detrás de la máquina."</p>
              </div>
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/50 shrink-0">
              <button onClick={handleCloseStory} className="w-full py-5 bg-[#142d53] text-[#48c1d2] text-xs font-black uppercase tracking-[2px] rounded-2xl shadow-xl shadow-[#142d53]/20 transition-all active:scale-95 border-b-4 border-black">¡ENTENDIDO, A GRABAR!</button>
            </div>
          </div>
        </div>, document.body
      )}
      {selectedProduction && (
        <FichaProduccionModal
          post={selectedProduction}
          onClose={() => setSelectedProduction(null)}
          onToggleStatus={() => toggleGlobalStatus(selectedProduction.day)}
          onSave={saveProduction}
        />
      )}
      <Toast isVisible={toast.isVisible} message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, isVisible: false })} />

      {showAudioReport && createPortal(
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 md:p-8 overflow-hidden">
          <div 
            onClick={reportSentSuccessfully ? undefined : handleCloseAudioReport}
            className={`absolute inset-0 bg-[#0a192f]/90 ${isClosingAudioReport ? 'modal-backdrop-out' : 'modal-backdrop'}`}
          />
          <div 
            onClick={e => e.stopPropagation()}
            className={`relative z-10 bg-[#0a192f]/95 w-full max-w-xl md:max-w-2xl max-h-[calc(100vh-8rem)] rounded-[2rem] md:rounded-[40px] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[92vh] md:max-h-[90vh] my-auto overflow-hidden ${isClosingAudioReport ? 'modal-panel-out' : 'modal-panel'}`}>
            {reportSentSuccessfully ? (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 animate-in zoom-in-95 duration-300">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#48c1d2]/20 to-emerald-500/20 border border-[#48c1d2]/40 flex items-center justify-center text-3xl shadow-2xl relative group shrink-0">
                  <div className="absolute inset-0 bg-[#48c1d2]/20 rounded-[2rem] blur-xl opacity-60 animate-pulse pointer-events-none" />
                  🗣️
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">
                    ¡Reporte Enviado <span className="text-[#48c1d2]">con éxito!</span>
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                    el equipo de edición ya tiene tu audio y está listo para crear videos geniales 🚀
                  </p>
                </div>

                <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] max-w-md text-left relative overflow-hidden">
                  <p className="text-xs font-bold text-white/80 leading-relaxed">
                    Tu reporte diario respondiendo las preguntas ha sido registrado en nuestra base de datos.
                    Hemos guardado una copia en tu <strong>Historial de Audios</strong> por si quieres escucharla o descargarla después. ¡No necesitas hacer nada más!
                  </p>
                </div>

                <button
                  onClick={handleCloseAudioReport}
                  style={{ paddingTop: '20px', paddingBottom: '20px' }}
                  className="w-full max-w-xs rounded-full text-xs font-black uppercase tracking-[3px] bg-[#48c1d2] text-[#142d53] shadow-xl shadow-[#48c1d2]/20 hover:scale-[1.02] active:scale-98 transition-all"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <>
            <div className="p-6 md:p-10 pb-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-black/40 to-transparent text-left relative z-20 shrink-0">
              <div>
                <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[4px] mb-2 block  opacity-70">Módulo de Mentoría Narrativa</span>
                <h2 className="text-2xl font-black text-white  tracking-tighter leading-none">Tu Narración <span className="text-[#48c1d2]">del Día</span></h2>
              </div>
              <button onClick={handleCloseAudioReport} className="w-12 h-12 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center text-white/20 border border-white/10 transition-all"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8 pt-4 space-y-6 md:space-y-10">
              <div className={`bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-left relative transition-all shadow-inner ${(showHelp || (isOnboardingTour && tourStep === 2)) && reportHelpStep === 1 ? "z-50 bg-[#48c1d2]/10 border-[#48c1d2]/30 mt-32" : ""}`}>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-[#48c1d2]/20 to-transparent rounded-[2.5rem] blur opacity-30 pointer-events-none" />
                {(showHelp || (isOnboardingTour && tourStep === 2)) && reportHelpStep === 1 && (
                  <div className="absolute -top-36 left-1/2 -translate-x-1/2 bg-[#48c1d2] text-[#142d53] p-5 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-64 z-50 border-2 border-white/20 animate-in zoom-in duration-300 guide-bubble-active">
                    <div className="flex flex-col gap-2">
                      <span><strong>PASO 1:</strong> Abre tu Drive, mira tus capturas de hoy y prepárate para contarnos la historia detrás de cada imagen.</span>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAudioReport(false);
                            if (isOnboardingTour && tourStep === 2) {
                              setShowMissionModal(true);
                            } else {
                              setDashHelpStep(1);
                            }
                          }}
                          className="bg-[#142d53]/10 text-[#142d53] px-3 py-1.5 rounded-xl hover:bg-[#142d53]/20 transition-all text-[8px] border border-[#142d53]/20"
                        >
                          VOLVER
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setReportHelpStep(2); }}
                          className="bg-white text-[#48c1d2] px-3 py-1.5 rounded-xl hover:bg-teal-50 transition-colors text-[8px] border border-white/10 font-black"
                        >
                          SIGUIENTE
                        </button>
                      </div>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#48c1d2] rotate-45 border-r-2 border-b-2 border-white/20"></div>
                  </div>
                )}

                {/* RECORDATORIO STOP ENFÁTICO */}
                <div className="mb-8 p-6 bg-red-500/10 border-2 border-red-500/30 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                    <AlertCircle size={60} className="text-red-500" />
                  </div>
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg shrink-0 animate-pulse">
                      <span className="text-xl font-black">🛑</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-black text-white  tracking-tighter mb-1">¡STOP! Primero lo primero...</h3>
                      <p className="text-xs font-bold text-red-200/80 leading-relaxed ">
                        Antes de grabar este audio, asegúrate de haber subido tus fotos y videos al Drive. <span className="text-white underline decoration-2 underline-offset-2">Abre la carpeta, mírala</span> y cuéntanos la historia de lo que ves hoy.
                      </p>
                    </div>
                  </div>
                </div>

                <h4 className="text-[10px] font-black text-[#48c1d2] tracking-widest mb-2 flex items-center gap-2 ">
                  <Mic size={14} /> Guía de Narración (Basada en tus imágenes):
                </h4>
                <p className="text-[9px] font-bold text-white/40 tracking-widest mb-6 border-b border-white/5 pb-2">Tu detalle nos ayuda a crear historias que vendan tu esfuerzo y profesionalismo.</p>
                <div className="space-y-3">
                  {[
                    {
                      label: "EL GANCHO VISUAL",
                      q: "Viendo las fotos del 'Antes' que subiste... descríbenos qué tan grave era la situación. ¿Qué fue lo primero que pensaste al ver ese desastre?",
                      tip: "Hoy llegamos a una casa en Draper y el driveway estaba literalmente verde por el moho. Lo primero que pensé fue: 'Esto va a ser un cambio increíble para el video...'"
                    },
                    {
                      label: "LA DINÁMICA DEL EQUIPO",
                      q: "Si Jenkryfer sale en los videos hoy. Cuéntanos, ¿cómo se dividieron el trabajo en este proyecto específico? ¿Hubo alguna risa o momento curioso mientras grababan?",
                      tip: "Jenkryfer estuvo dándole a las ventanas mientras yo hacía el techo. Hubo un momento en que casi me empapa con la manguera por accidente y nos estuvimos riendo un buen rato."
                    },
                    {
                      label: "EL SECRETO DE LA TÉCNICA",
                      q: "En los videos donde sales usando la maquinaria... ¿qué es lo que la gente no sabe de manejar esa herramienta? ¿Qué es lo más difícil de lograr ese resultado que vemos?",
                      tip: "Mucha gente cree que es solo presión, pero el secreto está en el químico que aplicamos antes. Si no lo dejas actuar 10 minutos, la mancha de aceite no sale ni con toda la presión del mundo."
                    },
                    {
                      label: "LA SATISFACCIÓN DEL 'DESPUÉS'",
                      q: "Mira la foto del 'Después'. Es un cambio brutal. Si tuvieras que explicarle a un cliente por qué este resultado es superior a la competencia usando esa imagen, ¿qué le dirías?",
                      tip: "Mira este brillo. Esto no es solo limpieza, es protección. A diferencia de otros que solo tiran agua, nosotros sellamos el poro para que no se vuelva a ensuciar en meses."
                    },
                    {
                      label: "EL MOMENTO HUMANO",
                      q: "De todo lo que grabaste hoy en esa carpeta, ¿cuál es el clip que más te gusta y por qué? ¿Qué estaba pasando en ese momento?",
                      tip: "Hay un video de un perrito que se acercó a curiosear mientras recogíamos todo. Ese momento me recordó por qué me gusta trabajar en estos barrios tan tranquilos."
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-3 text-left">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-[#48c1d2]/20 text-[#48c1d2] flex items-center justify-center text-[10px] font-black">{idx + 1}</span>
                        <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">{item.label}</span>
                      </div>
                      <p className="text-xs font-bold text-white/70 leading-relaxed ">{item.q}</p>
                      <div className="p-3 bg-[#48c1d2]/10 border border-[#48c1d2]/20 rounded-xl text-left">
                        <p className="text-[10px] font-bold text-[#48c1d2] leading-relaxed ">
                          <span className="text-white/30 mr-1 ">Ejemplo:</span>
                          {item.tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`flex flex-col items-center justify-center py-10 space-y-8 relative transition-all ${(showHelp || (isOnboardingTour && tourStep === 2)) && reportHelpStep === 2 ? 'z-50 p-4 rounded-[3rem] bg-[#48c1d2]/5' : ''}`}>
                {(showHelp || (isOnboardingTour && tourStep === 2)) && reportHelpStep === 2 && <div className="absolute inset-0 rounded-[3rem] ring-4 ring-[#48c1d2] animate-pulse pointer-events-none" />}
                {(showHelp || (isOnboardingTour && tourStep === 2)) && reportHelpStep === 2 && (
                  <div className="absolute -top-40 right-0 bg-[#48c1d2] text-[#142d53] p-5 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-64 z-50 border-2 border-[#142d53]/20 animate-in zoom-in duration-300 guide-bubble-active">
                    <div className="flex flex-col gap-2">
                      <span><strong>PASO 2:</strong> Graba tu nota aquí. Puedes pausar si hay ruido o borrar si te equivocas. ¡Foco en el valor!</span>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={(e) => { e.stopPropagation(); setReportHelpStep(1); }}
                          className="bg-[#142d53]/10 text-[#142d53] px-3 py-1.5 rounded-xl hover:bg-[#142d53]/20 transition-all text-[8px] border border-[#142d53]/20"
                        >
                          VOLVER
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isOnboardingTour && tourStep === 2) {
                              setReportHelpStep(3);
                            } else {
                              setShowAudioReport(false);
                              setDashHelpStep(4);
                              handleTabChange('guiones');
                            }
                          }}
                          className="bg-[#142d53] text-[#48c1d2] px-3 py-1.5 rounded-xl hover:scale-105 transition-all text-[8px] font-black shadow-lg"
                        >
                          {isOnboardingTour && tourStep === 2 ? 'ENTENDIDO, A GRABAR' : 'SIGUIENTE'}
                        </button>
                      </div>
                    </div>
                    <div className="absolute -bottom-3 right-10 w-6 h-6 bg-[#48c1d2] rotate-45 border-r-2 border-b-2 border-[#142d53]/20"></div>
                  </div>
                )}

                {!recordedAudio ? (
                  <>
                    <div className="text-center mb-4 flex flex-col items-center">
                      <div className={`text-3xl font-mono font-black tabular-nums mb-2 ${recordTime >= 3600 ? 'text-[#48c1d2] animate-pulse' : 'text-[#48c1d2]'}`}>
                        {formatTime(recordTime)}
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <div className={`w-2 h-2 rounded-full ${isRecording && !isPaused ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {recordTime >= 3600 ? 'Límite alcanzado' : (isRecording ? (isPaused ? 'Pausado' : 'Grabando...') : 'Listo para Grabar Escenas')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {isRecording && (
                        <button
                          onClick={() => isPaused ? resumeRecording() : pauseRecording()}
                          className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all"
                        >
                          {isPaused ? <PlayCircle size={24} /> : <div className="flex gap-1"><div className="w-1.5 h-6 bg-white rounded-full"></div><div className="w-1.5 h-6 bg-white rounded-full"></div></div>}
                        </button>
                      )}

                      <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isRecording ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)] scale-110' : 'bg-[#48c1d2] shadow-[0_0_30px_rgba(72,193,210,0.2)] hover:scale-105'}`}>
                        <button
                          onClick={() => {
                            if (!isRecording) {
                              startRecording();
                            } else {
                              stopRecording();
                            }
                          }}
                          className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
                        >
                          {isRecording ? <div className="w-8 h-8 bg-white rounded-lg" /> : <Mic size={48} />}
                        </button>
                      </div>

                      {isRecording && (
                        <button
                          onClick={() => {
                            if (mediaRecorder.current) {
                              mediaRecorder.current.stop();
                              mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
                            }
                            setIsRecording(false);
                            setIsPaused(false);
                            setRecordTime(0);
                            setRecordedAudio(null);
                            setAudioBlob(null);
                            deleteDraftAudio();
                          }}
                          className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all"
                        >
                          <Trash2 size={24} />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full bg-black/40 p-6 rounded-[2.5rem] border border-white/5 space-y-6 animate-in zoom-in-95">
                    <div className="space-y-4">
                      <div className="px-2">
                        <label className="text-[9px] font-black text-[#48c1d2] uppercase tracking-widest block mb-2">Nombre de la Nota:</label>
                        <input 
                          type="text" 
                          value={reportTitle} 
                          onChange={(e) => setReportTitle(e.target.value)}
                          placeholder="Ej: Reporte Draper - Antes"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#48c1d2]/50 transition-all"
                        />
                      </div>
                      <CustomAudioPlayer title={reportTitle || "Tu Grabación"} src={recordedAudio} />
                      <div className="flex justify-between items-center px-2 mt-4">
                        <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-widest">Listo para enviar al equipo</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{formatTime(recordTime)}</span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setRecordedAudio(null);
                          setAudioBlob(null);
                          setRecordTime(0);
                          deleteDraftAudio();
                        }}
                        className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                      >
                        <Trash2 size={14} /> Borrar
                      </button>
                      <button
                        onClick={() => {
                          if (recordedAudio) {
                            forceDownload(recordedAudio, `Reporte_Epotech_${Date.now()}.wav`);
                          }
                        }}
                        className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                      >
                        <Download size={14} /> Descargar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 md:p-8 border-t border-white/5 bg-black/20 flex flex-col gap-4">
              {isOnboardingTour && tourStep === 2 && recordedAudio && (
                <div className="bg-[#48c1d2] text-[#142d53] p-5 rounded-3xl text-[10px] font-black shadow-lg border border-white/20 animate-in fade-in slide-in-from-bottom-4 text-left">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[11px] uppercase tracking-wider font-black">¡Toma Grabada con éxito! 🗣️</span>
                    <p className="leading-snug opacity-90 text-[10px]">
                      Puedes escuchar tu grabación arriba. Si estás conforme, haz clic en <strong>"ENVIAR AUDIO AL EQUIPO"</strong> abajo para finalizar el entrenamiento.
                    </p>
                  </div>
                </div>
              )}
              <button
                disabled={isRecording || isUploading || !recordedAudio}
                onClick={handleSendReport}
                className={`w-full py-5 rounded-[24px] text-xs font-black uppercase tracking-[3px] transition-all flex items-center justify-center gap-3 ${isRecording || isUploading || !recordedAudio ? 'bg-white/5 text-white/20' : 'bg-[#48c1d2] text-[#142d53] shadow-xl shadow-[#48c1d2]/20 active:scale-95'}`}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ENVIANDO AL EQUIPO...
                  </>
                ) : (
                  <>ENVIAR AUDIO AL EQUIPO</>
                )}
              </button>
            </div>
          </>
        )}
          </div>
        </div>, document.body
      )}
        </div>
      )}
      {mounted && onboardingSuccessModal.isOpen && createPortal(
        <div className="fixed inset-0 z-[22000] flex items-center justify-center p-4 md:p-6 bg-[#0a192f]/90 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300 content-transition">
          <div className="absolute inset-0" onClick={() => setOnboardingSuccessModal(prev => ({ ...prev, isOpen: false }))} />
          
          <div className="relative z-10 bg-[#0a192f]/95 w-full max-w-sm md:max-w-md rounded-[2.5rem] md:rounded-[3rem] border border-[#48c1d2]/20 shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-6 md:p-10 text-center flex flex-col items-center gap-4 md:gap-6 overflow-hidden my-auto animate-in zoom-in-95 duration-300">
            {/* Background glowing decoration */}
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#48c1d2]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#48c1d2]/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Success icon badge */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-[#48c1d2]/20 to-teal-500/20 border border-[#48c1d2]/40 flex items-center justify-center text-3xl md:text-4xl shadow-lg relative group shrink-0">
              <div className="absolute inset-0 bg-[#48c1d2]/20 rounded-[2rem] blur-xl opacity-50 animate-pulse pointer-events-none" />
              {onboardingSuccessModal.type === 'voice' ? '🎙️' : '🗣️'}
            </div>

            <div className="space-y-3 text-center">
              <h3 className="text-xl md:text-2xl font-black text-white  tracking-tighter uppercase leading-none">
                ¡Audio Enviado <span className="text-[#48c1d2]">con éxito!</span>
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                tu audio ya está en nuestra base de datos 🚀
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 p-5 md:p-6 rounded-[2rem] md:rounded-[2.5rem] text-left relative overflow-hidden">
              <p className="text-xs font-bold text-white/80 leading-relaxed ">
                {onboardingSuccessModal.type === 'voice' ? (
                  <>
                    Tu locución de voz en off para el guión de prueba ha sido subida correctamente. Recuerda que todos tus audios enviados se guardarán de forma permanente en tu <strong>Historial de Audios</strong> (disponible en la pestaña de Historial del menú izquierdo) para que puedas reproducirlos o descargarlos cuando gustes.
                  </>
                ) : (
                  <>
                    Tu reporte simulado respondiendo las 5 preguntas del día ha sido registrado con éxito. Todos tus reportes diarios de trabajo se archivan de manera automática en tu <strong>Historial de Audios</strong> para tu control, seguimiento y revisión por parte del equipo técnico.
                  </>
                )}
              </p>
            </div>

            <button
              onClick={() => {
                setOnboardingSuccessModal(prev => ({ ...prev, isOpen: false }));
                if (onboardingSuccessModal.type === 'voice') {
                  setSelectedScript(null);
                  setActiveMision(null);
                  setIsOnboardingTour(false);
                  setTourStep(0);
                  setTourSubStep(0);
                  handleTabChange('guiones');
                } else if (onboardingSuccessModal.type === 'report') {
                  setShowAudioReport(false);
                  setActiveMision(null);
                  setIsOnboardingTour(false);
                  setTourStep(0);
                  setTourSubStep(0);
                  handleTabChange('guiones');
                }
                setShowMissionModal(true);
              }}
              style={{ paddingTop: '20px', paddingBottom: '20px' }}
              className="w-full rounded-full text-xs font-black uppercase tracking-[3px] bg-[#48c1d2] text-[#142d53] shadow-xl shadow-[#48c1d2]/20 hover:scale-[1.02] active:scale-98 transition-all"
            >
              Entendido / Continuar
            </button>
          </div>
        </div>,
        document.body
      )}
      <ConfirmationDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

function FichaProduccionModal({ post, onClose, onToggleStatus, onSave }: { post: any, onClose: () => void, onToggleStatus: () => void, onSave: (updated: any) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [editedPost, setEditedPost] = useState(post);
  const handleSave = () => { onSave(editedPost); setIsEditing(false); };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[20000] flex items-center justify-center px-4 py-12 md:px-8 md:py-14 overflow-hidden">
      <div 
        onClick={handleClose}
        className={`absolute inset-0 bg-[#050c18]/90 ${isClosing ? 'modal-backdrop-out' : 'modal-backdrop'}`}
      />
      <div 
        onClick={e => e.stopPropagation()}
        style={{ backgroundColor: '#142d53' }} 
        className={`relative z-10 w-full max-w-[500px] rounded-[2rem] md:rounded-[2.5rem] shadow-2xl flex flex-col border border-white/10 overflow-hidden max-h-[82vh] md:max-h-[80vh] my-auto ${isClosing ? 'modal-panel-out' : 'modal-panel'}`}
      >
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-black/20 shrink-0">
          <div className="text-left flex-1 mr-4">
            <span className="text-[8px] font-bold text-[#48c1d2] tracking-[0.2em] mb-1 block">Ficha de Producción</span>
            {isEditing ? (
              <input className="bg-white/5 border border-[#48c1d2]/30 text-white font-bold  w-full p-2 rounded-xl text-lg outline-none" value={editedPost.title} onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })} />
            ) : (
              <h2 className="text-xl font-bold text-white  leading-none">{post.title}</h2>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(!isEditing)} className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isEditing ? 'bg-[#48c1d2] text-[#142d53] border-transparent' : 'bg-white/5 text-white border-white/5'}`}>{isEditing ? <CheckCircle2 size={20} /> : <Sparkles size={20} />}</button>
          </div>
        </div>
        <div className="p-8 space-y-6 overflow-y-auto max-h-[70vh] text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[7px] font-bold text-[#48c1d2] tracking-widest block mb-1">Objetivo</span>
              {isEditing ? (
                <input className="bg-transparent text-xs font-bold text-white w-full outline-none" value={editedPost.objetivo} onChange={(e) => setEditedPost({ ...editedPost, objetivo: e.target.value })} />
              ) : (
                <p className="text-xs font-bold text-white">{post.objetivo || 'Crecimiento'}</p>
              )}
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <span className="text-[7px] font-bold text-[#48c1d2] tracking-widest block mb-1">Formato</span>
              <p className="text-xs font-bold text-white">{post.type}</p>
            </div>
          </div>
          <section>
            <h4 className="text-[9px] font-bold text-[#48c1d2] tracking-[0.2em] mb-3">Idea Central</h4>
            <div className="p-5 bg-black/40 rounded-3xl border border-white/5">
              {isEditing ? (
                <textarea className="bg-transparent text-sm font-medium text-white  w-full min-h-[80px] outline-none" value={editedPost.desc} onChange={(e) => setEditedPost({ ...editedPost, desc: e.target.value })} />
              ) : (
                <p className="text-sm font-medium text-white/90 ">"{post.desc}"</p>
              )}
            </div>
          </section>
          <section className="space-y-4">
            <div>
              <h4 className="text-[9px] font-bold text-[#48c1d2] tracking-[0.2em] mb-3">Texto que Vende</h4>
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                {isEditing ? (
                  <textarea className="bg-transparent text-xs font-medium text-white/70  w-full min-h-[80px] outline-none" value={editedPost.copy} onChange={(e) => setEditedPost({ ...editedPost, copy: e.target.value })} />
                ) : (
                  <p className="text-xs font-medium text-white/70 ">{post.copy}</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-[9px] font-bold text-[#48c1d2] tracking-[0.2em] mb-3">Etiquetas (Hashtags)</h4>
              {isEditing ? (
                <input className="bg-black/20 text-[10px] font-mono text-[#48c1d2] w-full p-3 rounded-xl outline-none" value={editedPost.hashtags} onChange={(e) => setEditedPost({ ...editedPost, hashtags: e.target.value })} />
              ) : (
                <p className="text-[10px] font-mono text-[#48c1d2]/60 bg-black/20 p-3 rounded-xl">{post.hashtags}</p>
              )}
            </div>
          </section>
        </div>
        <div className="p-8 border-t border-white/10 bg-black/30 flex gap-3">
          {isEditing ? (
            <button onClick={handleSave} className="flex-1 py-4 bg-[#48c1d2] text-[#142d53] text-[10px] font-bold tracking-widest rounded-2xl shadow-lg">Guardar Cambios</button>
          ) : (
            <button onClick={onToggleStatus} className={`flex-1 py-4 rounded-2xl text-[10px] font-bold tracking-widest transition-all ${post.status === 'Publicado' ? 'bg-[#48c1d2] text-[#142d53]' : 'bg-white/10 text-white'}`}>{post.status}</button>
          )}
          <button onClick={handleClose} className="px-8 py-4 bg-white text-[#142d53] text-[10px] font-bold tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all">Cerrar</button>
        </div>
      </div>
    </div>, document.body
  );
}

function CreacionSection({ contentDB, toggleStatus, onSelect }: { contentDB: any, toggleStatus: (day: string) => void, onSelect: (key: string) => void }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().getDate().toString().padStart(2, '0'));
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const toggleExpand = (key: string) => { setExpandedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]); };

  const monthName = viewDate.toLocaleString('es-ES', { month: 'long' });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const currentYear = viewDate.getFullYear();
  const daysInMonth = new Date(currentYear, viewDate.getMonth() + 1, 0).getDate();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0');
    return { date: day, content: contentDB[day] };
  });

  const productionKeys = Object.keys(contentDB).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
        <div className="flex justify-between items-center mb-6 px-2">
          <div className="flex items-center gap-3">
            <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#142d53] hover:bg-slate-100 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <h4 className="text-[11px] font-black text-[#142d53] uppercase tracking-[0.2em]">{capitalizedMonth} {currentYear}</h4>
            <button onClick={handleNextMonth} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-[#142d53] hover:bg-slate-100 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
          <span className="text-[10px] font-bold text-slate-300 ">Epotech Hub</span>
        </div>
        <div className="grid grid-cols-7 gap-y-3 gap-x-1">
          {monthDays.map((d, i) => (
            <button key={i} onClick={() => setSelectedDate(d.date)} className={`relative h-10 flex flex-col items-center justify-center rounded-xl transition-all ${d.date === selectedDate ? 'bg-[#142d53] text-white' : 'hover:bg-slate-50'}`}>
              <span className={`text-[10px] font-bold ${d.date === selectedDate ? 'text-white' : 'text-slate-400'}`}>{d.date}</span>
              {d.content && <div className="w-1 h-1 rounded-full bg-[#48c1d2] mt-0.5" />}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 bg-white border-2 border-slate-100 rounded-[3rem] shadow-xl text-left space-y-6 animate-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-[#142d53] flex items-center justify-center text-[#48c1d2] shadow-lg shadow-[#142d53]/20"><Calendar size={20} /></div>
            <div>
              <h4 className="text-[9px] font-bold text-slate-400 tracking-widest mb-1">Estrategia Enfocada</h4>
              <p className="text-xl font-bold text-[#142d53]  tracking-tighter">Día {selectedDate} de {capitalizedMonth}</p>
            </div>
          </div>
          {contentDB[selectedDate] && <div className={`px-4 py-2 rounded-2xl text-[8px] font-bold ${contentDB[selectedDate].status === 'Publicado' ? 'bg-[#48c1d2] text-[#142d53]' : 'bg-slate-100 text-slate-400'}`}>{contentDB[selectedDate].status}</div>}
        </div>

        {contentDB[selectedDate] ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="text-[7px] font-bold text-slate-400 block mb-1">Objetivo</span><p className="text-xs font-bold text-[#142d53] ">{contentDB[selectedDate].objetivo}</p></div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="text-[7px] font-bold text-slate-400 block mb-1">Tipo</span><p className="text-xs font-bold text-[#142d53] ">{contentDB[selectedDate].type}</p></div>
            </div>
            <div className="space-y-3">
              <h5 className="text-[9px] font-bold text-[#142d53] tracking-widest ml-1">Concepto Central</h5>
              <div className="p-6 bg-[#142d53] rounded-[2.5rem]"><p className="text-sm font-medium text-white  leading-relaxed">"{contentDB[selectedDate].desc}"</p></div>
            </div>
            <div className="space-y-3">
              <h5 className="text-[9px] font-bold text-slate-400 tracking-widest ml-1">Texto que Vende</h5>
              <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <p className="text-xs font-medium text-slate-600  leading-snug mb-4">{contentDB[selectedDate].copy}</p>
                <p className="text-[10px] font-mono text-[#48c1d2] font-bold bg-[#142d53] p-3 rounded-xl inline-block">{contentDB[selectedDate].hashtags}</p>
              </div>
            </div>
            <button onClick={() => onSelect(selectedDate)} className="w-full py-4 bg-[#142d53] text-[#48c1d2] text-[10px] font-bold tracking-[0.2em] rounded-2xl shadow-xl">Editar Estrategia</button>
          </div>
        ) : <div className="py-20 flex flex-col items-center justify-center text-slate-300 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200"><Calendar size={40} className="opacity-20 mb-4" /><p className="text-[10px] font-bold tracking-widest  opacity-40">Día sin producción</p></div>}
      </div>

      <div className="space-y-6 text-left">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#48c1d2] flex items-center justify-center text-[#142d53] shadow-lg shadow-[#48c1d2]/20"><Sparkles size={16} /></div>
          <h3 className="text-xl font-bold text-[#142d53] ">Próximos contenidos</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 items-start">
          {productionKeys.map((key) => {
            const post = contentDB[key];
            const isExpanded = expandedKeys.includes(key);
            return (
              <div key={key} style={{ backgroundColor: '#142d53' }} className="p-5 rounded-[2.5rem] shadow-xl flex flex-col gap-3 border border-white/5 relative overflow-hidden transition-all duration-500">
                <div className="relative z-10 text-left space-y-3 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-[7px] font-bold px-2 py-0.5 bg-[#48c1d2] text-[#142d53] rounded-full w-fit ">Día {key}</span>
                      <span className="text-[6px] font-bold text-[#48c1d2]/60 tracking-widest">{post.type}</span>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); toggleExpand(key); }} className="cursor-pointer w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#48c1d2] border border-white/5">{isExpanded ? <X size={14} /> : <Sparkles size={14} />}</div>
                  </div>
                  <h4 className="text-sm font-bold text-white  leading-tight tracking-tighter line-clamp-2">{post.title}</h4>
                  {isExpanded ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1.5"><h5 className="text-[7px] font-bold text-[#48c1d2] tracking-widest opacity-60">Concepto</h5><div className="p-3 bg-black/40 rounded-2xl border border-white/5"><p className="text-[10px] font-medium text-white  leading-tight">"{post.desc}"</p></div></div>
                      <div className="space-y-1.5"><h5 className="text-[7px] font-bold text-[#48c1d2] tracking-widest opacity-60">Texto Viral</h5><div className="p-3 bg-white/5 rounded-2xl border border-white/10"><p className="text-[10px] font-medium text-white/70  leading-snug mb-2">{post.copy}</p><p className="text-[9px] font-mono text-[#48c1d2] font-bold truncate">{post.hashtags}</p></div></div>
                      <div className="pt-2 flex flex-col gap-2">
                        <button onClick={() => onSelect(key)} className="w-full py-3 bg-white text-[#142d53] text-[9px] font-bold tracking-widest rounded-xl shadow-lg">Editar</button>
                        <button onClick={() => toggleStatus(key)} className={`w-full py-3 rounded-xl text-[8px] font-bold tracking-widest transition-all ${post.status === 'Publicado' ? 'bg-[#48c1d2] text-[#142d53]' : 'bg-white/10 text-white'}`}>{post.status}</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${post.status === 'Publicado' ? 'bg-[#48c1d2]' : 'bg-white/20'}`} /><span className="text-[7px] font-bold text-white/40 tracking-widest">{post.status}</span></div>
                      <button onClick={() => toggleExpand(key)} className="text-[8px] font-bold text-[#48c1d2] tracking-widest">Ver más</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
function HistorialSection({ contentDB, onSelect, showToast, activeTab, requestConfirm, initialSubTab = 'stats' }: { contentDB: any, onSelect: (key: string) => void, showToast: (msg: string, type?: ToastType) => void, activeTab: string, requestConfirm: (title: string, msg: string, onC: () => void, text?: string) => void, initialSubTab?: 'stats' | 'audios' }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Memoria de sub-vistas vía URL
  const viewParam = searchParams.get('view') as any;
  const monthParam = searchParams.get('m');
  const weekParam = searchParams.get('w');

  const [view, setView] = useState<'meses' | 'semanas' | 'dias' | 'analytics'>(viewParam || 'meses');
  const [selectedMonth, setSelectedMonth] = useState(monthParam || 'Abril');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(weekParam ? parseInt(weekParam) : null);

  const [selectedAnalyticsMonth, setSelectedAnalyticsMonth] = useState(monthParam || 'Abril');
  const [selectedAnalyticsWeek, setSelectedAnalyticsWeek] = useState(5);
  const [uploading, setUploading] = useState(false);
  const [isEditingAnalytics, setIsEditingAnalytics] = useState(false);
  const [historialSubTab, setHistorialSubTab] = useState<'stats' | 'audios'>(initialSubTab);

  useEffect(() => {
    setHistorialSubTab(initialSubTab);
  }, [initialSubTab]);

  // Sincronizar URL cuando cambian las vistas
  const updateUrl = (newView: string, m?: string, w?: string | number) => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : searchParams.toString());
    params.set('view', newView);
    if (m) params.set('m', m);
    if (w) params.set('w', w.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSetView = (newView: any) => {
    setView(newView);
    updateUrl(newView, selectedAnalyticsMonth, selectedAnalyticsWeek);
  };

  const handleSetMonth = (m: string) => {
    setSelectedAnalyticsMonth(m);
    setSelectedMonth(m);
    updateUrl(view, m, selectedAnalyticsWeek);
  };

  const handleSetWeek = (w: number, newView?: any) => {
    setSelectedAnalyticsWeek(w);
    setSelectedWeek(w);
    const targetView = newView || view;
    if (newView) setView(newView);
    updateUrl(targetView, selectedAnalyticsMonth, w);
  };

  const [audioReports, setAudioReports] = useState<any[]>([]);
  const [locuciones, setLocuciones] = useState<any[]>([]);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleUpdateReportTitle = async (reportId: string, newTitle: string) => {
    try {
      await supabase.from('reportes_audio').update({ titulo: newTitle }).eq('id', reportId);
      setAudioReports(prev => prev.map(r => r.id === reportId ? { ...r, titulo: newTitle } : r));
      setEditingItemId(null);
      showToast("Título del reporte actualizado", "success");
    } catch (err) {
      showToast("Error al actualizar título", "error");
    }
  };

  const toggleUsadoEnVideo = async (locId: string, current: boolean) => {
    await supabase.from('locuciones').update({ usado_en_video: !current }).eq('id', locId);
    setLocuciones(prev => prev.map(l => l.id === locId ? { ...l, usado_en_video: !current } : l));
  };

  const toggleUsadoReporte = async (reportId: string, current: boolean) => {
    await supabase.from('reportes_audio').update({ usado_en_video: !current }).eq('id', reportId);
    setAudioReports(prev => prev.map(r => r.id === reportId ? { ...r, usado_en_video: !current } : r));
  };

  const [vocesCamara, setVocesCamara] = useState<any[]>([]);

  const toggleUsadoVozCamara = async (id: string, current: boolean) => {
    await supabase.from('voces_camara').update({ usado_en_video: !current }).eq('id', id);
    setVocesCamara(prev => prev.map((v: any) => v.id === id ? { ...v, usado_en_video: !current } : v));
  };

  const handleDeleteVozCamara = async (id: string, audioUrl: string) => {
    requestConfirm(
      "¿Eliminar Voz?",
      "Se borrará el audio permanentemente. No se puede deshacer.",
      async () => {
        try {
          const fileName = audioUrl.split('/').pop();
          if (fileName) await supabase.storage.from('audios').remove([fileName]);
          await supabase.from('voces_camara').delete().eq('id', id);
          setVocesCamara(prev => prev.filter((v: any) => v.id !== id));
          showToast("Voz eliminada", "success");
        } catch {
          showToast("Error al eliminar", "error");
        }
      },
      "BORRAR DEFINITIVO"
    );
  };

  const handleUpdateLocucionTitle = async (locId: string, newTitle: string) => {
    try {
      await supabase.from('locuciones').update({ script_title: newTitle }).eq('id', locId);
      setLocuciones(prev => prev.map(l => l.id === locId ? { ...l, script_title: newTitle } : l));
      setEditingItemId(null);
      showToast("Título de la locución actualizado", "success");
    } catch (err) {
      showToast("Error al actualizar título", "error");
    }
  };

  const handleUpdateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      await supabase.from('reportes_audio').update({ estado: newStatus }).eq('id', reportId);
      setAudioReports(prev => prev.map(r => r.id === reportId ? { ...r, estado: newStatus } : r));
      showToast(`Estado actualizado a ${newStatus.toUpperCase()}`, "success");

      // NOTIFICACIÓN AUTOMÁTICA
      if (newStatus === 'completado') {
        fetch('/api/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: "¡Guiones Listos! 📝",
            mensaje: "Tu reporte de campo ha sido procesado. ¡Entra a grabar tus locuciones!"
          })
        }).catch(e => console.error("Push error:", e));
      }
    } catch (err) {
      showToast("Error al actualizar estado", "error");
    }
  };

  const handleUpdateLocucionStatus = async (locId: string, newStatus: string) => {
    try {
      await supabase.from('locuciones').update({ estado: newStatus }).eq('id', locId);
      setLocuciones(prev => prev.map(l => l.id === locId ? { ...l, estado: newStatus } : l));
      showToast(`Estado actualizado a ${newStatus.toUpperCase()}`, "success");

      // NOTIFICACIÓN AUTOMÁTICA
      if (newStatus === 'publicado') {
        fetch('/api/push', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            titulo: "¡Video Publicado! 🎬",
            mensaje: "Tu locución ya está en redes sociales. ¡Buen trabajo!"
          })
        }).catch(e => console.error("Push error:", e));
      }
    } catch (err) {
      showToast("Error al actualizar estado", "error");
    }
  };

  useEffect(() => {
    async function fetchAll() {
      const [{ data: reports }, { data: locs }, { data: voces }] = await Promise.all([
        supabase.from('reportes_audio').select('*').order('created_at', { ascending: false }),
        supabase.from('locuciones').select('*').order('created_at', { ascending: false }),
        supabase.from('voces_camara').select('*').order('created_at', { ascending: false })
      ]);
      if (reports) setAudioReports(reports);
      if (locs) setLocuciones(locs);
      if (voces) setVocesCamara(voces);
    }
    fetchAll();
  }, []);

  const handleDeleteReport = async (reportId: string, audioUrl: string) => {
    requestConfirm(
      "¿Eliminar Reporte?",
      "Esta acción borrará el audio permanentemente de la nube para ahorrar espacio. No se puede deshacer.",
      async () => {
        try {
          const fileName = audioUrl.split('/').pop();
          if (fileName) await supabase.storage.from('audios').remove([fileName]);
          await supabase.from('reportes_audio').delete().eq('id', reportId);
          setAudioReports(prev => prev.filter(r => r.id !== reportId));
          showToast("Reporte eliminado y espacio liberado", "success");
        } catch (err) {
          showToast("Error al eliminar", "error");
        }
      },
      "ELIMINAR AHORA"
    );
  };

  const handleDeleteLocucion = async (locId: string, audioUrl: string) => {
    requestConfirm(
      "¿Eliminar Locución?",
      "Se borrará el audio final de tu voz en off. Asegúrate de tener una copia si la necesitas.",
      async () => {
        try {
          const fileName = audioUrl.split('/').pop();
          if (fileName) await supabase.storage.from('audios').remove([fileName]);
          await supabase.from('locuciones').delete().eq('id', locId);
          setLocuciones(prev => prev.filter(l => l.id !== locId));
          showToast("Locución eliminada", "success");
        } catch (err) {
          showToast("Error al eliminar", "error");
        }
      },
      "BORRAR DEFINITIVO"
    );
  };

  const [analyticsTab, setAnalyticsTab] = useState<'reels' | 'account'>('reels');

  const publishedPosts = Object.entries(contentDB).filter(([_, post]: any) => post.status === 'Publicado').sort((a, b) => parseInt(b[0]) - parseInt(a[0]));
  const getWeek = (day: string) => { const d = parseInt(day); if (d <= 7) return 1; if (d <= 14) return 2; if (d <= 21) return 3; return 4; };
  const weeks = [1, 2, 3, 4];

  const [analytics, setAnalytics] = useState([
    {
      month: 'Abril 2026',
      week: 4,
      totalViews: '21.7k',
      topVideo: 'Utah Roof Wash in action',
      growth: '+14%',
      insights: '• ¡VIRALIDAD REAL! El video "Utah Roof Wash" alcanzó 21.7k vistas con una estrategia de LOOP PERFECTO.\n• FÓRMULA DE ÉXITO: Duración de 5 segundos + Clips ultra-dinámicos (<1s) que fuerzan la repetición.\n• ASMR SATISFACTORIO: El sonido de la hidrolavadora como protagonista genera una retención altísima.\n• RECOMENDACIÓN PRO: Repetir el formato POV corto (5-7s) en cada obra. La clave es la edición rápida y el sonido real del trabajo.',
      images_reels: [],
      images_account: [],
      alcance: '21 mil',
      seguidores: '11',
      interacciones: '360',
      repro_reels: '21.7k',
      compartidos: '15',
      guardados: '9'
    }
  ]);

  const [editedAnalytics, setEditedAnalytics] = useState(analytics[0]);

  // MODELO HÍBRIDO CONCIERGE: Carga datos de DB pero mantiene métricas profesionales como base
  useEffect(() => {
    async function loadWeeklyData() {
      try {
        const cleanMonth = selectedAnalyticsMonth.trim();
        const { data, error } = await supabase
          .from('analiticas')
          .select('*')
          .eq('mes', cleanMonth)
          .eq('semana', selectedAnalyticsWeek)
          .maybeSingle();

        if (error) console.error("Supabase Load Error:", error);

        if (data) {
          setAnalytics(prev => [{
            ...prev[0],
            totalViews: data.vistas_totales || '0',
            repro_reels: data.reproducciones_reels || '0',
            interacciones: data.interacciones_cuenta || '0',
            alcance: data.alcance_cuenta || '0',
            seguidores: data.seguidores_totales || '0',
            compartidos: data.compartidos_reels || '0',
            guardados: data.guardados_reels || '0',
            insights: data.insights || '',
            images_reels: (Array.isArray(data.captura_url) ? data.captura_url : (data.captura_url ? [data.captura_url] : [])).filter(Boolean),
            images_account: (Array.isArray(data.captura_cuenta_url) ? data.captura_cuenta_url : (data.captura_cuenta_url ? [data.captura_cuenta_url] : [])).filter(Boolean)
          }]);
        } else {
          // Resetear a ceros si no hay datos
          setAnalytics(prev => [{
            ...prev[0],
            totalViews: '0',
            repro_reels: '0',
            interacciones: '0',
            alcance: '0',
            seguidores: '0',
            compartidos: '0',
            guardados: '0',
            insights: '',
            images_reels: [],
            images_account: []
          }]);
        }

        // MILESTONE OVERRIDE: Priorizar éxito viral de Abril
        if (cleanMonth === 'Abril') {
          setAnalytics(prev => [{
            ...prev[0],
            totalViews: '21.7k',
            repro_reels: '21.7k',
            interacciones: '360',
            alcance: '21 mil',
            seguidores: '11',
            totalCuenta: '85',
            insights: '• ¡VIRALIDAD REAL! El video "Utah Roof Wash" alcanzó 21.7k vistas con una estrategia de LOOP PERFECTO.\n• FÓRMULA DE ÉXITO: Duración de 5 segundos + Clips ultra-dinámicos (<1s) que fuerzan la repetición.\n• ASMR SATISFACTORIO: El sonido de la hidrolavadora como protagonista genera una retención altísima.\n• RECOMENDACIÓN PRO: Repetir el formato POV corto (5-7s) en cada obra. La clave es la edición rápida y el sonido real del trabajo.'
          }]);
        }
      } catch (err) {
        console.error("Critical Load Error:", err);
      }
    }
    loadWeeklyData();
  }, [selectedAnalyticsMonth, selectedAnalyticsWeek]);

  useEffect(() => {
    const defaultInsights = '• ¡VIRALIDAD ALCANZADA! El video POV "Walking on a masterpiece" rompió el algoritmo con 22.6k vistas.\n• La clave fue el GANCHO VISUAL: La gente se detiene por el contraste y la sensación de lujo.\n• REPLICAR EL ÉXITO: Necesitamos más tomas inmersivas 0.5x caminando sobre los acabados finales.\n• AUDIENCIA PREMIUM: Hemos atraído seguidores de cuentas verificadas, elevando el estatus de la marca.';

    if (!analytics[0].insights || analytics[0].insights.includes('rompiendo la burbuja')) {
      setAnalytics(prev => [{ ...prev[0], insights: defaultInsights }]);
    }
  }, [selectedAnalyticsMonth, selectedAnalyticsWeek]);

  const handleSaveAnalytics = async () => {
    try {
      const { error } = await supabase
        .from('analiticas')
        .upsert({
          mes: selectedAnalyticsMonth,
          semana: selectedAnalyticsWeek,
          vistas_totales: editedAnalytics.totalViews,
          crecimiento: editedAnalytics.growth,
          insights: editedAnalytics.insights,
          video_top: editedAnalytics.topVideo,
          alcance_cuenta: editedAnalytics.alcance,
          seguidores_totales: editedAnalytics.seguidores,
          interacciones_cuenta: editedAnalytics.interacciones,
          reproducciones_reels: editedAnalytics.repro_reels,
          compartidos_reels: editedAnalytics.compartidos,
          guardados_reels: editedAnalytics.guardados,
          captura_url: analytics[0].images_reels[0] || '',
          captura_cuenta_url: analytics[0].images_account[0] || ''
        }, { onConflict: 'mes,semana' });

      if (error) throw error;

      setAnalytics([editedAnalytics]);
      setIsEditingAnalytics(false);
      showToast("¡Análisis estratégico guardado!", "success");
    } catch (err: any) {
      showToast("Error al guardar: " + err.message, "error");
    }
  };

  const processImageWithOCR = async (file: File, type: 'reels' | 'account') => {
    showToast(`Escaneando datos de ${type === 'reels' ? 'Reels' : 'Cuenta'}...`, "info");
    try {
      const result = await Tesseract.recognize(file, 'spa+eng');
      const text = result.data.text.toLowerCase();
      console.log("OCR Result:", text);

      setAnalytics(prev => {
        const next = { ...prev[0] };

        if (type === 'reels') {
          // Capturar Reproducciones (Ej: "6 mil" o "2.2 mil")
          const reproMatch = text.match(/(reproducciones|reproducciones de reels)\s*([\d,.]+)\s*(mil|m)?/);
          if (reproMatch) {
            let val = reproMatch[2].replace(',', '.');
            if (reproMatch[3] === 'mil') val = (parseFloat(val) * 1000).toString();
            next.repro_reels = val;
            next.totalViews = val;
          }

          // Capturar Visualizaciones
          const viewsMatch = text.match(/(visualizaciones)\s*([\d,.]+)\s*(mil|m)?/);
          if (viewsMatch) {
            let val = viewsMatch[2].replace(',', '.');
            if (viewsMatch[3] === 'mil') val = (parseFloat(val) * 1000).toString();
            next.totalViews = val;
          }

          // Capturar Compartidos y Guardados
          const sharedMatch = text.match(/(compartido|reposts)\s*([\d,.]+)/);
          if (sharedMatch) next.compartidos = sharedMatch[2];

          const savedMatch = text.match(/(guardados|guardado)\s*([\d,.]+)/);
          if (savedMatch) next.guardados = savedMatch[2];
        } else {
          // Capturar Alcance y Seguidores
          const alcanceMatch = text.match(/(alcance|cuentas alcanzadas)\s*([\d,.]+)/);
          if (alcanceMatch) next.interacciones = alcanceMatch[2];

          const followersMatch = text.match(/(seguidores|seguidores ganados)\s*([\d,.]+)/);
          if (followersMatch) next.seguidores = followersMatch[2];
        }

        return [next];
      });

      showToast("¡Datos extraídos con éxito!", "success");
    } catch (err) {
      console.error("OCR Error:", err);
      showToast("No se pudo extraer texto de la imagen", "info");
    }
  };

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const uploadFile = async (file: File) => {
    setUploading(true);
    processImageWithOCR(file, analyticsTab);

    try {
      const fileName = `analiticas/${selectedAnalyticsMonth}/semana-${selectedAnalyticsWeek}-${analyticsTab}-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

      const { data, error: uploadError } = await supabase.storage
        .from('analytics_screenshots')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('analytics_screenshots')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Actualización funcional para evitar colisiones
      const isReels = analyticsTab === 'reels';
      const cleanMonth = selectedAnalyticsMonth.trim();

      console.log(`Intentando guardar en DB: ${cleanMonth}, Semana ${selectedAnalyticsWeek}, Columna: ${isReels ? 'captura_url' : 'captura_cuenta_url'}`);

      // Guardar en DB inmediatamente con el PAQUETE COMPLETO para evitar errores de columnas requeridas
      const { error: dbError } = await supabase.from('analiticas').upsert({
        mes: cleanMonth,
        semana: selectedAnalyticsWeek,
        vistas_totales: analytics[0].totalViews,
        reproducciones_reels: analytics[0].repro_reels,
        interacciones_cuenta: analytics[0].interacciones,
        seguidores_totales: analytics[0].seguidores,
        compartidos_reels: analytics[0].compartidos,
        guardados_reels: analytics[0].guardados,
        insights: analytics[0].insights,
        [isReels ? 'captura_url' : 'captura_cuenta_url']: [publicUrl]
      }, { onConflict: 'mes,semana' });

      if (dbError) {
        console.error("Error detallado de Supabase:", dbError.message || dbError);
        throw new Error(dbError.message || "Error desconocido en la base de datos");
      }

      setAnalytics(prevAnalytics => {
        const updatedReport = {
          ...prevAnalytics[0],
          [isReels ? 'images_reels' : 'images_account']: [publicUrl]
        };
        return [updatedReport];
      });

      console.log("¡Guardado exitoso en DB!");
      showToast("¡Captura guardada!", "success");
      return publicUrl;
    } catch (err: any) {
      showToast("Error en la subida: " + err.message, "error");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      await uploadFile(files[i]);
    }
    // Limpiar el input para permitir subir la misma foto si fuera necesario
    e.target.value = '';
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) await uploadFile(file);
      }
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type.startsWith('image/')) {
          await uploadFile(files[i]);
        }
      }
    }
  };

  const handleDeleteImage = async () => {
    const isReels = analyticsTab === 'reels';
    const currentImages = isReels ? [...analytics[0].images_reels] : [...analytics[0].images_account];
    if (currentImages.length === 0) return;

    try {
      setUploading(true);
      const cleanMonth = selectedAnalyticsMonth.trim();

      // En nuestro modelo simplificado, borrar significa poner un array vacío o null
      const updateData: any = {
        mes: cleanMonth,
        semana: selectedAnalyticsWeek,
        [isReels ? 'captura_url' : 'captura_cuenta_url']: []
      };

      const { error } = await supabase.from('analiticas').upsert(updateData, { onConflict: 'mes,semana' });
      if (error) throw error;

      setAnalytics(prev => [{
        ...prev[0],
        [isReels ? 'images_reels' : 'images_account']: []
      }]);

      showToast("Captura eliminada", "success");
    } catch (err: any) {
      console.error("Delete error:", err);
      showToast("Error al eliminar", "error");
    } finally {
      setUploading(false);
    }
  };



  if (view === 'meses') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 text-left pb-10">
        {/* SUB-NAVEGACIÓN DEL HISTORIAL */}
        <div className="flex bg-slate-100/80 backdrop-blur-md p-1.5 rounded-[2.2rem] sticky top-0 z-20 border border-slate-200/50 shadow-[0_4px_20px_rgba(20,45,83,0.04)] mb-6">
          <button
            onClick={() => setHistorialSubTab('stats')}
            className={`group flex-1 py-3.5 px-6 rounded-[1.8rem] text-[10px] font-black tracking-[2.5px] uppercase transition-all duration-300 ease-out flex items-center justify-center gap-2 ${
              historialSubTab === 'stats'
                ? 'bg-gradient-to-r from-[#142d53] to-[#1e3c66] text-[#48c1d2] border border-[#48c1d2]/25 shadow-[0_8px_30px_rgba(20,45,83,0.25),_0_0_15px_rgba(72,193,210,0.15)] scale-[1.01]'
                : 'text-slate-400 hover:text-[#142d53] hover:bg-white/60 hover:shadow-sm'
            }`}
          >
            <TrendingUp 
              size={15} 
              className={`transition-all duration-300 ${
                historialSubTab === 'stats' 
                  ? 'animate-pulse text-[#48c1d2] scale-110' 
                  : 'group-hover:translate-y-[-1px] group-hover:translate-x-[1px]'
              }`}
            /> 
            <span>ESTADÍSTICAS</span>
          </button>
          <button
            onClick={() => setHistorialSubTab('audios')}
            className={`group flex-1 py-3.5 px-6 rounded-[1.8rem] text-[10px] font-black tracking-[2.5px] uppercase transition-all duration-300 ease-out flex items-center justify-center gap-2 ${
              historialSubTab === 'audios'
                ? 'bg-gradient-to-r from-[#142d53] to-[#1e3c66] text-[#48c1d2] border border-[#48c1d2]/25 shadow-[0_8px_30px_rgba(20,45,83,0.25),_0_0_15px_rgba(72,193,210,0.15)] scale-[1.01]'
                : 'text-slate-400 hover:text-[#142d53] hover:bg-white/60 hover:shadow-sm'
            }`}
          >
            <Mic 
              size={15} 
              className={`transition-all duration-300 ${
                historialSubTab === 'audios' 
                  ? 'animate-pulse text-[#48c1d2] scale-110' 
                  : 'group-hover:scale-110 group-hover:rotate-[3deg]'
              }`}
            /> 
            <span>HISTORIAL DE AUDIOS</span>
          </button>
        </div>

        {historialSubTab === 'stats' ? (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <h3 className="text-3xl font-black text-[#142d53] tracking-tighter">LABORATORIO DE ÉXITO</h3>
                <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                  {selectedAnalyticsMonth === 'Abril' ? 'rango: 30 mar - 29 abr' : 'reporte estratégico mensual'}
                </p>
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['Abril', 'Mayo', 'Junio'].map(m => (
                  <button
                    key={m}
                    onClick={() => handleSetMonth(m)}
                    className={`flex-1 px-4 py-3 rounded-xl text-[11px] font-black tracking-[2px] transition-all ${selectedAnalyticsMonth === m ? 'bg-[#142d53] text-[#48c1d2] shadow-lg scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 items-start">
              {/* Visualizador de Galería Vertical */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative group bg-white rounded-[3rem] p-4 border-8 transition-all duration-300 ${isDragging ? 'border-[#48c1d2] scale-[1.02] shadow-[0_0_50px_rgba(72,193,210,0.3)]' : 'border-slate-50 shadow-2xl'}`}
              >
                {analytics[0].images_reels?.length > 0 ? (
                  <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group/img">
                    <img
                      src={analytics[0].images_reels[0]}
                      alt="Reporte Oficial"
                      className="w-full h-auto block"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col justify-end p-8 gap-3">
                      <label className="w-full py-4 bg-[#48c1d2] text-[#142d53] text-[10px] font-black rounded-2xl tracking-widest shadow-xl cursor-pointer text-center hover:scale-105 transition-all">
                        actualizar captura
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                      </label>
                      <button
                        onClick={handleDeleteImage}
                        className="w-full py-4 bg-red-500/80 backdrop-blur-md text-white text-[10px] font-black rounded-2xl tracking-widest shadow-xl hover:bg-red-600 transition-all"
                      >
                        eliminar captura
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-12 text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6">
                      <TrendingUp size={40} className="opacity-30" />
                    </div>
                    <h5 className="text-sm font-black text-slate-500 mb-2">reporte estratégico semanal</h5>
                    <label className="px-8 py-4 bg-[#142d53] text-[#48c1d2] text-[10px] font-black rounded-2xl tracking-widest shadow-2xl cursor-pointer hover:scale-105 transition-all flex items-center gap-3">
                      <Plus size={16} /> subir captura
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                  </div>
                )}
              </div>

              {/* Datos Editables */}
              <div className="space-y-6 flex flex-col">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Video size={40} className="text-[#142d53]" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 tracking-widest block mb-1 uppercase">impacto visual</span>
                    <p className="text-2xl font-black text-[#142d53] tracking-tighter">{analytics[0].totalViews}</p>
                    <div className="mt-2 text-xs font-bold text-slate-400 leading-tight tracking-widest uppercase">
                      reproducciones totales
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Users size={40} className="text-[#48c1d2]" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 tracking-widest block mb-1 uppercase">alcance real</span>
                    <p className="text-2xl font-black text-[#48c1d2] tracking-tighter">{analytics[0].alcance}</p>
                    <div className="mt-2 text-xs font-bold text-green-600 leading-tight tracking-widest uppercase">
                      personas únicas
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <User size={40} className="text-blue-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 tracking-widest block mb-1 uppercase">interés comercial</span>
                    <p className="text-2xl font-black text-blue-500 tracking-tighter">{analytics[0].interacciones}</p>
                    <div className="mt-2 text-xs font-bold text-blue-400 leading-tight tracking-widest uppercase">
                      visitas al perfil
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Share2 size={40} className="text-purple-500" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 tracking-widest block mb-1 uppercase">factor viral</span>
                    <p className="text-2xl font-black text-purple-500 tracking-tighter">{parseInt(analytics[0].compartidos) + parseInt(analytics[0].guardados) || 0}</p>
                    <div className="mt-2 text-xs font-bold text-purple-400 leading-tight tracking-widest uppercase">
                      recomendaciones
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-[#142d53] rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#48c1d2]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-[#48c1d2] flex items-center justify-center text-[#142d53] shadow-lg shadow-[#48c1d2]/20">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#48c1d2] tracking-[0.2em] uppercase">análisis de la estratega</h4>
                        <p className="text-[10px] font-bold text-white/30 tracking-[0.4em] mt-1 uppercase">foco: prospección masiva</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {analytics[0].insights ? analytics[0].insights.split('\n').map((line, i) => (
                        <p key={i} className="text-xl font-bold text-white leading-tight flex gap-3 text-left">
                          <span className="text-[#48c1d2] shrink-0">•</span>
                          <span>{line.replace(/^•\s*/, '')}</span>
                        </p>
                      )) : (
                        <p className="text-sm font-bold text-white/40 ">pendiente de análisis estratégico...</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl text-left relative overflow-hidden flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 tracking-widest block mb-1 uppercase">crecimiento de comunidad</span>
                    <p className="text-2xl font-black text-[#48c1d2] tracking-tighter">+{analytics[0].seguidores} seguidores ganados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
            {/* === ARCHIVO DE AUDIO: TU REPORTE PRO === */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#142d53] rounded-xl flex items-center justify-center">
                    <Mic size={14} className="text-[#48c1d2]" />
                  </div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Notas de tu trabajo</h3>
                </div>
                <span className="text-[9px] font-black text-[#48c1d2] bg-[#48c1d2]/10 px-3 py-1 rounded-full">{audioReports.length} nota{audioReports.length !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed px-1">
                En esta sección vas a poder encontrar el historial de todas las notas en donde tú nos has enviado las respuestas a las preguntas clave después de finalizar un trabajo.
              </p>

              {audioReports.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aún no hay reportes enviados</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {audioReports.map((report: any) => {
                    const status = report.estado || 'pendiente';
                    const usadoR = report.usado_en_video === true;
                    const statusStyles =
                      status === 'completado' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      status === 'en_proceso' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      'bg-slate-500/20 text-slate-400 border-slate-500/30';
                    const statusLabel =
                      status === 'completado' ? 'GUIONES LISTOS' :
                      status === 'en_proceso' ? 'PROCESANDO' :
                      'RECIBIDO';

                    return (
                    <div key={report.id} className={`p-4 rounded-[2rem] border space-y-3 transition-all ${usadoR ? 'bg-[#48c1d2]/20 border-[#48c1d2]' : 'bg-[#142d53] border-white/10'}`}>
                      <div className="flex items-center justify-between px-1">
                        <div className="flex-1 mr-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${usadoR ? 'text-[#142d53]' : 'text-[#48c1d2]'}`}>Reporte de Campo</span>
                            <span className={`text-[7px] font-black px-2 py-0.5 rounded-full border animate-pulse ${usadoR ? 'bg-[#142d53]/10 text-[#142d53] border-[#142d53]/20' : statusStyles}`}>
                              {statusLabel}
                            </span>
                          </div>
                          {editingItemId === report.id ? (
                            <div className="space-y-2 mt-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  className={`flex-1 border rounded-lg px-2 py-1 text-xs font-bold outline-none ${usadoR ? 'bg-white/60 border-[#142d53]/20 text-[#142d53]' : 'bg-white/5 border-[#48c1d2]/30 text-white'}`}
                                  autoFocus
                                />
                                <button onClick={() => handleUpdateReportTitle(report.id, editingTitle)} className="p-1.5 bg-[#48c1d2] text-[#142d53] rounded-lg"><CheckCircle2 size={12} /></button>
                                <button onClick={() => setEditingItemId(null)} className={`p-1.5 rounded-lg ${usadoR ? 'bg-[#142d53]/10 text-[#142d53]/40' : 'bg-white/5 text-white/40'}`}><X size={12} /></button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[7px] font-black uppercase tracking-widest ${usadoR ? 'text-[#142d53]/50' : 'text-white/30'}`}>Cambiar Estado:</span>
                                <select
                                  value={report.estado || 'pendiente'}
                                  onChange={(e) => handleUpdateReportStatus(report.id, e.target.value)}
                                  className={`border rounded-lg px-2 py-1 text-[8px] font-bold text-[#48c1d2] outline-none ${usadoR ? 'bg-white/40 border-[#142d53]/10' : 'bg-white/5 border-white/10'}`}
                                >
                                  <option value="pendiente" className="bg-[#142d53]">RECIBIDO</option>
                                  <option value="en_proceso" className="bg-[#142d53]">PROCESANDO</option>
                                  <option value="completado" className="bg-[#142d53]">GUIONES LISTOS</option>
                                </select>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group/title">
                              <p className={`text-[11px] font-bold uppercase ${usadoR ? 'text-[#142d53]' : 'text-white/90'}`}>{report.titulo || 'Sin Título'}</p>
                              <button
                                onClick={() => { setEditingItemId(report.id); setEditingTitle(report.titulo || ''); }}
                                className={`p-1.5 rounded-lg transition-all ml-1 ${usadoR ? 'bg-[#142d53]/10 text-[#142d53] hover:bg-[#142d53]/20' : 'bg-white/5 text-[#48c1d2] hover:bg-[#48c1d2]/20'}`}
                                title="Editar nombre"
                              >
                                <Edit3 size={10} />
                              </button>
                            </div>
                          )}
                          <p className={`text-[9px] font-bold uppercase mt-0.5 ${usadoR ? 'text-[#142d53]/50' : 'text-white/40'}`}>{new Date(report.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className={`text-[9px] font-bold uppercase whitespace-nowrap ${usadoR ? 'text-[#142d53]/50' : 'text-white/40'}`}>{report.duracion || ''}</span>
                          <button onClick={() => handleDeleteReport(report.id, report.audio_url)} className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center transition-all border border-red-500/20">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <CustomAudioPlayer title={report.titulo || "Reporte de Audio"} src={report.audio_url} light={usadoR} />
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleUsadoReporte(report.id, usadoR)}
                          className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${usadoR ? 'bg-[#48c1d2]/20 text-[#142d53] border-[#48c1d2]/40 hover:bg-[#48c1d2]/30' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80'}`}
                        >
                          <CheckCircle size={12} /> {usadoR ? '✓ Usado en video' : 'Marcar como usado'}
                        </button>
                        <button
                          onClick={() => forceDownload(report.audio_url, `Reporte_Audio_${report.id}.wav`)}
                          className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${usadoR ? 'bg-[#142d53]/10 text-[#142d53] border-[#142d53]/20 hover:bg-[#142d53]/20' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}`}
                        >
                          <Download size={12} />
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* === ARCHIVO DE AUDIO: LOCUCIONES DE GUIONES === */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#142d53] rounded-xl flex items-center justify-center">
                    <BookOpen size={14} className="text-[#48c1d2]" />
                  </div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Guiones Hablados</h3>
                </div>
                <span className="text-[9px] font-black text-[#48c1d2] bg-[#48c1d2]/10 px-3 py-1 rounded-full">{locuciones.length} locución{locuciones.length !== 1 ? 'es' : ''}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed px-1">
                En esta sección vas a poder encontrar todos los audios que has enviado al equipo sobre los guiones que te hemos dejado.
              </p>

              {locuciones.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aún no hay locuciones enviadas</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {locuciones.map((loc: any) => {
                    const status = loc.estado || 'recibido';
                    const usado = loc.usado_en_video === true;
                    const statusStyles =
                      status === 'publicado' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                      status === 'editando' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                      'bg-slate-500/20 text-slate-400 border-slate-500/30';
                    const statusLabel =
                      status === 'publicado' ? 'VIDEO PUBLICADO' :
                      status === 'editando' ? 'EN EDICIÓN' :
                      'VOZ ENVIADA';

                    return (
                    <div key={loc.id} className={`p-4 rounded-[2rem] border space-y-3 transition-all ${usado ? 'bg-[#48c1d2]/20 border-[#48c1d2]' : 'bg-[#142d53] border-[#48c1d2]/10'}`}>
                      <div className="flex items-center justify-between px-1">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase tracking-widest block ${usado ? 'text-[#142d53]' : 'text-[#48c1d2]'}`}>Locución</span>
                            <span className={`text-[7px] font-black px-2 py-0.5 rounded-full border ${usado ? 'bg-[#142d53]/10 text-[#142d53] border-[#142d53]/20' : statusStyles}`}>
                              {statusLabel}
                            </span>
                          </div>

                          {editingItemId === loc.id ? (
                            <div className="space-y-2 mt-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingTitle}
                                  onChange={(e) => setEditingTitle(e.target.value)}
                                  className={`flex-1 border rounded-lg px-2 py-1 text-xs font-bold outline-none ${usado ? 'bg-white/60 border-[#142d53]/20 text-[#142d53]' : 'bg-white/5 border-[#48c1d2]/30 text-white'}`}
                                  autoFocus
                                />
                                <button onClick={() => handleUpdateLocucionTitle(loc.id, editingTitle)} className="p-1.5 bg-[#48c1d2] text-[#142d53] rounded-lg"><CheckCircle2 size={12} /></button>
                                <button onClick={() => setEditingItemId(null)} className={`p-1.5 rounded-lg ${usado ? 'bg-[#142d53]/10 text-[#142d53]/40' : 'bg-white/5 text-white/40'}`}><X size={12} /></button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[7px] font-black uppercase tracking-widest ${usado ? 'text-[#142d53]/50' : 'text-white/30'}`}>Cambiar Estado:</span>
                                <select
                                  value={loc.estado || 'recibido'}
                                  onChange={(e) => handleUpdateLocucionStatus(loc.id, e.target.value)}
                                  className={`border rounded-lg px-2 py-1 text-[8px] font-bold text-[#48c1d2] outline-none ${usado ? 'bg-white/40 border-[#142d53]/10' : 'bg-white/5 border-white/10'}`}
                                >
                                  <option value="recibido" className="bg-[#142d53]">VOZ ENVIADA</option>
                                  <option value="editando" className="bg-[#142d53]">EN EDICIÓN</option>
                                  <option value="publicado" className="bg-[#142d53]">PUBLICADO</option>
                                </select>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group/title">
                              <p className={`text-sm font-black uppercase truncate leading-tight ${usado ? 'text-[#142d53]' : 'text-white'}`}>{loc.script_title}</p>
                              <button
                                onClick={() => { setEditingItemId(loc.id); setEditingTitle(loc.script_title || ''); }}
                                className={`p-1.5 rounded-lg transition-all ml-1 ${usado ? 'bg-[#142d53]/10 text-[#142d53] hover:bg-[#142d53]/20' : 'bg-white/5 text-[#48c1d2] hover:bg-[#48c1d2]/20'}`}
                                title="Editar nombre"
                              >
                                <Edit3 size={12} />
                              </button>
                            </div>
                          )}

                          <p className={`text-[10px] font-bold uppercase mt-0.5 ${usado ? 'text-[#142d53]/50' : 'text-white/40'}`}>{new Date(loc.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                        <button onClick={() => handleDeleteLocucion(loc.id, loc.audio_url)} className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center transition-all border border-red-500/20 shrink-0 ml-2">
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <CustomAudioPlayer title={loc.script_title} src={loc.audio_url} light={usado} />
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleUsadoEnVideo(loc.id, usado)}
                          className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${usado ? 'bg-[#48c1d2]/20 text-[#48c1d2] border-[#48c1d2]/40 hover:bg-[#48c1d2]/30' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80'}`}
                        >
                          <CheckCircle size={12} /> {usado ? '✓ Usado en video' : 'Marcar como usado'}
                        </button>
                        <button
                          onClick={() => forceDownload(loc.audio_url, `Locucion_${loc.id}.wav`)}
                          className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10"
                        >
                          <Download size={12} />
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* === VOCES EN OFF — GUIONES A CÁMARA === */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#142d53] rounded-xl flex items-center justify-center">
                    <Video size={14} className="text-[#48c1d2]" />
                  </div>
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Voces en Off — Guiones a Cámara</h3>
                </div>
                <span className="text-[9px] font-black text-[#48c1d2] bg-[#48c1d2]/10 px-3 py-1 rounded-full">{vocesCamara.length} audio{vocesCamara.length !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 leading-relaxed px-1">
                Voces en off grabadas dentro de los guiones de producción a cámara (escenas específicas que requieren audio separado).
              </p>

              {vocesCamara.length === 0 ? (
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aún no hay voces grabadas</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {vocesCamara.map((voz: any) => {
                    const usado = voz.usado_en_video === true;
                    return (
                      <div key={voz.id} className={`p-4 rounded-[2rem] border space-y-3 transition-all ${usado ? 'bg-[#48c1d2]/20 border-[#48c1d2]' : 'bg-[#142d53] border-[#48c1d2]/10'}`}>
                        <div className="flex items-start justify-between px-1">
                          <div className="flex-1 min-w-0">
                            <span className={`text-[10px] font-black uppercase tracking-widest block mb-0.5 ${usado ? 'text-[#142d53]' : 'text-[#48c1d2]'}`}>Voz en Off · Cámara</span>
                            <p className={`text-[11px] font-black uppercase truncate ${usado ? 'text-[#142d53]' : 'text-white'}`}>{voz.scene_title || voz.script_title || 'Sin título'}</p>
                            <p className={`text-[9px] font-bold uppercase mt-0.5 ${usado ? 'text-[#142d53]/50' : 'text-white/40'}`}>{new Date(voz.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <button onClick={() => handleDeleteVozCamara(voz.id, voz.audio_url)} className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center transition-all border border-red-500/20 shrink-0 ml-2">
                            <Trash2 size={12} />
                          </button>
                        </div>
                        <CustomAudioPlayer title={voz.scene_title || 'Voz en Off'} src={voz.audio_url} light={usado} />
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleUsadoVozCamara(voz.id, usado)}
                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${usado ? 'bg-[#48c1d2]/20 text-[#142d53] border-[#48c1d2]/40 hover:bg-[#48c1d2]/30' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white/80'}`}
                          >
                            <CheckCircle size={12} /> {usado ? '✓ Usado en video' : 'Marcar como usado'}
                          </button>
                          <button
                            onClick={() => forceDownload(voz.audio_url, `VozCamara_${voz.id}.wav`)}
                            className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${usado ? 'bg-[#142d53]/10 text-[#142d53] border-[#142d53]/20 hover:bg-[#142d53]/20' : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'}`}
                          >
                            <Download size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}



