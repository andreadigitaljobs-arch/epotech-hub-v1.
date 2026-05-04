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
    id: 'ejemplo-practica-oficial',
    title: '[EJEMPLO DE PRÁCTICA] Presentación Oficial Epotech',
    category: 'Plantilla de Entrenamiento',
    service: 'Marca Personal',
    duration: '20s',
    fullDialogue: '¿Listo para que tu propiedad destaque en Utah? Soy Sebastián, de Epotech Solutions. Nos especializamos en limpieza exterior de alto nivel y acabados époxicos profesionales para garajes y áreas deportivas. Dejamos tus espacios impecables de piso a techo. ¡Contáctanos y agenda tu cita!',
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
        script: 'Nos especializamos en limpieza exterior de alto nivel y acabados époxicos profesionales para garajes y áreas deportivas.',
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
    productionHack: 'Este video es tu carta de presentación. ¡Haz que brille!'
  }
];

export const guionesPresentacion: Script[] = [
  {
    id: 'presentacion-1',
    title: '1. ¿Quién soy y por qué Epotech? (Confianza)',
    category: 'PINNED: Confianza',
    service: 'Marca Personal',
    duration: '60s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'El mayor error al contratar limpieza… no es el precio. Es no saber a quién estás dejando entrar a tu casa. Porque no es solo limpiar… es entrar a tu espacio, donde está tu familia, tus cosas, tu tranquilidad. Mi nombre es Sebastián. Y cada vez que trabajamos en una propiedad, pensamos como si fuera nuestra. Cuidamos, respetamos y dejamos el espacio mejor de como lo encontramos. Porque al final… se trata de confianza.',
    scenes: [
      {
        id: 'p1-e1',
        title: '🎬 ESCENA 1 — HOOK (AFUERA)',
        talent: {
          whatToSay: '“El mayor error al contratar limpieza… no es el precio.”',
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
          whatToSay: '“Es no saber a quién estás dejando entrar a tu casa.”',
          howToMove: 'No hables al inicio. Abre la puerta y entra.',
          gesture: 'Acción natural de abrir y entrar.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Ponte frente a la puerta cerrada mientras Sebastián está adentro.',
          angle: 'Plano medio de la puerta.',
          movement: 'Graba cuando abra la puerta. Síguelo un poco al entrar (suave).',
          avoid: 'No grabes de frente. No cortes rápido.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p1-e3',
        title: '🎬 ESCENA 3 — INTERIOR (CONEXIÓN)',
        talent: {
          whatToSay: '“Porque no es solo limpiar… es entrar a tu espacio, donde está tu familia, tus cosas, tu tranquilidad.”',
          howToMove: 'Mira alrededor, señala el lugar, señala hacia arriba o lado, señala objetos cerca.',
          gesture: 'Gesto calmado (mano al pecho o suave).',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Ponte frente a él.',
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
          whatToSay: '“Mi nombre es Sebastián. Y cada vez que trabajamos en una propiedad, pensamos como si fuera nuestra. Cuidamos, respetamos y dejamos el espacio mejor de como lo encontramos.”',
          howToMove: 'Mirando a cámara. Movimiento leve (natural). Señala el piso / área.',
          gesture: 'Gesto con manos. Señala resultado.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Frente o diagonal.',
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
          whatToSay: '“Porque al final… se trata de confianza. Si eso es lo que estás buscando, escríbenos.”',
          howToMove: 'Pausa corta. Mira directo a cámara.',
          gesture: 'Serio, seguro.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Mismo lugar.',
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
    productionHack: 'Usa luz natural de la mañana para la escena de afuera.'
  },
  {
    id: 'presentacion-2',
    title: '2. ¿Qué hacemos? (Autoridad y Valor)',
    category: 'PINNED: Autoridad',
    service: 'Marca Personal',
    duration: '75s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'Si tu driveway se ve así… ya se está dañando. Y la mayoría piensa que es solo suciedad. Pero no. Son manchas que se van metiendo, acumulación que desgasta, y superficies que poco a poco… se deterioran. Y cuando reaccionas… ya es más caro arreglarlo. Por eso no solo limpiamos. Restauramos, protegemos y transformamos espacios con limpieza profesional, epoxy y pintura que sí dura. No es estética. Es cuidar lo que te costó dinero. Mira cómo puede verse así otra vez en nuestro perfil.',
    scenes: [
      {
        id: 'p2-e1',
        title: '🎬 ESCENA 1 — HOOK',
        talent: {
          whatToSay: '“Si tu driveway se ve así… ya se está dañando.”',
          howToMove: 'Señala hacia arriba. Mirada seria.',
          gesture: 'Autoridad, advertencia.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Afuera de la casa (Driveway).',
          angle: 'Plano medio.',
          movement: 'Fijo. Deja espacio arriba.',
          avoid: 'Moverse mucho.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e2',
        title: '🎬 ESCENA 2 — ERROR (ÁNGULO)',
        talent: {
          whatToSay: '“Y la mayoría piensa que es solo suciedad.”',
          howToMove: 'Camina un paso lateral.',
          gesture: 'Gesto leve de negación.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Mismo lugar.',
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
          whatToSay: '“Pero no. Son manchas que se van metiendo, acumulación que desgasta, y superficies que poco a poco… se deterioran.”',
          howToMove: 'Cerca de una superficie. Pasa la mano por ella. Golpecito o roce.',
          gesture: 'Mira la superficie (no a cámara).',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Cerca de la superficie.',
          angle: 'Plano detalle / cercano.',
          movement: 'Enfoca manos y acción.',
          avoid: 'Dejar espacio arriba.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e4',
        title: '🎬 ESCENA 4 — CONSECUENCIA',
        talent: {
          whatToSay: '“Y cuando reaccionas… ya es más caro arreglarlo.”',
          howToMove: 'Caminando por el driveway o acera.',
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
          whatToSay: '“Por eso no solo limpiamos. Restauramos, protegemos y transformamos espacios con limpieza profesional, epoxy y pintura que sí dura.”',
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
          whatToSay: '“No es estética. Es cuidar lo que te costó dinero.”',
          howToMove: 'Lugar limpio / neutro.',
          gesture: 'Mano al pecho o gesto firme.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Frente a él.',
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
          whatToSay: '“Mira cómo puede verse así otra vez en nuestro perfil.”',
          howToMove: 'Señala hacia arriba.',
          gesture: 'Invitación, sonrisa.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Frente a él.',
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
    productionHack: 'En la Escena 7, deja suficiente aire arriba para colocar los resultados Antes/Después.'
  },
  {
    id: 'presentacion-3',
    title: '3. Resultados Garantizados (Reseñas)',
    category: 'PINNED: Resultados',
    service: 'Marca Personal',
    duration: '90s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'Esto es lo primero que hacen la mayoría antes de elegirnos… Revisan nuestras reseñas. Y es totalmente válido. Porque hoy en día hay muchas opciones… y no siempre es fácil saber cuál elegir. Por eso dejamos que hablen quienes ya trabajaron con nosotros. Ya hemos trabajado con más de 100 clientes, y cada espacio es diferente. Por eso lo hacemos simple: Nos escribes, vemos tu espacio, y te explicamos exactamente qué necesitas. Sin presión, sin complicaciones. Solo hacer bien el trabajo y que tú estés tranquilo con el resultado. Puedes ver nuestras reseñas… y decidir con total confianza.',
    scenes: [
      {
        id: 'p3-e1',
        title: '🎬 ESCENA 1 — HOOK',
        talent: {
          whatToSay: '“Esto es lo primero que hacen la mayoría antes de elegirnos…”',
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
          whereToStand: 'Mismo lugar.',
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
          whatToSay: '“Y es totalmente válido.”',
          howToMove: 'Cambia posición levemente.',
          gesture: 'Asiente con la cabeza, natural.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Mismo lugar.',
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
          whatToSay: '“Porque hoy en día hay muchas opciones… y no siempre es fácil saber cuál elegir.”',
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
          whatToSay: '“Por eso dejamos que hablen quienes ya trabajaron con nosotros.”',
          howToMove: 'Frente a pared o fondo limpio.',
          gesture: 'Señala hacia arriba.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Frente a él.',
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
          whatToSay: '“Ya hemos trabajado con más de 100 clientes, y cada espacio es diferente.”',
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
          whatToSay: '“Por eso lo hacemos simple: Nos escribes, vemos tu espacio, y te explicamos exactamente qué necesitas.”',
          howToMove: 'Acércate un poco a cámara. Gesto de celular. Señala alrededor.',
          gesture: 'Señala a cámara al final.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Frente a él.',
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
          whatToSay: '“Sin presión, sin complicaciones. Solo hacer bien el trabajo y que tú estés tranquilo con el resultado.”',
          howToMove: 'Pausa leve.',
          gesture: 'Gesto relajado. Mano al pecho.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Mismo lugar.',
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
          whatToSay: '“Puedes ver nuestras reseñas… y decidir con total confianza.”',
          howToMove: 'Mira directo a cámara.',
          gesture: 'Señala hacia arriba, sonrisa segura.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Mismo lugar.',
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
    productionHack: 'Captura pantallas de tus mejores reseñas de Google/Yelp para usarlas como overlays en edición.'
  }
];
