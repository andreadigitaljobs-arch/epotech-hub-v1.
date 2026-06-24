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

export type PilarContenido = 'Transformaciones' | 'Errores' | 'Herramientas' | 'Proceso' | 'Experiencia';

export const PILARES_INFO: Record<PilarContenido, { emoji: string; descripcion: string; ejemplos: string[] }> = {
  'Transformaciones': {
    emoji: '✨',
    descripcion: 'Before & after de trabajos reales',
    ejemplos: ['Ventanas', 'Driveways', 'Epoxi', 'Canchas'],
  },
  'Errores': {
    emoji: '⚠️',
    descripcion: 'Corrección de mitos y errores comunes',
    ejemplos: ['El error más común al limpiar ventanas', 'Por qué más presión no es mejor', 'Lo que nunca haría en mi casa'],
  },
  'Herramientas': {
    emoji: '🔧',
    descripcion: 'Explicación del equipo profesional',
    ejemplos: ['Por qué uso esta Surface Cleaner', 'La diferencia entre estas dos boquillas', 'La herramienta que más tiempo me ahorra'],
  },
  'Proceso': {
    emoji: '📋',
    descripcion: 'Cómo se hace el trabajo paso a paso',
    ejemplos: ['Lo que nadie ve antes del epoxi', 'Por qué el lijado es tan importante', 'El paso que arruina la mayoría de los pisos'],
  },
  'Experiencia': {
    emoji: '🎙️',
    descripcion: 'Historias y lecciones personales',
    ejemplos: ['Lo que aprendí limpiando casas en Utah', 'El trabajo más difícil que me ha tocado', 'El error más grande cuando empecé'],
  },
};

export interface Script {
  id: string;
  title: string;
  category: string;
  service: 'Lavado a Presión' | 'Limpieza de Ventanas' | 'Pisos de Epoxi' | 'Marca Personal';
  pilar?: PilarContenido;
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
    pilar: 'Experiencia',
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
    pilar: 'Experiencia',
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
    id: 'pressure-washing-pregunta-frecuente',
    title: 'La Pregunta Que Más Me Hacen',
    category: 'Guiones',
    service: 'Lavado a Presión',
    pilar: 'Errores',
    duration: '45s',
    fullDialogue: 'Una de las preguntas que más me hacen los clientes es: "¿De verdad el lavado a presión hace tanta diferencia?" Y mi respuesta siempre es la misma. Mira esto. La mayoría de las veces la gente se acostumbra a ver la suciedad todos los días. La ven tan seguido que dejan de notarla. Pero cuando limpias correctamente una superficie, la diferencia es enorme. El color cambia. La apariencia cambia. Y toda la propiedad se ve más cuidada. Por eso muchas veces no necesitas reemplazar nada. Solo devolverle la limpieza que perdió con los años. Si quieres ver cómo se vería tu propiedad después de una limpieza profesional, envíanos un mensaje.',
    steps: [
      {
        label: '1. EL GANCHO',
        script: 'Una de las preguntas que más me hacen los clientes es: "¿De verdad el lavado a presión hace tanta diferencia?"',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono conversacional, como si le hablaras directamente a un cliente. Haz una pausa breve antes de la pregunta.'],
          assisted: ['Sonido limpio. La pregunta debe sonar natural, no leída.']
        }
      },
      {
        label: '2. LA RESPUESTA',
        script: 'Y mi respuesta siempre es la misma. Mira esto.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pausa corta después de "la misma". "Mira esto" debe sonar directo, con confianza.'],
          assisted: ['Tono seguro. Esta frase engancha — dale peso.']
        }
      },
      {
        label: '3. EL PROBLEMA',
        script: 'La mayoría de las veces la gente se acostumbra a ver la suciedad todos los días. La ven tan seguido que dejan de notarla.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono empático, sin juzgar. Habla despacio para que aterrice la idea.'],
          assisted: ['Ritmo pausado. Es el momento de reflexión del espectador.']
        }
      },
      {
        label: '4. LA TRANSFORMACIÓN',
        script: 'Pero cuando limpias correctamente una superficie, la diferencia es enorme. El color cambia. La apariencia cambia. Y toda la propiedad se ve más cuidada.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Cada frase corta es un golpe — dale énfasis a cada una. Especialmente "el color cambia" y "la apariencia cambia".'],
          assisted: ['Tono de impacto. Aquí va el antes/después en pantalla.']
        }
      },
      {
        label: '5. LA SOLUCIÓN',
        script: 'Por eso muchas veces no necesitas reemplazar nada. Solo devolverle la limpieza que perdió con los años.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono de alivio y solución. "Solo devolverle la limpieza" debe sonar simple y tranquilizador.'],
          assisted: ['Voz firme y directa. Esta es la frase insignia del guion.']
        }
      },
      {
        label: '6. LLAMADA A LA ACCIÓN',
        script: 'Si quieres ver cómo se vería tu propiedad después de una limpieza profesional, envíanos un mensaje.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono amigable e invitador. Cierra con energía positiva.'],
          assisted: ['Natural y cercano. No suenes a anuncio — suena a conversación.']
        }
      }
    ],
    tips: [
      'El gancho funciona porque replica una pregunta real — el espectador se identifica.',
      'Las frases cortas del paso 4 son el momento más fuerte — no las corras.',
      'Acompaña con clips de antes/después reales para máximo impacto.'
    ],
    checklist: [
      'Paso 1: Gancho con la pregunta grabado',
      'Paso 2: Respuesta directa grabada',
      'Paso 3: El problema de acostumbrarse grabado',
      'Paso 4: La transformación grabada',
      'Paso 5: La solución grabada',
      'Paso 6: Llamada a la acción grabada'
    ],
    productionHack: 'El paso 4 es perfecto para pantalla dividida antes/después. Graba el clip del antes en "el color cambia" y el del después en "toda la propiedad se ve más cuidada".',
    createdAt: '2026-06-24'
  },
  {
    id: 'pressure-washing-tecnica-correcta',
    title: 'Lo Que Nunca Haría Si Esta Fuera Mi Casa',
    category: 'Guiones',
    service: 'Lavado a Presión',
    pilar: 'Errores',
    duration: '40s',
    fullDialogue: 'Si esta fuera mi casa, hay algo que nunca haría. Nunca usaría demasiada presión para limpiar ciertas superficies. Porque muchas personas creen que más presión significa mejor limpieza. Y no siempre es así. De hecho, usar demasiada presión puede dejar marcas permanentes, dañar el concreto o afectar algunas superficies. Lo importante no es usar más fuerza. Lo importante es usar la técnica correcta. Por eso cada trabajo requiere un enfoque diferente. Si no estás seguro de cómo limpiar una superficie exterior, escríbenos y con gusto te orientamos.',
    steps: [
      {
        label: '1. EL GANCHO',
        script: 'Si esta fuera mi casa, hay algo que nunca haría.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pausa después de "nunca haría" — deja que la curiosidad del espectador se active antes de continuar.'],
          assisted: ['Tono firme y directo. Esta frase debe atrapar.']
        }
      },
      {
        label: '2. LA ADVERTENCIA',
        script: 'Nunca usaría demasiada presión para limpiar ciertas superficies.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono serio y seguro. Pronuncia "ciertas superficies" con claridad.'],
          assisted: ['Sin ruidos de fondo. Esta frase es la respuesta al gancho.']
        }
      },
      {
        label: '3. EL ERROR COMÚN',
        script: 'Porque muchas personas creen que más presión significa mejor limpieza. Y no siempre es así.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono empático — no estás juzgando, estás educando. Pausa en "Y no siempre es así."'],
          assisted: ['Ritmo calmado. Deja respirar la frase final.']
        }
      },
      {
        label: '4. LAS CONSECUENCIAS',
        script: 'De hecho, usar demasiada presión puede dejar marcas permanentes, dañar el concreto o afectar algunas superficies.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Lista cada consecuencia con claridad. "Marcas permanentes" es la más impactante — dale énfasis.'],
          assisted: ['Tono de advertencia. Aquí va un clip de una superficie mal lavada si tienes uno.']
        }
      },
      {
        label: '5. LA CLAVE',
        script: 'Lo importante no es usar más fuerza. Lo importante es usar la técnica correcta.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Esta es la frase insignia — las dos oraciones forman un contraste. Dila con convicción total.'],
          assisted: ['Voz firme. Pausa entre las dos frases para que el contraste golpee.']
        }
      },
      {
        label: '6. NUESTRA DIFERENCIA',
        script: 'Por eso cada trabajo requiere un enfoque diferente.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono de autoridad profesional. Corto y contundente.'],
          assisted: ['Sin pausas largas — fluye directo desde el paso anterior.']
        }
      },
      {
        label: '7. LLAMADA A LA ACCIÓN',
        script: 'Si no estás seguro de cómo limpiar una superficie exterior, escríbenos y con gusto te orientamos.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono amigable y accesible. Cierra como si le hablaras a un amigo.'],
          assisted: ['Natural y cercano. No suenes a anuncio — suena a servicio.']
        }
      }
    ],
    tips: [
      'El gancho funciona porque genera curiosidad inmediata — no lo corras.',
      'El paso 5 es el corazón del guion: el contraste fuerza vs. técnica.',
      'Acompaña con clips de trabajo real mostrando la técnica de diferentes ángulos y distancias.'
    ],
    checklist: [
      'Paso 1: Gancho grabado',
      'Paso 2: La advertencia grabada',
      'Paso 3: El error común grabado',
      'Paso 4: Las consecuencias grabadas',
      'Paso 5: La clave (técnica vs. fuerza) grabada',
      'Paso 6: Nuestra diferencia grabada',
      'Paso 7: Llamada a la acción grabada'
    ],
    productionHack: 'Si tienes un clip de una superficie con marcas de presión excesiva, úsalo en el paso 4. Si no, un primer plano del trabajo cuidadoso con la manguera en el paso 5 refuerza la idea de técnica.',
    createdAt: '2026-06-24'
  },
  {
    id: 'window-cleaning-squeegee',
    title: 'Para Qué Sirve el Squeegee',
    category: 'Guiones',
    service: 'Limpieza de Ventanas',
    pilar: 'Herramientas',
    duration: '30s',
    fullDialogue: `Esta herramienta se llama squeegee. Y aunque parece simple, es una de las partes más importantes para limpiar ventanas. No es solo para quitar agua. Sirve para retirar el producto de limpieza de forma pareja, sin dejar rayas ni marcas. Por eso una ventana puede quedar manchada aunque uses buen jabón. El secreto no está solo en el producto. Está en cómo lo retiras.`,
    steps: [
      {
        label: '1. EL GANCHO',
        script: 'Esta herramienta se llama squeegee.',
        visualField: 'Primer plano de la mano sosteniendo el squeegee en campo.',
        visualStudio: 'Sostén el squeegee frente a cámara, bien encuadrado.',
        advice: {
          solo: ['Tono directo y confiado. Pausa breve antes de continuar — deja que el espectador lo vea.'],
          assisted: ['Que Sebastian sostenga la herramienta limpia y sin agua todavía.']
        }
      },
      {
        label: '2. LA IMPORTANCIA',
        script: 'Y aunque parece simple, es una de las partes más importantes para limpiar ventanas.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Énfasis en "más importantes". El contraste con "parece simple" es el gancho de atención.'],
          assisted: ['Clip del squeegee deslizándose por el vidrio en movimiento fluido.']
        }
      },
      {
        label: '3. LA FUNCIÓN REAL',
        script: 'No es solo para quitar agua. Sirve para retirar el producto de limpieza de forma pareja, sin dejar rayas ni marcas.',
        visualField: 'Primer plano del squeegee pasando por el vidrio.',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pausa después de "No es solo para quitar agua." — ese silencio crea expectativa.'],
          assisted: ['Clip en cámara lenta del squeegee si tienes. El movimiento lo dice todo.']
        }
      },
      {
        label: '4. EL PROBLEMA CONOCIDO',
        script: 'Por eso una ventana puede quedar manchada aunque uses buen jabón.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono empático — este es el dolor del espectador. Habla como si lo entendieras.'],
          assisted: ['Clip de una ventana con rayas o manchas si tienes material de antes/después.']
        }
      },
      {
        label: '5. EL SECRETO',
        script: 'El secreto no está solo en el producto. Está en cómo lo retiras.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Esta es la frase cierre — dila despacio. Las dos oraciones forman un contraste deliberado.'],
          assisted: ['Clip final: ventana perfectamente limpia después del squeegee.']
        }
      }
    ],
    tips: [
      'El gancho funciona porque "squeegee" es una palabra que la mayoría no conoce — eso genera curiosidad.',
      'El clip en cámara lenta del squeegee deslizándose puede ser el visual más impactante del video.',
      'Este formato de "explicación de herramienta" tiene mucho potencial de viralidad en el nicho.'
    ],
    checklist: [
      'Paso 1: Gancho con el squeegee en cámara grabado',
      'Paso 2: La importancia grabada',
      'Paso 3: La función real grabada',
      'Paso 4: El problema conocido grabado',
      'Paso 5: El secreto grabado'
    ],
    productionHack: 'Si tienes material de antes/después (ventana manchada vs. limpia), úsalo en el paso 4. El contraste visual refuerza exactamente lo que dice el guion.',
    createdAt: '2026-06-24'
  },
];

export const guionesPresentacion: Script[] = [
  {
    id: 'presentacion-1',
    title: '1. ¿Quién soy y por qué Epotech? (Confianza)',
    category: 'VIDEO FIJADO: Confianza',
    service: 'Marca Personal',
    pilar: 'Experiencia',
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
    pilar: 'Proceso',
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
    pilar: 'Experiencia',
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
