"use client";

import { useState, useEffect } from "react";

import { createPortal } from "react-dom";



import { 

  BookOpen, Video, Briefcase, PlaySquare, Target,

  Sparkles, HelpCircle, ArrowRight, Mic,

  Search, Smartphone, Zap, Bell, ShieldCheck, PenTool,

  Camera, Flame, CalendarDays

} from "lucide-react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useThemeColor } from "@/components/layout/ThemeColorHandler";

import { Toast, ToastType } from "@/components/ui/Toast";

import { SignatureModal } from "@/components/ui/SignatureModal";

import { supabase } from "@/lib/supabase";



const TUTORIAL_CARDS = [

  {

    title: "Entendiendo mis Proyectos",

    description: "Sigue nuestro avance diario y mira cómo vamos profesionalizando Epotech.",

    icon: Briefcase,

    path: "/proyectos",

    color: "purple",

    tag: "Operaciones"

  },

  {

    title: "Contenido",

    description: "Descubre qué grabar en tus trabajos (checklist), qué historias crear para tus Stories, y realiza tus reportes diarios con notas de voz, todo unificado en un solo lugar.",

    icon: Video,

    path: "/contenido",

    color: "cyan",

    tag: "Contenido"

  },

  {

    title: "Calendario de Contenido",

    description: "Planifica semana a semana qué vas a publicar, con pilar, estado, copy, enlace del reel y métricas de cada post.",

    icon: CalendarDays,

    path: "/calendario",

    color: "cyan",

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

  useThemeColor("#f8fafc");

  const router = useRouter();

  const [isSubscribed, setIsSubscribed] = useState(false);

  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission | 'unsupported'>('default');

  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

  const [savedSignature, setSavedSignature] = useState<string | null>(null);

  const [streakDays, setStreakDays] = useState(1);

  const [toast, setToast] = useState<{ message: string, type: ToastType, isVisible: boolean }>({

    message: "",

    type: "success",

    isVisible: false

  });



  const showToast = (message: string, type: ToastType = "success") => {

    setToast({ message, type, isVisible: true });

  };



  useEffect(() => {

    const prepareNotifications = async () => {

      if (!("Notification" in window)) {

        setNotificationStatus("unsupported");

        return;

      }



      setNotificationStatus(Notification.permission);



      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {

        return;

      }



      try {

        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });

        const readyRegistration = registration.active ? registration : await navigator.serviceWorker.ready;

        const subscription = await readyRegistration.pushManager.getSubscription();

        setIsSubscribed(Boolean(subscription));

      } catch (error) {

        console.error("No se pudo preparar push:", error);

      }

    };



    prepareNotifications();



    // Cargar firma: primero desde Supabase (fuente de verdad compartida), con fallback a localStorage
    const loadSignature = async () => {
      try {
        const { data, error } = await supabase
          .from('firma_sebastian')
          .select('signature_data')
          .order('updated_at', { ascending: false })
          .limit(1);

        if (error) throw error; // Error de red → caer al catch

        if (data && data.length > 0) {
          // Supabase tiene firma → mostrarla y cachear localmente
          setSavedSignature(data[0].signature_data);
          localStorage.setItem('epotech_signature', data[0].signature_data);
        } else {
          // Supabase está vacío → limpiar caché local también (la firma fue eliminada)
          localStorage.removeItem('epotech_signature');
          setSavedSignature(null);
        }
      } catch (err) {
        // Solo en error de red real → usar localStorage como respaldo offline
        const saved = localStorage.getItem('epotech_signature');
        if (saved) setSavedSignature(saved);
      }
    };

    loadSignature();



    // Cargar racha diaria

    const savedStreak = parseInt(localStorage.getItem('epotech_streak') || '1', 10);

    setStreakDays(savedStreak);

  }, []);



  const handleSaveSignature = async (data: string) => {
    // Guardar localmente primero (respuesta inmediata)
    localStorage.setItem('epotech_signature', data);
    setSavedSignature(data);
    showToast("Guardando firma...", "info");

    try {
      // Borrar la firma anterior y guardar la nueva en Supabase
      await supabase.from('firma_sebastian').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('firma_sebastian').insert({ signature_data: data });
      if (error) throw error;
      showToast("¡Firma guardada y sincronizada!", "success");
    } catch (err) {
      // Si falla Supabase, la firma igual queda guardada localmente
      showToast("Firma guardada localmente.", "success");
    }
  };



  const handleResetSignature = async () => {
    localStorage.removeItem('epotech_signature');
    setSavedSignature(null);

    try {
      await supabase.from('firma_sebastian').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch (err) {
      // Ignorar errores de red al eliminar
    }

    showToast("Firma eliminada.", "success");
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



  const savePushSubscription = async (subscription: PushSubscription) => {

    const response = await fetch("/api/subscribe", {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({

        ...subscription.toJSON(),

        user_id: "sebastian"

      })

    });



    const result = await response.json();

    if (!response.ok || !result.success) {

      throw new Error(result.error || "No se pudo guardar la suscripcion push.");

    }



    return result;

  };



  const getPushRegistration = async () => {

    const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });



    if (registration.active) {

      return registration;

    }



    const worker = registration.installing || registration.waiting;

    if (worker) {

      await new Promise<void>((resolve, reject) => {

        const timeout = window.setTimeout(() => {

          reject(new Error("El motor de notificaciones no terminó de activarse. Cierra y abre la app desde el icono de inicio e intenta otra vez."));

        }, 15000);



        worker.addEventListener("statechange", () => {

          if (worker.state === "activated") {

            window.clearTimeout(timeout);

            resolve();

          }

        });

      });

    }



    return navigator.serviceWorker.ready;

  };



  const getReadyServiceWorker = getPushRegistration;



  const executePermissionRequest = async () => {

    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {

      showToast("Este navegador no soporta notificaciones web en esta instalación.", "error");

      return;

    }



    if (Notification.permission === "denied") {

      showToast("Permiso denegado. Activalo en los ajustes del navegador.", "error");

      return;

    }



    if (Notification.permission === "granted" && isSubscribed) {

      showToast("Resincronizando este dispositivo...", "info");

    }



    try {

      showToast("Preparando notificaciones...", "info");

      const registration = await getPushRegistration();

      const permission = await Notification.requestPermission();

      setNotificationStatus(permission);



      if (permission !== "granted") {

        showToast("No se otorgó el permiso necesario.", "error");

        return;

      }



      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

      if (!vapidPublicKey) {

        throw new Error("Falta configurar NEXT_PUBLIC_VAPID_PUBLIC_KEY.");

      }



      const existingSubscription = await registration.pushManager.getSubscription();

      const subscription = existingSubscription || await registration.pushManager.subscribe({

        userVisibleOnly: true,

        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)

      });



      const result = await savePushSubscription(subscription);

      setIsSubscribed(true);

      showToast(`Notificaciones activas (${result.endpointHost}).`, "success");

    } catch (error: any) {

      console.error("Error completo en suscripcion:", error);

      showToast(error.message || "No se pudo activar notificaciones.", "error");

    }



    return;



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

      // iOS WebKit FIX:

      // PASO 1: Esperar a que el SW esté activo ANTES de pedir el permiso.

      // Si hacemos await entre requestPermission() y subscribe(), WebKit destruye el

      // token de interacción del usuario y lanza InvalidStateError.

      if ('serviceWorker' in navigator) {

        console.log("1. Obteniendo o registrando SW...");

        const registration = await getReadyServiceWorker();

        showToast("Iniciando motor de notificaciones...", "info");

        /*

        let registration = await navigator.serviceWorker.getRegistration();

        if (!registration) {

          registration = await navigator.serviceWorker.register('/sw.js');

        }



        console.log("2. SW obtenido. ¿Activo?:", !!registration.active);



        // Si el SW no está activo, esperamos a que se active (sin recargar)

        if (!registration.active) {

          console.log("3. Esperando activación del SW...");

          showToast("Iniciando motor de notificaciones...", "info");

          registration = await new Promise<ServiceWorkerRegistration>((resolve, reject) => {

            const timeoutId = setTimeout(() => reject(new Error("Timeout esperando activación del Service Worker")), 8000);



            const worker = registration!.installing || registration!.waiting;

            if (worker) {

              worker.addEventListener('statechange', (e: any) => {

                if (e.target.state === 'activated') {

                  clearTimeout(timeoutId);

                  resolve(registration!);

                }

              });

            } else {

              navigator.serviceWorker.ready.then(reg => {

                clearTimeout(timeoutId);

                resolve(reg);

              }).catch(reject);

            }

          });

        }



        */

        console.log("4. SW activo y listo.");



        // PASO 2: Pedir permiso

        console.log("5. Solicitando permiso al usuario...");

        const permission = await Notification.requestPermission();

        console.log("6. Permiso:", permission);

        setNotificationStatus(permission);



        if (permission !== 'granted') {

          showToast("No se otorgó el permiso necesario.", "error");

          return;

        }



        // PASO 3: Suscribir INMEDIATAMENTE sin awaits intermedios

        const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BH_P35zpHYXFD-I_YGrPwEKd6MJWxvwb1spwBZgNX01GWX5APZFTab9MwDkcZnTiCizPXTD7W99W08cE7BYXIWY";

        console.log("7. Suscribiendo en PushManager...");

        const subscription = await registration.pushManager.subscribe({

          userVisibleOnly: true,

          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC)

        });

        const result = await savePushSubscription(subscription);

        console.log("9. Guardado exitoso:", result.endpointHost);

        setIsSubscribed(true);

        showToast(`Conexión lista (${result.endpointHost}). Ya recibirás avisos.`, "success");

        return;

        console.log("8. Suscripción generada:", !!subscription);



        // PASO 4: Guardar en Supabase

        /*

        const { error } = await supabase.from('push_subscriptions').upsert({

          endpoint: subscription.endpoint,

          keys_p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')!) as any)),

          keys_auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')!) as any)),

          user_id: "sebastian"

        }, { onConflict: 'endpoint' });



        if (!error) {

          console.log("9. ¡Guardado exitoso!");

          setIsSubscribed(true);

          showToast("¡Notificaciones activadas! Ya recibirás avisos.", "success");

        } else {

          console.error("ERROR SUPABASE:", error);

          showToast(`Error al guardar: ${error?.message || "desconocido"}`, "error");

        }

        */

      }

    } catch (error: any) {

      console.error("Error completo en suscripción:", error);

      showToast(`Fallo: ${error.name ? error.name + ': ' : ''}${error.message || "desconocido"}`, "error");

    }

  };


  return (

    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 pb-24 md:pb-8">

      {/* 1. INSTRUCCIONES PREMIUM */}

      <div className="mb-4 space-y-4">

        <div className="bg-white/50 border border-slate-200 p-6 rounded-[2rem] w-full shadow-sm">

          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed text-left">

            <span className="text-[#48c1d2]">Academia Epotech:</span> Aquí tienes todo lo necesario para dominar tu plataforma y llevar Epotech al siguiente nivel. Mira el tutorial para empezar.

          </p>

        </div>



        {/* Card de Firma Digital - Acceso Rápido */}

        <div 

          onClick={() => setIsSignatureModalOpen(true)}

          className="bg-gradient-to-br from-[#142d53] to-[#1e3a8a] p-6 rounded-[2.5rem] shadow-xl border border-white/10 flex items-center justify-between group cursor-pointer hover:scale-[1.01] transition-all overflow-hidden relative"

        >

          {/* Fondo decorativo */}

          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">

            <PenTool size={120} className="text-[#48c1d2]" />

          </div>



          <div className="flex items-center gap-6 relative z-10">

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${savedSignature ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-[#48c1d2] text-[#142d53] shadow-lg shadow-[#48c1d2]/20'}`}>

              {savedSignature ? <ShieldCheck size={28} /> : <PenTool size={28} />}

            </div>

            <div>

              <h3 className="text-white text-lg font-black tracking-tight leading-none mb-2">

                {savedSignature ? "Tu Firma está Lista" : "Registra tu Firma Digital"}

              </h3>

              <p className="text-[#48c1d2] text-[10px] font-black uppercase tracking-widest opacity-80">

                {savedSignature ? "Protegida y lista para descargar" : "Click aquí para firmar ahora"}

              </p>

            </div>

          </div>



          <div className="hidden sm:flex items-center gap-3 relative z-10">

            <span className="text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">Identidad de Marca</span>

            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">

              <ArrowRight size={16} />

            </div>

          </div>

        </div>

      </div>



      {/* Header Premium - Light */}

      <div className="pt-2 pb-4 relative overflow-visible">

        <div className="relative z-10">

          <div className="flex justify-between items-start gap-6">

            <div className="flex-1">

              <div className="flex flex-wrap items-center gap-3 mb-4">

                <div className="w-10 h-10 rounded-xl bg-[#48c1d2]/10 flex items-center justify-center border border-[#48c1d2]/20">

                  <BookOpen size={20} className="text-[#48c1d2]" />

                </div>

                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Academia Epotech</span>

                

                {/* Insignia de Racha Diaria */}

                <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full shadow-inner">

                  <Flame size={12} className="text-orange-500 fill-orange-500 animate-pulse" />

                  <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest">Racha: {streakDays} {streakDays === 1 ? 'Día' : 'Días'}</span>

                </div>

              </div>

              <h1 className="text-2xl md:text-5xl font-black text-[#142d53] tracking-tighter mb-8 overflow-visible max-w-4xl leading-[1.1]">

                Centro de mando: <br /> <span className="text-[#48c1d2] italic">Tu guía de vuelo&nbsp;</span>

              </h1>

            </div>

            

            <div className="flex items-center gap-4 shrink-0">

              {/* Avatar de Sebastián */}

              <div className="relative shrink-0">

                <div className="w-14 h-14 rounded-full border-2 border-[#48c1d2]/50 shadow-[0_0_15px_rgba(72,193,210,0.2)] overflow-hidden">

                  <img

                    src="/sebastian.jpg"

                    alt="Sebastián"

                    className="w-full h-full object-cover object-[center_15%]"

                  />

                </div>

                {/* Punto verde de "activo" */}

                <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse" />

              </div>



              <button 

                onClick={() => router.push('/master')}

                className="md:hidden p-4 bg-white text-[#48c1d2] rounded-[1.5rem] border border-slate-200 shadow-sm active:scale-90 transition-all flex flex-col items-center gap-1 group"

              >

                <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />

                <span className="text-[7px] font-black uppercase tracking-tighter text-slate-400">Master</span>

              </button>

            </div>

          </div>

          <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">

            Hola Sebastián, aquí tienes todo lo necesario para dominar tu plataforma y llevar Epotech al siguiente nivel. ¡Llevas una racha de {streakDays} {streakDays === 1 ? 'día' : 'días'} consecutivos! ¿Qué quieres lograr hoy?

          </p>

          

          <div className="flex flex-col md:flex-row items-center gap-6 mt-10 mb-4">

            <button 

              onClick={executePermissionRequest}

              className={`w-full md:w-auto px-8 py-5 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 border-b-4 ${

                isSubscribed 

                ? "bg-slate-100 text-[#48c1d2] border-slate-200 cursor-default" 

                : "bg-[#48c1d2] hover:bg-[#35a5b5] text-[#142d53] border-[#2d8c9a] hover:scale-105 active:scale-95 shadow-[#48c1d2]/30"

              }`}

            >

              {isSubscribed ? <ShieldCheck size={20} /> : <Bell size={20} fill="currentColor" />}

              {isSubscribed ? "Notificaciones Activas" : "Activar Notificaciones"}

            </button>

            <div className="flex items-center gap-3">

              <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-lg ${isSubscribed ? 'bg-green-500 shadow-green-500/50' : 'bg-[#48c1d2] shadow-[#48c1d2]/50'}`}></div>

              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] italic">

                {isSubscribed ? "Notificaciones activas" : "Sin notificaciones"}

              </span>

            </div>

          </div>

        </div>

      </div>






      <div className="relative z-20">

        {/* Categories Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

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



      <SignatureModal 

        isOpen={isSignatureModalOpen}

        onClose={() => setIsSignatureModalOpen(false)}

        onSave={handleSaveSignature}

        onReset={handleResetSignature}

        savedSignature={savedSignature}

      />



    </div>

  );

}

