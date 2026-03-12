/* =========================================
   CONFIGURACIÓN GENERAL DEL JUEGO
   AIA SafeFood Maze
   ========================================= */

const CONFIG = {

    /* ---------- GRID DEL LABERINTO ---------- */

    columnas: 25,
    filas: 18,
    tamCelda: 32,

    /* Resolución del canvas */
    anchoCanvas: 800,
    altoCanvas: 576,

    /* ---------- JUGADOR ---------- */

    vidasIniciales: 5,
    velocidadJugador: 2,

    /* ---------- TIEMPO ---------- */

    penalizacionError: 5, // segundos que pierde al responder mal
    penalizacionComodin: 5,

    tiempoNiveles: [

60, // nivel 1
60, // nivel 2
60, // nivel 3

120, // nivel 4
120, // nivel 5
120, // nivel 6

150, // nivel 7
150, // nivel 8
150, // nivel 9
150  // nivel 10

],

    /* ---------- COMODÍN ---------- */

    comodin: {
        pista: 0.5,       // 50%
        sinPista: 0.3,    // 30%
        pierdeTiempo: 0.2 // 20%
    },

    /* ---------- MOVIMIENTO ---------- */

   /* -------- MOVIMIENTO -------- */

velocidadEnemigos: [

600, // nivel 1
600, // nivel 2
550, // nivel 3
550, // nivel 4
500, // nivel 5
450, // nivel 6
420, // nivel 7
380, // nivel 8
340, // nivel 9
300  // nivel 10

],

    /* ---------- SONIDOS ---------- */

    sonidos: {

        correcto: "sonidos/efectos/correcto.mp3",
        error: "sonidos/efectos/error.mp3",
        puerta: "sonidos/efectos/puerta.mp3",
        victoria: "sonidos/efectos/victoria.mp3",
        gameover: "sonidos/efectos/gameover.mp3",
        persecucion: "sonidos/efectos/persecucion.mp3",
        nivel:"sonidos/efectos/nivel.mp3"

    },

    /* ---------- MÚSICA POR NIVEL ---------- */

    musicaNiveles: [

        "sonidos/niveles/sonido01_granos.mp3",
        "sonidos/niveles/sonido02_molino.mp3",
        "sonidos/niveles/sonido03_panaderia.mp3",
        "sonidos/niveles/sonido04_confiteria.mp3",
        "sonidos/niveles/sonido05_vegetales.mp3",
        "sonidos/niveles/sonido06_jugos.mp3",
        "sonidos/niveles/sonido07_lactea.mp3",
        "sonidos/niveles/sonido08_carnica.mp3",
        "sonidos/niveles/sonido09_avicola.mp3",
        "sonidos/niveles/sonido10_listos.mp3"

    ],

    /* ---------- FONDOS DE LAS PLANTAS ---------- */

    fondosPlantas: [

        "imagenes/plantas/planta01_granos.png",
        "imagenes/plantas/planta02_molino.png",
        "imagenes/plantas/planta03_panaderia.png",
        "imagenes/plantas/planta04_confiteria.png",
        "imagenes/plantas/planta05_vegetales.png",
        "imagenes/plantas/planta06_jugos.png",
        "imagenes/plantas/planta07_lactea.png",
        "imagenes/plantas/planta08_carnica.png",
        "imagenes/plantas/planta09_avicola.png",
        "imagenes/plantas/planta10_listos.png"

    ],

    /* ---------- SPRITES ---------- */

    jugadorSprite: "imagenes/jugador/jugador_inspector.png",

    microorganismos: [

        "imagenes/microorganismos/micro01_aspergillus.png",
        "imagenes/microorganismos/micro02_fusarium.png",
        "imagenes/microorganismos/micro03_bacillus.png",
        "imagenes/microorganismos/micro04_staphylococcus.png",
        "imagenes/microorganismos/micro05_ecoli.png",
        "imagenes/microorganismos/micro06_salmonella.png",
        "imagenes/microorganismos/micro07_listeria.png",
        "imagenes/microorganismos/micro08_clostridium.png",
        "imagenes/microorganismos/micro09_salmonella.png",
        "imagenes/microorganismos/micro10_listeria.png"

    ]

    }; 
