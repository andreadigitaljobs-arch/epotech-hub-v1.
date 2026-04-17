const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load env
const envPath = path.join(__dirname, '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const supabase = createClient(envConfig.NEXT_PUBLIC_SUPABASE_URL, envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function runTest() {
    console.log("🚀 Iniciando prueba de automatización Bitácora -> Hub...");
    
    const testEntry = {
        fecha: new Date().toISOString().split('T')[0],
        categoria: "CRM Master",
        logros: [
            "PRUEBA: Conexión dinámica establecida",
            "Sincronización automática v3.7 verificada"
        ],
        siguiente_objetivo: "Despliegue final de la infraestructura",
        creado_por: "Antigravity Assistant"
    };

    const { data, error } = await supabase.from('actividad').insert([testEntry]).select();

    if (error) {
        console.error("❌ Error al insertar:", error.message);
    } else {
        console.log("✅ Entrada de bitácora creada con éxito!");
        console.log("ℹ️ Revisa tu página de Servicios (/proyectos) y verás estos logros en la tarjeta de CRM.");
    }
}

runTest();
