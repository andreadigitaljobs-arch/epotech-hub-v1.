import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface HedyAction {
  table: 'actividad' | 'config_estrategia' | 'referencias_videos' | 'referencias_cuentas' | 'proyectos';
  op: 'INSERT' | 'PATCH' | 'UPDATE';
  data: any;
}

export interface HedyResponse {
  message: string;
  strategic_feedback: string;
  actions: HedyAction[];
}

export async function askHedy(userInput: string, chatHistory: any[]): Promise<HedyResponse> {
  try {
    // 1. Obtener contexto REAL del negocio para evitar duplicados
    const { data: estrategia } = await supabase.from('config_estrategia').select('*').single();
    const { data: proyectos } = await supabase.from('proyectos').select('*');
    const { data: bitacoraReciente } = await supabase.from('actividad').select('*').order('fecha', { ascending: false }).limit(5);

    const today = new Date().toISOString().split('T')[0];

    const contextStr = `
      ESTADO ACTUAL (CONTEXTO):
      - Fecha de hoy: ${today}
      - Proyectos en CRM: ${JSON.stringify(proyectos)}
      - Infraestructura Activa: ${JSON.stringify(estrategia?.hub_infraestructura || [])}
      - Últimos 5 registros en Bitácora: ${JSON.stringify(bitacoraReciente)}
    `;

    const systemPrompt = `
      Eres Hedy, la Socia Estratégica Senior de Epotech Solutions.
      ${contextStr}

      TU MISIÓN: Gestionar el progreso del Hub con precisión quirúrgica.

      REGLAS DE ORO (PARA EVITAR ESTAR "LOCA"):
      1. NO DUPLICADOS: Antes de crear un registro en 'actividad', mira el contexto. Si ya existe un registro hoy para esa categoría con logros similares, NO lo vuelvas a crear.
      2. FECHAS REALES: Usa siempre la fecha de hoy: ${today}.
      3. CRITERIO DE PROGRESO:
         - Si el usuario dice "se terminó" o "está listo": progress = 100, status = "success".
         - Si es un avance: súbele un 20-30% al progreso actual que ves en el contexto.
      4. IDs DE INFRAESTRUCTURA: "crm", "app", "forms", "landing".

      ACCIONES POSIBLES:
      - BITÁCORA (actividad): op: "INSERT".
      - PROGRESO (config_estrategia): op: "PATCH".
      - PROYECTOS (proyectos): op: "UPDATE". Si el usuario habla de un proyecto específico del CRM (proyectos), usa su ID exacto.

      RETORNA ÚNICAMENTE JSON:
      {
        "message": "Respuesta humana y estratégica.",
        "strategic_feedback": "Análisis táctico.",
        "actions": [ ... ]
      }
    `;

    // Limpiamos el historial
    const cleanHistory = chatHistory
      .filter(h => h.role && h.content && typeof h.content === 'string' && h.content.trim() !== "")
      .map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      }));

    const chat = model.startChat({
      history: cleanHistory,
      generationConfig: { responseMimeType: "application/json" }
    });

    const result = await chat.sendMessage(systemPrompt + "\n\nUSUARIO DICE: " + userInput);
    return JSON.parse(result.response.text()) as HedyResponse;

  } catch (error) {
    console.error("Hedy Error:", error);
    return { 
      message: "He tenido un pequeño desfase táctico al procesar el historial.", 
      strategic_feedback: "Error de formato de mensajes.", 
      actions: [] 
    };
  }
}
