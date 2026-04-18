const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Simple parser for .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  const [k, ...v] = line.split('=');
  if (k) env[k.trim()] = v.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function nuclearWipe() {
  console.log("☢️ NUCLEAR WIPE INITIATED...");

  try {
    // 1. Wipe Actividad
    const { error: err1 } = await supabase.from('actividad').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err1) console.error("Error wiping actividad:", err1);
    else console.log("✅ Actividad table is now EMPTY.");

    // 2. Wipe Notificaciones
    const { error: err2 } = await supabase.from('notificaciones').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (err2) console.error("Error wiping notificaciones:", err2);
    else console.log("✅ Notificaciones table is now EMPTY.");

    // 3. Reset Hub Infrastructure in Config
    const { data: config } = await supabase.from('config_estrategia').select('*').limit(1).maybeSingle();
    if (config) {
      const resetInfra = config.hub_infraestructura.map(item => ({
        ...item,
        status: "pending",
        progress: 0,
        achievements: []
      }));
      
      await supabase.from('config_estrategia').update({
        hub_infraestructura: resetInfra,
        hub_social_media: null
      }).eq('id', config.id);
      console.log("✅ Hub Config reset to 0% and empty achievements.");
    }

    console.log("🚀 UNIVERSE IS CLEAN. READY FOR BIG BANG.");
  } catch (e) {
    console.error("Critical error during nuclear wipe:", e);
  }
}

nuclearWipe();
