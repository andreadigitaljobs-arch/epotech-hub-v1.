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
    title: '2. Entrenamiento Completo (Autoridad)',
    category: 'PINNED: Autoridad',
    service: 'Marca Personal',
    duration: '50s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'Si tu driveway se ve así… ya se está dañando. Y la mayoría piensa que es solo suciedad. Pero no. Son manchas que se van metiendo, acumulación que desgasta, y superficies que poco a poco… se deterioran. Y cuando reaccionas… ya es más caro arreglarlo. Por eso no solo limpiamos. Restauramos, protegemos y transformamos espacios con limpieza profesional, epoxy y pintura que sí dura. No es estética. Es cuidar lo que te costó dinero. Mira cómo puede verse así otra vez en nuestro perfil.',
    scenes: [
      {
        id: 'p2-e1',
        title: '🎬 ESCENA 1 — HOOK (ANTES / PROBLEMA)',
        talent: {
          whatToSay: '“Si tu driveway se ve así… ya se está dañando.”',
          howToMove: 'Señala el piso (driveway). Mira serio.',
          gesture: 'Natural, sin actuar.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Frente o diagonal al driveway.',
          angle: 'Plano medio (persona + piso).',
          movement: 'Enfoca bien las manchas e incluye a Sebastián señalando.',
          avoid: 'No grabes solo su cara. No ignores el suelo.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e2',
        title: '🎬 ESCENA 2 — ERROR COMÚN',
        talent: {
          whatToSay: '“Y la mayoría piensa que es solo suciedad.”',
          howToMove: 'Niega con la cabeza.',
          gesture: 'Gesto leve con la mano.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Mantén mismo encuadre.',
          angle: 'Mismo plano.',
          movement: 'Estable.',
          avoid: 'Cortes abruptos.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e3',
        title: '🎬 ESCENA 3 — EXPLICACIÓN (DINÁMICA)',
        talent: {
          whatToSay: '“Pero no. Son manchas que se van metiendo, acumulación que desgasta, y superficies que poco a poco… se deterioran.”',
          howToMove: 'Pausa corta. Señala zonas específicas. Pasa la mano por la superficie. Señala grietas / desgaste.',
          gesture: 'Dinámico y explicativo.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Más cerca del suelo.',
          angle: 'Baja un poco la cámara.',
          movement: 'Captura detalles (manchas, textura).',
          avoid: 'No grabes muy lejos. No pierdas el detalle.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e4',
        title: '🎬 ESCENA 4 — CONSECUENCIA',
        talent: {
          whatToSay: '“Y cuando reaccionas… ya es más caro arreglarlo.”',
          howToMove: 'Gesto de “ya es tarde”. Mirada seria.',
          gesture: 'Seguridad y preocupación.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Plano medio.',
          angle: 'Cámara estable.',
          movement: 'Fijo.',
          avoid: 'Movimientos bruscos.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e5',
        title: '🎬 ESCENA 5 — SOLUCIÓN (AUTORIDAD)',
        talent: {
          whatToSay: '“Por eso no solo limpiamos. Restauramos, protegemos y transformamos espacios con limpieza profesional, epoxy y pintura que sí dura.”',
          howToMove: 'Mira a cámara. Señala el área. Señala resultados / área trabajada.',
          gesture: 'Autoridad y confianza.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Mejor ángulo del espacio.',
          angle: 'Busca zona más “impactante”.',
          movement: 'Buena luz.',
          avoid: 'Ángulos desfavorables.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e6',
        title: '🎬 ESCENA 6 — CIERRE EMOCIONAL',
        talent: {
          whatToSay: '“No es estética. Es cuidar lo que te costó dinero.”',
          howToMove: 'Mano al pecho o gesto firme.',
          gesture: 'Firmeza y valor.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Plano medio.',
          angle: 'Estable.',
          movement: 'Fijo.',
          avoid: 'Distracciones en fondo.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      },
      {
        id: 'p2-e7',
        title: '🎬 ESCENA 7 — CTA (PERFIL)',
        talent: {
          whatToSay: '“Mira cómo puede verse así otra vez en nuestro perfil.”',
          howToMove: 'Señala hacia arriba.',
          gesture: 'Invitación a la acción.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Deja espacio arriba del encuadre.',
          angle: 'Mantén estabilidad.',
          movement: 'Fijo.',
          avoid: 'Cortar el gesto de señalar.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      }
    ],
    steps: [],
    tips: [
      'Enfoca bien el deterioro del driveway para el Hook.',
      'La Escena 3 debe ser muy detallada visualmente.',
      'Asegúrate de dejar espacio arriba en la última escena para los overlays de Instagram/TikTok.'
    ],
    checklist: ['Hook driveway', 'Error común', 'Explicación detallada', 'Consecuencia', 'Solución Epotech', 'Valor emocional', 'CTA perfil'],
    productionHack: 'Usa un ángulo contrapicado leve en la Escena 5 para dar más autoridad.'
  },
  {
    id: 'presentacion-3',
    title: '3. Resultados Garantizados (Prueba)',
    category: 'PINNED: Resultados',
    service: 'Marca Personal',
    duration: '45s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'Próximamente contenido detallado...',
    scenes: [
      {
        id: 'p3-e1',
        title: 'ESCENA 1 — INTRODUCCIÓN',
        talent: {
          whatToSay: 'Esperando guion definitivo...',
          howToMove: 'Mirando a cámara.',
          gesture: 'Seguridad.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        },
        camera: {
          whereToStand: 'Frente a él.',
          angle: 'Plano medio.',
          movement: 'Estático.',
          avoid: 'Cortes abruptos.',
          demoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
        }
      }
    ],
    steps: [],
    tips: [],
    checklist: []
  }
];
