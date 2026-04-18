"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { 
  Send, 
  Bell, 
  ShieldCheck, 
  RefreshCcw, 
  Trash2,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function MasterPanel() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notificacion, setNotificacion] = useState({
    titulo: "",
    mensaje: "",
    tipo: "RECORDATORIO"
  });
  const [history, setHistory] = useState<any[]>([]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString("es-ES", { day: 'numeric', month: 'short' }).replace('.', '');
    } catch (e) {
      return dateStr;
    }
  };


  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    const { data } = await supabase
      .from("notificaciones")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);
    if (data) setHistory(data);
    setLoading(false);
  }

  async function sendNotification() {
    if (!notificacion.titulo || !notificacion.mensaje) return;
    
    setSending(true);
    const { error } = await supabase.from("notificaciones").insert([
      {
        titulo: notificacion.titulo,
        mensaje: notificacion.mensaje,
        tipo: notificacion.tipo,
        fecha: new Date().toISOString().split('T')[0]
      }
    ]);

    if (!error) {
      try {
        const pushRes = await fetch("/api/push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            titulo: notificacion.titulo, 
            mensaje: notificacion.mensaje 
          }),
        });
        const pushResult = await pushRes.json();
        if (!pushResult.success) {
          console.error("Push API error:", pushResult.error);
        }
      } catch (e: any) {
        console.error("Failed to call push API:", e);
      }

      setNotificacion({ titulo: "", mensaje: "", tipo: "RECORDATORIO" });
      fetchHistory();
      alert("¡Notificación enviada con éxito! (Nota: Verifica si llega la alerta al móvil)");
    } else {
      alert("Error de base de datos: " + error.message);
    }
    setSending(false);
  }

  async function deleteNotificacion(id: string) {
    if (!confirm("¿Seguro que quieres borrar este aviso?")) return;
    const { error } = await supabase.from("notificaciones").delete().eq("id", id);
    if (!error) fetchHistory();
  }

  if (loading) return <LoadingSpinner message="Abriendo Panel de Control..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 pt-10">
      <header className="flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <div className="bg-red-500 p-2 rounded-lg text-white">
                <ShieldCheck size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600">Acceso Restringido</span>
           </div>
           <h1 className="text-4xl font-black tracking-tight text-[var(--primary)]">Panel de Control Andrea</h1>
           <p className="text-sm font-bold text-[var(--text-muted)] mt-2">Gestiona lo que Sebastián ve en su pantalla en tiempo real.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Formulario de Notificación */}
        <Card className="lg:col-span-2 p-10 border-2 border-[var(--border)] shadow-xl rounded-[40px]">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
              <Bell size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--primary)]">Nueva Notificación</h2>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Llega directo al dashboard de Seba</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Título del Aviso</label>
              <input 
                type="text" 
                placeholder="Ej: Grabar hoy en Salt Lake..."
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold focus:border-[var(--accent)] outline-none transition-all"
                value={notificacion.titulo}
                onChange={(e) => setNotificacion({...notificacion, titulo: e.target.value})}
              />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Mensaje Detallado</label>
               <textarea 
                 rows={4}
                 placeholder="Escribe aquí las instrucciones específicas..."
                 className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold focus:border-[var(--accent)] outline-none transition-all resize-none"
                 value={notificacion.mensaje}
                 onChange={(e) => setNotificacion({...notificacion, mensaje: e.target.value})}
               />
            </div>

            <div className="flex flex-wrap gap-3">
               {["URGENTE", "RECORDATORIO", "TIP", "LOGRO"].map((tipo) => (
                 <button
                   key={tipo}
                   onClick={() => setNotificacion({...notificacion, tipo})}
                   className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${
                     notificacion.tipo === tipo 
                       ? "bg-[var(--primary)] text-white border-[var(--primary)] scale-105 shadow-lg" 
                       : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
                   }`}
                 >
                   {tipo}
                 </button>
               ))}
            </div>

            <button 
              onClick={sendNotification}
              disabled={sending}
              className="mt-4 w-full bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white font-black py-4 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
            >
              {sending ? <RefreshCcw className="animate-spin" /> : <Send size={20} />}
              ENVIAR NOTIFICACIÓN A SEBAS
            </button>
          </div>
        </Card>

        {/* Historial Reciente */}
        <div className="space-y-6">
           <h3 className="text-sm font-black text-[var(--primary)] uppercase tracking-widest flex items-center gap-2">
             <MessageSquare size={16} /> Últimos Enviados
           </h3>
           <div className="space-y-4">
             {history.map((h) => (
               <Card key={h.id} className="p-5 border-none bg-gray-50 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded ${
                      h.tipo === 'URGENTE' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {h.tipo}
                    </span>
                    <button 
                      onClick={() => deleteNotificacion(h.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <h4 className="text-xs font-black text-gray-900">{h.titulo}</h4>
                  <p className="text-[10px] font-bold text-gray-500 mt-1 line-clamp-2">{h.mensaje}</p>
                  <p className="text-[8px] font-black text-gray-300 mt-3">{formatDate(h.fecha)}</p>
               </Card>
             ))}
             {history.length === 0 && (
               <p className="text-xs font-bold text-gray-400 italic text-center py-10">No has enviado nada aún.</p>
             )}
           </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
         <Card className="p-8 border-2 border-[var(--primary)] bg-blue-50/30">
            <h3 className="text-sm font-black text-[var(--primary)] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Zap size={18} className="text-amber-500" /> Registrar Producción
            </h3>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Título del video/post..."
                className="w-full bg-white border-2 border-gray-100 rounded-xl p-3 text-xs font-bold outline-none focus:border-blue-500"
                id="pub-title"
              />
              <div className="flex gap-2">
                {["REEL", "TIKTOK", "CARRUSEL", "POST"].map((t) => (
                  <button 
                    key={t}
                    className="flex-1 py-2 bg-white border-2 border-gray-100 rounded-xl text-[9px] font-black hover:border-blue-400 transition-all text-gray-500"
                    onClick={async () => {
                      const title = (document.getElementById('pub-title') as HTMLInputElement).value;
                      if (!title) return alert("Ponle un título");
                      
                      const { error } = await supabase.from('registro_publicaciones').insert([
                        { tipo: t, tema: title, plataforma: t === 'POST' ? 'INSTAGRAM' : (t === 'TIKTOK' ? 'TIKTOK' : 'INSTAGRAM') }
                      ]);

                      if (!error) {
                        alert(`¡${t} registrado con éxito!`);
                        (document.getElementById('pub-title') as HTMLInputElement).value = '';
                      } else {
                        alert("Error al registrar: " + error.message);
                      }
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-[9px] font-bold text-gray-400 text-center uppercase tracking-widest italic">
                Esto actualiza los números del Dashboard de Sebas
              </p>
            </div>
         </Card>

         <Card className="p-8 border-2 border-dashed border-gray-200 bg-gray-50 flex items-center gap-6 opacity-70">
            <div className="bg-white p-4 rounded-full shadow-sm">
               <RefreshCcw size={32} className="text-emerald-500" />
            </div>
            <div>
               <h4 className="font-black text-[var(--primary)] uppercase text-xs tracking-widest">Sincronizar Métricas</h4>
               <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">Conexión con Meta Ads... (Próximamente)</p>
            </div>
         </Card>
      </div>

    </div>
  );
}
