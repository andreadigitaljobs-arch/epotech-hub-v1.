const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function inspectSchema() {
  console.log("Inspecting existing tables...");
  
  // List columns for relevant tables
  const tables = ['proyectos', 'config_estrategia', 'config_manual'];
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);
    
    if (error) {
      console.error(`Error inspecting ${table}:`, error.message);
      continue;
    }
    
    if (data && data.length > 0) {
      console.log(`Table '${table}' columns:`, Object.keys(data[0]));
    } else {
      console.log(`Table '${table}' is empty.`);
    }
  }
}

inspectSchema();
