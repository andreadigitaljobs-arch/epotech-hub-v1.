const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zxcfngtskbjjlziushqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y2ZuZ3Rza2Jqamx6aXVzaHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTA3OTAsImV4cCI6MjA5MTc2Njc5MH0.o4JJZSD-d4J4w8s-jDq5ThS0GlPt16tGVIx24-DfHDw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function injectData() {
  console.log('Iniciando inyección de datos para Resumen Mensual - Abril...');
  
  const data = {
    mes: 'Abril',
    semana: 5, // 5 es nuestro código para "Resumen Mes"
    vistas_totales: '5.6 mil',
    reproducciones_reels: '5.6 mil',
    interacciones_cuenta: '123',
    seguidores_totales: '76',
    compartidos_reels: '42',
    guardados_reels: '8',
    insights: '• ¡Estamos rompiendo la burbuja! El 56% de la audiencia son personas que NO te seguían.\n• Logramos una retención del 48% (2.2k visualizaciones completas), lo cual indica que el contenido es altamente adictivo.\n• Recomendación: Seguir con videos satisfactorios pero invitar a ver el link del perfil.',
    captura_url: ['https://zxcfngtskbjjlziushqx.supabase.co/storage/v1/object/public/analytics_screenshots/analiticas/Abril/semana-3-reels-1776996815450-283n2g.png']
  };

  const { error } = await supabase
    .from('analiticas')
    .upsert(data, { onConflict: 'mes,semana' });

  if (error) {
    console.error('Error inyectando datos:', error.message);
  } else {
    console.log('¡Éxito! El Resumen Mensual de Abril ha sido inyectado correctamente.');
  }
}

injectData();
