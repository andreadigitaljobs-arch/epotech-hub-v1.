const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zxcfngtskbjjlziushqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y2ZuZ3Rza2Jqamx6aXVzaHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTA3OTAsImV4cCI6MjA5MTc2Njc5MH0.o4JJZSD-d4J4w8s-jDq5ThS0GlPt16tGVIx24-DfHDw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function nuclearCleanup() {
  console.log('--- INICIANDO LIMPIEZA NUCLEAR ---');
  
  // 1. Borrar todas las actividades (duplicados y basura)
  const { error: errorAct } = await supabase.from('actividad').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 
  if (errorAct) console.error('Error limpiando actividad:', errorAct);
  else console.log('✅ Tabla de Actividad vaciada correctamente.');

  // 2. Resetear config_estrategia
  const { data: config } = await supabase.from('config_estrategia').select('*').single();
  if (config) {
    const freshHub = config.hub_infraestructura.map(s => ({
      ...s,
      status: 'pending',
      progress: 0,
      achievements: []
    }));

    const { error: errorConfig } = await supabase
      .from('config_estrategia')
      .update({ 
        hub_infraestructura: freshHub,
        hub_social_media: {
          monthlyIdeas: [],
          activeSeries: [],
          results: [],
          observations: "Listo para iniciar la estrategia de 2026."
        }
      })
      .eq('id', config.id);
    
    if (errorConfig) console.error('Error reseteando config:', errorConfig);
    else console.log('✅ Configuración de servicios reseteada a 0%.');
  }

  console.log('--- LIMPIEZA COMPLETADA ---');
}

nuclearCleanup();
