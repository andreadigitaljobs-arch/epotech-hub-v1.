// Data layer for Sebastián's account — update this file to reflect changes
export const client = {
  name: "Sebastián",
  businessName: "Epotech Solutions",
  greeting: "Hola, Sebastián 👋🏻",
  tagline: "Tu sistema de contenido está funcionando.",
};

export const announcements = [
  {
    id: 1,
    date: "14 Abr 2025",
    title: "¡Bienvenido a tu portal de marca!",
    body: "Este es tu espacio para seguir todo lo que hacemos juntos. Aquí encontrarás tu estrategia, tus servicios activos, el manual de grabación y mucho más. Revísalo cuando quieras y consúltanos cualquier duda.",
    tag: "Inicio",
    tagColor: "accent",
  },
  {
    id: 2,
    date: "14 Abr 2025",
    title: "Semana 1 — Sistema de contenido activado",
    body: "Ya tienes tu checklist semanal lista. Esta semana el objetivo es grabar el paquete base: 7 videos, 10 clips, 5 fotos y 1 nota de voz. Revisa la sección de Manual para saber exactamente qué grabar.",
    tag: "Contenido",
    tagColor: "primary",
  },
];

export const services = [
  {
    id: 1,
    name: "Sistema de Contenido",
    nameEn: "Content System",
    description: "Estrategia, checklist y flujo semanal de grabación",
    status: "active" as const,
    progress: 35,
    nextDelivery: "18 Abr 2025",
    icon: "video",
  },
  {
    id: 2,
    name: "Gestión de Redes Sociales",
    nameEn: "Social Media Management",
    description: "Publicación y optimización de contenido en TikTok e Instagram",
    status: "active" as const,
    progress: 20,
    nextDelivery: "21 Abr 2025",
    icon: "share",
  },
  {
    id: 3,
    name: "Estrategia de Marca",
    nameEn: "Brand Strategy",
    description: "Posicionamiento, mensajes clave y dirección visual",
    status: "active" as const,
    progress: 60,
    nextDelivery: "Completada fase 1",
    icon: "target",
  },
  {
    id: 4,
    name: "Edición de Videos",
    nameEn: "Video Editing",
    description: "Edición de Reels y TikToks con el material que grabas",
    status: "pending" as const,
    progress: 0,
    nextDelivery: "Pendiente de material",
    icon: "scissors",
  },
];

export const weeklyStats = {
  publicaciones: 0,
  publicacionesTarget: 5,
  reels: 0,
  reelsTarget: 3,
  carruseles: 0,
  carruselesTarget: 2,
  weekLabel: "Semana del 14 — 18 Abr",
};

