"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { client } from "@/data/sebastian";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  CheckCircle2, Circle, Clock, ChevronDown, ChevronUp,
  Database, Smartphone, Layout, FormInput, Rocket,
  MessageSquare, Save, AlertCircle, Trash2, Plus, Pencil,
  TrendingUp, Search, Bell, Sparkles, MapPin, Share2, Lightbulb
} from "lucide-react";

// ─── Static service definitions ─────────────────────────────────────────────
const SERVICES = [
  {
    id: "crm",
    name: "CRM Master",
    description: "Gestión de clientes y automatización de seguimiento.",
    Icon: Database,
    color: "blue",
  },
  {
    id: "hub-app",
    name: "Epotech Hub (Esta App)",
    description: "La plataforma que Sebastián usa para grabar, publicar y seguir su progreso.",
    Icon: Smartphone,
    color: "indigo",
  },

  {
    id: "landing",
    name: "Landing Page",
    description: "Nueva plataforma web optimizada para captar clientes de limpieza de ventanas y lavado a presión.",
    Icon: Layout,
    color: "purple",
  },
  {
    id: "google-ads",
    name: "Google Business",
    description: "Gestión de perfil comercial, reseñas y posicionamiento local en Google Maps.",
    Icon: TrendingUp,
    color: "orange",
  },
  {
    id: "social-media",
    name: "Redes Sociales",
    description: "Estrategia de contenido orgánico, viralización y gestión de comunidad en IG, FB y TikTok.",
    Icon: MessageSquare,
    color: "pink",
  },
  {
    id: "google-maps-seo",
    name: "Posicionamiento Google Maps",
    description: "Estrategia de SEO Local para dominar Salt Lake City.",
    Icon: MapPin,
    color: "cyan",
    isComingSoon: true,
  },
];

// ─── Initial tasks per service (seeded once if table is empty) ───────────────
const INITIAL_TASKS: Record<string, { tarea: string; orden: number; status?: TaskStatus; observacion?: string | null }[]> = {
  crm: [
    { tarea: "Gestión de Clientes & Marketing", status: "completada", observacion: "Fichas de propiedad con métricas de superficie, trazabilidad de origen de leads e historial multimedia completo.", orden: 1 },
    { tarea: "Centro de Operaciones & Post-Job Wizard", status: "completada", observacion: "Tablero Kanban para control visual de obras y asistente inteligente de cierre con reportes de químicos y presión.", orden: 2 },
    { tarea: "Inventario Inteligente con Auto-Ajuste", status: "en_proceso", observacion: "Control de maquinaria y herramientas con descuento automático por trabajo y registro de compras de reposición.", orden: 3 },
    { tarea: "Automatización Financiera & Agenda", status: "en_proceso", observacion: "Caja automática sincronizada con servicios, balance de rentabilidad en tiempo real y calendario visual de cuadrillas.", orden: 4 },
    { tarea: "Ingeniería de Datos & Estabilidad", status: "completada", observacion: "Implementación de Deep Linking para navegación fluida y blindaje de código (TypeScript) para producción.", orden: 5 },
  ],
  "hub-app": [
    { tarea: "Estrategia & Brand Brief", status: "completada", observacion: "Integración total de misión, visión y público objetivo para que cada contenido respire el ADN de Epotech.", orden: 1 },
    { tarea: "Biblioteca de Inspiración Operativa", status: "completada", observacion: "Repositorio de referencias por red social con enlaces directos y análisis de cuentas top.", orden: 2 },
    { tarea: "Guía de Producción en Terreno", status: "completada", observacion: "Módulo de grabación con esquema de 4 pasos (Antes/Durante/Después/Humano) y tips específicos.", orden: 3 },
    { tarea: "Estudio de Voz & Historial de Éxitos", status: "completada", observacion: "Sincronización automática de notas de voz, calendario y análisis de viralidad (Caso Abril).", orden: 4 },
    { tarea: "Centro de Notificaciones & Reporte Diario", status: "completada", observacion: "Alertas push en tiempo real y formulario inteligente para creación reactiva de guiones.", orden: 5 },
    { tarea: "Triada de Marca (Guiones Finales)", status: "en_proceso", observacion: "Sustitución de borradores por los 3 guiones de presentación final de alta conversión.", orden: 6 },
    { tarea: "Manual de Usuario y Tutoriales", status: "en_proceso", observacion: "Creación de guías de uso específicas para garantizar la autonomía total de Sebastian.", orden: 7 },
  ],

  landing: [
    { tarea: "Rediseño Estratégico Epotech 2026", status: "en_proceso", observacion: "Nueva arquitectura visual y narrativa centrada en la autoridad de marca y experiencia de usuario moderna.", orden: 1 },
    { tarea: "Integración de Nuevas Verticales", status: "en_proceso", observacion: "Inclusión detallada de los servicios de Pressure Washing y Window Cleaning en la estructura de ventas.", orden: 2 },
    { tarea: "Optimización de Conversión (CRO)", status: "en_proceso", observacion: "Rediseño de formularios y llamadas a la acción (CTAs) para maximizar la captura de clientes potenciales.", orden: 3 },
    { tarea: "Despliegue Técnico y Performance", status: "pendiente", observacion: "Publicación de la nueva versión con optimización de velocidad de carga y estabilidad móvil.", orden: 4 },
  ],
  "google-ads": [
    { tarea: "Control y Gestión de Propiedad", status: "completada", observacion: "Acceso total y configuración de administrador para la gestión centralizada de la marca en Google.", orden: 1 },
    { tarea: "Optimización de Perfil y Servicios", status: "completada", observacion: "Categorización completa de servicios y actualización de información corporativa para máxima relevancia.", orden: 2 },
    { tarea: "Gestión de Reputación (Reviews)", status: "completada", observacion: "6 reseñas publicadas y respondidas. Implementación de sistema QR y links directos para captación de clientes felices.", orden: 3 },
    { tarea: "Indexación Visual y Multimedia", status: "completada", observacion: "Biblioteca de fotos (antes/después) y equipo operativo activa. Indexación de Reels de Instagram en resultados de búsqueda.", orden: 4 },
    { tarea: "SEO Local y Autoridad Digital", status: "completada", observacion: "Posicionamiento en Google Maps, visibilidad ante IAs (Gemini) y presencia optimizada en plataformas externas como Angi.", orden: 5 },
    { tarea: "Estrategia de Google Ads (Tráfico Pago)", status: "en_proceso", observacion: "Fase de planificación de anuncios de reconocimiento. Pendiente de lanzamiento tras la actualización de la Landing Page.", orden: 6 },
  ],
  "social-media": [
    { tarea: "Refrescamiento de Marca & Branding IA", status: "completada", observacion: "Renovación de perfiles (IG/FB/WA) con bio optimizada para SEO y fotos profesionales generadas con IA.", orden: 1 },
    { tarea: "Estrategia de Contenido Humano (Bye Canva)", status: "completada", observacion: "Transición de diseños genéricos a una comunicación 100% orgánica y humana. Creación de historias 'Work'.", orden: 2 },
    { tarea: "Producción & Edición Multimedia (Fase 1)", status: "completada", observacion: "Publicación de 13 piezas de alto impacto (10 videos / 3 carousels) editadas con estándares cinematográficos.", orden: 3 },
    { tarea: "Optimización de Formatos Virales (POV)", status: "completada", observacion: "Identificación y ejecución con éxito del formato 'Point of View' y sonido satisfactorio. Caso: Viral de Techos.", orden: 4 },
    { tarea: "Omnicanalidad & Crecimiento Orgánico", status: "completada", observacion: "Reactivación y sincronización de Instagram, Facebook y TikTok con una línea coherente y moderna.", orden: 5 },
    { tarea: "Experimentación de Narrativa 'Voice-over'", status: "en_proceso", observacion: "Implementación de nuevo formato narrado basado en las notas de voz grabadas desde el Hub.", orden: 6 },
    { tarea: "Ecosistema de Conversión & Catálogo", status: "en_proceso", observacion: "Optimización de WhatsApp Business y preparación de catálogos digitales para conversión.", orden: 7 },
  ],
  "google-maps-seo": [
    { tarea: "Sistema de Reviews (50 en 60 días)", status: "pendiente", observacion: "Objetivo: 50 reseñas. Usar script: 'If you liked the results, it would help us grow 🙌'", orden: 1 },
    { tarea: "Fotos Semanales (3-5 tomas)", status: "pendiente", observacion: "Sube antes/después, tú trabajando y videos cortos.", orden: 2 },
    { tarea: "Posts en Google (2 por semana)", status: "pendiente", observacion: "Actividad constante para rankear en el mapa.", orden: 3 },
    { tarea: "Optimización SLC Keywords", status: "pendiente", observacion: "Uso de 'Salt Lake City' en cada descripción de servicio.", orden: 4 },
    { tarea: "Zonas de Alcance (Magna/Jordan)", status: "pendiente", observacion: "Configurar SLC, West Valley, West Jordan, etc.", orden: 5 },
    { tarea: "Responder 100% de Reviews", status: "pendiente", observacion: "Interacción obligatoria para el algoritmo de Google.", orden: 6 },
    { tarea: "Nivel PRO: Website Sync", status: "pendiente", observacion: "Keywords iguales en web + perfil de Google.", orden: 7 },
  ],
};

type TaskStatus = "pendiente" | "en_proceso" | "completada";

interface Task {
  id: string;
  service_id: string;
  service_name: string;
  tarea: string;
  completada: boolean;
  status: TaskStatus;
  observacion: string | null;
  orden: number;
}

// ─── Progress calculation ────────────────────────────────────────────────────
function calcProgress(tasks: Task[]): number {
  if (!tasks.length) return 0;
  const score = tasks.reduce((acc, t) => {
    if (t.status === "completada") return acc + 1;
    if (t.status === "en_proceso") return acc + 0.5;
    return acc;
  }, 0);
  return Math.round((score / tasks.length) * 100);
}

const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  pendiente: "en_proceso",
  en_proceso: "completada",
  completada: "pendiente",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  pendiente: "Pendiente",
  en_proceso: "En proceso",
  completada: "Completada",
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  pendiente: "bg-slate-100 text-slate-500 border-slate-200",
  en_proceso: "bg-amber-50 text-amber-600 border-amber-200",
  completada: "bg-emerald-50 text-emerald-600 border-emerald-200",
};

interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  fecha: string;
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ProyectosPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [obsEdits, setObsEdits] = useState<Record<string, string>>({});
  const [savingObs, setSavingObs] = useState<string | null>(null);
  const [nameEdits, setNameEdits] = useState<Record<string, string>>({});
  const [editingName, setEditingName] = useState<string | null>(null);
  const [addingTask, setAddingTask] = useState<Record<string, string>>({});
  const [newTaskText, setNewTaskText] = useState<Record<string, string>>({});
  const [activeSubTab, setActiveSubTab] = useState<'proyectos' | 'mensajes'>('proyectos');
  const [msgFilter, setMsgFilter] = useState<'todas' | 'redes' | 'tips'>('todas');

  useEffect(() => {
    // Failsafe: 3 segundos max de carga
    const timer = setTimeout(() => setLoading(false), 3000);

    async function fetchData() {
      try {
        // Fetch Tasks
        const { data: tData } = await supabase
          .from("tareas_servicio")
          .select("*")
          .order("orden", { ascending: true });
        if (tData) {
           setTasks(tData);
           
           // Failsafe: Si un servicio de la lista no tiene tareas en DB, las sembramos
           const existingServiceIds = new Set(tData.map(t => t.service_id));
           const missingServices = SERVICES.filter(s => !existingServiceIds.has(s.id));
           
           if (missingServices.length > 0) {
              const rowsToInsert: any[] = [];
              for (const svc of missingServices) {
                 INITIAL_TASKS[svc.id]?.forEach((t) =>
                   rowsToInsert.push({
                     service_id: svc.id,
                     service_name: svc.name,
                     tarea: t.tarea,
                     completada: t.status === "completada",
                     status: t.status || "pendiente",
                     observacion: t.observacion || null,
                     orden: t.orden,
                   })
                 );
              }
              if (rowsToInsert.length > 0) {
                 await supabase.from("tareas_servicio").insert(rowsToInsert);
                 const { data: refreshed } = await supabase.from("tareas_servicio").select("*").order("orden", { ascending: true });
                 setTasks(refreshed || []);
              }
           }
        }

        // Fetch Notifications
        const { data: nData } = await supabase
          .from("notificaciones")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);
        if (nData) setNotificaciones(nData);
      } finally {
        setLoading(false);
        clearTimeout(timer);
      }
    }
    fetchData();
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("es-ES", { day: 'numeric', month: 'short' }).replace('.', '');
    } catch (e) {
      return dateStr;
    }
  };

  // ── Toggle status (cycles pendiente → en_proceso → completada → pendiente) ─
  const toggleStatus = async (task: Task) => {
    const newStatus = STATUS_CYCLE[task.status];
    const newCompletada = newStatus === "completada";

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, status: newStatus, completada: newCompletada } : t
      )
    );

    await supabase
      .from("tareas_servicio")
      .update({ status: newStatus, completada: newCompletada, updated_at: new Date().toISOString() })
      .eq("id", task.id);
  };

  // ── Save observation ──────────────────────────────────────────────────────
  const saveObs = async (taskId: string) => {
    setSavingObs(taskId);
    const text = obsEdits[taskId] ?? "";
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, observacion: text } : t))
    );
    await supabase
      .from("tareas_servicio")
      .update({ observacion: text, updated_at: new Date().toISOString() })
      .eq("id", taskId);
    setSavingObs(null);
  };

  // ── Save edited task name ────────────────────────────────────────────────
  const saveTaskName = async (taskId: string) => {
    const newName = nameEdits[taskId]?.trim();
    if (!newName) { setEditingName(null); return; }
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, tarea: newName } : t))
    );
    setEditingName(null);
    await supabase
      .from("tareas_servicio")
      .update({ tarea: newName, updated_at: new Date().toISOString() })
      .eq("id", taskId);
  };

  // ── Delete task ───────────────────────────────────────────────────────────
  const deleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    await supabase.from("tareas_servicio").delete().eq("id", taskId);
  };

  // ── Add new task ──────────────────────────────────────────────────────────
  const addTask = async (serviceId: string, serviceName: string) => {
    const text = newTaskText[serviceId]?.trim();
    if (!text) return;
    const svcTasks = tasks.filter((t) => t.service_id === serviceId);
    const maxOrden = svcTasks.length ? Math.max(...svcTasks.map((t) => t.orden)) : 0;

    const { data, error } = await supabase
      .from("tareas_servicio")
      .insert({
        service_id: serviceId,
        service_name: serviceName,
        tarea: text,
        completada: false,
        status: "pendiente",
        observacion: null,
        orden: maxOrden + 1,
      })
      .select()
      .single();

    if (!error && data) {
      setTasks((prev) => [...prev, data]);
      setNewTaskText((prev) => ({ ...prev, [serviceId]: "" }));
      setAddingTask((prev) => ({ ...prev, [serviceId]: "" }));
    }
  };

  if (loading) return <LoadingSpinner message="Cargando proyectos..." />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      <div className="space-y-6 pb-20">
        <div className="bg-white/50 border border-slate-200 p-6 rounded-[2rem] mb-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed text-left">
            <span className="text-[var(--accent)]">Progreso de Proyectos:</span> Aquí puedes ver exactamente en qué estamos trabajando para ti, qué tan avanzado está cada proyecto y qué hemos logrado hasta ahora. Tócale a cualquier servicio para ver el detalle.
          </p>
        </div>

        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-1">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
             <h1 className="text-3xl font-black text-[#142d53] leading-tight tracking-tighter">
               ¡Hola, {client.name}! 👋🏻
             </h1>
          </div>
          <p className="text-[10px] font-black text-[#48c1d2] uppercase tracking-[0.2em] ml-5">
            Hoy es un gran día para hacer crecer a Epotech Solutions
          </p>
        </header>

        {/* Sub-Tabs Switcher */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8 gap-2 max-w-md mx-auto">
          <button 
            onClick={() => setActiveSubTab('proyectos')}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSubTab === 'proyectos' ? 'bg-[#142d53] text-[#48c1d2] shadow-md' : 'text-slate-400'}`}
          >
            <Rocket size={14} /> Proyectos
          </button>
          <button 
            onClick={() => setActiveSubTab('mensajes')}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeSubTab === 'mensajes' ? 'bg-[#142d53] text-[#48c1d2] shadow-md' : 'text-slate-400'}`}
          >
            <Bell size={14} /> Mensajes {notificaciones.length > 0 && <span className="w-1.5 h-1.5 bg-[#48c1d2] rounded-full animate-pulse" />}
          </button>
        </div>

        {activeSubTab === 'proyectos' ? (
          <div className="space-y-4">
          {SERVICES.map((svc) => {
            const svcTasks = tasks.filter((t) => t.service_id === svc.id);
            const progress = calcProgress(svcTasks);
            const done = svcTasks.filter((t) => t.status === "completada").length;
            const isOpen = expanded === svc.id;
            const { Icon } = svc;

            return (
              <div
                key={svc.id}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden transition-all"
              >
                {/* Card header — tap to expand */}
                <button
                  onClick={() => setExpanded(isOpen ? null : svc.id)}
                  className="w-full p-6 flex items-center gap-4 text-left"
                >
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-[var(--primary)]" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1 gap-2">
                      <div className="min-w-0">
                        <h2 className="text-base font-black text-[var(--primary)] tracking-tight leading-tight">
                          {svc.name}
                        </h2>
                        {svc.isComingSoon && (
                          <span className="inline-block text-[7px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full uppercase tracking-[0.1em] border border-amber-200 mt-1">Próximamente</span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-black text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-lg border border-[var(--accent)]/20">
                          {done}/{svcTasks.length}
                        </span>
                        <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">SERVICIOS</p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full transition-all duration-700"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-black text-[var(--primary)] w-8 text-right shrink-0">
                        {progress}%
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 text-slate-400 ml-2">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {/* Checklist — visible when expanded */}
                {isOpen && (
                  <div className="border-t border-slate-50 px-6 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-300">
                    
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest pt-4 pb-1">
                      Lista de tareas
                    </p>

                    {svcTasks.map((task) => {
                      const obsVal = obsEdits[task.id] ?? task.observacion ?? "";
                      const isDirty = obsEdits[task.id] !== undefined && obsEdits[task.id] !== (task.observacion ?? "");

                      return (
                        <div
                          key={task.id}
                          className={`rounded-2xl border p-4 space-y-3 transition-colors ${
                            task.status === "completada"
                              ? "bg-emerald-50/40 border-emerald-100"
                              : task.status === "en_proceso"
                              ? "bg-amber-50/40 border-amber-100"
                              : "bg-slate-50 border-slate-100"
                          }`}
                        >
                          {/* Task row */}
                          <div className="flex items-start gap-3">
                            {/* Status toggle button */}
                            <button
                              onClick={() => toggleStatus(task)}
                              className="shrink-0 mt-0.5 transition-transform active:scale-90"
                            >
                              {task.status === "completada" ? (
                                <CheckCircle2 size={22} className="text-emerald-500" />
                              ) : task.status === "en_proceso" ? (
                                <Clock size={22} className="text-amber-500" />
                              ) : (
                                <Circle size={22} className="text-slate-300" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              {editingName === task.id ? (
                                <input
                                  autoFocus
                                  className="w-full text-sm font-bold text-[var(--primary)] bg-white border border-[var(--accent)] rounded-lg px-2 py-1 outline-none"
                                  value={nameEdits[task.id] ?? task.tarea}
                                  onChange={(e) =>
                                    setNameEdits((prev) => ({ ...prev, [task.id]: e.target.value }))
                                  }
                                  onBlur={() => saveTaskName(task.id)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") saveTaskName(task.id);
                                    if (e.key === "Escape") setEditingName(null);
                                  }}
                                />
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingName(task.id);
                                    setNameEdits((prev) => ({ ...prev, [task.id]: task.tarea }));
                                  }}
                                  className={`text-left text-sm font-bold leading-snug w-full group/name flex items-center gap-1 ${
                                    task.status === "completada"
                                      ? "line-through text-slate-400"
                                      : "text-[var(--primary)]"
                                  }`}
                                >
                                  {task.tarea}
                                  <Pencil size={10} className="text-slate-300 opacity-0 group-hover/name:opacity-100 transition-opacity shrink-0" />
                                </button>
                              )}
                            </div>

                            {/* Status badge */}
                            <span
                              className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg border shrink-0 ${STATUS_COLORS[task.status]}`}
                            >
                              {STATUS_LABELS[task.status]}
                            </span>

                            {/* Delete */}
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="shrink-0 p-1 text-slate-200 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Observation field */}
                          <div className="pl-9 space-y-2">
                            <div className="flex items-center gap-2">
                              <MessageSquare size={11} className="text-slate-400" />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                Observación
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <textarea
                                rows={2}
                                placeholder="Ej: Faltó conectar el webhook, retomamos mañana..."
                                className="flex-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 rounded-xl p-3 resize-none outline-none focus:border-[var(--accent)] transition-all placeholder:text-slate-300"
                                value={obsVal}
                                onChange={(e) =>
                                  setObsEdits((prev) => ({ ...prev, [task.id]: e.target.value }))
                                }
                              />
                              {isDirty && (
                                <button
                                  onClick={() => saveObs(task.id)}
                                  disabled={savingObs === task.id}
                                  className="shrink-0 self-end px-3 py-3 bg-[var(--accent)] text-white rounded-xl active:scale-95 transition-all disabled:opacity-50"
                                >
                                  {savingObs === task.id ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Save size={14} />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Add new task */}
                    {addingTask[svc.id] !== undefined ? (
                      <div className="flex gap-2 pt-1">
                        <input
                          autoFocus
                          placeholder="Nombre de la nueva tarea..."
                          className="flex-1 text-sm font-bold text-[var(--primary)] bg-white border border-[var(--accent)] rounded-xl px-4 py-3 outline-none placeholder:text-slate-300"
                          value={newTaskText[svc.id] ?? ""}
                          onChange={(e) =>
                            setNewTaskText((prev) => ({ ...prev, [svc.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") addTask(svc.id, svc.name);
                            if (e.key === "Escape")
                              setAddingTask((prev) => { const n = {...prev}; delete n[svc.id]; return n; });
                          }}
                        />
                        <button
                          onClick={() => addTask(svc.id, svc.name)}
                          className="shrink-0 px-4 py-3 bg-[var(--accent)] text-white rounded-xl font-black text-xs active:scale-95 transition-all"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setAddingTask((prev) => { const n = {...prev}; delete n[svc.id]; return n; })
                          }
                          className="shrink-0 px-3 py-3 bg-slate-100 text-slate-500 rounded-xl font-black text-xs active:scale-95 transition-all"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setAddingTask((prev) => ({ ...prev, [svc.id]: "" }))
                        }
                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black text-slate-400 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                      >
                        <Plus size={14} /> Agregar tarea
                      </button>
                    )}

                    {/* Tip */}
                    <div className="flex items-start gap-2 pt-1">
                      <AlertCircle size={12} className="text-slate-300 mt-0.5 shrink-0" />
                      <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                        Toca el nombre de una tarea para editarlo · Toca el ícono para cambiar el estado
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Filtros de Mensajes */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar px-1">
          {[
            { id: 'todas', label: 'Todas', icon: MessageSquare },
            { id: 'redes', label: 'Redes Sociales', icon: Share2 },
            { id: 'tips', label: 'Tips y Recordatorios', icon: Lightbulb }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setMsgFilter(f.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                msgFilter === f.id 
                  ? 'bg-[#142d53] text-[#48c1d2] border-[#142d53] shadow-md' 
                  : 'bg-white text-slate-400 border-slate-100'
              }`}
            >
              <f.icon size={12} />
              {f.label}
            </button>
          ))}
        </div>

        {(() => {
          const filtered = notificaciones.filter(n => {
            if (msgFilter === 'todas') return true;
            const type = n.tipo?.toUpperCase() || '';
            if (msgFilter === 'redes') return type.includes('REDES') || type.includes('PUBLICACIÓN') || type.includes('SOCIAL');
            if (msgFilter === 'tips') return type.includes('TIP') || type.includes('RECORDATORIO') || type.includes('IDEA');
            return true;
          });

          return filtered.length > 0 ? (
            filtered.map((announcement) => (
              <div key={announcement.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm border-l-4 border-l-[#48c1d2] relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black uppercase tracking-[0.15em] px-2 py-1 rounded bg-[#48c1d2]/10 text-[#142d53]">
                      {announcement.tipo}
                    </span>
                    {(announcement.tipo?.toUpperCase().includes('REDES') || announcement.tipo?.toUpperCase().includes('PUBLICACIÓN')) && <Share2 size={12} className="text-[#48c1d2]" />}
                    {(announcement.tipo?.toUpperCase().includes('TIP') || announcement.tipo?.toUpperCase().includes('RECORDATORIO')) && <Lightbulb size={12} className="text-amber-400" />}
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{formatDate(announcement.fecha)}</span>
                </div>
                <h3 className="font-black text-[#142d53] mb-2 text-sm">
                  {announcement.titulo}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {announcement.mensaje}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-slate-50/50 text-center py-12 rounded-[2.5rem] border-2 border-dashed border-slate-100">
               <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Bell size={24} className="text-slate-300" />
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                 {msgFilter === 'todas' ? 'Sin avisos recientes por ahora.' : `No hay ${msgFilter === 'redes' ? 'publicaciones' : 'tips'} registrados.`}
               </p>
            </div>
          );
        })()}
      </div>
    )}
  </div>
</div>
);
}
