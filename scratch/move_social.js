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

async function moveSocialToInfra() {
  console.log("🛠️ Reestructurando Hub de Servicios...");

  try {
    const { data: config } = await supabase.from('config_estrategia').select('*').limit(1).maybeSingle();
    
    if (!config) {
      console.error("No se encontró la configuración en la DB.");
      return;
    }

    const newInfra = [
      ...config.hub_infraestructura,
      {
        id: "social",
        name: "Redes Sociales",
        status: "active",
        progress: 15, // Un poco de progreso inicial para que no se vea vacío
        achievements: ["Estrategia master definida"]
      }
    ];

    const { error } = await supabase.from('config_estrategia').update({
      hub_infraestructura: newInfra,
      hub_social_media: null // Lo desactivamos de la DB para ser consistentes
    }).eq('id', config.id);

    if (error) throw error;
    console.log("✅ Redes Sociales integradas en Infraestructura Digital.");
  } catch (e) {
    console.error("Error:", e);
  }
}

moveSocialToInfra();
