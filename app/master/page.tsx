"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { 
  Send, 
  Bell, 
  ShieldCheck, 
  Zap, 
  Lightbulb,
  RefreshCcw, 
  Trash2,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Mic,
  Download,
  ArrowLeft
} from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function MasterPanel() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [notificacion, setNotificacion] = useState({
    titulo: "",
    mensaje: "",
    tipo: "TIPS Y RECORDATORIOS"
  });
  const [history, setHistory] = useState<any[]>([]);
  const [reportesAudio, setReportesAudio] = useState<any[]>([]);
  const [locuciones, setLocuciones] = useState<any[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: ToastType, isVisible: boolean }>({
    message: "",
    type: "success",
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const formatDate = (dateStr: string) => {
    try {
      const isISO = dateStr.includes('T');
      const date = new Date(isISO ? dateStr : dateStr + 'T00:00:00');
      
      return date.toLocaleString("es-ES", { 
        day: 'numeric', 
        month: 'short',
        ...(isISO && { hour: 'numeric', minute: '2-digit', hour12: true })
      }).replace('.', '');
    } catch (e) {
      return dateStr;
    }
  };


  useEffect(() => {
    fetchHistory();
    fetchAudios();
    fetchLocuciones();

    const channel = supabase.channel('audios-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reportes_audio' }, () => fetchAudios())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locuciones' }, () => fetchLocuciones())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchAudios() {
    const { data } = await supabase
      .from("reportes_audio")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setReportesAudio(data);
  }

  async function fetchLocuciones() {
    const { data } = await supabase
      .from("locuciones")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLocuciones(data);
  }

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
        if (!pushRes.ok || !pushResult.success) {
          console.error("Push API error:", pushResult);
          showToast(
            pushResult.error || `Push fallido: ${pushResult.failed || 0} de ${pushResult.count || 0} dispositivos.`,
            "error"
          );
          setSending(false);
          return;
        }
      } catch (e: any) {
        console.error("Failed to call push API:", e);
        showToast("No se pudo llamar al servicio push.", "error");
        setSending(false);
        return;
      }

      setNotificacion({ titulo: "", mensaje: "", tipo: "TIPS Y RECORDATORIOS" });
      fetchHistory();
      showToast("¡Notificación enviada con éxito!", "success");
    } else {
      showToast("Error de base de datos: " + error.message, "error");
    }
    setSending(false);
  }

  async function deleteNotificacion(id: string) {
    if (!confirm("¿Seguro que quieres borrar este aviso?")) return;
    const { error } = await supabase.from("notificaciones").delete().eq("id", id);
    if (!error) fetchHistory();
  }

  async function deleteAudio(id: string, url: string) {
    if (!confirm("¿Seguro que quieres borrar este audio?")) return;
    try {
      const fileName = url.split('/').pop();
      if (fileName) await supabase.storage.from('audios').remove([fileName]);
      const { error } = await supabase.from("reportes_audio").delete().eq("id", id);
      if (!error) fetchAudios();
    } catch (e) { console.error(e); }
  }

  async function deleteLocucion(id: string, url: string) {
    if (!confirm("¿Seguro que quieres borrar esta locución?")) return;
    try {
      const fileName = url.split('/').pop();
      if (fileName) await supabase.storage.from('audios').remove([fileName]);
      const { error } = await supabase.from("locuciones").delete().eq("id", id);
      if (!error) fetchLocuciones();
    } catch (e) { console.error(e); }
  }

  async function forceDownload(url: string, id: string) {
    try {
      const fileName = url.split('/').pop();
      if (!fileName) return;
      
      // Descargamos el blob internamente con Supabase para evitar restricciones Cross-Origin
      const { data, error } = await supabase.storage.from('audios').download(fileName);
      if (error) throw error;
      
      // Creamos un link fantasma para forzar la descarga al disco duro
      const blobUrl = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `reporte_epotech_${id.split('-')[0]}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Error forzando descarga:", e);
      showToast("No se pudo descargar automáticamente. Usa el reproductor.", "error");
    }
  }

  if (loading) return <LoadingSpinner message="Abriendo Panel de Control..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 pt-6 px-4 md:px-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <button 
            onClick={() => window.history.back()}
            className="mb-4 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[var(--primary)] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Volver al Hub
          </button>
           <div className="flex items-center gap-2 mb-2">
             <div className="bg-red-500 p-1.5 rounded-lg text-white">
                <ShieldCheck size={16} />
             </div>
             <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600">Acceso Restringido</span>
           </div>
           <h1 className="text-2xl md:text-5xl font-black tracking-tight text-[var(--primary)] leading-[1.1]">Panel de Control Andrea</h1>
           <p className="text-xs md:text-sm font-bold text-[var(--text-muted)] mt-1 md:mt-2 leading-relaxed">Gestiona lo que Sebastián ve en su pantalla en tiempo real.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        
        {/* Formulario de Notificación */}
        <Card className="lg:col-span-2 p-6 md:p-10 border-2 border-[var(--border)] shadow-xl rounded-[40px]">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 shrink-0">
              <Bell size={24} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-black text-[var(--primary)]">Nueva Notificación</h2>
              <p className="text-[10px] md:text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Directo al dashboard de Seba</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Título del Aviso</label>
              <input 
                type="text" 
                placeholder="Ej: Grabar hoy en Salt Lake..."
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold focus:border-[var(--accent)] outline-none transition-all"
                value={notificacion.titulo}
                onChange={(e) => setNotificacion({...notificacion, titulo: e.target.value})}
              />
            </div>

            <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">Mensaje Detallado</label>
               <textarea 
                 rows={4}
                 placeholder="Escribe aquí las instrucciones específicas..."
                 className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 text-sm font-bold focus:border-[var(--accent)] outline-none transition-all resize-none"
                 value={notificacion.mensaje}
                 onChange={(e) => setNotificacion({...notificacion, mensaje: e.target.value})}
               />
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
               {["REDES SOCIALES", "TIPS Y RECORDATORIOS", "URGENTE"].map((tipo) => (
                 <button
                   key={tipo}
                   onClick={() => setNotificacion({...notificacion, tipo})}
                   className={`px-3 py-2 md:px-4 md:py-2 rounded-xl text-[9px] md:text-[10px] font-black transition-all border-2 ${
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
              className="mt-2 w-full bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white font-black py-4 rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 text-xs md:text-sm"
            >
              {sending ? <RefreshCcw className="animate-spin" /> : <Send size={20} />}
              ENVIAR NOTIFICACIÓN
            </button>
          </div>
        </Card>

        {/* Historial Reciente */}
        <div className="space-y-6">
           <h3 className="text-xs md:text-sm font-black text-[var(--primary)] uppercase tracking-widest flex items-center gap-2 px-1">
             <MessageSquare size={16} /> Últimos Enviados
           </h3>
           <div className="space-y-4">
             {history.map((h) => (
               <Card key={h.id} className="p-5 border-none bg-gray-50 relative group rounded-3xl">
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
                  <p className="text-[10px] font-bold text-gray-500 mt-1 line-clamp-2 leading-snug">{h.mensaje}</p>
                  <p className="text-[8px] font-black text-gray-300 mt-3 uppercase tracking-widest">{formatDate(h.fecha)}</p>
               </Card>
             ))}
             {history.length === 0 && (
               <p className="text-xs font-bold text-gray-400 italic text-center py-10">No has enviado nada aún.</p>
             )}
           </div>
        </div>

      </div>



      {/* BANDEJA DE AUDIOS */}
      <div className="mt-12 md:mt-16">
         <h3 className="text-lg md:text-xl font-black text-[var(--primary)] uppercase tracking-widest mb-6 flex items-center gap-3 px-1">
           <div className="bg-[#48c1d2] p-2 rounded-xl text-[#142d53] shadow-lg shadow-[#48c1d2]/20 shrink-0">
             <Mic size={20} />
           </div>
           Audios Recibidos
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {reportesAudio.map(r => (
             <Card key={r.id} className="p-6 border-2 border-slate-100 bg-white rounded-[2rem] shadow-xl relative group overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                   <span className="text-[8px] font-black px-3 py-1.5 bg-[#142d53] text-[#48c1d2] rounded-xl tracking-widest uppercase shadow-md truncate max-w-[70%]">
                     {r.proyecto_id === 'manual' ? 'Libre' : r.proyecto_id}
                   </span>
                   <button 
                     onClick={() => deleteAudio(r.id, r.audio_url)}
                     className="text-slate-300 hover:text-red-500 transition-colors bg-slate-50 p-2 rounded-lg"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
                
                <div className="space-y-4">
                   <audio src={r.audio_url} controls className="w-full h-10 rounded-xl" />
                   
                   <div className="flex flex-col gap-2 pt-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {formatDate(r.created_at)}
                      </span>
                      <button 
                        onClick={() => forceDownload(r.audio_url, r.id)}
                        className="w-full flex items-center justify-center gap-2 text-[9px] font-black text-[#142d53] hover:text-[#48c1d2] transition-colors tracking-widest uppercase bg-[#48c1d2]/10 px-4 py-3 rounded-xl border border-[#48c1d2]/20 active:scale-95"
                      >
                        <Download size={14} /> Descargar
                      </button>
                   </div>
                </div>
             </Card>
           ))}
           {reportesAudio.length === 0 && (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem]">
               <Mic size={48} className="mb-4 opacity-20" />
               <p className="text-xs font-bold tracking-widest italic opacity-40 px-6 text-center uppercase">Sin audios pendientes</p>
             </div>
           )}
         </div>
      </div>

      {/* BANDEJA DE LOCUCIONES */}
      <div className="mt-12 md:mt-16">
         <h3 className="text-lg md:text-xl font-black text-[var(--primary)] uppercase tracking-widest mb-6 flex items-center gap-3 px-1">
           <div className="bg-[#142d53] p-2 rounded-xl text-[#48c1d2] shadow-lg shadow-[#142d53]/20 shrink-0">
             <Mic size={20} />
           </div>
           Locuciones
           <span className="ml-auto text-[8px] font-black text-[#48c1d2] bg-[#48c1d2]/10 px-3 py-1.5 rounded-full border border-[#48c1d2]/20">
             {locuciones.length}
           </span>
         </h3>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {locuciones.map(loc => (
             <Card key={loc.id} className="p-6 border-2 border-[#48c1d2]/20 bg-[#142d53] rounded-[2rem] shadow-xl relative group overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex-1 min-w-0 mr-2">
                     <span className="text-[7px] font-black text-[#48c1d2] uppercase tracking-widest block mb-0.5 opacity-60">Locución</span>
                     <h4 className="text-xs font-black text-white leading-tight truncate">{loc.script_title}</h4>
                     <p className="text-[8px] font-bold text-white/40 mt-1 uppercase tracking-tighter">{formatDate(loc.created_at)}</p>
                   </div>
                   <button 
                     onClick={() => deleteLocucion(loc.id, loc.audio_url)}
                     className="text-white/20 hover:text-red-400 transition-colors bg-white/5 p-2 rounded-lg shrink-0"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
                
                <div className="space-y-3">
                   <audio src={loc.audio_url} controls className="w-full h-10 rounded-xl opacity-80" />
                   <button 
                     onClick={() => forceDownload(loc.audio_url, loc.id)}
                     className="w-full flex items-center justify-center gap-2 text-[9px] font-black text-[#48c1d2] tracking-widest uppercase bg-[#48c1d2]/10 px-4 py-3 rounded-xl border border-[#48c1d2]/20 active:scale-95 hover:bg-[#48c1d2]/20 transition-all"
                   >
                     <Download size={14} /> Descargar
                   </button>
                </div>
             </Card>
           ))}
           {locuciones.length === 0 && (
             <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300 bg-[#142d53]/50 border-2 border-dashed border-white/5 rounded-[3rem]">
               <Mic size={48} className="mb-4 opacity-10" />
               <p className="text-xs font-bold tracking-widest italic opacity-40 uppercase">Sin locuciones</p>
             </div>
           )}
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
