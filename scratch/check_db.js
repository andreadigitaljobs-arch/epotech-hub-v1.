
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function checkData() {
    const envPath = 'c:/Users/nombr/.gemini/antigravity/Epotech Solutions/epotech-hub/.env.local';
    const envContent = fs.readFileSync(envPath, 'utf8');
    const getEnv = (name) => envContent.split('\n').find(l => l.startsWith(name))?.split('=')[1]?.trim()?.replace(/["']/g, '');

    const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: actividad } = await supabase.from('actividad').select('*').limit(5);
    console.log('Actividad:', JSON.stringify(actividad, null, 2));

    const { data: proyectos } = await supabase.from('proyectos').select('*').limit(5);
    console.log('Proyectos:', JSON.stringify(proyectos, null, 2));
}

checkData();
