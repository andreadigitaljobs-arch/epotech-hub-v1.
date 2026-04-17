import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxcfngtskbjjlziushqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y2ZuZ3Rza2Jqamx6aXVzaHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTA3OTAsImV4cCI6MjA5MTc2Njc5MH0.o4JJZSD-d4J4w8s-jDq5ThS0GlPt16tGVIx24-DfHDw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function deepPurge() {
    console.log("🚀 Iniciando Purga de Configuración...");

    // 1. Limpiar todos los logros y resetear porcentajes en config_estrategia
    const { data: config, error: configError } = await supabase
        .from('config_estrategia')
        .update({ 
            logros: [], 
            porcentaje_total: 0,
            siguiente_objetivo: "Por definir"
        })
        .neq('nombre', 'NON_EXISTENT_NAME');

    if (configError) console.error("❌ Error en Config:", configError);
    else console.log("✅ Configuración de servicios reseteada a CERO.");

    // 2. Asegurar que la tabla de actividad esté REALMENTE vacía
    const { error: actError } = await supabase
        .from('actividad')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

    if (actError) console.error("❌ Error en Actividad:", actError);
    else console.log("✅ Tabla de actividad vaciada por completo.");

    console.log("✨ HUB COMPLETAMENTE LIMPIO.");
}

deepPurge();
