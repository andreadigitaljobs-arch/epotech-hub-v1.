export interface Proyecto {
  id: string;
  nombre: string;
  descripcion: string;
  progreso: number;
  status: "received" | "production" | "delivered";
  icon: string;
  pipeline: {
    nombre: string;
    completado: boolean;
  }[];
  detalles: {
    recibido: string[];
    entregado: string[];
  };
}

export const proyectos: Proyecto[] = [
  {
    id: "landing-page",
    nombre: "Landing Page de Conversión",
    descripcion: "Nueva página web optimizada para convertir prospectos en clientes de manera rápida y moderna.",
    progreso: 45,
    status: "production",
    icon: "globe",
    pipeline: [
      { nombre: "Análisis de referencias y estructura", completado: true },
      { nombre: "Diseño visual y copywriting (Inglés)", completado: true },
      { nombre: "Desarrollo técnico y optimización SEO", completado: false },
      { nombre: "Publicación y conexión con ads", completado: false },
    ],
    detalles: {
      recibido: [
        "Acceso a dominios viejos",
        "Fotos de trabajos realizados",
        "Lista de servicios básicos y premium"
      ],
      entregado: [
        "Estructura de navegación definida",
        "Diseño de la sección de contacto inteligente"
      ]
    }
  },
  {
    id: "crm-gestion",
    nombre: "CRM de Gestión Epotech",
    descripcion: "Sistema interno para llevar el control de cada cliente que entra y el estado de sus cotizaciones.",
    progreso: 20,
    status: "production",
    icon: "users",
    pipeline: [
      { nombre: "Definición de campos necesarios", completado: true },
      { nombre: "Estructura de Base de Datos", completado: false },
      { nombre: "Interfaz de gestión de prospectos", completado: false },
      { nombre: "Automatización de notificaciones", completado: false },
    ],
    detalles: {
      recibido: [
        "Feedback sobre flujo de ventas actual",
        "Lista de datos que se piden al cliente"
      ],
      entregado: [
        "Esquema inicial de la base de datos",
        "Prototipo del formulario inteligente"
      ]
    }
  },
  {
    id: "hub-app",
    nombre: "Epotech Hub (Esta App)",
    descripcion: "Aplicación de seguimiento y control para que el cliente vea nuestro progreso en tiempo real.",
    progreso: 85,
    status: "production",
    icon: "zap",
    pipeline: [
      { nombre: "Desarrollo de dashboard principal", completado: true },
      { nombre: "Historial de actividad diario", completado: true },
      { nombre: "Sección de estrategia de marca", completado: true },
      { nombre: "Módulo de seguimiento de proyectos", completado: true },
      { nombre: "Pulido visual y modo offline", completado: false },
    ],
    detalles: {
      recibido: [
        "Brand Brief oficial",
        "PIN de seguridad equipo",
        "Videos y fotos de avance"
      ],
      entregado: [
        "App desplegada en Vercel",
        "Estrategia de marca integrada",
        "Dashboard con métricas reales"
      ]
    }
  }
];
