const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if(parts.length >= 2) {
        env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
});

const supabaseUrl = env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = env['NEXT_PUBLIC_SUPABASE_ANON_KEY']; // Or service role key if available

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const updateData = {
        mision_titulo: 'Transformar espacios. Entregar resultados. Construir confianza.',
        mision_desc: 'Epotech Solutions es una empresa ubicada en Salt Lake City, Utah, especializada en limpieza exterior (pressure washing) y recubrimientos de pisos epóxicos (epoxy floors). Nuestro enfoque principal es ayudar a propietarios de viviendas a mejorar la apariencia de sus propiedades (curb appeal).',
        propuesta_valor: 'Transformamos espacios haciendo que se vean como nuevos, de forma rápida, profesional y con resultados visibles. Ofrecemos soluciones tanto funcionales como estéticas, desde limpieza hasta acabados premium.',
        diferenciador: 'Combinamos servicios de alto volumen (pressure washing) con servicios de alto valor (epoxy), lo que nos permite captar clientes fácilmente y luego ofrecer soluciones premium.',
        perfil_cliente: 'Propietarios de vivienda (hombres y mujeres) en EE.UU. (principalmente Utah) que valoran calidad, rapidez, resultados visibles y servicio confiable.',
        tono_voz: 'Directo (Mensajes claros y sin rodeos).\nEnfocado en resultados (Priorizamos beneficios visibles).\nSin tecnicismos (Evitamos lenguaje complejo).\nTransformación antes/después (Mostramos el cambio real).',
        servicios_basicos: ['Lavado de casas (Soft Wash)', 'Limpieza de entradas (Driveways)', 'Limpieza de techos', 'Limpieza exterior general'],
        servicios_premium: ['Pisos epóxicos (Flake y Metálico)', 'Acabados para interiores', 'Recubrimientos para canchas deportivas'],
        mensajes_clave: ["Hacemos que tu hogar se vea como nuevo", "Cotización gratis", "Servicio rápido y confiable", "Salt Lake City / Utah"]
    };

    // First ensure there is a row, if none, insert it. Actually schema insert on conflict
    const { data: fetchRows, error: fetchErr } = await supabase.from('config_estrategia').select('id').limit(1);
    
    if (fetchErr) {
        console.error("Fetch DB Error:", fetchErr);
        return;
    }

    if (fetchRows && fetchRows.length > 0) {
        const id = fetchRows[0].id;
        console.log("Updating existing row:", id);
        const { error: updateErr } = await supabase.from('config_estrategia').update(updateData).eq('id', id);
        if (updateErr) {
            console.error("Failed to update:", updateErr);
        } else {
            console.log("Database updated successfully");
        }
    } else {
        console.log("No row found, inserting new");
        const { error: insertErr } = await supabase.from('config_estrategia').insert([updateData]);
        if (insertErr) {
            console.error("Failed to insert:", insertErr);
        } else {
            console.log("Database inserted successfully");
        }
    }
}

run();
