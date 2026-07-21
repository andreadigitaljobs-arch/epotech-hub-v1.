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
  videoUrl?: string;
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
  service: 'Pressure Washing' | 'Window Cleaning' | 'Epoxy Floors' | 'Marca Personal'; 
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
    title: '[EJEMPLO DE PRÁCTICA] Presentación Oficial de Epotech',
    category: 'Plantilla de Entrenamiento',
    service: 'Marca Personal',
    pilar: 'Experiencia',
    duration: '20s',
    fullDialogue: '¿Listo para hacer que tu propiedad destaque en Utah? Soy Sebastián, de Epotech Solutions. Nos especializamos en limpieza exterior de alto nivel y acabados profesionales de epoxy para garajes y áreas deportivas. Dejamos tus espacios impecables de piso a techo. ¡Contáctanos y agenda tu cita!',
    steps: [
      {
        label: 'EL SALUDO (Voz en off)',
        script: '¿Listo para hacer que tu propiedad destaque en Utah? Soy Sebastián, de Epotech Solutions.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Habla con energía, como si estuvieras saludando a un cliente en persona.'],
          assisted: ['Asegúrate de no tener ruidos de fondo (viento o máquinas).']
        }
      },
      {
        label: 'LA ESPECIALIDAD (Voz en off)',
        script: 'Nos especializamos en limpieza exterior de alto nivel y acabados profesionales de epoxy para garajes y áreas deportivas.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pronuncia claro las palabras "alto nivel" y "profesionales".'],
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
    title: 'Desafío de Limpieza de Ventanas en Salt Lake City (Zach)',
    category: 'Voz en Off',
    service: 'Window Cleaning',
    pilar: 'Proceso',
    duration: '60s',
    fullDialogue: 'Nos llamaron para limpiar las ventanas de una casa de dos pisos en Salt Lake City. Pero nadie nos dijo que algunas de ellas estaban tan altas. No les voy a mentir... esta parte dio un poco de miedo. Algunas ventanas eran realmente altas, y subir allí requiere concentración, paciencia y las herramientas adecuadas. Así que preparamos todo: la escobilla de goma, la mopa, el jabón y todo el equipo que necesitábamos. Empezamos desde el segundo piso. Por suerte, teníamos acceso a algunas de las ventanas superiores desde el techo, así que organizamos todo con cuidado y nos pusimos a trabajar. Con las herramientas adecuadas, pudimos alcanzar cada ventana y limpiarlas una por una. Y como siempre, Jen Krifer estuvo allí ayudándome con las herramientas, asistiéndome durante el trabajo y grabando el proceso. Después de unas dos horas y media, todas las ventanas quedaron limpias. Pero antes de irnos, siempre hacemos un recorrido final dentro y fuera de la propiedad. Revisamos que no queden manchas, rayas, marcas ni nada que no se vea perfecto. Porque para nosotros, las ventanas limpias no son solo para que una casa se vea mejor. Se trata de hacer el trabajo bien. ¿Limpiarías ventanas así de altas?',
    steps: [
      {
        label: '1. LA LLAMADA',
        script: 'Nos llamaron para limpiar las ventanas de una casa de dos pisos en Salt Lake City.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono narrativo directo e intrigante para enganchar.'],
          assisted: ['Evitar ruidos de fondo.']
        }
      },
      {
        label: '2. LA SORPRESA',
        script: 'Pero nadie nos dijo que algunas de ellas estaban tan altas.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Dale énfasis a la palabra "altas" y haz una pequeña pausa al final.'],
          assisted: ['Pronunciación clara.']
        }
      },
      {
        label: '3. LA SINCERIDAD',
        script: 'No les voy a mentir... esta parte dio un poco de miedo.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Habla con naturalidad y un tono más suave al confesar el miedo.'],
          assisted: ['Sonido limpio y cercano.']
        }
      },
      {
        label: '4. EL DESAFÍO',
        script: 'Algunas ventanas eran realmente altas, y subir allí requiere concentración, paciencia y las herramientas adecuadas.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Haz una pequeña pausa después de cada palabra clave ("concentración", "paciencia").'],
          assisted: ['Mantén el ritmo.']
        }
      },
      {
        label: '5. LA PREPARACIÓN',
        script: 'Así que preparamos todo: la escobilla de goma, la mopa, el jabón y todo el equipo que necesitábamos.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pronuncia bien la lista de herramientas.'],
          assisted: ['Tono profesional y organizado.']
        }
      },
      {
        label: '6. EL COMIENZO',
        script: 'Empezamos desde el segundo piso.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Frase corta y directa. Dila con seguridad.'],
          assisted: ['Tono constante.']
        }
      },
      {
        label: '7. EL ACCESO AL TECHO',
        script: 'Por suerte, teníamos acceso a algunas de las ventanas superiores desde el techo, así que organizamos todo con cuidado y nos pusimos a trabajar.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Habla con un tono de alivio al decir "Por suerte".'],
          assisted: ['Pausas naturales.']
        }
      },
      {
        label: '8. VENTANA POR VENTANA',
        script: 'Con las herramientas adecuadas, pudimos alcanzar cada ventana y limpiarlas una por una.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Dale peso a "una por una" al terminar.'],
          assisted: ['Tono de logro y avance.']
        }
      },
      {
        label: '9. TRABAJO EN EQUIPO',
        script: 'Y como siempre, Jen Krifer estuvo allí ayudándome con las herramientas, asistiéndome durante el trabajo y grabando el proceso.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Menciona a Jen Krifer con gratitud y entusiasmo.'],
          assisted: ['Voz clara y amigable.']
        }
      },
      {
        label: '10. TERMINADO',
        script: 'Después de unas dos horas y media, todas las ventanas quedaron limpias.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Dilo con satisfacción, celebrando haber terminado.'],
          assisted: ['Tono de victoria.']
        }
      },
      {
        label: '11. EL RECORRIDO',
        script: 'Pero antes de irnos, siempre hacemos un recorrido final dentro y fuera de la propiedad.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono serio, mostrando compromiso con la calidad.'],
          assisted: ['Pausa al decir "recorrido final".']
        }
      },
      {
        label: '12. REVISIÓN DE DETALLES',
        script: 'Revisamos que no queden manchas, rayas, marcas ni nada que no se vea perfecto.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pronuncia con claridad "manchas, rayas, marcas".'],
          assisted: ['Tono meticuloso.']
        }
      },
      {
        label: '13. NUESTRO ESTÁNDAR',
        script: 'Porque para nosotros, las ventanas limpias no son solo para que una casa se vea mejor. Se trata de hacer el trabajo bien.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Esta es la frase insignia (marca registrada). Dila con total convicción.'],
          assisted: ['Voz firme y profesional.']
        }
      },
      {
        label: '14. LA PREGUNTA FINAL',
        script: '¿Limpiarías ventanas así de altas?',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pregunta directa al espectador. Sonríe levemente al terminar.'],
          assisted: ['Tono conversacional and retador.']
        }
      }
    ],
    tips: [
      'Usa un tono narrativo (storytelling), contando una experiencia real.',
      'Pronuncia los nombres de los lugares ("Salt Lake City") de forma clara.',
      'Haz pausas dramáticas en los puntos clave (ej. "...algunas de ellas estaban tan altas").'
    ],
    checklist: [
      'Paso 1: Llamado inicial grabado',
      'Paso 2: Sorpresa de la altura grabada',
      'Paso 3: Sinceridad grabada',
      'Paso 4: El reto grabado',
      'Paso 5: Preparación de herramientas grabada',
      'Paso 6: Inicio grabado',
      'Paso 7: Acceso por el techo grabado',
      'Paso 8: Limpieza de ventanas grabada',
      'Paso 9: Trabajo en equipo con Jen grabado',
      'Paso 10: Finalización grabada',
      'Paso 11: Inspección de salida grabada',
      'Paso 12: Búsqueda de imperfecciones grabada',
      'Paso 13: Declaración de calidad grabada',
      'Paso 14: Pregunta final (CTA) grabada'
    ],
    productionHack: 'Muestra tomas rápidas en cámara rápida (timelapse) del trabajo en el techo y tomas de primer plano de la escobilla limpiando el agua.',
    createdAt: '2026-06-19'
  }
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
    fullDialogue: 'El mayor error al contratar servicios de limpieza... no es el precio. Es no saber a quién dejas entrar en tu hogar. Porque no es solo limpiar... es entrar a tu espacio, donde están tu familia, tus pertenencias y tu tranquilidad. Mi nombre es Sebastián. Y cada vez que trabajamos en una propiedad, la tratamos como si fuera nuestra. Cuidamos, respetamos y dejamos el espacio mejor de como lo encontramos. Porque al final... todo se reduce a la confianza. Si eso es lo que buscas, contáctanos.',
    scenes: [
      {
        id: 'p1-e1',
        title: '🎬 ESCENA 1 — HOOK (AFUERA)',
        talent: {
          whatToSay: '“El mayor error al contratar servicios de limpieza... no es el precio.”',
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
          whatToSay: '“Es no saber a quién dejas entrar en tu hogar.”',
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
          whatToSay: '“Porque no es solo limpiar... es entrar a tu espacio, donde están tu familia, tus pertenencias y tu tranquilidad.”',
          howToMove: 'Mira alrededor, señala el lugar, señala hacia arriba o lado, señala objetos cerca.',
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
          whatToSay: '“Mi nombre es Sebastián. Y cada vez que trabajamos en una propiedad, la tratamos como si fuera nuestra. Cuidamos, respetamos y dejamos el espacio mejor de como lo encontramos.”',
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
        title: '🎬 ESCENA 5 — CIERRE & CTA',
        talent: {
          whatToSay: '“Porque al final... todo se reduce a la confianza. Si eso es lo que buscas, contáctanos.”',
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
    checklist: ['Hook afuera', 'Acción puerta', 'Conexión interior', 'Autoridad', 'Cierre confianza'],
    productionHack: 'Usa luz natural de la mañana para la escena de afuera.',
    createdAt: '2026-05-05'
  },
  {
    id: 'presentacion-2',
    title: '2. ¿Qué hacemos? (Autoridad y Valor)',
    category: 'VIDEO FIJADO: Autoridad',
    service: 'Marca Personal',
    pilar: 'Errores',
    duration: '75s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'Si tu entrada de auto se ve así... ya se está empezando a dañar. Y la mayoría de la gente piensa que es solo suciedad. Pero no lo es. Son manchas que se van absorbiendo, acumulación que causa desgaste y superficies que poco a poco... se deterioran. Y para cuando reaccionas... arreglarlo sale mucho más caro. Por eso no solo limpiamos. Restauramos, protegemos y transformamos espacios con limpieza profesional, epoxy y pintura que realmente dura. No es solo por estética. Se trata de cuidar lo que te costó dinero. Mira cómo puede volver a verse así en nuestro perfil.',
    scenes: [
      {
        id: 'p2-e1',
        title: '🎬 ESCENA 1 — HOOK',
        talent: {
          whatToSay: '“Si tu entrada de auto se ve así... ya se está empezando a dañar.”',
          howToMove: 'OPCIÓN 1: Párate en un driveway sucio y señala el piso. OPCIÓN 2: Párate en la sala y señala hacia arriba (para poner foto del driveway en edición).',
          gesture: 'Autoridad, advertencia.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'OPCIÓN 1: Afuera en el driveway. OPCIÓN 2: En la sala, dejando aire arriba en el encuadre.',
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
          whatToSay: '“Y la mayoría de la gente piensa que es solo suciedad.”',
          howToMove: 'Camina un paso lateral.',
          gesture: 'Gesto leve de negación.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'OPCIÓN 1: Acera del driveway. OPCIÓN 2: Desde otro ángulo en la sala.',
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
          whatToSay: '“Pero no lo es. Son manchas que se van absorbiendo, acumulación que causa desgaste y superficies que poco a poco... se deterioran.”',
          howToMove: 'OPCIÓN 1: Agáchate y pasa la mano por el driveway sucio. OPCIÓN 2: De pie, señala a los lados para fotos de apoyo.',
          gesture: 'Mira la superficie o las "fotos imaginarias" (no a cámara).',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'OPCIÓN 1: Cerca de la superficie. OPCIÓN 2: Frente a él en la sala.',
          angle: 'Plano detalle / cercano.',
          movement: 'Enfoca manos and acción.',
          avoid: 'Dejar espacio arriba innecesario.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e4',
        title: '🎬 ESCENA 4 — CONSECUENCIA',
        talent: {
          whatToSay: '“Y para cuando reaccionas... arreglarlo sale mucho más caro.”',
          howToMove: 'OPCIÓN 1: Caminando por el driveway. OPCIÓN 2: Caminando por el pasillo/sala de la casa.',
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
          whatToSay: '“Por eso no solo limpiamos. Restauramos, protegemos y transformamos espacios con limpieza profesional, epoxy y pintura que realmente dura.”',
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
          whatToSay: '“No es solo por estética. Se trata de cuidar lo que te costó dinero.”',
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
        title: '🎬 ESCENA 7 — CTA',
        talent: {
          whatToSay: '“Mira cómo puede volver a verse así en nuestro perfil.”',
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
    checklist: ['Hook Driveway', 'Cambio Ángulo', 'Acción Superficie', 'Caminata Natural', 'Autoridad Herramientas', 'Cierre Emocional', 'CTA Overlay'],
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
    fullDialogue: 'Esto es lo primero que hace la mayoría de las personas antes de elegirnos... Revisan nuestras reseñas. Y eso es completamente válido. Porque hoy en día hay muchas opciones... y no siempre es fácil saber cuál elegir. Por eso dejamos que hablen quienes ya han trabajado con nosotros. Hemos trabajado con más de 100 clientes y cada espacio es diferente. Por eso lo hacemos simple: nos escribes, evaluamos tu espacio y te explicamos exactamente lo que necesitas. Sin presiones ni complicaciones. Solo haciendo el trabajo bien hecho para que tengas total tranquilidad con el resultado. Puedes revisar nuestras opiniones... y decidir con total confianza.',
    scenes: [
      {
        id: 'p3-e1',
        title: '🎬 ESCENA 1 — HOOK',
        talent: {
          whatToSay: '“Esto es lo primero que hace la mayoría de las personas antes de elegirnos...”',
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
          whatToSay: '“Revisan nuestras reseñas.”',
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
          whatToSay: '“Y eso es completamente válido.”',
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
          whatToSay: '“Porque hoy en día hay muchas opciones... y no siempre es fácil saber cuál elegir.”',
          howToMove: 'Caminando por entrada / driveway.',
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
          whatToSay: '“Por eso dejamos que hablen quienes ya han trabajado con nosotros.”',
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
          whatToSay: '“Hemos trabajado con más de 100 clientes y cada espacio es diferente.”',
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
          whatToSay: '“Por eso lo hacemos simple: nos escribes, evaluamos tu espacio y te explicamos exactamente lo que necesitas.”',
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
          whatToSay: '“Sin presiones ni complicaciones. Solo haciendo el trabajo bien hecho para que tengas total tranquilidad con el resultado.”',
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
        title: '🎬 ESCENA 9 — CTA',
        talent: {
          whatToSay: '“Puedes revisar nuestras opiniones... y decidir con total confianza.”',
          howToMove: 'Mira directo a cámara.',
          gesture: 'Señala hacia arriba, sonrisa segura.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'En la puerta principal, Sebastián mirando hacia afuera.',
          angle: 'Plano limpio.',
          movement: 'Deja espacio arriba para reviews finales.',
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
    checklist: ['Hook Curiosidad', 'Reseñas (Overlay)', 'Validación Ángulo', 'Caminata Natural', 'Prueba Social Fuerte', 'Autoridad Clientes', 'Proceso Simple', 'Cierre Tranquilidad', 'CTA Reseñas'],
    productionHack: 'Captura pantallas de tus mejores reseñas de Google/Yelp para usarlas como overlays en edición.',
    createdAt: '2026-05-07'
  }
];
