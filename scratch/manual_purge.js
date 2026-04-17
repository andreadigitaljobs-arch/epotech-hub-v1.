
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function nuclearPurge() {
    console.log('--- STARTING MANUAL ID PURGE ---');
    const envPath = 'c:/Users/nombr/.gemini/antigravity/Epotech Solutions/epotech-hub/.env.local';
    const envContent = fs.readFileSync(envPath, 'utf8');
    const getEnv = (name) => envContent.split('\n').find(l => l.startsWith(name))?.split('=')[1]?.trim()?.replace(/["']/g, '');

    const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    const supabase = createClient(supabaseUrl, supabaseKey);

    const tables = ['actividad', 'notificaciones', 'chat_history', 'push_subscriptions'];
    
    for (const table of tables) {
        console.log(`Fetching IDs for ${table}...`);
        const { data: rows, error: fetchError } = await supabase.from(table).select('id');
        
        if (fetchError) {
            console.error(`Error fetching ${table}:`, fetchError);
            continue;
        }

        if (rows && rows.length > 0) {
            console.log(`Deleting ${rows.length} rows from ${table}...`);
            for (const row of rows) {
                const { error: deleteError } = await supabase.from(table).delete().eq('id', row.id);
                if (deleteError) console.error(`Failed to delete ID ${row.id} from ${table}:`, deleteError);
            }
            console.log(`${table} purged!`);
        } else {
            console.log(`${table} is already empty.`);
        }
    }

    // Reset config too
    const { data: config } = await supabase.from('config_estrategia').select('*').single();
    if (config) {
        const resetInfra = config.hub_infraestructura.map(s => ({
            ...s,
            status: 'pending',
            progress: 0,
            achievements: []
        }));
        await supabase.from('config_estrategia').update({ 
            hub_infraestructura: resetInfra,
            hub_social_media: { ...config.hub_social_media, reels: 0, carruseles: 0, publicaciones: 0 }
        }).eq('id', config.id);
    }

    console.log('--- MANUAL PURGE COMPLETE ---');
}

nuclearPurge();
