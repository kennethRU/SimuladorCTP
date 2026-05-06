/* ═══════════════════════════════════════════════════
   DATA.JS — Datos de módulos y contenido de simulaciones
═══════════════════════════════════════════════════ */

// ── MÓDULOS ──────────────────────────────────────────────────────
const MODULES = [
  { id:"time",     ph:1, icon:"🕐", title:"Manejo del Tiempo",          hours:8,  prio:"Muy alta",   xp:120, ac:"#ef4444", tag:"tag-re", sub:"Clasifique 8 tareas docentes con la Matriz de Eisenhower", max:80  },
  { id:"adapt",    ph:1, icon:"🌊", title:"Adaptabilidad y Resiliencia", hours:8,  prio:"Muy alta",   xp:120, ac:"#f97316", tag:"tag-re", sub:"Tome decisiones ante un cambio curricular imprevisto en su institución", max:90 },
  { id:"comm",     ph:2, icon:"💬", title:"Comunicación Efectiva",       hours:6,  prio:"Alta",       xp:90,  ac:"#eab308", tag:"tag-or", sub:"Atienda a un padre de familia molesto — evaluado por IA", max:100 },
  { id:"conflict", ph:2, icon:"🤝", title:"Resolución de Conflictos",    hours:6,  prio:"Alta",       xp:90,  ac:"#a855f7", tag:"tag-or", sub:"Medie un conflicto entre estudiantes en el taller", max:100 },
  { id:"critical", ph:2, icon:"🧠", title:"Pensamiento Crítico",         hours:6,  prio:"Alta",       xp:90,  ac:"#3b82f6", tag:"tag-or", sub:"Analice la caída del rendimiento de su grupo con datos reales", max:85 },
  { id:"emotion",  ph:2, icon:"❤️", title:"Inteligencia Emocional",      hours:6,  prio:"Media-alta", xp:70,  ac:"#ec4899", tag:"tag-bl", sub:"Gestione emociones en 5 situaciones docentes reales", max:175 },
  { id:"team",     ph:3, icon:"👥", title:"Trabajo en Equipo",           hours:4,  prio:"Media",      xp:60,  ac:"#10b981", tag:"tag-bl", sub:"Asigne roles óptimos para la Feria Vocacional del colegio", max:180 },
  { id:"leader",   ph:3, icon:"⭐", title:"Liderazgo Pedagógico",        hours:4,  prio:"Media",      xp:60,  ac:"#f59e0b", tag:"tag-bl", sub:"Redacte un mensaje evaluado por IA en 4 dimensiones", max:100 },
  { id:"creative", ph:3, icon:"✨", title:"Creatividad e Innovación",     hours:6,  prio:"Alta",       xp:90,  ac:"#8b5cf6", tag:"tag-or", sub:"Diseñe una estrategia creativa contra el 40% de ausencias", max:120 },
];

const PHASE_INFO = {
  1: { label:"Correctiva",  period:"", hours:16 },
  2: { label:"Preventiva",  period:"", hours:24 },
  3: { label:"Desarrollo",  period:"", hours:14 },
};

// ── 1. MANEJO DEL TIEMPO ─────────────────────────────────────────
const TIME_TASKS = [
  { id:1, t:"Calificar exámenes vencidos hace 2 días", q:"do",   why:"Urgente e importante: impacta directamente el progreso del estudiante." },
  { id:2, t:"Revisar grupos de WhatsApp del trabajo",  q:"elim", why:"No aporta valor docente. Consume tiempo sin retorno pedagógico." },
  { id:3, t:"Diseñar planificación del próximo trimestre", q:"plan", why:"Importante pero no urgente: requiere tiempo de calidad." },
  { id:4, t:"Atender a estudiante en crisis emocional ahora", q:"do", why:"Urgente e importante: el bienestar del estudiante es prioritario." },
  { id:5, t:"Organizar estantes del aula",              q:"elim", why:"Puede postergarse indefinidamente. Bajo impacto pedagógico." },
  { id:6, t:"Responder correos administrativos rutinarios", q:"del", why:"Urgente pero no requiere intervención directa del docente." },
  { id:7, t:"Preparar estrategia para grupo de bajo rendimiento", q:"plan", why:"Alta importancia pedagógica, puede planificarse con calma." },
  { id:8, t:"Asistir a reunión de emergencia de la dirección", q:"do", why:"Urgente e importante en el contexto institucional." },
];

const QUADS = [
  { id:"do",   label:"HACER YA",    sub:"Urgente + Importante",      col:"#ef4444", bg:"rgba(239,68,68,.11)"   },
  { id:"plan", label:"PLANIFICAR",  sub:"No urgente + Importante",   col:"#3b82f6", bg:"rgba(59,130,246,.11)"  },
  { id:"del",  label:"DELEGAR",     sub:"Urgente + No importante",   col:"#f97316", bg:"rgba(249,115,22,.11)"  },
  { id:"elim", label:"ELIMINAR",    sub:"No urgente + No importante",col:"#6b7280", bg:"rgba(107,114,128,.11)" },
];

// ── 2. ADAPTABILIDAD ─────────────────────────────────────────────
const ADAPT_STEPS = [
  {
    ctx: "El lunes recibe una comunicación oficial: el programa de su área cambió y entra en vigor este trimestre.",
    q: "¿Cuál es su primera acción?",
    opts: [
      { t:"Revisar el nuevo documento y mapear los cambios clave", s:30, ok:true, fb:"Excelente. Conocer el cambio antes de actuar es la base del pensamiento estratégico." },
      { t:"Contactar colegas para planificación conjunta de inmediato", s:20, fb:"Muy buena opción colaborativa. Idealmente, después de leer el documento primero." },
      { t:"Comunicar a los estudiantes que no sabe cómo proceder", s:0, fb:"Genera incertidumbre. El docente debe ser fuente de estabilidad ante los cambios." },
      { t:"Esperar más información antes de actuar", s:5, fb:"La espera pasiva no es adaptabilidad. El cambio ya está vigente." },
    ]
  },
  {
    ctx: "Tras revisar, nota que el 60% de sus actividades planificadas ya no aplican.",
    q: "¿Cómo prioriza su respuesta?",
    opts: [
      { t:"Identificar competencias vigentes y rediseñar solo lo necesario", s:30, ok:true, fb:"Pensamiento eficiente: aprovecha lo funcional y adapta solo lo que cambió." },
      { t:"Mantener todo lo anterior y añadir encima las nuevas actividades", s:5, fb:"Genera sobrecarga para usted y sus estudiantes. No es viable." },
      { t:"Solicitar a la dirección una prórroga", s:10, fb:"Medida temporal razonable, pero no resuelve el problema de fondo." },
      { t:"Cancelar clases mientras define el nuevo plan", s:0, fb:"Las ausencias de lección no son una estrategia adaptativa válida." },
    ]
  },
  {
    ctx: "Tras adaptar su plan, los estudiantes se muestran confundidos y resistentes al cambio.",
    q: "¿Cuál es su respuesta pedagógica?",
    opts: [
      { t:"Detener la clase, reconocer el cambio e involucrar al grupo en la transición", s:30, ok:true, fb:"Brillante. La transparencia y la participación estudiantil son pilares de la resiliencia pedagógica." },
      { t:"Continuar: eventualmente se adaptarán", s:0, fb:"Ignorar la confusión del grupo es perder una oportunidad pedagógica clave." },
      { t:"Enviar una nota a casa explicando el cambio", s:10, fb:"Útil para familias, pero no aborda la confusión directamente en el aula." },
      { t:"Pedir al coordinador que explique el cambio al grupo", s:10, fb:"Delegar en este momento resta liderazgo pedagógico en un momento clave." },
    ]
  },
];

// ── 3. COMUNICACIÓN (AI) ─────────────────────────────────────────
const COMM_SYSTEM = `Eres un padre o madre de familia de un estudiante que reprobó el trimestre. Estás molesto/a pero no agresivo/a. Te llamas Sr./Sra. Rodríguez y tu hijo/a se llama Alejandro/a. Hablas en español informal latinoamericano.

Responde en DOS partes exactas separadas por una línea en blanco:
1. Tu respuesta in-character como padre (2-3 oraciones naturales y emocionales).
2. Una línea que empiece exactamente con EVAL: seguido de JSON en una sola línea: {"empathy":N,"evidence":N,"solution":N,"tone":N,"comment":"texto corto"} donde N es 0-25.

Si el docente muestra empatía genuina, ablanda progresivamente tu postura.`;

// ── 4. RESOLUCIÓN DE CONFLICTOS ──────────────────────────────────
const CONFLICT_STEPS = [
  {
    ctx: "Dos estudiantes discuten acaloradamente en el aula. Uno acusa al otro de dañar su trabajo. El grupo observa en tensión.",
    q: "¿Cuál es su primera respuesta?",
    opts: [
      { t:"Separar a ambos con calma, redirigirlos y tranquilizar al grupo", s:30, ok:true, fb:"Excelente. Asegurar el ambiente del grupo antes de mediar individualmente es la prioridad." },
      { t:"Alzar la voz para restaurar el orden", s:10, fb:"Logra calma momentánea pero puede dañar la confianza del grupo hacia el docente." },
      { t:"Enviar a ambos a dirección de inmediato", s:5, fb:"Escalar sin mediar priva al docente de una oportunidad de liderazgo pedagógico." },
      { t:"Continuar la clase e ignorar el incidente", s:0, fb:"Ignorar un conflicto activo permite que escale y afecta toda la dinámica grupal." },
    ]
  },
  {
    ctx: "Ha separado al grupo. Un estudiante dice que el otro arruinó su proyecto. El otro dice que lo estuvieron insultando.",
    q: "¿Cómo recopila la información del conflicto?",
    opts: [
      { t:"Escuchar a cada uno por separado antes de emitir cualquier juicio", s:35, ok:true, fb:"Fundamental. La escucha neutral garantiza que ambas versiones sean oídas con equidad." },
      { t:"Decidir que uno tiene razón porque el daño es visible", s:0, fb:"El daño visible no determina culpabilidad. Necesita escuchar ambas versiones." },
      { t:"Pedirles que se sienten juntos a explicar qué pasó", s:15, fb:"Razonable pero prematuro. Primero escuche por separado para reducir la tensión." },
      { t:"Documentar y llamar a padres sin escucharlos", s:10, fb:"La documentación es necesaria pero debe ocurrir DESPUÉS de escuchar." },
    ]
  },
  {
    ctx: "Tras escuchar a ambos, descubre que uno hizo comentarios hirientes y el otro reaccionó accidentalmente dañando el trabajo.",
    q: "¿Cómo facilita la resolución?",
    opts: [
      { t:"Reunirlos: quien insultó se disculpa, quien dañó el trabajo ofrece repararlo juntos", s:35, ok:true, fb:"Brillante. La corresponsabilidad y la reparación son los pilares de una resolución genuina." },
      { t:"Sancionar a ambos por igual", s:10, fb:"Las sanciones iguales no reconocen la diferencia en las faltas cometidas." },
      { t:"Referir a la orientadora sin resolver nada en el aula", s:15, fb:"La orientadora puede apoyar, pero usted tiene herramientas para dar un primer cierre." },
      { t:"Decirles que lo resuelvan entre sí", s:0, fb:"Sin mediación docente, el conflicto puede agravarse fuera del aula." },
    ]
  },
];

// ── 5. PENSAMIENTO CRÍTICO ───────────────────────────────────────
const EVIDENCE = [
  "📉 Promedio bajó de 78% a 58% en un trimestre",
  "📊 Asistencia bajó 15% en las últimas 4 semanas",
  "💼 70% de los estudiantes trabaja medio tiempo o más",
  "📝 Nueva metodología implementada a mitad del trimestre",
  "👥 3 de los 5 líderes del grupo se trasladaron a otra sección",
  "✏️ Dificultad notable en tareas escritas observada en clase",
];
const CAUSES = [
  { id:"a", t:"Los estudiantes no tienen capacidad para el nivel del curso", ok:false },
  { id:"b", t:"Fatiga y desmotivación por carga laboral externa (trabajan)", ok:true },
  { id:"c", t:"Cambio metodológico sin preparación previa del estudiantado", ok:true },
  { id:"d", t:"Pérdida de referentes positivos (líderes grupales trasladados)", ok:true },
  { id:"e", t:"El docente explica mal la materia", ok:false },
  { id:"f", t:"Falta de interés en la especialidad elegida", ok:false },
  { id:"g", t:"Problemas de comunicación con las familias", ok:false },
  { id:"h", t:"Infraestructura inadecuada del aula", ok:false },
];
const SOLUTIONS = [
  { t:"Reducir la exigencia de evaluaciones para subir las notas", s:5, fb:"Aborda el síntoma sin resolver las causas reales identificadas." },
  { t:"Plan integrado: tutorías + reinducción metodológica + reorganización grupal", s:40, ok:true, fb:"Excelente. Aborda simultáneamente las tres causas raíz: carga, metodología y dinámica grupal." },
  { t:"Hablar solo con los padres de los estudiantes de menor rendimiento", s:15, fb:"Útil pero parcial: no aborda la desmotivación ni el cambio metodológico." },
  { t:"Solicitar que regresen los estudiantes trasladados", s:10, fb:"Puede no ser posible institucionalmente y no resuelve las causas internas." },
];

// ── 6. INTELIGENCIA EMOCIONAL ────────────────────────────────────
const EMOTS = [
  {
    ctx: "Un estudiante dice en clase, frente a todos: 'Esta materia es una pérdida de tiempo.'",
    eq: "¿Cuál es la emoción más probable que sentiría usted?",
    eOpts: ["Frustración y algo de dolor profesional","Indiferencia total","Alegría","Orgullo"], ce:0,
    rq: "¿Cómo respondería?",
    rOpts: [
      { t:"Ignorar el comentario y continuar la clase", s:5, fb:"El estudiante siente que no es escuchado. La evasión no construye vínculo pedagógico." },
      { t:"Preguntar con curiosidad: '¿Qué te llevaría a pensar eso?'", s:30, ok:true, fb:"Convierte una provocación en una conversación pedagógica valiosa." },
      { t:"Explicar por qué la materia sí es útil", s:15, fb:"Válido pero defensivo. Primero escuche, luego explique." },
      { t:"Llamarle la atención frente al grupo", s:0, fb:"La confrontación pública daña la relación y no aborda la causa real." },
    ]
  },
  {
    ctx: "En reunión de departamento, presenta una idea y un colega la descarta: 'eso nunca funciona aquí'.",
    eq: "¿Cuál es la emoción más probable?",
    eOpts: ["Frustración y sensación de no ser valorado/a","Entusiasmo renovado","Alivio","Gratitud"], ce:0,
    rq: "¿Cómo gestiona esa emoción?",
    rOpts: [
      { t:"Silenciar la frustración y no volver a proponer ideas", s:0, fb:"La autosilencia daña su agencia profesional y empobrece al equipo." },
      { t:"Responder: '¿Cómo sabe que no funcionará?'", s:10, fb:"Tiene razón en el fondo, pero el tono defensivo puede generar conflicto." },
      { t:"Tomar nota y retomarlo en privado con ese colega", s:30, ok:true, fb:"Excelente autorregulación. La conversación privada tiene más posibilidad de avanzar." },
      { t:"Pedir al grupo que vote si quieren escuchar la idea completa", s:20, fb:"Buena estrategia colaborativa, aunque puede incomodar al colega." },
    ]
  },
  {
    ctx: "Descubre que cometió un error en calificaciones que afecta a 10 estudiantes y algunos padres ya lo saben.",
    eq: "¿Cuál es la primera emoción probable?",
    eOpts: ["Vergüenza y ansiedad","Indiferencia","Satisfacción","Solo confusión"], ce:0,
    rq: "¿Cuál es su acción prioritaria?",
    rOpts: [
      { t:"Esperar a que alguien lo reporte antes de actuar", s:0, fb:"La demora agrava la situación. La proactividad es señal de integridad docente." },
      { t:"Informar inmediatamente a estudiantes y dirección, y corregir el error", s:30, ok:true, fb:"La transparencia inmediata mantiene la confianza, incluso al cometer errores." },
      { t:"Corregir el error silenciosamente sin mencionarlo", s:10, fb:"Si se descubre después, el silencio daña mucho más la confianza." },
      { t:"Culpar al sistema de calificaciones del colegio", s:0, fb:"Evadir la responsabilidad es contrario a la ética docente." },
    ]
  },
  {
    ctx: "Es viernes por la tarde. Está agotado/a. Un estudiante le pide que le explique un tema porque tiene examen el lunes.",
    eq: "¿Cuál es la emoción presente?",
    eOpts: ["Cansancio mezclado con sentido de responsabilidad","Indiferencia total","Felicidad plena","Solo irritación"], ce:0,
    rq: "¿Qué hace?",
    rOpts: [
      { t:"Atenderlo ahora mismo aunque llegue tarde a casa", s:15, fb:"Muestra compromiso, pero sacrificar sistemáticamente el descanso no es sostenible." },
      { t:"Decir que no puede y sugerir que estudie solo", s:5, fb:"El cierre abrupto puede desmotivar al estudiante en un momento de esfuerzo." },
      { t:"Reconocer su cansancio y acordar un horario concreto para el lunes", s:30, ok:true, fb:"Equilibrio perfecto: se cuida y apoya al estudiante con una alternativa concreta." },
      { t:"Mandar recursos digitales sin más explicación", s:20, fb:"Útil como complemento, pero el estudiante pidió explicación directa." },
    ]
  },
  {
    ctx: "En su grupo más difícil, tras semanas de esfuerzo, un estudiante dice: 'Profe, usted es el mejor docente que he tenido.'",
    eq: "¿Qué emoción positiva aparece?",
    eOpts: ["Orgullo sano y satisfacción profesional","Indiferencia","Miedo","Vergüenza"], ce:0,
    rq: "¿Cómo responde?",
    rOpts: [
      { t:"Minimizarlo: 'No es para tanto, solo hice mi trabajo'", s:10, fb:"La falsa modestia no permite un momento de reconocimiento genuino y recíproco." },
      { t:"Agradecer genuinamente y devolver el mérito al esfuerzo del grupo", s:30, ok:true, fb:"Perfecto. Acepta el reconocimiento con dignidad y redirige el mérito al colectivo." },
      { t:"No responder para no crear favoritismos", s:5, fb:"El silencio puede interpretarse como indiferencia ante un gesto de aprecio." },
      { t:"Compartirlo con orgullo ante otros docentes", s:5, fb:"El reconocimiento personal no debe convertirse en competencia entre colegas." },
    ]
  },
];

// ── 7. TRABAJO EN EQUIPO ─────────────────────────────────────────
const TEAM_M = [
  { id:"ana",     name:"Ana",     icon:"👩‍💼", p:"Organizada, detallista, introvertida. Excelente en logística y cronogramas." },
  { id:"roberto", name:"Roberto", icon:"🧑‍🎨", p:"Creativo, energético, impuntual. Brillante para diseño visual." },
  { id:"carmen",  name:"Carmen",  icon:"👩‍🏫", p:"Experimentada, diplomática. Excelente para relaciones externas y presentaciones formales." },
  { id:"jose",    name:"José",    icon:"🧑‍💻", p:"Experto en tecnología, autónomo, introvertido. No le gusta hablar en público." },
  { id:"lucia",   name:"Lucía",   icon:"👩‍🏫", p:"Líder natural, buena comunicadora, actualmente sobrecargada de responsabilidades." },
];
const TEAM_T = [
  { id:"t1", task:"Coordinar con empresas invitadas",          ideal:"carmen", scores:{ ana:10, roberto:5,  carmen:30, jose:5,  lucia:20 }, why:"Su perfil diplomático y experiencia en relaciones externas la hacen ideal." },
  { id:"t2", task:"Diseñar material visual y stands",           ideal:"roberto",scores:{ ana:10, roberto:30, carmen:5,  jose:20, lucia:10 }, why:"Su creatividad es perfecta, con supervisión de plazos." },
  { id:"t3", task:"Elaborar cronograma y plan logístico",       ideal:"ana",    scores:{ ana:30, roberto:5,  carmen:15, jose:15, lucia:15 }, why:"Su perfil detallista es ideal para la logística rigurosa." },
  { id:"t4", task:"Gestionar redes sociales y comunicación digital", ideal:"jose", scores:{ ana:10, roberto:20, carmen:5, jose:30, lucia:10 }, why:"Dominio tecnológico sin necesidad de hablar en público." },
  { id:"t5", task:"Presentar el proyecto a la dirección",       ideal:"carmen", scores:{ ana:5,  roberto:10, carmen:30, jose:0,  lucia:25 }, why:"Su experiencia y comunicación formal son la mejor opción." },
  { id:"t6", task:"Coordinar al equipo y cumplimiento de plazos",ideal:"lucia", scores:{ ana:25, roberto:0,  carmen:20, jose:5,  lucia:30 }, why:"Su liderazgo natural es ideal. Ana también es una buena opción." },
];

// ── 8. LIDERAZGO (AI) ────────────────────────────────────────────
const LEADER_SYSTEM = `Eres un evaluador experto en liderazgo transformacional para instituciones educativas. Evalúa el mensaje que el docente escribió para motivar a su equipo dividido.

Evalúa en 4 dimensiones (0-25 cada una):
- vision: ¿menciona objetivos o metas colectivas que unen al equipo?
- recognition: ¿valida el esfuerzo y desafíos del equipo?
- action: ¿propone pasos concretos y alcanzables?
- empathy: ¿usa lenguaje cálido, no autoritario?

Responde ÚNICAMENTE con JSON válido en una sola línea sin markdown ni texto adicional:
{"vision":N,"recognition":N,"action":N,"empathy":N,"feedback":"2-3 oraciones de retroalimentación específica","strength":"fortaleza principal","improve":"área de mejora principal"}`;

// ── 9. CREATIVIDAD ───────────────────────────────────────────────
const CREATIVE = [
  {
    key:"hook", label:"🎣 Gancho de motivación",
    desc:"¿Cómo captura la atención de los estudiantes ausentes?",
    opts:[
      { id:"h1", t:"Contacto personalizado: llamada o mensaje directo a cada estudiante ausente", v:30, bold:true },
      { id:"h2", t:"Nota de alerta estándar enviada a padres de familia", v:10 },
      { id:"h3", t:"Reto viral: invitar a los estudiantes a traer a un compañero a la siguiente clase", v:25, bold:true },
    ]
  },
  {
    key:"method", label:"🎯 Metodología rediseñada",
    desc:"¿Cómo transforma la experiencia de aprendizaje en el aula?",
    opts:[
      { id:"m1", t:"Proyecto real: conectar el contenido técnico con un problema de la comunidad local", v:35, bold:true },
      { id:"m2", t:"Continuar con el programa estándar pero con más paciencia", v:5 },
      { id:"m3", t:"Gamificación: sistema de puntos, misiones y recompensas en clase", v:30, bold:true },
      { id:"m4", t:"Trabajo en grupos mixtos con roles rotativos", v:20, bold:true },
    ]
  },
  {
    key:"tech", label:"💻 Herramienta tecnológica",
    desc:"¿Qué tecnología apoya el rediseño?",
    opts:[
      { id:"t1", t:"IA generativa para que los estudiantes co-creen materiales de estudio", v:35, bold:true },
      { id:"t2", t:"Videos de YouTube como complemento de las lecciones", v:10 },
      { id:"t3", t:"Plataforma de microaprendizaje con cápsulas de 5 minutos", v:25, bold:true },
    ]
  },
  {
    key:"followup", label:"📊 Mecanismo de seguimiento",
    desc:"¿Cómo verifica que la estrategia está funcionando?",
    opts:[
      { id:"f1", t:"Registro de asistencia semanal + reunión mensual de revisión con el grupo", v:25, bold:true },
      { id:"f2", t:"Esperar las calificaciones del siguiente trimestre", v:5 },
      { id:"f3", t:"Encuesta anónima quincenal de 2 preguntas sobre motivación y comprensión", v:30, bold:true },
    ]
  },
];