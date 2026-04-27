"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  CheckCircle2, Circle, Clock, ChevronDown, ChevronUp,
  Database, Smartphone, Layout, FormInput, Rocket,
  MessageSquare, Save, AlertCircle, Trash2, Plus, Pencil,
  TrendingUp, Search
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
    id: "app",
    name: "App de Seguimiento",
    description: "La plataforma que Sebastián usa para grabar, publicar y seguir su progreso.",
    Icon: Smartphone,
    color: "indigo",
  },

  {
    id: "landing",
    name: "Landing Page",
    description: "Página de aterrizaje de alta conversión para Epotech Solutions.",
    Icon: Layout,
    color: "purple",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    description: "Campañas de publicidad pagada para captar clientes que ya están buscando el servicio.",
    Icon: TrendingUp,
    color: "orange",
  },
  {
    id: "seo",
    name: "Posicionamiento SEO",
    description: "Optimización para que Epotech Solutions aparezca primero en Google de forma orgánica.",
    Icon: Search,
    color: "teal",
  },
];

// ─── Initial tasks per service (seeded once if table is empty) ───────────────
const INITIAL_TASKS: Record<string, { tarea: string; orden: number }[]> = {
  crm: [
    { tarea: "Configurar pipeline de clientes potenciales", orden: 1 },
    { tarea: "Activar automatización de correos de seguimiento", orden: 2 },
    { tarea: "Integrar formulario de captura con CRM", orden: 3 },
    { tarea: "Configurar etiquetas y categorías de clientes", orden: 4 },
    { tarea: "Pruebas finales y entrega al cliente", orden: 5 },
  ],
  app: [
    { tarea: "Diseño de interfaz aprobado", orden: 1 },
    { tarea: "Sistema de notificaciones push activo", orden: 2 },
    { tarea: "Sección de contenido y grabación lista", orden: 3 },
    { tarea: "Panel de administrador (master) completo", orden: 4 },
    { tarea: "Historial de publicaciones conectado", orden: 5 },
    { tarea: "Deploy final en producción", orden: 6 },
  ],

  landing: [
    { tarea: "Wireframe estratégico aprobado", orden: 1 },
    { tarea: "Copywriting de la página redactado", orden: 2 },
    { tarea: "Diseño visual completado", orden: 3 },
    { tarea: "Integración con formulario de contacto", orden: 4 },
    { tarea: "SEO básico configurado", orden: 5 },
    { tarea: "Deploy y pruebas finales", orden: 6 },
  ],
  "google-ads": [
    { tarea: "Definir presupuesto mensual de la campaña", orden: 1 },
    { tarea: "Investigación de palabras clave (pressure washing Utah)", orden: 2 },
    { tarea: "Redactar anuncios de texto (3 variantes)", orden: 3 },
    { tarea: "Configurar segmentación geográfica por zonas de Utah", orden: 4 },
    { tarea: "Conectar campaña con formulario de captura", orden: 5 },
    { tarea: "Lanzar campaña y monitorear primeras 48 hrs", orden: 6 },
    { tarea: "Primer reporte de resultados entregado", orden: 7 },
  ],
  seo: [
    { tarea: "Auditoría SEO inicial del sitio web actual", orden: 1 },
    { tarea: "Investigación de palabras clave orgánicas locales", orden: 2 },
    { tarea: "Optimización de títulos, meta descripciones y H1", orden: 3 },
    { tarea: "Perfil de Google Business Profile optimizado", orden: 4 },
    { tarea: "Creación de páginas de servicio por zona (Salt Lake, Provo...)", orden: 5 },
    { tarea: "Estrategia de backlinks locales activada", orden: 6 },
    { tarea: "Primer reporte de posicionamiento entregado", orden: 7 },
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

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ProyectosPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [obsEdits, setObsEdits] = useState<Record<string, string>>({});
  const [savingObs, setSavingObs] = useState<string | null>(null);
  const [nameEdits, setNameEdits] = useState<Record<string, string>>({});
  const [editingName, setEditingName] = useState<string | null>(null);
  const [addingTask, setAddingTask] = useState<Record<string, string>>({});
  const [newTaskText, setNewTaskText] = useState<Record<string, string>>({});

  // ── Fetch & seed ──────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from("tareas_servicio")
      .select("*")
      .order("orden", { ascending: true });

    if (error) { console.error(error); setLoading(false); return; }

    const existing = data || [];

    // Seed per-service: if a service has no rows, insert its initial tasks
    const rowsToInsert: any[] = [];
    for (const svc of SERVICES) {
      const hasTasks = existing.some((t) => t.service_id === svc.id);
      if (!hasTasks && INITIAL_TASKS[svc.id]) {
        INITIAL_TASKS[svc.id].forEach((t) =>
          rowsToInsert.push({
            service_id: svc.id,
            service_name: svc.name,
            tarea: t.tarea,
            completada: false,
            status: "pendiente",
            observacion: null,
            orden: t.orden,
          })
        );
      }
    }

    if (rowsToInsert.length > 0) {
      await supabase.from("tareas_servicio").insert(rowsToInsert);
      const { data: refreshed } = await supabase
        .from("tareas_servicio")
        .select("*")
        .order("orden", { ascending: true });
      setTasks(refreshed || []);
    } else {
      setTasks(existing);
    }

    setLoading(false);
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

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
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="bg-[var(--accent)] p-2 rounded-xl shadow-lg">
            <Rocket size={18} className="text-white" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent)]">
            Progreso de proyectos
          </span>
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-[var(--primary)] mb-4">
          Servicios Activos
        </h1>
        <div className="bg-white/50 border border-slate-200 p-4 rounded-[2rem]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-relaxed">
            Aquí puedes ver exactamente en qué estamos trabajando para ti, qué tan avanzado está cada proyecto y qué hemos logrado hasta ahora. Tócale a cualquier servicio para ver el detalle.
          </p>
        </div>
      </header>

      {/* Service cards */}
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
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-base font-black text-[var(--primary)] tracking-tight">
                      {svc.name}
                    </h2>
                    <span className="text-[10px] font-black text-[var(--accent)] ml-3 shrink-0">
                      {done}/{svcTasks.length} listas
                    </span>
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
    </div>
  );
}
