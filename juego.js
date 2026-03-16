const canvas = document.getElementById("juego")
const ctx = canvas.getContext("2d")

canvas.addEventListener("touchmove", function(e){

if(e.target === canvas){
e.preventDefault()
}

},{ passive:false })

function ajustarCanvas(){

let ratio = CONFIG.anchoCanvas / CONFIG.altoCanvas

let w = window.innerWidth
let h = window.innerHeight

if(w/h > ratio){
w = h * ratio
}else{
h = w / ratio
}

canvas.style.width = w + "px"
canvas.style.height = h + "px"

canvas.width = CONFIG.anchoCanvas
canvas.height = CONFIG.altoCanvas

}

window.addEventListener("resize",ajustarCanvas)

ajustarCanvas()

let nivelActual = 1
let mapa = MAPAS[nivelActual-1]

let preguntaActual = 0
let tiempo = CONFIG.tiempoNiveles[nivelActual-1]
let vidas = CONFIG.vidasIniciales

let juegoIniciado = false
let juegoPausado = false
let preguntaAbierta = false

let mensajeSalidaMostrado = false

let jugador = {x:0,y:0}

/* DIRECCION ACTUAL */
let direccion = {x:0,y:0}

/* DIRECCION SIGUIENTE */
let siguienteDireccion = {x:0,y:0}

let ultimoMovimiento = 0
let velocidadJugador = 120

let ultimoMovimientoEnemigo = 0
let velocidadEnemigo = 180

let enemigos = []

/* SPRITES */

const spriteJugador = new Image()
spriteJugador.src = CONFIG.jugadorSprite

const spriteEnemigo = new Image()
spriteEnemigo.src = CONFIG.microorganismos[nivelActual-1]

const fondo = new Image()
fondo.src = CONFIG.fondosPlantas[nivelActual-1]

/* SONIDOS */

const sonidoCorrecto = new Audio(CONFIG.sonidos.correcto)
const sonidoError = new Audio(CONFIG.sonidos.error)
const sonidoPuerta = new Audio(CONFIG.sonidos.puerta)

function desbloquearAudio(){

sonidoCorrecto.play().then(()=>{sonidoCorrecto.pause();sonidoCorrecto.currentTime=0}).catch(()=>{})
sonidoError.play().then(()=>{sonidoError.pause();sonidoError.currentTime=0}).catch(()=>{})
sonidoPuerta.play().then(()=>{sonidoPuerta.pause();sonidoPuerta.currentTime=0}).catch(()=>{})

document.removeEventListener("touchstart", desbloquearAudio)

}

document.addEventListener("touchstart", desbloquearAudio)

const musicaNivel = new Audio(CONFIG.musicaNiveles[nivelActual-1])
musicaNivel.loop = true


const btnMusica = document.getElementById("btnMusica")

if(btnMusica){

btnMusica.innerText="🔊"

btnMusica.onclick = function(){

musicaNivel.muted = !musicaNivel.muted

btnMusica.innerText = musicaNivel.muted ? "🔇" : "🔊"

}

}

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

panelTitulo.innerText=titulo
panelTexto.innerHTML=texto

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
"Instrucciones",
TARJETAS.instrucciones.mensaje,
TARJETAS.instrucciones.boton,
mostrarNivel
)

}

function mostrarNivel(){

let info = MICROORGANISMOS[nivelActual-1]

let enemigo = CONFIG.microorganismos[nivelActual-1]

let texto = `
<img src="${enemigo}" width="180">

${info.mensaje}
`

mostrarTarjeta(
info.titulo,
texto,
"Continuar",
iniciarJuego
)

}

/* INICIAR JUEGO */

function iniciarJuego(){

panel.classList.add("oculto")

mapa = MAPAS[nivelActual-1]

preguntaActual = 0

tiempo = CONFIG.tiempoNiveles[nivelActual]

spriteEnemigo.src = CONFIG.microorganismos[nivelActual-1]

fondo.src = CONFIG.fondosPlantas[nivelActual-1]

musicaNivel.src = CONFIG.musicaNiveles[nivelActual-1]
musicaNivel.play()

juegoIniciado = true
juegoPausado = false

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

enemigos = []

let cantidad = [1,1,2,2,3,3,4,4,5,6][nivelActual-1]

for(let i=0;i<cantidad;i++){

let colocado = false

while(!colocado){

let f = Math.floor(Math.random()*CONFIG.filas)
let c = Math.floor(Math.random()*CONFIG.columnas)

/* evitar paredes, entrada y salida */

if(mapa[f][c] !== 1 && mapa[f][c] !== "E" && mapa[f][c] !== "S"){

enemigos.push({

x: c * CONFIG.tamCelda,
y: f * CONFIG.tamCelda,

dirX:0,
dirY:0,

velocidad: 1 + (nivelActual * 0.3)

})

colocado = true

}

}

}

}



/* MOVER ENEMIGOS */

function moverEnemigos(){

let ahora = Date.now()

if(ahora - ultimoMovimientoEnemigo < velocidadEnemigo) return

ultimoMovimientoEnemigo = ahora

enemigos.forEach(e=>{

let dx = jugador.x - e.x
let dy = jugador.y - e.y

let dirX = 0
let dirY = 0

/* decidir dirección principal */

if(Math.abs(dx) > Math.abs(dy)){

dirX = Math.sign(dx)

}else{

dirY = Math.sign(dy)

}

/* calcular siguiente posición */

let nx = e.x + dirX * e.velocidad
let ny = e.y + dirY * e.velocidad

let f = Math.floor(ny / CONFIG.tamCelda)
let c = Math.floor(nx / CONFIG.tamCelda)

/* verificar pared */

if(mapa[f] && mapa[f][c] !== 1){

e.x = nx
e.y = ny

}else{

/* intentar dirección alternativa */

nx = e.x + Math.sign(dx) * e.velocidad
ny = e.y

f = Math.floor(ny / CONFIG.tamCelda)
c = Math.floor(nx / CONFIG.tamCelda)

if(mapa[f] && mapa[f][c] !== 1){

e.x = nx
return

}

nx = e.x
ny = e.y + Math.sign(dy) * e.velocidad

f = Math.floor(ny / CONFIG.tamCelda)
c = Math.floor(nx / CONFIG.tamCelda)

if(mapa[f] && mapa[f][c] !== 1){

e.y = ny

}

}

})

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

let p=PREGUNTAS[nivel][pregunta-1]

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

sonidoCorrecto.currentTime=0
sonidoCorrecto.play().catch(() => {})
return true

}else{

sonidoError.currentTime=0
sonidoError.play().catch(() => {})
tiempo-=CONFIG.penalizacionError
return false

}

}

/* MOVER JUGADOR */

function moverJugador(dx,dy){

/* guardar direccion siguiente (pacman style) */
siguienteDireccion.x = dx
siguienteDireccion.y = dy

}

/* MOVIMIENTO AUTOMATICO TIPO PACMAN */

function moverAutomatico(){

let ahora = Date.now()

if(ahora - ultimoMovimiento < velocidadJugador) return

ultimoMovimiento = ahora

let f = Math.floor(jugador.y / CONFIG.tamCelda)
let c = Math.floor(jugador.x / CONFIG.tamCelda)

/* INTENTAR CAMBIAR DIRECCION (GIRO SUAVE) */

let tf = f + siguienteDireccion.y
let tc = c + siguienteDireccion.x

if(mapa[tf][tc] !== 1){

direccion.x = siguienteDireccion.x
direccion.y = siguienteDireccion.y

}

/* SI NO HAY DIRECCION NO MOVER */

if(direccion.x === 0 && direccion.y === 0) return

let nf = f + direccion.y
let nc = c + direccion.x

/* PARED */

if(mapa[nf][nc] === 1){
return
}

/* SALIDA */

if(mapa[nf][nc] === "S"){

if(preguntaActual < PUERTAS_NIVEL[nivelActual-1]){

if(!mensajeSalidaMostrado){

mensajeSalidaMostrado = true

alert("Debes responder todas las preguntas antes de salir del laberinto")

setTimeout(()=>{
mensajeSalidaMostrado = false
},500)

}

/* retroceder una celda */
jugador.x = c * CONFIG.tamCelda
jugador.y = f * CONFIG.tamCelda

direccion.x = 0
direccion.y = 0

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

if(mapa[nf][nc] === "D"){

if(preguntaAbierta) return

preguntaAbierta = true

let correcta = abrirPregunta(nivelActual,preguntaActual+1)

if(correcta){

mapa[nf][nc] = 0
preguntaActual++

sonidoPuerta.currentTime = 0
sonidoPuerta.play().catch(()=>{})

}

preguntaAbierta = false
return

}

/* MOVER JUGADOR */

jugador.x = nc * CONFIG.tamCelda
jugador.y = nf * CONFIG.tamCelda

}

/* ENEMIGOS */

function moverEnemigos(){

let ahora = Date.now()

if(ahora - ultimoMovimientoEnemigo < velocidadEnemigo) return

ultimoMovimientoEnemigo = ahora

enemigos.forEach(e=>{

let dx = jugador.x - e.x
let dy = jugador.y - e.y

/* direccion hacia jugador */

let dirX = Math.sign(dx)
let dirY = Math.sign(dy)

/* intentar mover en X */

let nx = e.x + dirX * 2
let ny = e.y

let f = Math.floor(ny / CONFIG.tamCelda)
let c = Math.floor(nx / CONFIG.tamCelda)

if(mapa[f][c] !== 1 && mapa[f][c] !== "D"){
e.x = nx
return
}

/* si no puede en X intentar Y */

nx = e.x
ny = e.y + dirY * 2

f = Math.floor(ny / CONFIG.tamCelda)
c = Math.floor(nx / CONFIG.tamCelda)

if(mapa[f][c] !== 1 && mapa[f][c] !== "D"){
e.y = ny
return
}

/* si tampoco puede, mover aleatorio */

let dirs = [
{dx:1,dy:0},
{dx:-1,dy:0},
{dx:0,dy:1},
{dx:0,dy:-1}
]

for(let d of dirs){

nx = e.x + d.dx * 2
ny = e.y + d.dy * 2

f = Math.floor(ny / CONFIG.tamCelda)
c = Math.floor(nx / CONFIG.tamCelda)

if(mapa[f][c] !== 1 && mapa[f][c] !== "D"){
e.x = nx
e.y = ny
return
}

}

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

ctx.fillStyle="black"
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

let ultimoFrame = 0
const FPS = 30

function loop(timestamp){

if(timestamp - ultimoFrame < 1000/FPS){
requestAnimationFrame(loop)
return
}

ultimoFrame = timestamp

ctx.clearRect(0,0,canvas.width,canvas.height)

dibujarFondo()
dibujarMapa()
dibujarJugador()
dibujarEnemigos()

if(juegoIniciado && !juegoPausado){

moverAutomatico()
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

let tiempoFinal = CONFIG.tiempoNiveles[nivelActual-1] - tiempo

let info

if(nivelActual > 10){
info = CERTIFICADOS[10]
}else{
info = CERTIFICADOS[nivelActual-1]
}

panel.classList.remove("oculto")

panelTitulo.innerText=""

panelTexto.innerHTML = `

<div class="certificado">

<div style="display:flex;align-items:center;justify-content:center;gap:25px;margin-bottom:20px;">

<img src="imagenes/logo/logo_aia_safefood_maze.png" width="130">

<h1 style="margin:0;letter-spacing:3px;">CERTIFICADO DE LOGRO</h1>

</div>

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

<button onclick="descargarCertificado()">Descargar PDF</button>

</div>
`;

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

mostrarNivel()

}

function iniciarJuego(){

document.getElementById("juego").style.display="block"

panel.classList.add("oculto")

juegoIniciado = true
juegoPausado = false

mapa = MAPAS[nivelActual-1]

preguntaActual = 0

tiempo = CONFIG.tiempoNiveles[nivelActual]

spriteEnemigo.src = CONFIG.microorganismos[nivelActual-1]

fondo.src = CONFIG.fondosPlantas[nivelActual-1]

musicaNivel.src = CONFIG.musicaNiveles[nivelActual-1]
musicaNivel.play()

juegoPausado=false

buscarEntrada()
crearEnemigos()

}
function reiniciarNivel(){

tiempo = CONFIG.tiempoNiveles[nivelActual-1]

preguntaActual = 0

mapa = MAPAS[nivelActual-1]

buscarEntrada()

crearEnemigos()

panel.classList.add("oculto")

juegoPausado = false

}

/* INICIO */

actualizarHUD()
// iniciarTarjetas()

loop()

/* SWIPE MOVIL */

let touchStartX = 0
let touchStartY = 0

canvas.addEventListener("touchstart", function(e){

e.preventDefault()

let t = e.touches[0]

touchStartX = t.clientX
touchStartY = t.clientY

},{passive:false})

canvas.addEventListener("touchend", function(e){

e.preventDefault()

let t = e.changedTouches[0]

let dx = t.clientX - touchStartX
let dy = t.clientY - touchStartY

if(Math.abs(dx) > Math.abs(dy)){

if(dx > 30){
moverJugador(1,0)
}

if(dx < -30){
moverJugador(-1,0)
}

}else{

if(dy > 30){
moverJugador(0,1)
}

if(dy < -30){
moverJugador(0,-1)
}

}

},{passive:false})

/* =========================
   MENU PRINCIPAL
========================= */

document.addEventListener("DOMContentLoaded", () => {

const pantallaInicio = document.getElementById("pantallaInicio")

document.getElementById("btnVolver").onclick = () => {

location.reload()

}

document.getElementById("btnJugar").onclick = () => {

pantallaInicio.style.display = "none"

mostrarNivel()

}

document.getElementById("btnInstrucciones").onclick = () => {

pantallaInicio.style.display = "none"

mostrarInstrucciones()

}

document.getElementById("btnCreditos").onclick = () => {

pantallaInicio.style.display = "none"

iniciarTarjetas()

}

})

function descargarCertificado(){

const elemento = document.querySelector(".certificado");

const opciones = {

margin:10,
filename:'certificado-safefood-maze.pdf',

image:{type:'jpeg',quality:0.98},

html2canvas:{scale:2},

jsPDF:{unit:'mm',format:'a4',orientation:'landscape'}

};

html2pdf().set(opciones).from(elemento).save();

}


