export interface Script {
  id: string;
  title: string;
  category: string;
  service: 'presion' | 'ventanas' | 'epoxy';
  duration: string;
  tomas: number;
  steps: {
    label: string;
    txt: string;
    action: string;
  }[];
  tips: string[];
  checklist: string[];
}

export const guiones: Script[] = [
  // --- PRESIÓN WASHING (1-20) ---
  {
    id: 'p1',
    title: 'Antes/Después Pantalla Dividida',
    category: 'Antes/Después',
    service: 'presion',
    duration: '45-60s',
    tomas: 6,
    steps: [
      { label: '0-3s', txt: 'Driveway sucio (acercamiento)', action: 'Mueve la cámara lento hacia el piso' },
      { label: '3-10s', txt: 'Tú trabajando en acción', action: 'Grabación de cuerpo completo trabajando' },
      { label: '10-45s', txt: 'Pantalla dividida: Sucio vs Limpio', action: 'Tomas comparativas mismo ángulo' },
      { label: '45-60s', txt: 'Resultado final brillante', action: 'Plano general del driveway impecable' }
    ],
    tips: ['Limpia la cámara antes', 'Mismo ángulo para antes/después'],
    checklist: ['Video sucio general', 'Video sucio detalle', 'Máquina de cerca', 'Resultado brillante']
  },
  {
    id: 'p2',
    title: 'Revelado Lentamente con Máquina',
    category: 'Antes/Después',
    service: 'presion',
    duration: '50-60s',
    tomas: 5,
    steps: [
      { label: '0-5s', txt: 'Driveway sucio completo', action: 'Plano general estático' },
      { label: '5-40s', txt: 'Máquina quitando la mugre', action: 'Sigue la máquina en línea recta' },
      { label: '40-60s', txt: 'Transformación total', action: 'Paneo lento sobre lo ya limpio' }
    ],
    tips: ['Graba en línea recta siempre', 'Deja que el agua fluya naturalmente'],
    checklist: ['Inicio sucio', 'Proceso en línea', 'Agua close-up', 'Final limpio']
  },
  {
    id: 'p4',
    title: '¿Por qué duran los pisos?',
    category: 'Educativo',
    service: 'presion',
    duration: '50-60s',
    tomas: 5,
    steps: [
      { label: '0-5s', txt: 'Gancho: ¿Sabes cuánto dura un piso?', action: 'Señala el piso sucio a cámara' },
      { label: '5-15s', txt: 'Explicación del moho y raíces', action: 'Muestra detalle de grietas con tierra' },
      { label: '15-45s', txt: 'Limpieza profunda en acción', action: 'Uso de la surface cleaner' },
      { label: '45-60s', txt: 'Dato final: Esto dura 5 años', action: 'Ok a cámara con resultado' }
    ],
    tips: ['Habla lento y claro', 'Usa números específicos para dar autoridad'],
    checklist: ['Detalle musgo', 'Explicación a cámara', 'Máquina trabajando', 'Resultado con dato']
  },
  {
    id: 'p7',
    title: 'ASMR: Mugre Desapareciendo',
    category: 'Satisfying',
    service: 'presion',
    duration: '30-45s',
    tomas: 3,
    steps: [
      { label: '0-15s', txt: 'Close-up extremo de boquilla', action: 'Primer plano del chorro barriendo' },
      { label: '15-30s', txt: 'Diferente ángulo de limpieza', action: 'Cerca del borde de la acera' },
      { label: '30-45s', txt: 'Resultado impecable', action: 'Zoom out lento desde lo limpio' }
    ],
    tips: ['Graba el sonido real del agua', 'No hables, deja que el sonido limpie'],
    checklist: ['Close-up boquilla', 'Primer plano mugre volando', 'Resultado brillante']
  },
  {
    id: 'p11',
    title: 'Acompáñame un día de trabajo',
    category: 'Storytelling',
    service: 'presion',
    duration: '60-90s',
    tomas: 8,
    steps: [
      { label: '0-10s', txt: 'Hoy vamos a limpiar este driveway', action: 'Muestra la casa y el equipo' },
      { label: '10-20s', txt: 'El problema: Años de descuido', action: 'Muestra manchas negras de aceite' },
      { label: '20-40s', txt: 'Empezando el trabajo pesado', action: 'Tomas rápidas de preparación' },
      { label: '70-90s', txt: 'Cliente satisfecho e impecable', action: 'Despedida con la casa transformada' }
    ],
    tips: ['Cuenta la historia: Problema -> Solución', 'Incluye detalles humanos'],
    checklist: ['Llegada', 'Problema', '3 tomas de proceso', 'Transformación', 'Resultado']
  },
  {
    id: 'p15',
    title: 'Presión Máxima vs Mínima',
    category: 'Storytelling',
    service: 'presion',
    duration: '45-60s',
    tomas: 4,
    steps: [
      { label: '0-5s', txt: '¿Cuál es mejor?', action: 'Muestra dos boquillas diferentes' },
      { label: '5-25s', txt: 'Método 1: Alta presión', action: 'Video limpiando con chorro fuerte' },
      { label: '25-45s', txt: 'Método 2: Flujo alto', action: 'Video limpiando con superficie amplia' },
      { label: '45-60s', txt: 'Pregunta: ¿Tú cuál prefieres?', action: 'Texto en pantalla preguntando' }
    ],
    tips: ['Genera debate en comentarios', 'Ambos métodos deben ser válidos'],
    checklist: ['Presión alta acción', 'Presión baja acción', 'Áreas comparables', 'Pregunta final']
  },

  // --- VENTANAS (21-40) ---
  {
    id: 'v21',
    title: 'Detalle Satisfying Ventana',
    category: 'Satisfying',
    service: 'ventanas',
    duration: '30-45s',
    tomas: 3,
    steps: [
      { label: '0-15s', txt: 'Ventana opaca por suciedad', action: 'Primer plano de manchas de lluvia' },
      { label: '15-30s', txt: 'Agua y jabón barriendo todo', action: 'Escobilla pasando en cámara lenta' },
      { label: '30-45s', txt: 'Brillo espejo final', action: 'Reflejo del sol en el vidrio limpio' }
    ],
    tips: ['Limpiar el lente del celular', 'Usa luz natural para los brillos'],
    checklist: ['Ventana sucia', 'Jabón en acción', 'Resultado cristalino']
  },
  {
    id: 'v24',
    title: 'Transición Mano Cubriendo',
    category: 'Storytelling',
    service: 'ventanas',
    duration: '15-25s',
    tomas: 2,
    steps: [
      { label: '0-3s', txt: 'Vidrio muy sucio', action: 'Enfoque directo a la suciedad' },
      { label: '3-8s', txt: 'Mano tapa el lente', action: 'Tu mano cubre completamente la cámara' },
      { label: '8-25s', txt: 'Mano sale: ¡Vidrio limpio!', action: 'Descubre y muestra la transparencia' }
    ],
    tips: ['Movimiento de mano lento', 'Mismo ángulo exacto antes y después'],
    checklist: ['Sucia close-up', 'Limpia close-up', 'Mano rápida']
  },
  {
    id: 'v26',
    title: 'La Escobilla que Revela',
    category: 'Antes/Después',
    service: 'ventanas',
    duration: '20-30s',
    tomas: 1,
    steps: [
      { label: '0-5s', txt: 'Ventana llena de espuma', action: 'Cubre todo con jabón blanco' },
      { label: '5-28s', txt: 'Escobilla bajando lento', action: 'Limpia una franja perfecta de arriba abajo' },
      { label: '28-30s', txt: 'Transparencia total', action: 'Muestra lo que hay detrás del vidrio' }
    ],
    tips: ['Movimiento debe ser perfecto', 'Jabón debe ser consistente'],
    checklist: ['Espuma uniforme', 'Pase de escobilla lento', 'Resultado sin marcas']
  },
  {
    id: 'v33',
    title: '¿Por qué se ensucian tanto?',
    category: 'Educativo',
    service: 'ventanas',
    duration: '45-55s',
    tomas: 3,
    steps: [
      { label: '0-5s', txt: '¿Sabes por qué tus cristales mueren?', action: 'Señala acumulado en el marco' },
      { label: '5-25s', txt: 'Explicación: Polen y contaminación', action: 'Muestra detalle de puntos negros' },
      { label: '25-40s', txt: 'Cómo el agua dura daña el vidrio', action: 'Muestra mancha blanca que no sale' },
      { label: '40-55s', txt: 'Solución Epotech', action: 'Muestra herramientas profesionales' }
    ],
    tips: ['Menciona el clima de Utah', 'Explica por qué no usar solo agua'],
    checklist: ['Detalle marco sucio', 'Mancha agua dura', 'Solución profesional']
  },

  // --- EPOXY FLOORS (41-60) ---
  {
    id: 'e43',
    title: 'Gris Aburrido a Epoxy Brillante',
    category: 'Antes/Después',
    service: 'epoxy',
    duration: '60-75s',
    tomas: 8,
    steps: [
      { label: '0-10s', txt: 'Mira este garage gris sin vida', action: 'Paneo general piso de concreto' },
      { label: '10-25s', txt: 'Preparando: Alisando el piso', action: 'Tomas de la máquina pulidora' },
      { label: '25-50s', txt: 'La magia del Epoxy cayendo', action: 'Tomas lentas del producto expandiéndose' },
      { label: '50-75s', txt: 'Transformación Espejo', action: 'Resultado final con reflejos de la luz' }
    ],
    tips: ['Buena luz en el resultado final', 'El antes debe verse muy feo'],
    checklist: ['Piso gris', 'Pulido acción', 'Líquido epoxy', 'Resultado espejo']
  },
  {
    id: 'e44',
    title: 'Lluvia de Flakes de Color',
    category: 'Satisfying',
    service: 'epoxy',
    duration: '50-65s',
    tomas: 5,
    steps: [
      { label: '0-10s', txt: '¿Quieres personalidad en tu garage?', action: 'Muestra catálogo de colores' },
      { label: '10-20s', txt: 'Base fresca de epoxy lanzada', action: 'Tomas barriendo el color base' },
      { label: '20-45s', txt: 'Lluvia de flakes (papelillos)', action: 'Lanza chips al aire en cámara lenta' },
      { label: '45-65s', txt: 'El diseño final acabado', action: 'Detalle de la textura flake' }
    ],
    tips: ['Graba los flakes en cámara lenta', 'Usa flash para ver el brillo'],
    checklist: ['Base epoxy', 'Lanzando flakes slow mo', 'Detalle textura final']
  },
  {
    id: 'e46',
    title: '¿Por qué dura décadas?',
    category: 'Educativo',
    service: 'epoxy',
    duration: '50-60s',
    tomas: 4,
    steps: [
      { label: '0-5s', txt: '¿Inversión o gasto?', action: 'Muestra piso viejo vs nuevo' },
      { label: '5-25s', txt: 'Explicación: Dureza diamantada', action: 'Golpea suavemente o muestra resistencia' },
      { label: '25-40s', txt: 'Fácil de limpiar: Aceite afuera', action: 'Limpia una mancha rápido del epoxy' },
      { label: '40-60s', txt: 'Tu garage, nivel experto', action: 'Plano general estético' }
    ],
    tips: ['Demuestra que es fácil de limpiar', 'Enfatiza el valor de la propiedad'],
    checklist: ['Resistencia video', 'Limpieza rápida', 'Valor estético']
  },
  {
    id: 'e55',
    title: 'El Garage que era Bodega',
    category: 'Storytelling',
    service: 'epoxy',
    duration: '60-75s',
    tomas: 7,
    steps: [
      { label: '0-10s', txt: 'De cuarto de trastos a Showroom', action: 'Muestra desorden inicial' },
      { label: '10-25s', txt: 'Vaciando y preparando', action: 'Time-lapse rápido limpiando el área' },
      { label: '25-50s', txt: 'Nueva vida con Epoxy', action: 'Proceso de cambio de color' },
      { label: '50-75s', txt: 'Un espacio donde sí quieres estar', action: 'Resultado final con un auto o mesa' }
    ],
    tips: ['Story: De un sitio feo a uno habitable', 'Involucra la emoción del dueño'],
    checklist: ['Desorden antes', 'Vaciado rápido', 'Piso nuevo', 'Uso final del espacio']
  },
  
  // Guiones Adicionales para completar la base de datos (Ejemplos representativos de los 60)
  {
    id: 'p3', title: 'Antes/Después Corte Rápido', category: 'Antes/Después', service: 'presion', duration: '30-45s', tomas: 4,
    steps: [{label:'0-2s', txt:'Sucia', action:'Estático'}, {label:'3-4s', txt:'Limpia', action:'Mismo encuadre'}, {label:'5-45s', txt:'Loop rápido', action:'Montaje ágil'}],
    tips: ['Mismo ángulo exacto', 'Música con beat fuerte'], checklist: ['Sucio estático', 'Limpio estático']
  },
  {
    id: 'p5', title: 'El Error más Común', category: 'Educativo', service: 'presion', duration: '45-55s', tomas: 4,
    steps: [{label:'0-5s', txt:'Error fatal', action:'Técnica mala'}, {label:'20-35s', txt:'Forma correcta', action:'Técnica Epotech'}],
    tips: ['Se amable, no juzgador', 'Muestra el daño que hace el error'], checklist: ['Técnica mala', 'Técnica buena']
  },
  {
    id: 'p8', title: 'Detalles que Sorprenden', category: 'Satisfying', service: 'presion', duration: '40-50s', tomas: 4,
    steps: [{label:'0-10s', txt:' Grieta sucia', action:'Close-up'}, {label:'35-50s', txt:'Vista general limpia', action:'Zoom out'}],
    tips: ['Enfócate en un detalle difícil', 'Música relajante'], checklist: ['Grieta sucia', 'Grieta limpia']
  },
  {
    id: 'v22', title: 'Arañazo a Desaparecer', category: 'Satisfying', service: 'ventanas', duration: '25-35s', tomas: 2,
    steps: [{label:'0-10s', txt:'Mancha difícil', action:'Zoom'}, {label:'20-35s', txt:'Cristal perfecto', action:'Muestra filo'}],
    tips: ['Enfoque manual para ver el detalle', 'Sin habla'], checklist: ['Mancha vista', 'Resultado transparente']
  },
  {
    id: 'v41', title: 'Manual vs Máquina', category: 'Educativo', service: 'ventanas', duration: '45-60s', tomas: 4,
    steps: [{label:'0-5s', txt:'¿Manual o Pro?', action:'Muestra manos vs equipo'}, {label:'45-60s', txt:'Diferencia técnica', action:'Compara velocidad'}],
    tips: ['Demuestra por qué Epotech es más rápido', 'Genera debate'], checklist: ['Proceso manual', 'Proceso máquina']
  },
  {
    id: 'e45', title: 'Efecto Metalizado Espejo', category: 'Satisfying', service: 'epoxy', duration: '55-70s', tomas: 6,
    steps: [{label:'0-10s', txt:'Espejo en el piso', action:'Cámara a ras de suelo'}, {label:'45-70s', txt:'Lujo total', action:'Muestra reflejos de luz'}],
    tips: ['Usa lámparas para el reflejo', 'Muestra detalle líquido'], checklist: ['Mezcla metalizada', 'Piso espejo']
  },
  {
    id: 'e60', title: 'Qué NO hacer con tu Epoxy', category: 'Educativo', service: 'epoxy', duration: '40-50s', tomas: 3,
    steps: [{label:'0-5s', txt:'¡ALERTA!', action:'Señala el piso'}, {label:'40-50s', txt:'Limpieza adecuada', action:'Muestra jabón neutro'}],
    tips: ['Educación post-venta', 'Dura 20 años si cuidas así'], checklist: ['Error detergente', 'Limpieza correcta']
  }
];
