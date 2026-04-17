import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxcfngtskbjjlziushqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y2ZuZ3Rza2Jqamx6aXVzaHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTA3OTAsImV4cCI6MjA5MTc2Njc5MH0.o4JJZSD-d4J4w8s-jDq5ThS0GlPt16tGVIx24-DfHDw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function removeFormService() {
    console.log("🛠️ Eliminando 'Formulario Inteligente'...");

    // 1. Obtener la config actual
    const { data: config, error: fetchError } = await supabase.from('config_estrategia').select('*').single();
    
    if (fetchError) {
        console.error("❌ Error al obtener config:", fetchError);
        return;
    }

    // 2. Filtrar para quitar el formulario
    const updatedInfra = config.hub_infraestructura.filter(s => s.id !== 'forms');

    // 3. Guardar la nueva lista
    const { error: updateError } = await supabase
        .from('config_estrategia')
        .update({ hub_infraestructura: updatedInfra })
        .eq('id', config.id);

    if (updateError) console.error("❌ Error al actualizar:", updateError);
    else console.log("✅ 'Formulario Inteligente' eliminado con éxito.");
}

removeFormService();
