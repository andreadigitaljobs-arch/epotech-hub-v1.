import { createClient } from "@supabase/supabase-js";

// Usamos fallbacks para que Vercel no falle el build si aún no se han configurado las variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Categoria = "Branding" | "Contenido" | "Web" | "CRM" | "Diseño" | "Otro" | "CRM Master" | "App de Marca" | "Landing Page" | "Formulario Inteligente";

export interface ActividadEntry {
  id?: string;
  fecha: string;          // "2026-04-14"
  logros: string[];       // ["Se cambiaron portadas de WhatsApp", ...]
  siguiente_objetivo: string;
  categoria: Categoria;
  creado_por?: string;
  created_at?: string;
}
