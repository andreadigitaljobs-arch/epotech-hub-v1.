export interface RecordingAdvice {
  solo: string[];
  assisted: string[];
}

export interface SceneInstruction {
  whatToSay?: string;
  howToMove: string;
  gesture: string;
  demoUrl?: string;
}

export interface CameraInstruction {
  whereToStand: string;
  angle: string;
  movement: string;
  avoid: string;
  demoUrl?: string;
}

export interface ScriptScene {
  id: string;
  title: string;
  talent: SceneInstruction;
  camera: CameraInstruction;
}

export interface ScriptStep { 
  label: string; 
  script: string; 
  visualField: string; 
  visualStudio: string; 
  advice: RecordingAdvice;
}

export interface Script { 
  id: string; 
  title: string; 
  category: string; 
  service: 'Pressure Washing' | 'Window Cleaning' | 'Epoxy Floors' | 'Marca Personal'; 
  duration: string; 
  fullDialogue: string; 
  steps: ScriptStep[]; 
  scenes?: ScriptScene[];
  isPinned?: boolean;
  isProductionMode?: boolean;
  tips: string[]; 
  checklist: string[];
  productionHack?: string; 
}

export const guiones: Script[] = [
  {
    id: 'referencia-ventanas',
    title: '[REFERENCIA] Ventanas de Cristal (Fórmula Epotech)',
    category: 'Plantilla de Entrenamiento',
    service: 'Window Cleaning',
    duration: '45s',
    fullDialogue: 'Muchos creen que limpiar ventanas es solo pasar un trapo, pero en Utah, el agua dura no perdona. Si usas agua común, dejas minerales que opacan el vidrio para siempre. Por eso en Epotech usamos tecnología de agua pura. Este sistema filtra cada partícula para que el cristal seque solo y quede invisible. Es la diferencia entre una casa limpia y una casa que brilla de verdad. Mira este acabado, sin una sola raya. Si tu vista está borrosa por la suciedad, necesitas el estándar Epotech. Escríbeme y recuperemos la transparencia de tu hogar.',
    steps: [
      {
        label: 'GANCHO (El Problema)',
        script: 'Muchos creen que limpiar ventanas es solo pasar un trapo, pero en Utah, el agua dura no perdona. Si usas agua común, dejas minerales que opacan el vidrio para siempre.',
        visualField: 'Toma macro de una ventana con manchas de agua blanca y opaca.',
        visualStudio: 'Sebastián hablando seriamente frente a un ventanal sucio.',
        advice: {
          solo: ['Graba la ventana a contraluz para que se vea el sarro'],
          assisted: ['Toma de Sebastián señalando una mancha difícil']
        }
      },
      {
        label: 'LA SOLUCIÓN TÉCNICA',
        script: 'Por eso en Epotech usamos tecnología de agua pura. Este sistema filtra cada partícula para que el cristal seque solo y quede invisible.',
        visualField: 'Clip del sistema de filtros funcionando y el agua saliendo por el poste.',
        visualStudio: 'Toma de la herramienta de agua pura en acción.',
        advice: {
          solo: ['POV del agua pura mojando el vidrio'],
          assisted: ['Toma lateral de Sebastián operando el poste telescópico']
        }
      },
      {
        label: 'EL VALOR AGREGADO',
        script: 'Es la diferencia entre una casa limpia y una casa que brilla de verdad. Mira este acabado, sin una sola raya.',
        visualField: 'El squeegee bajando y dejando una franja de cristal perfecto.',
        visualStudio: 'Sebastián sonriendo al ver la transparencia.',
        advice: {
          solo: ['Graba el "Squeegee Pull" (muy satisfactorio)'],
          assisted: ['Cámara lenta del agua resbalando por el cristal limpio']
        }
      },
      {
        label: 'CIERRE Y CTA',
        script: 'Si tu vista está borrosa por la suciedad, necesitas el estándar Epotech. Escríbeme y recuperemos la transparencia de tu hogar.',
        visualField: 'Paseo fluido por la fachada con las ventanas brillando.',
        visualStudio: 'Sebastián con el logo Epotech, invitando a escribir.',
        advice: {
          solo: ['Toma de lejos de la casa completa'],
          assisted: ['Sebastián señalando el sticker de mensaje']
        }
      }
    ],
    tips: [
      'Usa el sonido real del squeegee en el vidrio, a la gente le encanta.',
      'Asegúrate de que el sol pegue en las ventanas limpias para el efecto brillo.',
      'Mantén el ritmo del vídeo rápido.'
    ],
    checklist: [
      'Ventana sucia grabada',
      'Clip del sistema de filtrado',
      'Squeegee pull (satisfying) grabado',
      'Fachada final brillante'
    ],
    productionHack: 'Limpia la lente de tu celular antes de grabar el resultado final.'
  }
];

export const guionesPresentacion: Script[] = [
  {
    id: 'presentacion-1',
    title: '1. ¿Quién soy y por qué Epotech?',
    category: 'PINNED: Confianza',
    service: 'Marca Personal',
    duration: '60s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'Hola, soy Sebastian. Fundé Epotech Solutions no solo para limpiar casas, sino para elevar el estándar de mantenimiento en Utah. Sé lo que significa cuidar un hogar y lo frustrante que es contratar a alguien que no respeta tu propiedad. Por eso, aquí no usamos solo agua, usamos tecnología de agua pura y técnicas industriales que garantizan resultados que duran el doble. Mi compromiso es que cuando mi equipo y yo nos retiremos, tu casa no solo se vea limpia, sino que recupere su valor. Si buscas a alguien que cuide tu hogar como si fuera suyo, bienvenido a la familia Epotech.',
    scenes: [
      {
        id: 'e1',
        title: 'ESCENA 1 — HOOK (AFUERA)',
        talent: {
          whatToSay: '“El mayor error al contratar limpieza… no es el precio.”',
          howToMove: 'Parado afuera de una casa (puede ser la tuya o de un familiar).',
          gesture: 'Mira a cámara, habla normal, no lo pienses mucho.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Ejemplo temporal
        },
        camera: {
          whereToStand: 'Ponte frente a él.',
          angle: 'Cámara a la altura del pecho/cara.',
          movement: 'No te muevas, graba estable.',
          avoid: 'No te acerques demasiado, deja espacio arriba de su cabeza.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' // Ejemplo temporal
        }
      },
      {
        id: 'e2',
        title: 'ESCENA 2 — PUERTA',
        talent: {
          whatToSay: '(Voz en off): “Es no saber a quién estás dejando entrar a tu casa.”',
          howToMove: 'Solo abre la puerta y entra de forma natural.',
          gesture: 'No hables aquí, solo acción fluida.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Ponte detrás o de lado (NO de frente).',
          angle: 'Plano medio de seguimiento.',
          movement: 'Síguelo un poco cuando entre (leve movimiento).',
          avoid: 'No le hables mientras graba, no cortes muy rápido.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'e3',
        title: 'ESCENA 3 — INTERIOR',
        talent: {
          whatToSay: '“Porque no es solo limpiar…”',
          howToMove: 'Ya dentro de la casa.',
          gesture: 'Mira el espacio, señala alrededor con seguridad.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Ponte frente a él.',
          angle: 'Plano medio (de cintura para arriba).',
          movement: 'Quédate quieta, plano estático.',
          avoid: 'No hagas zoom, no cambies de ángulo.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      }
    ],
    steps: [], // Se mantiene vacío para scripts de producción
    tips: [
      'Vístete con el uniforme de Epotech impecable.',
      'Graba en una zona con mucha luz natural.',
      'Este video DEBE estar fijado en la primera posición.'
    ],
    checklist: ['Uniforme limpio', 'Fondo ordenado', 'Tono de voz seguro', 'Logo visible'],
    productionHack: 'Este video es tu carta de presentación, graba 3 tomas y elige la que se sienta más natural.'
  },
  {
    id: 'presentacion-2',
    title: '2. ¿Qué ofrecemos exactamente?',
    category: 'PINNED: Servicios',
    service: 'Marca Personal',
    duration: '50s',
    fullDialogue: 'En Epotech nos especializamos en dos cosas: claridad total y superficies impecables. Primero: Limpieza de ventanas de alto nivel con sistema de agua pura. Nada de manchas de minerales, solo cristales invisibles. Segundo: Lavado a presión profesional para driveways, fachadas y techos. Eliminamos moho y suciedad acumulada sin dañar tus superficies. Usamos equipos industriales de alta eficiencia para que el trabajo sea rápido y perfecto. Si tu casa necesita un respiro y quieres verla brillar de nuevo, esto es lo que hacemos todos los días aquí en Utah.',
    steps: [
      {
        label: 'VISTA GENERAL',
        script: 'En Epotech nos especializamos en dos cosas: claridad total y superficies impecables.',
        visualField: 'Toma abierta de una casa de lujo en Utah.',
        visualStudio: 'Sebastian señalando la casa.',
        advice: {
          solo: ['Usa el gran angular de tu móvil'],
          assisted: ['Dron o toma desde la calle']
        }
      },
      {
        label: 'SERVICIO 1: VENTANAS',
        script: 'Primero: Limpieza de ventanas de alto nivel con sistema de agua pura. Nada de manchas de minerales, solo cristales invisibles.',
        visualField: 'Clip satisfactorio de limpieza de ventana.',
        visualStudio: 'Sebastian mostrando un cristal impecable.',
        advice: {
          solo: ['Toma de detalle del agua resbalando'],
          assisted: ['Toma de Sebastian operando el poste']
        }
      },
      {
        label: 'SERVICIO 2: PRESIÓN',
        script: 'Segundo: Lavado a presión profesional para driveways, fachadas y techos. Eliminamos moho y suciedad acumulada sin dañar tus superficies.',
        visualField: 'Cámara rápida de un driveway siendo limpiado.',
        visualStudio: 'Sebastian con la hidrolavadora.',
        advice: {
          solo: ['Toma del "Antes y Después" en pantalla'],
          assisted: ['Toma de acción con la boquilla turbo']
        }
      },
      {
        label: 'RESUMEN DE VALOR',
        script: 'Si tu casa necesita un respiro y quieres verla brillar de nuevo, esto es lo que hacemos todos los días aquí en Utah.',
        visualField: 'Sebastian caminando hacia la cámara con seguridad.',
        visualStudio: 'Fondo de una casa terminada.',
        advice: {
          solo: ['Caminar y hablar a la vez da dinamismo'],
          assisted: ['Toma de seguimiento caminando']
        }
      }
    ],
    tips: [
      'Usa clips de tus mejores trabajos anteriores.',
      'Habla con ritmo, que no sea lento.',
      'Pon texto en pantalla resaltando los servicios.'
    ],
    checklist: ['Clips de ventanas', 'Clips de presión', 'Texto de servicios', 'Energía alta'],
    productionHack: 'Usa transiciones rápidas entre servicios para mantener la atención.'
  },
  {
    id: 'presentacion-3',
    title: '3. ¿Cómo contratarnos? (Paso a Paso)',
    category: 'PINNED: Proceso',
    service: 'Marca Personal',
    duration: '45s',
    fullDialogue: 'Contratar a Epotech es más fácil que limpiar una ventana. Solo tienes que seguir estos 3 pasos: Uno, haz clic en el link de mi biografía o envíame un mensaje directo con la palabra INFO. Dos, agendamos una visita rápida o nos envías fotos de lo que necesitas. Tres, te damos un presupuesto transparente y fijamos el día de la transformación. Así de simple, sin complicaciones y con garantía de satisfacción. Si estás listo para que tu casa sea la envidia del vecindario, envíame ese mensaje ahora mismo. ¡Hablemos!',
    steps: [
      {
        label: 'FACILIDAD',
        script: 'Contratar a Epotech es más fácil que limpiar una ventana. Solo tienes que seguir estos 3 pasos:',
        visualField: 'Sebastian contando con los dedos a cámara.',
        visualStudio: 'Toma cercana, muy amigable.',
        advice: {
          solo: ['Graba en formato vertical 9:16'],
          assisted: ['Toma de Sebastian señalando hacia arriba']
        }
      },
      {
        label: 'PASO 1: CONTACTO',
        script: 'Uno, haz clic en el link de mi biografía o envíame un mensaje directo con la palabra INFO.',
        visualField: 'Grabación de pantalla de tu perfil de Instagram señalando el link.',
        visualStudio: 'Sebastian señalando el link invisible.',
        advice: {
          solo: ['Edita poniendo una captura de tu bio'],
          assisted: ['Toma de Sebastian escribiendo en su móvil']
        }
      },
      {
        label: 'PASO 2: AGENDA',
        script: 'Dos, agendamos una visita rápida o nos envías fotos de lo que necesitas.',
        visualField: 'Toma de Sebastian hablando por teléfono o revisando su agenda.',
        visualStudio: 'Tono servicial y atento.',
        advice: {
          solo: ['Usa un fondo de oficina o la camioneta'],
          assisted: ['Toma de Sebastian sonriendo al teléfono']
        }
      },
      {
        label: 'PASO 3: ACCIÓN',
        script: 'Tres, te damos un presupuesto transparente y fijamos el día de la transformación. Si estás listo, envía ese mensaje ahora mismo.',
        visualField: 'Sebastian señalando el sticker de "Enviar Mensaje".',
        visualStudio: 'Cierre con mucha energía.',
        advice: {
          solo: ['Apunta con el dedo a donde irá el sticker'],
          assisted: ['Toma de Sebastian con pulgar arriba']
        }
      }
    ],
    tips: [
      'Este video responde la duda: "¿Cómo empiezo?".',
      'Sé muy claro y directo.',
      'Usa un tono de "estoy listo para ayudarte".'
    ],
    checklist: ['Explicación de bio', 'Mención de DM', 'Presupuesto transparente', 'CTA final'],
    productionHack: 'Pon subtítulos grandes para que se entiendan los pasos sin audio.'
  },
  {
    id: 'presentacion-2',
    title: '2. El Estándar Epotech (Autoridad)',
    category: 'PINNED: Autoridad',
    service: 'Marca Personal',
    duration: '50s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'En Utah hay cientos de empresas de limpieza, pero muy pocas invierten en lo que nosotros invertimos. No se trata de echar agua a presión y ya, eso puede dañar tus paredes o tus pisos de epoxy. En Epotech usamos químicos biodegradables y sistemas de filtración que protegen tu inversión. Cuando contratas a un aficionado, pagas dos veces: por el servicio y por el daño. Con nosotros, pagas por la tranquilidad de un estándar industrial en tu propia casa. Aquí te muestro la diferencia real.',
    scenes: [
      {
        id: 'p2-e1',
        title: 'ESCENA 1 — LA COMPARACIÓN',
        talent: {
          whatToSay: '“Cualquiera puede mojar una pared, pero no cualquiera sabe cuidarla.”',
          howToMove: 'Sujetando una de las máquinas de Epotech, apuntando a la cámara.',
          gesture: 'Señala la máquina con orgullo.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Toma de medio cuerpo, ligeramente de lado.',
          angle: 'Casi a la altura de la máquina.',
          movement: 'Un pequeño zoom suave cuando él señale.',
          avoid: 'Que no se vea el desorden del camión atrás.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      }
    ]
  },
  {
    id: 'presentacion-3',
    title: '3. Resultados Garantizados (Prueba)',
    category: 'PINNED: Resultados',
    service: 'Marca Personal',
    duration: '45s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: '¿Quieres saber por qué nuestros clientes no nos cambian? Mira este piso. Estaba lleno de grasa y manchas de años. Después de nuestro proceso, no solo brilla, sino que es seguro y fácil de mantener. No vendemos promesas, vendemos resultados que puedes tocar. Si tu propiedad necesita este nivel de atención, envíame un mensaje directo ahora mismo. Hagamos que tu espacio vuelva a ser un lugar del que te sientas orgulloso.',
    scenes: [
      {
        id: 'p3-e1',
        title: 'ESCENA 1 — RESULTADO IMPACTO',
        talent: {
          whatToSay: '“Si tu piso no se ve así de limpio, entonces no has probado el Estándar Epotech.”',
          howToMove: 'Caminando sobre un piso de epoxy recién terminado.',
          gesture: 'Pulgar arriba al final.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Toma baja, siguiendo sus pies y subiendo a su cara.',
          angle: 'Contrapicado (desde abajo).',
          movement: 'Gimbal tracking (síguele el paso).',
          avoid: 'Cuidado con el reflejo de la cámara en el piso brillante.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      }
    ]
  }
];
