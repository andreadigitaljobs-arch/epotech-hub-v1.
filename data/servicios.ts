import { 
  Database, 
  Smartphone, 
  Layout, 
  FormInput, 
  Share2, 
  TrendingUp, 
  Lightbulb, 
  Video,
  Sparkles,
  Zap,
  Target
} from "lucide-react";

export const infrastructureServices = [
  {
    id: "crm",
    name: "CRM & Automatización",
    description: "Gestión de leads y seguimiento automático de clientes.",
    progress: 45,
    status: "active",
    icon: Database,
    color: "blue",
    achievements: [
      "Estructura de Pipeline configurada",
      "Automatización de bienvenida activa",
      "Sincronización con base de datos"
    ]
  },
  {
    id: "app",
    name: "Aplicación de Marca",
    description: "Desarrollo de la plataforma central para el Hub.",
    progress: 85,
    status: "active",
    icon: Smartphone,
    color: "indigo",
    achievements: [
      "Diseño de interfaz 100% terminado",
      "Sistema de notificaciones push activo",
      "Visualización de métricas vinculada"
    ]
  },
  {
    id: "forms",
    name: "Formulario Inteligente",
    description: "Captura de datos optimizada para nuevos clientes.",
    progress: 95,
    status: "success",
    icon: FormInput,
    color: "emerald",
    achievements: [
      "Pruebas de conversión superadas",
      "Validación de campos en tiempo real",
      "Ready para tráfico masivo"
    ]
  },
  {
    id: "landing",
    name: "Landing Page Master",
    description: "Página de aterrizaje de alta conversión.",
    progress: 15,
    status: "active",
    icon: Layout,
    color: "purple",
    achievements: [
      "Wireframe estratégico aprobado",
      "Copywriting centrado en beneficios",
      "Estructura técnica iniciada"
    ]
  }
];

export const socialMediaStrategy = {
  name: "Gestión de Redes Sociales",
  description: "Estrategia de crecimiento orgánico y pago.",
  status: "active",
  progress: 40,
  observations: "Estamos detectando que los videos con sonido ambiente original (ASMR) tienen un 40% más de retención que los que llevan música genérica. El plan para la próxima semana es duplicar este tipo de contenido.",
  results: [
    "+12.5% Seguidores nuevos esta semana",
    "3.2k Reproducciones promedio por Reel",
    "Alta tasa de guardados en 'Tips de mantenimiento'"
  ],
  monthlyIdeas: [
    { id: 1, text: "Video: La diferencia entre flake y metálico (Comparativa)", type: "Educativo", icon: Lightbulb },
    { id: 2, text: "Reel: Proceso de preparación de superficie (ASMR)", type: "Satisfactorio", icon: Sparkles },
    { id: 3, text: "Story: Preguntas y respuestas sobre durabilidad", type: "Engagement", icon: Share2 },
    { id: 4, text: "Video Humano: Por qué elegir Epotech vs. Pintura normal", type: "Autoridad", icon: Target }
  ],
  activeSeries: [
    { id: 1, name: "Transformaciones Reales", status: "En curso", count: "3/5" },
    { id: 2, name: "Mitos de la Epóxica", status: "Planeado", count: "0/4" },
    { id: 3, name: "Detalles que Venden", status: "En curso", count: "2/6" }
  ]
};
