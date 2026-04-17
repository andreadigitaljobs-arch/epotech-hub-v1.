const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { referencias } = require('./data/referencias');

async function fullRestore() {
  console.log('🚀 Iniciando Restauración Total y Limpieza...');

  try {
    // 1. Limpieza de Tablas de Historial (Wipe Total)
    console.log('🧹 Limpiando bitácora y chat...');
    await supabase.from('actividad').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('chat_history').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('notificaciones').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('proyectos').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // 2. Restauración de Videos de Referencia (Vercel Style)
    console.log('🎞️ Restaurando galería de inspiración (8 videos)...');
    for (const v of referencias.videos) {
      const { error } = await supabase.from('referencias_videos').upsert(v);
      if (error) console.error(`Error en video ${v.titulo}:`, error.message);
    }

    // 3. Restauración de Cuentas de Referencia
    console.log('👥 Restaurando perfiles de inspiración (6 cuentas)...');
    for (const c of referencias.cuentas) {
      const { error } = await supabase.from('referencias_cuentas').upsert(c);
      if (error) console.error(`Error en cuenta ${c.nombre}:`, error.message);
    }

    // 4. Reinicio de Progresos en Config Estrategia
    console.log('⚙️ Reiniciando contadores de progreso...');
    const { data: estra } = await supabase.from('config_estrategia').select('*').single();
    if (estra) {
      const resetInfra = estra.hub_infraestructura?.map(s => ({ ...s, progress: 0 })) || [];
      const resetSocial = { ...estra.hub_social_media, monthlyIdeas: [], observations: "" };
      await supabase.from('config_estrategia').update({ 
        hub_infraestructura: resetInfra, 
        hub_social_media: resetSocial 
      }).eq('id', estra.id);
    }

    console.log('✅ Restauración completada con éxito.');
  } catch (err) {
    console.error('❌ Error fatal:', err);
  }
}

fullRestore();
