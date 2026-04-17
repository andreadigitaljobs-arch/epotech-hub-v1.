"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/Card";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminBottomNav } from "@/components/admin/AdminBottomNav";
import { HedyAssistant } from "@/components/admin/HedyAssistant";
import { 
  Lock, 
  Send, 
  MessageSquare, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  LayoutGrid,
  History,
  Settings,
  Briefcase,
  Target,
  Video,
  LayoutDashboard,
  PlusCircle,
  Save,
  AlertCircle,
  Compass,
  Droplets,
  Users,
  Star,
  Zap,
  ArrowLeft,
  BarChart3,
  Globe,
  Sparkles
} from "lucide-react";

type View = "hedy" | "proyectos" | "estrategia" | "protocolo" | "bitacora" | "avisos" | "servicios" | "inspiracion";

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<View>("hedy");

  // Projects data
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({ nombre: "", pipeline: [""], recibido: "", entregado: "" });
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [actividadList, setActividadList] = useState<any[]>([]);

  // External Config States
  const [estrategiaData, setEstrategiaData] = useState<any>({
    mision_titulo: "",
    mision_desc: "",
    diferenciador: "",
    propuesta_valor: "",
    perfil_cliente: "",
    tono_voz: "",
    servicios_basicos: [],
    servicios_premium: [],
    mensajes_clave: [],
    hub_infraestructura: [],
    hub_social_media: {}
  });
  const [manualData, setManualData] = useState<any>(null);
  const [refVideos, setRefVideos] = useState<any[]>([]);
  
  // Metrics data
  const [metrics, setMetrics] = useState({
    id: "",
    publicaciones: 0,
    publicaciones_target: 5,
    reels: 0,
    reels_target: 3,
    carruseles: 0,
    carruseles_target: 2,
    week_label: ""
  });

  // Notification form
  const [notif, setNotif] = useState({
    titulo: "",
    mensaje: "",
    tipo: "CONTENIDO"
  });

  // Activity form
  const [actv, setActv] = useState({
    categoria: "Contenido",
    siguiente_objetivo: "",
    fecha: new Date().toISOString().split("T")[0]
  });
  const [logros, setLogros] = useState<string[]>([""]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1606") {
      setIsAuthorized(true);
      localStorage.setItem("epotech_admin_auth", "true");
      fetchInitialData();
    } else {
      alert("PIN incorrecto. Inténtalo de nuevo.");
      setPin("");
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("epotech_admin_auth");
    if (auth === "true") {
      setIsAuthorized(true);
      fetchInitialData();
    }
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // Load Projects
      const { data: pData } = await supabase.from("proyectos").select("*").order("updated_at", { ascending: false });
      if (pData) setProjectsList(pData);

      // Load Metrics
      const { data: mData } = await supabase.from("weekly_stats").select("*").single();
      if (mData) setMetrics(mData);

      // Load Dynamic Configs (with Auto-Fix)
      const { data: eData } = await supabase.from("config_estrategia").select("*").maybeSingle();
      if (eData) {
        setEstrategiaData(eData);
      } else {
        const { data: newE } = await supabase.from("config_estrategia").insert([{ mision_titulo: 'Nuestra Misión', objetivos: [] }]).select().single();
        if (newE) setEstrategiaData(newE);
      }

      const { data: mnData } = await supabase.from("config_manual").select("*").maybeSingle();
      if (mnData) {
        setManualData(mnData);
      } else {
        const { data: newMN } = await supabase.from("config_manual").insert([{ regla_oro: 'Si no está en video, no pasó.', haz_list: [] }]).select().single();
        if (newMN) setManualData(newMN);
      }

      // Load References
      const { data: vData } = await supabase.from("referencias_videos").select("*").order("created_at", { ascending: false });
      if (vData) setRefVideos(vData);

      // Load Activities for Cleanup
      const { data: actData } = await supabase.from("actividad").select("*").order("fecha", { ascending: false });
      if (actData) setActividadList(actData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const runStrategicReset = async () => {
    if (!confirm("ESTA ACCIÓN ES IRREVERSIBLE. Se borrarán todos los proyectos demo, bitácora y chat, y los progresos volverán a 0%. ¿Proceder?")) return;
    setLoading(true);
    try {
      // 1. Wipe demo tables
      await supabase.from("actividad").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("proyectos").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("notificaciones").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("chat_history").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      
      // 2. Reset progress
      const freshInfra = estrategiaData.hub_infraestructura.map((s: any) => ({ ...s, progress: 0 }));
      const freshSocial = { ...estrategiaData.hub_social_media, monthlyIdeas: [], observations: "" };
      
      const { id } = estrategiaData;
      await supabase.from("config_estrategia").update({ 
        hub_infraestructura: freshInfra,
        hub_social_media: freshSocial 
      }).eq("id", id);

      alert("Reset completado. El escenario está limpio.");
      fetchInitialData();
    } catch (err) {
      console.error(err);
      alert("Error en el reset.");
    } finally {
      setLoading(false);
    }
  };

  // Logros Management
  const addLogro = () => setLogros([...logros, ""]);
  const updateLogro = (index: number, val: string) => {
    const newLogros = [...logros];
    newLogros[index] = val;
    setLogros(newLogros);
  };
  const removeLogro = (index: number) => setLogros(logros.filter((_, i) => i !== index));

  // Projects Management
  const addPipelineField = () => setNewProject({ ...newProject, pipeline: [...newProject.pipeline, ""] });
  const updatePipelineField = (idx: number, val: string) => {
    const newPipeline = [...newProject.pipeline];
    newPipeline[idx] = val;
    setNewProject({ ...newProject, pipeline: newPipeline });
  };
  const removePipelineField = (idx: number) => {
    setNewProject({ ...newProject, pipeline: newProject.pipeline.filter((_, i) => i !== idx) });
  };

  const createProject = async () => {
    if (!newProject.nombre) return alert("Ponle nombre al proyecto");
    setLoading(true);
    const pipelineData = newProject.pipeline
      .filter(p => p.trim() !== "")
      .map(p => ({ nombre: p, completado: false }));

    const { error } = await supabase.from("proyectos").insert([{
      nombre: newProject.nombre,
      progreso: 0,
      status: 'received',
      pipeline: pipelineData,
      recibido: newProject.recibido.split("\n").filter(l => l.trim() !== ""),
      entregado: newProject.entregado.split("\n").filter(l => l.trim() !== "")
    }]);

    if (error) alert(error.message);
    else {
      alert("¡Proyecto creado con éxito!");
      setNewProject({ nombre: "", pipeline: [""], recibido: "", entregado: "" });
      setShowCreateProject(false);
      fetchInitialData();
    }
    setLoading(false);
  };

  const deleteProject = async (id: string) => {
    if (!confirm("¿Seguro que quieres borrar este proyecto?")) return;
    setLoading(true);
    const { error } = await supabase.from("proyectos").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchInitialData();
    setLoading(false);
  };

  const updateProject = async (projectId: string, updates: any) => {
    setLoading(true);
    const { error } = await supabase.from("proyectos").update(updates).eq("id", projectId);
    setLoading(false);
    if (error) alert(error.message);
    else {
      const { data } = await supabase.from("proyectos").select("*").order("updated_at", { ascending: false });
      if (data) setProjectsList(data);
    }
  };

  // Other Savers
  const saveNotif = async () => {
    if (!notif.titulo || !notif.mensaje) return alert("Completa todos los campos");
    setLoading(true);
    const { error } = await supabase.from("notificaciones").insert([notif]);
    
    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Trigger Web Push Notification
    try {
      await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: notif.titulo,
          mensaje: notif.mensaje,
          url: "/"
        }),
      });
    } catch (pushError) {
      console.error("Error sending push notification:", pushError);
      // We don't alert the user here as the DB save was successful
    }

    setLoading(false);
    alert("¡Notificación enviada!");
    setNotif({ titulo: "", mensaje: "", tipo: "CONTENIDO" });
  };

  const saveActv = async () => {
    const validLogros = logros.filter(l => l.trim() !== "");
    if (validLogros.length === 0) return alert("Agrega al menos un avance");
    setLoading(true);
    const { error } = await supabase.from("actividad").insert([{ ...actv, logros: validLogros }]);
    setLoading(false);
    if (error) alert(error.message);
    else {
      alert("¡Actividad registrada!");
      setActv({ ...actv, siguiente_objetivo: "" });
      setLogros([""]);
      fetchInitialData();
    }
  };

  const deleteActividad = async (id: string) => {
    if (!confirm("¿Borrar este registro?")) return;
    setLoading(true);
    const { error } = await supabase.from("actividad").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchInitialData();
    setLoading(false);
  };

  const saveMetrics = async () => {
    setLoading(true);
    const { id, ...rest } = metrics;
    const { error } = await supabase.from("weekly_stats").update(rest).eq("id", id);
    setLoading(false);
    if (error) alert(error.message);
    else alert("Métricas actualizadas!");
  };

  const saveEstrategia = async () => {
    setLoading(true);
    const { id, ...rest } = estrategiaData;
    const { error } = await supabase.from("config_estrategia").update(rest).eq("id", id);
    setLoading(false);
    if (error) alert(error.message);
    else alert("Estrategia Master actualizada!");
  };

  const saveManual = async () => {
    setLoading(true);
    const { id, ...rest } = manualData;
    const { error } = await supabase.from("config_manual").update(rest).eq("id", id);
    setLoading(false);
    if (error) alert(error.message);
    else alert("Protocolo de Obra actualizado!");
  };

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#F0F4F8] to-[#E8F9FB] p-6">
        <Card className="w-full max-w-sm rounded-[28px] p-10 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[var(--accent-light)] text-[var(--accent)]">
            <Lock size={34} />
          </div>
          <h1 className="mb-1 text-2xl font-black text-[var(--primary)] tracking-tighter uppercase italic">Panel del Equipo</h1>
          <p className="mb-8 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Ingresa el PIN para continuar</p>
          
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-6">
              {/* VIsual Dots Indicator - Perfectly Aligned */}
              <div className="flex justify-center gap-6 w-[200px]">
                {[0,1,2,3].map(i => (
                  <div 
                    key={i} 
                    className={`h-5 w-5 rounded-full transition-all duration-300 ${
                      pin.length > i 
                        ? 'bg-[var(--accent)] shadow-[0_0_15px_rgba(30,150,250,0.5)] scale-110' 
                        : 'bg-gray-200'
                    }`} 
                  />
                ))}
              </div>

              {/* Input Area */}
              <div className="relative w-[200px]">
                <input
                  type="password" inputMode="numeric" pattern="[0-9]*" maxLength={4}
                  value={pin} onChange={(e) => setPin(e.target.value)} autoFocus
                  className="w-full bg-transparent p-0 text-center text-3xl font-black tracking-[1.5rem] text-transparent caret-transparent outline-none absolute inset-0 z-10"
                />
                <div className="w-full h-14 bg-gray-50 border-2 border-gray-100 rounded-2xl flex items-center justify-center -z-10">
                   {/* This is a ghost input to show the user where to type if needed */}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <button type="submit" className="w-full rounded-2xl bg-[var(--primary)] py-4 text-base font-black text-white shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-95">
                Desbloquear Panel
              </button>
              
              <a 
                href="/" 
                className="flex items-center justify-center gap-2 w-full py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[var(--primary)] transition-colors"
              >
                <ArrowLeft size={14} /> Regresar a la App
              </a>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  const logout = () => {
    setIsAuthorized(false);
    localStorage.removeItem("epotech_admin_auth");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <AdminSidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={logout} 
      />

      <main className="transition-all duration-300 md:pl-64 pb-32 md:pb-10">
        <div className="mx-auto max-w-6xl p-6 md:p-10">
          
          {/* Header */}
          <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-8 bg-[var(--accent)] rounded-full" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">Epotech Admin Hub</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-[var(--primary)] capitalize">
                {({'bitacora': 'Bitácora', 'avisos': 'Notificaciones', 'proyectos': 'Proyectos', 'servicios': 'Estrategia Master', 'protocolo': 'Guía de Obra', 'inspiracion': 'Inspiración'} as any)[activeView] || activeView}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={runStrategicReset}
                title="Reset Estratégico"
                className="flex h-10 px-4 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} /> Reset Demo
              </button>
              <button onClick={fetchInitialData} className="flex h-10 w-10 items-center justify-center rounded-xl border bg-white shadow-sm hover:bg-gray-50 transition-colors">
                <History size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </header>

          {/* Views */}
          <div className="space-y-8 animate-in fade-in duration-700">
             {/* AI ASSISTANT VIEW (HEDY) */}
            {activeView === "hedy" && (
              <div className="animate-in fade-in zoom-in duration-700">
                <HedyAssistant />
              </div>
            )}
            
            {/* Views handled below */}

            {/* BITACORA VIEW */}
            {activeView === "bitacora" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
               <Card className="border-t-8 border-amber-500 overflow-hidden">
                  <div className="bg-amber-500 p-6 text-white">
                    <h3 className="text-xl font-black flex items-center gap-2">
                       <History /> Registro Manual
                    </h3>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-1">
                        <label className="text-xs font-black uppercase text-[var(--text-muted)] mb-2 block">Fecha</label>
                        <input type="date" value={actv.fecha} onChange={(e) => setActv({...actv, fecha: e.target.value})} className="w-full border rounded-xl p-3 font-bold" />
                      </div>
                      <div className="col-span-1">
                        <label className="text-xs font-black uppercase text-[var(--text-muted)] mb-2 block">Categoría</label>
                        <select value={actv.categoria} onChange={(e) => setActv({...actv, categoria: e.target.value})} className="w-full border rounded-xl p-3 font-bold">
                          <option value="CRM Master">CRM Master</option>
                          <option value="App de Marca">App de Marca</option>
                          <option value="Landing Page">Landing Page</option>
                          <option value="Formulario Inteligente">Formulario Inteligente</option>
                          <option value="Contenido">Producción de Contenido</option>
                          <option value="Branding">Branding / Diseño</option>
                          <option value="Web">Desarrollo Web / App</option>
                          <option value="Ventas">Ventas / WhatsApp</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-[var(--text-muted)] mb-3 block">Logros</label>
                      <div className="space-y-3">
                        {logros.map((l, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input type="text" value={l} onChange={(e) => updateLogro(idx, e.target.value)} placeholder={`Avance ${idx+1}...`} className="w-full border rounded-xl p-3 text-sm font-bold" />
                            {logros.length > 1 && <button onClick={() => removeLogro(idx)} className="text-red-500 h-10 w-10 flex items-center justify-center hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>}
                          </div>
                        ))}
                        <button onClick={addLogro} className="flex items-center gap-2 text-sm font-black text-amber-600"><Plus size={16} /> Agregar logro</button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-[var(--text-muted)] mb-2 block">Objetivo</label>
                      <input type="text" value={actv.siguiente_objetivo} onChange={(e) => setActv({...actv, siguiente_objetivo: e.target.value})} className="w-full border rounded-xl p-3 font-bold" placeholder="¿Qué sigue?" />
                    </div>
                    <button onClick={saveActv} className="btn-primary w-full py-4 text-lg font-black bg-amber-600 hover:bg-amber-700">Registrar</button>
                  </div>
               </Card>

               <Card className="p-8">
                  <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b pb-4 mb-6">Limpieza de Historial</h4>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                     {actividadList.map((item) => (
                       <div key={item.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                          <div className="flex flex-col gap-1">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase text-amber-600">{item.fecha}</span>
                                <span className="text-[10px] font-bold text-gray-400">•</span>
                                <span className="text-[10px] font-black uppercase text-gray-400">{item.categoria}</span>
                             </div>
                             <p className="text-sm font-bold text-[var(--primary)] line-clamp-1">{item.logros?.[0] || 'Sin logros'}</p>
                          </div>
                          <button 
                            onClick={() => deleteActividad(item.id)}
                            className="bg-red-50 text-red-500 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                     ))}
                     {actividadList.length === 0 && (
                       <p className="text-center text-xs font-bold text-gray-400 py-10 italic">Bitácora limpia.</p>
                     )}
                  </div>
               </Card>
              </div>
            )}

            {/* AVISOS VIEW */}
            {activeView === "avisos" && (
              <Card className="max-w-2xl border-t-8 border-emerald-500 overflow-hidden">
                <div className="bg-emerald-500 p-6 text-white">
                   <h3 className="text-xl font-black flex items-center gap-2">
                      <Send /> Mandar Notificación Global
                   </h3>
                </div>
                <div className="p-8 space-y-6">
                   <div>
                     <label className="text-xs font-black uppercase text-[var(--text-muted)] mb-2 block">Título Llamativo</label>
                     <input type="text" value={notif.titulo} onChange={(e) => setNotif({...notif, titulo: e.target.value})} className="w-full border rounded-xl p-4 font-black" placeholder="Ej: Nueva Fase Activada" />
                   </div>
                   <div>
                     <label className="text-xs font-black uppercase text-[var(--text-muted)] mb-2 block">Mensaje (Sé directo)</label>
                     <textarea rows={4} value={notif.mensaje} onChange={(e) => setNotif({...notif, mensaje: e.target.value})} className="w-full border rounded-xl p-4 font-medium" />
                   </div>
                   <button onClick={saveNotif} className="btn-primary w-full py-4 text-base font-black bg-emerald-600 hover:bg-emerald-700">Enviar a Sebastián</button>
                </div>
              </Card>
            )}

            {/* SERVICIOS HUB VIEW (Mantenido igual pero con reset funcional) */}
            {activeView === "servicios" && (
              <div className="space-y-10">
                <div className="flex items-center justify-between bg-[var(--primary)] p-8 rounded-[32px] text-white shadow-xl overflow-hidden relative">
                   <div className="relative z-10">
                      <h3 className="text-2xl font-black tracking-tighter">Gestión del Hub de Servicios</h3>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest mt-1">Control de Infraestructura y RRSS (Hedy Mode)</p>
                   </div>
                   <div className="bg-white/10 px-6 py-3 rounded-2xl border border-white/20 flex items-center gap-2">
                     <Sparkles size={16} className="text-[var(--accent)] animate-pulse" />
                     <span className="text-[10px] font-black uppercase tracking-widest">IA en Control</span>
                   </div>
                   <BarChart3 size={120} className="absolute right-[-10px] top-[-10px] opacity-10 rotate-12" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* INFRAESTRUCTURA */}
                   <Card className="p-8 space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[var(--primary)] border-b pb-4 mb-6">Infraestructura Digital</h4>
                      <div className="space-y-8">
                         {["CRM Master", "App de Marca", "Formulario Inteligente", "Landing Page"].map((serviceName, idx) => {
                            const serviceKey = serviceName.toLowerCase().includes('crm') ? 'crm' : serviceName.toLowerCase().includes('app') ? 'app' : serviceName.toLowerCase().includes('formulario') ? 'forms' : 'landing';
                            const serviceData = estrategiaData.hub_infraestructura?.find((s: any) => s.id === serviceKey) || { progress: 0, status: 'active' };
                            
                            return (
                              <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                   <label className="text-sm font-black text-[var(--primary)]">{serviceName}</label>
                                   <div className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                                     serviceData.status === 'success' ? 'bg-green-50 text-green-600 border-green-100' :
                                     serviceData.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                     'bg-gray-50 text-gray-500 border-gray-100'
                                   }`}>
                                      {serviceData.status === 'success' ? 'Listo' : serviceData.status === 'active' ? 'En Marcha' : 'Pausado'}
                                   </div>
                                </div>
                                <div className="space-y-2">
                                   <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-[var(--accent)] transition-all duration-1000" 
                                        style={{ width: `${serviceData.progress}%` }} 
                                      />
                                   </div>
                                   <div className="flex justify-between text-[10px] font-black uppercase text-gray-400">
                                      <span>Progreso</span>
                                      <span>{serviceData.progress}%</span>
                                   </div>
                                </div>
                              </div>
                            );
                         })}
                      </div>
                   </Card>

                   {/* SOCIAL MEDIA STRATEGY */}
                   <div className="space-y-8">
                      <Card className="p-8">
                         <h4 className="text-xs font-black uppercase tracking-widest text-[var(--primary)] border-b pb-4 mb-6">Social Media Strategy</h4>
                         <div className="space-y-5">
                            <div>
                               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Observaciones de la Socia (Hedy)</label>
                               <div className="w-full border rounded-2xl p-4 text-xs font-bold bg-gray-50 border-gray-100 min-h-[100px] text-[var(--primary)] whitespace-pre-wrap italic">
                                 {estrategiaData.hub_social_media?.observations || "Hedy aún no ha realizado observaciones estratégicas para este periodo."}
                               </div>
                            </div>
                         </div>
                      </Card>

                      <Card className="p-8">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex justify-between">
                            Ideas Estratégicas (IA)
                            <div className="text-[8px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md">Generadas por Hedy</div>
                        </h4>
                        <div className="space-y-3">
                           {estrategiaData.hub_social_media?.monthlyIdeas?.map((idea: any, idx: number) => (
                             <div key={idx} className="flex gap-3 items-center p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
                                <div className="h-6 w-6 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                                   <Sparkles size={12} />
                                </div>
                                <span className="text-xs font-bold text-[var(--primary)]">{idea.text}</span>
                             </div>
                           ))}
                           {(!estrategiaData.hub_social_media?.monthlyIdeas || estrategiaData.hub_social_media.monthlyIdeas.length === 0) && (
                             <p className="text-[10px] font-bold text-gray-400 italic py-4 text-center border-2 border-dashed rounded-2xl">No hay ideas generadas aún.</p>
                           )}
                        </div>
                      </Card>
                   </div>
                  </div>
              </div>
            )}

            {/* PROTOCOLO VIEW (Guía de Obra) */}
            {activeView === "protocolo" && manualData && (
              <Card className="max-w-3xl border-t-8 border-blue-600 overflow-hidden">
                <div className="bg-blue-600 p-8 text-white relative">
                   <Briefcase size={80} className="absolute right-[-10px] bottom-[-10px] opacity-10" />
                   <h3 className="text-2xl font-black tracking-tighter uppercase italic">Guía de Obra Master</h3>
                   <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1">Reglas de Oro y Operación Epotech</p>
                </div>
                <div className="p-10 space-y-10">
                   <div className="p-8 bg-blue-50 rounded-[32px] border-2 border-blue-100">
                      <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-3 block">La Regla de Oro</label>
                      <input 
                        className="w-full bg-transparent text-2xl font-black text-[var(--primary)] outline-none"
                        value={manualData.regla_oro}
                        onChange={(e) => setManualData({...manualData, regla_oro: e.target.value})}
                      />
                   </div>
                   <button onClick={saveManual} className="btn-primary w-full bg-blue-600 py-4 font-black">Actualizar Guía de Obra</button>
                </div>
              </Card>
            )}

            {/* INSPIRACION VIEW (Referencias) */}
            {activeView === "inspiracion" && (
              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {refVideos.map((video) => (
                      <Card key={video.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-500 rounded-[32px] border-none">
                         <div className="bg-gray-100 aspect-video relative flex items-center justify-center p-4">
                            <Video size={40} className="text-gray-300 group-hover:scale-110 transition-transform" />
                            <a href={video.url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" />
                         </div>
                         <div className="p-6 space-y-3">
                            <h4 className="text-sm font-black text-[var(--primary)] leading-tight">{video.titulo}</h4>
                            <div className="flex gap-2">
                               <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-md uppercase">{video.platform}</span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-500 italic">"{video.porque_funciona}"</p>
                            <a href={video.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-blue-500 hover:underline flex items-center gap-1 group/link">
                               Ver Referencia <Globe size={10} className="group-hover/link:rotate-12" />
                            </a>
                         </div>
                      </Card>
                    ))}
                 </div>
                 {refVideos.length === 0 && (
                   <Card className="p-20 text-center border-dashed border-2 flex flex-col items-center justify-center">
                      <Video size={48} className="text-gray-200 mb-4" />
                      <p className="text-sm font-bold text-gray-400">Pídele a Hedy que guarde videos interesantes aquí.</p>
                   </Card>
                 )}
              </div>
            )}

          </div>


        </div>
      </main>

      <AdminBottomNav 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
    </div>
  );
}
