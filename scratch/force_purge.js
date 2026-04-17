
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function nuclearReset() {
    console.log('--- STARTING NUCLEAR PURGE ---');
    const envPath = 'c:/Users/nombr/.gemini/antigravity/Epotech Solutions/epotech-hub/.env.local';
    const envContent = fs.readFileSync(envPath, 'utf8');
    const getEnv = (name) => envContent.split('\n').find(l => l.startsWith(name))?.split('=')[1]?.trim()?.replace(/["']/g, '');

    const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Delete all transactional records
    const tables = ['actividad', 'notificaciones', 'chat_history', 'push_subscriptions'];
    for (const table of tables) {
        console.log(`Clearing table: ${table}...`);
        const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
        if (error) console.error(`Error clearing ${table}:`, error);
        else console.log(`Table ${table} cleared!`);
    }

    // 2. Reset Strategy Configuration (Progress to 0, no achievements)
    console.log('Resetting Strategy Config...');
    const { data: config } = await supabase.from('config_estrategia').select('*').single();
    
    if (config) {
        const resetInfra = config.hub_infraestructura.map(s => ({
            ...s,
            status: 'pending',
            progress: 0,
            achievements: [] // Clear internal achievements if any
        }));

        const resetSocial = {
            ...config.hub_social_media,
            reels: 0,
            carruseles: 0,
            publicaciones: 0,
            monthlyIdeas: [],
            activeSeries: [],
            results: [],
            observations: "Esperando inicio de gestión 2026."
        };

        const { error: updateError } = await supabase.from('config_estrategia')
            .update({ 
                hub_infraestructura: resetInfra,
                hub_social_media: resetSocial
            })
            .eq('id', config.id);

        if (updateError) console.error('Error resetting config:', updateError);
        else console.log('Strategy Config reset to ZERO!');
    }

    console.log('--- PURGE COMPLETE ---');
}

nuclearReset();
