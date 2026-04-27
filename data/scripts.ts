export interface RecordingAdvice {
  solo: string[];
  assisted: string[];
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
  tips: string[]; 
  checklist: string[];
  productionHack?: string; 
}

export const guiones: Script[] = [
  {
    id: 'nikki-park-city',
    title: 'El Rescate del Garage (Efecto Epotech)',
    category: 'Caso Real / Documental',
    service: 'Pressure Washing',
    duration: '60s',
    fullDialogue: 'Muchas veces, el garage es la parte más olvidada de una casa de lujo aquí en Utah. Pero para nosotros, es donde empieza la verdadera transformación. Hoy nos enfrentamos a este espacio en Park City que acumulaba años de descuido. No se trataba solo de pasar agua. Tuvimos que tratar las paredes de la fundación y aplicar una química especial para levantar las manchas de aceite sin dañar el concreto. Si no cuidas estos muros, la humedad termina haciendo de las suyas. Aquí es donde la mayoría falla. Usar el equipo correcto, como este limpiador de superficies industrial, nos permite llegar a cada rincón y garantizar un acabado uniforme. Nada de líneas de cebra, solo perfección. Mientras yo me enfocaba en la técnica, Jenkryfer estaba ahí capturando cada detalle y asegurándose de que la logística fuera perfecta. Somos un equipo familiar, y esa es nuestra mayor ventaja: cuidamos tu casa como si fuera la nuestra. De un espacio de escombros a un garage nivel showroom. Este es el estándar Epotech. ¿Tu garage está listo para este cambio? Escríbenos.',
    steps: [
      {
        label: 'GANCHO (El Problema)',
        script: 'Muchas veces, el garage es la parte más olvidada de una casa de lujo aquí en Utah. Pero para nosotros, es donde empieza la verdadera transformación. Hoy nos enfrentamos a este espacio en Park City que acumulaba años de descuido.',
        visualField: 'Clips rápidos del desorden inicial y la suciedad en los muros de piedra.',
        visualStudio: 'Sebastián con tono profesional y honesto mirando el espacio.',
        advice: {
          solo: ['Graba un paneo lento del desorden'],
          assisted: ['Jenkryfer camina mostrando las manchas de aceite']
        }
      },
      {
        label: 'RETO TÉCNICO',
        script: 'No se trataba solo de pasar agua. Tuvimos que tratar las paredes de la fundación y aplicar una química especial para levantar las manchas de aceite sin dañar el concreto. Si no cuidas estos muros, la humedad termina haciendo de las suyas.',
        visualField: 'Clips de las paredes de concreto siendo tratadas con jabón/química.',
        visualStudio: 'Toma macro de la espuma actuando sobre la mancha.',
        advice: {
          solo: ['Cámara fija en la pared mientras aplicas jabón'],
          assisted: ['Toma de detalle de la mancha desapareciendo']
        }
      },
      {
        label: 'AUTORIDAD (Equipo)',
        script: 'Aquí es donde la mayoría falla. Usar el equipo correcto, como este limpiador de superficies industrial, nos permite llegar a cada rincón y garantizar un acabado uniforme. Nada de líneas de cebra, solo perfección.',
        visualField: 'Clip del Surface Cleaner trabajando en un rincón difícil.',
        visualStudio: 'Sebastián operando la máquina con calma.',
        advice: {
          solo: ['POV de la máquina dejando el piso brillante'],
          assisted: ['Toma desde atrás viendo el camino limpio que deja']
        }
      },
      {
        label: 'FACTOR JENKRYFER',
        script: 'Mientras yo me enfocaba en la técnica, Jenkryfer estaba ahí capturando cada detalle y asegurándose de que la logística fuera perfecta. Somos un equipo familiar, y esa es nuestra mayor ventaja: cuidamos tu casa como si fuera la nuestra.',
        visualField: 'Toma de Jenkryfer con su celular o revisando un borde.',
        visualStudio: 'Ambos trabajando en sincronía.',
        advice: {
          solo: ['Pon el trípode donde se vean ambos'],
          assisted: ['Selfie-video de Jenkryfer asintiendo al trabajo']
        }
      },
      {
        label: 'REVELACIÓN FINAL',
        script: 'De un espacio de escombros a un garage nivel showroom. Este es el estándar Epotech. ¿Tu garage está listo para este cambio? Escríbenos.',
        visualField: 'Tomas finales del garage despejado, seco y brillante.',
        visualStudio: 'Sebastián sonriendo a cámara con el logo Epotech de fondo.',
        advice: {
          solo: ['Mismo recorrido del inicio pero limpio'],
          assisted: ['Cerrar con una toma de la camioneta saliendo de la casa']
        }
      }
    ],
    tips: [
      'Mantén un tono de voz honesto, no exagerado.',
      'Asegúrate de que se vea el logo Epotech al menos una vez.',
      'El sonido del agua (ASMR) debe estar presente en los clips.'
    ],
    checklist: [
      'Grabado el desorden inicial',
      'Clip del Surface Cleaner en acción',
      'Toma de Jenkryfer incluida',
      'Revelación final grabada'
    ],
    productionHack: 'Usa el audio original de la hidrolavadora para las transiciones.'
  }
];
