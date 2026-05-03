"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

import { 
  BookOpen, Video, Briefcase, PlaySquare, Target, 
  Sparkles, HelpCircle, ArrowRight, Play, Mic, 
  Search, Smartphone, Zap, Bell, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Toast, ToastType } from "@/components/ui/Toast";
import { supabase } from "@/lib/supabase";

const TUTORIAL_CARDS = [
  {
    title: "¿Cómo grabar como un pro?",
    description: "Aprende a capturar los mejores ángulos de tus trabajos para Reels de alto impacto.",
    icon: Video,
    path: "/manual",
    color: "blue",
    tag: "Producción"
  },
  {
    title: "Entendiendo mis Proyectos",
    description: "Sigue nuestro avance diario y mira cómo vamos profesionalizando Epotech.",
    icon: Briefcase,
    path: "/proyectos",
    color: "purple",
    tag: "Operaciones"
  },
  {
    title: "El Poder de tus Guiones",
    description: "Usa tus notas de voz para que nosotros creemos guiones ganadores para ti.",
    icon: Sparkles,
    path: "/contenido",
    color: "amber",
    tag: "Contenido"
  },
  {
    title: "Motor de Inspiración",
    description: "Mira los videos y tendencias que usamos como referencia para tus Reels.",
    icon: PlaySquare,
    path: "/referencias",
    color: "cyan",
    tag: "Creatividad"
  },
  {
    title: "Tu Marca y Estrategia",
    description: "Conoce a tu cliente ideal y la misión que estamos construyendo juntos.",
    icon: Target,
    path: "/brief",
    color: "emerald",
    tag: "Estrategia"
  }
];

export default function Home() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [toast, setToast] = useState<{ message: string, type: ToastType, isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  useEffect(() => {
    if (!('Notification' in window)) {
      setNotificationStatus('unsupported');
    } else {
      setNotificationStatus(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const executePermissionRequest = async () => {
    if (!('Notification' in window)) {
      showToast("Este navegador no soporta notificaciones.", "error");
      return;
    }

    if (Notification.permission === 'denied') {
      showToast("Permiso denegado. Actívalo en los ajustes de tu navegador.", "error");
      return;
    }

    if (Notification.permission === 'granted' && isSubscribed) {
      showToast("¡Ya estás conectado al 100%! Todo listo.", "success");
      return;
    }


    try {
      console.log("1. Solicitando permiso...");
      const permission = await Notification.requestPermission();
      console.log("2. Permiso concedido:", permission);
      setNotificationStatus(permission);

      if (permission === 'granted') {
        // Suscribir al Service Worker
        if ('serviceWorker' in navigator) {
          console.log("3. Registrando SW...");
          // Explicit registration fix for iOS/Safari (igual que el código viejo)
          await navigator.serviceWorker.register('/sw.js');
          
          console.log("4. Esperando SW ready...");
          const registration = await navigator.serviceWorker.ready;
          console.log("5. SW Ready obtenido:", !!registration);
          
          if (!registration) {
            throw new Error("El motor de notificaciones falló al iniciar.");
          }

          const VAPID_PUBLIC = "BH_P35zpHYXFD-I_YGrPwEKd6MJWxvwb1spwBZgNX01GWX5APZFTab9MwDkcZnTiCizPXTD7W99W08cE7BYXIWY";
          const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC);

          console.log("6. Suscribiendo en PushManager...");
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
          });
          console.log("7. Suscripción generada:", !!subscription);

          console.log("8. Guardando en Supabase...");
          // Guardar en la base de datos DIRECTAMENTE como se hacía en el código antiguo
          const { error } = await supabase.from('push_subscriptions').upsert({
            endpoint: subscription.endpoint,
            keys_p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')!) as any)),
            keys_auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')!) as any)),
            user_id: "sebastian"
          }, { onConflict: 'endpoint' });

          if (!error) {
            console.log("9. Guardado exitoso!");
            setIsSubscribed(true);
            showToast("¡Conexión de Élite establecida! Ya recibirás avisos.", "success");
          } else {
            console.error("ERROR SUPABASE:", error);
            showToast(`Error al guardar: ${error.message}`, "error");
          }
        }
      } else {
        showToast("No se otorgó el permiso necesario.", "error");
      }
    } catch (error: any) {
      console.error("Error completo en suscripción:", error);
      showToast(`Fallo: ${error.message || "desconocido"}`, "error");
    }
  };

  const tutorialVideoId = "dQw4w9WgXcQ"; // Placeholder, se puede cambiar luego

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 md:pb-8">
      {/* Header Premium */}
      <div className="bg-[#142d53] pt-12 pb-24 px-8 md:px-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#48c1d2]/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full -ml-32 -mb-32"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#48c1d2]/20 flex items-center justify-center border border-[#48c1d2]/30">
                  <BookOpen size={20} className="text-[#48c1d2]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#48c1d2]">Academia Epotech</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 overflow-visible">
                Centro de Mando: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#48c1d2] to-white italic" style={{ WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone', padding: '0 0.2em', margin: '0 -0.2em' }}>Tu Guía de Vuelo&nbsp;</span>
              </h1>
            </div>
            
            <button 
              onClick={() => router.push('/master')}
              className="md:hidden mt-1 p-4 bg-white/10 backdrop-blur-md text-[#48c1d2] rounded-[1.5rem] border border-white/10 shadow-xl active:scale-90 transition-all flex flex-col items-center gap-1 group"
            >
              <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
              <span className="text-[7px] font-black uppercase tracking-tighter opacity-60">Master</span>
            </button>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
            Hola Sebastian, aquí tienes todo lo necesario para dominar tu plataforma y llevar Epotech al siguiente nivel. ¿Qué quieres lograr hoy?
          </p>
          
          <div className="flex flex-col md:flex-row items-center gap-6 mt-10">
            <button 
              onClick={executePermissionRequest}
              className={`w-full md:w-auto px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 border-b-4 ${
                isSubscribed 
                ? "bg-slate-800 text-[#48c1d2] border-slate-900 cursor-default" 
                : "bg-[#48c1d2] hover:bg-[#35a5b5] text-[#142d53] border-[#2d8c9a] hover:scale-105 active:scale-95 shadow-[#48c1d2]/30"
              }`}
            >
              {isSubscribed ? <ShieldCheck size={20} /> : <Bell size={20} fill="currentColor" />}
              {isSubscribed ? "Notificaciones Activas" : "Activar Notificaciones"}
            </button>
            <div className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-lg ${isSubscribed ? 'bg-green-500 shadow-green-500/50' : 'bg-amber-500 shadow-amber-500/50'}`}></div>
              <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em] italic">
                {isSubscribed ? "Sincronización de Élite" : "Esperando Conexión"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 md:px-20 -mt-12 relative z-20">
        {/* Quick Help Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12 flex flex-col md:flex-row items-center gap-8 group">
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
                <div className="w-16 h-16 rounded-full bg-[#48c1d2] flex items-center justify-center shadow-2xl shadow-[#48c1d2]/50 relative z-10 group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-[#142d53] ml-1" fill="currentColor" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end z-10">
                  <span className="text-white text-xs font-black uppercase tracking-widest bg-[#142d53]/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    Tutorial General
                  </span>
                  <span className="text-white/60 text-[10px] font-bold">1:45 min</span>
                </div>
              </>
            )}
          </div>
          <div className="flex-1 space-y-4 text-left">
            <h2 className="text-2xl font-black text-[#142d53] tracking-tight">¡Bienvenido a bordo!</h2>
            <p className="text-slate-600 font-medium leading-relaxed text-sm">
              He preparado este video para mostrarte cómo navegar por cada sección. Dale play y descubre cómo estamos organizando todo tu trabajo de 2026.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="bg-[#48c1d2]/10 text-[#48c1d2] text-[10px] font-black px-3 py-1 rounded-full uppercase">Paso a paso</span>
              <span className="bg-purple-100 text-purple-600 text-[10px] font-black px-3 py-1 rounded-full uppercase">Navegación</span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {TUTORIAL_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link 
                key={card.title}
                href={card.path}
                className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:bg-[#142d53] transition-colors duration-500`}>
                    <Icon size={24} className="text-[#142d53] group-hover:text-[#48c1d2] transition-colors" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#142d53] mb-3 tracking-tight group-hover:text-[#48c1d2] transition-colors">
                  {card.title}
                </h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed flex-1 mb-6">
                  {card.description}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#48c1d2]">
                  Ir a la sección <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

    </div>
  );
}
