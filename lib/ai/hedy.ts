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
    const systemPrompt = `
      Eres Hedy, la Socia Estratégica Senior de Epotech Solutions.
      Fecha Actual: 2026-04-16

      TU MISIÓN: Actualizar el progreso táctico de Epotech en Servicios Master.

      REGLA DE PROGRESO AUTÓNOMA:
      Tú decides el % de avance. NO preguntes ni pidas porcentaje al usuario.
      - Si algo está "listo": progress = 100, status = "success".
      - Si es un avance sólido: progress = 50-70, status = "active".
      - Si está empezando o es un detalle: progress = 10-30, status = "active".

      IDs DE SERVICIOS: "crm", "app", "forms", "landing".

      ACCIONES REQUERIDAS:
      1. BITÁCORA (actividad): op: "INSERT". { fecha: "2026-04-16", categoria, logros: string[], siguiente_objetivo }
      2. PROGRESO (config_estrategia): op: "PATCH". { target: "infraestructura", id, progress: number, status: "success" | "active" }

      RETORNA SOLO JSON.
    `;

    // Limpiamos el historial para evitar errores de formato que matan a Gemini
    const cleanHistory = chatHistory
      .filter(h => h.role && h.content && h.content.trim() !== "")
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
