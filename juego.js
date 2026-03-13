const canvas = document.getElementById("juego")
const ctx = canvas.getContext("2d")

canvas.width = CONFIG.anchoCanvas
canvas.height = CONFIG.altoCanvas

let nivelActual = 0
let mapa = MAPAS[nivelActual]

let preguntaActual = 0
let tiempo = CONFIG.tiempoNiveles[nivelActual]
let vidas = CONFIG.vidasIniciales

let juegoIniciado = false
let juegoPausado = false
let preguntaAbierta = false

let jugador = {x:0,y:0}
let enemigos = []

/* SPRITES */

const spriteJugador = new Image()
spriteJugador.src = CONFIG.jugadorSprite

const spriteEnemigo = new Image()
spriteEnemigo.src = CONFIG.microorganismos[nivelActual]

const fondo = new Image()
fondo.src = CONFIG.fondosPlantas[nivelActual]

/* SONIDOS */

const sonidoCorrecto = new Audio(CONFIG.sonidos.correcto)
const sonidoError = new Audio(CONFIG.sonidos.error)
const sonidoPuerta = new Audio(CONFIG.sonidos.puerta)

const musicaNivel = new Audio(CONFIG.musicaNiveles[nivelActual])
musicaNivel.loop = true

/* HUD */

const tiempoHUD = document.getElementById("tiempo")
const vidasHUD = document.getElementById("vidas")

function actualizarHUD(){

tiempoHUD.innerText = "Tiempo: " + tiempo + " s"

let corazones=""
for(let i=0;i<vidas;i++) corazones+="❤️"

vidasHUD.innerText = corazones

}

/* PANEL */

const panel=document.getElementById("panel")
const panelTitulo=document.getElementById("panelTitulo")
const panelTexto=document.getElementById("panelTexto")
const panelBotones=document.getElementById("panelBotones")

function mostrarTarjeta(titulo,texto,boton,accion){

document.getElementById("joystick").style.display="none"

panelTitulo.innerText=titulo
panelTexto.innerText=texto

panelBotones.innerHTML=""

let btn=document.createElement("button")
btn.innerText=boton
btn.onclick=accion

panelBotones.appendChild(btn)

panel.classList.remove("oculto")

}

/* TARJETAS INICIO */

function iniciarTarjetas(){

mostrarTarjeta(
TARJETAS.bienvenida.titulo,
TARJETAS.bienvenida.mensaje,
TARJETAS.bienvenida.boton,
mostrarInstrucciones
)

}

function mostrarInstrucciones(){

mostrarTarjeta(
"",
TARJETAS.instrucciones.mensaje,
TARJETAS.instrucciones.boton,
mostrarNivel
)

}

function mostrarNivel(){

mostrarTarjeta(
TARJETAS.nivel.titulo,
TARJETAS.nivel.mensaje,
TARJETAS.nivel.boton,
iniciarJuego
)

}

/* INICIAR JUEGO */

function iniciarJuego(){

panel.classList.add("oculto")

document.getElementById("joystick").style.display="block"

juegoIniciado=true
juegoPausado=false

musicaNivel.play()

buscarEntrada()
crearEnemigos()

}

/* CONTROLES */

document.addEventListener("keydown",(e)=>{

if(!juegoIniciado || juegoPausado) return

if(e.key==="ArrowUp") moverJugador(0,-1)
if(e.key==="ArrowDown") moverJugador(0,1)
if(e.key==="ArrowLeft") moverJugador(-1,0)
if(e.key==="ArrowRight") moverJugador(1,0)

})

/* TIMER */

let timer=setInterval(()=>{

if(!juegoIniciado || juegoPausado) return

tiempo--

actualizarHUD()

if(tiempo<=0){

alert("Se acabó el tiempo")

juegoPausado=true

mostrarTarjeta(
"Tiempo agotado",
"Intenta nuevamente este nivel",
"Reintentar",
reiniciarNivel
)

}

},1000)

/* BUSCAR ENTRADA */

function buscarEntrada(){

for(let f=0;f<mapa.length;f++){
for(let c=0;c<mapa[f].length;c++){

if(mapa[f][c]==="E"){
jugador.x=c*CONFIG.tamCelda
jugador.y=f*CONFIG.tamCelda
}

}
}

}

/* CREAR ENEMIGOS */

function crearEnemigos(){

enemigos=[]

let cantidad=[1,1,2,2,3,3,4,4,5,6][nivelActual]

for(let i=0;i<cantidad;i++){

enemigos.push({
x:canvas.width-CONFIG.tamCelda*2,
y:canvas.height-CONFIG.tamCelda*2,
dirX:1,
dirY:0
})

}

}

/* COMODÍN */

function usarComodin(p){

let r=Math.random()

if(r < CONFIG.comodin.pista){

alert("Pista: "+p.pista)

}else if(r < CONFIG.comodin.pista + CONFIG.comodin.sinPista){

alert("No se obtuvo pista")

}else{

alert("Pierdes 5 segundos")
tiempo -= CONFIG.penalizacionComodin

}

}

/* PREGUNTA */

function abrirPregunta(nivel,pregunta){

let p=PREGUNTAS[nivel+1][pregunta-1]

let opciones = [...p.opciones]

opciones.sort(()=>Math.random()-0.5)

let texto=p.pregunta+"\n\n"

for(let i=0;i<p.opciones.length;i++)
texto+=i+": "+p.opciones[i]+"\n"

texto+="\nEscribe 'p' para usar comodín"

let r=prompt(texto)

if(r==="p"){
usarComodin(p)
return false
}

if(r==p.correcta){

sonidoCorrecto.play()
return true

}else{

sonidoError.play()
tiempo-=CONFIG.penalizacionError
return false

}

}

/* MOVER JUGADOR */

function moverJugador(dx,dy){

let f = Math.floor(jugador.y / CONFIG.tamCelda)
let c = Math.floor(jugador.x / CONFIG.tamCelda)

let nf=f+dy
let nc=c+dx

if(mapa[nf][nc]===1){
return
}

if(mapa[nf][nc]==="S"){

if(preguntaActual < PUERTAS_NIVEL[nivelActual]){

alert("Debes responder todas las preguntas antes de salir del laberinto")
return

}

juegoPausado = true
musicaNivel.pause()

mostrarTarjeta(
"",
TARJETAS.nivelCompletado.mensaje,
TARJETAS.nivelCompletado.boton,
mostrarFormularioCertificado
)

return

}

/* PUERTA */

if(mapa[nf][nc]==="D"){

if(preguntaAbierta)return

preguntaAbierta=true

let correcta=abrirPregunta(nivelActual,preguntaActual+1)

if(correcta){

mapa[nf][nc]=0
preguntaActual++
sonidoPuerta.play()

}

preguntaAbierta=false
return

}

jugador.x=nc*CONFIG.tamCelda
jugador.y=nf*CONFIG.tamCelda

}

/* ENEMIGOS */

function moverEnemigos(){

enemigos.forEach(e=>{

let dx = jugador.x - e.x
let dy = jugador.y - e.y

if(Math.abs(dx) < 150 && Math.abs(dy) < 150){

e.dirX = Math.sign(dx)
e.dirY = Math.sign(dy)

}

let nx=e.x+e.dirX*2
let ny=e.y+e.dirY*2

let f=Math.floor(ny/CONFIG.tamCelda)
let c=Math.floor(nx/CONFIG.tamCelda)

if(mapa[f][c]===1 || mapa[f][c]==="D"){

let dirs=[[1,0],[-1,0],[0,1],[0,-1]]
let r=dirs[Math.floor(Math.random()*4)]

e.dirX=r[0]
e.dirY=r[1]

return

}

e.x=nx
e.y=ny

})

}

/* COLISION */

function colision(){

enemigos.forEach(e=>{

let dx=jugador.x-e.x
let dy=jugador.y-e.y

let d=Math.sqrt(dx*dx+dy*dy)

if(d<CONFIG.tamCelda/2){

vidas--

actualizarHUD()

mostrarTarjeta(
"",
TARJETAS.atrapado.mensaje,
TARJETAS.atrapado.boton,
()=>panel.classList.add("oculto")
)

buscarEntrada()

}

})

}

/* DIBUJAR */

function dibujarFondo(){
ctx.drawImage(fondo,0,0,canvas.width,canvas.height)
}

function dibujarMapa(){

for(let f=0;f<mapa.length;f++){
for(let c=0;c<mapa[f].length;c++){

let x=c*CONFIG.tamCelda
let y=f*CONFIG.tamCelda

if(mapa[f][c]===1){

ctx.fillStyle="#2c3e50"
ctx.fillRect(x,y,CONFIG.tamCelda,CONFIG.tamCelda)

}

if(mapa[f][c]==="D"){

ctx.fillStyle="orange"
ctx.fillRect(x+8,y+8,CONFIG.tamCelda-16,CONFIG.tamCelda-16)

}

if(mapa[f][c]==="S"){

ctx.fillStyle="green"
ctx.fillRect(x+8,y+8,CONFIG.tamCelda-16,CONFIG.tamCelda-16)

ctx.fillStyle="white"
ctx.font="bold 14px Arial"
ctx.fillText("SALIDA",x+2,y+20)

}

}
}

}

function dibujarJugador(){

ctx.drawImage(
spriteJugador,
jugador.x,
jugador.y,
CONFIG.tamCelda,
CONFIG.tamCelda
)

}

function dibujarEnemigos(){

enemigos.forEach(e=>{

ctx.drawImage(
spriteEnemigo,
e.x,
e.y,
CONFIG.tamCelda,
CONFIG.tamCelda
)

})

}

/* LOOP */

function loop(){

ctx.clearRect(0,0,canvas.width,canvas.height)

dibujarFondo()
dibujarMapa()
dibujarJugador()
dibujarEnemigos()

if(juegoIniciado && !juegoPausado){

moverEnemigos()
colision()

}

requestAnimationFrame(loop)

}

/* CERTIFICADO */

function mostrarFormularioCertificado(){

panel.classList.remove("oculto")

panelTitulo.innerText="Generar certificado"
panelTexto.innerText="Ingresa tu nombre y apellidos para generar tu certificado."

panelBotones.innerHTML=""

let input = document.getElementById("nombreJugador")
input.classList.remove("oculto")
input.value=""

let btn = document.createElement("button")
btn.innerText="Generar certificado"

btn.onclick = generarCertificado

panelBotones.appendChild(btn)

}

function generarCertificado(){

let nombre = document.getElementById("nombreJugador").value

if(nombre.trim()===""){
alert("Escribe tu nombre completo")
return
}

let tiempoFinal = CONFIG.tiempoNiveles[nivelActual] - tiempo

let info = CERTIFICADOS[nivelActual+1]

panel.classList.remove("oculto")

panelTitulo.innerText=""

panelTexto.innerHTML = `

<div class="certificado">

<img src="imagenes/logo/logo_aia_safefood_maze.png" width="180">

<h1>CERTIFICADO DE LOGRO</h1>

<p>Se otorga el presente certificado a</p>
<div class="nombre">${nombre}</div>
<p>Por haber completado satisfactoriamente el</p>
<div class="nivel">${info.nivel}</div>
<p>y haber aprendido en:</p>
<b>${info.tema}</b>
<br><br>
Dentro del juego educativo de inocuidad alimentaria:
<br><br>
<b>AIA SafeFood Maze</b>
<br><br>
Completando el desafío en un tiempo de:
<br><br>
<b>${tiempoFinal} segundos</b>
<br><br>
Fecha: ${new Date().toLocaleDateString()}
<br><br>
Creado por<br>
Osmary Cortés Bracho<br>
Microbióloga<br>
AIA SafeFood Maze<br>
Aprende en Inocuidad Alimentaria
<div class="footer">
Este certificado es parte del juego educativo AIA SafeFood Maze y tiene únicamente fines de aprendizaje.  
No representa una certificación oficial ni está avalado por ninguna entidad.

</div>

</div>
`

panelBotones.innerHTML=""

let btnImprimir = document.createElement("button")
btnImprimir.innerText="Imprimir certificado"
btnImprimir.onclick=()=>window.print()

let btnContinuar = document.createElement("button")
btnContinuar.innerText="Continuar al siguiente nivel"
btnContinuar.onclick=irSiguienteNivel

panelBotones.appendChild(btnImprimir)
panelBotones.appendChild(btnContinuar)

}

function irSiguienteNivel(){

new Audio(CONFIG.sonidos.nivel).play()

nivelActual++

if(nivelActual>=10){

alert("¡Has completado AIA SafeFood Maze!")

location.reload()
return

}

mapa = MAPAS[nivelActual]

preguntaActual=0

tiempo = CONFIG.tiempoNiveles[nivelActual]

spriteEnemigo.src = CONFIG.microorganismos[nivelActual]
fondo.src = CONFIG.fondosPlantas[nivelActual]

musicaNivel.src = CONFIG.musicaNiveles[nivelActual]
musicaNivel.play()

panel.classList.add("oculto")

juegoPausado=false

buscarEntrada()
crearEnemigos()

}

function reiniciarNivel(){

document.getElementById("joystick").style.display="block"

tiempo = CONFIG.tiempoNiveles[nivelActual]

preguntaActual = 0

mapa = MAPAS[nivelActual]

buscarEntrada()

crearEnemigos()

panel.classList.add("oculto")

juegoPausado = false

}

/* INICIO */

actualizarHUD()
iniciarTarjetas()

loop()

/* CONTROLES TACTILES */

document.getElementById("up").addEventListener("touchstart",()=>moverJugador(0,-1))

document.getElementById("down").addEventListener("touchstart",()=>moverJugador(0,1))

document.getElementById("left").addEventListener("touchstart",()=>moverJugador(-1,0))

document.getElementById("right").addEventListener("touchstart",()=>moverJugador(1,0))



