const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Simple parser for .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function nuclearReset() {
  console.log("🚀 Iniciando Limpieza Nuclear del Hub...");

  try {
    // 1. Limpiar Bits/Actividades
    const { error: err1 } = await supabase.from('actividad').delete().not('id', 'is', null);
    if (err1) console.error("Error en actividad:", err1);
    else console.log("✅ Bitácora vaciada.");

    // 2. Limpiar Proyectos (CRM)
    const { error: err2 } = await supabase.from('proyectos').delete().not('id', 'is', null);
    if (err2) console.error("Error en proyectos:", err2);
    else console.log("✅ Proyectos CRM eliminados.");

    // 3. Limpiar Chat History
    const { error: err3 } = await supabase.from('chat_history').delete().not('id', 'is', null);
    if (err3) console.error("Error en chat_history:", err3);
    else console.log("✅ Historial de Hedy eliminado.");

    // 4. Limpiar Notificaciones
    const { error: err4 } = await supabase.from('notificaciones').delete().not('id', 'is', null);
    if (err4) console.error("Error en notificaciones:", err4);
    else console.log("✅ Notificaciones eliminadas.");

    // 5. Resetear Infraestructura
    const baseInfra = [
      { id: "crm", name: "CRM Master", progress: 0, status: "active" },
      { id: "app", name: "App de Marca", progress: 0, status: "active" },
      { id: "forms", name: "Formulario Inteligente", progress: 0, status: "active" },
      { id: "landing", name: "Landing Page", progress: 0, status: "active" }
    ];

    const { data: estrategia } = await supabase.from('config_estrategia').select('*').limit(1).maybeSingle();
    if (estrategia) {
      const { error: err5 } = await supabase.from('config_estrategia').update({
        hub_infraestructura: baseInfra,
        hub_social_media: { monthlyIdeas: [], observations: "Reinicio estratégico completado por Antigravity." }
      }).eq('id', estrategia.id);
      if (err5) console.error("Error en estrategia:", err5);
      else console.log("✅ Infraestructura reseteada a 0%.");
    }

    console.log("✨ LIMPIEZA COMPLETADA CON ÉXITO.");
  } catch (e) {
    console.error("FATAL ERROR:", e);
  }
}

nuclearReset();
