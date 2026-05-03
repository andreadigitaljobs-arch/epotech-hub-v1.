"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Tesseract from 'tesseract.js';
import { motion, AnimatePresence } from "framer-motion";
import {
  Clapperboard,
  Calendar,
  X,
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
  ChevronDown,
  ChevronUp,
  Search,
  MessageSquare,
  Share2,
  Download,
  AlertCircle,
  CheckCircle,
  Info,
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
  Pause
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Toast, ToastType } from "@/components/ui/Toast";
import { guiones, guionesPresentacion, Script } from "@/data/scripts";
import { mergeBlobsToWav } from "./audioUtils";

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

const CustomAudioPlayer = ({ src, title = "Reporte de Audio" }: { src: string, title?: string }) => {
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
          background: #48c1d2;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(72,193,210,0.5);
        }
      `}} />
      <div className="w-full flex flex-col p-4 bg-[#142d53] rounded-[2rem] border border-white/10 shadow-inner gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleAudio}
              className="w-12 h-12 shrink-0 rounded-full bg-[#48c1d2] text-[#0a192f] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(72,193,210,0.3)]"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            <div className="flex flex-col text-left overflow-hidden">
              <span className="text-[10px] font-black text-white/50 uppercase tracking-[2px]">{title}</span>
              <span className={`text-[11px] font-black uppercase tracking-widest truncate ${isPlaying ? 'text-[#48c1d2] animate-pulse' : 'text-white'}`}>
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
            <span className="text-[9px] font-bold text-white/40 tracking-wider">{formatTime(duration)}</span>
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
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer custom-slider outline-none"
            style={{
              background: `linear-gradient(to right, #48c1d2 ${progress}%, rgba(255,255,255,0.1) ${progress}%)`
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

export default function ContenidoPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Conectando con el Estudio..." />}>
      <ContenidoContent />
    </Suspense>
  );
}

function ContenidoContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type') || 'presion';

  const [activeTab, setActiveTab] = useState('calendario');
  const [guionTab, setGuionTab] = useState<'reels' | 'historias' | 'presentacion'>('reels');
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [activeFormat, setActiveFormat] = useState<string>('Todos');
  const [serviceType, setServiceType] = useState(typeParam);

  const [toast, setToast] = useState<{ message: string, type: ToastType, isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  // Memoria de Pestaña e Inteligencia de URL
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const subTabParam = searchParams.get('sub');
    
    if (tabParam) {
      setActiveTab(tabParam);
    } else {
      const savedTab = localStorage.getItem('epotech_production_tab');
      if (savedTab) setActiveTab(savedTab);
    }

    if (subTabParam) {
      setGuionTab(subTabParam as any);
    } else {
      const savedSubTab = localStorage.getItem('epotech_guion_tab');
      if (savedSubTab) setGuionTab(savedSubTab as any);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    localStorage.setItem('epotech_production_tab', tabId);
    
    // Actualizar URL sin recargar para mantener consistencia
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tabId);
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleGuionTabChange = (tabId: 'reels' | 'historias' | 'presentacion') => {
    setGuionTab(tabId);
    localStorage.setItem('epotech_guion_tab', tabId);
    
    const params = new URLSearchParams(window.location.search);
    params.set('sub', tabId);
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
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
      title: 'En Ruta: Equipo Listo',
      mood: 'Energía y Acción',
      color: '#48c1d2',
      icon: MapPin,
      sequence: [
        {
          title: 'Historia 1: El Gancho',
          desc: 'Hablando a cámara mientras cargas el sistema de agua pura o las mangueras.',
          script: '¡Buenos días Utah! Hoy el equipo de Epotech se mueve a [Lugar]. Llevamos el sistema de agua desionizada listo para dejar esas ventanas como nuevas.',
          tips: 'Muestra el tanque de agua o los postes de limpieza.'
        },
        {
          title: 'Historia 2: El Equipo',
          desc: 'Muestra la hidrolavadora o los squeegees organizados.',
          script: 'La clave de un acabado perfecto no es solo el esfuerzo, es tener la herramienta correcta. Aquí no usamos químicos que dañen tus marcos.',
          tips: 'Haz un paneo de tus herramientas más limpias.'
        },
        {
          title: 'Historia 3: El Compromiso',
          desc: 'Hablando a cámara de nuevo.',
          script: 'Si nos ves en [Lugar], ya sabes que estamos eliminando manchas de agua dura. ¡Nos vemos en el brillo final!',
          tips: 'Usa el sticker de ubicación.'
        }
      ]
    },
    {
      id: 'h2',
      title: 'Desafío: Manchas de Agua Dura',
      mood: 'Autoridad y Experto',
      color: '#fbbf24',
      icon: ShieldCheck,
      sequence: [
        {
          title: 'Historia 1: La Realidad',
          desc: 'Muestra una ventana opaca con minerales de cerca.',
          script: 'Miren este cristal. Estos depósitos minerales llevan meses aquí. Si los dejas más tiempo, el daño puede ser permanente. Pero por suerte, llegamos nosotros.',
          tips: 'Usa el macro de tu cámara para que se vea el "sarro".'
        },
        {
          title: 'Historia 2: La Solución',
          desc: 'Hablando a cámara con el squeegee en mano.',
          script: 'Vamos a aplicar nuestra técnica de limpieza profunda. No es solo pasar agua, es restaurar la transparencia total del vidrio.',
          tips: 'Muestra el producto especial que usas.'
        },
        {
          title: 'Historia 3: El Suspenso',
          desc: 'Vídeo rápido de 3 segundos de la primera pasada de limpieza.',
          script: '¿Quieren ver cómo vuelve a brillar? No se despeguen de las historias.',
          tips: 'Usa una encuesta: "¿Creen que saldrán todas las manchas?"'
        }
      ]
    },
    {
      id: 'h3',
      title: 'Confianza: Concreto Nuevo',
      mood: 'Gratitud y Cercanía',
      color: '#f87171',
      icon: Heart,
      sequence: [
        {
          title: 'Historia 1: El Antes y Después',
          desc: 'Usa el sticker de "Antes y Después" con el driveway.',
          script: 'De un gris triste y con moho... a un blanco brillante. El Pressure Washing no es solo estética, es seguridad para tu familia.',
          tips: 'Muestra la diferencia de color del concreto.'
        },
        {
          title: 'Historia 2: El Factor Humano',
          desc: 'Tú hablando de la reacción del cliente al ver sus ventanas.',
          script: 'Acabamos de terminar las ventanas de [Nombre Cliente] y su frase fue: "No sabía que mi casa tenía esta vista". Esa es mi mayor satisfacción.',
          tips: 'Habla con mucha sinceridad.'
        },
        {
          title: 'Historia 3: Llamado a la Acción',
          desc: 'Tú señalando el sticker de enlace.',
          script: 'Si tus ventanas ya no te dejan ver el paisaje o tu entrada necesita un rescate, dale clic al link de mi perfil.',
          tips: 'Asegúrate de que el CTA sea claro.'
        }
      ]
    },
    {
      id: 'h4',
      title: 'Lifestyle: El Arte del Detalle',
      mood: 'Humano y Auténtico',
      color: '#60a5fa',
      icon: Coffee,
      sequence: [
        {
          title: 'Historia 1: Preparación',
          desc: 'Tú limpiando tus squeegees o revisando boquillas.',
          script: 'Día terminado. La gente cree que solo limpiamos, pero el 50% del éxito es cuidar nuestro equipo. Herramienta limpia = Trabajo impecable.',
          tips: 'Muestra el cuidado que le das a tus gomas de squeegee.'
        },
        {
          title: 'Historia 2: El Lado Humano',
          desc: 'Un café o tú descansando un momento.',
          script: 'Un día movido en Utah. Amo este trabajo porque cada ventana es una historia diferente. Gracias por dejarme cuidar sus hogares.',
          tips: 'Usa un tono relajado.'
        },
        {
          title: 'Historia 3: Comunidad',
          desc: 'Sticker de preguntas.',
          script: '¿Dudas sobre cómo mantener tus vidrios limpios por más tiempo? Déjalas aquí abajo.',
          tips: 'Interactúa con tus seguidores.'
        }
      ]
    },
    {
      id: 'h5',
      title: 'Tip Maestro: Ventanas Pro',
      mood: 'Educativo y Experto',
      color: '#10b981',
      icon: Lightbulb,
      sequence: [
        {
          title: 'Historia 1: Error Común',
          desc: 'Tú señalando una ventana con rayas de jabón.',
          script: 'Tip de oro: nunca limpies tus ventanas bajo el sol directo. El jabón se seca antes de que lo quites y deja estas rayas horribles.',
          tips: 'Muestra el efecto del sol en el vidrio.'
        },
        {
          title: 'Historia 2: El Secreto Epotech',
          desc: 'Hablando a cámara con autoridad.',
          script: 'Nosotros usamos agua pura. Sin químicos, sin jabones pesados. Eso garantiza que tus ventanas se mantengan limpias por el doble de tiempo.',
          tips: 'Muestra cómo el agua resbala por el cristal.'
        },
        {
          title: 'Historia 3: El Especialista',
          desc: 'Tú con el sistema de filtrado de fondo.',
          script: 'Si quieres un acabado de nivel profesional sin rayas, hablemos. La agenda de [Mes] ya se está llenando.',
          tips: 'Muestra tu agenda o disponibilidad.'
        }
      ]
    },
    {
      id: 'h6',
      title: 'Pressure: Fachada Brillante',
      mood: 'Satisfacción Total',
      color: '#8b5cf6',
      icon: Eye,
      sequence: [
        {
          title: 'Historia 1: El Desastre Viral',
          desc: 'Vídeo lento de una pared con moho verde/negro.',
          script: 'Muchos piensan que esto es pintura vieja, pero es vida orgánica dañando tu casa. Vamos a darle un reset total hoy.',
          tips: 'Pasa el dedo (con guante) por la suciedad.'
        },
        {
          title: 'Historia 2: La Magia (Satisfying)',
          desc: 'Clip de 5 segundos de la boquilla turbo limpiando.',
          script: 'Miren este contraste. El poder del agua aplicada con la técnica correcta. ¡Satisfacción garantizada!',
          tips: 'Graba el sonido real del impacto del agua.'
        },
        {
          title: 'Historia 3: El Resultado Final',
          desc: 'Paseo por la fachada ya seca y limpia.',
          script: 'Fachada restaurada. Valor de la propiedad aumentado. Cliente feliz. ¿Qué más podemos pedir?',
          tips: 'Haz un paneo de lejos para ver el cambio general.'
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
  const [direction, setDirection] = useState(0);
  const [enCamaraSubTab, setEnCamaraSubTab] = useState<'pinned' | 'pro'>('pinned');
  const [showFullScript, setShowFullScript] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showAudioReport, setShowAudioReport] = useState(false);
  const [isClosingAudioReport, setIsClosingAudioReport] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
  const [mergedVoiceoverUrl, setMergedVoiceoverUrl] = useState<string | null>(null);
  const [activeVoiceoverAudio, setActiveVoiceoverAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlayingVoiceover, setIsPlayingVoiceover] = useState(false);

  // --- BLOQUEO DE SCROLL CUANDO EL MODAL ESTÁ ABIERTO ---
  useEffect(() => {
    if (selectedScript || selectedStory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedScript, selectedStory]);



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
          return [...filtered, { blob: audioBlob, stepIdx: targetIdx, url }];
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
    if (voiceoverRecorder.current) {
      voiceoverRecorder.current.stop();
      setIsRecordingVoiceover(false);
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
    if (isRecordingVoiceover) {
      stopVoiceoverRecording();
      showToast("Procesando última toma...", "info");
      // Esperar a que el onstop dispare y guarde el estado antes de unir
      setTimeout(() => mergeVoiceoverFragments(), 800);
      return;
    }

    // Trick to get the absolute freshest state from React's fiber before going async
    const currentFragments = await new Promise<any[]>((resolve) => {
      setVoiceoverFragments(prev => {
        resolve(prev);
        return prev;
      });
    });

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

  // Recuperar borrador al cargar la app
  useEffect(() => {
    loadDraftAudio().then((draft) => {
      if (draft && draft.blob) {
        setAudioBlob(draft.blob);
        setRecordedAudio(URL.createObjectURL(draft.blob));
        setRecordTime(draft.duration || 0);
        setIsClosingAudioReport(false);
        setShowAudioReport(true); // Abrir el modal si hay un borrador pendiente
      }
    });
  }, []);

  // Auto-Scroll Inteligente para la Guía
  useEffect(() => {
    if (showHelp) {
      setTimeout(() => {
        const bubbles = document.querySelectorAll('.guide-bubble-active');
        // Usamos la última burbuja en el DOM para priorizar los Modales/Portals que se renderizan al final
        const activeBubble = bubbles[bubbles.length - 1];
        if (activeBubble) {
          activeBubble.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, [showHelp, dashHelpStep, teleHelpStep, reportHelpStep]);

  const handleCloseAudioReport = () => {
    setIsClosingAudioReport(true);
    setTimeout(() => {
      setShowAudioReport(false);
      setIsClosingAudioReport(false);
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
      const fileName = `reporte_${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audios')
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('audios')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from('reportes_audio').insert({
        proyecto_id: selectedScript?.id || 'manual',
        audio_url: publicUrl.publicUrl,
        duracion: formatTime(recordTime)
      });

      if (insertError) throw insertError;

      showToast("¡Audio enviado al equipo con éxito!", "success");
      handleCloseAudioReport();
      setRecordedAudio(null);
      setAudioBlob(null);
      setRecordTime(0);
      deleteDraftAudio(); // Borrar de emergencia tras envío exitoso
    } catch (err) {
      console.error(err);
      showToast("Error al enviar el reporte", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const [isUploadingLocucion, setIsUploadingLocucion] = useState(false);

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
        script_title: selectedScript.title,
        audio_url: publicUrlData.publicUrl
      });

      if (insertError) throw insertError;

      showToast('¡Locución enviada al equipo con éxito! 🎙️', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error al enviar la locución', 'error');
    } finally {
      setIsUploadingLocucion(false);
    }
  };

  useEffect(() => {
    async function fetchProductionPlan() {
      const { data: ideas } = await supabase
        .from('ideas_contenido')
        .select('*')
        .order('created_at', { ascending: false });

      if (ideas && ideas.length > 0) {
        const mappedPlan: any = {};
        const now = new Date();
        const currentMonthShort = now.toLocaleString('es-ES', { month: 'short' });
        ideas.forEach((idea, index) => {
          // Empezar a mapear desde el día 1 o basado en el día actual
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
      }
      setLoading(false);
    }
    fetchProductionPlan();
  }, []);

  const [selectedProduction, setSelectedProduction] = useState<any>(null);

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


  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const [isClosing, setIsClosing] = useState(false);
  const [isAnimate, setIsAnimate] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'solo' | 'ayuda' | 'tips'>('solo');
  const [openAdviceIdx, setOpenAdviceIdx] = useState<number | null>(null);

  // Bloquear scroll del fondo cuando el guion está abierto
  useEffect(() => {
    if (selectedScript) {
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => setIsAnimate(true), 10);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = 'unset';
      setIsAnimate(false);
      setOpenAdviceIdx(null);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
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
    }, 500);
  };

  const modalContent = selectedScript && mounted ? createPortal(
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500 ${isAnimate && !isClosing ? 'opacity-100' : 'opacity-0'}`}>
      <div
        className={`absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity duration-500 ${isAnimate && !isClosing ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleCloseScript}
      />

      <div className={`relative w-full max-w-lg bg-[#0a192f] border border-white/10 rounded-[40px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl transition-all duration-500 ${isClosing ? 'scale-95 opacity-0 translate-y-10' : isAnimate ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-20'}`}>
        {/* Encabezado */}
        <div className="p-6 border-b border-white/5 bg-black/20 flex justify-between items-center text-left">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px]">{selectedScript.category}</span>
              {selectedScript.isPinned && <span className="bg-amber-500/20 text-amber-400 text-[7px] font-black px-2 py-0.5 rounded-full uppercase border border-amber-500/30">📌 Video para Fijar</span>}
            </div>
            <h2 className="text-xl font-black text-white leading-tight">{selectedScript.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFullScript(!showFullScript)}
              className={`h-9 px-3 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${showFullScript ? "bg-white/5 text-white/40 border border-white/5" : "bg-[#48c1d2] text-[#0a192f] shadow-lg"}`}
            >
              {showFullScript ? <Zap size={14} /> : <BookOpen size={14} />}
              <span className="text-[8px] font-black uppercase tracking-tighter">
                {showFullScript 
                  ? (selectedScript.isProductionMode ? "MODO ESCENAS" : "MODO PASOS") 
                  : "GUION COMPLETO"
                }
              </span>
            </button>
            <button onClick={handleCloseScript} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors border border-white/5">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {selectedScript.isProductionMode ? (
            /* NUEVO MODO: EN CÁMARA (PRODUCCIÓN DUAL) */
            <div className="p-6 space-y-12">
              {showFullScript ? (
                /* Vista del Guion Completo para Producción */
                <div className="animate-in fade-in zoom-in-95 duration-500 text-left space-y-8">
                  <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5"><Mic size={80} className="text-[#48c1d2]" /></div>
                    <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[3px] mb-4 block">Guion de Referencia</span>
                    <p className="text-xl font-medium text-white/90 leading-relaxed italic relative z-10">
                      "{selectedScript.fullDialogue}"
                    </p>
                  </div>
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
                          <h3 className="text-2xl font-black text-white italic tracking-tighter text-center uppercase">
                            {selectedScript.scenes[currentStepIdx].title}
                          </h3>

                          {/* INSTRUCCIONES SEBASTIÁN */}
                          <div className="bg-[#48c1d2]/5 rounded-[2.5rem] border border-[#48c1d2]/20 overflow-hidden">
                            <div className="p-6 border-b border-[#48c1d2]/10 bg-[#48c1d2]/10 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#48c1d2] flex items-center justify-center text-[#142d53]">
                                <User size={18} />
                              </div>
                              <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[3px]">Para Sebastián (Talento)</span>
                            </div>
                            <div className="p-6 space-y-6">
                              {selectedScript.scenes[currentStepIdx].talent.whatToSay && (
                                <div className="space-y-2">
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block italic">Qué decir:</span>
                                  <p className="text-xl font-black text-white leading-tight italic">
                                    {selectedScript.scenes[currentStepIdx].talent.whatToSay}
                                  </p>
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1 italic">Cómo moverse:</span>
                                  <p className="text-[11px] font-bold text-white/80 leading-snug">
                                    {selectedScript.scenes[currentStepIdx].talent.howToMove}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1 italic">Gesto/Actitud:</span>
                                  <p className="text-[11px] font-bold text-white/80 leading-snug">
                                    {selectedScript.scenes[currentStepIdx].talent.gesture}
                                  </p>
                                </div>
                              </div>
                              {selectedScript.scenes[currentStepIdx].talent.demoUrl && (
                                <div className="aspect-[9/16] max-w-[280px] mx-auto rounded-[3rem] overflow-hidden bg-black/40 border-8 border-[#142d53] relative group shadow-2xl">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${getYoutubeId(selectedScript.scenes[currentStepIdx].talent.demoUrl)}?rel=0&modestbranding=1`}
                                    className="w-full h-full"
                                    allowFullScreen
                                  ></iframe>
                                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[7px] font-black text-white uppercase tracking-widest pointer-events-none border border-white/10">Ejemplo Visual</div>
                                </div>
                              )}
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
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1 italic">Dónde ponerse:</span>
                                  <p className="text-[11px] font-bold text-white/80 leading-snug">
                                    {selectedScript.scenes[currentStepIdx].camera.whereToStand}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1 italic">Ángulo:</span>
                                  <p className="text-[11px] font-bold text-white/80 leading-snug">
                                    {selectedScript.scenes[currentStepIdx].camera.angle}
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1 italic">Movimiento:</span>
                                  <p className="text-[11px] font-bold text-white/80 leading-snug">
                                    {selectedScript.scenes[currentStepIdx].camera.movement}
                                  </p>
                                </div>
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                  <span className="text-[8px] font-black text-red-500 uppercase tracking-widest block mb-1 italic">Evitar:</span>
                                  <p className="text-[11px] font-bold text-red-400 leading-snug">
                                    {selectedScript.scenes[currentStepIdx].camera.avoid}
                                  </p>
                                </div>
                              </div>
                              {selectedScript.scenes[currentStepIdx].camera.demoUrl && (
                                <div className="aspect-[9/16] max-w-[280px] mx-auto rounded-[3rem] overflow-hidden bg-black/40 border-8 border-[#142d53] relative group shadow-2xl">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${getYoutubeId(selectedScript.scenes[currentStepIdx].camera.demoUrl)}?rel=0&modestbranding=1`}
                                    className="w-full h-full"
                                    allowFullScreen
                                  ></iframe>
                                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[7px] font-black text-white uppercase tracking-widest pointer-events-none border border-white/10">Tutorial Cámara</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </>
              )}
            </div>
          ) : (
            /* MODO NORMAL: REELS / HISTORIAS (TELEPROMPTER) */
            <div className="p-6 flex flex-col flex-1">
              {showFullScript ? (
                <div className="animate-in fade-in zoom-in-95 duration-500 text-left space-y-10 w-full flex-1">
                  <div className="space-y-10">
                    {selectedScript.steps.map((s: any, i: number) => (
                      <div key={i} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[3px]">ACTO {i + 1}</span>
                          <div className="flex-1 h-[1px] bg-white/10" />
                        </div>
                        <p className="text-lg font-medium text-white/90 leading-relaxed italic">"{s.script}"</p>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <h5 className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2"><Video size={10} /> Referencia Visual</h5>
                          <p className="text-[11px] font-bold text-white/40 leading-snug uppercase">{s.visualField}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : mergedVoiceoverUrl ? (
                <div className="flex flex-col items-center justify-center flex-1 space-y-6 animate-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30"><CheckCircle2 size={48} className="text-green-400" /></div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest text-center">Locución Completada</h3>
                  <div className="w-full max-w-xs mt-4"><CustomAudioPlayer title="Vista Previa" src={mergedVoiceoverUrl} /></div>
                  <div className="flex flex-col w-full max-w-xs gap-3 mt-4">
                    <button onClick={handleSendLocucion} disabled={isUploadingLocucion} className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isUploadingLocucion ? 'bg-white/10 text-white/30' : 'bg-[#48c1d2] text-[#0a192f] hover:scale-105 shadow-xl shadow-[#48c1d2]/20'}`}>
                      {isUploadingLocucion ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</> : <><Share2 size={16} /> Enviar al Equipo</>}
                    </button>
                    <a href={mergedVoiceoverUrl} download={`Locucion_${selectedScript.id}.wav`} className="w-full py-4 bg-white/5 text-white hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10"><Download size={16} /> Descargar Audio Final</a>
                    <button onClick={() => setMergedVoiceoverUrl(null)} className="w-full py-4 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">Revisar Tomas</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6 px-2">
                    <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[3px]">Paso {currentStepIdx + 1} de {selectedScript.steps.length}</span>
                    <div className="flex gap-1">
                      {selectedScript.steps.map((_: any, i: number) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentStepIdx ? 'w-6 bg-[#48c1d2]' : 'w-2 bg-white/10'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left flex-1">
                    <div className="bg-[#48c1d2] p-8 rounded-[40px] relative shadow-2xl shadow-[#48c1d2]/20">
                      <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles size={60} className="text-[#0a192f]" /></div>
                      <h4 className="text-[9px] font-black text-[#0a192f] uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Mic size={14} /> Tu guion para leer:</h4>
                      <p className="text-2xl font-black text-[#0a192f] leading-[1.1] tracking-tight italic">"{selectedScript.steps[currentStepIdx].script}"</p>
                      <div className="mt-8 flex flex-col items-center">
                        {isRecordingVoiceover ? (
                          <div className="flex flex-col items-center gap-2">
                            <button onClick={stopVoiceoverRecording} className="w-16 h-16 rounded-full bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center text-white animate-pulse border-4 border-red-400"><div className="w-5 h-5 bg-white rounded-sm" /></button>
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Grabando toma...</span>
                          </div>
                        ) : voiceoverFragments.find(f => f.stepIdx === currentStepIdx) ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="flex gap-2">
                              <button onClick={() => { const audioUrl = voiceoverFragments.find(f => f.stepIdx === currentStepIdx)?.url; if (audioUrl) toggleVoiceoverPlayback(audioUrl); }} className="px-4 py-2 bg-green-500/20 text-green-600 rounded-full text-[8px] font-black uppercase tracking-tighter border border-green-500/30 hover:bg-green-500/30 flex items-center gap-2 w-[100px] justify-center">{isPlayingVoiceover ? <PauseCircle size={14} /> : <PlayCircle size={14} />} {isPlayingVoiceover ? 'Pausar' : 'Escuchar'}</button>
                              <button onClick={() => startVoiceoverRecording(currentStepIdx)} className="px-4 py-2 bg-white/40 text-[#0a192f] rounded-full text-[8px] font-black uppercase tracking-tighter border border-white/40 hover:bg-white/60 flex items-center gap-2"><History size={14} /> ReMODO PASOS</button>
                              <button onClick={() => deleteVoiceoverFragment(currentStepIdx)} className="px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-[8px] font-black uppercase tracking-tighter border border-red-500/20 hover:bg-red-500/20 flex items-center gap-2"><Trash2 size={14} /> Eliminar</button>
                            </div>
                            <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Toma Guardada</span>
                          </div>
                        ) : (
                          <button onClick={() => startVoiceoverRecording(currentStepIdx)} className="w-16 h-16 rounded-full bg-[#142d53] shadow-[0_0_20px_rgba(20,45,83,0.3)] flex items-center justify-center text-[#48c1d2] hover:scale-105 active:scale-95 transition-all border-2 border-[#142d53]"><Mic size={28} /></button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Pie de Página (Controles Navegación) */}
        <div className="p-6 border-t border-white/5 bg-[#0a192f]/80 backdrop-blur-md flex gap-3">
          {selectedScript.isProductionMode ? (
            /* Controles Modo Producción */
            !showFullScript && (
              <>
                <button
                  disabled={currentStepIdx === 0}
                  onClick={() => {
                    setDirection(-1);
                    setCurrentStepIdx(prev => prev - 1);
                  }}
                  className={`flex-1 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[1px] transition-all ${currentStepIdx === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-white/10 text-white hover:bg-white/20 border border-white/10 active:scale-95'}`}
                >
                  ESCENA ANTERIOR
                </button>
                {currentStepIdx < (selectedScript.scenes?.length || 0) - 1 ? (
                  <button
                    onClick={() => {
                      setDirection(1);
                      setCurrentStepIdx(prev => prev + 1);
                    }}
                    className="flex-[2] py-5 bg-[#48c1d2] text-[#0a192f] text-[10px] font-black uppercase tracking-[2px] rounded-[24px] shadow-xl shadow-[#48c1d2]/20 transition-all active:scale-95 border-b-4 border-[#3aa8b8]"
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
                  <button onClick={() => setCurrentStepIdx(prev => prev - 1)} className="flex-1 py-5 bg-white/10 text-white text-[10px] font-black uppercase tracking-[1px] rounded-[24px] border border-white/10 transition-all active:scale-95">Anterior</button>
                )}
                {currentStepIdx < selectedScript.steps.length - 1 ? (
                  <button onClick={() => setCurrentStepIdx(prev => prev + 1)} className="flex-[2] py-5 bg-[#48c1d2] text-[#0a192f] text-[10px] font-black uppercase tracking-[1px] rounded-[24px] shadow-xl shadow-[#48c1d2]/20 transition-all active:scale-95 border-b-4 border-[#3aa8b8]">Siguiente Toma</button>
                ) : (
                  <button onClick={mergeVoiceoverFragments} className="flex-[2] py-5 bg-[#48c1d2] text-[#0a192f] text-[10px] font-black uppercase tracking-[1px] rounded-[24px] shadow-xl shadow-[#48c1d2]/20 transition-all active:scale-95 border-b-4 border-[#3aa8b8] flex items-center justify-center gap-2"><Sparkles size={16} /> UNIR Y DESCARGAR</button>
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
                        <h3 className="text-xl uppercase italic tracking-tighter mb-1 leading-none">PASO 10: ¡ERES UN PRO!</h3>
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
    <div className="max-w-md md:max-w-5xl mx-auto pt-6 pb-24 px-4 text-left">
      <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 bg-[#48c1d2]/10 px-3 py-1.5 rounded-full mb-3">
          <div className="w-5 h-5 bg-[#48c1d2] rounded-lg flex items-center justify-center">
            <Sparkles size={12} className="text-[#142d53]" />
          </div>
          <span className="text-[10px] font-black text-[#142d53] uppercase tracking-widest">Estudio Epotech 2026</span>
        </div>
        <h1 className="text-4xl font-black text-[#142d53] leading-tight tracking-tighter">
          Estudio de<br />
          <span className="text-[#48c1d2]">Producción</span>
        </h1>
      </div>

      {/* REPORTE DE AUDIO - ACCESO DIRECTO DE ELITE */}
      <div className={`mb-8 px-2 animate-in fade-in slide-in-from-top-6 duration-1000 delay-200 relative`}>
        {showHelp && dashHelpStep === 1 && (
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 bg-[#48c1d2] text-[#142d53] p-5 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-64 max-w-[calc(100vw-40px)] z-50 border-2 border-white/20 animate-in zoom-in duration-300 guide-bubble-active">
            <div className="flex flex-col gap-2">
              <span>PASO 1: ¡Aquí empieza todo! Antes de los guiones, necesitamos tu reporte. Cuéntanos cómo te fue hoy.</span>
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
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] leading-none mb-1 text-white italic">REPORTE DE AUDIO</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">REPORTE DE CIERRE DE JORNADA</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center relative z-10 border border-white/10 group-hover:bg-white/10 transition-all">
            <ChevronRight size={20} className="text-[#48c1d2]" />
          </div>
        </button>
        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-3 opacity-60">* Úsalo al terminar tu día para enviarnos los detalles finales de la obra.</p>
      </div>

      <div className="flex bg-slate-50 p-1 rounded-2xl mb-6 shadow-sm border border-slate-100">
        {[
          { id: 'guiones', name: 'Guiones', icon: Clapperboard, step: 1, help: 'Toca aquí para empezar tu día de grabación.' },
          { id: 'calendario', name: 'Cronograma', icon: Sparkles },
          { id: 'historial', name: 'Historial', icon: History }
        ].map((tab) => (
          <div key={tab.id} className="flex-1 relative">
            <button
              onClick={() => { handleTabChange(tab.id); if (tab.step === 1) setDashHelpStep(1); }}
              className={`w-full py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-[#142d53] text-[#48c1d2] shadow-md' : 'text-slate-400'} ${showHelp && tab.step === 1 && dashHelpStep === 1 ? 'ring-4 ring-[#48c1d2] animate-pulse z-40' : ''}`}
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
                        setDashHelpStep(0); // Ocultar globo de dash mientras el modal está abierto
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

      {/* Texto Tutorial Contextual */}
      <div className="mb-8">
        {activeTab === 'guiones' && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            <span className="text-[#48c1d2]">Mis Guiones:</span> Aquí tienes las historias listas para MODO PASOS basadas en tus trabajos más recientes.
          </p>
        )}
        {activeTab === 'calendario' && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            <span className="text-[#48c1d2]">Cronograma de Publicación:</span> Mira qué toca publicar hoy. La constancia es la clave para crecer en Utah.
          </p>
        )}
        {activeTab === 'historial' && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
            <span className="text-[#48c1d2]">Historial de Publicaciones:</span> Revisa tus videos pasados y entiende qué está trayendo clientes reales a Epotech.
          </p>
        )}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'guiones' && (
          <div className="space-y-4">
            {/* Navegación del Estudio de Producción Compacta pero Espaciada */}
            {/* Navegación del Estudio de Producción - Ahora Simplificada */}
            <div className="flex bg-[#0a192f]/5 p-1.5 rounded-2xl mb-6 gap-1.5 border border-slate-200/60 shadow-inner">
              <button
                onClick={() => handleGuionTabChange('reels')}
                className={`flex-1 py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${guionTab === 'reels'
                    ? 'bg-[#142d53] text-[#48c1d2] shadow-[0_4px_20px_rgba(20,45,83,0.3)] scale-[1.02]'
                    : 'text-slate-500 hover:text-[#142d53] hover:bg-white/70'
                  }`}
              >
                <Clapperboard size={15} /> Reels
              </button>
              <button
                onClick={() => handleGuionTabChange('historias')}
                className={`flex-1 py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${guionTab === 'historias'
                    ? 'bg-[#142d53] text-[#48c1d2] shadow-[0_4px_20px_rgba(20,45,83,0.3)] scale-[1.02]'
                    : 'text-slate-500 hover:text-[#142d53] hover:bg-white/70'
                  }`}
              >
                <Zap size={15} /> Historias
              </button>
              <button
                onClick={() => handleGuionTabChange('presentacion')}
                className={`flex-1 py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${guionTab === 'presentacion'
                    ? 'bg-[#142d53] text-[#48c1d2] shadow-[0_4px_20px_rgba(20,45,83,0.3)] scale-[1.02]'
                    : 'text-slate-500 hover:text-[#142d53] hover:bg-white/70'
                  }`}
              >
                <Video size={15} /> EN CÁMARA
              </button>
            </div>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
              <div className="bg-[#142d53]/5 p-6 rounded-[2.5rem] border border-[#142d53]/10">
                <h3 className="text-lg font-black text-[#142d53] mb-2 tracking-tight">
                  {guionTab === 'reels' && 'Biblioteca de Guiones'}
                  {guionTab === 'historias' && 'Guía de Historias Diarias'}
                  {guionTab === 'presentacion' && 'Videos de Marca Personal'}
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-6">
                  {guionTab === 'reels' && 'Contenido estructurado para máxima retención y viralidad.'}
                  {guionTab === 'historias' && 'Guías situacionales para conectar de forma humana y espontánea.'}
                  {guionTab === 'presentacion' && 'Producción profesional con desglose de escenas para talento y cámara.'}
                </p>

                {guionTab === 'presentacion' && (
                  <div className="flex bg-white/50 p-1.5 rounded-2xl border border-slate-200/50 mb-8 max-w-sm">
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
                  </div>
                )}

                <div className="grid gap-4">
                  {guionTab === 'reels' ? (
                    <>
                      <div className="p-8 bg-gradient-to-br from-[#142d53] to-[#1e3a8a] rounded-[2.5rem] border border-white/10 shadow-xl relative overflow-hidden group mb-4 text-left">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                          <Sparkles size={80} className="text-[#48c1d2]" />
                        </div>
                        <div className="relative z-10">
                          <span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[3px] mb-3 block">Próximamente: Tu Guion Personalizado</span>
                          <h4 className="text-xl font-black text-white italic tracking-tighter mb-3">Laboratorio de Inteligencia <span className="text-[#48c1d2]">Epotech</span></h4>
                          <p className="text-[11px] font-medium text-slate-300 leading-relaxed max-w-[85%]">
                            "Usa el <span className="text-[#48c1d2] font-black italic">Reporte de Audio</span> al final de tu jornada. Nuestro equipo procesará tus notas y generará aquí mismo un guion estratégico basado en tus obras reales de hoy."
                          </p>
                          <div className="mt-6 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#48c1d2] animate-pulse"></div>
                            <span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-widest">Esperando tu reporte...</span>
                          </div>
                        </div>
                      </div>
                      {guiones.map((script) => (
                        <div
                          key={script.id}
                          onClick={() => {
                            setSelectedScript(script);
                            setCurrentStepIdx(0);
                            setShowFullScript(true);
                            if (showHelp) setTeleHelpStep(1);
                          }}
                          className={`bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-[#48c1d2]/50 transition-all cursor-pointer active:scale-95 relative`}>
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-[#48c1d2] transition-colors">
                            <Clapperboard size={20} />
                          </div>
                          <div className="text-left flex-1">
                            <span className="text-[8px] font-black text-[#48c1d2] uppercase tracking-[2px]">{script.category}</span>
                            <h4 className="text-sm font-black text-[#142d53] leading-tight">{script.title}</h4>
                          </div>
                          <ChevronRight size={16} className="text-slate-200 group-hover:text-[#48c1d2] transition-all" />
                        </div>
                      ))}
                    </>
                  ) : guionTab === 'presentacion' ? (
                    <div className="grid gap-4">
                      {enCamaraSubTab === 'pinned' ? (
                        <>
                          <div className="p-6 bg-amber-50 rounded-[2.5rem] border border-amber-100 mb-2 text-left">
                            <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                              <ShieldCheck size={12} /> Estrategia de Marca (Pinned)
                            </h5>
                            <p className="text-[11px] font-bold text-amber-900/70 leading-relaxed italic">
                              "Estos 3 videos son los pilares de tu perfil. Al fijarlos (Pin), aseguras que cualquier persona nueva entienda de inmediato quién eres y cómo contratarte."
                            </p>
                          </div>
                          {guionesPresentacion.filter(s => s.isPinned).map((script) => (
                            <div
                              key={script.id}
                              onClick={() => {
                                setSelectedScript(script);
                                setCurrentStepIdx(0);
                                setShowFullScript(true);
                              }}
                              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-amber-400 transition-all cursor-pointer relative overflow-hidden"
                            >
                              <div className="w-14 h-14 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-600 group-hover:bg-amber-100 transition-all">
                                <Video size={24} />
                              </div>
                              <div className="text-left flex-1">
                                <span className="text-[8px] font-black text-amber-500 uppercase tracking-[2px]">Video a Fijar</span>
                                <h4 className="text-sm font-black text-[#142d53] leading-tight">{script.title}</h4>
                                <p className="text-[10px] font-medium text-slate-400 mt-1">{script.duration} • Estratégico</p>
                              </div>
                              <ChevronRight size={18} className="text-slate-200 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                            </div>
                          ))}
                        </>
                      ) : (
                        <>
                          <div className="py-20 px-8 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
                              <Sparkles size={40} className="animate-pulse" />
                            </div>
                            <h5 className="text-xl font-black text-[#142d53] italic mb-2 tracking-tighter">Laboratorio de Contenido Pro</h5>
                            <p className="text-sm font-bold text-slate-400 max-w-[280px] leading-relaxed italic">
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
                  ) : (
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
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'calendario' && <CreacionSection contentDB={contentDB} toggleStatus={toggleGlobalStatus} onSelect={(key: string) => setSelectedProduction({ ...contentDB[key], day: key })} />}
        {activeTab === 'historial' && <HistorialSection contentDB={contentDB} onSelect={(key: string) => setSelectedProduction({ ...contentDB[key], day: key })} showToast={showToast} activeTab={activeTab} />}
      </div>

      {modalContent}
      {selectedStory && createPortal(
        <div className={`fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-[#0a192f]/90 text-center ${isClosingStory ? 'modal-backdrop-out' : 'modal-backdrop'}`}>
          <div className={`bg-white w-full max-w-lg rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] relative overflow-hidden ${isClosingStory ? 'modal-panel-out' : 'modal-panel'}`}>
            <div className="p-8 pb-4 flex justify-between items-start bg-slate-50 border-b border-slate-100">
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ backgroundColor: `${selectedStory.color}15` }}>
                  <selectedStory.icon size={14} style={{ color: selectedStory.color }} />
                  <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: selectedStory.color }}>Hoja de Ruta: Historias</span>
                </div>
                <h2 className="text-2xl font-black text-[#142d53] leading-tight tracking-tighter">{selectedStory.title}</h2>
              </div>
              <button onClick={handleCloseStory} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-300 hover:text-slate-600 shadow-sm transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-10 custom-scrollbar">
              {selectedStory.sequence.map((step: any, idx: number) => (
                <section key={idx} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left" style={{ animationDelay: `${idx * 150}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-[11px] shrink-0 shadow-lg" style={{ backgroundColor: selectedStory.color }}>{idx + 1}</div>
                    <h4 className="text-[11px] font-black text-[#142d53] uppercase tracking-[0.2em]">{step.title}</h4>
                  </div>

                  <div className="space-y-3 pl-11">
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 italic text-[#142d53] font-medium text-sm leading-relaxed relative text-left">
                      <div className="absolute -left-2 top-4 w-1 h-8 rounded-full" style={{ backgroundColor: selectedStory.color }} />
                      <span className="text-[8px] font-bold text-slate-400 uppercase block mb-2 tracking-widest italic">Guion Sugerido:</span>
                      "{step.script}"
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 bg-[#142d53]/5 rounded-2xl border border-[#142d53]/5">
                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-1 tracking-widest">Lo que se ve:</span>
                        <p className="text-sm font-bold text-[#142d53] leading-snug">{step.desc}</p>
                      </div>
                      <div className="p-4 bg-[#48c1d2]/5 rounded-2xl border border-[#48c1d2]/10">
                        <span className="text-[9px] font-black text-[#48c1d2] uppercase block mb-1 tracking-widest">Pro Tip:</span>
                        <p className="text-sm font-bold text-slate-500 italic leading-snug">{step.tips}</p>
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
                <p className="text-base font-medium text-white italic relative z-10 leading-tight">"Haz que la gente confíe en el hombre detrás de la máquina."</p>
              </div>
            </div>

            <div className="p-8 border-t border-slate-50 bg-slate-50/50">
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

      {/* MODAL DE REPORTE DE AUDIO (Paso Final) */}
      {showAudioReport && createPortal(
        <div className={`fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-[#0a192f]/90 text-center ${isClosingAudioReport ? 'modal-backdrop-out' : 'modal-backdrop'}`}>
          <div className={`bg-[#0a192f]/95 w-full max-w-lg rounded-[40px] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col max-h-[90vh] relative overflow-hidden ${isClosingAudioReport ? 'modal-panel-out' : 'modal-panel'}`}>
            <div className="p-10 pb-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-black/40 to-transparent text-left relative z-20">
              <div>
                <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[4px] mb-2 block italic opacity-70">Módulo de Mentoría</span>
                <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Tu Reporte <span className="text-[#48c1d2]">Pro</span></h2>
              </div>
              <button onClick={handleCloseAudioReport} className="w-12 h-12 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center text-white/20 border border-white/10 transition-all"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-4 space-y-10">
              <div className={`bg-white/5 p-8 rounded-[2.5rem] border border-white/10 text-left relative transition-all shadow-inner ${showHelp && reportHelpStep === 1 ? "z-50 bg-[#48c1d2]/10 border-[#48c1d2]/30 mt-32" : ""}`}>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-[#48c1d2]/20 to-transparent rounded-[2.5rem] blur opacity-30 pointer-events-none" />
                {showHelp && reportHelpStep === 1 && (
                  <div className="absolute -top-36 left-1/2 -translate-x-1/2 bg-[#48c1d2] text-[#142d53] p-5 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-64 z-50 border-2 border-white/20 animate-in zoom-in duration-300 guide-bubble-active">
                    <div className="flex flex-col gap-2">
                      <span>PASO 2: Responde estas 5 preguntas rápidas. Tu honestidad nos ayuda a crear guiones que venden de verdad.</span>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAudioReport(false);
                            setDashHelpStep(1);
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
                <h4 className="text-[10px] font-black text-[#48c1d2] uppercase tracking-widest mb-2 flex items-center gap-2 italic">
                  <Mic size={14} /> Responde con todo el detalle:
                </h4>
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">Tu detalle nos ayuda a crear historias que vendan tu esfuerzo y profesionalismo.</p>
                <ul className="space-y-5">
                  {[
                    "¿Dónde estuviste hoy y qué tan grave era el problema?",
                    "¿Estuviste solo o acompañado? Cuéntanos quién te ayudó y cómo se dividieron, o si lo hiciste solo, ¿cómo resolviste el reto tú solo hoy?",
                    "¿Hubo algo difícil o que te preocupara cuidar? ¡Cuéntalo con todo detalle!",
                    "¿Qué herramienta fue el héroe hoy?",
                    "¿Qué fue lo que más le gustó al cliente al final?",
                    "¿Qué consejo le darías a alguien que tiene este mismo problema en su casa? ¡Esa es tu voz de experto!"
                  ].map((q, idx) => (
                    <li key={idx} className="flex gap-4 items-start">
                      <span className="text-[#48c1d2] font-black text-xs">{idx + 1}.</span>
                      <p className="text-xs font-bold text-white/80 leading-snug">{q}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`flex flex-col items-center justify-center py-10 space-y-8 relative transition-all ${showHelp && reportHelpStep === 2 ? 'z-50 p-4 rounded-[3rem] bg-[#48c1d2]/5' : ''}`}>
                {showHelp && reportHelpStep === 2 && <div className="absolute inset-0 rounded-[3rem] ring-4 ring-[#48c1d2] animate-pulse pointer-events-none" />}
                {showHelp && reportHelpStep === 2 && (
                  <div className="absolute -top-40 right-0 bg-[#48c1d2] text-[#142d53] p-5 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-64 z-50 border-2 border-[#142d53]/20 animate-in zoom-in duration-300 guide-bubble-active">
                    <div className="flex flex-col gap-2">
                      <span>PASO 3: Graba tu nota aquí. Puedes pausar si hay ruido o borrar si te equivocas. ¡Foco en el valor!</span>
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
                            setShowAudioReport(false);
                            setDashHelpStep(4);
                            handleTabChange('guiones');
                          }}
                          className="bg-[#142d53] text-[#48c1d2] px-3 py-1.5 rounded-xl hover:scale-105 transition-all text-[8px] font-black shadow-lg"
                        >
                          SIGUIENTE
                        </button>
                      </div>
                    </div>
                    <div className="absolute -bottom-3 right-10 w-6 h-6 bg-[#48c1d2] rotate-45 border-r-2 border-b-2 border-[#142d53]/20"></div>
                  </div>
                )}

                {!recordedAudio ? (
                  <>
                    <div className="text-center mb-4">
                      <div className={`text-3xl font-mono font-black tabular-nums mb-2 ${recordTime >= 3600 ? 'text-[#48c1d2] animate-pulse' : 'text-[#48c1d2]'}`}>
                        {formatTime(recordTime)}
                      </div>
                      <div className="flex items-center gap-2 justify-center">
                        <div className={`w-2 h-2 rounded-full ${isRecording && !isPaused ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`}></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {recordTime >= 3600 ? 'Límite alcanzado' : (isRecording ? (isPaused ? 'Pausado' : 'Grabando...') : 'Listo para MODO PASOS')}
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
                    <div className="w-full">
                      <CustomAudioPlayer title="Tu Grabación" src={recordedAudio} />
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
                      <a
                        href={recordedAudio}
                        download="reporte_epotech.webm"
                        className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                      >
                        <Download size={14} /> Descargar
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-black/20">
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
          </div>
        </div>, document.body
      )}
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
    <div className={`fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-[#050c18]/90 modal-backdrop ${isClosing ? 'animate-out fade-out' : ''}`}>
      <div style={{ backgroundColor: '#142d53' }} className={`w-[95%] max-w-[500px] rounded-[2.5rem] shadow-2xl flex flex-col border border-white/10 overflow-hidden modal-panel ${isClosing ? 'animate-out zoom-out slide-out-to-bottom-10' : ''}`}>
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div className="text-left flex-1 mr-4">
            <span className="text-[8px] font-bold text-[#48c1d2] tracking-[0.2em] mb-1 block">Ficha de Producción</span>
            {isEditing ? (
              <input className="bg-white/5 border border-[#48c1d2]/30 text-white font-bold italic w-full p-2 rounded-xl text-lg outline-none" value={editedPost.title} onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })} />
            ) : (
              <h2 className="text-xl font-bold text-white italic leading-none">{post.title}</h2>
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
                <textarea className="bg-transparent text-sm font-medium text-white italic w-full min-h-[80px] outline-none" value={editedPost.desc} onChange={(e) => setEditedPost({ ...editedPost, desc: e.target.value })} />
              ) : (
                <p className="text-sm font-medium text-white/90 italic">"{post.desc}"</p>
              )}
            </div>
          </section>
          <section className="space-y-4">
            <div>
              <h4 className="text-[9px] font-bold text-[#48c1d2] tracking-[0.2em] mb-3">Texto que Vende</h4>
              <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                {isEditing ? (
                  <textarea className="bg-transparent text-xs font-medium text-white/70 italic w-full min-h-[80px] outline-none" value={editedPost.copy} onChange={(e) => setEditedPost({ ...editedPost, copy: e.target.value })} />
                ) : (
                  <p className="text-xs font-medium text-white/70 italic">{post.copy}</p>
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
          <span className="text-[10px] font-bold text-slate-300 italic">Epotech Hub</span>
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
              <p className="text-xl font-bold text-[#142d53] italic tracking-tighter">Día {selectedDate} de {capitalizedMonth}</p>
            </div>
          </div>
          {contentDB[selectedDate] && <div className={`px-4 py-2 rounded-2xl text-[8px] font-bold ${contentDB[selectedDate].status === 'Publicado' ? 'bg-[#48c1d2] text-[#142d53]' : 'bg-slate-100 text-slate-400'}`}>{contentDB[selectedDate].status}</div>}
        </div>

        {contentDB[selectedDate] ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="text-[7px] font-bold text-slate-400 block mb-1">Objetivo</span><p className="text-xs font-bold text-[#142d53] italic">{contentDB[selectedDate].objetivo}</p></div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><span className="text-[7px] font-bold text-slate-400 block mb-1">Tipo</span><p className="text-xs font-bold text-[#142d53] italic">{contentDB[selectedDate].type}</p></div>
            </div>
            <div className="space-y-3">
              <h5 className="text-[9px] font-bold text-[#142d53] tracking-widest ml-1">Concepto Central</h5>
              <div className="p-6 bg-[#142d53] rounded-[2.5rem]"><p className="text-sm font-medium text-white italic leading-relaxed">"{contentDB[selectedDate].desc}"</p></div>
            </div>
            <div className="space-y-3">
              <h5 className="text-[9px] font-bold text-slate-400 tracking-widest ml-1">Texto que Vende</h5>
              <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <p className="text-xs font-medium text-slate-600 italic leading-snug mb-4">{contentDB[selectedDate].copy}</p>
                <p className="text-[10px] font-mono text-[#48c1d2] font-bold bg-[#142d53] p-3 rounded-xl inline-block">{contentDB[selectedDate].hashtags}</p>
              </div>
            </div>
            <button onClick={() => onSelect(selectedDate)} className="w-full py-4 bg-[#142d53] text-[#48c1d2] text-[10px] font-bold tracking-[0.2em] rounded-2xl shadow-xl">Editar Estrategia</button>
          </div>
        ) : <div className="py-20 flex flex-col items-center justify-center text-slate-300 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200"><Calendar size={40} className="opacity-20 mb-4" /><p className="text-[10px] font-bold tracking-widest italic opacity-40">Día sin producción</p></div>}
      </div>

      <div className="space-y-6 text-left">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#48c1d2] flex items-center justify-center text-[#142d53] shadow-lg shadow-[#48c1d2]/20"><Sparkles size={16} /></div>
          <h3 className="text-xl font-bold text-[#142d53] italic">Próximos contenidos</h3>
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
                      <span className="text-[7px] font-bold px-2 py-0.5 bg-[#48c1d2] text-[#142d53] rounded-full w-fit italic">Día {key}</span>
                      <span className="text-[6px] font-bold text-[#48c1d2]/60 tracking-widest">{post.type}</span>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); toggleExpand(key); }} className="cursor-pointer w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#48c1d2] border border-white/5">{isExpanded ? <X size={14} /> : <Sparkles size={14} />}</div>
                  </div>
                  <h4 className="text-sm font-bold text-white italic leading-tight tracking-tighter line-clamp-2">{post.title}</h4>
                  {isExpanded ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1.5"><h5 className="text-[7px] font-bold text-[#48c1d2] tracking-widest opacity-60">Concepto</h5><div className="p-3 bg-black/40 rounded-2xl border border-white/5"><p className="text-[10px] font-medium text-white italic leading-tight">"{post.desc}"</p></div></div>
                      <div className="space-y-1.5"><h5 className="text-[7px] font-bold text-[#48c1d2] tracking-widest opacity-60">Texto Viral</h5><div className="p-3 bg-white/5 rounded-2xl border border-white/10"><p className="text-[10px] font-medium text-white/70 italic leading-snug mb-2">{post.copy}</p><p className="text-[9px] font-mono text-[#48c1d2] font-bold truncate">{post.hashtags}</p></div></div>
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
function HistorialSection({ contentDB, onSelect, showToast, activeTab }: { contentDB: any, onSelect: (key: string) => void, showToast: (msg: string, type?: ToastType) => void, activeTab: string }) {
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

  // Sincronizar URL cuando cambian las vistas
  const updateUrl = (newView: string, m?: string, w?: string | number) => {
    const params = new URLSearchParams(searchParams.toString());
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

  useEffect(() => {
    async function fetchAll() {
      const [{ data: reports }, { data: locs }] = await Promise.all([
        supabase.from('reportes_audio').select('*').order('created_at', { ascending: false }),
        supabase.from('locuciones').select('*').order('created_at', { ascending: false })
      ]);
      if (reports) setAudioReports(reports);
      if (locs) setLocuciones(locs);
    }
    fetchAll();
  }, []);

  const handleDeleteReport = async (reportId: string, audioUrl: string) => {
    if (!confirm("¿Borrar este reporte para ahorrar espacio?")) return;
    try {
      const fileName = audioUrl.split('/').pop();
      if (fileName) await supabase.storage.from('audios').remove([fileName]);
      await supabase.from('reportes_audio').delete().eq('id', reportId);
      setAudioReports(prev => prev.filter(r => r.id !== reportId));
      showToast("Reporte eliminado y espacio liberado", "success");
    } catch (err) {
      showToast("Error al eliminar", "error");
    }
  };

  const handleDeleteLocucion = async (locId: string, audioUrl: string) => {
    if (!confirm("¿Borrar esta locución?")) return;
    try {
      const fileName = audioUrl.split('/').pop();
      if (fileName) await supabase.storage.from('audios').remove([fileName]);
      await supabase.from('locuciones').delete().eq('id', locId);
      setLocuciones(prev => prev.filter(l => l.id !== locId));
      showToast("Locución eliminada", "success");
    } catch (err) {
      showToast("Error al eliminar", "error");
    }
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

  if (view === 'analytics') {
    return (
      <div
        onPaste={handlePaste}
        className="space-y-8 animate-in slide-in-from-bottom-4 duration-700 text-left pb-0"
      >
        <div className="flex flex-col gap-6">
          <button onClick={() => handleSetView('meses')} className="flex items-center gap-2 text-[#142d53] text-xs font-black uppercase tracking-widest">
            <ChevronRight className="rotate-180" size={14} /> VOLVER AL REPOSITORIO
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h3 className="text-3xl font-black text-[#142d53] tracking-tighter uppercase">LABORATORIO DE ÉXITO</h3>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 items-start">
          {/* Visualizador de Galería Vertical */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative group bg-white rounded-[3rem] p-4 border-8 transition-all duration-300 ${isDragging ? 'border-[#48c1d2] scale-[1.02] shadow-[0_0_50px_rgba(72,193,210,0.3)]' : 'border-slate-50 shadow-2xl'}`}
          >
            {/* VISTA UNIFICADA: REPORTE OFICIAL */}
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
              {/* Impacto Visual */}
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

              {/* Alcance Real */}
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

              {/* Interés Comercial */}
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

              {/* Factor Viral */}
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
                    <p key={i} className="text-xl font-bold text-white leading-tight flex gap-3">
                      <span className="text-[#48c1d2] shrink-0">•</span>
                      <span>{line.replace(/^•\s*/, '')}</span>
                    </p>
                  )) : (
                    <p className="text-sm font-bold text-white/40 italic">pendiente de análisis estratégico...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Nuevos Seguidores */}
            <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl text-left relative overflow-hidden flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-slate-400 tracking-widest block mb-1 uppercase">crecimiento de comunidad</span>
                <p className="text-2xl font-black text-[#48c1d2] tracking-tighter">+{analytics[0].seguidores} seguidores ganados</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 tracking-widest block mb-1 uppercase">total en cuenta</span>
                <p className="text-xl font-black text-[#142d53] tracking-tighter">85</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'meses') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 text-left">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gestión de Resultados</h3>
        </div>

        {/* ÁREA DEDICADA DE RENDIMIENTO */}
        <div
          onClick={() => handleSetView('analytics')}
          className="p-8 rounded-[3rem] bg-gradient-to-br from-[#142d53] to-[#0a1629] border border-[#48c1d2]/20 shadow-2xl cursor-pointer hover:scale-[1.02] transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#48c1d2] rounded-2xl flex items-center justify-center text-[#142d53] shadow-lg shadow-[#48c1d2]/20">
                <Sparkles size={24} />
              </div>
              <div>
                <h4 className="text-xl font-black text-white italic tracking-tighter uppercase">Laboratorio de Rendimiento</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#48c1d2] uppercase tracking-[0.3em]">Analítica Estratégica</span>
                  <span className="px-2 py-0.5 bg-green-500 text-[8px] font-black text-[#142d53] rounded-full animate-pulse">¡VIRAL!</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest leading-relaxed">
                <span className="text-[#48c1d2]">Tu Brújula de Éxito:</span> Aquí es donde medimos qué tan bien están funcionando tus videos. Sube tus capturas de Instagram y nosotros analizaremos el crecimiento de Epotech para ajustar los próximos guiones y atraer más clientes reales.
              </p>
            </div>
            <button className="flex items-center gap-2 text-[9px] font-black text-[#48c1d2] uppercase tracking-widest">
              Entrar al Análisis <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* === ARCHIVO DE AUDIO: TU REPORTE PRO === */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#142d53] rounded-xl flex items-center justify-center">
                <Mic size={14} className="text-[#48c1d2]" />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Tu Reporte Pro</h3>
            </div>
            <span className="text-[9px] font-black text-[#48c1d2] bg-[#48c1d2]/10 px-3 py-1 rounded-full">{audioReports.length} nota{audioReports.length !== 1 ? 's' : ''}</span>
          </div>

          {audioReports.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aún no hay reportes enviados</p>
            </div>
          ) : (
            <div className="space-y-3">
              {audioReports.map((report: any) => (
                <div key={report.id} className="p-4 bg-[#142d53] rounded-[2rem] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div>
                      <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-widest">Reporte de Campo</span>
                      <p className="text-[11px] font-bold text-white/60 uppercase">{new Date(report.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-white/40 uppercase">{report.duracion || ''}</span>
                      <button onClick={() => handleDeleteReport(report.id, report.audio_url)} className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center transition-all border border-red-500/20">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <CustomAudioPlayer title="Reporte de Audio" src={report.audio_url} />
                  <a href={report.audio_url} download={`reporte_${report.id}.webm`} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10">
                    <Download size={12} /> Descargar
                  </a>
                </div>
              ))}
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
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Locuciones de Guiones</h3>
            </div>
            <span className="text-[9px] font-black text-[#48c1d2] bg-[#48c1d2]/10 px-3 py-1 rounded-full">{locuciones.length} locución{locuciones.length !== 1 ? 'es' : ''}</span>
          </div>

          {locuciones.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aún no hay locuciones enviadas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {locuciones.map((loc: any) => (
                <div key={loc.id} className="p-4 bg-[#142d53] rounded-[2rem] border border-[#48c1d2]/10 space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex-1 min-w-0 mr-3">
                      <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-widest block">Locución</span>
                      <p className="text-sm font-black text-white uppercase italic truncate leading-tight">{loc.script_title}</p>
                      <p className="text-[10px] font-bold text-white/40 uppercase">{new Date(loc.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <button onClick={() => handleDeleteLocucion(loc.id, loc.audio_url)} className="w-8 h-8 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center transition-all border border-red-500/20 shrink-0">
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <CustomAudioPlayer title={loc.script_title} src={loc.audio_url} />
                  <a href={loc.audio_url} download={`locucion_${loc.script_id}.wav`} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10">
                    <Download size={12} /> Descargar WAV
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center px-2 pt-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Repositorio de Publicaciones</h3>
        </div>

        <button onClick={() => handleSetView('semanas')} style={{ backgroundColor: '#142d53' }} className="w-full p-8 rounded-[2.5rem] flex items-center justify-between border border-white/5 shadow-2xl group relative overflow-hidden transition-all hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-r from-[#48c1d2]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-[#48c1d2]/10 rounded-3xl flex items-center justify-center text-[#48c1d2]"><History size={32} /></div>
            <div className="text-left"><h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">Abril 2026</h4><p className="text-[12px] font-black text-[#48c1d2] tracking-widest mt-1 uppercase">85 SEGUIDORES • {publishedPosts.length} VIDEOS</p></div>
          </div>
          <ChevronRight className="text-white/20 group-hover:text-white/60 transition-all" />
        </button>

        {/* Meses anteriores (Persistencia) */}
        <div className="grid grid-cols-2 gap-4 opacity-40">
          <div className="p-6 bg-slate-100 rounded-[2rem] border border-slate-200"><h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marzo 2026</h5></div>
          <div className="p-6 bg-slate-100 rounded-[2rem] border border-slate-200"><h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Febrero 2026</h5></div>
        </div>
      </div>
    );
  }

  if (view === 'semanas') {
    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 text-left">
        <button onClick={() => handleSetView('meses')} className="flex items-center gap-2 text-[#142d53] text-[9px] font-black uppercase tracking-widest mb-4"><ChevronRight className="rotate-180" size={12} /> Volver</button>
        <h3 className="text-xl font-black text-[#142d53] italic uppercase">Semanas de {selectedMonth}</h3>
        <div className="grid grid-cols-2 gap-4">
          {weeks.map(w => {
            const postsInWeek = publishedPosts.filter(([day]) => getWeek(day) === w);
            return (
              <button key={w} onClick={() => handleSetWeek(w, 'dias')} style={{ backgroundColor: '#142d53' }} className="p-6 rounded-[2.5rem] flex flex-col items-start gap-4 border border-white/5 shadow-xl text-left group hover:scale-105 transition-all">
                <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center text-[#48c1d2] group-hover:bg-[#48c1d2] group-hover:text-[#142d53] transition-all"><History size={20} /></div>
                <div><h5 className="text-sm font-black text-white uppercase italic">SEMANA {w}</h5><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{postsInWeek.length} VIDEOS</p></div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const postsInSelectedWeek = publishedPosts.filter(([day]) => getWeek(day) === selectedWeek);
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 text-left">
      <button onClick={() => handleSetView('semanas')} className="flex items-center gap-2 text-[#142d53] text-[9px] font-black uppercase tracking-widest mb-4"><ChevronRight className="rotate-180" size={12} /> Volver</button>
      <div className="grid grid-cols-1 gap-4">
        {postsInSelectedWeek.map(([day, post]: any) => (
          <div key={day} onClick={() => onSelect(day)} style={{ backgroundColor: '#142d53' }} className="p-6 rounded-[3rem] shadow-xl flex flex-col gap-4 border border-white/5 cursor-pointer hover:scale-[1.02] transition-all group">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[1.5rem] bg-[#48c1d2] flex flex-col items-center justify-center text-[#142d53] shrink-0 shadow-lg shadow-[#48c1d2]/20"><span className="text-lg font-black leading-none">{day}</span><span className="text-[9px] font-black uppercase opacity-60">ABRIL</span></div>
              <div className="flex-1 min-w-0 text-left"><span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-widest">{post.type}</span><h4 className="text-sm font-black text-white uppercase italic truncate mt-0.5">{post.title}</h4><p className="text-xs font-bold text-white/40 italic mt-1 line-clamp-1 opacity-60">"{post.desc}"</p></div>
              <CheckCircle2 size={24} className="text-[#48c1d2] mr-2" />
            </div>

            {/* Bloque de Reporte de Audio para la Agencia */}
            {(() => {
              const report = audioReports.find(r => r.proyecto_id === post.id || r.proyecto_id === day);
              if (!report) return null;
              return (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="p-4 bg-white/5 rounded-[2rem] border border-[#48c1d2]/20 animate-in slide-in-from-top-2"
                >
                  <div className="flex flex-col gap-4">
                    <CustomAudioPlayer src={report.audio_url} />
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={report.audio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10"
                      >
                        <Download size={12} /> Abrir Solo
                      </a>
                      <a
                        href={report.audio_url}
                        download={`reporte_epotech_${report.id}.${MediaRecorder.isTypeSupported('audio/mp4') ? 'mp4' : 'webm'}`}
                        className="flex-1 py-3 bg-[#48c1d2]/10 hover:bg-[#48c1d2]/20 text-[#48c1d2] rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-[#48c1d2]/20"
                      >
                        <Download size={12} /> Descargar
                      </a>
                      <button
                        onClick={() => handleDeleteReport(report.id, report.audio_url)}
                        className="w-12 h-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center transition-all border border-red-500/20"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}



