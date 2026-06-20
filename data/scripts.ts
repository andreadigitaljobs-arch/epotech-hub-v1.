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
  createdAt?: string; 
}

export const guiones: Script[] = [
  {
    id: 'ejemplo-practica-oficial',
    title: '[EJEMPLO DE PRÁCTICA] Epotech Official Presentation',
    category: 'Plantilla de Entrenamiento',
    service: 'Marca Personal',
    duration: '20s',
    fullDialogue: 'Ready to make your property stand out in Utah? I\'m Sebastian, from Epotech Solutions. We specialize in high-level exterior cleaning and professional epoxy finishes for garages and sports areas. We leave your spaces spotless from floor to ceiling. Contact us and schedule your appointment!',
    steps: [
      {
        label: 'THE GREETING (Voice-over)',
        script: 'Ready to make your property stand out in Utah? I\'m Sebastian, from Epotech Solutions.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Habla con energía, como si estuvieras saludando a un cliente en persona.'],
          assisted: ['Asegúrate de no tener ruidos de fondo (viento o máquinas).']
        }
      },
      {
        label: 'THE SPECIALTY (Voice-over)',
        script: 'We specialize in high-level exterior cleaning and professional epoxy finishes for garages and sports areas.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pronuncia claro las palabras "high-level" y "professional".'],
          assisted: ['Mantén un ritmo constante, sin correr.']
        }
      },
      {
        label: 'THE PROMISE (Voice-over)',
        script: 'We leave your spaces spotless from floor to ceiling. Contact us and schedule your appointment!',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Haz una pequeña pausa antes de "Contact us" para darle fuerza.'],
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
    title: 'Window Cleaning Challenge in Salt Lake City',
    category: 'Guiones',
    service: 'Window Cleaning',
    duration: '60s',
    fullDialogue: "We got called to clean the windows of a two-story home in Salt Lake City. But nobody told us some of them were this high. I'm not going to lie… this part was a little scary. Some windows were really tall, and getting up there takes focus, patience, and the right tools. So we got everything ready: the squeegee, the mop, the soap, and all the equipment we needed. We started from the second floor. Luckily, we had access to some of the upper windows from the roof, so we carefully organized everything and got to work. With the right tools, we were able to reach each window and clean them one by one. And as always, Jen was right there helping me with the tools, assisting during the job, and recording the process. After about two and a half hours, every window was cleaned. But before leaving, we always do one final walkthrough inside and outside the property. We check for spots, streaks, marks, and anything that doesn't look perfect. Because for us, clean windows are not just about making a home look better. They're about doing the job right. Would you clean windows this high?",
    steps: [
      {
        label: '1. THE HOOK',
        script: 'We got called to clean the windows of a two-story home in Salt Lake City. But nobody told us some of them were this high.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono narrativo directo e intrigante. Dale énfasis a "this high" y haz una pausa al final.'],
          assisted: ['Evitar ruidos de fondo. Pronunciación clara.']
        }
      },
      {
        label: '2. THE HONESTY',
        script: "I'm not going to lie… this part was a little scary.",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Habla con naturalidad y un tono más suave en "a little scary".'],
          assisted: ['Sonido limpio y cercano.']
        }
      },
      {
        label: '3. THE CHALLENGE & PREPARATION',
        script: 'Some windows were really tall, and getting up there takes focus, patience, and the right tools. So we got everything ready: the squeegee, the mop, the soap, and all the equipment we needed.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pausa después de "focus" y "patience". Pronuncia bien la lista de herramientas.'],
          assisted: ['Mantén el ritmo y tono profesional.']
        }
      },
      {
        label: '4. THE EXECUTION',
        script: 'We started from the second floor. Luckily, we had access to some of the upper windows from the roof, so we carefully organized everything and got to work.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Dila con seguridad. Tono de alivio al decir "Luckily".'],
          assisted: ['Tono constante con pausas naturales.']
        }
      },
      {
        label: '5. WINDOW BY WINDOW',
        script: 'With the right tools, we were able to reach each window and clean them one by one.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Dale peso a "one by one" al terminar.'],
          assisted: ['Tono de logro y avance.']
        }
      },
      {
        label: '6. TEAMWORK & COMPLETION',
        script: 'And as always, Jen was right there helping me with the tools, assisting during the job, and recording the process. After about two and a half hours, every window was cleaned.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Menciona a Jen con gratitud. Termina con satisfacción, celebrando haber terminado.'],
          assisted: ['Voz clara y amigable. Tono de victoria al final.']
        }
      },
      {
        label: '7. QUALITY CHECK',
        script: "But before leaving, we always do one final walkthrough inside and outside the property. We check for spots, streaks, marks, and anything that doesn't look perfect.",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono serio y meticuloso. Pausa en "final walkthrough".'],
          assisted: ['Voz firme. Pronuncia con claridad "spots, streaks, marks".']
        }
      },
      {
        label: '8. OUR STANDARD & CTA',
        script: "Because for us, clean windows are not just about making a home look better. They're about doing the job right. Would you clean windows this high?",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['La frase "doing the job right" es la insignia — dila con total conviccion. Cierra con la pregunta directa al espectador.'],
          assisted: ['Voz profesional y segura hasta el final.']
        }
      }
    ],
    tips: [
      'Usa un tono narrativo (storytelling), contando una experiencia real.',
      'Pronuncia los nombres de los lugares ("Salt Lake City") de forma clara.',
      'Haz pausas dramáticas en los puntos clave (ej. "...some of them were this high").'
    ],
    checklist: [
      'Paso 1: Hook grabado (llamado y sorpresa de la altura)',
      'Paso 2: Honestidad grabada',
      'Paso 3: Reto y preparacion grabados (herramientas)',
      'Paso 4: Ejecucion grabada (segundo piso y techo)',
      'Paso 5: Limpieza ventana por ventana grabada',
      'Paso 6: Trabajo en equipo y finalizacion grabados',
      'Paso 7: Inspeccion de calidad grabada',
      'Paso 8: Estandar de marca y CTA grabados'
    ],
    productionHack: 'Muestra tomas rapidas en camara rapida (timelapse) del trabajo en el techo y tomas de primer plano del squeegee limpiando el agua.',
    createdAt: '2026-06-19'
  },
  {
    id: 'window-cleaning-problem-solution',
    title: 'Dirty Windows Problem/Solution',
    category: 'Guiones',
    service: 'Window Cleaning',
    duration: '45s',
    fullDialogue: "Clean windows can completely change the way your home looks and feels. Sometimes windows don't look that dirty from far away, but once the sunlight hits them, you can see dust, water spots, fingerprints, and buildup. That's why professional window cleaning makes such a big difference. At Epotech Solutions, we help homeowners in Utah keep their windows clean, clear, and better maintained. If your windows need a refresh, send us a message today for a free quote.",
    steps: [
      {
        label: '1. THE HOOK',
        script: 'Clean windows can completely change the way your home looks and feels.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono calmado y seguro. Deja que la frase aterrice antes de continuar.'],
          assisted: ['Sonido limpio, sin ruido de fondo.']
        }
      },
      {
        label: '2. THE PROBLEM',
        script: "Sometimes windows don't look that dirty from far away, but once the sunlight hits them, you can see dust, water spots, fingerprints, and buildup.",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Habla con tono de revelacion. Pausa despues de "far away".'],
          assisted: ['Pronuncia con claridad "water spots" y "fingerprints".']
        }
      },
      {
        label: '3. THE SOLUTION',
        script: "That's why professional window cleaning makes such a big difference.",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono de conviction. Es la frase clave del guion.'],
          assisted: ['Voz firme y directa.']
        }
      },
      {
        label: '4. THE BRAND',
        script: 'At Epotech Solutions, we help homeowners in Utah keep their windows clean, clear, and better maintained.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pronuncia "Epotech Solutions" con orgullo. Ritmo pausado.'],
          assisted: ['Tono profesional y confiable.']
        }
      },
      {
        label: '5. THE CTA',
        script: 'If your windows need a refresh, send us a message today for a free quote.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono amigable e invitador. Sonrie levemente al terminar.'],
          assisted: ['Clara y directa al espectador.']
        }
      }
    ],
    tips: [
      'Mantén un ritmo constante y narrativo en todo el guion.',
      'La frase clave es "makes such a big difference" — dale peso.',
      'El CTA final debe sonar natural, no forzado.'
    ],
    checklist: [
      'Paso 1: Hook grabado',
      'Paso 2: Problema de las ventanas sucias grabado',
      'Paso 3: Solucion profesional grabada',
      'Paso 4: Marca Epotech grabada',
      'Paso 5: CTA final grabado'
    ],
    productionHack: 'Muestra tomas de ventanas sucias vs limpias para acompañar la voz en off.',
    createdAt: '2026-06-19'
  },
  {
    id: 'window-cleaning-trust-walkthrough',
    title: 'Final Walkthrough Trust/Quality',
    category: 'Guiones',
    service: 'Window Cleaning',
    duration: '45s',
    fullDialogue: "One thing we always do before leaving a job is a final walkthrough. We check the work from different angles, look for spots, marks, missed details, and anything that needs a final touch. For us, exterior cleaning is not just about finishing fast. It's about making sure the result looks clean, professional, and ready for the homeowner. That attention to detail is part of how we work at Epotech Solutions. Need exterior cleaning in Utah? Send us a message today for a free quote.",
    steps: [
      {
        label: '1. THE HABIT',
        script: 'One thing we always do before leaving a job is a final walkthrough.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono serio y comprometido. Pausa en "final walkthrough".'],
          assisted: ['Voz clara y profesional.']
        }
      },
      {
        label: '2. THE PROCESS',
        script: 'We check the work from different angles, look for spots, marks, missed details, and anything that needs a final touch.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Habla con meticulosidad. Lista cada elemento con claridad.'],
          assisted: ['Ritmo pausado entre cada item de la lista.']
        }
      },
      {
        label: '3. OUR STANDARD',
        script: "For us, exterior cleaning is not just about finishing fast. It's about making sure the result looks clean, professional, and ready for the homeowner.",
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Esta es la frase insignia. Dila con total conviction. Pausa entre las dos frases.'],
          assisted: ['Voz firme. Enfasis en "clean, professional, and ready".']
        }
      },
      {
        label: '4. THE IDENTITY',
        script: 'That attention to detail is part of how we work at Epotech Solutions.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono de orgullo. Es la declaracion de identidad de marca.'],
          assisted: ['Pronuncia "Epotech Solutions" con confianza.']
        }
      },
      {
        label: '5. THE CTA',
        script: 'Need exterior cleaning in Utah? Send us a message today for a free quote.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pregunta directa al espectador. Cierra con tono amigable.'],
          assisted: ['Natural y cercano al final.']
        }
      }
    ],
    tips: [
      'El guion tiene un arco claro: habito → proceso → estandar → identidad → accion.',
      'La frase del paso 3 es la mas importante del guion.',
      'Habla como si le explicaras a un cliente por que haces las cosas bien.'
    ],
    checklist: [
      'Paso 1: Habito del walkthrough grabado',
      'Paso 2: Proceso de revision grabado',
      'Paso 3: Estandar de calidad grabado',
      'Paso 4: Identidad de marca grabada',
      'Paso 5: CTA final grabado'
    ],
    productionHack: 'Graba clips del walkthrough real en el trabajo para acompañar cada parte del guion.',
    createdAt: '2026-06-19'
  },
  {
    id: 'pressure-washing-service',
    title: 'Pressure Washing Service Utah',
    category: 'Guiones',
    service: 'Pressure Washing',
    duration: '45s',
    fullDialogue: 'Your driveway is one of the first things people see when they arrive at your home. Over time, dirt, stains, dust, and buildup can make it look older than it really is. Pressure washing helps bring back a cleaner, fresher look to your exterior surfaces. At Epotech Solutions, we offer professional pressure washing services for homeowners in Utah. If your driveway, garage, or exterior surfaces need cleaning, send us a message today for a free quote.',
    steps: [
      {
        label: '1. THE HOOK',
        script: 'Your driveway is one of the first things people see when they arrive at your home.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono directo e impactante. Habla como si lo estuvieras señalando.'],
          assisted: ['Pronunciacion clara de "driveway".']
        }
      },
      {
        label: '2. THE PROBLEM',
        script: 'Over time, dirt, stains, dust, and buildup can make it look older than it really is.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Lista cada elemento con claridad. Pausa leve en "older than it really is".'],
          assisted: ['Ritmo constante, tono de advertencia.']
        }
      },
      {
        label: '3. THE SOLUTION',
        script: 'Pressure washing helps bring back a cleaner, fresher look to your exterior surfaces.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Tono de solucion y alivio. Pronuncia "pressure washing" con confianza.'],
          assisted: ['Enfasis en "cleaner, fresher look".']
        }
      },
      {
        label: '4. THE BRAND',
        script: 'At Epotech Solutions, we offer professional pressure washing services for homeowners in Utah.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Pronuncia "Epotech Solutions" con orgullo. Tono profesional.'],
          assisted: ['Voz segura y directa.']
        }
      },
      {
        label: '5. THE CTA',
        script: 'If your driveway, garage, or exterior surfaces need cleaning, send us a message today for a free quote.',
        visualField: 'N/A (Voz en off)',
        visualStudio: 'N/A (Voz en off)',
        advice: {
          solo: ['Cierra con tono amigable y accesible. Sonrie levemente.'],
          assisted: ['Natural y cercano.']
        }
      }
    ],
    tips: [
      'Menciona "driveway" y "garage" para conectar con problemas reales del cliente.',
      'La palabra "pressure washing" debe sonar segura y profesional.',
      'El ritmo debe ser constante — no demasiado rapido ni demasiado lento.'
    ],
    checklist: [
      'Paso 1: Hook del driveway grabado',
      'Paso 2: Problema del tiempo y suciedad grabado',
      'Paso 3: Solucion de pressure washing grabada',
      'Paso 4: Marca Epotech grabada',
      'Paso 5: CTA final grabado'
    ],
    productionHack: 'Muestra un before/after del driveway limpio vs sucio para acompañar la voz en off.',
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
    fullDialogue: 'The biggest mistake when hiring cleaners… is not the price. It’s not knowing who you’re letting into your home. Because it’s not just cleaning… it’s entering your space, where your family, your things, and your peace of mind are. My name is Sebastián. And every time we work on a property, we treat it as if it were our own. We care, we respect, and we leave the space better than we found it. Because in the end… it’s all about trust. If that’s what you’re looking for, reach out to us.',
    scenes: [
      {
        id: 'p1-e1',
        title: '🎬 ESCENA 1 — HOOK (AFUERA)',
        talent: {
          whatToSay: '“The biggest mistake when hiring cleaners… is not the price.”',
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
          whatToSay: '“It’s not knowing who you’re letting into your home.”',
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
          whatToSay: '“Because it’s not just cleaning… it’s entering your space, where your family, your things, and your peace of mind are.”',
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
          whatToSay: '“My name is Sebastián. And every time we work on a property, we treat it as if it were our own. We care, we respect, and we leave the space better than we found it.”',
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
          whatToSay: '“Because in the end… it’s all about trust. If that’s what you’re looking for, reach out to us.”',
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
    duration: '75s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'If your driveway looks like this… it’s already getting damaged. And most people think it’s just dirt. But it’s not. It’s stains sinking in, buildup causing wear, and surfaces that slowly… deteriorate. And by the time you react… it’s more expensive to fix. That’s why we don’t just clean. We restore, protect, and transform spaces with professional cleaning, epoxy, and paint that actually lasts. It’s not just about aesthetics. It’s about taking care of what cost you money. See how it can look like this again on our profile.',
    scenes: [
      {
        id: 'p2-e1',
        title: '🎬 ESCENA 1 — HOOK',
        talent: {
          whatToSay: '“If your driveway looks like this… it’s already getting damaged.”',
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
          whatToSay: '“And most people think it’s just dirt.”',
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
          whatToSay: '“But it’s not. It’s stains sinking in, buildup causing wear, and surfaces that slowly… deteriorate.”',
          howToMove: 'OPCIÓN 1: Agáchate y pasa la mano por el driveway sucio. OPCIÓN 2: De pie, señala a los lados para fotos de apoyo.',
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
          whatToSay: '“And by the time you react… it’s more expensive to fix.”',
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
          whatToSay: '“That’s why we don’t just clean. We restore, protect, and transform spaces with professional cleaning, epoxy, and paint that actually lasts.”',
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
          whatToSay: '“It’s not just about aesthetics. It’s about taking care of what cost you money.”',
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
          whatToSay: '“See how it can look like this again on our profile.”',
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
    duration: '90s',
    isPinned: true,
    isProductionMode: true,
    fullDialogue: 'This is the first thing most people do before choosing us… They check our reviews. And that’s completely valid. Because today there are many options… and it’s not always easy to know which one to choose. That’s why we let those who have already worked with us do the talking. We’ve worked with over 100 clients, and every space is different. That’s why we keep it simple: You message us, we look at your space, and we explain exactly what you need. No pressure, no complications. Just doing the job right so you can have peace of mind with the result. You can check our reviews… and decide with total confidence.',
    scenes: [
      {
        id: 'p3-e1',
        title: '🎬 ESCENA 1 — HOOK',
        talent: {
          whatToSay: '“This is the first thing most people do before choosing us…”',
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
          whatToSay: '“They check our reviews.”',
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
          whatToSay: '“And that’s completely valid.”',
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
          whatToSay: '“Because today there are many options… and it’s not always easy to know which one to choose.”',
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
          whatToSay: '“That’s why we let those who have already worked with us do the talking.”',
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
          whatToSay: '“We’ve worked with over 100 clients, and every space is different.”',
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
          whatToSay: '“That’s why we keep it simple: You message us, we look at your space, and we explain exactly what you need.”',
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
          whatToSay: '“No pressure, no complications. Just doing the job right so you can have peace of mind with the result.”',
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
          whatToSay: '“You can check our reviews… and decide with total confidence.”',
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
