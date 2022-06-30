/**
 * Copia del juego WORDLE
 * https://wordle.danielfrg.com/
 * 
 * El archivo words.txt contiene las palabras ordenadas por frecuencia de uso en la lengua española
 * 
 * @author Oscar Monforte Prades
 * @version 1.0
 */

const casillaActual = {
    fila: 0,
    columna: 0
};

let palabraOculta = "";
let arrayPalabras;
let palabrasJugadas = new Array(6);
let nivel = 0;

const Tabla_Fila_0 = document.getElementById("tablaFila0");
const Tabla_Fila_1 = document.getElementById("tablaFila1");
const Tabla_Fila_2 = document.getElementById("tablaFila2");
const Tabla_Fila_3 = document.getElementById("tablaFila3");
const Tabla_Fila_4 = document.getElementById("tablaFila4");
const Tabla_Fila_5 = document.getElementById("tablaFila5");
const Teclado_Fila_0 = document.getElementById("tecladoFila0");
const Teclado_Fila_1 = document.getElementById("tecladoFila1");
const Teclado_Fila_2 = document.getElementById("tecladoFila2");
const Botones_Teclado_0 = Teclado_Fila_0.querySelectorAll("button");
const Botones_Teclado_1 = Teclado_Fila_1.querySelectorAll("button");
const Botones_Teclado_2 = Teclado_Fila_2.querySelectorAll("button");
const Jugar = document.getElementById("jugar");
const SubirNivel = document.getElementById("subirNivel");
const BajarNivel = document.getElementById("bajarNivel");

for (const b of Botones_Teclado_0) {
    b.addEventListener("click", function () { escribirLetra(b.value); });
}

for (const b of Botones_Teclado_1) {
    b.addEventListener("click", function () { escribirLetra(b.value); });
}

for (const b of Botones_Teclado_2) {
    b.addEventListener("click", function () { escribirLetra(b.value); });
}

Jugar.addEventListener("click", function () { iniciarPartida(); });
SubirNivel.addEventListener("click", function () { slectNivel("subir"); });
BajarNivel.addEventListener("click", function () { slectNivel("bajar"); });
window.onload = function () { inicializacion(); };
window.addEventListener("keydown", function (evento) { filtrarLetraTeclado(evento); })


/**
 * Función para poder inicializar antes de empezar
 */
function inicializacion() {
    for (let i = 0; i < palabrasJugadas.length; i++) {
        palabrasJugadas[i] = "";
    }

    casillaActual.fila = 6;

    leerPalabras();
}

/**
 * Función donde inicia una nueva partida
 */
function iniciarPartida() {
    removeConfetti();

    SubirNivel.style.visibility = "hidden";
    BajarNivel.style.visibility = "hidden";
    Jugar.style.visibility = "hidden";

    for (let i = 0; i < palabrasJugadas.length; i++) {
        palabrasJugadas[i] = "";
    }

    let borrado = document.querySelectorAll("td");

    for (let b of borrado) {
        b.className = "";
        b.innerHTML = "";
    }

    borrado = document.querySelectorAll("button");

    for (let b of borrado) {
        b.className = "";
    }

    casillaActual.columna = 0;
    casillaActual.fila = 0;
    palabraOculta = arrayPalabras[parseInt(Math.random() * 500 + nivel)];
    palabraOculta = palabraOculta.toUpperCase();
    console.log(palabraOculta);
    mostrarAnimacionElemento("td", 0);
    mostrarAnimacionElemento("button", 0);
    document.getElementsByTagName("h3")[0].innerHTML = "Empieza a escribir<i class='fa-regular fa-face-smile'></i>";
}

/**
 * Funcion que muestra el confeti y muestra mensaje de victoria
 */
function ganarPartida() {
    Jugar.style.visibility = "visible";

    if (nivel == 0) {
        BajarNivel.style.visibility = "hidden";
        SubirNivel.style.visibility = "visible";
    } else if (nivel == (arrayPalabras.length - 501)) {
        BajarNivel.style.visibility = "visible";
        SubirNivel.style.visibility = "hidden";
    } else {
        BajarNivel.style.visibility = "visible";
        SubirNivel.style.visibility = "visible";
    }

    casillaActual.fila = 6;
    startConfetti();
    document.getElementsByTagName("h3")[0].innerHTML = "Has acertado<i class='fa-regular fa-face-grin-stars'></i>";
}

/**
 * Función que muestra mensaje cuando has perdido la partida
 */
function perderPartida() {
    Jugar.style.visibility = "visible";

    if (nivel == 0) {
        BajarNivel.style.visibility = "hidden";
        SubirNivel.style.visibility = "visible";
    } else if (nivel == (arrayPalabras.length - 501)) {
        BajarNivel.style.visibility = "visible";
        SubirNivel.style.visibility = "hidden";
    } else {
        BajarNivel.style.visibility = "visible";
        SubirNivel.style.visibility = "visible";
    }

    casillaActual.fila = 6;
    document.getElementsByTagName("h3")[0].innerHTML = "Has perdido<i class='fa-regular fa-face-sad-cry'></i>la palabra era '<b  style='color:#f00'>" + palabraOculta + "</b>'";
}

/**
 * Función para cambiar el nivel del juego, le indico el rango de las palabras a buscar en el array de palabras porque estan ordenadas por el uso (las primeras son las que más se usan y las últimas las que menos)
 * 
 * @param {String} tipo String que si coincide con "subir" aumenta el nivel y si es "bajar" baja el nivel
 */
function slectNivel(tipo) {
    switch (nivel) {
        case 0:
            if (tipo == "subir") {
                nivel = 500;
                document.getElementsByTagName("span")[0].innerHTML = "Dificultad: media";
                SubirNivel.style.visibility = "visible";
                BajarNivel.style.visibility = "visible";
            }
            break;

        case 500:
            if (tipo == "subir") {
                nivel = 1000;
                document.getElementsByTagName("span")[0].innerHTML = "Dificultad: alta";
                SubirNivel.style.visibility = "visible";
                BajarNivel.style.visibility = "visible";
            } else if (tipo == "bajar") {
                nivel = 0;
                document.getElementsByTagName("span")[0].innerHTML = "Dificultad: baja";
                SubirNivel.style.visibility = "visible";
                BajarNivel.style.visibility = "hidden";
            }
            break;

        case 1000:
            if (tipo == "subir") {
                nivel = 1500;
                document.getElementsByTagName("span")[0].innerHTML = "Dificultad: muy alta";
                SubirNivel.style.visibility = "visible";
                BajarNivel.style.visibility = "visible";
            } else if (tipo == "bajar") {
                nivel = 500;
                document.getElementsByTagName("span")[0].innerHTML = "Dificultad: media";
                SubirNivel.style.visibility = "visible";
                BajarNivel.style.visibility = "visible";
            }
            break;

        case 1500:
            if (tipo == "subir") {
                nivel = arrayPalabras.length - 501;
                document.getElementsByTagName("span")[0].innerHTML = "Dificultad: RAE";
                SubirNivel.style.visibility = "hidden";
                BajarNivel.style.visibility = "visible";
            } else if (tipo == "bajar") {
                nivel = 1000;
                document.getElementsByTagName("span")[0].innerHTML = "Dificultad: alta";
                SubirNivel.style.visibility = "visible";
                BajarNivel.style.visibility = "visible";
            }
            break;

        case arrayPalabras.length - 501:
            if (tipo == "bajar") {
                nivel = 1500;
                document.getElementsByTagName("span")[0].innerHTML = "Dificultad: muy alta";
                SubirNivel.style.visibility = "visible";
                BajarNivel.style.visibility = "visible";
            }
            break;

        default:
            break;
    }
}

/**
 * Función que detecta si la tecla es una letra o intro o backspace
 * 
 * @param {String} letra tecla que se ha pulsado
 */
function escribirLetra(letra) {
    switch (letra) {
        case "ENTER":
        case "ENVIAR":
            if (casillaActual.columna == 5 && casillaActual.fila < 6) {
                if (arrayPalabras.includes(palabrasJugadas[casillaActual.fila])) {
                    compararPalabra(palabrasJugadas[casillaActual.fila], palabraOculta);
                    casillaActual.fila++;
                    casillaActual.columna = 0;
                } else {
                    vibrarCeldaTabla(casillaActual, "animacion-vibrar");
                }
            }
            break;

        case "BACKSPACE":
        case "BORRAR":
            if (casillaActual.columna > 0 && casillaActual.columna < 6) {
                casillaActual.columna--;
                let actualizar = palabrasJugadas[casillaActual.fila];
                palabrasJugadas[casillaActual.fila] = actualizar.substring(0, actualizar.length - 1);
                escribirCeldaTabla(casillaActual, "");
            }
            break;

        default:
            if (casillaActual.columna < 5) {
                if (escribirCeldaTabla(casillaActual, letra)) {
                    palabrasJugadas[casillaActual.fila] += letra;
                    casillaActual.columna++;
                }
            }
            break;
    }
}

/**
 * Función que escribe una letra en la celda correspondiente a la tabla HTML
 * 
 * @param {ObjectCasilla} casilla numero de casilla de la tabla que se quiere rellenar
 * @param {String} letra caracter de la letra
 * @returns {Boolean} si se ha realizado con exito
 */
function escribirCeldaTabla(casilla, letra) {
    let arrayCelda;
    switch (casilla.fila) {
        case 0:
            arrayCelda = Tabla_Fila_0.querySelectorAll("td");
            break;

        case 1:
            arrayCelda = Tabla_Fila_1.querySelectorAll("td");
            break;

        case 2:
            arrayCelda = Tabla_Fila_2.querySelectorAll("td");
            break;

        case 3:
            arrayCelda = Tabla_Fila_3.querySelectorAll("td");
            break;

        case 4:
            arrayCelda = Tabla_Fila_4.querySelectorAll("td");
            break;

        case 5:
            arrayCelda = Tabla_Fila_5.querySelectorAll("td");
            break;

        default:
            return false;
            break;
    }

    arrayCelda[casilla.columna].innerHTML = letra;
    return true;
}

/**
 * Función para colorear la casilla añadiendole la clase correspondiente
 * 
 * @param {ObjectCasilla} casilla numero de casilla de la tabla que se quiere colorear
 * @param {String} clase String de la clase que se quiere añadir
 * @returns {Boolean} true si se ha realizado la operacion o false si no se ha realizado
 */
function colorearCeldaTabla(casilla, clase) {
    let arrayCelda;
    switch (casilla.fila) {
        case 0:
            arrayCelda = Tabla_Fila_0.querySelectorAll("td");
            break;

        case 1:
            arrayCelda = Tabla_Fila_1.querySelectorAll("td");
            break;

        case 2:
            arrayCelda = Tabla_Fila_2.querySelectorAll("td");
            break;

        case 3:
            arrayCelda = Tabla_Fila_3.querySelectorAll("td");
            break;

        case 4:
            arrayCelda = Tabla_Fila_4.querySelectorAll("td");
            break;

        case 5:
            arrayCelda = Tabla_Fila_5.querySelectorAll("td");
            break;

        default:
            return false;
            break;
    }

    arrayCelda[casilla.columna].className = "";
    arrayCelda[casilla.columna].style.transform = "rotateY(360deg)";
    arrayCelda[casilla.columna].classList.add(clase);

    return true;
}

/**
 * Función para vibrar las casillas
 * 
 * @param {ObjectCasilla} casilla numero de casilla de la tabla que se quiere colorear
 * @returns {Boolean} true si se ha realizado la operacion o false si no se ha realizado
 */
function vibrarCeldaTabla(casilla) {
    let arrayCelda;
    switch (casilla.fila) {
        case 0:
            arrayCelda = Tabla_Fila_0.querySelectorAll("td");
            break;

        case 1:
            arrayCelda = Tabla_Fila_1.querySelectorAll("td");
            break;

        case 2:
            arrayCelda = Tabla_Fila_2.querySelectorAll("td");
            break;

        case 3:
            arrayCelda = Tabla_Fila_3.querySelectorAll("td");
            break;

        case 4:
            arrayCelda = Tabla_Fila_4.querySelectorAll("td");
            break;

        case 5:
            arrayCelda = Tabla_Fila_5.querySelectorAll("td");
            break;

        default:
            return false;
            break;
    }


    for (const c of arrayCelda) {
        c.style.animation = 'none';
        c.offsetHeight;
        c.style.animation = "vibrar 0.5s 1";
    }

    return true;
}

/**
 * Función para colorear la letra del teclado añadiendole la clase correspondiente
 * 
 * @param {String} letra caracter de la letra que se quiere colorear
 * @param {String} clase String de la clase que se quiere añadir
 */
function colorearTecla(letra, clase) {
    if (document.getElementById("letra" + letra).className != "posicion-correcta") {
        if (clase == "posicion-incorrecta" || clase == "posicion-correcta" || (clase == "no-existe" && document.getElementById("letra" + letra).className != "posicion-incorrecta")) {
            document.getElementById("letra" + letra).className = "";
            document.getElementById("letra" + letra).style.transform = "rotateY(360deg)";
            document.getElementById("letra" + letra).classList.add(clase);
        }
    }
}

/**
 * Función que filtra las teclas pulsadas del teclado para que solo reconozca el abecedario, intro y backspace
 * 
 * @param {String} tecla tecla pulsada por teclado
 */
function filtrarLetraTeclado(tecla) {
    if (!tecla.altKey && !tecla.ctrlKey && !tecla.shiftKey && !tecla.metaKey) {
        if (tecla.key.toUpperCase() == "ENTER" || tecla.key.toUpperCase() == "BACKSPACE" || tecla.key.length == 1) {
            let ascii = tecla.key.toUpperCase().charCodeAt(0);

            if (ascii > 64 && ascii < 91 || ascii == 209) {
                escribirLetra(tecla.key.toUpperCase());
            }
        }
    }
}

/**
 * Función que compara la palabra escrita por el jugador y la palbra oculta
 * 
 * @param {String} palabraJugada string de la palabra que ha escrito el jugador
 * @param {String} palabra string de la palabra oculta que tiene que adivinar el jugadro
 */
function compararPalabra(palabraJugada, palabra) {
    const casilla = {
        fila: casillaActual.fila,
        columna: 0
    };

    if (palabraJugada != palabra) {
        for (let i = 0; i < palabraJugada.length; i++) {
            casilla.columna = i;

            if (palabra.includes(palabraJugada[i])) {
                if (palabra[i] == palabraJugada[i]) {
                    colorearCeldaTabla(casilla, "posicion-correcta");
                    colorearTecla(palabraJugada[i], "posicion-correcta");
                    palabra = palabra.replaceAt(i, ' ');
                    palabraJugada = palabraJugada.replaceAt(i, ' ');
                }
            } else {
                colorearCeldaTabla(casilla, "no-existe");
                colorearTecla(palabraJugada[i], "no-existe");
            }
        }

        for (let i = 0; i < palabraJugada.length; i++) {
            casilla.columna = i;

            if (palabraJugada[i] != ' ') {
                if (palabra.includes(palabraJugada[i])) {
                    colorearCeldaTabla(casilla, "posicion-incorrecta");
                    colorearTecla(palabraJugada[i], "posicion-incorrecta");
                    palabra = palabra.replace(palabraJugada[i], ' ');
                    palabraJugada = palabraJugada.replaceAt(i, ' ');
                } else {
                    colorearCeldaTabla(casilla, "no-existe");
                    colorearTecla(palabraJugada[i], "no-existe");
                }
            }
        }

        if (casilla.fila == 5) {
            perderPartida();
        }
    } else {
        for (let i = 0; i < palabraJugada.length; i++) {
            casilla.columna = i;
            colorearCeldaTabla(casilla, "posicion-correcta");
            colorearTecla(palabraJugada[i], "posicion-correcta");
        }

        ganarPartida();
    }
}

/**
 * Función para leer el listado de palabras y elegir una random
 */
function leerPalabras() {
    fetch("public/data/words.txt")
        .then(response => response.text())
        .then(data => {
            arrayPalabras = data.split(" ");
        });
}

/**
 * Función para realizar una animación de un elemento HTML
 * 
 * @param {String} elemento string del elemento HTML que se quiere hacer la animación
 * @param {Number} time tiempo en ms en que empieza la animación
 */
function mostrarAnimacionElemento(elemento, time) {
    let arrayElementos = document.querySelectorAll(elemento);

    for (let e of arrayElementos) {
        setTimeout(() => e.style.visibility = "visible", time);
        time += 100;
    }
}

/**
 * Función que reemplazar un caracter por otro nuevo
 * La función se añada al objeto String
 * 
 * @param {Number} index número del caracter
 * @param {String} replacement nuevo caracter que se quiere introducir
 * @returns {String} devuelve el nuevo String
 */
String.prototype.replaceAt = function (index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}