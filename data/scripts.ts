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
  service: 'Lavado a Presión' | 'Limpieza de Ventanas' | 'Pisos de Epoxi' | 'Marca Personal';
  duration: string;
  fullDialogue: string;
  steps: ScriptStep[];
  scenes?: ScriptScene[];
  isPinned?: boolean;
  isProductionMode?: boolean;
  tips: string[];
  checklist: string[];
  productionHack?: string;
  createdAt?: string;
}

export const guiones: Script[] = [
  {
    id: 'ejemplo-practica-oficial',
    title: '[EJEMPLO DE PRÁCTICA] Presentación Oficial Epotech',
    category: 'Plantilla de Entrenamiento',
    service: 'Marca Personal',
    duration: '20s',
    fullDialogue: '¿Listo para que tu propiedad destaque en Utah? Soy Sebastián, de Epotech Solutions. Nos especializamos en limpieza exterior de alto nivel y acabados de epoxi profesional para garajes y áreas deportivas. Dejamos tus espacios impecables de piso a techo. ¡Contáctanos y agenda tu cita!',
    steps: [
      {
        label: 'EL SALUDO (Voz en off)',
        script: '¿Listo para que tu propiedad destaque en Utah? Soy Sebastián, de Epotech Solutions.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Habla con energía, como si estuvieras saludando a un cliente en persona.'],
          assisted: ['Asegúrate de no tener ruidos de fondo (viento o máquinas).']
        }
      },
      {
        label: 'LA ESPECIALIDAD (Voz en off)',
        script: 'Nos especializamos en limpieza exterior de alto nivel y acabados de epoxi profesional para garajes y áreas deportivas.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pronuncia claro las palabras "alto nivel" y "profesional".'],
          assisted: ['Mantén un ritmo constante, sin correr.']
        }
      },
      {
        label: 'LA PROMESA (Voz en off)',
        script: 'Dejamos tus espacios impecables de piso a techo. ¡Contáctanos y agenda tu cita!',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Haz una pequeña pausa antes de "Contáctanos" para darle fuerza.'],
          assisted: ['Termina con un tono amable y profesional.']
        }
      }
    ],
    tips: [
      'Habla con entusiasmo, ¡eres el experto!',
      'Si te trabas, no pasa nada, dale a REHACER y repite solo esa parte.',
      'Usa el micrófono cerca para que tu voz se oiga potente.'
    ],
    checklist: [
      'Saludo grabado',
      'Especialidad grabada',
      'Llamado a la acción grabado'
    ],
    productionHack: 'Este video es tu carta de presentación. ¡Haz que brille!',
    createdAt: '2026-05-01'
  },
  {
    id: 'window-cleaning-zach-salt-lake',
    title: 'Reto de Limpieza de Ventanas en Salt Lake City',
    category: 'Guiones',
    service: 'Limpieza de Ventanas',
    duration: '60s',
    fullDialogue: "Nos llamaron a limpiar las ventanas de una casa de dos pisos en Salt Lake City. Pero nadie nos avisó que algunas estaban tan altas. No voy a mentir… esa parte fue un poco intimidante. Algunas ventanas eran muy altas, y llegar hasta ahí requiere enfoque, paciencia y las herramientas correctas. Así que bajamos todo de la camioneta: los limpiavidrios telescópicos, los aplicadores de microfibra, el jabón especializado para vidrios, los tobos y todos los implementos que necesitábamos para trabajar en altura. Empezamos desde el segundo piso. Por suerte, teníamos acceso a algunas de las ventanas superiores desde el techo, así que organizamos todo con cuidado y nos pusimos a trabajar. Con las herramientas adecuadas, pudimos alcanzar cada ventana y limpiarlas una por una. Y como siempre, Jen estaba ahí ayudándome con las herramientas, asistiendo durante el trabajo y grabando el proceso. Después de unas dos horas y media, todas las ventanas estaban limpias. Pero antes de irnos, siempre hacemos una revisión final por dentro y por fuera de la propiedad. Revisamos manchas, rayas, marcas y cualquier cosa que no se vea perfecta. Porque para nosotros, las ventanas limpias no se tratan solo de hacer que una casa se vea mejor. Se trata de hacer el trabajo bien. ¿Tú limpiarías ventanas tan altas?",
    steps: [
      {
        label: '1. EL GANCHO',
        script: 'Nos llamaron a limpiar las ventanas de una casa de dos pisos en Salt Lake City. Pero nadie nos avisó que algunas estaban tan altas.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono narrativo directo e intrigante. Dale énfasis a "tan altas" y haz una pausa al final.'],
          assisted: ['Evitar ruidos de fondo. Pronunciación clara.']
        }
      },
      {
        label: '2. LA HONESTIDAD',
        script: "No voy a mentir… esa parte fue un poco intimidante.",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Habla con naturalidad y un tono más suave en "un poco intimidante".'],
          assisted: ['Sonido limpio y cercano.']
        }
      },
      {
        label: '3. EL RETO Y LA PREPARACIÓN',
        script: 'Algunas ventanas eran muy altas, y llegar hasta ahí requiere enfoque, paciencia y las herramientas correctas. Así que bajamos todo de la camioneta: los limpiavidrios telescópicos, los aplicadores de microfibra, el jabón especializado para vidrios, los tobos y todos los implementos que necesitábamos para trabajar en altura.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pausa después de "enfoque" y "paciencia". Pronuncia bien la lista de herramientas.'],
          assisted: ['Mantén el ritmo y tono profesional.']
        }
      },
      {
        label: '4. LA EJECUCIÓN',
        script: 'Empezamos desde el segundo piso. Por suerte, teníamos acceso a algunas de las ventanas superiores desde el techo, así que organizamos todo con cuidado y nos pusimos a trabajar.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Dila con seguridad. Tono de alivio al decir "Por suerte".'],
          assisted: ['Tono constante con pausas naturales.']
        }
      },
      {
        label: '5. VENTANA POR VENTANA',
        script: 'Con las herramientas adecuadas, pudimos alcanzar cada ventana y limpiarlas una por una.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Dale peso a "una por una" al terminar.'],
          assisted: ['Tono de logro y avance.']
        }
      },
      {
        label: '6. TRABAJO EN EQUIPO Y FINALIZACIÓN',
        script: 'Y como siempre, Jen estaba ahí ayudándome con las herramientas, asistiendo durante el trabajo y grabando el proceso. Después de unas dos horas y media, todas las ventanas estaban limpias.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Menciona a Jen con gratitud. Termina con satisfacción, celebrando haber terminado.'],
          assisted: ['Voz clara y amigable. Tono de victoria al final.']
        }
      },
      {
        label: '7. REVISIÓN DE CALIDAD',
        script: "Pero antes de irnos, siempre hacemos una revisión final por dentro y por fuera de la propiedad. Revisamos manchas, rayas, marcas y cualquier cosa que no se vea perfecta.",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono serio y meticuloso. Pausa en "revisión final".'],
          assisted: ['Voz firme. Pronuncia con claridad "manchas, rayas, marcas".']
        }
      },
      {
        label: '8. NUESTRO ESTÁNDAR Y LLAMADA A LA ACCIÓN',
        script: "Porque para nosotros, las ventanas limpias no se tratan solo de hacer que una casa se vea mejor. Se trata de hacer el trabajo bien. ¿Tú limpiarías ventanas tan altas?",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['La frase "hacer el trabajo bien" es la insignia — dila con total convicción. Cierra con la pregunta directa al espectador.'],
          assisted: ['Voz profesional y segura hasta el final.']
        }
      }
    ],
    tips: [
      'Usa un tono narrativo (storytelling), contando una experiencia real.',
      'Pronuncia los nombres de los lugares ("Salt Lake City") de forma clara.',
      'Haz pausas dramáticas en los puntos clave (ej. "...algunas estaban tan altas").'
    ],
    checklist: [
      'Paso 1: Gancho grabado (llamado y sorpresa de la altura)',
      'Paso 2: Honestidad grabada',
      'Paso 3: Reto y preparación grabados (herramientas)',
      'Paso 4: Ejecución grabada (segundo piso y techo)',
      'Paso 5: Limpieza ventana por ventana grabada',
      'Paso 6: Trabajo en equipo y finalización grabados',
      'Paso 7: Revisión de calidad grabada',
      'Paso 8: Estándar de marca y llamada a la acción grabados'
    ],
    productionHack: 'Muestra tomas rápidas en timelapse del trabajo en el techo y tomas de primer plano de la escobilla telescópica arrastrando el agua por el vidrio.',
    createdAt: '2026-06-19'
  },
  {
    id: 'window-cleaning-problem-solution',
    title: 'Problema/Solución de Ventanas Sucias',
    category: 'Guiones',
    service: 'Limpieza de Ventanas',
    duration: '45s',
    fullDialogue: "Las ventanas limpias pueden cambiar completamente la apariencia y sensación de tu hogar. A veces las ventanas no se ven tan sucias desde lejos, pero cuando les da el sol, puedes ver polvo, manchas de agua, huellas y residuos acumulados. Por eso la limpieza profesional de ventanas hace una diferencia tan grande. En Epotech Solutions, ayudamos a los dueños de casas en Utah a mantener sus ventanas limpias, transparentes y en mejor estado. Si tus ventanas necesitan una renovación, mándanos un mensaje hoy para un presupuesto gratis.",
    steps: [
      {
        label: '1. EL GANCHO',
        script: 'Las ventanas limpias pueden cambiar completamente la apariencia y sensación de tu hogar.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono calmado y seguro. Deja que la frase aterrice antes de continuar.'],
          assisted: ['Sonido limpio, sin ruido de fondo.']
        }
      },
      {
        label: '2. EL PROBLEMA',
        script: "A veces las ventanas no se ven tan sucias desde lejos, pero cuando les da el sol, puedes ver polvo, manchas de agua, huellas y residuos acumulados.",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Habla con tono de revelación. Pausa después de "desde lejos".'],
          assisted: ['Pronuncia con claridad "manchas de agua" y "huellas".']
        }
      },
      {
        label: '3. LA SOLUCIÓN',
        script: "Por eso la limpieza profesional de ventanas hace una diferencia tan grande.",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono de convicción. Es la frase clave del guion.'],
          assisted: ['Voz firme y directa.']
        }
      },
      {
        label: '4. LA MARCA',
        script: 'En Epotech Solutions, ayudamos a los dueños de casas en Utah a mantener sus ventanas limpias, transparentes y en mejor estado.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pronuncia "Epotech Solutions" con orgullo. Ritmo pausado.'],
          assisted: ['Tono profesional y confiable.']
        }
      },
      {
        label: '5. LLAMADA A LA ACCIÓN',
        script: 'Si tus ventanas necesitan una renovación, mándanos un mensaje hoy para un presupuesto gratis.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono amigable e invitador. Sonríe levemente al terminar.'],
          assisted: ['Clara y directa al espectador.']
        }
      }
    ],
    tips: [
      'Mantén un ritmo constante y narrativo en todo el guion.',
      'La frase clave es "hace una diferencia tan grande" — dale peso.',
      'La llamada a la acción final debe sonar natural, no forzada.'
    ],
    checklist: [
      'Paso 1: Gancho grabado',
      'Paso 2: Problema de las ventanas sucias grabado',
      'Paso 3: Solución profesional grabada',
      'Paso 4: Marca Epotech grabada',
      'Paso 5: Llamada a la acción final grabada'
    ],
    productionHack: 'Muestra tomas de ventanas sucias vs limpias para acompañar la voz en off.',
    createdAt: '2026-06-19'
  },
  {
    id: 'window-cleaning-trust-walkthrough',
    title: 'Revisión Final: Confianza y Calidad',
    category: 'Guiones',
    service: 'Limpieza de Ventanas',
    duration: '45s',
    fullDialogue: "Una cosa que siempre hacemos antes de terminar un trabajo es una revisión final. Revisamos el trabajo desde diferentes ángulos, buscamos manchas, marcas, detalles que se nos puedan escapar y cualquier cosa que necesite un último retoque. Para nosotros, la limpieza exterior no se trata solo de terminar rápido. Se trata de asegurarnos de que el resultado se vea limpio, profesional y listo para el dueño de la casa. Esa atención al detalle es parte de cómo trabajamos en Epotech Solutions. ¿Necesitas limpieza exterior en Utah? Mándanos un mensaje hoy para un presupuesto gratis.",
    steps: [
      {
        label: '1. EL HÁBITO',
        script: 'Una cosa que siempre hacemos antes de terminar un trabajo es una revisión final.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono serio y comprometido. Pausa en "revisión final".'],
          assisted: ['Voz clara y profesional.']
        }
      },
      {
        label: '2. EL PROCESO',
        script: 'Revisamos el trabajo desde diferentes ángulos, buscamos manchas, marcas, detalles que se nos puedan escapar y cualquier cosa que necesite un último retoque.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Habla con meticulosidad. Lista cada elemento con claridad.'],
          assisted: ['Ritmo pausado entre cada item de la lista.']
        }
      },
      {
        label: '3. NUESTRO ESTÁNDAR',
        script: "Para nosotros, la limpieza exterior no se trata solo de terminar rápido. Se trata de asegurarnos de que el resultado se vea limpio, profesional y listo para el dueño de la casa.",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Esta es la frase insignia. Dila con total convicción. Pausa entre las dos frases.'],
          assisted: ['Voz firme. Énfasis en "limpio, profesional y listo".']
        }
      },
      {
        label: '4. LA IDENTIDAD',
        script: 'Esa atención al detalle es parte de cómo trabajamos en Epotech Solutions.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono de orgullo. Es la declaración de identidad de marca.'],
          assisted: ['Pronuncia "Epotech Solutions" con confianza.']
        }
      },
      {
        label: '5. LLAMADA A LA ACCIÓN',
        script: '¿Necesitas limpieza exterior en Utah? Mándanos un mensaje hoy para un presupuesto gratis.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pregunta directa al espectador. Cierra con tono amigable.'],
          assisted: ['Natural y cercano al final.']
        }
      }
    ],
    tips: [
      'El guion tiene un arco claro: hábito → proceso → estándar → identidad → acción.',
      'La frase del paso 3 es la más importante del guion.',
      'Habla como si le explicaras a un cliente por qué haces las cosas bien.'
    ],
    checklist: [
      'Paso 1: Hábito del walkthrough grabado',
      'Paso 2: Proceso de revisión grabado',
      'Paso 3: Estándar de calidad grabado',
      'Paso 4: Identidad de marca grabada',
      'Paso 5: Llamada a la acción final grabada'
    ],
    productionHack: 'Graba clips de la revisión real en el trabajo para acompañar cada parte del guion.',
    createdAt: '2026-06-19'
  },
  {
    id: 'pressure-washing-service',
    title: 'Servicio de Lavado a Presión en Utah',
    category: 'Guiones',
    service: 'Lavado a Presión',
    duration: '45s',
    fullDialogue: 'El camino de entrada a tu casa es una de las primeras cosas que la gente ve al llegar. Con el tiempo, la suciedad, las manchas, el polvo y los residuos acumulados pueden hacer que se vea más viejo de lo que realmente está. El lavado a presión ayuda a devolverle un aspecto más limpio y fresco a tus superficies exteriores. En Epotech Solutions, ofrecemos servicios profesionales de lavado a presión para dueños de casas en Utah. Si el camino de entrada, el garaje o las superficies exteriores de tu casa necesitan limpieza, mándanos un mensaje hoy para un presupuesto gratis.',
    steps: [
      {
        label: '1. EL GANCHO',
        script: 'El camino de entrada a tu casa es una de las primeras cosas que la gente ve al llegar.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono directo e impactante. Habla como si lo estuvieras señalando.'],
          assisted: ['Pronunciación clara y segura.']
        }
      },
      {
        label: '2. EL PROBLEMA',
        script: 'Con el tiempo, la suciedad, las manchas, el polvo y los residuos acumulados pueden hacer que se vea más viejo de lo que realmente está.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Lista cada elemento con claridad. Pausa leve en "más viejo de lo que realmente está".'],
          assisted: ['Ritmo constante, tono de advertencia.']
        }
      },
      {
        label: '3. LA SOLUCIÓN',
        script: 'El lavado a presión ayuda a devolverle un aspecto más limpio y fresco a tus superficies exteriores.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono de solución y alivio. Pronuncia "lavado a presión" con confianza.'],
          assisted: ['Énfasis en "más limpio y fresco".']
        }
      },
      {
        label: '4. LA MARCA',
        script: 'En Epotech Solutions, ofrecemos servicios profesionales de lavado a presión para dueños de casas en Utah.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pronuncia "Epotech Solutions" con orgullo. Tono profesional.'],
          assisted: ['Voz segura y directa.']
        }
      },
      {
        label: '5. LLAMADA A LA ACCIÓN',
        script: 'Si el camino de entrada, el garaje o las superficies exteriores de tu casa necesitan limpieza, mándanos un mensaje hoy para un presupuesto gratis.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Cierra con tono amigable y accesible. Sonríe levemente.'],
          assisted: ['Natural y cercano.']
        }
      }
    ],
    tips: [
      'Menciona "camino de entrada" y "garaje" para conectar con problemas reales del cliente.',
      'La palabra "lavado a presión" debe sonar segura y profesional.',
      'El ritmo debe ser constante — no demasiado rápido ni demasiado lento.'
    ],
    checklist: [
      'Paso 1: Gancho del camino de entrada grabado',
      'Paso 2: Problema del tiempo y suciedad grabado',
      'Paso 3: Solución de lavado a presión grabada',
      'Paso 4: Marca Epotech grabada',
      'Paso 5: Llamada a la acción final grabada'
    ],
    productionHack: 'Muestra un antes/después del camino de entrada limpio vs sucio para acompañar la voz en off.',
    createdAt: '2026-06-19'
  }
];

export const guionesPresentacion: Script[] = [
  {
    id: 'presentacion-1',
    title: '1. ¿Quién soy y por qué Epotech? (Confianza)',
    category: 'VIDEO FIJADO: Confianza',
    service: 'Marca Personal',
    duration: '60s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'El error más grande al contratar un servicio de limpieza… no es el precio. Es no saber quién estás dejando entrar a tu casa. Porque no es solo limpiar… es entrar a tu espacio, donde están tu familia, tus cosas y tu tranquilidad. Me llamo Sebastián. Y cada vez que trabajamos en una propiedad, la tratamos como si fuera nuestra. Nos importa, la respetamos y la dejamos mejor de como la encontramos. Porque al final… todo se trata de confianza. Si eso es lo que estás buscando, escríbenos.',
    scenes: [
      {
        id: 'p1-e1',
        title: '🎬 ESCENA 1 — GANCHO (AFUERA)',
        talent: {
          whatToSay: '"El error más grande al contratar un servicio de limpieza… no es el precio."',
          howToMove: 'Parado afuera de una casa. Mira directo a cámara.',
          gesture: 'Habla normal (no actuado). Quédate quieto.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Ponte frente a él.',
          angle: 'Cámara a la altura del pecho/cara.',
          movement: 'Mantén el celular estable. Deja espacio arriba de su cabeza.',
          avoid: 'No te acerques demasiado. No te muevas.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p1-e2',
        title: '🎬 ESCENA 2 — PUERTA (ACCIÓN)',
        talent: {
          whatToSay: '"Es no saber quién estás dejando entrar a tu casa."',
          howToMove: 'Ubícate adentro de la casa con la puerta cerrada. Abre la puerta y apenas asomes, di la frase mirando a la cámara.',
          gesture: 'Gesto de bienvenida natural al abrir la puerta.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Quédate afuera, de pie frente a la puerta cerrada.',
          angle: 'Plano medio de la puerta.',
          movement: 'Empieza a grabar la puerta cerrada. Cuando Sebastián la abra, da unos pasos lentos acercándote hacia él.',
          avoid: 'No hagas movimientos bruscos al caminar.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p1-e3',
        title: '🎬 ESCENA 3 — INTERIOR (CONEXIÓN)',
        talent: {
          whatToSay: '"Porque no es solo limpiar… es entrar a tu espacio, donde están tu familia, tus cosas y tu tranquilidad."',
          howToMove: 'Mira alrededor, señala el lugar, señala hacia arriba o al lado, señala objetos cerca.',
          gesture: 'Gesto calmado (mano al pecho o suave).',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'En la sala o comedor. Ponte frente a él.',
          angle: 'Plano de cintura hacia arriba.',
          movement: 'Quédate quieta.',
          avoid: 'No cambies ángulo. No hagas zoom.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p1-e4',
        title: '🎬 ESCENA 4 — AUTORIDAD (TRABAJO)',
        talent: {
          whatToSay: '"Me llamo Sebastián. Y cada vez que trabajamos en una propiedad, la tratamos como si fuera nuestra. Nos importa, la respetamos y la dejamos mejor de como la encontramos."',
          howToMove: 'Mirando a cámara. Movimiento leve (natural). Señala el piso / área.',
          gesture: 'Gesto con manos. Señala resultado.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'En la cocina (apoyado en la isla). Graba en diagonal.',
          angle: 'Plano medio.',
          movement: 'Mantén estabilidad.',
          avoid: 'No grabes muy lejos. No cortes antes de que termine.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p1-e5',
        title: '🎬 ESCENA 5 — CIERRE Y LLAMADA A LA ACCIÓN',
        talent: {
          whatToSay: '"Porque al final… todo se trata de confianza. Si eso es lo que estás buscando, escríbenos."',
          howToMove: 'Pausa corta. Mira directo a cámara.',
          gesture: 'Serio, seguro.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'En el patio o pasillo interior de la casa.',
          angle: 'Cámara fija.',
          movement: 'Buen encuadre.',
          avoid: 'No te muevas.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      }
    ],
    steps: [],
    tips: [
      'La clave es la naturalidad en la Escena 2.',
      'Mantén un tono pausado y seguro.',
      'Asegúrate de que la casa de fondo se vea impecable.'
    ],
    checklist: ['Gancho afuera', 'Acción puerta', 'Conexión interior', 'Autoridad', 'Cierre confianza'],
    productionHack: 'Usa luz natural de la mañana para la escena de afuera.',
    createdAt: '2026-05-05'
  },
  {
    id: 'presentacion-2',
    title: '2. ¿Qué hacemos? (Autoridad y Valor)',
    category: 'VIDEO FIJADO: Autoridad',
    service: 'Marca Personal',
    duration: '75s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'Si el piso de tu entrada se ve así… ya se está dañando. Y la mayoría de la gente cree que es solo suciedad. Pero no lo es. Son manchas que se hunden, residuos que causan desgaste y superficies que lentamente… se deterioran. Y cuando te das cuenta… ya es más caro repararlo. Por eso nosotros no solo limpiamos. Restauramos, protegemos y transformamos espacios con limpieza profesional, epoxi y pintura que de verdad dura. No es solo estética. Es cuidar lo que te costó dinero. Mira cómo puede quedar así de nuevo en nuestro perfil.',
    scenes: [
      {
        id: 'p2-e1',
        title: '🎬 ESCENA 1 — GANCHO',
        talent: {
          whatToSay: '"Si el piso de tu entrada se ve así… ya se está dañando."',
          howToMove: 'OPCIÓN 1: Párate en un camino de entrada sucio y señala el piso. OPCIÓN 2: Párate en la sala y señala hacia arriba (para poner foto del piso en edición).',
          gesture: 'Autoridad, advertencia.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'OPCIÓN 1: Afuera en el camino de entrada. OPCIÓN 2: En la sala, dejando aire arriba en el encuadre.',
          angle: 'Plano medio.',
          movement: 'Fijo.',
          avoid: 'Moverse mucho.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e2',
        title: '🎬 ESCENA 2 — ERROR (ÁNGULO)',
        talent: {
          whatToSay: '"Y la mayoría de la gente cree que es solo suciedad."',
          howToMove: 'Camina un paso lateral.',
          gesture: 'Gesto leve de negación.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'OPCIÓN 1: Acera del camino de entrada. OPCIÓN 2: Desde otro ángulo en la sala.',
          angle: 'Ángulo diagonal (cambio visual).',
          movement: 'Acompaña el paso levemente.',
          avoid: 'Frontal perfecto.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e3',
        title: '🎬 ESCENA 3 — EXPLICACIÓN (ACCIÓN)',
        talent: {
          whatToSay: '"Pero no lo es. Son manchas que se hunden, residuos que causan desgaste y superficies que lentamente… se deterioran."',
          howToMove: 'OPCIÓN 1: Agáchate y pasa la mano por el piso sucio. OPCIÓN 2: De pie, señala a los lados para fotos de apoyo.',
          gesture: 'Mira la superficie o las "fotos imaginarias" (no a cámara).',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'OPCIÓN 1: Cerca de la superficie. OPCIÓN 2: Frente a él en la sala.',
          angle: 'Plano detalle / cercano.',
          movement: 'Enfoca manos y acción.',
          avoid: 'Dejar espacio arriba innecesario.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e4',
        title: '🎬 ESCENA 4 — CONSECUENCIA',
        talent: {
          whatToSay: '"Y cuando te das cuenta… ya es más caro repararlo."',
          howToMove: 'OPCIÓN 1: Caminando por el camino de entrada. OPCIÓN 2: Caminando por el pasillo/sala de la casa.',
          gesture: 'Mira a cámara al final de la frase.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Siguiéndolo.',
          angle: 'Plano medio natural.',
          movement: 'Síguelo caminando (leve movimiento).',
          avoid: 'Perfección estática.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e5',
        title: '🎬 ESCENA 5 — SOLUCIÓN',
        talent: {
          whatToSay: '"Por eso nosotros no solo limpiamos. Restauramos, protegemos y transformamos espacios con limpieza profesional, epoxi y pintura que de verdad dura."',
          howToMove: 'En área de trabajo / garaje. Señala herramientas o área. Toma algo (manguera/herramienta).',
          gesture: 'Mirando a cámara, seguro.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Frente a él.',
          angle: 'Plano medio, ángulo ligeramente bajo.',
          movement: 'Estable.',
          avoid: 'Ángulo cenital.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e6',
        title: '🎬 ESCENA 6 — CIERRE',
        talent: {
          whatToSay: '"No es solo estética. Es cuidar lo que te costó dinero."',
          howToMove: 'Lugar limpio / neutro.',
          gesture: 'Mano al pecho o gesto firme.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'En el patio trasero, con fondo limpio.',
          angle: 'Plano limpio.',
          movement: 'Cámara fija.',
          avoid: 'Fondo desordenado.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e7',
        title: '🎬 ESCENA 7 — LLAMADA A LA ACCIÓN',
        talent: {
          whatToSay: '"Mira cómo puede quedar así de nuevo en nuestro perfil."',
          howToMove: 'Señala hacia arriba.',
          gesture: 'Invitación, sonrisa.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Cerca de la van de Epotech o entrada principal.',
          angle: 'Plano estable.',
          movement: 'Deja espacio arriba para overlay.',
          avoid: 'Cortar la cabeza.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      }
    ],
    steps: [],
    tips: [
      'Cambia de lugar al menos en 3-4 escenas.',
      'Usa ángulos diagonales para mayor dinamismo.',
      'Asegúrate de que las manos de Sebastián se vean en la Escena 3.'
    ],
    checklist: ['Gancho Camino Entrada', 'Cambio Ángulo', 'Acción Superficie', 'Caminata Natural', 'Autoridad Herramientas', 'Cierre Emocional', 'CTA Overlay'],
    productionHack: 'En la Escena 7, deja suficiente aire arriba para colocar los resultados Antes/Después.',
    createdAt: '2026-05-06'
  },
  {
    id: 'presentacion-3',
    title: '3. Resultados Garantizados (Reseñas)',
    category: 'VIDEO FIJADO: Resultados',
    service: 'Marca Personal',
    duration: '90s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'Esto es lo primero que hace la mayoría de la gente antes de elegirnos… Ver nuestras reseñas. Y eso es completamente válido. Porque hoy hay muchas opciones… y no siempre es fácil saber cuál elegir. Por eso dejamos que quienes ya trabajaron con nosotros hablen por nosotros. Hemos trabajado con más de 100 clientes, y cada espacio es diferente. Por eso lo hacemos simple: nos escribes, vemos tu espacio y te explicamos exactamente lo que necesitas. Sin presión, sin complicaciones. Solo haciendo el trabajo bien para que tengas tranquilidad con el resultado. Puedes ver nuestras reseñas… y decidir con total confianza.',
    scenes: [
      {
        id: 'p3-e1',
        title: '🎬 ESCENA 1 — GANCHO',
        talent: {
          whatToSay: '"Esto es lo primero que hace la mayoría de la gente antes de elegirnos…"',
          howToMove: 'Afuera de la casa. Mira a cámara.',
          gesture: 'Gesto leve de intriga.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Frente a él.',
          angle: 'Plano medio frontal.',
          movement: 'Estable.',
          avoid: 'Cortar antes de tiempo.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p3-e2',
        title: '🎬 ESCENA 2 — RESEÑAS',
        talent: {
          whatToSay: '"Ver nuestras reseñas."',
          howToMove: 'Señala hacia arriba.',
          gesture: 'Seguridad, invitación visual.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'En la sala, Sebastián sentado en el sofá.',
          angle: 'Plano limpio.',
          movement: 'Deja espacio arriba (para overlay de estrellas).',
          avoid: 'No dejar aire arriba.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p3-e3',
        title: '🎬 ESCENA 3 — VALIDACIÓN',
        talent: {
          whatToSay: '"Y eso es completamente válido."',
          howToMove: 'Cambia posición levemente.',
          gesture: 'Asiente con la cabeza, natural.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'En la cocina, Sebastián apoyado en la encimera.',
          angle: 'Ángulo diagonal.',
          movement: 'Mantén el plano.',
          avoid: 'Frontal repetitivo.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p3-e4',
        title: '🎬 ESCENA 4 — OPCIONES',
        talent: {
          whatToSay: '"Porque hoy hay muchas opciones… y no siempre es fácil saber cuál elegir."',
          howToMove: 'Caminando por entrada / camino de acceso.',
          gesture: 'Mira a cámara al final de la frase.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Siguiéndolo.',
          angle: 'Plano medio dinámico.',
          movement: 'Síguelo caminando (suave).',
          avoid: 'Sacudidas bruscas.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p3-e5',
        title: '🎬 ESCENA 5 — PRUEBA SOCIAL',
        talent: {
          whatToSay: '"Por eso dejamos que quienes ya trabajaron con nosotros hablen por nosotros."',
          howToMove: 'Frente a pared o fondo limpio.',
          gesture: 'Señala hacia arriba.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Frente a una pared limpia (interior o exterior).',
          angle: 'Plano estable.',
          movement: 'Deja espacio arriba (para 3-5 reseñas).',
          avoid: 'Zoom innecesario.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p3-e6',
        title: '🎬 ESCENA 6 — EXPERIENCIA',
        talent: {
          whatToSay: '"Hemos trabajado con más de 100 clientes, y cada espacio es diferente."',
          howToMove: 'En el área de trabajo.',
          gesture: 'Señala alrededor, gesto abierto.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Diagonal.',
          angle: 'Plano medio, ángulo bajo.',
          movement: 'Estable.',
          avoid: 'Perder el fondo de trabajo.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p3-e7',
        title: '🎬 ESCENA 7 — PROCESO',
        talent: {
          whatToSay: '"Por eso lo hacemos simple: nos escribes, vemos tu espacio y te explicamos exactamente lo que necesitas."',
          howToMove: 'Acércate un poco a cámara. Gesto de celular. Señala alrededor.',
          gesture: 'Señala a cámara al final.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'En el patio trasero o terraza de la casa.',
          angle: 'Plano más cercano.',
          movement: 'Fijo.',
          avoid: 'Desenfoque al acercarse.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p3-e8',
        title: '🎬 ESCENA 8 — TRANQUILIDAD',
        talent: {
          whatToSay: '"Sin presión, sin complicaciones. Solo haciendo el trabajo bien para que tengas tranquilidad con el resultado."',
          howToMove: 'Pausa leve.',
          gesture: 'Gesto relajado. Mano al pecho.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'En el garaje o área de trabajo terminada.',
          angle: 'Plano medio.',
          movement: 'Sin movimiento.',
          avoid: 'Distracciones en el fondo.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p3-e9',
        title: '🎬 ESCENA 9 — LLAMADA A LA ACCIÓN',
        talent: {
          whatToSay: '"Puedes ver nuestras reseñas… y decidir con total confianza."',
          howToMove: 'Mira directo a cámara.',
          gesture: 'Señala hacia arriba, sonrisa segura.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'En la puerta principal, Sebastián mirando hacia afuera.',
          angle: 'Plano limpio.',
          movement: 'Deja espacio arriba para reseñas finales.',
          avoid: 'Cortar el gesto de señalar.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      }
    ],
    steps: [],
    tips: [
      'Asegúrate de dejar suficiente aire arriba en las escenas 2, 5 y 9.',
      'El tono debe ser honesto y tranquilo.',
      'Cambia de lugar al menos 4 veces durante el video.'
    ],
    checklist: ['Gancho Curiosidad', 'Reseñas (Overlay)', 'Validación Ángulo', 'Caminata Natural', 'Prueba Social Fuerte', 'Autoridad Clientes', 'Proceso Simple', 'Cierre Tranquilidad', 'CTA Reseñas'],
    productionHack: 'Captura pantallas de tus mejores reseñas de Google/Yelp para usarlas como overlays en edición.',
    createdAt: '2026-05-07'
  }
];
