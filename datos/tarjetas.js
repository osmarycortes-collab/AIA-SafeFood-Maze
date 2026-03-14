/* =========================================
   TARJETAS DEL JUEGO
   AIA SafeFood Maze
   Textos aprobados
========================================= */

const TARJETAS = {

    bienvenida: {
        titulo: "Bienvenido",

        mensaje: `Mary Cortés te da la bienvenida a su juego educativo
AIA – Aprende Inocuidad Alimentaria.

Este proyecto nace con el propósito de demostrar cómo
la tecnología puede convertirse en una herramienta
poderosa para fortalecer el aprendizaje, la cultura
de inocuidad y la mejora continua dentro de la
industria de alimentos.

La transformación digital está cambiando la forma
en que aprendemos, trabajamos y optimizamos los procesos.
Aplicar herramientas tecnológicas en la formación
del personal y en la gestión de los sistemas de
inocuidad alimentaria no es solo una oportunidad,
sino parte del futuro de la industria.

Si existe una forma de aprender mejor,
optimizar un proceso o fortalecer la cultura
de inocuidad en una organización,
vale la pena desarrollarla.

Este juego busca precisamente eso:
aprender de forma dinámica,
poner a prueba el conocimiento
y reforzar los fundamentos de la
inocuidad alimentaria.`,

        boton: "Continuar"
    },


    instrucciones: {

        mensaje: `Tu misión será recorrer diferentes plantas
de alimentos, responder preguntas de
inocuidad y evitar que los microorganismos
te atrapen.

Cada puerta contiene una pregunta,
debes responder todas las preguntas
para pasar al siguiente nivel.

Puedes utilizar un comodín para intentar
obtener una pista, pero el resultado
es aleatorio y puede jugar a tu favor
o en tu contra.

¿Estás listo para comenzar?`,

        boton: "Comenzar"
    },

    atrapado: {

        mensaje: `Recuerda:
En la industria alimentaria,
los microorganismos pueden
propagarse rápidamente si no se
aplican correctamente las medidas
de control.

Intenta nuevamente.`,

        boton: "Continuar"
    },


    puertasPendientes: {

        mensaje: `Debes responder todas las preguntas antes de salir del laberinto.`
    },


    respuestaCorrecta: {

        mensaje: `Respuesta correcta`
    },


    respuestaIncorrecta: {

        mensaje: `Respuesta incorrecta
Pierdes 5 segundos.`
    },


    comodin: {

        tituloPista: "Pista",

        sinPista: `No se obtuvo pista.`,

        pierdeTiempo: `Pierdes 5 segundos.`
    },


    nivelCompletado: {

        mensaje: `¡Felicidades!
Has completado el desafío de AIA SafeFood Maze.

En este nivel aprendiste sobre las
Buenas Prácticas de Manufactura (BPM).

Las BPM son la base de cualquier sistema
de inocuidad alimentaria. Gracias a ellas
se controlan riesgos de contaminación
y se garantiza que los alimentos sean
seguros para el consumo.

Recuerda:
La inocuidad alimentaria no es solo una
norma o un requisito. Es una cultura que
protege la salud de millones de personas.

Sigue avanzando y continúa aprendiendo.`,

        boton: "Generar certificado"
    }


}
