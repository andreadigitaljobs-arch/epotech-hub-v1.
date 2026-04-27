const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zxcfngtskbjjlziushqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y2ZuZ3Rza2Jqamx6aXVzaHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTA3OTAsImV4cCI6MjA5MTc2Njc5MH0.o4JJZSD-d4J4w8s-jDq5ThS0GlPt16tGVIx24-DfHDw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function injectData() {
  console.log('Inyectando datos definitivos (74 seguidores total, 2.2k alcance)...');
  
  const data = {
    mes: 'Abril',
    semana: 5,
    vistas_totales: '6.8 mil',
    reproducciones_reels: '4.6 mil',
    alcance_cuenta: '2.2 mil',
    interacciones_cuenta: '296',
    seguidores_totales: '5', // Crecimiento neto
    compartidos_reels: '42',
    guardados_reels: '8',
    insights: '• ¡Crecimiento real! Sumamos +5 nuevos seguidores interesados en el nicho de epóxicos.\n• Logramos un impacto masivo de 6.8 mil visualizaciones totales, rompiendo la barrera de los 4.5k en Reels.\n• El alcance real llegó a 2.2 mil personas únicas que ahora conocen la marca Epotech.',
    captura_url: ['https://zxcfngtskbjjlziushqx.supabase.co/storage/v1/object/public/analytics_screenshots/analiticas/Abril/semana-3-reels-1776996815450-283n2g.png']
  };

  const { error } = await supabase
    .from('analiticas')
    .upsert(data, { onConflict: 'mes,semana' });

  if (error) {
    console.error('Error inyectando datos:', error.message);
  } else {
    console.log('¡Éxito! Dashboard sincronizado al 100%.');
  }
}

injectData();
