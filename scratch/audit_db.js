const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zxcfngtskbjjlziushqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y2ZuZ3Rza2Jqamx6aXVzaHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTA3OTAsImV4cCI6MjA5MTc2Njc5MH0.o4JJZSD-d4J4w8s-jDq5ThS0GlPt16tGVIx24-DfHDw';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectAndClean() {
  console.log('--- AUDITORÍA DE DATOS ---');
  
  // 1. Actividad
  const { data: actividad } = await supabase.from('actividad').select('*');
  console.log(`\nRegistros en 'actividad': ${actividad?.length || 0}`);
  actividad?.forEach(a => console.log(`- [${a.fecha}] ${a.categoria}: ${a.logros.join(', ')}`));

  // 2. Notificaciones
  const { data: notificaciones } = await supabase.from('notificaciones').select('*');
  console.log(`\nRegistros en 'notificaciones': ${notificaciones?.length || 0}`);
  
  // 3. Config Estrategia (Proyectos)
  const { data: config } = await supabase.from('config_estrategia').select('*').single();
  console.log(`\nConfiguración actual detectada: ${config ? 'OK' : 'ERROR'}`);
  
  if (config) {
    console.log('Servicios en Hub:');
    config.hub_infraestructura.forEach(s => console.log(`- ${s.name} (${s.status}) - ${s.progress}%`));
  }
}

inspectAndClean();
