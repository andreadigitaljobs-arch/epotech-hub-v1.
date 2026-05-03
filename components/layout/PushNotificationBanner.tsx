"use client";

import { useEffect, useState } from "react";
import { Bell, Smartphone, Plus, CheckCircle2, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { supabase } from "@/lib/supabase";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BH_P35zpHYXFD-I_YGrPwEKd6MJWxvwb1spwBZgNX01GWX5APZFTab9MwDkcZnTiCizPXTD7W99W08cE7BYXIWY";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function PushNotificationBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [currentStep, setCurrentStep] = useState("");

  useEffect(() => {
    const checkState = async () => {
      // 1. Detect environment
      const is_ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      const is_standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
      
      setIsIOS(is_ios);
      setIsStandalone(is_standalone);

      // 2. Check if browser supports notifications
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn("Push notifications not supported");
        return;
      }

      try {
        // Test mode override
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('test') === 'push') {
          setIsVisible(true);
          setIsSubscribed(false);
          return;
        }

        // 3. Check current permission
        if (Notification.permission === 'granted') {
          // Check for existing subscription
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
              setIsSubscribed(true);
              return;
            }
          }
        }

        // 4. Show banner if not denied
        if (Notification.permission !== 'denied') {
          setIsVisible(true);
        }
      } catch (e) {
        console.error("Check state error:", e);
      }
    };

    checkState();
    
    // Register SW early so it's ready before the user clicks
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
  }, []);

  const subscribeUser = async () => {
    setStatus("loading");
    setErrorMsg("");
    setCurrentStep("Sincronizando navegador...");

    const timeout = setTimeout(() => {
      if (status === "loading") {
        setStatus("error");
        setErrorMsg("Tiempo de espera agotado. Revisa si tienes buena conexión.");
      }
    }, 15000); // Increased timeout

    try {
      setCurrentStep("Preparando conexión...");
      
      // 1. Obtener el Service Worker YA REGISTRADO (en el useEffect o por next-pwa)
      let registration = await navigator.serviceWorker.getRegistration();
      
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js');
      }

      // 2. iOS WebKit FIX: El Service Worker DEBE estar 'active' antes de pedir permisos,
      // porque si esperamos a que se active *después* de pedir permiso, 
      // iOS invalida el token de interacción del usuario (user gesture) y lanza InvalidStateError.
      if (!registration.active) {
        setCurrentStep("Activando proceso en segundo plano...");
        registration = await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => reject(new Error("Timeout esperando activación del Service Worker")), 8000);
          
          if (registration!.active) {
            clearTimeout(timeoutId);
            return resolve(registration!);
          }

          const worker = registration!.installing || registration!.waiting;
          if (worker) {
            worker.addEventListener('statechange', (e: any) => {
              if (e.target.state === 'activated') {
                clearTimeout(timeoutId);
                resolve(registration!);
              }
            });
          } else {
             // Si por alguna razón no hay worker, usamos .ready como fallback
             navigator.serviceWorker.ready.then(reg => {
                clearTimeout(timeoutId);
                resolve(reg);
             }).catch(reject);
          }
        });
      }

      // 3. AHORA pedir permiso INMEDIATAMENTE ANTES de suscribir para asegurar el 'user gesture'
      setCurrentStep("Pidiendo permiso...");
      const result = await Notification.requestPermission();
      
      if (result !== 'granted') {
        setStatus("error");
        setErrorMsg("Permiso denegado por el navegador.");
        clearTimeout(timeout);
        return;
      }

      setCurrentStep("Generando llave de acceso...");
      // Llamar a subscribe directamente después de requestPermission sin otros awaits intermedios
      if (!registration) throw new Error("Fallo crítico: Service Worker no disponible.");
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });

      setCurrentStep("Sincronizando con Epotech...");
      const { error } = await supabase.from('push_subscriptions').insert({
        endpoint: subscription.endpoint,
        keys_p256dh: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('p256dh')!) as any)),
        keys_auth: btoa(String.fromCharCode.apply(null, new Uint8Array(subscription.getKey('auth')!) as any)),
        user_id: "sebastian"
      });

      if (error) {
        throw new Error("No se pudo conectar con la base de datos.");
      }

      clearTimeout(timeout);
      setIsSubscribed(true);
      setStatus("success");
      setCurrentStep("¡Configurado con éxito!");
      setTimeout(() => setIsVisible(false), 3000);
    } catch (err: any) {
      clearTimeout(timeout);
      console.error('Failed to subscribe:', err);
      setStatus("error");
      setErrorMsg(err.message || "Error al registrar dispositivo.");
    }
  };

  if (!isVisible || isSubscribed) return null;

  return (
    <Card className="relative overflow-hidden border-2 border-[var(--accent)] bg-[var(--accent-light)]/30 backdrop-blur-md p-5 md:p-6 mb-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={16} />
      </button>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
        <div className="bg-[var(--accent)] text-white p-3 rounded-2xl shadow-lg animate-pulse">
          <Bell size={24} />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-black text-[var(--primary)] tracking-tight">
            {isIOS && !isStandalone ? "📱 ¡Instala la App para recibir avisos!" : "🔔 ¡Activa las Notificaciones!"}
          </h3>
          <p className="text-xs font-semibold text-[var(--text-muted)] mt-1">
            {isIOS && !isStandalone 
              ? "En iPhone, Apple exige añadir la app al inicio para recibir alertas. Pulsa el botón de compartir y elige 'Añadir a pantalla de inicio'."
              : "Recibe una alerta inmediata en tu teléfono cuando se programe o publique nuevo contenido."}
          </p>
          
          {status === "loading" && (
            <p className="text-[10px] font-black uppercase text-[var(--accent)] mt-2 animate-pulse">
              {currentStep}
            </p>
          )}

          {status === "error" && (
            <p className="text-[10px] font-black uppercase text-red-500 mt-2">
              ⚠️ {errorMsg}
            </p>
          )}
        </div>

        <div className="w-full md:w-auto mt-2 md:mt-0">
          {isIOS && !isStandalone ? (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 bg-white border-2 border-[var(--border)] px-4 py-2.5 rounded-xl text-xs font-black text-gray-500">
                 <Plus size={16} className="text-[var(--accent)]" />
                 Añadir a Inicio
              </div>
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Paso obligatorio en iPhone</p>
            </div>
          ) : (
            <button
              onClick={subscribeUser}
              disabled={status === "loading" || status === "success"}
              className={`w-full md:w-auto px-10 py-4 rounded-2xl font-black text-sm shadow-lg transition-all flex items-center justify-center gap-3 ${
                status === "success" 
                  ? "bg-emerald-500 text-white" 
                  : status === "error"
                  ? "bg-gray-100 text-gray-400"
                  : status === "loading"
                  ? "bg-[var(--accent)] text-white opacity-80 animate-pulse cursor-wait"
                  : "bg-[var(--accent)] text-white hover:bg-[var(--accent-dark)] hover:scale-105 active:scale-95"
              }`}
            >
              {status === "loading" ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Conectando...</span>
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 size={18} />
                  ¡Listo!
                </>
              ) : status === "error" ? (
                "Reintentar"
              ) : (
                "Activar Avisos"
              )}
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
