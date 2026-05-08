"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Play, 
  Video, 
  BookOpen, 
  ChevronRight, 
  ExternalLink,
  Smartphone,
  Star,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Bell,
  ArrowRight,
  Briefcase,
  PlaySquare,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useThemeColor } from "@/components/layout/ThemeColorHandler";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TUTORIAL_CARDS = [
  {
    title: "¿Cómo grabar como un pro?",
    description: "Aprende a capturar los mejores ángulos de tus trabajos para Reels de alto impacto.",
    icon: Video,
    path: "/manual",
    tag: "Producción"
  },
  {
    title: "Entendiendo mis Proyectos",
    description: "Sigue nuestro avance diario y mira cómo vamos profesionalizando Epotech.",
    icon: Briefcase,
    path: "/proyectos",
    tag: "Operaciones"
  },
  {
    title: "El Poder de tus Guiones",
    description: "Usa tus notas de voz para que nosotros creemos guiones ganadores para ti.",
    icon: Sparkles,
    path: "/contenido?tab=guiones",
    tag: "Contenido"
  },
  {
    title: "Motor de Inspiración",
    description: "Mira los videos y tendencias que usamos como referencia para tus Reels.",
    icon: PlaySquare,
    path: "/referencias",
    tag: "Creatividad"
  }
];

export default function AcademyPage() {
  const router = useRouter();
  useThemeColor("#ffffff");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as "success" | "error" | "info" });

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: aData } = await supabase.from("config_academia").select("*").maybeSingle();
        setData(aData || {});
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const tutorialVideoId = "dQw4w9WgXcQ";

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-8">
      {/* HEADER LIMPIO Y PREMIUM */}
      <div className="pt-[env(safe-area-inset-top)] bg-white">
        <div className="max-w-5xl mx-auto px-6 pt-12 pb-16 relative z-10">
          <div className="flex justify-between items-start gap-4">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#142d53] flex items-center justify-center shadow-lg">
                  <BookOpen size={20} className="text-[#48c1d2]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Academia Epotech</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#142d53] mb-6 leading-none">
                Centro de <span className="text-[#48c1d2]">Mando</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed mb-8">
                Hola Sebastian, aquí tienes todo lo necesario para dominar tu plataforma y llevar Epotech al siguiente nivel.
              </p>
              
              <div className="flex flex-col md:flex-row items-center gap-6">
                <button 
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`w-full md:w-auto px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 border-b-4 ${
                    isSubscribed 
                    ? "bg-slate-800 text-[#48c1d2] border-slate-900" 
                    : "bg-[#48c1d2] hover:bg-[#35a5b5] text-[#142d53] border-[#2d8c9a] hover:scale-105"
                  }`}
                >
                  {isSubscribed ? <ShieldCheck size={20} /> : <Bell size={20} fill="currentColor" />}
                  {isSubscribed ? "Notificaciones Activas" : "Activar Notificaciones"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-20 space-y-12">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#142d53]/10 border-t-[#48c1d2]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#142d53]/40 animate-pulse">Preparando tu formación...</p>
          </div>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-1000">
            {/* TUTORIAL PRINCIPAL */}
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center gap-8 group">
              <div 
                onClick={() => setIsPlaying(true)}
                className="w-full md:w-auto md:min-w-[300px] aspect-[9/16] max-h-[500px] bg-slate-900 rounded-[3rem] relative overflow-hidden flex items-center justify-center border-[12px] border-[#142d53] shadow-2xl group-hover:scale-[1.02] transition-transform duration-500 cursor-pointer mx-auto"
              >
                {isPlaying ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${tutorialVideoId}?autoplay=1&rel=0&modestbranding=1`}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#142d53] to-[#48c1d2]/40 opacity-60"></div>
                    <div className="w-16 h-16 rounded-full bg-[#48c1d2] flex items-center justify-center shadow-2xl shadow-[#48c1d2]/50 relative z-10">
                      <Play size={24} className="text-[#142d53] ml-1" fill="currentColor" />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest bg-[#142d53]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        Tutorial General
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-black text-[#142d53] tracking-tight">¡Bienvenido a bordo!</h2>
                <p className="text-slate-600 font-medium leading-relaxed">
                  He preparado este video para mostrarte cómo navegar por cada sección. Dale play y descubre cómo estamos organizando todo tu trabajo de 2026.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-[#48c1d2]/10 text-[#48c1d2] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Paso a paso</span>
                  <span className="bg-purple-100 text-purple-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Navegación</span>
                </div>
              </div>
            </div>

            {/* CATEGORIES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {TUTORIAL_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <Link 
                    key={card.title}
                    href={card.path}
                    className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 flex flex-col group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-[#142d53] transition-colors duration-500">
                        <Icon size={24} className="text-[#142d53] group-hover:text-[#48c1d2] transition-colors" />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">{card.tag}</span>
                    </div>
                    <h3 className="text-xl font-black text-[#142d53] mb-3 tracking-tight group-hover:text-[#48c1d2] transition-colors">{card.title}</h3>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed flex-1 mb-6">{card.description}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#48c1d2]">
                      Ir a la sección <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} />
    </div>
  );
}
