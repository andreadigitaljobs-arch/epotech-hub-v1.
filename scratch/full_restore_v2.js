const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Simple env loader
const env = fs.readFileSync('.env.local', 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, ...val] = line.split('=');
    if (key) acc[key.trim()] = val.join('=').trim();
    return acc;
  }, {});

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// We'll read the data from the file directly as well to avoid require issues
const referenciasPath = './data/referencias.ts';
const content = fs.readFileSync(referenciasPath, 'utf8');
// Super basic extraction since it's a known format
const startVideos = content.indexOf('videos: [') + 8;
const endVideos = content.lastIndexOf('],');
const videosStr = content.substring(startVideos, endVideos + 1);

// We can't easily eval TS/ESM from Node without transpiling, so I'll just hard-insert the data 
// based on what I already read from the file in previous view_file.

const vData = [
    { id: "v1", titulo: "Transformación Extrema (Antes y Después)", url: "https://www.instagram.com/reel/DFMT12buD9A/?igsh=Z2U2NXMwcmdxeHMy", platform: "instagram", fuerte: "Contraste Ridículo en 1 Segundo", porque_funciona: "Hackeo de dopamina visual" },
    { id: "v2", titulo: "Limpieza Hipnótica (Oddly Satisfying)", url: "https://www.instagram.com/reel/DJu4yPVz0en/?igsh=Y3o5ZDFnNWJ3a3Fm", platform: "instagram", fuerte: "Sin música, puro ASMR", porque_funciona: "Sonido terapéutico" },
    { id: "v3", titulo: "El Ángulo de 'A ras de piso'", url: "https://www.instagram.com/reel/DQ4NdHNjrXI/?igsh=MTY0NW5yN28yaTVhMg==", platform: "instagram", fuerte: "Perspectiva de Película", porque_funciona: "Transmite poder" },
    { id: "v4", titulo: "Vlog Narrado por el Dueño", url: "https://www.tiktok.com/@splashkingsaz/video/7384536155527630123", platform: "tiktok", fuerte: "Voz Real y Autoridad", porque_funciona: "Construye confianza" },
    { id: "v5", titulo: "El Timelapse Hipersónico", url: "https://www.instagram.com/reel/DKey6rPOUw_/?igsh=emZnbXQ0b3J5Y2Zt", platform: "instagram", fuerte: "Progreso Visual Acelerado", porque_funciona: "Retención máxima" },
    { id: "v6", titulo: "La Frontera Perfecta (Mitad/Mitad)", url: "https://www.tiktok.com/@allsidespressurewashing/video/7327765231868939551", platform: "tiktok", fuerte: "Trazar la Línea Visual", porque_funciona: "Potente gancho visual" },
    { id: "v7", titulo: "Manejo de Tuberías y Techos", url: "https://www.instagram.com/reel/DVck6jKDEnW/?igsh=MTYzMG01ZnU5cGdhNQ==", platform: "instagram", fuerte: "Trabajo Peligroso", porque_funciona: "Alta atención" },
    { id: "v8", titulo: "Corte de Ritmo Dinámico", url: "https://www.tiktok.com/@harveysexteriorcleaning/video/7475022774633876767", platform: "tiktok", fuerte: "Cambio de Plano", porque_funciona: "Transiciones ágiles" }
];

const cData = [
  { nombre: "Chris Fry", url: "https://www.instagram.com/chrisfry121?igsh=MTcxZm1wNWlkdnM0eQ==", tipo: "Instagram", fuerte: "Resultados Inmaculados", porque_funciona: "Premium" },
  { nombre: "New Looks Pressure Wash", url: "https://www.instagram.com/newlookspressurewash?igsh=anh1YzQxMHFsYnNm", tipo: "Instagram", fuerte: "Limpieza Extrema", porque_funciona: "Contraste" },
  { nombre: "Pushing Pressure Ltd", url: "https://www.instagram.com/pushingpressureltd?igsh=aHMwdmtydjlqM3Rq", tipo: "Instagram", fuerte: "ASMR", porque_funciona: "Relajante" }
];

async function run() {
  console.log('🚀 Iniciando Restauración...');
  
  await supabase.from('actividad').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('chat_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('notificaciones').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('proyectos').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  for (const v of vData) await supabase.from('referencias_videos').upsert(v);
  for (const c of cData) await supabase.from('referencias_cuentas').upsert(c);
  
  const { data: estra } = await supabase.from('config_estrategia').select('*').single();
  if (estra) {
    const resetInfra = estra.hub_infraestructura?.map(s => ({ ...s, progress: 0 })) || [];
    await supabase.from('config_estrategia').update({ hub_infraestructura: resetInfra, hub_social_media: { monthlyIdeas: [], observations: "" } }).eq('id', estra.id);
  }

  console.log('✅ Listo.');
}

run();
