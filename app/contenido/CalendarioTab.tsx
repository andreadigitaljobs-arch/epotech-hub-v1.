"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@supabase/supabase-js";
import {
  Plus, ChevronLeft, ChevronRight, X, Check, ExternalLink,
  Clock, Edit2, Trash2, Eye, Heart, Users, Link2,
  Camera, Video, Smartphone, BookOpen, AlertCircle, Copy,
  CalendarDays, List, ChevronDown
} from "lucide-react";
import { PILARES_INFO, type PilarContenido } from "@/data/scripts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Pilar = PilarContenido;
type Estado = "En edición" | "Listo para publicar" | "Publicado";
type Formato = "Reel" | "Carrusel" | "Historia" | "Foto";
type Red = "Instagram" | "TikTok" | "YouTube Shorts";

interface Publicacion {
  id: string;
  fecha_publicacion: string;
  pilar: Pilar;
  estado: Estado;
  copy_caption: string;
  enlace_publicacion?: string;
  redes: Red[];
  formato: Formato;
  metricas_views?: number;
  metricas_likes?: number;
  metricas_alcance?: number;
  notas_produccion?: string;
  checklist_grabado: boolean;
  checklist_editado: boolean;
  checklist_caption: boolean;
  checklist_publicado: boolean;
  created_at: string;
}

const PILLAR_CONFIG: Record<Pilar, { color: string; bg: string; dot: string }> = {
  "Transformaciones": { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", dot: "bg-emerald-400" },
  "Errores":          { color: "text-rose-400",    bg: "bg-rose-500/10 border-rose-500/20",       dot: "bg-rose-400" },
  "Herramientas":     { color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20",       dot: "bg-blue-400" },
  "Proceso":          { color: "text-violet-400",  bg: "bg-violet-500/10 border-violet-500/20",   dot: "bg-violet-400" },
  "Experiencia":      { color: "text-amber-400",   bg: "bg-amber-500/10 border-amber-500/20",     dot: "bg-amber-400" },
};

const ESTADO_CONFIG: Record<Estado, { color: string; bg: string }> = {
  "En edición":          { color: "text-amber-400",   bg: "bg-amber-500/10" },
  "Listo para publicar": { color: "text-[#48c1d2]",   bg: "bg-[#48c1d2]/10" },
  "Publicado":           { color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

const REDES_ICONS: Record<Red, React.ReactNode> = {
  "Instagram":     <Camera size={12} />,
  "TikTok":        <Smartphone size={12} />,
  "YouTube Shorts":<Video size={12} />,
};

const DAYS_ES   = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DAYS_SHORT = ["L", "M", "X", "J", "V", "S", "D"];
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function getMonthGridStart(monthStart: Date): Date {
  const d = new Date(monthStart.getFullYear(), monthStart.getMonth(), 1);
  const dow = d.getDay();
  const offset = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + offset);
  return d;
}

function formatDateRange(monday: Date): string {
  const sunday = addDays(monday, 6);
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()} – ${sunday.getDate()} ${MONTHS_ES[monday.getMonth()]} ${monday.getFullYear()}`;
  }
  return `${monday.getDate()} ${MONTHS_ES[monday.getMonth()]} – ${sunday.getDate()} ${MONTHS_ES[sunday.getMonth()]} ${sunday.getFullYear()}`;
}

const EMPTY_FORM: Omit<Publicacion, "id" | "created_at"> = {
  fecha_publicacion: new Date().toISOString().slice(0, 16),
  pilar: "Transformaciones",
  estado: "En edición",
  copy_caption: "",
  enlace_publicacion: "",
  redes: ["Instagram"],
  formato: "Reel",
  metricas_views: undefined,
  metricas_likes: undefined,
  metricas_alcance: undefined,
  notas_produccion: "",
  checklist_grabado: false,
  checklist_editado: false,
  checklist_caption: false,
  checklist_publicado: false,
};

export default function CalendarioTab({ showToast }: { showToast: (msg: string, type?: "success" | "error" | "info") => void }) {
  const [posts, setPosts] = useState<Publicacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [tableError, setTableError] = useState(false);
  const [weekStart, setWeekStart] = useState(() => getMonday(new Date()));
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0); return today;
  });
  const [dayKey, setDayKey] = useState(0);

  const [pilaresOpen, setPilaresOpen] = useState(false);

  // Vista semana / mes
  const [calView, setCalView] = useState<"week" | "month">("week");
  const [monthStart, setMonthStart] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Modal agregar/editar
  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const modalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openModal = () => {
    if (modalTimer.current) clearTimeout(modalTimer.current);
    setModalOpen(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setModalVisible(true)));
  };

  const closeModal = () => {
    setModalVisible(false);
    modalTimer.current = setTimeout(() => setModalOpen(false), 280);
  };

  const [editing, setEditing] = useState<Publicacion | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  // Métricas
  const [metricsId, setMetricsId]   = useState<string | null>(null);
  const [metricsVis, setMetricsVis] = useState<string | null>(null);
  const metricsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [metricsForm, setMetricsForm] = useState({ views: "", likes: "", alcance: "" });

  const openMetrics = (id: string, post: Publicacion) => {
    if (metricsTimer.current) clearTimeout(metricsTimer.current);
    setMetricsId(id);
    setMetricsForm({ views: String(post.metricas_views || ""), likes: String(post.metricas_likes || ""), alcance: String(post.metricas_alcance || "") });
    requestAnimationFrame(() => requestAnimationFrame(() => setMetricsVis(id)));
  };

  const closeMetrics = () => {
    setMetricsVis(null);
    metricsTimer.current = setTimeout(() => setMetricsId(null), 240);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let from: string, to: string;
    if (calView === "month") {
      const gridStart = getMonthGridStart(monthStart);
      from = gridStart.toISOString();
      to = addDays(gridStart, 42).toISOString();
    } else {
      from = weekStart.toISOString();
      to = addDays(weekStart, 7).toISOString();
    }
    const { data, error } = await supabase
      .from("calendario_publicaciones")
      .select("*")
      .gte("fecha_publicacion", from)
      .lt("fecha_publicacion", to)
      .order("fecha_publicacion", { ascending: true });

    if (error) {
      if (error.code === "PGRST205" || error.message?.includes("does not exist") || error.message?.includes("schema cache")) {
        setTableError(true);
      }
      setLoading(false);
      return;
    }
    setPosts(data || []);
    setLoading(false);
  }, [weekStart, monthStart, calView]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const postsForDay = (day: Date) =>
    posts.filter(p => isSameDay(new Date(p.fecha_publicacion), day));

  const openAdd = (day?: Date) => {
    const base = day ? new Date(day) : new Date(selectedDay);
    base.setHours(12, 0, 0, 0);
    setEditing(null);
    setForm({ ...EMPTY_FORM, fecha_publicacion: base.toISOString().slice(0, 16) });
    openModal();
  };

  const openEdit = (post: Publicacion) => {
    setEditing(post);
    setForm({
      fecha_publicacion: post.fecha_publicacion.slice(0, 16),
      pilar: post.pilar,
      estado: post.estado,
      copy_caption: post.copy_caption,
      enlace_publicacion: post.enlace_publicacion || "",
      redes: post.redes || ["Instagram"],
      formato: post.formato,
      metricas_views: post.metricas_views,
      metricas_likes: post.metricas_likes,
      metricas_alcance: post.metricas_alcance,
      notas_produccion: post.notas_produccion || "",
      checklist_grabado: post.checklist_grabado,
      checklist_editado: post.checklist_editado,
      checklist_caption: post.checklist_caption,
      checklist_publicado: post.checklist_publicado,
    });
    openModal();
  };

  const duplicatePost = (post: Publicacion) => {
    const base = new Date(selectedDay);
    base.setHours(12, 0, 0, 0);
    setEditing(null);
    setForm({
      fecha_publicacion: base.toISOString().slice(0, 16),
      pilar: post.pilar,
      estado: "En edición",
      copy_caption: post.copy_caption,
      enlace_publicacion: "",
      redes: post.redes,
      formato: post.formato,
      metricas_views: undefined,
      metricas_likes: undefined,
      metricas_alcance: undefined,
      notas_produccion: post.notas_produccion || "",
      checklist_grabado: false,
      checklist_editado: false,
      checklist_caption: false,
      checklist_publicado: false,
    });
    openModal();
  };

  const savePost = async () => {
    if (!form.copy_caption.trim()) { showToast("El caption no puede estar vacío", "error"); return; }
    setSaving(true);
    const payload = {
      ...form,
      redes: form.redes,
      metricas_views: form.metricas_views || null,
      metricas_likes: form.metricas_likes || null,
      metricas_alcance: form.metricas_alcance || null,
      notas_produccion: form.notas_produccion || null,
      enlace_publicacion: form.enlace_publicacion || null,
    };
    const { error } = editing
      ? await supabase.from("calendario_publicaciones").update(payload).eq("id", editing.id)
      : await supabase.from("calendario_publicaciones").insert(payload);

    if (error) { showToast("Error al guardar", "error"); setSaving(false); return; }
    showToast(editing ? "Publicación actualizada" : "Publicación agregada", "success");
    setSaving(false);
    closeModal();
    fetchPosts();
  };

  const deletePost = async (id: string) => {
    const { error } = await supabase.from("calendario_publicaciones").delete().eq("id", id);
    if (error) { showToast("Error al eliminar", "error"); return; }
    showToast("Publicación eliminada", "info");
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const saveMetrics = async (id: string) => {
    const { error } = await supabase.from("calendario_publicaciones").update({
      metricas_views: Number(metricsForm.views) || null,
      metricas_likes: Number(metricsForm.likes) || null,
      metricas_alcance: Number(metricsForm.alcance) || null,
    }).eq("id", id);
    if (error) { showToast("Error al guardar métricas", "error"); return; }
    showToast("Métricas guardadas", "success");
    closeMetrics();
    fetchPosts();
  };

  const toggleRed = (red: Red) => {
    setForm(f => ({
      ...f,
      redes: f.redes.includes(red) ? f.redes.filter(r => r !== red) : [...f.redes, red],
    }));
  };

  const toggleChecklist = (field: keyof typeof EMPTY_FORM) => {
    setForm(f => ({ ...f, [field]: !f[field as keyof typeof f] }));
  };

  const summary = {
    total: posts.length,
    publicados: posts.filter(p => p.estado === "Publicado").length,
    listos: posts.filter(p => p.estado === "Listo para publicar").length,
    edicion: posts.filter(p => p.estado === "En edición").length,
  };

  const handleDaySelect = (day: Date) => {
    setSelectedDay(day);
    setWeekStart(getMonday(day));
    setDayKey(k => k + 1);
  };

  // Mes: grid de 6 semanas × 7 días
  const monthGridStart = getMonthGridStart(monthStart);
  const monthGridDays  = Array.from({ length: 42 }, (_, i) => addDays(monthGridStart, i));

  if (tableError) {
    return (
      <div className="p-6 space-y-4 cal-fade-in-up">
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-center space-y-3">
          <AlertCircle className="mx-auto text-amber-500" size={32} />
          <p className="font-black text-amber-800 text-sm uppercase tracking-wider">Tabla no encontrada</p>
          <p className="text-amber-700 text-xs leading-relaxed">Crea la tabla en Supabase antes de usar el calendario.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">

      {/* PILARES DE CONTENIDO — acordeón */}
      <div className="px-4 pt-4">
        <button
          onClick={() => setPilaresOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#0a192f] rounded-2xl text-left transition-all active:scale-[0.99]"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-[#48c1d2] uppercase tracking-widest">5 Pilares de contenido</span>
          </div>
          <ChevronDown size={14} className={`text-[#48c1d2] transition-transform duration-300 ${pilaresOpen ? "rotate-180" : ""}`} />
        </button>
        {pilaresOpen && (
          <div className="mt-2 space-y-2 cal-fade-in-up">
            {(Object.entries(PILARES_INFO) as [PilarContenido, typeof PILARES_INFO[PilarContenido]][]).map(([key, info]) => {
              const pc = PILLAR_CONFIG[key];
              return (
                <div key={key} className={`px-4 py-3 rounded-2xl border ${pc.bg}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-base leading-none">{info.emoji}</span>
                    <span className={`text-[11px] font-black uppercase tracking-wider ${pc.color}`}>{key}</span>
                    <span className="text-[10px] text-slate-500 font-medium ml-1">— {info.descripcion}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-6">
                    {info.ejemplos.map(ej => (
                      <span key={ej} className="text-[9px] font-semibold text-slate-500 bg-white/60 rounded-full px-2 py-0.5 border border-slate-200">{ej}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RESUMEN */}
      <div className="px-4 pt-4 pb-2">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: calView === "week" ? "Esta semana" : "Este mes", value: summary.total,      color: "text-slate-700",  bg: "bg-slate-100" },
            { label: "Publicados",  value: summary.publicados, color: "text-emerald-700", bg: "bg-emerald-50" },
            { label: "Listos",      value: summary.listos,     color: "text-[#0e7490]",  bg: "bg-[#e0f7fa]" },
            { label: "Edición",     value: summary.edicion,    color: "text-amber-700",  bg: "bg-amber-50" },
          ].map((s, i) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center cal-fade-in-up`}
              style={{ animationDelay: `${i * 55}ms` }}>
              <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
              <div className={`text-[9px] font-black uppercase tracking-wider ${s.color} opacity-70 leading-tight mt-0.5`}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TOGGLE VISTA + NAV */}
      <div className="px-4 py-3 flex items-center justify-between cal-fade-in" style={{ animationDelay: "80ms" }}>
        {/* Nav previo/siguiente */}
        <button
          onClick={() => calView === "week"
            ? setWeekStart(d => addDays(d, -7))
            : setMonthStart(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
          }
          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center active:scale-95 transition-all">
          <ChevronLeft size={16} className="text-slate-500" />
        </button>

        <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
          {calView === "week"
            ? formatDateRange(weekStart)
            : `${MONTHS_ES[monthStart.getMonth()]} ${monthStart.getFullYear()}`
          }
        </span>

        <button
          onClick={() => calView === "week"
            ? setWeekStart(d => addDays(d, 7))
            : setMonthStart(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))
          }
          className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center active:scale-95 transition-all">
          <ChevronRight size={16} className="text-slate-500" />
        </button>
      </div>

      {/* TOGGLE SEMANA / MES */}
      <div className="px-4 pb-3 flex justify-center">
        <div className="flex bg-slate-100 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setCalView("week")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${calView === "week" ? "bg-white text-[#142d53] shadow-sm" : "text-slate-400"}`}>
            <List size={11} /> Semana
          </button>
          <button
            onClick={() => setCalView("month")}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${calView === "month" ? "bg-white text-[#142d53] shadow-sm" : "text-slate-400"}`}>
            <CalendarDays size={11} /> Mes
          </button>
        </div>
      </div>

      {calView === "week" ? (
        /* ── VISTA SEMANA ── */
        <div className="grid grid-cols-7 px-4 pb-3">
          {weekDays.map((day, i) => {
            const dayPosts = postsForDay(day);
            const isSelected = isSameDay(day, selectedDay);
            const isToday = isSameDay(day, new Date());
            return (
              <button key={i} onClick={() => handleDaySelect(day)}
                className={`cal-chip-in flex flex-col items-center gap-1 py-2 rounded-2xl transition-all active:scale-95 ${isSelected ? "bg-[#0a192f]" : isToday ? "bg-slate-100" : "bg-transparent"}`}
                style={{ animationDelay: `${120 + i * 40}ms` }}
              >
                <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? "text-[#48c1d2]" : "text-slate-400"}`}>{DAYS_ES[(i + 1) % 7]}</span>
                <span className={`text-sm font-black ${isSelected ? "text-white" : isToday ? "text-[#0a192f]" : "text-slate-500"}`}>{day.getDate()}</span>
                {/* Contador o puntos */}
                {dayPosts.length > 0 ? (
                  <span className={`text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center ${isSelected ? "bg-[#48c1d2] text-[#0a192f]" : "bg-slate-200 text-slate-500"}`}>
                    {dayPosts.length}
                  </span>
                ) : (
                  <div className="w-4 h-4" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* ── VISTA MES ── */
        <div className="px-4 pb-3 cal-fade-in-up">
          {/* Cabeceras días */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_SHORT.map(d => (
              <div key={d} className="text-center text-[9px] font-black text-slate-400 uppercase tracking-wider py-1">{d}</div>
            ))}
          </div>
          {/* Celdas */}
          <div className="grid grid-cols-7 gap-y-1">
            {monthGridDays.map((day, i) => {
              const dayPosts = postsForDay(day);
              const isSelected = isSameDay(day, selectedDay);
              const isToday   = isSameDay(day, new Date());
              const inMonth   = day.getMonth() === monthStart.getMonth();
              return (
                <button key={i} onClick={() => handleDaySelect(day)}
                  className={`flex flex-col items-center py-1.5 rounded-xl transition-all active:scale-95 relative ${isSelected ? "bg-[#0a192f]" : isToday ? "bg-slate-100" : "bg-transparent"}`}
                >
                  <span className={`text-[11px] font-black leading-none ${isSelected ? "text-white" : isToday ? "text-[#0a192f]" : inMonth ? "text-slate-600" : "text-slate-300"}`}>
                    {day.getDate()}
                  </span>
                  <div className="flex gap-0.5 mt-1 min-h-[6px]">
                    {dayPosts.slice(0, 3).map((p, j) => (
                      <div key={j} className={`w-1 h-1 rounded-full ${PILLAR_CONFIG[p.pilar].dot} ${!inMonth ? "opacity-40" : ""}`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* POSTS DEL DÍA */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between mb-1 cal-fade-in" style={{ animationDelay: "200ms" }}>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {DAYS_ES[selectedDay.getDay()]} {selectedDay.getDate()} {MONTHS_ES[selectedDay.getMonth()]}
          </span>
          <button onClick={() => openAdd(selectedDay)}
            className="flex items-center gap-1.5 text-[10px] font-black text-[#48c1d2] uppercase tracking-wider px-3 py-1.5 rounded-xl bg-[#48c1d2]/10 active:scale-95 transition-all">
            <Plus size={12} /> Agregar
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400 text-xs cal-fade-in">Cargando...</div>
        ) : postsForDay(selectedDay).length === 0 ? (
          <div key={`empty-${dayKey}`} className="cal-scale-in">
            <div className="rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", border: "1.5px dashed #cbd5e1" }}>
              <div className="px-6 py-10 flex flex-col items-center gap-4 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)" }}>
                  <CalendarDays size={22} className="text-[#48c1d2]" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-700 mb-1">Sin contenido este día</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">Agrega un reel, carrusel o historia<br/>para mantener tu perfil activo</p>
                </div>
                <button onClick={() => openAdd(selectedDay)}
                  className="flex items-center gap-2 text-[11px] font-black text-white uppercase tracking-wider px-5 py-2.5 rounded-2xl active:scale-95 transition-all"
                  style={{ background: "#142d53", boxShadow: "0 4px 14px rgba(20,45,83,0.25)" }}>
                  <Plus size={13} /> Agregar publicación
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div key={`posts-${dayKey}`} className="space-y-3">
            {postsForDay(selectedDay).map((post, idx) => {
              const pc = PILLAR_CONFIG[post.pilar];
              const ec = ESTADO_CONFIG[post.estado];
              const checksDone = [post.checklist_grabado, post.checklist_editado, post.checklist_caption, post.checklist_publicado].filter(Boolean).length;
              const isMetricsOpen = metricsId === post.id;

              return (
                <div key={post.id}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm cal-fade-in-up"
                  style={{ animationDelay: `${idx * 70}ms` }}
                >
                  {/* CABECERA */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${pc.bg} ${pc.color}`}>{post.pilar}</span>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${ec.bg} ${ec.color}`}>{post.estado}</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => duplicatePost(post)} title="Duplicar" className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-all">
                          <Copy size={11} className="text-slate-400" />
                        </button>
                        <button onClick={() => openEdit(post)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center active:scale-95 transition-all">
                          <Edit2 size={12} className="text-slate-500" />
                        </button>
                        <button onClick={() => deletePost(post.id)} className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center active:scale-95 transition-all">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(post.fecha_publicacion).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span>{post.formato}</span>
                      {post.redes?.length > 0 && (
                        <>
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center gap-1">
                            {post.redes.map(r => <span key={r}>{REDES_ICONS[r]}</span>)}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{post.copy_caption}</p>

                    {/* CHECKLIST BARRA */}
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[
                          { done: post.checklist_grabado,   label: "Grab" },
                          { done: post.checklist_editado,   label: "Edit" },
                          { done: post.checklist_caption,   label: "Cap" },
                          { done: post.checklist_publicado, label: "Pub" },
                        ].map((c, i) => (
                          <div key={i} className={`flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-md ${c.done ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                            {c.done ? <Check size={8} /> : <div className="w-2 h-2 rounded-full border border-slate-300" />}
                            {c.label}
                          </div>
                        ))}
                      </div>
                      {/* Barra de progreso */}
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${(checksDone / 4) * 100}%` }} />
                      </div>
                      <span className="text-[9px] text-slate-400">{checksDone}/4</span>
                    </div>

                    {/* ENLACE */}
                    {post.enlace_publicacion ? (
                      <a href={post.enlace_publicacion} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-[10px] font-black text-[#48c1d2] truncate">
                        <ExternalLink size={11} /> Ver reel publicado
                      </a>
                    ) : post.estado === "Publicado" ? (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <Link2 size={11} /> Sin enlace todavía
                      </div>
                    ) : null}
                  </div>

                  {/* MÉTRICAS */}
                  {post.estado === "Publicado" && (
                    <div className="border-t border-slate-50 px-4 py-3">
                      {(post.metricas_views || post.metricas_likes || post.metricas_alcance) ? (
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold"><Eye size={11} className="text-slate-400" />{(post.metricas_views || 0).toLocaleString()}</div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold"><Heart size={11} className="text-pink-400" />{(post.metricas_likes || 0).toLocaleString()}</div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold"><Users size={11} className="text-blue-400" />{(post.metricas_alcance || 0).toLocaleString()}</div>
                          </div>
                          <button onClick={() => openMetrics(post.id, post)}
                            className="text-[9px] font-black text-slate-400 uppercase tracking-wider active:scale-95 transition-all">Editar</button>
                        </div>
                      ) : (
                        <button onClick={() => openMetrics(post.id, post)}
                          className="w-full text-[10px] font-black text-[#48c1d2] uppercase tracking-wider flex items-center justify-center gap-1 py-1 active:scale-95 transition-all">
                          <Plus size={11} /> Agregar métricas
                        </button>
                      )}

                      {isMetricsOpen && (
                        <div className={`mt-3 space-y-2 ${metricsVis === post.id ? "cal-scale-in" : "cal-scale-out"}`}>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { key: "views",   label: "Views",   icon: <Eye size={10}/> },
                              { key: "likes",   label: "Likes",   icon: <Heart size={10}/> },
                              { key: "alcance", label: "Alcance", icon: <Users size={10}/> },
                            ].map(f => (
                              <div key={f.key}>
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">{f.icon}{f.label}</label>
                                <input type="number"
                                  value={metricsForm[f.key as keyof typeof metricsForm]}
                                  onChange={e => setMetricsForm(m => ({ ...m, [f.key]: e.target.value }))}
                                  className="w-full border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-700 text-center focus:outline-none focus:border-[#48c1d2]"
                                  placeholder="0" />
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button onClick={closeMetrics}
                              className="flex-1 py-2 rounded-xl border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-wider active:scale-95 transition-all">Cancelar</button>
                            <button onClick={() => saveMetrics(post.id)}
                              className="flex-1 py-2 rounded-xl bg-[#0a192f] text-[10px] font-black text-[#48c1d2] uppercase tracking-wider active:scale-95 transition-all">Guardar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* NOTAS */}
                  {post.notas_produccion && (
                    <div className="border-t border-slate-50 px-4 py-3">
                      <div className="flex items-start gap-2">
                        <BookOpen size={11} className="text-slate-300 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-slate-400 leading-relaxed">{post.notas_produccion}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL AGREGAR/EDITAR */}
      {modalOpen && typeof window !== "undefined" && createPortal(
        <div
          className={`fixed inset-0 z-[99999] flex items-end sm:items-center justify-center ${modalVisible ? "cal-fade-in" : "cal-fade-out"}`}
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div
            className={`w-full sm:max-w-lg flex flex-col shadow-2xl border border-white/10 ${modalVisible ? "cal-slide-up" : "cal-slide-down"}`}
            style={{
              background: "#0a192f",
              borderRadius: "28px 28px 0 0",
              maxHeight: "92dvh",
            }}
          >
            {/* HANDLE BAR */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* HEADER MODAL */}
            <div className="flex-shrink-0 px-6 pt-3 pb-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[3px] mb-0.5">Calendario</p>
                <h2 className="text-sm font-black text-white">
                  {editing ? "Editar publicación" : "Nueva publicación"}
                </h2>
              </div>
              <button onClick={closeModal}
                className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <X size={16} className="text-white/60" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 pt-5 space-y-5 pb-8">
              {/* FECHA Y HORA */}
              <div>
                <label className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px] mb-2 block">Fecha y hora</label>
                <input type="datetime-local" value={form.fecha_publicacion}
                  onChange={e => setForm(f => ({ ...f, fecha_publicacion: e.target.value }))}
                  className="w-full rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#48c1d2] [color-scheme:dark]"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>

              {/* PILAR */}
              <div>
                <label className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px] mb-2 block">Pilar de contenido</label>
                <div className="grid grid-cols-1 gap-2">
                  {(["Transformaciones", "Errores", "Herramientas", "Proceso", "Experiencia"] as Pilar[]).map(p => {
                    const pc = PILLAR_CONFIG[p];
                    const active = form.pilar === p;
                    const info = PILARES_INFO[p];
                    return (
                      <button key={p} onClick={() => setForm(f => ({ ...f, pilar: p }))}
                        className={`py-2.5 px-4 rounded-2xl text-[11px] font-black uppercase tracking-wider border transition-all active:scale-95 flex items-center gap-2 ${active ? `${pc.bg} ${pc.color} border-current` : "text-white/30"}`}
                        style={!active ? { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" } : {}}>
                        <span>{info.emoji}</span>
                        <span>{p}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ESTADO */}
              <div>
                <label className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px] mb-2 block">Estado</label>
                <div className="flex gap-2">
                  {(["En edición", "Listo para publicar", "Publicado"] as Estado[]).map(e => {
                    const ec = ESTADO_CONFIG[e];
                    const active = form.estado === e;
                    return (
                      <button key={e} onClick={() => setForm(f => ({ ...f, estado: e }))}
                        className={`flex-1 py-2 rounded-2xl text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 ${active ? `${ec.bg} ${ec.color}` : "text-white/30"}`}
                        style={!active ? { background: "rgba(255,255,255,0.05)" } : {}}>
                        {e}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* FORMATO */}
              <div>
                <label className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px] mb-2 block">Formato</label>
                <div className="flex gap-2">
                  {(["Reel", "Carrusel", "Historia", "Foto"] as Formato[]).map(f => (
                    <button key={f} onClick={() => setForm(prev => ({ ...prev, formato: f }))}
                      className={`flex-1 py-2 rounded-2xl text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 ${form.formato === f ? "text-[#48c1d2]" : "text-white/30"}`}
                      style={form.formato === f
                        ? { background: "rgba(72,193,210,0.15)", border: "1px solid rgba(72,193,210,0.3)" }
                        : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* REDES */}
              <div>
                <label className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px] mb-2 block">Redes sociales</label>
                <div className="flex gap-2">
                  {(["Instagram", "TikTok", "YouTube Shorts"] as Red[]).map(r => {
                    const active = form.redes.includes(r);
                    return (
                      <button key={r} onClick={() => toggleRed(r)}
                        className={`flex-1 py-2.5 rounded-2xl text-[9px] font-black uppercase tracking-wider flex flex-col items-center gap-1.5 transition-all active:scale-95 ${active ? "text-[#48c1d2]" : "text-white/30"}`}
                        style={active
                          ? { background: "rgba(72,193,210,0.12)", border: "1px solid rgba(72,193,210,0.25)" }
                          : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        {REDES_ICONS[r]}
                        <span>{r === "YouTube Shorts" ? "YouTube" : r}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* COPY */}
              <div>
                <label className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px] mb-2 block">Copy / Caption</label>
                <textarea value={form.copy_caption}
                  onChange={e => setForm(f => ({ ...f, copy_caption: e.target.value }))}
                  rows={4} placeholder="Escribe el caption del post..."
                  className="w-full rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 leading-relaxed resize-none focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>

              {/* ENLACE */}
              <div>
                <label className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px] mb-2 block">Enlace de publicación</label>
                <input type="url" value={form.enlace_publicacion}
                  onChange={e => setForm(f => ({ ...f, enlace_publicacion: e.target.value }))}
                  placeholder="https://www.instagram.com/reel/..."
                  className="w-full rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>

              {/* NOTAS */}
              <div>
                <label className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px] mb-2 block">Notas de producción</label>
                <textarea value={form.notas_produccion}
                  onChange={e => setForm(f => ({ ...f, notas_produccion: e.target.value }))}
                  rows={2} placeholder="Solo para uso interno del equipo..."
                  className="w-full rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/20 leading-relaxed resize-none focus:outline-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }} />
              </div>

              {/* CHECKLIST */}
              <div>
                <label className="text-[9px] font-black text-[#48c1d2] uppercase tracking-[2px] mb-3 block">Checklist de producción</label>
                <div className="space-y-2">
                  {[
                    { key: "checklist_grabado",   label: "Grabado" },
                    { key: "checklist_editado",   label: "Editado" },
                    { key: "checklist_caption",   label: "Caption listo" },
                    { key: "checklist_publicado", label: "Publicado en redes" },
                  ].map((c) => {
                    const val = form[c.key as keyof typeof form] as boolean;
                    return (
                      <button key={c.key} onClick={() => toggleChecklist(c.key as keyof typeof EMPTY_FORM)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all active:scale-95 text-left"
                        style={val
                          ? { background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)" }
                          : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: val ? "#34d399" : "transparent",
                          border: val ? "none" : "2px solid rgba(255,255,255,0.2)",
                        }}>
                          {val && <Check size={11} className="text-white" />}
                        </div>
                        <span className={`text-xs font-black uppercase tracking-wider ${val ? "text-emerald-400" : "text-white/30"}`}>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BOTÓN GUARDAR */}
              <button onClick={savePost} disabled={saving}
                className="w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all disabled:opacity-50"
                style={{ background: "#48c1d2", color: "#0a192f", boxShadow: "0 8px 24px rgba(72,193,210,0.25)" }}>
                {saving ? "Guardando..." : editing ? "Guardar cambios" : "Agregar publicación"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
