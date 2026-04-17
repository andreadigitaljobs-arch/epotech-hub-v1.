export const manual = {
  regla: {
    titulo: "La regla que lo simplifica todo",
    ruleEn: "You don't have to record more. You have to record the right thing. Prioritize extreme quality.",
    ruleEs: "No tienes que grabar más. Tienes que grabar lo correcto. Prioriza que se vea súper nítido.",
  },
  secuenciaMinima: {
    titulo: "La secuencia mínima",
    pasos: [
      { en: "Problem", es: "Problema" },
      { en: "Process", es: "Proceso" },
      { en: "Result", es: "Resultado" },
      { en: "Reaction", es: "Reacción" },
    ],
  },
  fases: [
    {
      id: "antes",
      titulo: "Antes de empezar",
      titleEn: "Before You Start",
      emoji: "👀",
      color: "cyan",
      items: [
        { en: "Wide open shot of the full space", es: "1 video abierto del espacio completo", tooltip: "Párate en una esquina y graba de lejos mostrando todo el lugar (pared a pared) en 1x. Sin recortar nada, para dar contexto de dónde están." },
        { en: "Video of the main problem", es: "1 video del problema principal", tooltip: "Acércate a la razón por la que te contrataron (ej. el techo roto, el piso negro, la mancha). Muestra el deterioro." },
        { en: "2 close-up videos of the dirty/damaged area", es: "2 videos bien de cerca del área sucia o dañada", tooltip: "Literalmente pega el celular a 15-30cm del problema para que se note la peor textura posible." },
        { en: "1 wide photo", es: "1 foto abierta", tooltip: "Foto general del espacio antes de tocar nada (como el video abierto, pero en foto nítida)." },
        { en: "1 photo of the problem", es: "1 foto del problema", tooltip: "Foto macabea de la suciedad o daño. Mientras peor se vea, más fuerte será el impacto." },
      ],
    },
    {
      id: "durante",
      titulo: "Durante el trabajo",
      titleEn: "During the Work",
      emoji: "⚙️",
      color: "navy",
      items: [
        { en: "Video using tools or machinery", es: "1 video usando herramientas o maquinaria", tooltip: "Un plano corto mostrando exactamente cómo la hidrolavadora, surface cleaner o cepillo hace magia limpiando. Que se vea la máquina operando." },
        { en: "Video preparing the area", es: "1 video de preparación del área", tooltip: "Graba al equipo mezclando químicos, encendiendo la bomba, poniendo cinta, o bajando el equipo del camión. Demuestra el profesionalismo." },
        { en: "Video of the team working", es: "1 video del equipo trabajando", tooltip: "Una toma un poco más abierta donde se vea a 1 o 2 trabajadores en acción. Transmite que hay un equipo serio detrás del trabajo." },
        { en: "2 short close-up detail videos", es: "2 videos cortos de detalles grabados bien de cerca", tooltip: "Enfócate en algo super satisfactorio: la espuma cayendo por la pared negra, o el agua sucia resbalando hacia el desagüe. Puro ASMR visual." },
        { en: "Video walking through the space", es: "1 video caminando el espacio", tooltip: "Avanza lentamente por el área de trabajo mostrando todo lo que se está limpiando en ese momento. Máximo 10-15 segundos, sin moverte brusco." },
      ],
    },
    {
      id: "despues",
      titulo: "Al final",
      titleEn: "At the End",
      emoji: "✨",
      color: "cyan",
      items: [
        { en: "Strong video of the final result", es: "1 video fuerte del resultado final", tooltip: "Graba exactamente desde el mismo ángulo que grabaste el 'Video del problema principal' ahora TOTALMENTE LIMPIO para poder hacer un corte perfecto de transición." },
        { en: "Slow walkthrough of the finished area", es: "1 video caminando lentamente el área terminada", tooltip: "Recorre todo el espacio ya impecable caminando muy suave (estabiliza tu cuerpo). No muestres nada sucio, solo la gloria del trabajo final." },
        { en: "2 close-up videos of the final finish", es: "2 videos de cerca del acabado final", tooltip: "Igual que el de antes, enfoca el piso o la pared a pocos centímetros mostrando que no quedaron rayas, ni musgo, ni mugre." },
        { en: "1 wide final photo", es: "1 foto abierta final", tooltip: "Toma la misma foto general del 'Antes' pero ahora todo limpio. Importantísimo que sea el mismo ángulo para el antes/después." },
        { en: "2 detail photos of the final finish", es: "2 fotos de detalles finales", tooltip: "Foto nítida a los rincones, marcos de ventanas, o grietas que antes estaban sucias y ahora están impecables." },
      ],
    },
    {
      id: "humano",
      titulo: "Video humano",
      titleEn: "Human Video",
      emoji: "🎤",
      color: "navy",
      items: [
        { en: "Explaining what was done", es: "Explicando qué se hizo", tooltip: "Selfie (modo vlog): 'Acabamos de lavar a presión la entrada de esta casa de 3,000 sqft en la ciudad de...'" },
        { en: "Saying what problem the client had", es: "Diciendo qué problema tenía el cliente", tooltip: "Seguir grabando y contar: 'El cliente tenía años de acumulación negra por culpa de los árboles cercanos y le daba pena que lo vieran los vecinos'." },
        { en: "Saying why that process matters", es: "Diciendo por qué ese proceso importa", tooltip: "Voz de experto: 'Usamos este químico azul porque la boquilla roja habría destruido el acabado del ladrillo de esta casa del siglo 19'." },
        { en: "Reacting to the result or saying thank you", es: "Reaccionando al resultado o agradeciendo", tooltip: "Cerrar con energía: '¡Quedó brutal, parece concreto nuevo! Míralo nada más.' o grabando al cliente si se anima a decir 'Guau'." },
      ],
    },
  ],
  comoGrabar: {
    haz: [
      { en: "Record vertically with normal camera (1x) NO ZOOM", es: "Graba vertical con CÁMARA NORMAL EN 1X (Sin zoom)" },
      { en: "Use iPhone 17 or MagSafe neck mount", es: "Usa iPhone 17 o base de cuello con MagSafe para mayor calidad" },
      { en: "Short clips per room/area", es: "Tomas cortas por habitación (Muchos mini videos son mejor que uno largo)" },
      { en: "Find good lighting & High Quality", es: "Prioriza demasiado la nitidez y calidad visual" },
      { en: "Leave 2-3 seconds before and after", es: "Deja 2 o 3 segundos antes y después de cada toma" },
      { en: "Think in short, reusable clips", es: "Piensa en clips cortos y reutilizables" },
    ],
    evita: [
      { en: "Don't use GoPro for vertical social media", es: "Evita usar GoPro: Arruina la calidad al redimensionar a vertical (Déjala solo para YouTube)" },
      { en: "NO WIDE ANGLE LENS", es: "Nunca grabar en gran angular (0.5x), distorsiona la toma real" },
      { en: "Moving the phone too fast", es: "Mover demasiado el celular" },
      { en: "Sending only final result videos", es: "Mandar solo videos del resultado final" },
      { en: "Recording everything from one angle", es: "Grabar todo desde un solo ángulo" },
    ],
  },
  cercaSignifica: {
    titulo: "¿Qué significa grabar de cerca?",
    titleEn: "What does 'close-up' mean?",
    descripcion:
      "No es grabar todo el espacio. Es acercar el celular para que se vea claramente la textura, la suciedad, el brillo, el borde, el material o el cambio del piso.",
    descriptionEn:
      "It's not filming the whole space. It's bringing your phone close so you can clearly see the texture, the dirt, the shine, the edge, the material, or the change in the floor.",
    ejemplos: [
      {
        fase: "Problema",
        phaseEn: "Problem",
        items: [
          { en: "Dirt/grime", es: "Mugre" },
          { en: "Crack", es: "Grieta" },
          { en: "Wear and tear", es: "Desgaste" },
          { en: "Dirtiest spot", es: "Parte más sucia" },
        ],
      },
      {
        fase: "Proceso",
        phaseEn: "Process",
        items: [
          { en: "Tool working", es: "Herramienta trabajando" },
          { en: "Water coming out", es: "Agua saliendo" },
          { en: "Material being applied", es: "Material aplicándose" },
        ],
      },
      {
        fase: "Resultado",
        phaseEn: "Result",
        items: [
          { en: "Shine", es: "Brillo" },
          { en: "Texture", es: "Textura" },
          { en: "Flakes", es: "Flakes" },
          { en: "Metallic finish", es: "Acabado metálico" },
          { en: "Clean edge", es: "Borde limpio" },
        ],
      },
    ],
    regla: {
      en: "Stay still for 2-3 seconds so it's actually clear",
      es: "Quédate quieto 2 o 3 segundos para que sí se entienda",
    },
  },
  tiposEpoxy: [
    {
      nombre: "Epoxy Flake",
      descripcion: "Transformación, textura y preparación.",
      paraQue: [
        { en: "Before/after", es: "Before/after" },
        { en: "Finish detail", es: "Detalle de acabado" },
        { en: "Process Reels", es: "Reels de proceso" },
        { en: "Educational content", es: "Piezas educativas" },
      ],
    },
    {
      nombre: "Epoxy Metálico",
      descripcion: "Look premium y espacios personalizados.",
      paraQue: [
        { en: "Show variety", es: "Mostrar variedad" },
        { en: "Show shine", es: "Mostrar brillo" },
        { en: "Show high-end finish", es: "Mostrar acabado high-end" },
        { en: "Reinforce custom-work perception", es: "Reforzar percepción de trabajo a medida" },
      ],
    },
  ],
};
