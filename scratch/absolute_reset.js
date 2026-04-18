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

async function absoluteZeroReset() {
  console.log("🧹 Realizando limpieza absoluta del Hub...");

  try {
    const { data: config } = await supabase.from('config_estrategia').select('*').limit(1).maybeSingle();
    
    if (!config) {
      console.error("No se encontró la configuración en la DB.");
      return;
    }

    const resetInfra = [
      { id: "crm", name: "CRM Master", status: "pending", progress: 0, achievements: [] },
      { id: "app", name: "App de Seguimiento", status: "pending", progress: 0, achievements: [] },
      { id: "landing", name: "Landing Page", status: "pending", progress: 0, achievements: [] },
      { id: "social", name: "Redes Sociales", status: "pending", progress: 0, achievements: [] }
    ];

    const { error } = await supabase.from('config_estrategia').update({
      hub_infraestructura: resetInfra,
      hub_social_media: null
    }).eq('id', config.id);

    if (error) throw error;
    
    // También limpiamos la tabla de actividad para que no aparezcan fantasmas al abrir el historial
    const categories = ['CRM Master', 'App de Seguimiento', 'Landing Page', 'Estrategia de Redes'];
    await supabase.from('actividad').delete().in('categoria', categories);

    console.log("✅ Hub reseteado a 0%. Todo limpio y listo para empezar de verdad.");
  } catch (e) {
    console.error("Error:", e);
  }
}

absoluteZeroReset();
