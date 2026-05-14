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
        { en: "1 video of the main problem", es: "1 video panorámico del espacio", tooltip: "Párate en una esquina y graba de lejos mostrando todo el lugar (pared a pared) en 1x. Sin recortar nada, para dar contexto de dónde están." },
        { en: "Video of the main problem", es: "1 video del problema a resolver", tooltip: "Acércate a la razón por la que te contrataron (ej. el techo roto, el piso sucio). Muestra el estado inicial." },
        { en: "2 close-up videos of the dirty/damaged area", es: "2 videos de cerca del área sucia", tooltip: "Pega el celular cerca del problema para que se note bien la suciedad o el daño." },
        { en: "1 wide photo", es: "1 foto general", tooltip: "Foto de todo el espacio antes de empezar a trabajar." },
        { en: "1 photo of the problem", es: "1 foto clara del problema real", tooltip: "Foto donde se aprecie claramente la suciedad o el daño. Mientras más real se vea, mejor será el resultado final." },
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
        { en: "Fixed tripod shot (Timelapse)", es: "1 toma de trípode fijo (Timelapse)", tooltip: "Deja el celular en un trípode apuntando a la zona de trabajo por 10 minutos. Lo capturas todo en modo normal y en edición se acelera. Magia pura de satisfacción." },
        { en: "POV chest camera shot", es: "1 toma POV (Cámara al Pecho)", tooltip: "Agarra el celular y sujétalo a la altura del pecho apuntando hacia abajo mientras trabajas. Sigue la línea perfecta entre lo sucio y lo limpio. El espectador siente que está ahí contigo." },
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
      titulo: "🎥 CONTENIDO HUMANO",
      subtitulo: "Humaniza la marca y genera confianza",
      emoji: "📱",
      color: "purple",
      items: [
        {
          es: "📍 Explicando qué se va a hacer",
          objetivo: "Dar contexto antes del trabajo.",
          grabar: "Graba la casa o área mientras caminas lentamente.",
          narrar: "Qué problema tiene, qué van a limpiar, qué resultado esperan.",
          regla: "❌ NO grabes tu cara obligatoriamente.",
          ejemplos: ["La entrada", "el concreto", "las ventanas", "el driveway", "herramientas"],
          duracion: "15-30 segundos.",
          demo: "“Hoy vamos a limpiar este driveway porque tenía mucha suciedad acumulada y manchas negras.”"
        },
        {
          es: "🧼 Explicando el problema del cliente",
          objetivo: "Hacer que el espectador diga: “mi casa también está así”.",
          grabar: "Acércate bastante al área sucia.",
          narrar: "Qué causó eso, por qué pasa, si puede empeorar.",
          detalles: ["Manchas", "mugre", "moho", "tierra", "líneas negras"],
          demo: "“Estas manchas negras normalmente salen por humedad y acumulación de suciedad con el tiempo.”"
        },
        {
          es: "🔥 Explicando por qué el proceso importa",
          objetivo: "Educar sin parecer profesor.",
          grabar: "Mientras trabajas: grabar agua, químicos, herramientas, limpieza.",
          narrar: "Por qué hacen ese paso, por qué usan cierta herramienta, qué diferencia hace.",
          demo: "“Usamos esta punta porque limpia profundo sin dañar el concreto.”"
        },
        {
          es: "👀 Mini vlog del trabajo (tipo POV)",
          objetivo: "Hacer sentir al espectador dentro del trabajo.",
          grabar: "Graba: llegando, bajando herramientas, preparando máquinas, conectando agua, caminando.",
          duracion: "Tomas cortas: 3-5 segundos.",
          regla: "Debe sentirse real, no busques perfección.",
          narrar: "Puedes hablar o no (narrar es documentar)."
        },
        {
          es: "😮 Reacción al resultado final",
          objetivo: "Transmitir satisfacción humana.",
          grabar: "Graba el resultado terminado.",
          regla: "Natural, NO actuar exagerado.",
          demo: "“Quedó brutal... mira la diferencia. Esto tomó varias horas pero valió la pena.”"
        },
        {
          es: "🛠️ Detrás de cámaras",
          objetivo: "Mostrar trabajo real.",
          grabar: "Preparando químicos, moviendo mangueras, setup, errores, cansancio, detalles reales.",
          regla: "Esto NO necesita verse perfecto. Mientras más real, mejor."
        },
        {
          es: "📖 Storytelling del trabajo",
          objetivo: "Convertir un trabajo normal en historia.",
          grabar: "Mientras grabas la propiedad explica: cuánto tiempo tomó, qué era lo más difícil, qué encontraron, qué cambió.",
          demo: "“Pensamos que esto iba a tomar dos horas y terminamos haciendo mucho más porque había demasiada suciedad acumulada.”"
        },
        {
          es: "🏡 Lifestyle / Marca personal ligera",
          objetivo: "Que la cuenta se sienta humana (NO influencer).",
          grabar: "Cosas simples: manejando al trabajo, café en la mañana, cargando herramientas, sunset después del trabajo, camino a casa.",
          regla: "NO actuar, solo documentar."
        }
      ],
    },
  ],
  comoGrabar: {
    haz: [
      { en: "Record vertically with normal camera (1x) NO ZOOM", es: "Graba vertical con CÁMARA NORMAL EN 1X (Sin zoom)" },
      { en: "Use iPhone 17 or MagSafe neck mount", es: "Usa iPhone 17 o base de cuello con MagSafe para mayor calidad" },
      { en: "Take many POV shots with your phone", es: "Haz muchas tomas POV con tu teléfono (Inmersión total)" },
      { en: "Document the process: truck, gear, and arrival", es: "Graba el proceso real: subiendo a la camioneta, bajando herramientas y llegada al sitio." },
      { en: "Record each other: captures Jenkryfer and team", es: "Grábense mutuamente: si Jenkryfer te acompaña, grábense en acción el uno al otro." },
      { en: "Use iPhone 17 dual camera (front and back)", es: "Graba con la doble cámara del iPhone 17 (Delantera y trasera)" },
      { en: "Leverage 0.5x wide angle for space context", es: "Aprovecha el 0.5 (Gran Angular) para tomas abiertas de espacios" },
      { en: "Short clips per room/area", es: "Tomas cortas por habitación (Muchos mini videos son mejor que uno largo)" },
      { en: "Find good lighting & High Quality", es: "Prioriza demasiado la nitidez y calidad visual" },
      { en: "Leave 2-3 seconds before and after", es: "Deja 2 o 3 segundos antes y después de cada toma" },
      { en: "Think in short, reusable clips", es: "Piensa en clips cortos y reutilizables" },
    ],
    evita: [
      { en: "Don't use GoPro in horizontal format", es: "Evita usar la GoPro en formato horizontal. Trata de voltear la cámara en vertical para capturar videos nativos. Esto mantiene la calidad excelente para redes sociales." },
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
