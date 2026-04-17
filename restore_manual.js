const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const manualContent = {
  regla_oro: "No tienes que grabar más. Tienes que grabar lo correcto.",
  haz_list: [
    "Graba vertical",
    "Busca buena luz",
    "Deja 2 o 3 segundos antes y después de cada toma",
    "Camina lento en los recorridos",
    "Piensa en clips cortos y reutilizables"
  ],
  evita_list: [
    "Mover demasiado el celular",
    "Mandar solo videos del resultado final",
    "Grabar todo desde un solo ángulo",
    "Hablar con demasiado ruido encima",
    "Olvidarte del antes o del proceso"
  ],
  fases: [
    {
      id: "antes",
      titulo: "Antes de empezar",
      items: [
        "1 video abierto del espacio completo",
        "1 video del problema principal",
        "2 videos bien de cerca del área sucia, dañada o sin terminar",
        "1 foto abierta",
        "1 foto del problema"
      ]
    },
    {
      id: "durante",
      titulo: "Durante el trabajo",
      items: [
        "1 video usando herramientas o maquinaria",
        "1 video de preparación del área",
        "1 video del equipo trabajando",
        "2 videos cortos de detalles grabados bien de cerca",
        "1 video caminando el espacio"
      ]
    },
    {
      id: "despues",
      titulo: "Al final",
      items: [
        "1 video fuerte del resultado final",
        "1 video caminando lentamente el área terminada",
        "2 videos de cerca del acabado final",
        "1 foto abierta final",
        "2 fotos de detalles finales"
      ]
    },
    {
      id: "humano",
      titulo: "Video humano",
      items: [
        "Explicando qué se hizo",
        "Diciendo qué problema tenía el cliente",
        "Diciendo por qué ese proceso importa",
        "Reaccionando al resultado o agradeciendo"
      ]
    }
  ]
};

async function updateManual() {
  console.log('Updating config_manual...');
  
  // Upsert the data (assuming id=1 or just inserting if empty)
  const { data, error } = await supabase
    .from('config_manual')
    .upsert({ 
      id: 1, 
      ...manualContent,
      updated_at: new Date()
    });

  if (error) {
    console.error('Error updating manual:', error);
    process.exit(1);
  }
  
  console.log('Manual content restored successfully.');
}

updateManual();
