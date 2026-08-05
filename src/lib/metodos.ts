/**
 * Biblioteca de métodos, tips y mnemotecnias de XILEX.
 *
 * Todo el contenido vive aquí, en el cliente, y no en la base de datos, por dos
 * razones:
 *
 *  1. Es contenido editorial estable — cambia cuando lo reescribimos nosotros,
 *     no cuando un usuario responde algo — así que no gana nada estando en
 *     Postgres y sí pierde: una consulta más y una pantalla en blanco cada vez
 *     que el proyecto de Supabase se pausa.
 *  2. Deja que el centro de estudio (`/metodos`) sea una página estática que
 *     funciona sin sesión y sin base de datos. Un aspirante puede repasar el
 *     método aunque no pueda entrar a practicar.
 *
 * El puente con el banco de preguntas son los códigos de subtema
 * (`subtopics.code`): cada método declara qué subtemas resuelve, y
 * `metodoParaSubtema()` hace la búsqueda inversa para poder colgar el método
 * debajo de la explicación de cada pregunta.
 */

export type AreaClave = 'logico' | 'verbal' | 'cuantitativo' | 'espacial'

export interface PasoMetodo {
  titulo: string
  detalle: string
}

export interface EjemploResuelto {
  enunciado: string
  pasos: string[]
  respuesta: string
}

export interface Mnemotecnia {
  clave: string
  significado: string
  uso: string
}

export interface Metodo {
  slug: string
  nombre: string
  area: AreaClave
  /** Una frase: qué te piden realmente en este tipo de ejercicio. */
  resumen: string
  /** Dónde aparece, en lenguaje de aspirante. */
  dondeAparece: string
  pasos: PasoMetodo[]
  /** Errores que el examen provoca a propósito. */
  trampas: string[]
  /** Atajos legítimos que ahorran tiempo. */
  trucos: string[]
  mnemotecnias?: Mnemotecnia[]
  ejemplo?: EjemploResuelto
  /** Códigos de `subtopics.code` que este método cubre. */
  subtemas: string[]
}

export const AREAS: Record<AreaClave, { nombre: string; descripcion: string; color: string }> = {
  logico: {
    nombre: 'Razonamiento lógico',
    descripcion: 'Silogismos, condicionales, ordenamientos, series y conjuntos.',
    color: 'text-violet-300',
  },
  verbal: {
    nombre: 'Razonamiento verbal',
    descripcion: 'Analogías, vocabulario, comprensión, ortografía y gramática.',
    color: 'text-sky-300',
  },
  cuantitativo: {
    nombre: 'Aptitud cuantitativa',
    descripcion: 'Aritmética, proporciones, álgebra, geometría, datos y gráficos.',
    color: 'text-emerald-300',
  },
  espacial: {
    nombre: 'Razonamiento espacial',
    descripcion: 'Cubos, desarrollos de sólidos y vectores. Sobre todo en la USB.',
    color: 'text-amber-300',
  },
}

// ═══════════════════════════════════════════════════════════════════════════
// MÉTODOS
// ═══════════════════════════════════════════════════════════════════════════

export const METODOS: Metodo[] = [
  // ── LÓGICO ───────────────────────────────────────────────────────────────
  {
    slug: 'silogismos',
    nombre: 'Silogismos categóricos',
    area: 'logico',
    resumen:
      'Dos premisas del tipo "todos / algunos / ningún" y hay que decir qué se sigue con necesidad. No qué es verdad en el mundo: qué se sigue.',
    dondeAparece: 'SIMADI (Razonamiento Lógico) y UCAB (Razonamiento Lógico-Matemático).',
    pasos: [
      {
        titulo: '1. Etiqueta los tres términos',
        detalle:
          'Todo silogismo tiene exactamente tres conjuntos. Ponles letras: A, B, C. El término que aparece en las dos premisas (el "medio") es el puente y nunca aparece en la conclusión.',
      },
      {
        titulo: '2. Dibuja el diagrama de Venn',
        detalle:
          'Tres círculos. "Todos los A son B" = sombrea la parte de A que queda fuera de B (está vacía). "Ningún A es B" = sombrea la intersección. "Algunos A son B" = pon una X en la intersección. Dibuja siempre primero las universales (todos/ningún) y después las particulares (algunos).',
      },
      {
        titulo: '3. Lee el dibujo, no el enunciado',
        detalle:
          'Una conclusión es válida solo si el dibujo la obliga. Si puedes imaginar otro dibujo compatible con las premisas donde la conclusión falla, no es válida.',
      },
      {
        titulo: '4. Descarta con las reglas rápidas',
        detalle:
          'Antes de dibujar, aplica los filtros: de dos premisas particulares no se sigue nada; de dos negativas no se sigue nada; si una premisa es negativa la conclusión debe ser negativa; si una es particular la conclusión debe ser particular.',
      },
      {
        titulo: '5. Si nada encaja, la respuesta es "no se puede concluir"',
        detalle:
          'Es una opción legítima y muy frecuente. En estos exámenes es más común de lo que la gente cree, porque el ejercicio está hecho para que "suene" una conclusión que en realidad no se sigue.',
      },
    ],
    trampas: [
      '"Algunos A son B" NO implica "algunos A no son B". En lógica, "algunos" significa "al menos uno", y es compatible con "todos".',
      'Invertir un "todos": de "todos los perros son mamíferos" no se sigue "todos los mamíferos son perros". Los universales no se dan vuelta.',
      'Meter conocimiento del mundo real. Si la premisa dice "todos los gatos vuelan", en ese ejercicio los gatos vuelan.',
      'Confundir "ningún A es B" (sí se puede invertir) con "todos los A son B" (no se puede).',
    ],
    trucos: [
      'Cuando la conclusión propuesta lleva "todos" y alguna premisa lleva "algunos", casi siempre es falsa: lo particular no puede parir lo universal.',
      'Si dudas entre dos opciones, busca un contraejemplo concreto con números pequeños: 3 objetos bastan para tumbar casi cualquier conclusión inválida.',
      '"Ningún A es B" y "Ningún B es A" dicen lo mismo. "Algunos A son B" y "algunos B son A" también. Esa simetría te ahorra medio dibujo.',
    ],
    mnemotecnias: [
      {
        clave: 'PANDA',
        significado: 'Particulares: nada. Ambas Negativas: nada. Débil manda.',
        uso:
          'Dos premisas particulares (algunos + algunos) → no se concluye. Dos negativas → no se concluye. Y la conclusión hereda siempre la parte más "débil": si hay una negativa, la conclusión es negativa; si hay una particular, la conclusión es particular.',
      },
      {
        clave: 'El medio se queda en casa',
        significado: 'El término que aparece en las dos premisas nunca sale en la conclusión.',
        uso: 'Filtro instantáneo: cualquier opción que mencione el término medio se descarta sin pensar.',
      },
    ],
    ejemplo: {
      enunciado:
        'Todos los músicos son disciplinados. Algunos disciplinados son madrugadores. ¿Qué se concluye?',
      pasos: [
        'Términos: músicos (M), disciplinados (D), madrugadores (R). El medio es D.',
        'Premisa 1: el círculo M está entero dentro de D.',
        'Premisa 2: hay una X en la zona común de D y R — pero no sabemos si esa X cae dentro de M o fuera.',
        'Puedo dibujar la X fuera de M sin contradecir nada; luego "algunos músicos son madrugadores" no se sigue.',
        'Tampoco se sigue lo contrario, porque también puedo dibujarla dentro.',
      ],
      respuesta: 'No se puede concluir nada sobre músicos y madrugadores.',
    },
    // `deduccion_y_problemas_de_logica` es un código heredado de los primeros
    // seeds de SIMADI. Sigue teniendo preguntas asociadas, así que se engancha
    // aquí: sin él, esas preguntas caerían en el método por área y mostrarían
    // ordenamientos debajo de un silogismo.
    subtemas: ['silogismos', 'deduccion_y_problemas_de_logica'],
  },
  {
    slug: 'condicionales',
    nombre: 'Condicionales y lógica proposicional',
    area: 'logico',
    resumen:
      'Enunciados con "si… entonces", "y", "o", "no". Solo hay dos movimientos legales, y el examen vive de los dos ilegales.',
    dondeAparece: 'SIMADI (Lógica Proposicional) y en enunciados condicionales de la UCAB.',
    pasos: [
      {
        titulo: '1. Traduce a letras',
        detalle:
          'Escribe la regla como P → Q. "Si llueve, me mojo": P = llueve, Q = me mojo. Ojo: "solo si" invierte. "Apruebo solo si estudio" significa apruebo → estudio, no al revés.',
      },
      {
        titulo: '2. Identifica cuál de los cuatro casos te dan',
        detalle:
          'Te dan P (afirmar el antecedente), te dan Q (afirmar el consecuente), te dan no-P (negar el antecedente) o te dan no-Q (negar el consecuente).',
      },
      {
        titulo: '3. Aplica la única regla que importa',
        detalle:
          'Si te dan P → concluyes Q (válido). Si te dan no-Q → concluyes no-P (válido). Si te dan Q o te dan no-P → no se concluye nada. Punto.',
      },
      {
        titulo: '4. Para cadenas, encadena',
        detalle:
          'P → Q y Q → R te dan P → R. Y por lo tanto no-R → no-P. Las cadenas largas se recorren igual de bien hacia atrás negando.',
      },
      {
        titulo: '5. Para negar, usa De Morgan',
        detalle:
          'La negación de "A y B" es "no A o no B". La negación de "A o B" es "no A y no B". La negación de "si P entonces Q" es "P y no Q" — no es "si no P entonces no Q".',
      },
    ],
    trampas: [
      'Afirmar el consecuente: "si llueve me mojo; estoy mojado; luego llovió". Falso — pude caerme a la piscina.',
      'Negar el antecedente: "si llueve me mojo; no llovió; luego no estoy mojado". Falso, misma piscina.',
      'Leer "si P entonces Q" como "P si y solo si Q". El examen mete el bicondicional cuando no lo hay.',
      'Tratar el "o" como excluyente. En lógica, "A o B" es verdadero también cuando se dan los dos, salvo que diga "o… o…" / "pero no ambos".',
    ],
    trucos: [
      'La contrarrecíproca (no-Q → no-P) es la misma regla escrita al revés. Si una opción es la contrarrecíproca de la premisa, es correcta sin más análisis.',
      'Con tres o más reglas, arma una tabla de dos columnas: "si pasa esto" / "entonces esto", y persigue el dato que te dieron.',
      'Cuando el ejercicio da un dato negativo, empieza por el final de la cadena y camina hacia atrás. Es más rápido que probar desde el principio.',
    ],
    mnemotecnias: [
      {
        clave: 'PONE la P, QUITA la Q',
        significado: 'Solo dos movimientos son legales: poner el antecedente o quitar el consecuente.',
        uso:
          'Ponerle P (Modus Ponens) → sale Q. Quitarle Q (Modus Tollens) → sale no-P. Cualquier otra combinación: no se concluye. Los dos nombres latinos empiezan igual que lo que haces.',
      },
      {
        clave: 'De Morgan da vuelta el signo',
        significado: 'Al negar, la "y" se vuelve "o" y la "o" se vuelve "y".',
        uso: 'No("estudio y duermo") = "no estudio o no duermo".',
      },
    ],
    ejemplo: {
      enunciado:
        'Si un estudiante entrega el proyecto, aprueba la materia. Si aprueba la materia, se inscribe en el siguiente semestre. Pedro no se inscribió. ¿Qué se concluye?',
      pasos: [
        'E → A, A → I. Encadenando: E → I.',
        'Dato: no-I.',
        'Quitar el consecuente de E → I da no-E.',
      ],
      respuesta: 'Pedro no entregó el proyecto (y tampoco aprobó la materia).',
    },
    subtemas: ['proposicional'],
  },
  {
    slug: 'ordenamiento',
    nombre: 'Ordenamientos y razonamiento analítico',
    area: 'logico',
    resumen:
      'Un grupo de personas u objetos y un puñado de pistas para colocarlos en fila, en un edificio o en una mesa. Se resuelve dibujando, no razonando en la cabeza.',
    dondeAparece: 'SIMADI (Razonamiento Analítico) y UCAB (Ordenamiento).',
    pasos: [
      {
        titulo: '1. Dibuja el tablero antes de leer las pistas',
        detalle:
          'Fila numerada, pisos de un edificio (¡el 1 abajo!), sillas alrededor de una mesa, o una cuadrícula persona × característica. El formato lo dice el enunciado: "a la derecha de" es fila, "más alto que" puede ser fila o edificio, "frente a" es mesa.',
      },
      {
        titulo: '2. Traduce cada pista a un símbolo, no a una frase',
        detalle:
          'A < B (A antes que B), A|B (A junto a B, en cualquier orden), A_B (uno en medio), ¬A1 (A no está en la posición 1). Anótalas todas en una columna antes de empezar a colocar.',
      },
      {
        titulo: '3. Empieza por la pista más restrictiva',
        detalle:
          'Las que fijan una posición exacta primero; luego las de bloques ("A y B están juntos", que se mueve como una sola pieza); las negativas al final, porque solo sirven para tachar.',
      },
      {
        titulo: '4. Cuando te atasques, ramifica',
        detalle:
          'Toma la variable con menos alternativas (normalmente dos) y prueba una. Si llegas a una contradicción, la otra es la buena. Esto no es "adivinar": es agotar casos, y con dos casos es rapidísimo.',
      },
      {
        titulo: '5. Contesta solo lo que preguntan',
        detalle:
          'Muchas veces no hace falta completar el tablero entero. Mira la pregunta: si solo pide quién está en el extremo, para en cuanto lo sepas.',
      },
    ],
    trampas: [
      '"A la derecha de B" no significa "inmediatamente a la derecha". Si no dice "junto a" o "inmediatamente", puede haber huecos.',
      'En edificios, dar por sentado que el piso 1 va arriba. "Más arriba que" sube el número; "el primero" es el de abajo.',
      'En mesas redondas, la derecha depende de si los comensales miran al centro. Fija un criterio al principio y respétalo.',
      'Arrastrar una suposición no confirmada. Si ramificaste, escribe "caso A" arriba y bórralo todo si falla.',
    ],
    trucos: [
      'Cuenta grados de libertad: si tienes 5 posiciones y una pista dice "A está antes que B y que C", entonces A no puede ir en las dos últimas. Esas exclusiones automáticas resuelven medio ejercicio.',
      'Los bloques ("A junto a B") en un tablero de n posiciones solo caben en n−1 sitios. Enumerarlos es más rápido que probar persona por persona.',
      'Si el ejercicio tiene varias preguntas sobre el mismo tablero, resuélvelo completo una vez y respóndelas todas: el costo se reparte.',
    ],
    mnemotecnias: [
      {
        clave: 'FIJA – BLOQUE – TACHA',
        significado: 'El orden en que se usan las pistas.',
        uso:
          'Primero las que FIJAN una posición, después las que forman BLOQUES, y de último las negativas, que solo sirven para TACHAR casillas.',
      },
    ],
    subtemas: ['analitico', 'ordenamiento', 'ordenamiento_de_informacion'],
  },
  {
    slug: 'series-numericas',
    nombre: 'Series y patrones numéricos',
    area: 'logico',
    resumen:
      'Una secuencia y hay que continuarla. Casi siempre la regla está en las diferencias, en las razones o en la alternancia.',
    dondeAparece:
      'SIMADI (Series numéricas), UNIMET (Seriación), USB (Progresiones), UCAB (Series numéricas).',
    pasos: [
      {
        titulo: '1. Escribe las diferencias debajo',
        detalle:
          'Resta cada término del siguiente y anota los resultados en una segunda fila. Si esa fila es constante, la serie es aritmética y ya terminaste.',
      },
      {
        titulo: '2. Si las diferencias no son constantes, diferéncialas otra vez',
        detalle:
          'Segunda fila de diferencias. Si ahora sí es constante, la regla es cuadrática: los saltos crecen de forma regular (+2, +4, +6, +8…).',
      },
      {
        titulo: '3. Prueba las razones',
        detalle:
          'Divide cada término entre el anterior. Si sale el mismo número, es geométrica. Fíjate también en ×2−1, ×3+2 y compañía: son híbridas y muy frecuentes.',
      },
      {
        titulo: '4. Busca alternancia',
        detalle:
          'Si nada cuadra, separa la serie en términos de posición impar y de posición par. Muchísimas series son en realidad dos series entrelazadas, cada una con su propia regla.',
      },
      {
        titulo: '5. Piensa en la posición',
        detalle:
          'A veces el término n es n², n²+1, n(n+1) o el n-ésimo primo. Escribe 1, 2, 3, 4 encima de cada término y compara.',
      },
      {
        titulo: '6. Verifica hacia atrás',
        detalle:
          'Con la regla candidata, regenera toda la serie desde el primer término. Si un solo término falla, la regla es otra.',
      },
    ],
    trampas: [
      'Quedarse con la primera regla que explica los dos primeros saltos. Una regla vale solo si explica todos los términos dados.',
      'Confundir "el siguiente término" con "el término que falta en el medio". Lee qué posición piden — el examen a veces pide el séptimo, no el sexto.',
      'Series de sumas acumuladas (1, 3, 6, 10, 15…): parecen raras y son solo diferencias +2, +3, +4, +5.',
      'Fibonacci disfrazado: cada término es la suma de los dos anteriores. Si las diferencias reproducen la propia serie, es esto.',
    ],
    trucos: [
      'Si los números crecen despacio y de forma pareja → diferencias. Si se disparan → razones o potencias. Si suben y bajan → alternancia. Ese triaje de tres segundos acierta la mayoría de las veces.',
      'Mira las opciones: si la serie crece y una opción es menor que el último término, descártala sin calcular.',
      'Cuadrados y cubos hasta 15 y 6 respectivamente, memorizados, resuelven solos muchas series (1, 4, 9, 16, 25… / 1, 8, 27, 64…).',
    ],
    mnemotecnias: [
      {
        clave: 'DRAP',
        significado: 'Diferencias → Razones → Alternancia → Posición.',
        uso:
          'El orden en que hay que probar. Nunca saltes al azar: recorre DRAP y en el 90 % de los casos la regla aparece antes de llegar a la P.',
      },
    ],
    ejemplo: {
      enunciado: '2, 6, 12, 20, 30, …',
      pasos: [
        'Diferencias: 4, 6, 8, 10. No son constantes.',
        'Segundas diferencias: 2, 2, 2. Constante → regla cuadrática.',
        'El siguiente salto es 12, así que el término siguiente es 30 + 12 = 42.',
        'Verificación por posición: el término n es n(n+1) → 1·2, 2·3, 3·4, 4·5, 5·6, 6·7 = 42. ✔',
      ],
      respuesta: '42',
    },
    subtemas: [
      'numericos', 'series', 'seriacion', 'progresiones',
      'relaciones_numericas', 'series_y_analogias_numericas',
    ],
  },
  {
    slug: 'series-figurales',
    nombre: 'Series y matrices figurales',
    area: 'logico',
    resumen:
      'Figuras que cambian de una casilla a otra. Las reglas posibles son pocas y siempre las mismas; el truco es revisarlas en orden.',
    dondeAparece: 'SIMADI (Series y patrones figurales) y pruebas de habilidad general.',
    pasos: [
      {
        titulo: '1. Cuenta antes de mirar',
        detalle:
          'Número de lados, de puntos, de líneas, de elementos sueltos. Muchas series figurales son series numéricas disfrazadas de dibujo.',
      },
      {
        titulo: '2. Revisa el giro',
        detalle:
          '¿La figura rota? Determina el ángulo (45°, 90°, 180°) y el sentido. Un elemento asimétrico (una muesca, un punto) es el que delata la rotación.',
      },
      {
        titulo: '3. Revisa el reflejo',
        detalle:
          'Espejo horizontal o vertical. Se distingue de la rotación porque el reflejo invierte el orden de los elementos, la rotación los conserva.',
      },
      {
        titulo: '4. Revisa el relleno y el tamaño',
        detalle:
          'Sombreados que se alternan, que se desplazan una posición por paso o que se acumulan. El tamaño que crece o mengua de forma regular.',
      },
      {
        titulo: '5. En matrices 3×3, lee filas y columnas por separado',
        detalle:
          'La regla suele operar en las dos direcciones. También puede ser aritmética de figuras: la tercera casilla es la primera más la segunda, o la primera menos la segunda.',
      },
    ],
    trampas: [
      'Confundir rotación de 180° con reflejo: en figuras simétricas dan el mismo resultado, y el examen elige figuras asimétricas justo para separarlas.',
      'Fijarse solo en la figura grande e ignorar un punto pequeño que se mueve. El detalle chico suele ser la regla real.',
      'Asumir que todos los atributos cambian al mismo ritmo. Es normal que el giro avance cada paso y el relleno cada dos.',
    ],
    trucos: [
      'Describe cada figura con una ficha de tres datos: forma, orientación, relleno. Comparar fichas es mucho más fiable que comparar dibujos.',
      'Elimina opciones por un solo atributo: si el relleno debe ser negro, tacha todas las que no lo tengan y compara solo las que queden.',
      'Si la serie tiene seis figuras, comprueba si el patrón se repite cada tres: los ciclos de 3 y de 4 son los más usados.',
    ],
    mnemotecnias: [
      {
        clave: 'GRACE',
        significado: 'Giro, Reflejo, Adición/sustracción, Cantidad, Espesor-relleno.',
        uso: 'La lista completa de transformaciones posibles. Recórrela en orden y descarta.',
      },
    ],
    subtemas: ['figurales'],
  },
  {
    slug: 'conjuntos',
    nombre: 'Conjuntos y diagramas de Venn',
    area: 'logico',
    resumen:
      'Cuántos hacen A, cuántos hacen B, cuántos hacen las dos. Se resuelve rellenando el diagrama desde el centro hacia afuera.',
    dondeAparece: 'UNIMET (Razonamiento lógico y conjuntos) y problemas de encuestas en general.',
    pasos: [
      {
        titulo: '1. Dibuja los círculos y el rectángulo del total',
        detalle:
          'Dos o tres círculos dentro de un rectángulo. El rectángulo es el universo: los que no están en ningún círculo también cuentan.',
      },
      {
        titulo: '2. Rellena SIEMPRE desde el centro',
        detalle:
          'Empieza por la intersección de los tres, luego las de dos, y al final las zonas exclusivas. Cada zona debe quedar con la cantidad que le corresponde solo a ella.',
      },
      {
        titulo: '3. Resta para obtener las zonas exclusivas',
        detalle:
          'Si 40 hacen A y 15 hacen A y B, entonces solo A son 40 − 15 = 25. El error clásico es escribir 40 en la zona exclusiva.',
      },
      {
        titulo: '4. Comprueba con el total',
        detalle:
          'La suma de todas las zonas más los de fuera debe dar el universo. Si no cuadra, hay una zona mal restada.',
      },
      {
        titulo: '5. Traduce la pregunta a zonas',
        detalle:
          '"Solo A" es una zona. "A" son cuatro zonas. "Al menos dos" son las tres intersecciones de dos más la de tres. "Ninguna" es lo de fuera.',
      },
    ],
    trampas: [
      'Sumar los totales de cada conjunto y olvidar que los de la intersección se contaron dos veces.',
      'Leer "solo A" cuando dice "A", o al revés. Es la diferencia entre acertar y fallar en la mitad de estos ejercicios.',
      'Olvidar a los que no pertenecen a ningún conjunto: casi siempre hay que restarlos del universo.',
    ],
    trucos: [
      'Para dos conjuntos: |A ∪ B| = |A| + |B| − |A ∩ B|. Con tres se suman los tres, se restan las tres intersecciones de dos y se vuelve a sumar la de tres.',
      'Si el enunciado da "al menos uno", eso es la unión; el universo menos la unión son los de fuera.',
      'Cuando falta un dato, ponle x a la intersección central y escribe todo lo demás en función de x: la ecuación sale sola con el total.',
    ],
    mnemotecnias: [
      {
        clave: 'De adentro hacia afuera',
        significado: 'El diagrama se rellena empezando por la intersección más profunda.',
        uso: 'Si empiezas por fuera te toca rehacerlo; si empiezas por dentro, cada resta es directa.',
      },
    ],
    subtemas: ['razonamiento_logico_conjuntos'],
  },
  {
    slug: 'algoritmico',
    nombre: 'Razonamiento algorítmico',
    area: 'logico',
    resumen:
      'Te dan una regla artificial (una máquina, un símbolo inventado, un procedimiento) y hay que aplicarla al pie de la letra.',
    dondeAparece: 'UNIMET (Razonamiento algorítmico) y ejercicios de "operaciones definidas".',
    pasos: [
      {
        titulo: '1. Copia la regla en tus palabras',
        detalle:
          'Escríbela como una receta numerada. Si dice "a ∗ b = 2a − b", anota: "el primero por dos, menos el segundo". El orden importa y es donde falla todo el mundo.',
      },
      {
        titulo: '2. Pruébala con el ejemplo que te dan',
        detalle:
          'Si el enunciado incluye un caso resuelto, reprodúcelo. Si no te da lo mismo, entendiste mal la regla — y mejor descubrirlo ahí que tres pasos después.',
      },
      {
        titulo: '3. Aplica paso a paso, sin saltarte líneas',
        detalle:
          'Nada de hacerlo mentalmente. Escribe cada iteración en una línea. Estos ejercicios no son difíciles: son largos, y se fallan por distracción.',
      },
      {
        titulo: '4. Respeta el orden y los paréntesis',
        detalle:
          'Estas operaciones inventadas normalmente no son conmutativas ni asociativas: a ∗ b ≠ b ∗ a. Resuelve siempre el paréntesis interior primero.',
      },
    ],
    trampas: [
      'Asumir propiedades que la regla no tiene (conmutativa, asociativa, distributiva). Solo vale lo que la definición dice.',
      'Perder un signo negativo a mitad de camino. Escribe los negativos entre paréntesis.',
      'Detenerse una iteración antes o después de la que piden.',
    ],
    trucos: [
      'Si piden el resultado tras muchas repeticiones, calcula las primeras cuatro o cinco y busca el ciclo: casi siempre se repite.',
      'Cuando la regla se aplica sobre el resultado anterior, arma una tabla de dos columnas (paso, valor). Se ve el patrón de inmediato.',
    ],
    subtemas: ['razonamiento_algoritmico'],
  },

  // ── VERBAL ───────────────────────────────────────────────────────────────
  {
    slug: 'analogias',
    nombre: 'Analogías verbales',
    area: 'verbal',
    resumen:
      'Un par de palabras y hay que encontrar otro par con la misma relación. La clave no son las palabras: es la relación.',
    dondeAparece: 'SIMADI, UNIMET, USB y UCAB. Es el tipo de ejercicio más repetido de las cuatro.',
    pasos: [
      {
        titulo: '1. Construye una frase puente',
        detalle:
          'Une el par original con una oración corta y precisa: "el ZAPATO protege el PIE", "el CACHORRO es la cría del PERRO". La frase debe ser específica; si sirve para muchos pares, todavía no es lo bastante precisa.',
      },
      {
        titulo: '2. Anota la dirección',
        detalle:
          'PARTE→TODO no es lo mismo que TODO→PARTE. Escribe una flecha. Si el par original va de específico a general, la respuesta también.',
      },
      {
        titulo: '3. Prueba la frase con cada opción',
        detalle:
          'Sustituye las palabras de cada alternativa en tu frase puente. La que suene natural y verdadera es la respuesta.',
      },
      {
        titulo: '4. Si sobreviven dos, aprieta la frase',
        detalle:
          'Añade precisión: no "sirve para", sino "es la herramienta con la que un profesional realiza su oficio". Con la frase más estrecha, una de las dos cae.',
      },
      {
        titulo: '5. Comprueba la categoría gramatical',
        detalle:
          'Si el original es sustantivo–adjetivo, la respuesta debe serlo. El examen mete opciones correctas en significado pero torcidas en categoría.',
      },
    ],
    trampas: [
      'Elegir por cercanía temática. MÉDICO : HOSPITAL no se empareja con ENFERMERA : MEDICINA solo porque todo suene a salud.',
      'Ignorar la dirección. Si el par es DEDO : MANO (parte : todo), la respuesta no puede ser ÁRBOL : HOJA (todo : parte).',
      'Aceptar una relación más débil cuando existe una más exacta entre las opciones. Siempre gana la más específica.',
    ],
    trucos: [
      'Las relaciones más usadas son once: sinonimia, antonimia, parte-todo, género-especie, causa-efecto, objeto-función, agente-instrumento, agente-lugar, intensidad, materia-producto y secuencia. Reconocer cuál es acorta el trabajo a la mitad.',
      'Si no conoces una palabra de las opciones, no la descartes: descarta primero las que sí entiendes y que claramente fallan.',
      'Léelo al revés. Si la frase puente también funciona invertida en el original pero no en tu opción, esa opción no es.',
    ],
    mnemotecnias: [
      {
        clave: 'PUENTE',
        significado: 'Primero Una Frase; después Elige Notando Tipo y Enfoque (dirección).',
        uso:
          'Nunca mires las opciones antes de tener tu frase puente escrita. Mirarlas primero contamina el criterio: siempre hay una que "suena bien".',
      },
    ],
    ejemplo: {
      enunciado: 'PINCEL : PINTOR :: ?',
      pasos: [
        'Frase puente: "el PINCEL es la herramienta con la que trabaja el PINTOR". Dirección: instrumento → agente.',
        'Opción "bisturí : cirujano": el bisturí es la herramienta con la que trabaja el cirujano. ✔ misma dirección.',
        'Opción "cuadro : pintor": el cuadro es el producto, no la herramienta. ✘',
        'Opción "cirujano : bisturí": relación correcta pero invertida. ✘',
      ],
      respuesta: 'BISTURÍ : CIRUJANO',
    },
    subtemas: ['analogias', 'analogias_verbales', 'relaciones_analogicas'],
  },
  {
    slug: 'vocabulario',
    nombre: 'Sinónimos, antónimos y vocabulario',
    area: 'verbal',
    resumen:
      'Hay que elegir la palabra de significado más cercano (o más opuesto). Se puede acertar sin conocer la palabra, atacando su forma.',
    dondeAparece: 'SIMADI, UNIMET, USB y UCAB.',
    pasos: [
      {
        titulo: '1. Define la palabra con tus palabras, antes de leer las opciones',
        detalle:
          'Si logras una definición propia, la comparas con cada alternativa y la interferencia desaparece.',
      },
      {
        titulo: '2. Si no la conoces, despiézala',
        detalle:
          'Prefijo, raíz, sufijo. IN-/A-/DES- niegan; SUB-/INFRA- están debajo; SUPER-/SOBRE- están encima; -FOBIA es miedo; -FILIA es afición; RE- repite; BENE- es bueno y MAL- es malo.',
      },
      {
        titulo: '3. Recuerda dónde la has oído',
        detalle:
          'Búscale una frase hecha o un contexto real. La carga (positiva, negativa, neutra) que trae esa frase ya descarta la mitad de las opciones.',
      },
      {
        titulo: '4. Comprueba el registro y la intensidad',
        detalle:
          '"Molesto" y "furibundo" apuntan a lo mismo pero no valen lo mismo. Elige la que iguala la fuerza, no solo la dirección.',
      },
      {
        titulo: '5. En antónimos, verifica que sea oposición y no simple diferencia',
        detalle:
          'Lo contrario de "generoso" es "tacaño", no "pobre". Pobre es otra cosa, no lo opuesto.',
      },
    ],
    trampas: [
      'Los falsos amigos del inglés: "actualmente" no es *actually*, "eventualmente" no es *eventually*, "asumir" no es *assume*.',
      'Elegir una palabra que se parece en la forma pero no en el significado (adoptar/adaptar, absolver/absorber, infligir/infringir).',
      'Ignorar la carga: si la palabra original es negativa, un sinónimo positivo no puede ser la respuesta.',
    ],
    trucos: [
      'Si dos opciones significan prácticamente lo mismo entre sí, ninguna de las dos es la respuesta: no puede haber dos correctas.',
      'La opción más rara y culta no es automáticamente la correcta; tampoco la más común. Decide por significado, no por dificultad.',
      'Con antónimos, tapa el enunciado y busca primero cuáles opciones son sinónimos de la palabra: esas son el señuelo, y descartarlas deja el campo limpio.',
    ],
    mnemotecnias: [
      {
        clave: 'PRS: Prefijo, Raíz, Sufijo',
        significado: 'La palabra desconocida se ataca por partes.',
        uso:
          '"Inmarcesible": IN- (no) + marcesible (que se marchita) = que no se marchita, imperecedero. No hacía falta haberla visto nunca.',
      },
    ],
    subtemas: ['vocabulario', 'vocabulario_y_significado_en_contexto'],
  },
  {
    slug: 'palabras-contexto',
    nombre: 'Significado de palabras en contexto',
    area: 'verbal',
    resumen:
      'La misma palabra significa cosas distintas según la oración. Lo que se evalúa es la lectura del contexto, no el diccionario.',
    dondeAparece: 'UNIMET (Significado de palabras en contexto) y en comprensión lectora de todas.',
    pasos: [
      {
        titulo: '1. Tapa la palabra y rellena el hueco',
        detalle:
          'Lee la oración saltándotela y pon tú una palabra que encaje. Después busca cuál de las opciones se parece a la tuya.',
      },
      {
        titulo: '2. Usa las pistas del entorno',
        detalle:
          'Los conectores mandan: "pero" y "sin embargo" anuncian contraste (la palabra va en dirección opuesta a lo anterior); "porque" y "por eso" anuncian causa; "es decir" anuncia una repetición con otras palabras — ahí tienes la definición regalada.',
      },
      {
        titulo: '3. Sustituye y relee la oración completa',
        detalle:
          'Mete la opción elegida y lee la frase entera en voz baja. Si chirría gramaticalmente o cambia el sentido del párrafo, no es.',
      },
      {
        titulo: '4. Desconfía del significado más común',
        detalle:
          'Si preguntan por una palabra frecuente, casi seguro la usan en una acepción secundaria. "Banco", "capital", "sujeto", "orden": el examen elige justo esas.',
      },
    ],
    trampas: [
      'Responder con la primera acepción del diccionario cuando el texto usa la segunda o la tercera.',
      'Elegir un sinónimo válido en general pero imposible en esa oración concreta.',
      'Leer solo la línea de la palabra. El contexto que decide suele estar en la oración anterior.',
    ],
    trucos: [
      'Marca el conector más cercano antes de decidir: contraste, causa o equivalencia. Casi siempre resuelve el ejercicio solo.',
      'Si dos opciones encajan, elige la que mantiene el tono del texto (formal, técnico, irónico).',
    ],
    subtemas: ['palabras_contexto', 'significado_de_palabras_en_contexto'],
  },
  {
    slug: 'comprension',
    nombre: 'Comprensión lectora',
    area: 'verbal',
    resumen:
      'Un texto y preguntas sobre él. La respuesta siempre está en el texto: lo que se evalúa es si la encuentras y si sabes distinguirla de lo que suena parecido.',
    dondeAparece: 'SIMADI, UNIMET, USB y UCAB. Es la parte con más peso de las pruebas verbales.',
    pasos: [
      {
        titulo: '1. Lee las preguntas primero (pero no las opciones)',
        detalle:
          'Saber qué te van a preguntar convierte la lectura en una búsqueda dirigida. Las opciones no: leerlas antes te siembra ideas que después "encuentras" en el texto.',
      },
      {
        titulo: '2. Lee el texto marcando estructura',
        detalle:
          'Subraya la primera y la última oración de cada párrafo, y todos los conectores de contraste. Ahí está el esqueleto del argumento.',
      },
      {
        titulo: '3. Escribe la idea principal en una línea',
        detalle:
          'De qué habla + qué dice sobre eso. Si no puedes resumirlo en una frase, todavía no lo entendiste, y las preguntas globales fallarán.',
      },
      {
        titulo: '4. Clasifica cada pregunta',
        detalle:
          'Literal (la respuesta está escrita), inferencial (se deduce de lo escrito) o de propósito/tono (por qué lo escribió y con qué actitud). Cada tipo se responde distinto.',
      },
      {
        titulo: '5. Justifica con una línea concreta',
        detalle:
          'Antes de marcar, señala físicamente en el texto la línea que sostiene tu respuesta. Si no la encuentras, esa no es la respuesta.',
      },
    ],
    trampas: [
      'La opción verdadera pero que no está en el texto. Puede ser cierta en el mundo y aun así ser incorrecta.',
      'La opción demasiado amplia o demasiado estrecha: repite media idea principal, o solo un detalle del segundo párrafo.',
      'Las palabras absolutas ("siempre", "nunca", "todos", "ninguno"). Los textos académicos matizan; las opciones absolutas suelen ser falsas.',
      'Confundir lo que dice el autor con lo que el autor cita que dicen otros para rebatirlo.',
    ],
    trucos: [
      'En "idea principal", tapa las opciones y responde tú; después busca la que más se parece.',
      'En preguntas de tono, quédate con los adjetivos del autor: son los que revelan si es crítico, admirativo o neutral.',
      'Si el texto es largo y el tiempo aprieta, responde primero las preguntas literales (se ubican rápido) y deja las de propósito para el final.',
    ],
    mnemotecnias: [
      {
        clave: 'SPQ: Subrayo, Pregunto, Justifico',
        significado: 'El ciclo de cada pregunta de comprensión.',
        uso:
          'Subrayo la estructura, me pregunto qué tipo de pregunta es, y justifico señalando la línea. Nunca marcar sin línea que lo respalde.',
      },
    ],
    subtemas: ['comprension', 'comprension_de_textos', 'comprension_textos'],
  },
  {
    slug: 'acentuacion',
    nombre: 'Acentuación',
    area: 'verbal',
    resumen:
      'Saber dónde va la tilde es un sistema de tres reglas y una lista de excepciones. No hay que memorizar palabras: hay que aplicar el sistema.',
    dondeAparece: 'SIMADI (Acentuación y puntuación) y UNIMET (Ortografía y puntuación).',
    pasos: [
      {
        titulo: '1. Separa en sílabas y localiza la fuerza',
        detalle:
          'Di la palabra en voz alta y marca la sílaba tónica. Todo lo demás depende de eso.',
      },
      {
        titulo: '2. Clasifica según la posición de la tónica',
        detalle:
          'Última sílaba = aguda. Penúltima = grave o llana. Antepenúltima = esdrújula. Antes de esa = sobresdrújula.',
      },
      {
        titulo: '3. Aplica la regla que corresponde',
        detalle:
          'Agudas: tilde solo si terminan en n, s o vocal. Graves: tilde solo si NO terminan en n, s ni vocal. Esdrújulas y sobresdrújulas: tilde siempre, sin excepción.',
      },
      {
        titulo: '4. Revisa si hay hiato',
        detalle:
          'Vocal fuerte (a, e, o) junto a i o u tónica lleva tilde aunque las reglas digan que no: día, país, reúne, baúl, oír.',
      },
      {
        titulo: '5. Revisa la tilde diacrítica',
        detalle:
          'Palabras iguales que cambian de función: él/el, tú/tu, mí/mi, sí/si, sé/se, té/te, dé/de, más/mas. Y los interrogativos-exclamativos: qué, quién, cómo, cuándo, dónde, cuánto, por qué.',
      },
    ],
    trampas: [
      'Los monosílabos no llevan tilde salvo por diacrítica: fue, fui, vio, dio, ti (nunca "tí").',
      '"Solo" y los demostrativos ya no llevan tilde según la norma vigente.',
      '"Por qué / porque / por que / porqué": pregunta con tilde y separado; respuesta junto y sin tilde; "el porqué" es sustantivo y lleva artículo.',
      'Los adverbios en -mente conservan la tilde del adjetivo: rápida → rápidamente; común → comúnmente.',
      'Las mayúsculas también se acentúan.',
    ],
    trucos: [
      'Si la palabra termina en vocal, n o s y lleva tilde, es aguda; si lleva tilde y NO termina así, es grave. La tilde te dice la clase, no al revés.',
      'Para los interrogativos: si puedes meter "qué cosa", "en qué momento", "en qué lugar", lleva tilde aunque la pregunta sea indirecta ("no sé cuándo llega").',
      '"Aún" con tilde equivale a "todavía"; "aun" sin tilde equivale a "incluso".',
    ],
    mnemotecnias: [
      {
        clave: 'AGUDA con N, S o VOCAL',
        significado: 'La regla de las agudas, y por oposición la de las graves.',
        uso:
          'Canción, compás, sofá llevan tilde. Las graves son el espejo exacto: llevan tilde cuando NO terminan en n, s ni vocal (árbol, cárcel, lápiz).',
      },
      {
        clave: 'Esdrújula = tilde. Siempre.',
        significado: 'No hay una sola excepción.',
        uso: 'Si la fuerza cae en la antepenúltima sílaba, escribe la tilde sin pensarlo: médico, brújula, teléfono.',
      },
    ],
    subtemas: ['acentuacion', 'acentuacion_y_puntuacion'],
  },
  {
    slug: 'ortografia',
    nombre: 'Ortografía',
    area: 'verbal',
    resumen:
      'Elegir la escritura correcta. Se ataca con reglas de familias de palabras y con las parejas de homófonos que el examen repite.',
    dondeAparece: 'SIMADI (Ortografía) y UNIMET (Ortografía).',
    pasos: [
      {
        titulo: '1. Busca la palabra de la misma familia',
        detalle:
          'Si dudas entre "haber" y "a ver", entre "tuvo" y "tubo", piensa en un pariente: "tuvimos" (verbo tener) frente a "tubería" (el objeto).',
      },
      {
        titulo: '2. Aplica las reglas de alta frecuencia',
        detalle:
          'B: después de m, en -bir (salvo hervir, servir, vivir), en -aba del imperfecto, en bien-/bene-. V: después de n, en -ívoro, en adjetivos terminados en -ave, -ivo, -iva. G: en -ger/-gir (salvo tejer y crujir), en geo-. J: en -aje, -jero, y en los pretéritos de traer y decir (traje, dije).',
      },
      {
        titulo: '3. Compara opción por opción, palabra por palabra',
        detalle:
          'En los ítems de "elija la alternativa correctamente escrita", casi siempre hay una sola palabra distinta entre dos opciones. Encuéntrala primero y decide solo sobre ella.',
      },
      {
        titulo: '4. Descarta por errores evidentes',
        detalle:
          'Una alternativa con un error claro cae completa, aunque el resto esté bien. Basta un fallo para eliminarla.',
      },
    ],
    trampas: [
      'Haya (verbo haber) / halla (encuentra) / aya (cuidadora) / allá (lugar).',
      'Ahí (lugar) / hay (existe) / ay (queja).',
      'Echo (del verbo echar, sin h) / hecho (del verbo hacer, con h).',
      'Sino (conjunción adversativa) / si no (condicional negativa).',
      'También (además) / tan bien (comparación de modo).',
      'Halla, valla, vaya, baya: encontrar, cerca, verbo ir, fruto.',
    ],
    trucos: [
      'Prueba de sustitución: si puedes cambiar "haya" por "exista", va con h y con y. Si puedes cambiarlo por "encuentra", es "halla".',
      '"Echo" nunca lleva h porque "echar" no la lleva. Es una de las pocas reglas sin excepción práctica.',
      'Si una opción cambia el significado de la oración, el error probablemente no es ortográfico sino de elección de palabra: fíjate en el sentido.',
    ],
    mnemotecnias: [
      {
        clave: 'HAYA existe, HALLA encuentra, ALLÁ está lejos',
        significado: 'La tríada de homófonos más preguntada.',
        uso: 'Sustituye por "exista", "encuentre" o "lejos" y sabrás cuál va.',
      },
      {
        clave: 'M antes de B y P',
        significado: 'Nunca "n" delante de b o p.',
        uso: 'También, campo, hombro, siempre. No hay excepciones en español.',
      },
    ],
    subtemas: ['ortografia'],
  },
  {
    slug: 'puntuacion',
    nombre: 'Puntuación',
    area: 'verbal',
    resumen:
      'Dónde va la coma, el punto y coma o los dos puntos. Se decide por función sintáctica, no por dónde respiras.',
    dondeAparece: 'UNIMET (Puntuación) y SIMADI (Acentuación y puntuación).',
    pasos: [
      {
        titulo: '1. Localiza el sujeto y el verbo principal',
        detalle:
          'Entre el sujeto y su verbo nunca va coma, por larga que sea la frase. Es la regla que más se viola y la que más se pregunta.',
      },
      {
        titulo: '2. Encierra los incisos entre dos comas',
        detalle:
          'Aclaraciones, aposiciones y vocativos van entre comas — dos, no una. "Mi hermano, que vive en Mérida, llegó ayer".',
      },
      {
        titulo: '3. Marca los conectores',
        detalle:
          'Sin embargo, no obstante, por lo tanto, es decir, en efecto: llevan coma detrás, y coma o punto y coma delante según lo que los preceda.',
      },
      {
        titulo: '4. Decide entre coma, punto y coma y dos puntos',
        detalle:
          'Coma: elementos de una serie. Punto y coma: separa elementos de una serie que ya llevan comas por dentro, o dos oraciones muy relacionadas. Dos puntos: anuncian lo que sigue (enumeración, explicación, cita).',
      },
      {
        titulo: '5. Relee la opción completa buscando UNA sola falla',
        detalle:
          'Basta una coma sobrante entre sujeto y verbo para tumbar la alternativa entera.',
      },
    ],
    trampas: [
      'Coma antes de "y" cuando cierra una serie simple: no va. Sí va cuando la "y" une dos oraciones con sujetos distintos o introduce contraste.',
      'Coma entre sujeto y verbo, aunque el sujeto ocupe dos líneas.',
      'Dos puntos después de una preposición o de un verbo que exige complemento: "los ingredientes son: harina y sal" está mal.',
      'Punto y coma donde la relación entre las dos oraciones es floja: ahí va punto.',
    ],
    trucos: [
      'Si el inciso se puede quitar y la oración sigue completa, va entre comas. Si al quitarlo la oración pierde sentido, no lleva comas.',
      'Cuando el complemento circunstancial va al principio y es largo, lleva coma detrás: "Después de tres horas de discusión, decidieron votar".',
    ],
    mnemotecnias: [
      {
        clave: 'Sujeto y verbo no se separan',
        significado: 'Regla número uno de la coma en español.',
        uso: 'Si una opción mete coma justo antes del verbo principal, descártala sin leer el resto.',
      },
    ],
    subtemas: ['puntuacion'],
  },
  {
    slug: 'gramatica',
    nombre: 'Gramática, concordancia y sintaxis',
    area: 'verbal',
    resumen:
      'Detectar la oración correcta. Se hace verificando concordancias una a una, no leyendo "a ver cuál suena mejor".',
    dondeAparece: 'SIMADI (Gramática y sintaxis) y UNIMET (Gramática y redacción).',
    pasos: [
      {
        titulo: '1. Concordancia sujeto–verbo',
        detalle:
          'Encuentra el núcleo del sujeto (no los complementos que lo acompañan) y comprueba número y persona. "El grupo de estudiantes llegó", no "llegaron": el núcleo es "grupo".',
      },
      {
        titulo: '2. Concordancia sustantivo–adjetivo',
        detalle:
          'Género y número. Con dos sustantivos de distinto género, el adjetivo va en masculino plural.',
      },
      {
        titulo: '3. Régimen preposicional',
        detalle:
          'Cada verbo pide su preposición: confiar EN, insistir EN, constar DE, carecer DE, contribuir A. Cambiarla es el error más frecuente del examen.',
      },
      {
        titulo: '4. Correlación de tiempos',
        detalle:
          '"Si tuviera dinero, viajaría" — no "si tendría". El condicional nunca va en la cláusula del "si".',
      },
      {
        titulo: '5. Referencia de los pronombres',
        detalle:
          'Cada "le", "lo", "la", "su", "esto" debe apuntar a algo identificable. Si la referencia es ambigua, la oración está mal construida.',
      },
    ],
    trampas: [
      'Queísmo y dequeísmo: "pienso que" (sin de) frente a "me alegro de que" (con de). Prueba: pregunta "¿qué pienso?" / "¿de qué me alegro?".',
      'Laísmo y leísmo: "le dije a María" (correcto), "la dije" (incorrecto).',
      'Gerundio de posterioridad: "salió cerrando la puerta" está bien; "salió llegando a su casa" no — el gerundio no expresa acción posterior.',
      'Doble negación mal construida y anacolutos (frases que empiezan con una estructura y terminan con otra).',
    ],
    trucos: [
      'Reduce la oración a su esqueleto: sujeto núcleo + verbo + complemento directo. La mayoría de los errores aparece en cuanto quitas el relleno.',
      'Si dos opciones dicen lo mismo y una es más corta y directa, en ítems de redacción suele ganar la breve: la concisión es criterio de corrección.',
      'Lee la oración en voz baja pero sin el inciso: los errores de concordancia se vuelven audibles.',
    ],
    subtemas: ['gramatica'],
  },
  {
    slug: 'orden-logico',
    nombre: 'Orden lógico de oraciones',
    area: 'verbal',
    resumen:
      'Cuatro o cinco oraciones desordenadas que forman un párrafo. Se arma por conectores y por referencias, no por intuición.',
    dondeAparece: 'UNIMET (Orden lógico) y ejercicios de coherencia y cohesión.',
    pasos: [
      {
        titulo: '1. Encuentra la oración inicial',
        detalle:
          'Es la que presenta el tema sin depender de nada anterior: no lleva pronombres sueltos, ni "por eso", ni "sin embargo", ni "este/esta" refiriéndose a algo no mencionado.',
      },
      {
        titulo: '2. Sigue las cadenas de referencia',
        detalle:
          'Un sustantivo aparece completo la primera vez y después como pronombre o sinónimo. "La energía solar… esta tecnología… ella". Ese hilo fija el orden.',
      },
      {
        titulo: '3. Usa los conectores como flechas',
        detalle:
          '"Además" suma a lo anterior; "sin embargo" contradice lo anterior; "por lo tanto" concluye; "en primer lugar" abre una enumeración; "finalmente" la cierra.',
      },
      {
        titulo: '4. Ordena de lo general a lo particular',
        detalle:
          'El patrón típico del párrafo académico: tema, desarrollo, ejemplo, conclusión.',
      },
      {
        titulo: '5. Lee el párrafo completo antes de marcar',
        detalle:
          'Con tu orden armado, léelo de corrido. Si hay un salto o una repetición extraña, dos oraciones están cambiadas.',
      },
    ],
    trampas: [
      'Empezar por la oración más general sin comprobar que no depende de otra. A veces la más general es la conclusión.',
      'Guiarse solo por el tema y no por los conectores: dos oraciones del mismo tema pueden ir en cualquier orden salvo por el conector.',
    ],
    trucos: [
      'Mira las opciones: si tres de cuatro empiezan por la misma oración, esa es casi seguro la inicial y solo hay que ordenar el resto.',
      'Fija primero el par que estés seguro que va junto (por ejemplo, la que introduce un término y la que lo explica) y descarta las opciones que los separen.',
    ],
    subtemas: ['orden_logico', 'ordenacion_logica_de_parrafos'],
  },
  {
    slug: 'redaccion',
    nombre: 'Redacción y estilo',
    area: 'verbal',
    resumen:
      'Elegir la versión mejor escrita de una idea. El criterio es claridad, precisión y economía, en ese orden.',
    dondeAparece: 'UNIMET (Redacción indirecta) y ejercicios de reescritura.',
    pasos: [
      {
        titulo: '1. Identifica la idea que debe conservarse',
        detalle:
          'La reescritura no puede añadir ni quitar información. Si una opción agrega un matiz que no estaba, se descarta aunque suene mejor.',
      },
      {
        titulo: '2. Descarta las ambiguas',
        detalle:
          'Si una versión permite dos lecturas (por un pronombre suelto o un modificador mal colocado), no es la correcta.',
      },
      {
        titulo: '3. Descarta las redundantes',
        detalle:
          '"Subir arriba", "salir afuera", "volver a repetir", "prever con antelación". El pleonasmo es error, no estilo.',
      },
      {
        titulo: '4. Prefiere voz activa y verbos concretos',
        detalle:
          '"El comité aprobó el reglamento" gana a "fue realizada la aprobación del reglamento por parte del comité".',
      },
      {
        titulo: '5. Entre las que quedan, gana la más breve',
        detalle: 'A igualdad de claridad y de contenido, la versión más corta es la correcta.',
      },
    ],
    trampas: [
      'La opción más larga y más formal parece más "académica" y suele ser la trampa.',
      'Cambiar el sujeto de la oración al reescribir: cambia el énfasis y ya no dice lo mismo.',
      'Nominalizaciones innecesarias: "realizó la medición de" en lugar de "midió".',
    ],
    trucos: [
      'Cuenta palabras. Si dos opciones dicen exactamente lo mismo, la de menos palabras es la respuesta en la gran mayoría de estos ítems.',
      'Busca el verbo principal de cada opción: si está escondido en un sustantivo, esa opción es peor redacción.',
    ],
    subtemas: ['redaccion_indirecta'],
  },

  // ── CUANTITATIVO ─────────────────────────────────────────────────────────
  {
    slug: 'aritmetica',
    nombre: 'Aritmética y operaciones',
    area: 'cuantitativo',
    resumen:
      'Operaciones, divisibilidad, mcm y MCD, potencias y raíces. La base sobre la que se apoya todo lo demás.',
    dondeAparece: 'UNIMET (Aritmética), UCAB (Aritmética comercial) y USB.',
    pasos: [
      {
        titulo: '1. Respeta la jerarquía',
        detalle:
          'Paréntesis → potencias y raíces → multiplicación y división (de izquierda a derecha) → suma y resta (de izquierda a derecha).',
      },
      {
        titulo: '2. Factoriza antes de operar',
        detalle:
          'Descomponer en primos permite simplificar sin calcular. En una fracción con productos grandes, casi todo se cancela.',
      },
      {
        titulo: '3. Usa las reglas de divisibilidad',
        detalle:
          'Entre 2: termina en cifra par. Entre 3: la suma de sus cifras es múltiplo de 3. Entre 4: las dos últimas cifras forman múltiplo de 4. Entre 5: termina en 0 o 5. Entre 6: entre 2 y entre 3. Entre 8: las tres últimas cifras. Entre 9: la suma de cifras es múltiplo de 9. Entre 11: la suma alternada de cifras da 0 o múltiplo de 11.',
      },
      {
        titulo: '4. mcm para "coincidir", MCD para "repartir"',
        detalle:
          'Cuando algo se repite cada X y cada Y y preguntan cuándo coinciden, es mcm. Cuando hay que dividir cantidades en grupos iguales lo más grandes posible, es MCD.',
      },
      {
        titulo: '5. Estima antes de calcular exacto',
        detalle:
          'Redondea y mira el orden de magnitud. Con eso descartas dos opciones antes de hacer una sola cuenta.',
      },
    ],
    trampas: [
      'Signos: −3² es −9, pero (−3)² es 9.',
      'Raíces: √(a+b) no es √a + √b. Nunca.',
      'Potencias: a^m · a^n = a^(m+n) — se suman los exponentes, no se multiplican.',
      'Dividir entre una fracción es multiplicar por su inversa; olvidarlo invierte el resultado.',
    ],
    trucos: [
      'Multiplicar por 5 = multiplicar por 10 y dividir entre 2. Por 25 = por 100 entre 4. Por 9 = por 10 menos el número.',
      'Cuadrados de números que terminan en 5: quita el 5, multiplica por el siguiente y pega 25. 35² → 3×4 = 12 → 1225.',
      'Para comprobar una suma o resta larga, usa la prueba del 9: la suma de cifras del resultado debe cuadrar con la de los operandos.',
    ],
    mnemotecnias: [
      {
        clave: 'PEMDAS al revés no existe',
        significado: 'Paréntesis, Exponentes, Multiplicación/División, Adición/Sustracción.',
        uso:
          'Multiplicación y división tienen la MISMA prioridad y se hacen de izquierda a derecha. Igual suma y resta. Es el error que más resultados arruina.',
      },
      {
        clave: 'mcm coinciden, MCD reparten',
        significado: 'Cómo elegir entre los dos.',
        uso: '¿Cuándo vuelven a sonar juntas las campanas? mcm. ¿De cuántos en cuántos reparto sin que sobre? MCD.',
      },
    ],
    subtemas: ['aritmetica', 'aritmetica_comercial'],
  },
  {
    slug: 'porcentajes',
    nombre: 'Porcentajes',
    area: 'cuantitativo',
    resumen:
      'Aumentos, descuentos y variaciones. Todo se resuelve con factores multiplicativos, que es más rápido y evita el error clásico de sumar porcentajes.',
    dondeAparece: 'UCAB (Porcentajes), UNIMET (Razonamiento proporcional) y USB.',
    pasos: [
      {
        titulo: '1. Convierte el porcentaje en factor',
        detalle:
          'Aumentar 20 % es multiplicar por 1,20. Descontar 20 % es multiplicar por 0,80. Aumentar 5 % es ×1,05.',
      },
      {
        titulo: '2. Encadena los factores',
        detalle:
          'Dos descuentos sucesivos del 20 % y del 10 % son ×0,80 × 0,90 = ×0,72, es decir un 28 % de descuento total. No 30 %.',
      },
      {
        titulo: '3. Para el porcentaje que falta, despeja',
        detalle:
          'parte = porcentaje × total. Si te dan dos, el tercero sale dividiendo. "¿Qué porcentaje es 18 de 45?" → 18/45 = 0,4 = 40 %.',
      },
      {
        titulo: '4. Cuidado con el "de qué"',
        detalle:
          'El porcentaje siempre se calcula sobre una base. Si el precio sube 20 % y luego baja 20 %, no vuelve al original: la segunda base es mayor.',
      },
      {
        titulo: '5. Para volver atrás, divide',
        detalle:
          'Si un precio ya rebajado un 25 % es 300, el original es 300 / 0,75 = 400. Restarle 25 % a 300 daría un resultado falso.',
      },
    ],
    trampas: [
      'Sumar porcentajes sucesivos. Nunca se suman: se multiplican los factores.',
      'Confundir "aumentó un 20 %" con "aumentó AL 20 %". El primero suma; el segundo lleva al 20 % del valor original.',
      'Puntos porcentuales frente a porcentaje: pasar de 10 % a 12 % es +2 puntos, pero +20 % de aumento relativo.',
      'Calcular el descuento sobre el precio final en lugar de sobre el original.',
    ],
    trucos: [
      'El porcentaje es conmutativo: el 16 % de 25 es lo mismo que el 25 % de 16, y el segundo se hace de cabeza (= 4).',
      'El 10 % es correr la coma un lugar. Con eso construyes el 5 % (la mitad), el 20 % (el doble), el 15 % (10 % + 5 %) y el 1 % (dos lugares).',
      'Para un aumento seguido de un descuento del mismo porcentaje p, el resultado final siempre es menor: queda (1 − p²) del original.',
    ],
    mnemotecnias: [
      {
        clave: 'FACTOR, no suma',
        significado: 'Todo porcentaje se convierte en un multiplicador.',
        uso: '+30 % → ×1,3. −30 % → ×0,7. Encadenar es multiplicar; sumar porcentajes es siempre un error.',
      },
    ],
    ejemplo: {
      enunciado:
        'Un artículo sube 25 % y después se rebaja 20 %. ¿Cuál es la variación final respecto al precio original?',
      pasos: [
        'Factor de subida: 1,25. Factor de rebaja: 0,80.',
        'Encadenados: 1,25 × 0,80 = 1,00.',
        'El factor final es exactamente 1.',
      ],
      respuesta: 'El precio queda igual que al principio: 0 % de variación.',
    },
    subtemas: ['porcentajes'],
  },
  {
    slug: 'proporciones',
    nombre: 'Razones, proporciones y regla de tres',
    area: 'cuantitativo',
    resumen:
      'Relacionar cantidades que crecen o decrecen juntas. Decidir si la relación es directa o inversa resuelve el 90 % del ejercicio.',
    dondeAparece:
      'UNIMET (Razonamiento proporcional), UCAB (Fracciones y proporciones) y USB.',
    pasos: [
      {
        titulo: '1. Escribe las magnitudes en columnas con su unidad',
        detalle:
          'Obreros | días | obra. Poner la unidad evita comparar peras con manzanas, que es de donde sale casi todo el error.',
      },
      {
        titulo: '2. Pregunta: si una sube, ¿la otra sube o baja?',
        detalle:
          'Más obreros → menos días: inversa. Más kilos → más precio: directa. Contéstalo en voz alta antes de escribir nada.',
      },
      {
        titulo: '3. Monta la proporción',
        detalle:
          'Directa: a/b = c/x, y se multiplica en cruz. Inversa: a·b = c·x, se multiplica en línea.',
      },
      {
        titulo: '4. Para repartos proporcionales, usa la constante',
        detalle:
          'Reparte 300 en razón 2:3:5. Suma las partes (10), divide 300/10 = 30, y multiplica: 60, 90, 150.',
      },
      {
        titulo: '5. Verifica que el resultado tenga sentido',
        detalle:
          'Si añadiste obreros y te salieron más días, el planteamiento estaba invertido. Este chequeo de coherencia toma dos segundos y salva el ejercicio.',
      },
    ],
    trampas: [
      'Aplicar regla de tres directa a una situación inversa. Es el error más caro de esta sección.',
      'Mezclar unidades: horas con minutos, kilómetros con metros.',
      'En problemas con tres magnitudes (regla de tres compuesta), tratar todas como directas. Cada par se analiza por separado.',
      'En razones a:b, tomar "a" como el total. El total es a+b.',
    ],
    trucos: [
      'Regla de tres compuesta: escribe la fila conocida y la incógnita, y para cada magnitud multiplica por la fracción en el sentido correcto (directa: como está; inversa: dada vuelta).',
      'Si el enunciado da una razón y una diferencia ("son 3:5 y se diferencian en 8"), llama 3k y 5k: la diferencia es 2k = 8, luego k = 4.',
      'Trabaja con la constante de proporcionalidad k = y/x: sirve para todos los apartados del mismo ejercicio.',
    ],
    mnemotecnias: [
      {
        clave: 'MÁS → MÁS es directa; MÁS → MENOS es inversa',
        significado: 'El único diagnóstico que hay que hacer.',
        uso:
          'Y de ahí sale la operación: directa se multiplica en cruz, inversa se multiplica en línea.',
      },
    ],
    subtemas: ['fracciones', 'razonamiento_proporcional'],
  },
  {
    slug: 'planteamientos',
    nombre: 'Planteamientos algebraicos',
    area: 'cuantitativo',
    resumen:
      'Problemas con enunciado que hay que traducir a una ecuación. Lo difícil no es resolverla: es escribirla.',
    dondeAparece: 'UNIMET (Planteamientos algebraicos), USB y UCAB.',
    pasos: [
      {
        titulo: '1. Nombra la incógnita con precisión',
        detalle:
          'Escribe "x = número de sillas", no solo "x". La mitad de los errores nace de olvidar qué representaba x.',
      },
      {
        titulo: '2. Expresa todo lo demás en función de x',
        detalle:
          '"El doble" es 2x; "tres más que" es x+3; "tres menos que x" es x−3 (no 3−x); "la mitad" es x/2; "el consecutivo" es x+1.',
      },
      {
        titulo: '3. Encuentra la igualdad',
        detalle:
          'Hay una frase en el enunciado que dice que dos cosas son iguales: "en total", "es lo mismo que", "resulta". Esa frase es el signo =.',
      },
      {
        titulo: '4. Resuelve y vuelve al enunciado',
        detalle:
          'Encontrar x no siempre es la respuesta. Si x era la edad del hijo y preguntan la del padre, falta un paso.',
      },
      {
        titulo: '5. Verifica sustituyendo en el enunciado original',
        detalle:
          'No en tu ecuación — en el enunciado. Si tu ecuación estaba mal planteada, verificarla contra sí misma no detecta nada.',
      },
    ],
    trampas: [
      '"Tres menos que un número" es x−3, no 3−x. El orden se invierte al traducir.',
      'Problemas de edades: la diferencia de edades es constante en el tiempo; las edades futuras son x+n para todos.',
      'Mezclas y aleaciones: lo que se conserva es la cantidad de sustancia, no el porcentaje.',
      'Dar como respuesta la incógnita auxiliar en lugar de lo que preguntan.',
    ],
    trucos: [
      'Si el álgebra se complica, prueba las opciones en el enunciado. Con cuatro alternativas, sustituir suele ser más rápido que despejar.',
      'Para dos incógnitas con dos datos, suma y resta las ecuaciones: elimina una variable sin sustituir.',
      'Problemas de "trabajo conjunto": trabaja con fracciones de obra por unidad de tiempo, no con tiempos. 1/a + 1/b = 1/t.',
    ],
    mnemotecnias: [
      {
        clave: 'NOMBRA – TRADUCE – IGUALA – VUELVE',
        significado: 'Las cuatro etapas de todo problema con enunciado.',
        uso:
          'La cuarta es la que se olvida: VUELVE al enunciado a comprobar qué te preguntaban realmente.',
      },
    ],
    subtemas: ['algebra', 'planteamientos_algebraicos', 'equivalencias_matematicas'],
  },
  {
    slug: 'geometria',
    nombre: 'Geometría y medición',
    area: 'cuantitativo',
    resumen:
      'Áreas, perímetros, volúmenes y ángulos. Se resuelve dibujando y anotando cada dato sobre la figura.',
    dondeAparece: 'UNIMET (Geometría y medición), USB (Geometría plana) y UCAB.',
    pasos: [
      {
        titulo: '1. Dibuja aunque venga dibujado',
        detalle:
          'Redibuja a mano y escribe cada dato sobre su lado o su ángulo. Las figuras del examen no están a escala y engañan la vista.',
      },
      {
        titulo: '2. Busca el triángulo rectángulo escondido',
        detalle:
          'La diagonal de un rectángulo, la altura de un triángulo isósceles, el radio con la tangente: casi todo se resuelve con Pitágoras una vez lo encuentras.',
      },
      {
        titulo: '3. Descompón la figura irregular',
        detalle:
          'Toda figura rara es una suma o una resta de figuras conocidas. El área sombreada casi siempre es "la grande menos la chica".',
      },
      {
        titulo: '4. Recuerda cómo escalan las medidas',
        detalle:
          'Si multiplicas las longitudes por k, las áreas se multiplican por k² y los volúmenes por k³. Duplicar el lado cuadruplica el área.',
      },
      {
        titulo: '5. Revisa las unidades al final',
        detalle:
          'Perímetro en cm, área en cm², volumen en cm³. Si te piden m² y trabajaste en cm, el factor es 10 000, no 100.',
      },
    ],
    trampas: [
      'Confundir área con perímetro. Dos figuras con el mismo perímetro pueden tener áreas muy distintas.',
      'Usar el diámetro donde va el radio en el área del círculo (πr²).',
      'Suponer que un ángulo es recto porque lo parece en el dibujo. Solo vale si el enunciado o la marca lo dicen.',
      'Convertir unidades de área multiplicando por 100 en lugar de por 100².',
    ],
    trucos: [
      'Fórmulas que hay que tener frescas: triángulo b·h/2; trapecio (B+b)·h/2; círculo πr² y perímetro 2πr; cilindro πr²h; esfera (4/3)πr³ y superficie 4πr².',
      'Ternas pitagóricas memorizadas: 3-4-5, 5-12-13, 8-15-17 y sus múltiplos. Aparecen constantemente.',
      'La suma de los ángulos interiores de un polígono de n lados es 180°(n−2).',
      'En triángulos semejantes, la razón de áreas es el cuadrado de la razón de lados.',
    ],
    mnemotecnias: [
      {
        clave: 'k, k², k³',
        significado: 'Longitud, área y volumen al escalar.',
        uso:
          'Si una maqueta está a escala 1:2 respecto al original, sus áreas están a 1:4 y sus volúmenes a 1:8.',
      },
    ],
    subtemas: ['geometria', 'geometria_y_medicion'],
  },
  {
    slug: 'estadistica',
    nombre: 'Estadística y probabilidad',
    area: 'cuantitativo',
    resumen:
      'Media, mediana, moda, y contar casos favorables sobre casos posibles. Casi todo el trabajo es contar bien.',
    dondeAparece: 'UNIMET (Estadística y probabilidad) y SIMADI.',
    pasos: [
      {
        titulo: '1. Distingue las tres medidas',
        detalle:
          'Media: suma entre cantidad. Mediana: el valor del medio con los datos ORDENADOS (con cantidad par, el promedio de los dos centrales). Moda: el que más se repite.',
      },
      {
        titulo: '2. Para la media, piensa en la suma total',
        detalle:
          'La media por la cantidad te devuelve la suma. Ese paso resuelve los ejercicios de "¿cuánto debe sacar en el último examen para promediar X?".',
      },
      {
        titulo: '3. En probabilidad, define bien el espacio',
        detalle:
          'Casos posibles = todos los resultados igualmente probables. Casos favorables = los que cumplen. La probabilidad es el cociente, siempre entre 0 y 1.',
      },
      {
        titulo: '4. Traduce "y" y "o"',
        detalle:
          '"Y" (que pasen los dos) → multiplicar. "O" (que pase uno u otro) → sumar, y restar la intersección si pueden pasar a la vez.',
      },
      {
        titulo: '5. Decide si importa el orden',
        detalle:
          'Si importa, es variación/permutación. Si no importa, es combinación: C(n,k) = n! / (k!(n−k)!). Un podio importa el orden; un comité no.',
      },
    ],
    trampas: [
      'Calcular la mediana sin ordenar los datos primero.',
      'Con reemplazo o sin reemplazo: si sacas una bola y no la devuelves, el denominador de la segunda extracción baja en uno.',
      'Sumar probabilidades de sucesos que pueden ocurrir a la vez sin restar la intersección.',
      'Confundir "al menos uno" con "exactamente uno". "Al menos uno" se calcula mucho más fácil como 1 − P(ninguno).',
    ],
    trucos: [
      '"Al menos uno" = 1 − P(ninguno). Este atajo convierte ejercicios largos en una línea.',
      'Si a todos los datos les sumas una constante, la media y la mediana suben lo mismo y la desviación no cambia.',
      'La media siempre queda entre el mínimo y el máximo: si tu resultado se sale de ese rango, hay un error de suma.',
    ],
    mnemotecnias: [
      {
        clave: 'Y multiplica, O suma',
        significado: 'La traducción de los conectores en probabilidad.',
        uso: 'P(A y B) = P(A)·P(B) si son independientes. P(A o B) = P(A) + P(B) − P(A y B).',
      },
      {
        clave: 'MOda = la que se repite MOntones',
        significado: 'Para no confundir moda con mediana.',
        uso: 'Y MEDIAna está en el MEDIO — pero solo después de ordenar.',
      },
    ],
    subtemas: ['estadistica', 'estadistica_y_probabilidad'],
  },
  {
    slug: 'graficos',
    nombre: 'Interpretación de gráficos y tablas',
    area: 'cuantitativo',
    resumen:
      'Leer datos de una figura y operar con ellos. Se falla por leer mal el eje, no por no saber la cuenta.',
    dondeAparece: 'UNIMET (Interpretación de gráficos) y en problemas con tablas de todas las pruebas.',
    pasos: [
      {
        titulo: '1. Lee el título y los dos ejes antes que nada',
        detalle:
          'Qué se mide, en qué unidad, y en qué escala. Un eje en miles cambia todos los resultados.',
      },
      {
        titulo: '2. Comprueba si el eje empieza en cero',
        detalle:
          'Los gráficos con el eje truncado exageran las diferencias visuales. Si no empieza en cero, no compares alturas a ojo.',
      },
      {
        titulo: '3. Localiza el dato exacto que pide la pregunta',
        detalle:
          'Marca en el gráfico el punto o la barra concreta antes de calcular. La mayoría de errores son de lectura, no de cálculo.',
      },
      {
        titulo: '4. Distingue valor absoluto de porcentaje',
        detalle:
          'En un gráfico de sectores todo es porcentaje: para obtener cantidades necesitas el total. Y un porcentaje mayor sobre un total menor puede ser menos cantidad.',
      },
      {
        titulo: '5. Para "variación", resta y divide por el inicial',
        detalle:
          'Variación porcentual = (final − inicial) / inicial × 100. Dividir por el final es el error clásico.',
      },
    ],
    trampas: [
      'Comparar barras de dos gráficos distintos con escalas distintas.',
      'Sumar porcentajes de gráficos de sectores de años diferentes.',
      'Leer la tendencia y no el valor: "creció más rápido" no es lo mismo que "es mayor".',
    ],
    trucos: [
      'Si preguntan cuál creció más en términos relativos, no busques la barra que más subió: divide el aumento entre el punto de partida.',
      'En gráficos de líneas, la pendiente es la velocidad de cambio: el tramo más inclinado es el de mayor variación por unidad de tiempo.',
    ],
    subtemas: [
      'interpretacion_graficos',
      'interpretacion_de_tablas_y_equivalencias',
      'interpretacion_y_ponderacion_de_datos',
    ],
  },
  {
    slug: 'funciones',
    nombre: 'Funciones y variación',
    area: 'cuantitativo',
    resumen:
      'Relaciones entre dos variables: rectas, parábolas y crecimientos. Se domina leyendo la fórmula como una descripción.',
    dondeAparece: 'UNIMET (Funciones y variación) y USB (Funciones).',
    pasos: [
      {
        titulo: '1. Identifica el tipo por su forma',
        detalle:
          'y = mx + b es recta; y = ax² + bx + c es parábola; y = k/x es hipérbola (proporcionalidad inversa); y = a·bˣ es exponencial.',
      },
      {
        titulo: '2. Lee los parámetros',
        detalle:
          'En la recta, m es la pendiente (cuánto sube y por cada unidad de x) y b es donde corta el eje y. En la parábola, si a > 0 abre hacia arriba.',
      },
      {
        titulo: '3. Evalúa con valores concretos',
        detalle:
          'Sustituye x = 0 y x = 1. Con dos puntos ya puedes descartar la mayoría de las gráficas propuestas.',
      },
      {
        titulo: '4. Para los cortes, iguala a cero',
        detalle:
          'Corte con el eje x: haz y = 0 y resuelve. Corte con el eje y: haz x = 0. El vértice de la parábola está en x = −b/2a.',
      },
      {
        titulo: '5. Traduce el enunciado a función',
        detalle:
          'Costo fijo + costo por unidad es una recta: C(x) = fijo + variable·x. Reconocerlo convierte un problema verbal en dos líneas.',
      },
    ],
    trampas: [
      'Confundir la pendiente con el corte. La pendiente acompaña a x; el corte va solo.',
      'En proporcionalidad inversa, la gráfica no es una recta descendente: es una curva que nunca toca los ejes.',
      'Olvidar el dominio real del problema: si x son personas, no puede ser negativo ni fraccionario.',
    ],
    trucos: [
      'Pendiente entre dos puntos: (y₂ − y₁) / (x₂ − x₁). Positiva sube, negativa baja, cero es horizontal.',
      'Si te dan una tabla, comprueba las diferencias de y: constantes → lineal; diferencias de las diferencias constantes → cuadrática; razones constantes → exponencial.',
    ],
    subtemas: ['funciones', 'funciones_y_variacion'],
  },
  {
    slug: 'movimiento',
    nombre: 'Movimiento, velocidad y trabajo',
    area: 'cuantitativo',
    resumen:
      'Móviles que se alcanzan o se cruzan, y tareas que se hacen entre varios. Dos familias con la misma estructura.',
    dondeAparece: 'UCAB (Movimiento y velocidad) y problemas de trabajo conjunto.',
    pasos: [
      {
        titulo: '1. Escribe la relación básica',
        detalle: 'distancia = velocidad × tiempo. De ahí salen t = d/v y v = d/t.',
      },
      {
        titulo: '2. Unifica unidades antes de operar',
        detalle:
          'km/h con horas, m/s con segundos. Para pasar de km/h a m/s se divide entre 3,6.',
      },
      {
        titulo: '3. Identifica el escenario',
        detalle:
          'Encuentro (van uno hacia el otro): las velocidades se suman. Alcance (van en el mismo sentido): se restan. El tiempo es la distancia inicial entre esa velocidad combinada.',
      },
      {
        titulo: '4. Para trabajo conjunto, usa fracciones de obra',
        detalle:
          'Si A tarda a horas, hace 1/a de la obra por hora. Juntos: 1/a + 1/b = 1/t, y de ahí t = ab/(a+b).',
      },
      {
        titulo: '5. Comprueba el sentido físico',
        detalle:
          'Trabajando juntos siempre tardan menos que el más rápido solo. Si te sale más, hay un error de planteamiento.',
      },
    ],
    trampas: [
      'Promediar velocidades. Si vas de ida a 60 y de vuelta a 40, la media no es 50: es 2·60·40/(60+40) = 48.',
      'Olvidar el tiempo de ventaja cuando uno sale antes.',
      'Mezclar km con m o minutos con horas a mitad del problema.',
    ],
    trucos: [
      'Velocidad media de un ida y vuelta con la misma distancia: media armónica, 2v₁v₂/(v₁+v₂).',
      'En problemas de alcance, piensa en la velocidad relativa: es como si el perseguido estuviera quieto y el perseguidor fuera a la diferencia de velocidades.',
    ],
    mnemotecnias: [
      {
        clave: 'Se acercan → suman. Se persiguen → restan.',
        significado: 'Velocidad relativa en una línea.',
        uso: 'Y el tiempo sale siempre igual: distancia que los separa entre velocidad relativa.',
      },
    ],
    subtemas: ['movimiento'],
  },
  {
    slug: 'estimacion',
    nombre: 'Estimación y razonamiento matemático',
    area: 'cuantitativo',
    resumen:
      'Ejercicios donde calcular exacto es una pérdida de tiempo: se contesta acotando, redondeando o probando opciones.',
    dondeAparece: 'UNIMET (Estimación) y SIMADI (Razonamiento matemático).',
    pasos: [
      {
        titulo: '1. Mira las opciones antes de calcular',
        detalle:
          'Si están muy separadas, una estimación gruesa basta. Si están muy juntas, toca cálculo exacto — pero ya sabes en qué te estás metiendo.',
      },
      {
        titulo: '2. Redondea a números cómodos',
        detalle:
          '197 × 4,9 ≈ 200 × 5 = 1000. Después ajusta el sentido del error: redondeaste hacia arriba las dos veces, así que el resultado real es algo menor.',
      },
      {
        titulo: '3. Acota entre dos valores',
        detalle:
          'Si el resultado está entre 40 y 50, cualquier opción fuera de ese rango cae sin más cuentas.',
      },
      {
        titulo: '4. Prueba las opciones al revés',
        detalle:
          'En preguntas de "qué valor cumple", sustituir las cuatro es a menudo más rápido que despejar. Empieza por la del medio: te dice hacia qué lado moverte.',
      },
      {
        titulo: '5. Usa la última cifra',
        detalle:
          'En productos y sumas grandes, la cifra de las unidades del resultado se calcula sola y suele dejar una única opción viable.',
      },
    ],
    trampas: [
      'Redondear demasiado cuando las opciones son cercanas.',
      'Redondear las dos cantidades en el mismo sentido y no corregir la desviación acumulada.',
      'Estimar en problemas donde piden el valor exacto de un dinero o una cantidad de personas.',
    ],
    trucos: [
      'Para dividir entre 5, multiplica por 2 y corre la coma. Para dividir entre 25, multiplica por 4 y corre dos.',
      'Fracciones frecuentes en decimal: 1/8 = 0,125; 1/6 ≈ 0,167; 3/8 = 0,375; 5/8 = 0,625. Memorizarlas ahorra divisiones largas.',
    ],
    subtemas: ['estimacion', 'razonamiento'],
  },

  // ── ESPACIAL ─────────────────────────────────────────────────────────────
  {
    slug: 'cubos',
    nombre: 'Cubos y sólidos',
    area: 'espacial',
    resumen:
      'Cubos pintados, apilados o girados. Se resuelve contando por categorías, no visualizando el cubo entero.',
    dondeAparece: 'USB (Cubos y sólidos).',
    pasos: [
      {
        titulo: '1. Para un cubo n×n×n pintado por fuera y cortado',
        detalle:
          'Con 3 caras pintadas: siempre 8 (las esquinas). Con 2 caras: 12(n−2) (las aristas). Con 1 cara: 6(n−2)² (los centros de cara). Sin pintar: (n−2)³ (el núcleo interior).',
      },
      {
        titulo: '2. Comprueba con el total',
        detalle: 'Las cuatro categorías deben sumar n³. Si no suman, hay un error de conteo.',
      },
      {
        titulo: '3. Para apilamientos, cuenta por capas',
        detalle:
          'Cuenta de abajo hacia arriba, capa por capa. Y no olvides los cubos ocultos que sostienen los de arriba: si hay un cubo en el nivel 3, tiene que haber algo debajo.',
      },
      {
        titulo: '4. Para caras visibles, suma por dirección',
        detalle:
          'Mira el sólido desde arriba, de frente y de lado; cuenta las caras vistas en cada dirección y duplica si preguntan por toda la superficie.',
      },
    ],
    trampas: [
      'Olvidar los cubos internos que no se ven pero existen.',
      'En un cubo 3×3×3 solo hay 1 cubo sin pintar; en un 4×4×4 hay 8. La fórmula (n−2)³ crece rápido y la intuición falla.',
      'Contar dos veces las esquinas al calcular las aristas.',
    ],
    trucos: [
      'Memoriza el caso 3×3×3: 8 con tres caras, 12 con dos, 6 con una, 1 sin pintar. Total 27. Es el que más aparece.',
      'Si el cubo grande se pinta solo en algunas caras, resta las categorías que corresponden a las caras sin pintar en lugar de recontar todo.',
    ],
    mnemotecnias: [
      {
        clave: '8 – 12(n−2) – 6(n−2)² – (n−2)³',
        significado: 'Esquinas, aristas, caras, núcleo.',
        uso:
          'Los coeficientes 8, 12, 6, 1 son los elementos del cubo: 8 vértices, 12 aristas, 6 caras y 1 interior.',
      },
    ],
    subtemas: ['cubos'],
  },
  {
    slug: 'desarrollo-solidos',
    nombre: 'Desarrollo de sólidos',
    area: 'espacial',
    resumen:
      'Una plantilla plana que se dobla para formar un cuerpo. Se resuelve con la regla de las caras opuestas.',
    dondeAparece: 'USB (Desarrollo de sólidos).',
    pasos: [
      {
        titulo: '1. Elige una cara de referencia',
        detalle: 'La más fácil de reconocer. Todo lo demás se sitúa respecto a ella.',
      },
      {
        titulo: '2. Aplica la regla del salto',
        detalle:
          'En un desarrollo de cubo, dos caras separadas por exactamente una cara en la misma fila o columna quedan OPUESTAS al plegar. Las opuestas nunca pueden verse a la vez.',
      },
      {
        titulo: '3. Descarta por caras opuestas',
        detalle:
          'Si una opción muestra dos caras que deben quedar opuestas, se descarta al instante, sin doblar nada mentalmente.',
      },
      {
        titulo: '4. Verifica la orientación de los dibujos',
        detalle:
          'Al plegar, los símbolos giran. Comprueba hacia dónde apunta cada flecha o vértice respecto a la cara de referencia.',
      },
      {
        titulo: '5. Comprueba el número de caras',
        detalle:
          'Cubo: 6 cuadrados. Pirámide de base cuadrada: 1 cuadrado + 4 triángulos. Prisma triangular: 2 triángulos + 3 rectángulos.',
      },
    ],
    trampas: [
      'Doblar mentalmente todo el desarrollo. Es lento y poco fiable: la regla de las opuestas hace el trabajo.',
      'Ignorar la orientación de los símbolos: dos opciones pueden tener las caras correctas y solo una la rotación correcta.',
      'Confundir un reflejo con una rotación: si el dibujo aparece en espejo, esa opción está mal.',
    ],
    trucos: [
      'En el desarrollo en cruz, la cara central es opuesta a la del extremo del brazo largo.',
      'Trabaja con tres caras que compartan un vértice: si esas tres coinciden en la opción, casi siempre es la correcta.',
    ],
    mnemotecnias: [
      {
        clave: 'Salta una, quedan opuestas',
        significado: 'La regla de oro del desarrollo del cubo.',
        uso: 'Dos caras con una cara entre medias, en línea recta, jamás se tocan en el cubo armado.',
      },
    ],
    subtemas: ['desarrollo'],
  },
  {
    slug: 'vectores',
    nombre: 'Vectores en el plano',
    area: 'espacial',
    resumen:
      'Flechas con módulo, dirección y sentido. Sumar y restar se hace por componentes, que es siempre más seguro que dibujar.',
    dondeAparece: 'USB (Vectores en el plano).',
    pasos: [
      {
        titulo: '1. Descompón en componentes',
        detalle:
          'Todo vector se escribe (x, y). Con módulo y ángulo: x = |v|·cos θ, y = |v|·sen θ.',
      },
      {
        titulo: '2. Suma y resta componente a componente',
        detalle: '(a, b) + (c, d) = (a+c, b+d). Restar es sumar el opuesto: −(c, d) = (−c, −d).',
      },
      {
        titulo: '3. Calcula el módulo con Pitágoras',
        detalle: '|v| = √(x² + y²). El ángulo sale de tan θ = y/x, atendiendo al cuadrante.',
      },
      {
        titulo: '4. Comprueba con el dibujo',
        detalle:
          'La suma es la diagonal del paralelogramo; la resta va de la punta del segundo a la punta del primero. Sirve para verificar el signo, no para calcular.',
      },
    ],
    trampas: [
      'Sumar módulos en lugar de componentes. |a + b| solo es |a| + |b| si van en la misma dirección.',
      'Perder el signo del cuadrante al calcular el ángulo con la calculadora.',
      'Confundir vector con escalar: la velocidad tiene dirección; la rapidez no.',
    ],
    trucos: [
      'Vectores perpendiculares: el módulo de la suma sale directo por Pitágoras.',
      'Si dos vectores son opuestos, su suma es el vector nulo, y esa suele ser una opción del examen.',
    ],
    subtemas: ['vectores'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════
// ÍNDICE SUBTEMA → MÉTODO
// ═══════════════════════════════════════════════════════════════════════════

const INDICE_SUBTEMAS: Record<string, Metodo> = {}
for (const m of METODOS) {
  for (const s of m.subtemas) INDICE_SUBTEMAS[s] = m
}

/** Normaliza un nombre o código de subtema al formato de `subtopics.code`. */
function normaliza(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

/**
 * Método que resuelve un subtema del banco.
 *
 * Acepta el código exacto (`silogismos`) o el nombre visible (`Silogismos`), y
 * cae en un método por área cuando el subtema no tiene uno propio — así una
 * pregunta de un subtema nuevo sigue mostrando algo útil en lugar de nada.
 */
export function metodoParaSubtema(subtema?: string | null, areaCodigo?: string | null): Metodo | null {
  if (subtema) {
    const clave = normaliza(subtema)
    if (INDICE_SUBTEMAS[clave]) return INDICE_SUBTEMAS[clave]
    // Coincidencia parcial: "series_numericas" contra "numericos"/"series".
    const parcial = METODOS.find(m =>
      m.subtemas.some(s => clave.includes(s) || s.includes(clave))
    )
    if (parcial) return parcial
  }
  if (areaCodigo) {
    const porArea: Record<string, string> = {
      logico: 'ordenamiento',
      verbal: 'comprension',
      cuantitativo: 'planteamientos',
      numerica: 'aritmetica',
      habilidades: 'comprension',
      conocimientos: 'geometria',
    }
    const slug = porArea[normaliza(areaCodigo)]
    if (slug) return METODOS.find(m => m.slug === slug) ?? null
  }
  return null
}

export function metodoPorSlug(slug: string): Metodo | null {
  return METODOS.find(m => m.slug === slug) ?? null
}

export function metodosPorArea(area: AreaClave): Metodo[] {
  return METODOS.filter(m => m.area === area)
}

// ═══════════════════════════════════════════════════════════════════════════
// TIPS PARA RESOLVER
// ═══════════════════════════════════════════════════════════════════════════

export type CategoriaTip = 'estrategia' | 'tiempo' | 'descarte' | 'mental' | 'preparacion'

export interface Tip {
  slug: string
  categoria: CategoriaTip
  titulo: string
  texto: string
  /** El porqué. Un consejo que no se entiende no se aplica bajo presión. */
  porque: string
}

export const CATEGORIAS_TIP: Record<CategoriaTip, { nombre: string; descripcion: string }> = {
  estrategia: {
    nombre: 'Estrategia de examen',
    descripcion: 'Cómo recorrer la prueba y en qué orden atacar.',
  },
  tiempo: {
    nombre: 'Manejo del tiempo',
    descripcion: 'El recurso que de verdad se acaba.',
  },
  descarte: {
    nombre: 'Técnica de descarte',
    descripcion: 'Cómo sacar puntos de preguntas que no sabes resolver.',
  },
  mental: {
    nombre: 'Cabeza y nervios',
    descripcion: 'Lo que decide el examen cuando el contenido ya lo tienes.',
  },
  preparacion: {
    nombre: 'Preparación',
    descripcion: 'Qué hacer en las semanas y los días previos.',
  },
}

export const TIPS: Tip[] = [
  // Estrategia
  {
    slug: 'tres-vueltas',
    categoria: 'estrategia',
    titulo: 'Haz tres vueltas, no una',
    texto:
      'Primera vuelta: responde solo lo que sabes de inmediato y marca el resto. Segunda vuelta: las que requieren trabajo. Tercera: las difíciles y las dudosas, con el tiempo que quede.',
    porque:
      'Todas las preguntas valen igual. Gastar ocho minutos en la número 3 mientras la 40 —que sabías— se queda sin responder es la forma más común de perder puntos que ya tenías ganados.',
  },
  {
    slug: 'lee-la-pregunta-final',
    categoria: 'estrategia',
    titulo: 'Lee qué te preguntan antes de resolver',
    texto:
      'En problemas largos, lee primero la última línea. Después vuelve al enunciado sabiendo qué dato buscas.',
    porque:
      'Muchos enunciados dan más datos de los necesarios. Saber la pregunta convierte la lectura en una búsqueda y te ahorra calcular cosas que nadie te pidió.',
  },
  {
    slug: 'anota-en-la-hoja',
    categoria: 'estrategia',
    titulo: 'Escribe. Siempre.',
    texto:
      'Diagramas de Venn, tablas de ordenamiento, la frase puente de la analogía, la ecuación. Nada de resolver mentalmente para "ir más rápido".',
    porque:
      'La memoria de trabajo aguanta unos pocos elementos a la vez. Bajo presión, aguanta menos. El papel no se cansa y además te permite revisar dónde te equivocaste sin rehacerlo todo.',
  },
  {
    slug: 'tapa-las-opciones',
    categoria: 'estrategia',
    titulo: 'Tapa las opciones y responde tú primero',
    texto:
      'En analogías, vocabulario e idea principal, formula tu respuesta antes de mirar las alternativas. Luego busca la que más se parece.',
    porque:
      'Los distractores están diseñados por especialistas para sonar plausibles. Si los lees antes de tener criterio propio, uno de ellos te va a parecer bien, y ya no podrás pensar sin él.',
  },
  {
    slug: 'orden-propio',
    categoria: 'estrategia',
    titulo: 'Empieza por tu área más fuerte',
    texto:
      'Si la prueba te deja moverte entre secciones, arranca donde te sientes sólido.',
    porque:
      'Los primeros aciertos calibran la confianza para el resto del examen. Empezar por lo que peor llevas gasta tiempo y ánimo justo cuando más los necesitas.',
  },

  // Tiempo
  {
    slug: 'presupuesto-por-pregunta',
    categoria: 'tiempo',
    titulo: 'Conoce tu minuto por pregunta',
    texto:
      'UNIMET cuantitativa: 75 min para 50 preguntas = 1,5 min. UNIMET verbal: 60 para 50 = 1,2 min. SIMADI: 45 min por bloque de 30 = 1,5 min. USB: 120 min para 100 = 1,2 min. UCAB: 40 min por bloque de ~33 = 1,2 min.',
    porque:
      'Sin una referencia numérica no puedes saber si vas bien o mal. Con ella, un vistazo al reloj en la pregunta 25 te dice exactamente si tienes que acelerar.',
  },
  {
    slug: 'regla-del-doble',
    categoria: 'tiempo',
    titulo: 'La regla del doble',
    texto:
      'Si llevas el doble de tu tiempo medio en una pregunta y no ves la salida, márcala y sigue. Vuelves en la segunda vuelta.',
    porque:
      'El costo de una pregunta atascada no es esa pregunta: son las dos o tres del final que no llegas a leer. Y muchas veces, al volver, la ves de inmediato porque la cabeza siguió trabajando de fondo.',
  },
  {
    slug: 'reloj-por-tercios',
    categoria: 'tiempo',
    titulo: 'Divide la prueba en tercios',
    texto:
      'A un tercio del tiempo deberías llevar un tercio de las preguntas. Revisa el reloj solo en esos dos puntos de control, no cada dos minutos.',
    porque:
      'Mirar el reloj constantemente consume atención y aumenta la ansiedad. Dos controles bastan para corregir el ritmo a tiempo.',
  },
  {
    slug: 'reserva-final',
    categoria: 'tiempo',
    titulo: 'Guarda cinco minutos para transcribir y revisar',
    texto:
      'Reserva los últimos minutos para verificar que la hoja de respuestas está bien marcada y que no dejaste ninguna en blanco por descuido.',
    porque:
      'Un corrimiento de una fila en la hoja de respuestas arruina un examen entero, y es un error que solo se detecta revisando.',
  },

  // Descarte
  {
    slug: 'descarte-progresivo',
    categoria: 'descarte',
    titulo: 'Elimina antes de elegir',
    texto:
      'Tacha físicamente las opciones imposibles. Con cuatro alternativas, eliminar dos convierte un 25 % en un 50 %.',
    porque:
      'Casi nunca sabes cuál es la correcta, pero casi siempre sabes que alguna es imposible. Ese conocimiento parcial vale puntos si lo usas.',
  },
  {
    slug: 'extremos-y-absolutos',
    categoria: 'descarte',
    titulo: 'Desconfía de "siempre", "nunca", "todos"',
    texto:
      'En comprensión lectora y en preguntas conceptuales, las opciones absolutas suelen ser falsas; las matizadas ("puede", "en general", "tiende a") suelen ser verdaderas.',
    porque:
      'Los textos académicos casi nunca afirman en términos absolutos. Basta un contraejemplo para tumbar un "todos", y el redactor del examen lo sabe.',
  },
  {
    slug: 'dos-opciones-iguales',
    categoria: 'descarte',
    titulo: 'Si dos opciones dicen lo mismo, ninguna es',
    texto:
      'Cuando dos alternativas son equivalentes entre sí, ambas se descartan: no puede haber dos respuestas correctas.',
    porque:
      'Es una propiedad estructural del examen, no una corazonada. Y funciona igual de bien aunque no entiendas la pregunta.',
  },
  {
    slug: 'opuestas',
    categoria: 'descarte',
    titulo: 'Si dos opciones son opuestas, mira ahí',
    texto:
      'Cuando dos alternativas se contradicen frontalmente, es muy probable que una de las dos sea la correcta. Concentra el análisis en ese par.',
    porque:
      'El redactor construye el distractor fuerte como la negación de la respuesta. Reconocer el par reduce el problema a una decisión entre dos.',
  },
  {
    slug: 'coherencia-unidades',
    categoria: 'descarte',
    titulo: 'Descarta por magnitud y por unidad',
    texto:
      'En cuantitativa, estima el orden del resultado. Si el área debe rondar 50 cm², las opciones de 500 y de 5 caen sin calcular.',
    porque:
      'Los distractores se generan aplicando los errores típicos (multiplicar en vez de dividir, usar el diámetro en vez del radio), y esos errores dejan huella en el tamaño del número.',
  },

  // Cabeza
  {
    slug: 'equivocarse-entrenando',
    categoria: 'mental',
    titulo: 'Equivocarte entrenando es el objetivo, no el accidente',
    texto:
      'Cada error en la práctica es una pregunta que ya no vas a fallar el día del examen. Un simulacro perfecto no te enseñó nada: solo confirmó lo que ya sabías.',
    porque:
      'El aprendizaje ocurre en la corrección, no en el acierto. Por eso el modo entrenamiento de XILEX no lleva cronómetro ni puntaje: para que puedas fallar sin costo y quedarte a entender por qué.',
  },
  {
    slug: 'respiracion',
    categoria: 'mental',
    titulo: 'Si te bloqueas, respira cuatro veces y salta la pregunta',
    texto:
      'Cuatro respiraciones lentas, exhalando más largo que inhalando, y pasas a la siguiente. No te quedes peleando con la pregunta que te bloqueó.',
    porque:
      'El bloqueo es una respuesta fisiológica que estrecha la atención justo cuando necesitas amplitud. Bajar la activación tarda menos de un minuto y devuelve el acceso a lo que sí sabes.',
  },
  {
    slug: 'no-recontar',
    categoria: 'mental',
    titulo: 'No lleves la cuenta de lo que crees que fallaste',
    texto:
      'Durante el examen, prohibido calcular tu puntaje. Cada pregunta se responde como si fuera la primera.',
    porque:
      'La cuenta mental no cambia ningún resultado y sí consume atención y ánimo. Además casi siempre es pesimista: se recuerdan los fallos mucho mejor que los aciertos.',
  },
  {
    slug: 'primera-intuicion',
    categoria: 'mental',
    titulo: 'Cambia la respuesta solo con una razón concreta',
    texto:
      'Si al revisar encuentras un error específico —leíste mal un dato, aplicaste la regla al revés—, cambia. Si es solo una sensación de duda, no cambies.',
    porque:
      'Los cambios fundados mejoran el puntaje; los cambios por ansiedad lo empeoran. La diferencia está en si puedes nombrar el error que corriges.',
  },
  {
    slug: 'la-noche-antes',
    categoria: 'mental',
    titulo: 'La noche antes no se estudia: se duerme',
    texto:
      'Repaso ligero de métodos y mnemotecnias, cena normal, y a dormir temprano. Nada de material nuevo.',
    porque:
      'El sueño es lo que consolida lo estudiado. Cambiar horas de sueño por horas de repaso de última hora es un mal negocio medido en puntos.',
  },

  // Preparación
  {
    slug: 'errores-cuaderno',
    categoria: 'preparacion',
    titulo: 'Lleva un cuaderno de errores',
    texto:
      'Cada pregunta que falles: anota el tipo, por qué fallaste (no supe / me apuré / leí mal / no entendí el método) y la regla que faltaba. Reléelo antes de cada sesión.',
    porque:
      'Los errores se repiten en patrones. Cinco o seis causas explican casi todos tus fallos, y atacar esas causas rinde mucho más que hacer más ejercicios al azar.',
  },
  {
    slug: 'simulacro-completo',
    categoria: 'preparacion',
    titulo: 'Haz al menos tres simulacros completos y cronometrados',
    texto:
      'Duración real, sin pausas, sin teléfono, a la misma hora del día que tu examen.',
    porque:
      'Resistir 120 minutos de concentración es una capacidad que se entrena aparte del contenido. El primer simulacro largo siempre sale peor de lo esperado; mejor que ese sea en tu casa.',
  },
  {
    slug: 'repasar-explicaciones',
    categoria: 'preparacion',
    titulo: 'Revisa las explicaciones de las que acertaste',
    texto:
      'Sobre todo si dudaste. Un acierto con duda es un fallo que todavía no ocurrió.',
    porque:
      'Acertar por descarte o por suerte no es lo mismo que dominar el tipo de ejercicio, y el examen real cambiará los números lo suficiente como para que se note.',
  },
  {
    slug: 'sesiones-cortas',
    categoria: 'preparacion',
    titulo: 'Mejor 40 minutos diarios que cuatro horas el domingo',
    texto:
      'Sesiones cortas y frecuentes, alternando áreas dentro de la misma sesión.',
    porque:
      'La práctica distribuida y mezclada retiene bastante más que los bloques largos de un solo tema, aunque durante el estudio dé la sensación contraria.',
  },
  {
    slug: 'domina-los-metodos',
    categoria: 'preparacion',
    titulo: 'Aprende métodos, no preguntas',
    texto:
      'El examen no repite ejercicios, repite tipos. Para cada tipo debes tener un procedimiento que puedas ejecutar sin pensar en qué paso viene.',
    porque:
      'Cuando el método es automático, la memoria de trabajo queda libre para lo que sí es específico de esa pregunta. Ahí es donde se gana velocidad sin perder precisión.',
  },
]

export function tipsPorCategoria(categoria: CategoriaTip): Tip[] {
  return TIPS.filter(t => t.categoria === categoria)
}

// ═══════════════════════════════════════════════════════════════════════════
// POLÍTICA DE RESPUESTA POR UNIVERSIDAD
// ═══════════════════════════════════════════════════════════════════════════

export interface PoliticaRespuesta {
  universidad: string
  nombre: string
  penaliza: boolean
  regla: string
  recomendacion: string
}

/**
 * Qué hacer con las preguntas que no sabes, según cómo puntúa cada prueba.
 *
 * Es la decisión estratégica con mayor impacto sobre el puntaje final y la que
 * más aspirantes toman al revés: adivinar a ciegas en la UNIMET resta, y dejar
 * en blanco en las demás regala puntos.
 */
export const POLITICAS_RESPUESTA: PoliticaRespuesta[] = [
  {
    universidad: 'unimet',
    nombre: 'UNIMET (PDU)',
    penaliza: true,
    regla:
      'Cada acierto suma 1 punto; cada error resta 1/3 de punto; las preguntas en blanco no suman ni restan.',
    recomendacion:
      'Con cuatro alternativas, adivinar a ciegas es neutro a la larga (aciertas 1 de 4 y fallas 3, que restan 1). No gana nada. Pero si eliminas aunque sea UNA opción, responder pasa a ser rentable, y con dos eliminadas es claramente rentable. Regla práctica: si no descartaste nada, deja en blanco; si descartaste algo, responde.',
  },
  {
    universidad: 'simadi',
    nombre: 'SIMADI (UCV)',
    penaliza: false,
    regla: 'Se cuentan los aciertos. Las respuestas incorrectas no restan.',
    recomendacion:
      'No dejes ninguna en blanco. Cuando queden dos minutos, marca todas las que falten aunque sea al azar: el valor esperado nunca es negativo.',
  },
  {
    universidad: 'usb',
    nombre: 'USB',
    penaliza: false,
    regla: 'Se cuentan los aciertos; lo que cambia por carrera es el puntaje de corte.',
    recomendacion:
      'Responde absolutamente todas. Reserva el último minuto para rellenar lo que quede vacío.',
  },
  {
    universidad: 'ucab',
    nombre: 'UCAB',
    penaliza: false,
    regla:
      'Se cuentan los aciertos; el resultado se combina con el índice académico (IIA) para el corte.',
    recomendacion:
      'Responde todas. Y como el IIA pesa, cada punto de la prueba cuenta para compensar el promedio de bachillerato.',
  },
]

export function politicaDeUniversidad(codigo?: string | null): PoliticaRespuesta | null {
  if (!codigo) return null
  return POLITICAS_RESPUESTA.find(p => p.universidad === codigo) ?? null
}

// ═══════════════════════════════════════════════════════════════════════════
// MNEMOTECNIAS TRANSVERSALES
// ═══════════════════════════════════════════════════════════════════════════

export interface BloqueMnemotecnias {
  slug: string
  titulo: string
  area: AreaClave | 'general'
  descripcion: string
  items: Mnemotecnia[]
}

export const MNEMOTECNIAS: BloqueMnemotecnias[] = [
  {
    slug: 'logica-formal',
    titulo: 'Lógica formal: las reglas que no se negocian',
    area: 'logico',
    descripcion:
      'Cinco frases que, memorizadas, resuelven la mayoría de los ítems de silogismos y condicionales sin dibujar nada.',
    items: [
      {
        clave: 'PONE la P, QUITA la Q',
        significado:
          'De "si P entonces Q": si te dan P, sale Q. Si te quitan Q (no-Q), sale no-P. Nada más es válido.',
        uso: 'Cualquier otra combinación —te dan Q, o te dan no-P— no concluye nada.',
      },
      {
        clave: 'De dos particulares, nada',
        significado: 'Dos premisas con "algunos" no producen ninguna conclusión.',
        uso: 'Filtro instantáneo: si ambas premisas dicen "algunos", la respuesta es "no se puede concluir".',
      },
      {
        clave: 'De dos negativas, nada',
        significado: 'Dos premisas con "ningún" o "no" tampoco concluyen.',
        uso: 'Mismo filtro. Entre esta y la anterior se resuelve una buena parte de los silogismos.',
      },
      {
        clave: 'La conclusión sigue a la parte más débil',
        significado:
          'Si una premisa es negativa, la conclusión es negativa. Si una es particular, la conclusión es particular.',
        uso: 'Descarta opciones sin analizar el contenido: solo mirando la forma de la conclusión.',
      },
      {
        clave: 'De Morgan da vuelta el signo',
        significado: 'No(A y B) = no A o no B. No(A o B) = no A y no B.',
        uso: 'Para negar cualquier enunciado compuesto sin equivocarse.',
      },
    ],
  },
  {
    slug: 'ortografia-express',
    titulo: 'Ortografía y acentuación en diez frases',
    area: 'verbal',
    descripcion:
      'Lo que hay que tener memorizado para la sección de ortografía, puntuación y acentuación.',
    items: [
      {
        clave: 'AGUDA con N, S o VOCAL',
        significado: 'Las agudas llevan tilde solo si terminan en n, s o vocal.',
        uso: 'Canción, compás, café. Las graves son exactamente lo contrario.',
      },
      {
        clave: 'Esdrújula, tilde siempre',
        significado: 'Sin ninguna excepción.',
        uso: 'Médico, brújula, teléfono, cámara.',
      },
      {
        clave: 'M antes de B y P',
        significado: 'Nunca va "n" delante de b o p.',
        uso: 'También, campo, hombro, siempre.',
      },
      {
        clave: 'HAYA existe, HALLA encuentra, ALLÁ está lejos',
        significado: 'Los tres homófonos que más se preguntan.',
        uso: 'Sustituye por "exista", "encuentre" o "lejos" y sales de la duda.',
      },
      {
        clave: 'ECHO sin h, porque ECHAR no la tiene',
        significado: 'Del verbo echar nunca lleva hache; de hacer, siempre.',
        uso: '"Te echo de menos" / "he hecho la tarea".',
      },
      {
        clave: 'SINO junto es "pero"; SI NO separado es condición',
        significado: 'Adversativa frente a condicional negativa.',
        uso: '"No es rojo, sino azul" / "si no vienes, me voy".',
      },
      {
        clave: 'Los cuatro porqués',
        significado:
          '¿Por qué? pregunta. Porque responde. El porqué es sustantivo. Por que = por el cual.',
        uso: '"¿Por qué llegas tarde? Porque perdí el autobús; ese es el porqué."',
      },
      {
        clave: 'AÚN = todavía; AUN = incluso',
        significado: 'La tilde diacrítica más preguntada después de los monosílabos.',
        uso: '"Aún no llega" / "aun así lo intentó".',
      },
      {
        clave: 'Sujeto y verbo no se separan',
        significado: 'Jamás va coma entre el sujeto y su verbo.',
        uso: 'Descarta de inmediato cualquier alternativa que lo haga.',
      },
      {
        clave: 'El inciso va entre DOS comas',
        significado: 'Una sola coma abre y no cierra: es error.',
        uso: '"Mi hermano, que vive en Mérida, llegó ayer."',
      },
    ],
  },
  {
    slug: 'calculo-mental',
    titulo: 'Cálculo mental y atajos numéricos',
    area: 'cuantitativo',
    descripcion: 'Lo que conviene tener automatizado para no perder minutos en cuentas.',
    items: [
      {
        clave: 'El 10 % es correr la coma',
        significado: 'Y de ahí salen el 5 %, el 20 %, el 15 % y el 1 %.',
        uso: '10 % de 340 = 34. Luego 5 % = 17, 20 % = 68, 15 % = 51.',
      },
      {
        clave: 'El porcentaje es conmutativo',
        significado: 'a % de b = b % de a.',
        uso: 'El 18 % de 50 es difícil; el 50 % de 18 es 9. Mismo resultado.',
      },
      {
        clave: 'FACTOR, no suma',
        significado: 'Los porcentajes sucesivos se multiplican, no se suman.',
        uso: '+20 % y −20 % = ×1,2 × 0,8 = ×0,96. Se pierde un 4 %.',
      },
      {
        clave: 'Terminados en 5 al cuadrado',
        significado: 'Quita el 5, multiplica por el siguiente y pega 25.',
        uso: '45² → 4×5 = 20 → 2025.',
      },
      {
        clave: '3-4-5, 5-12-13, 8-15-17',
        significado: 'Las ternas pitagóricas que más aparecen.',
        uso: 'Si un triángulo rectángulo tiene catetos 6 y 8, la hipotenusa es 10 sin calcular nada.',
      },
      {
        clave: 'k, k², k³',
        significado: 'Al escalar: longitudes por k, áreas por k², volúmenes por k³.',
        uso: 'Duplicar el lado de un cubo multiplica su volumen por 8.',
      },
      {
        clave: 'Y multiplica, O suma',
        significado: 'Probabilidad de sucesos combinados.',
        uso: 'P(A y B) = P(A)·P(B); P(A o B) = P(A) + P(B) − P(ambos).',
      },
      {
        clave: 'Al menos uno = 1 menos ninguno',
        significado: 'El atajo que convierte cuentas largas en una línea.',
        uso: 'P(al menos un 6 en tres dados) = 1 − (5/6)³.',
      },
      {
        clave: 'MÁS→MÁS directa, MÁS→MENOS inversa',
        significado: 'El diagnóstico de toda regla de tres.',
        uso: 'Más obreros, menos días: inversa, se multiplica en línea.',
      },
      {
        clave: 'Divisibilidad: 3 y 9 por suma de cifras',
        significado: 'Y entre 4 por las dos últimas cifras, entre 8 por las tres últimas.',
        uso: '¿1 233 es divisible entre 9? 1+2+3+3 = 9. Sí.',
      },
    ],
  },
  {
    slug: 'verbal-express',
    titulo: 'Verbal: cómo decidir cuando dudas',
    area: 'verbal',
    descripcion:
      'Criterios de desempate para analogías, vocabulario y comprensión, cuando dos opciones parecen igual de buenas.',
    items: [
      {
        clave: 'PUENTE antes que opciones',
        significado: 'La frase que une el par original se escribe antes de leer las alternativas.',
        uso: 'Si ya leíste las opciones y estás perdido, tapa y vuelve a construir la frase.',
      },
      {
        clave: 'Gana la relación más específica',
        significado: 'Entre dos analogías válidas, la correcta es la más precisa.',
        uso: '"Sirve para" pierde contra "es la herramienta propia del oficio de".',
      },
      {
        clave: 'PRS: Prefijo, Raíz, Sufijo',
        significado: 'Para atacar palabras que nunca has visto.',
        uso: 'IN- niega, -FOBIA es miedo, -FILIA es afición, BENE- es bueno, MAL- es malo.',
      },
      {
        clave: 'Verdadero no es lo mismo que "está en el texto"',
        significado: 'En comprensión, solo vale lo que el texto sostiene.',
        uso: 'Descarta la opción que sabes cierta pero que el autor no afirma.',
      },
      {
        clave: 'Los absolutos suelen ser falsos',
        significado: 'Siempre, nunca, todos, ninguno.',
        uso: 'Y las matizadas —"tiende a", "en general"— suelen ser verdaderas.',
      },
    ],
  },
  {
    slug: 'espacial-express',
    titulo: 'Espacial: las dos reglas que resuelven casi todo',
    area: 'espacial',
    descripcion: 'Para la sección de cubos y desarrollos de la USB.',
    items: [
      {
        clave: 'Salta una, quedan opuestas',
        significado:
          'En el desarrollo de un cubo, dos caras separadas por una cara en línea recta quedan opuestas.',
        uso: 'Si una opción muestra las dos a la vez, se descarta sin plegar nada mentalmente.',
      },
      {
        clave: '8 – 12(n−2) – 6(n−2)² – (n−2)³',
        significado: 'Cubos pintados: tres caras, dos caras, una cara, ninguna.',
        uso: 'En un 4×4×4: 8, 24, 24 y 8. Suman 64 = 4³. ✔',
      },
      {
        clave: 'Reflejo no es rotación',
        significado: 'Una figura en espejo nunca se obtiene girando.',
        uso: 'Si la opción está invertida como en un espejo, es incorrecta.',
      },
    ],
  },
  {
    slug: 'general',
    titulo: 'Reglas generales de examen',
    area: 'general',
    descripcion: 'Lo que aplica sin importar la sección ni la universidad.',
    items: [
      {
        clave: 'Dos opciones iguales, ninguna es',
        significado: 'No puede haber dos respuestas correctas.',
        uso: 'Si dos alternativas son equivalentes, descarta las dos y decide entre las otras.',
      },
      {
        clave: 'Dos opciones opuestas, una es',
        significado: 'El par contradictorio suele contener la respuesta.',
        uso: 'Concentra el análisis ahí en lugar de repasar las cuatro.',
      },
      {
        clave: 'Solo cambio con motivo',
        significado: 'Al revisar, cambia una respuesta únicamente si identificas el error concreto.',
        uso: 'Duda difusa: no toques. Error nombrado: corrige.',
      },
      {
        clave: 'Todas valen igual',
        significado: 'La pregunta difícil no da más puntos que la fácil.',
        uso: 'Por eso se hacen tres vueltas, y por eso nunca se pelea con una sola pregunta.',
      },
    ],
  },
]
