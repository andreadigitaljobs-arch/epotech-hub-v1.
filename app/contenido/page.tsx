"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Tesseract from 'tesseract.js';
import { 
  Clapperboard, 
  Calendar, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Clock,
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
import { guiones, Script } from "@/data/scripts";
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
  } catch (err) {}
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
  } catch (err) {}
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
      <style dangerouslySetInnerHTML={{__html: `
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
    if (tabParam === 'historial') {
      setActiveTab('historial');
    } else {
      const savedTab = localStorage.getItem('epotech_production_tab');
      if (savedTab) setActiveTab(savedTab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    localStorage.setItem('epotech_production_tab', tabId);
  };

  const filteredGuiones = guiones.filter(g => 
    (activeCategory === 'Todas' || g.service === activeCategory) &&
    (activeFormat === 'Todos' || g.category === activeFormat)
  );
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [serviceContext, setServiceContext] = useState<'active' | 'brand'>('active');
  const [productionMode, setProductionMode] = useState<'historias' | 'biblioteca' | 'manual'>('historias');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
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
    if (selectedScript && voiceoverFragments.length > 0) {
      saveVoiceoverDraft(selectedScript.id, voiceoverFragments);
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
        ideas.forEach((idea, index) => {
          const day = (14 + index).toString(); 
          mappedPlan[day] = {
            status: idea.status || 'Pendiente',
            title: idea.titulo,
            type: idea.tipo || 'Reel',
            objetivo: 'Branding',
            desc: idea.descripcion,
            copy: 'Cargando texto estratégico...',
            hashtags: '#EpotechSolutions #PisosEpoxy',
            date: `${day} Abr`
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
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${isAnimate && !isClosing ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleCloseScript}
      />
      
      <div className={`relative w-full max-w-lg bg-[#0a192f] border border-white/10 rounded-[40px] overflow-visible flex flex-col max-h-[90vh] shadow-2xl transition-all duration-500 ${isClosing ? 'scale-95 opacity-0 translate-y-10' : isAnimate ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-20'}`}>
        {/* Encabezado - Fijo y Simplificado */}
        <div className="p-6 pb-2 border-b border-white/5">
           <div className="flex justify-between items-start text-left">
              <div>
                 <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[2px] mb-1 block">
                    {selectedScript.category}
                 </span>
                 <h2 className="text-xl font-black text-white leading-tight">
                    {selectedScript.title}
                 </h2>
              </div>
              <div className="flex items-center gap-2">
                 <div className="relative">
                 <button 
                   onClick={() => setShowFullScript(!showFullScript)} 
                   className={`px-4 py-2 rounded-full flex items-center justify-center gap-2 transition-all ${showFullScript ? "bg-[#48c1d2] text-[#0a192f] shadow-lg" : "bg-white/5 text-white/40 hover:text-white border border-white/5"} ${showHelp && teleHelpStep === 2 ? 'ring-4 ring-[#48c1d2] animate-pulse z-40' : ''}`}>
                    {showFullScript ? (
                      <>
                        <Zap size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">GRABAR</span>
                      </>
                    ) : (
                      <>
                        <BookOpen size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">LEER COMPLETO</span>
                      </>
                    )}
                 </button>
                 {showHelp && teleHelpStep === 2 && (
                       <div className="absolute top-full mt-4 right-0 bg-[#48c1d2] text-[#142d53] p-5 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-64 z-[100] border-2 border-white/20 animate-in zoom-in duration-300 guide-bubble-active">
                         <div className="flex flex-col gap-2">
                           <span>
                             {showFullScript 
                               ? "PASO 5: Ahora tienes todo el guion a la vista. Si prefieres volver al modo de pasos cortos para leer más cómodo, toca aquí." 
                               : "PASO 5: ¿Prefieres fluir sin pasar páginas? Toca aquí para ver todo el guion de una vez."}
                           </span>
                           <div className="flex gap-2 justify-end">
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setShowFullScript(false); // Volver al modo por pasos
                                  setTeleHelpStep(1); 
                                }}
                                className="bg-white/10 text-white px-3 py-1.5 rounded-xl hover:bg-white/20 transition-all text-[8px] border border-white/10"
                              >
                                VOLVER
                              </button>
                              <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  // Si está en FULL, saltamos el paso de "Siguiente Toma" (paso 6)
                                  setTeleHelpStep(showFullScript ? 4 : 3); 
                                }}
                                className="bg-white text-[#48c1d2] px-3 py-1.5 rounded-xl hover:bg-teal-50 transition-colors text-[8px] border border-white/10 font-black"
                              >
                                ENTENDIDO
                              </button>
                           </div>
                         </div>
                         <div className="absolute -top-3 right-8 w-6 h-6 bg-[#48c1d2] rotate-45 border-l-2 border-t-2 border-white/20"></div>
                       </div>
                     )}
               </div>
                 <button onClick={handleCloseScript} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white transition-colors border border-white/5">
                    <X size={20} />
                 </button>
              </div>
           </div>
        </div>
        
        {/* Área de Contenido: Teleprompter vs Guion Completo */}
        <div className="flex-1 overflow-y-auto p-6 pt-10 flex flex-col justify-start space-y-6">
           {showFullScript ? (
              <div className="animate-in fade-in zoom-in-95 duration-500 text-left space-y-10 w-full">
                 <div className="space-y-10">
                    {selectedScript.steps.map((s: any, i: number) => (
                       <div key={i} className="space-y-3">
                          <div className="flex items-center gap-3">
                             <span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[3px]">ACTO {i+1}</span>
                             <div className="flex-1 h-[1px] bg-white/10" />
                          </div>
                          <p className="text-lg font-medium text-white/90 leading-relaxed italic">
                             "{s.script}"
                          </p>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                             <h5 className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                <Video size={10} /> Referencia Visual
                             </h5>
                             <p className="text-[11px] font-bold text-white/40 leading-snug uppercase">
                                {s.visualField}
                             </p>
                          </div>
                       </div>
                    ))}
                 </div>
                 
                 
              </div>
           ) : mergedVoiceoverUrl ? (
              <div className="flex flex-col items-center justify-center h-full space-y-6 animate-in zoom-in duration-500 pt-10">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                   <CheckCircle2 size={48} className="text-green-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest text-center">Locución Completada</h3>
                <p className="text-slate-400 text-xs font-bold text-center max-w-xs">Tus tomas han sido unidas en un solo archivo de audio continuo.</p>
                
                <div className="w-full max-w-xs mt-4">
                   <CustomAudioPlayer title="Vista Previa" src={mergedVoiceoverUrl} />
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
                   <a href={mergedVoiceoverUrl} download={`Locucion_${selectedScript.id}.wav`} className="w-full py-4 bg-white/5 text-white hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10">
                     <Download size={16} /> Descargar Audio Final
                   </a>
                   <button onClick={() => setMergedVoiceoverUrl(null)} className="w-full py-4 bg-white/5 text-white/50 hover:text-white hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
                     Revisar Tomas
                   </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2 px-2">
                   <span className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[3px]">Paso {currentStepIdx + 1} de {selectedScript.steps.length}</span>
                   <div className="flex gap-1">
                      {selectedScript.steps.map((_: any, i: number) => (
                         <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === currentStepIdx ? 'w-6 bg-[#48c1d2]' : 'w-2 bg-white/10'}`} />
                      ))}
                   </div>
                </div>

                <div className={`space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left transition-all ${showHelp && teleHelpStep === 1 ? "pt-24" : ""}`}>
                    <div className={`bg-[#48c1d2] p-8 rounded-[40px] relative group shadow-2xl shadow-[#48c1d2]/20 ${showHelp && teleHelpStep === 1 ? 'z-50' : ''}`}>
                    {showHelp && teleHelpStep === 1 && <div className="absolute inset-0 rounded-[40px] ring-8 ring-[#142d53]/30 animate-pulse pointer-events-none" />}
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                         <Sparkles size={60} className="text-[#0a192f]" />
                      </div>
                      <h4 className="text-[9px] font-black text-[#0a192f] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Mic size={14} /> Tu guion para leer:
                       </h4>
                       {showHelp && teleHelpStep === 1 && (
                         <div className="absolute -top-32 left-1/2 -translate-x-1/2 bg-[#0a192f] text-white p-5 rounded-[2.5rem] text-[10px] font-bold shadow-2xl w-72 z-[100] border-2 border-[#48c1d2]/30 animate-in zoom-in duration-300 guide-bubble-active">
                           <div className="flex flex-col gap-2">
                             <span>PASO 4: Lee este texto o di algo muy parecido. Este "Hook" está diseñado para enganchar a tu audiencia en segundos.</span>
                             <div className="flex gap-2 justify-end">
                               <button 
                                 onClick={(e) => { 
                                   e.stopPropagation(); 
                                   setSelectedScript(null); // Cerrar teleprompter
                                   setDashHelpStep(2); // Volver al paso 3 del dash
                                 }}
                                 className="bg-white/10 text-white px-3 py-1.5 rounded-xl hover:bg-white/20 transition-all text-[8px] border border-white/10"
                               >
                                 VOLVER
                               </button>
                               <button 
                                 onClick={(e) => { e.stopPropagation(); setTeleHelpStep(2); }}
                                 className="bg-[#48c1d2] text-[#0a192f] px-3 py-1.5 rounded-xl hover:bg-[#3aa8b8] transition-colors text-[8px] font-black"
                               >
                                 ENTENDIDO, SIGUIENTE TIP
                               </button>
                             </div>
                           </div>
                           <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#0a192f] rotate-45 border-r-2 border-b-2 border-[#48c1d2]/30"></div>
                         </div>
                       )}
                      <p className="text-2xl font-black text-[#0a192f] leading-[1.1] tracking-tight">
                         "{selectedScript.steps[currentStepIdx].script}"
                      </p>

                      {/* NUEVO: GRABADORA DE FRAGMENTOS (VOZ EN OFF) */}
                      <div className="mt-8 flex flex-col items-center">
                         {isRecordingVoiceover ? (
                           <div className="flex flex-col items-center gap-2">
                             <button 
                               onClick={stopVoiceoverRecording}
                               className="w-16 h-16 rounded-full bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] flex items-center justify-center text-white active:scale-95 transition-all animate-pulse border-4 border-red-400"
                             >
                               <div className="w-5 h-5 bg-white rounded-sm" />
                             </button>
                             <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">Grabando toma...</span>
                           </div>
                         ) : (
                           <div className="flex flex-col items-center gap-2">
                             {voiceoverFragments.find(f => f.stepIdx === currentStepIdx) ? (
                               <div className="flex flex-col items-center gap-2">
                                 <div className="flex gap-2">
                                   <button 
                                     onClick={() => {
                                       const audioUrl = voiceoverFragments.find(f => f.stepIdx === currentStepIdx)?.url;
                                       if (audioUrl) {
                                         toggleVoiceoverPlayback(audioUrl);
                                       }
                                     }}
                                     className="px-4 py-2 bg-green-500/20 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/30 hover:bg-green-500/30 flex items-center gap-2 w-[100px] justify-center"
                                   >
                                     {isPlayingVoiceover ? <PauseCircle size={14} /> : <PlayCircle size={14} />} 
                                     {isPlayingVoiceover ? 'Pausar' : 'Escuchar'}
                                   </button>
                                   <button 
                                     onClick={() => startVoiceoverRecording(currentStepIdx)}
                                     className="px-4 py-2 bg-white/40 text-[#0a192f] rounded-full text-[10px] font-black uppercase tracking-widest border border-white/40 hover:bg-white/60 flex items-center gap-2"
                                   >
                                     <History size={14} /> Regrabar
                                   </button>
                                   <button 
                                     onClick={() => deleteVoiceoverFragment(currentStepIdx)}
                                     className="px-4 py-2 bg-red-500/10 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500/20 flex items-center gap-2"
                                   >
                                     <Trash2 size={14} /> Eliminar
                                   </button>
                                 </div>
                                 <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Toma Guardada</span>
                               </div>
                             ) : (
                               <>
                                 <button 
                                   onClick={() => startVoiceoverRecording(currentStepIdx)}
                                   className="w-16 h-16 rounded-full bg-[#142d53] shadow-[0_0_20px_rgba(20,45,83,0.3)] flex items-center justify-center text-[#48c1d2] hover:scale-105 active:scale-95 transition-all border-2 border-[#142d53]"
                                 >
                                   <Mic size={28} />
                                 </button>
                                 <span className="text-[10px] font-black text-[#142d53]/70 uppercase tracking-widest">Grabar esta toma</span>
                               </>
                             )}
                           </div>
                         )}
                      </div>
                   </div>

                   <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] space-y-2">
                      <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <Video size={14} /> Referencia Visual (Usa estos clips)
                      </h5>
                      <p className="text-sm font-bold text-white/80 leading-relaxed italic">
                         {selectedScript.steps[currentStepIdx].visualField}
                      </p>
                   </div>
                </div>
              </>
           )}
        </div>

         {/* Pie de Página - Controles Teleprompter - Solo se ven en modo por pasos y si no se ha fusionado el audio */}
         {!showFullScript && !mergedVoiceoverUrl && (
           <div className="p-6 border-t border-white/5 bg-[#0a192f]/80 backdrop-blur-md flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
           {currentStepIdx > 0 && (
             <button 
               onClick={() => {
                 const prevIdx = currentStepIdx - 1;
                 const wasRecording = isRecordingVoiceover;
                 if (wasRecording) stopVoiceoverRecording();
                 setCurrentStepIdx(prevIdx);
                 if (wasRecording) {
                   setTimeout(() => startVoiceoverRecording(prevIdx), 400);
                 }
               }}
               className="flex-1 py-5 bg-white/10 text-white text-xs font-black uppercase tracking-[2px] rounded-[24px] border border-white/10 transition-all active:scale-95"
             >
               Anterior
             </button>
           )}
           
           {currentStepIdx < selectedScript.steps.length - 1 ? (
              <div className="flex-[2] relative">
                <button 
                  onClick={() => {
                    const nextIdx = currentStepIdx + 1;
                    const wasRecording = isRecordingVoiceover;
                    if (wasRecording) stopVoiceoverRecording();
                    setCurrentStepIdx(nextIdx);
                    if (wasRecording) {
                      setTimeout(() => startVoiceoverRecording(nextIdx), 400);
                    }
                  }}
                  className={`w-full py-5 bg-[#48c1d2] text-[#0a192f] text-xs font-black uppercase tracking-[2px] rounded-[24px] shadow-xl shadow-[#48c1d2]/20 transition-all active:scale-95 z-10`}
                >
                  Siguiente Toma
                </button>
              </div>
            ) : (
              <div className="flex-[2] relative">
                <button 
                  onClick={mergeVoiceoverFragments}
                  className={`w-full py-5 bg-[#48c1d2] text-[#0a192f] text-xs font-black uppercase tracking-[2px] rounded-[24px] shadow-xl shadow-[#48c1d2]/20 transition-all active:scale-95 border-b-4 border-[#3aa8b8] z-10 flex items-center justify-center gap-2`}
                >
                  <Sparkles size={16} /> UNIR Y DESCARGAR LOCUCIÓN
                </button>
                {showHelp && teleHelpStep === 4 && (
                  <div className="absolute -top-24 right-0 bg-[#142d53] text-[#48c1d2] p-5 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-64 z-[100] border-2 border-[#48c1d2]/30 animate-in zoom-in duration-300 guide-bubble-active">
                    <div className="flex flex-col gap-2">
                      <span>PASO 7: ¡Casi terminas! Toca aquí para pasar al reporte final. Es vital para escribir el copy de tu video.</span>
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            // Si está en FULL, volvemos directamente al botón de modo lectura (paso 5)
                            setTeleHelpStep(showFullScript ? 2 : 3); 
                          }}
                          className="bg-white/5 text-[#48c1d2] px-3 py-1.5 rounded-xl hover:bg-white/10 transition-all text-[8px] border border-[#48c1d2]/20"
                        >
                          VOLVER
                        </button>
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setIsClosing(true);
                            setTimeout(() => {
                              setSelectedScript(null);
                              setIsClosing(false);
                              setShowAudioReport(true);
                              setReportHelpStep(1);
                            }, 500);
                          }}
                          className="bg-[#48c1d2] text-[#142d53] px-3 py-1.5 rounded-xl hover:bg-[#3aa8b8] transition-colors text-[8px] font-black"
                        >
                          ENTENDIDO, ¡VAMOS!
                        </button>
                      </div>
                    </div>
                    <div className="absolute -bottom-2 right-10 w-4 h-4 bg-[#142d53] rotate-45 border-r-2 border-b-2 border-[#48c1d2]/30"></div>
                  </div>
                )}
              </div>
            )}
           </div>
         )}

         {/* Si está en modo FULL, mostramos solo el botón de finalizar */}
         {showFullScript && (
           <div className="p-6 border-t border-white/5 bg-[#0a192f]/80 backdrop-blur-md">
             <button 
                onClick={() => {
                  setIsClosing(true);
                  setTimeout(() => {
                    setSelectedScript(null);
                    setIsClosing(false);
                    setShowAudioReport(true);
                    setReportHelpStep(1);
                  }, 500);
                }}
                className="w-full py-5 bg-[#48c1d2] text-[#0a192f] text-xs font-black uppercase tracking-[2px] rounded-[24px] shadow-xl shadow-[#48c1d2]/20 transition-all active:scale-95 border-b-4 border-[#3aa8b8] flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> FINALIZAR Y HACER REPORTE
              </button>
           </div>
         )}
      </div>
    </div>, document.body
  ) : null;

  return (
    <div className="max-w-md md:max-w-5xl mx-auto pt-6 pb-24 px-4 text-center">
      <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex items-center gap-2 bg-[#48c1d2]/10 px-3 py-1.5 rounded-full mb-3">
          <div className="w-5 h-5 bg-[#48c1d2] rounded-lg flex items-center justify-center">
            <Sparkles size={12} className="text-[#142d53]" />
          </div>
          <span className="text-[10px] font-black text-[#142d53] uppercase tracking-widest">Estudio Epotech 2026</span>
        </div>
         <h1 className="text-3xl font-black text-[#142d53] leading-tight tracking-tighter">
          Estudio de<br/>
          <span className="text-[#48c1d2]">Producción</span>
        </h1>
        <button 
          onClick={() => {
            const newState = !showHelp;
            setShowHelp(newState);
            if (newState) {
              setDashHelpStep(1);
              setTeleHelpStep(1);
              setReportHelpStep(1);
              handleTabChange('guiones');
            }
          }}
          className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showHelp ? 'bg-[#142d53] text-[#48c1d2]' : 'bg-white text-slate-400 border border-slate-100'}`}
        >
          {showHelp ? <X size={14} /> : <HelpCircle size={14} />}
          {showHelp ? 'Cerrar Guía' : '¿Cómo grabar mi contenido?'}
        </button>
        
      </div>

      {/* REPORTE DE AUDIO - ACCESO DIRECTO DE ELITE */}
      <div className={`mb-8 px-2 animate-in fade-in slide-in-from-top-6 duration-1000 delay-200 relative`}>
        <button 
          onClick={() => setShowAudioReport(true)}
          className="w-full bg-[#142d53] hover:bg-[#0a192f] text-white p-4 rounded-[2rem] flex items-center justify-between group transition-all shadow-xl shadow-slate-200/50 active:scale-95 border-b-4 border-slate-950 relative overflow-hidden"
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
              onClick={() => { handleTabChange(tab.id); if(tab.step === 1) setDashHelpStep(1); }} 
              className={`w-full py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-[#142d53] text-[#48c1d2] shadow-md' : 'text-slate-400'} ${showHelp && tab.step === 1 && dashHelpStep === 1 ? 'ring-4 ring-[#48c1d2] animate-pulse z-40' : ''}`}
            >
              <tab.icon size={12} /> {tab.name}
            </button>
            {showHelp && tab.step === 1 && dashHelpStep === 1 && (
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 bg-[#48c1d2] text-[#142d53] p-5 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-48 z-50 border-2 border-white/20 animate-in zoom-in duration-300 guide-bubble-active">
                <div className="flex flex-col gap-2">
                  <span>PASO 1: {tab.help}</span>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleTabChange('guiones');
                      setDashHelpStep(2); 
                    }}
                    className="bg-[#142d53] text-[#48c1d2] px-3 py-1.5 rounded-xl self-end hover:scale-105 transition-all text-[8px] border border-white/10 font-black"
                  >
                    SIGUIENTE
                  </button>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#48c1d2] rotate-45 border-r-2 border-b-2 border-white/20"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Texto Tutorial Contextual */}
      <div className="mb-8">
        {activeTab === 'guiones' && (
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            <span className="text-[#48c1d2]">Banco de Guiones:</span> Elige un guion según tu servicio y modo de grabación.
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
            <div className="flex bg-slate-100 p-1.5 rounded-xl mb-4 gap-2">
              {[
                { id: 'historias', name: 'Mis Trabajos (Real)', icon: BookOpen, step: 2, help: 'Entra aquí para ver tus videos de hoy.' },
                { id: 'biblioteca', name: 'Ejemplos de Referencia', icon: Library }
              ].map((m) => (
                  <div key={m.id} className="flex-1 relative">
                    <button 
                      onClick={() => { setProductionMode(m.id as any); if(m.step === 2) setDashHelpStep(2); }}
                      className={`w-full py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${productionMode === m.id ? 'bg-[#142d53] text-[#48c1d2] shadow-md' : 'text-slate-400'} ${showHelp && m.step === 2 && dashHelpStep === 2 ? 'ring-4 ring-[#48c1d2] animate-pulse z-40' : ''}`}
                    >
                      <m.icon size={12} /> {m.name}
                    </button>
                    {showHelp && m.step === 2 && dashHelpStep === 2 && (
                      <div className="absolute -top-32 left-1/2 -translate-x-1/2 bg-[#48c1d2] text-[#142d53] p-5 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-48 z-50 border-2 border-white/20 animate-in zoom-in duration-300 guide-bubble-active">
                        <div className="flex flex-col gap-2">
                          <span>PASO 2: {m.help}</span>
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                handleTabChange('inicio');
                                setDashHelpStep(1); 
                              }}
                              className="bg-white/10 text-white px-3 py-1.5 rounded-xl hover:bg-white/20 transition-all text-[8px] border border-white/10"
                            >
                              VOLVER
                            </button>
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setProductionMode('historias');
                                setDashHelpStep(3); 
                              }}
                              className="bg-white text-[#48c1d2] px-3 py-1.5 rounded-xl hover:bg-teal-50 transition-colors text-[8px] border border-white/10 font-black"
                            >
                              SIGUIENTE
                            </button>
                          </div>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#48c1d2] rotate-45 border-r-2 border-b-2 border-white/20"></div>
                      </div>
                    )}
                  </div>
              ))}
            </div>

            {productionMode === 'historias' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
                <div className="bg-[#142d53]/5 p-6 rounded-[2.5rem] border border-[#142d53]/10">
                  <h3 className="text-lg font-black text-[#142d53] mb-2 tracking-tight">Mis Trabajos Realizados</h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-6">Guiones creados a partir de tus fotos y videos reales.</p>
                  
                  <div className="grid gap-4">
                    {/* Placeholder para Proyecto Nikki */}
                      <div 
                        onClick={() => {
                          const nikkiScript = guiones.find(g => g.id === 'nikki-park-city');
                          if (nikkiScript) { 
                            setSelectedScript(nikkiScript); 
                            setCurrentStepIdx(0);
                            if(showHelp) setTeleHelpStep(1); 
                          }
                        }}
                        className={`bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-[#48c1d2]/50 transition-all cursor-pointer active:scale-95 relative ${showHelp && dashHelpStep === 3 ? 'z-40 scale-105' : ''}`}>
                        {showHelp && dashHelpStep === 3 && <div className="absolute inset-0 rounded-[2rem] ring-4 ring-[#48c1d2] animate-pulse pointer-events-none" />}
                        {showHelp && dashHelpStep === 3 && (
                          <div className="absolute -top-32 left-1/2 -translate-x-1/2 bg-[#48c1d2] text-[#142d53] p-5 rounded-[2.5rem] text-[10px] font-black shadow-2xl w-48 z-50 border-2 border-white/20 animate-in zoom-in duration-300 guide-bubble-active">
                            <div className="flex flex-col gap-2">
                              <span>PASO 3: ¡Este es tu proyecto! Tócalo para empezar. La guía continuará automáticamente dentro del guion.</span>
                              <div className="flex gap-2 justify-end">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setDashHelpStep(2); }}
                                  className="bg-[#142d53]/10 text-[#142d53] px-3 py-1.5 rounded-xl hover:bg-[#142d53]/20 transition-all text-[8px] border border-[#142d53]/20"
                                >
                                  VOLVER
                                </button>
                                <button 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    const nikkiScript = guiones.find(g => g.id === 'nikki-park-city');
                                    if (nikkiScript) { 
                                      setSelectedScript(nikkiScript); 
                                      setCurrentStepIdx(0);
                                      setTeleHelpStep(1); 
                                    }
                                  }}
                                  className="bg-[#142d53] text-[#48c1d2] px-3 py-1.5 rounded-xl hover:scale-105 transition-all text-[8px] font-black shadow-lg"
                                >
                                  ENTENDIDO, ¡VAMOS!
                                </button>
                              </div>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#48c1d2] rotate-45 border-r-2 border-b-2 border-white/20"></div>
                          </div>
                        )}

                        <div className="bg-[#48c1d2]/10 p-3 rounded-2xl group-hover:bg-[#48c1d2] group-hover:text-white transition-all">
                          <MapPin size={20} className="text-[#48c1d2] group-hover:text-white" />
                        </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[7px] font-black text-[#48c1d2] uppercase tracking-[0.2em]">Caso Reciente</span>
                          <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.2em]">Abril 2026</span>
                        </div>
                        <h4 className="text-sm font-black text-[#142d53]">El Rescate del Garage (Efecto Epotech)</h4>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Formato Documental • Voiceover Sugerido</p>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-[#48c1d2] transition-colors" />
                    </div>

                    <div className="border-2 border-dashed border-slate-100 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center opacity-60">
                      <Sparkles size={24} className="text-slate-200 mb-3" />
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Próximo Proyecto</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {productionMode === 'biblioteca' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Selector de Contexto Estratégico */}
                <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 gap-2 mb-8">
                  <button 
                    onClick={() => { setServiceContext('active'); setActiveCategory('Todas'); }}
                    className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${serviceContext === 'active' ? 'bg-[#142d53] text-[#48c1d2] shadow-md' : 'text-slate-400'}`}
                  >
                    <MapPin size={12} /> Tengo un servicio hoy
                  </button>
                  <button 
                    onClick={() => { setServiceContext('brand'); setActiveCategory('Marca Personal'); }}
                    className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${serviceContext === 'brand' ? 'bg-[#142d53] text-[#48c1d2] shadow-md' : 'text-slate-400'}`}
                  >
                    <User size={12} /> Marca Personal / Hablando
                  </button>
                </div>

                {/* Sección de Servicios Pro (Solo si está en activo) */}
                {serviceContext === 'active' && (
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">¿Qué servicio vas a grabar?</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Todas', 'Pressure Washing', 'Window Cleaning', 'Epoxy Floors'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest transition-all ${
                            activeCategory === cat 
                              ? "bg-[#142d53] text-[#48c1d2] shadow-md" 
                              : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estrategia de Contenido Adaptativa */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 text-left">
                    {serviceContext === 'active' ? 'Vibe del Contenido (En Obra)' : 'Formatos de Marca Personal'}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(serviceContext === 'active' 
                      ? ['Todos', 'Especial Utah', 'Antes/Después', 'Educativo', 'Satisfying/ASMR', 'Storytelling', 'Controversia', 'Tips & Hacks']
                      : ['Todos', 'Hablando a Cámara', 'Tips de Negocio', 'Detrás de Escenas', 'Estilo de Vida']
                    ).map((form) => (
                      <button
                        key={form}
                        onClick={() => setActiveFormat(form)}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black tracking-widest transition-all ${
                          activeFormat === form 
                            ? "bg-[#48c1d2] text-[#142d53] shadow-md" 
                            : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        {form}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mb-2 px-1">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Todos los guiones</h4>
                  <span className="text-[9px] font-black text-[#48c1d2] bg-[#48c1d2]/10 px-3 py-1 rounded-full">
                    {filteredGuiones.length} de {guiones.length} Guiones
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-bottom-4 duration-700 text-left">
                {filteredGuiones.map((script) => (
                  <div key={script.id} onClick={() => setSelectedScript(script)} className="p-4 bg-white border border-slate-100 rounded-[2rem] shadow-sm cursor-pointer hover:border-[#48c1d2]/30 transition-all flex flex-col justify-between min-h-[160px]">
                    <div>
                      <div className="flex justify-between mb-3"><span className="text-[7px] font-bold text-[#48c1d2] bg-[#48c1d2]/10 px-2 py-0.5 rounded-full">{script.category}</span><Sparkles size={12} className="text-[#48c1d2]" /></div>
                      <h3 className="text-sm font-black text-[#142d53] leading-tight mb-2 line-clamp-3">{script.title}</h3>
                    </div>
                    <span className="text-[8px] font-bold text-[#48c1d2] flex items-center gap-1 mt-auto">Grabar <ChevronRight size={10} /></span>
                  </div>
                ))}
                </div>
              </div>
            )}


            </div>
          )}
        {activeTab === 'calendario' && <CreacionSection contentDB={contentDB} toggleStatus={toggleGlobalStatus} onSelect={(key: string) => setSelectedProduction({ ...contentDB[key], day: key })} />}
        {activeTab === 'historial' && <HistorialSection contentDB={contentDB} onSelect={(key: string) => setSelectedProduction({ ...contentDB[key], day: key })} showToast={showToast} activeTab={activeTab} />}
      </div>

      {modalContent}
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
                          <span>PASO 8: ¡Felicidades! Terminaste la grabación. Ahora responde estas 5 preguntas para ayudarnos con la edición y el copy.</span>
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                handleCloseAudioReport(); 
                                setTeleHelpStep(4);
                                const nikkiScript = guiones.find(g => g.id === 'nikki-park-city');
                                if (nikkiScript) { setSelectedScript(nikkiScript); if(showHelp) setTeleHelpStep(1); }
                              }}
                              className="bg-white/10 text-white px-3 py-1.5 rounded-xl hover:bg-white/20 transition-all text-[8px] border border-white/10"
                            >
                              VOLVER
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setReportHelpStep(2); }}
                              className="bg-white text-[#48c1d2] px-3 py-1.5 rounded-xl hover:bg-teal-50 transition-colors text-[8px] border border-white/10 font-black"
                            >
                              ENTENDIDO
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
                          <span>PASO 9: Graba tu nota aquí. Puedes pausar si hay ruido o borrar si te equivocas. Tenemos hasta 60 minutos, ¡foco en el valor!</span>
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setReportHelpStep(1); }}
                              className="bg-[#142d53]/10 text-[#142d53] px-3 py-1.5 rounded-xl hover:bg-[#142d53]/20 transition-all text-[8px] border border-[#142d53]/20"
                            >
                              VOLVER
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setShowHelp(false); }}
                              className="bg-[#142d53] text-[#48c1d2] px-3 py-1.5 rounded-xl hover:scale-105 transition-all text-[8px] font-black shadow-lg"
                            >
                              LISTO, ENTENDIDO
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
                                 {recordTime >= 3600 ? 'Límite alcanzado' : (isRecording ? (isPaused ? 'Pausado' : 'Grabando...') : 'Listo para grabar')}
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
                 <input className="bg-white/5 border border-[#48c1d2]/30 text-white font-bold italic w-full p-2 rounded-xl text-lg outline-none" value={editedPost.title} onChange={(e) => setEditedPost({...editedPost, title: e.target.value})} />
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
                    <input className="bg-transparent text-xs font-bold text-white w-full outline-none" value={editedPost.objetivo} onChange={(e) => setEditedPost({...editedPost, objetivo: e.target.value})} />
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
                    <textarea className="bg-transparent text-sm font-medium text-white italic w-full min-h-[80px] outline-none" value={editedPost.desc} onChange={(e) => setEditedPost({...editedPost, desc: e.target.value})} />
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
                       <textarea className="bg-transparent text-xs font-medium text-white/70 italic w-full min-h-[80px] outline-none" value={editedPost.copy} onChange={(e) => setEditedPost({...editedPost, copy: e.target.value})} />
                     ) : (
                       <p className="text-xs font-medium text-white/70 italic">{post.copy}</p>
                     )}
                  </div>
               </div>
               <div>
                  <h4 className="text-[9px] font-bold text-[#48c1d2] tracking-[0.2em] mb-3">Etiquetas (Hashtags)</h4>
                  {isEditing ? (
                    <input className="bg-black/20 text-[10px] font-mono text-[#48c1d2] w-full p-3 rounded-xl outline-none" value={editedPost.hashtags} onChange={(e) => setEditedPost({...editedPost, hashtags: e.target.value})} />
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
  const [selectedDate, setSelectedDate] = useState('16');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const toggleExpand = (key: string) => { setExpandedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]); };

  const monthDays = Array.from({ length: 31 }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0');
    return { date: day, content: contentDB[day] };
  });

  const productionKeys = Object.keys(contentDB).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
        <div className="flex justify-between items-center mb-4 px-2">
           <h4 className="text-[10px] font-bold text-slate-400 tracking-widest">Cronograma de Abril</h4>
           <span className="text-[10px] font-bold text-[#142d53] italic">Epotech Hub</span>
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
              <p className="text-xl font-bold text-[#142d53] italic tracking-tighter">Día {selectedDate} de Abril</p>
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
      week: 1,
      totalViews: '0',
      topVideo: '---',
      growth: '0%',
      insights: '',
      images_reels: [],
      images_account: [],
      alcance: '0',
      seguidores: '0',
      interacciones: '0',
      repro_reels: '0',
      compartidos: '0',
      guardados: '0'
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
      } catch (err) {
        console.error("Critical Load Error:", err);
      }
    }
    loadWeeklyData();
  }, [selectedAnalyticsMonth, selectedAnalyticsWeek]);

  useEffect(() => {
    const defaultInsights = '• ¡Estamos rompiendo la burbuja! El 56% de la audiencia son personas que NO te seguían.\n• Logramos 123 visitas al perfil, lo cual demuestra una intención de compra real muy alta.\n• Recomendación: Seguir con videos satisfactorios pero invitar a ver el link del perfil.';
    
    if (!analytics[0].insights) {
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
      showToast("No se pudo extraer texto de la imagen", "warning");
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
          <button onClick={() => handleSetView('meses')} className="flex items-center gap-2 text-[#142d53] text-[9px] font-bold tracking-widest">
            <ChevronRight className="rotate-180" size={12} /> volver al repositorio
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
             <div className="space-y-1">
                <h3 className="text-3xl font-black text-[#142d53] tracking-tighter">laboratorio de éxito</h3>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest">
                  {selectedAnalyticsMonth === 'Abril' ? 'rango: 23 mar - 22 abr' : 'reporte estratégico mensual'}
                </p>
             </div>
             
             <div className="flex bg-slate-100 p-1 rounded-xl">
                {['Abril', 'Mayo', 'Junio'].map(m => (
                  <button 
                    key={m} 
                    onClick={() => handleSetMonth(m)}
                    className={`px-6 py-3 rounded-lg text-[10px] font-black tracking-widest transition-all ${selectedAnalyticsMonth === m ? 'bg-[#142d53] text-[#48c1d2] shadow-md' : 'text-slate-400'}`}
                  >
                    {m.toLowerCase()}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
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
                  <div className="min-h-[600px] flex flex-col items-center justify-center text-slate-400 p-12 text-center">
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
                    <span className="text-[8px] font-black text-slate-400 tracking-widest block mb-1">impacto visual</span>
                    <p className="text-2xl font-black text-[#142d53] tracking-tighter">{analytics[0].totalViews}</p>
                    <div className="mt-2 text-[7px] font-bold text-slate-400 leading-tight tracking-widest">
                       reproducciones totales en la semana
                    </div>
                 </div>

                 {/* Alcance Real */}
                 <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Users size={40} className="text-[#48c1d2]" />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 tracking-widest block mb-1">alcance real</span>
                    <p className="text-2xl font-black text-[#48c1d2] tracking-tighter">{analytics[0].alcance}</p>
                    <div className="mt-2 text-[7px] font-bold text-green-500 leading-tight tracking-widest">
                       personas únicas alcanzadas
                    </div>
                 </div>

                 {/* Interés Comercial */}
                 <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <User size={40} className="text-blue-500" />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 tracking-widest block mb-1">interés comercial</span>
                    <p className="text-2xl font-black text-blue-500 tracking-tighter">{analytics[0].interacciones}</p>
                    <div className="mt-2 text-[7px] font-bold text-blue-400 leading-tight tracking-widest">
                       visitas directas a tu perfil
                    </div>
                 </div>

                 {/* Factor Viral */}
                 <div className="p-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                       <Share2 size={40} className="text-purple-500" />
                    </div>
                    <span className="text-[8px] font-black text-slate-400 tracking-widest block mb-1">factor viral</span>
                    <p className="text-2xl font-black text-purple-500 tracking-tighter">{parseInt(analytics[0].compartidos) + parseInt(analytics[0].guardados) || 0}</p>
                    <div className="mt-2 text-[7px] font-bold text-purple-400 leading-tight tracking-widest">
                       gente recomendando tu marca
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
                          <p className="text-[8px] font-bold text-white/30 tracking-[0.4em] mt-1 uppercase">foco: prospección masiva</p>
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
                    <span className="text-[8px] font-black text-slate-400 tracking-widest block mb-1">crecimiento de comunidad</span>
                    <p className="text-2xl font-black text-[#48c1d2] tracking-tighter">+{analytics[0].seguidores} seguidores ganados</p>
                 </div>
                 <div className="text-right">
                    <span className="text-[8px] font-black text-slate-400 tracking-widest block mb-1">total en cuenta</span>
                    <p className="text-xl font-black text-[#142d53] tracking-tighter">{selectedAnalyticsWeek === 5 ? '74' : '76'}</p>
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
                <span className="text-[8px] font-bold text-[#48c1d2] uppercase tracking-[0.3em]">Analítica Estratégica</span>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-relaxed">
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
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tu Reporte Pro</h3>
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
                      <span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-widest">Reporte de Campo</span>
                      <p className="text-[10px] font-bold text-white/60">{new Date(report.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
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
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Locuciones de Guiones</h3>
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
                      <span className="text-[9px] font-black text-[#48c1d2] uppercase tracking-widest block">Locución</span>
                      <p className="text-xs font-black text-white truncate leading-tight">{loc.script_title}</p>
                      <p className="text-[9px] font-bold text-white/40">{new Date(loc.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
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
              <div className="text-left"><h4 className="text-2xl font-black text-white italic tracking-tighter uppercase">Abril 2026</h4><p className="text-[10px] font-black text-[#48c1d2] tracking-widest mt-1 uppercase">{publishedPosts.length} Publicaciones listas</p></div>
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
              <div className="h-16 w-16 rounded-[1.5rem] bg-[#48c1d2] flex flex-col items-center justify-center text-[#142d53] shrink-0 shadow-lg shadow-[#48c1d2]/20"><span className="text-[12px] font-black leading-none">{day}</span><span className="text-[7px] font-black uppercase opacity-60">ABRIL</span></div>
              <div className="flex-1 min-w-0 text-left"><span className="text-[7px] font-black text-[#48c1d2] uppercase tracking-widest">{post.type}</span><h4 className="text-sm font-black text-white uppercase italic truncate mt-0.5">{post.title}</h4><p className="text-[10px] font-bold text-white/40 italic mt-1 line-clamp-1 opacity-60">"{post.desc}"</p></div>
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
                            <ExternalLink size={12} /> Abrir Solo
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

