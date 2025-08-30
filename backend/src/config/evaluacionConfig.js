// backend/config/preguntasConfig.js

const PREGUNTAS = [
    // ÁREA 1: Actividades Básicas
    {
        id: 1,
        area: "Actividades Básicas",
        pregunta: "¿Su niño(a) come solo(a) con cuchara, tenedor o con sus manos?",
        opciones: [
            "Sí, come solo(a) sin problemas",
            "Come solo(a), pero con ayuda a veces",
            "No come solo(a), necesita que lo alimenten"
        ],
        contextos: [
            "No ha tenido tiempo o no lo han dejado practicar solo/a.",
            "Tiene miedo a ensuciarse o derramar comida.",
            "Le cuesta sostener la cuchara o el tenedor.",
            "Siempre come viendo televisión o el celular.",
            "Falta comida o cubiertos apropiados."
        ]
    },

    {
        id: 2,
        area: "Actividades Básicas",
        pregunta: "¿Se lava los dientes, las manos o se peina (aunque necesite ayuda)?",
        opciones: [
            "Sí, lo hace solo/a o cuando se lo recuerdan",
            "A veces lo hace, pero necesita ayuda",
            "No lo hace o no quiere hacerlo"
        ],
        contextos: [
            "No tiene horarios fijos para lavarse o peinarse.",
            "No le gusta el agua, el cepillo o el jabón.",
            "Se asusta o se enoja cuando lo(a) lavan o peinan.",
            "No hay suficiente agua, jabón o cepillos.",
            "Hay muchas personas a cargo o poco tiempo para ayudarlo(a)."
        ]
    },

    {
        id: 3,
        area: "Actividades Básicas",
        pregunta: "¿Avisa o ya no usa pañal durante el día?",
        opciones: [
            "Sí, avisa o va al baño solo(a)",
            "A veces avisa o necesita ayuda",
            "No controla aún / no avisa"
        ],
        contextos: [
            "No ha empezado el proceso de dejar el pañal.",
            "El baño no es cómodo, privado o accesible.",
            "Tiene miedo a caerse o sentarse solo/a.",
            "No hay rutina ni tiempo para enseñarle.",
            "En casa no hay agua suficiente o hay muchas distracciones."
        ]
    },

    {
        id: 4,
        area: "Actividades Básicas",
        pregunta: "¿Se viste o se quita la ropa solo/a?",
        opciones: [
            "Lo hace solo/a sin ayuda",
            "Lo hace con algo de ayuda",
            "No lo hace, necesita mucha ayuda"
        ],
        contextos: [
            "No se le permite intentarlo o se hace todo por el niño(a).",
            "La ropa es difícil de poner o sacar.",
            "Falta de fuerza o le cuesta mover bien las manos y los brazos.",
            "Le cuesta concentrarse o seguir pasos para vestirse."
        ]
    },

    // ÁREA 2: Juego y Participación Social
    {
        id: 5,
        area: "Juego y Participación Social",
        pregunta: "¿Le gusta jugar o descubrir cosas nuevas?",
        opciones: [
            "Sí, juega solo/a y con otras personas",
            "Juega un rato, pero se distrae rápido",
            "No se interesa mucho por jugar"
        ],
        contextos: [
            "No tiene hermanos con quien jugar.",
            "No hay juguetes o espacio suficiente para jugar.",
            "Ve mucha televisión o celular.",
            "En casa no hay mucho tiempo para jugar juntos.",
            "Está cansado(a), triste o distraído(a)."
        ]
    },

    {
        id: 6,
        area: "Juego y Participación Social",
        pregunta: "¿Copia acciones como aplaudir, cocinar o hablar por teléfono?",
        opciones: [
            "Sí, copia fácilmente lo que ve",
            "A veces lo hace, si se le anima",
            "No lo hace o no parece entender cómo hacerlo"
        ],
        contextos: [
            "No ve a nadie jugar o imitar para copiar.",
            "Pasa mucho tiempo solo(a) o frente a una pantalla.",
            "Le cuesta ver o copiar lo que hacen otros niños.",
            "No hay suficiente tiempo para jugar en casa."
        ]
    },

    {
        id: 7,
        area: "Juego y Participación Social",
        pregunta: "¿Se relaciona con otros niños o responde cuando le hablan?",
        opciones: [
            "Sí, se lleva bien con otros",
            "A veces le cuesta un poco",
            "No suele relacionarse o no responde a otros"
        ],
        contextos: [
            "No hay otros niños cerca.",
            "Siempre está solo(a), no juega con otros.",
            "Aún está aprendiendo a hablar.",
            "En casa hay problemas que lo hacen sentir nervioso(a) o inseguro(a)."
        ]
    },

    {
        id: 8,
        area: "Juego y Participación Social",
        pregunta: "¿Le gusta participar en juegos con canciones o cuentos?",
        opciones: [
            "Sí, le gusta mucho y participa con entusiasmo",
            "A veces participa, si se lo anima",
            "Se aparta o no le gusta participar"
        ],
        contextos: [
            "Se pone tímido(a) o tiene miedo.",
            "No se siente cómodo(a) con ruidos o en grupo.",
            "Prefiere jugar solo o ver televisión/celular.",
            "No hay tiempo o espacio para este tipo de juegos."
        ]
    },

    // ÁREA 3: Habilidades del desempeño
    {
        id: 9,
        area: "Habilidades del desempeño",
        pregunta: "¿Corre, se sube a cosas o salta sin problema?",
        opciones: [
            "Sí, se mueve bien y sin problemas",
            "A veces se cansa o le cuesta moverse",
            "Le cuesta mucho moverse o no lo hace"
        ],
        contextos: [
            "No tiene espacio seguro para jugar y moverse.",
            "Está mucho tiempo sentado(a) o viendo televisión/celular.",
            "Puede tener algún problema físico que requiere ayuda.",
            "No hay muchos juguetes o espacio para moverse."
        ]
    },

    {
        id: 10,
        area: "Habilidades del desempeño",
        pregunta: "¿Puede tomar objetos pequeños usando sus dedos?",
        opciones: [
            "Sí, toma objetos pequeños con sus dedos fácilmente",
            "Lo intenta, pero a veces se le caen o le cuesta",
            "No puede tomar objetos pequeños con sus dedos"
        ],
        contextos: [
            "No ha tenido cosas para agarrar o manipular.",
            "Sus manos son débiles o le cuesta mover bien las manos.",
            "No se le ha animado a usar las manos para manipular cosas.",
            "No hay muchas cosas para que explore."
        ]
    },

    {
        id: 11,
        area: "Habilidades del desempeño",
        pregunta: "¿Entiende y responde a órdenes sencillas?",
        opciones: [
            "Sí, entiende y hace lo que le piden",
            "A veces entiende, necesita que le repitan",
            "No entiende o no hace caso a lo que se le dice"
        ],
        contextos: [
            "No se le habla ni enseña mucho en casa.",
            "Puede no oír bien.",
            "En casa hay mucho ruido o distracciones.",
            "No le han enseñado órdenes fáciles."
        ]
    },

    {
        id: 12,
        area: "Habilidades del desempeño",
        pregunta: "¿Se comunica con palabras, señas o sonidos?",
        opciones: [
            "Sí, se comunica bien",
            "Se comunica, pero a veces no se le entiende",
            "No se comunica o es muy difícil entenderlo"
        ],
        contextos: [
            "No le hablan suficiente o no lo entienden.",
            "Ve mucho televisión o celular sin que jueguen con el niño(a).",
            "Puede tener problemas para oír o hablar.",
            "El ambiente en casa es muy ruidoso o estresante."
        ]
    },

    {
        id: 13,
        area: "Habilidades del desempeño",
        pregunta: "¿Se asusta con ruidos, luces o ciertas telas/comidas?",
        opciones: [
            "No, reacciona bien a estas cosas",
            "A veces se siente incómodo(a)",
            "Se altera mucho o llora con facilidad"
        ],
        contextos: [
            "El ambiente es ruidoso o muy movido.",
            "No le gustan algunos ruidos, luces o texturas al tocar.",
            "Se siente incómodo(a) con facilidad.",
            "Se pone inquieto(a) o nervioso(a) en algunas situaciones."
        ]
    },

    {
        id: 14,
        area: "Habilidades del desempeño",
        pregunta: "¿Hace berrinches o le cuesta calmarse?",
        opciones: [
            "No, casi nunca",
            "A veces se enoja, pero se calma pronto",
            "Se enoja mucho o le cuesta calmarse"
        ],
        contextos: [
            "No sabe cómo mostrar lo que siente.",
            "Los horarios o actividades cambian mucho.",
            "En casa hay problemas o preocupaciones.",
            "No siempre recibe ayuda o atención."
        ]
    },

    {
        id: 15,
        area: "Habilidades del desempeño",
        pregunta: "¿Tiene horarios fijos para comer, jugar y dormir?",
        opciones: [
            "Sí, tiene horarios claros",
            "A veces, pero no siempre se respetan",
            "No tiene horarios fijos o cambian mucho"
        ],
        contextos: [
            "No hay horarios claros en casa.",
            "Las actividades familiares o trabajo cambian mucho.",
            "Está al cuidado de varias personas y cada horario es diferente.",
            "No hay tiempo para organizar su día."
        ]
    },

    {
        id: 16,
        area: "Habilidades del desempeño",
        pregunta: "¿Duerme bien por las noches?",
        opciones: [
            "Sí, duerme bien y de corrido",
            "A veces se despierta o le cuesta dormirse",
            "Duerme poco, se despierta mucho o no descansa"
        ],
        contextos: [
            "Hay mucho ruido o personas compartiendo habitación.",
            "Ve televisión o el celular antes de dormir.",
            "No tiene cama cómoda o lugar seguro para dormir.",
            "Tiene enfermedades o molestias que dificultan dormir."
        ]
    },

    {
        id: 17,
        area: "Habilidades del desempeño",
        pregunta: "¿Pasan tiempo para jugar, hablar o enseñarle?",
        opciones: [
            "Sí, pasamos tiempo juntos con atención y cariño",
            "A veces lo hacemos, pero no tanto como quisiéramos",
            "Casi no tenemos tiempo o no hay quién le dedique ese espacio"
        ],
        contextos: [
            "Usted o los cuidadores trabajan mucho y están ocupados.",
            "Hay problemas de dinero o preocupaciones.",
            "Lo cuidan varias personas o no hay tiempo suficiente.",
            "No hay ayuda de familia o vecinos.",
            "No saben cómo enseñarle o jugar con su niño(a)."
        ]
    },

    {
        id: 18,
        area: "Habilidades del desempeño",
        pregunta: "¿Qué tal se adapta a visitas, salidas o cambios en el día?",
        opciones: [
            "Se adapta bien y no se altera",
            "A veces se pone nervioso(a), pero logra adaptarse",
            "Se altera mucho, llora o le cuesta mucho calmarse"
        ],
        contextos: [
            "Le hace falta sentirse seguro(a) cuando pasa algo nuevo.",
            "Los horarios, lugares o personas cambian mucho.",
            "No le explican antes lo que va a pasar.",
            "En casa hay estrés, problemas o discusiones."
        ]
    }
];

module.exports = PREGUNTAS;