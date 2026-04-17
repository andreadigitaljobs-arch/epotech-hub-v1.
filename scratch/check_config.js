import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxcfngtskbjjlziushqx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Y2ZuZ3Rza2Jqamx6aXVzaHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTA3OTAsImV4cCI6MjA5MTc2Njc5MH0.o4JJZSD-d4J4w8s-jDq5ThS0GlPt16tGVIx24-DfHDw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
    const { data: config } = await supabase.from('config_estrategia').select('*');
    console.log("Config Strategy CONTENT:", JSON.stringify(config, null, 2));
}

check();
