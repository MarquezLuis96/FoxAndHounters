let board;

class Board {
    constructor(pieces, firstTurn='Fox') {
        this.pieces = pieces;
        this.currentTurn = firstTurn;
        this.focussedPiece = null;
        this.gameover = false;
    }

    //Verifica si el movimiento que recibe es válido para la pieza que recibe
    isValidMove(piece, x, y) {
        //Todos los posibles escenarios son verificados antes de retornar true lo cual indicaría un movimiento válido

        //Primer fallo: Cuando cualquier pieza intenta hacer un movimiento al mismo sitio en el que está
        if(piece.x === x && piece.y === y) {
            return false;
        }

        //Segundo fallo: Cuando un "Hunter" o cazador intenta moverse hacia atrás
        if(piece.name === "Hunter" && y < piece.y) {
            return false;
        }

        //Tercer fallo: Cuando cualquier pieza intenta hacer un movimiento que no sea en diagonal en el eje x
        if(piece.x + 1 !== x && piece.x - 1 !== x) {
            return false;
        }

        //Cuarto fallo: Cuando cualquier pieza intenta hacer un movimiento que no sea en diagonal en el eje y
        if(piece.y + 1 !== y && piece.y - 1 !== y) {
            return false;
        }

        //Quinto fallo: Si el nuevo sitio se encuentra fuera del campo de juegos
        if(x < 0 || x > 7 || y < 0 || y > 7) {
            return false;
        }

        //Sexto fallo: Ya otra pieza se encuentra en esa posición
        this.pieces.forEach(piece => {
            if(x === piece.x && y === piece.y) {
                return false;
            }
        });

        //Se retorna true si despues de todas las verificaciones
        //el movimiento resulta ser válido
        return true;
    }

    pieceAt(x, y) {
        //Busca una pieza de acuerdo a la ubicación proveída
        let foundPiece = null;
        this.pieces.forEach(piece => {
            if(piece.x === x && piece.y === y) {
                foundPiece = piece;
            }
        });
        return foundPiece;
    }

    possibleMoves(pieceName) {
        //Hace una lista de posibles movimientos por el tipo de pieza dada
        let validMoves = [];
        this.pieces.forEach(piece => {
            if(piece.name === pieceName) {
                validMoves = validMoves.concat(piece.possibleMoves);
            }
        });
        return validMoves;
    }

    checkVictory(register=true) {
        //Después de cada movimiento esta función será llamada para verificar si el juego acabó
        //Primero verifica si el zorro se encuentra encerrado, lo que significaría que los cazadores ganaron
        //Luego verifica si los cazadores se encuentran atascados, lo que significaría que el zorro ganó
        //Por último se verifica si el zorro alcanzó el final del tablero, lo que indicaría que el zorro ganó

        if(this.possibleMoves("Fox").length === 0) {
            if(register) {
                notify("info", `${nationalName("Hunter", true)} wins!`);
                this.addVictory("Hunter");
            }
            return "Hunter";
        } else if(this.possibleMoves("Hunter").length === 0) {
            if(register) {
                notify("info", `${nationalName("Fox", true)} wins!`)
            }
            return "Fox";
        } else {
            this.pieces.forEach(piece => {
                if(piece.name === "Fox" && piece.y === 0) {
                    if(register) {
                        notify("info", `${nationalName("Fox", true)} wins!`);
                    }
                    return "Fox";
                }
            });
        }
        return "";
    }

    addVictory(piece) {
        //Actualiza el contador de victorias para el jugador ganador
        this.gameover = true;
        const ourCounter = document.getElementById(`win-${piece}`);
        const ourWins = Number(ourCounter.innerHTML) + 1;
        ourCounter.innerHTML = ourWins;
        this.calculateVictoryRatio();
        if(document.getElementById("controls-show-gameover").checked) {
            setTimeout(generateNewBoard(), 1000);
        } else {
            generateNewBoard();
        }
    }

    calculateVictoryRatio() {
        //Calculate a new win ratio
        const foxCounter = document.getElementById("win-Fox");
        const foxWins = Number(foxCounter.innerHTML);
        const hunterCounter = document.getElementById("win-Hunter");
        const hunterWins = Number(hunterCounter.innerHTML);
        const ratioElement = document.getElementById("win-ratio");
        if(foxWins === 0 || hunterWins === 0) {
            return;
        }
        if(foxWins > hunterWins) {
            const ratio = foxWins / hunterWins;
            if(ratio !== Math.floor(ratio)) {
                ratioElement.innerText = `1:${ratio.toFixed(2)}`;
            } else {
                ratioElement.innerText = `1:${ratio}`;
            }
        } else if(hunterWins > foxWins) {
            const ratio = hunterWins / foxWins;
            if(ratio !== Math.floor(ratio)) {
                ratioElement.innerText = `${ratio.toFixed(2)}:1`;
            } else {
                ratioElement.innerText = `${ratio}:1`;
            }
        } else {
            ratioElement = `1:1`;
        }
    }
}

//Clase Piece es la clase padre que ayuda a controlar ambas clases de piezas (fox and hunters)
class Piece {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.name = "";
    }

    //Mueve la pieza a la posición especificada si el movimiento es válido
    moveTo(x, y, place=board) {
        //Si no es el turno de mover o si el juego finalizó se retorna el flujo del programa
        if(this.name !== place.currentTurn || place.gameover) {
            return;
        }

        //Valida si el movimiento es válido y lo ejecuta, sino muestra error
        if(place.isValidMove(this, x, y)) {
            //Cambia los valores preestablecidos de x e y a los nuevos valores
            this.x = x;
            this.y = y;
            
            //Actualiza el turno
            place.currentTurn = place.currentTurn === "Fox" ? "Hunter" : "Fox";
            place.focussedPiece = null;
            /*console.log("Focus on: " + board.focussedPiece);*/

            if(place === board) {
                //Se actualiza la tabla
                updateBoard();
                //Se verifica si alguna de las piezas llegaron a la condición de victoria
                board.checkVictory();

            }
            return true;
        }
        else {
            //Notifica que el movimiento es inválido
            notify("warn", "Movimiento no valido");
            return false;
        }
    }
}

//Clase Fox: Hereda de Piece y es la clase que controla al zorro en el tablero (no la ia, sino las posiciones)
class Fox extends Piece {
    //Siempre existirá un zorro o "Fox" en el tablero de juego
    //La posición inicial en la coordenada x del zorro será calculada con un número aleatorio al inicio del juego
    //En dicha posición y siempre será 7 ya que siempre se encuentra en la fila 7 al iniciar el juego
    constructor(x, y=7) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.name = "Fox";
    }

    //Retorna los movimientos posibles del zorro
    possibleMoves(place=board) {
        //Todos los movimientos que le son permitidos al zorro

        //1 - (Avanzar) - Diagonal a la derecha
        //2 - (Avanzar) - Diagonal a la izquierda
        //3 - (Retroceder) - Diagonal a la derecha
        //4 - (Retroceder) - Diagonal a la izquierda
        const allMoves = [
            {
                x: this.x + 1,
                y: this.y + 1
            },
            {
                x: this.x - 1,
                y: this.y + 1
            },
            {
                x: this.x + 1,
                y: this.y - 1
            },
            {
                x: this.x - 1,
                y: this.y - 1
            }
        ];

        //Para retornar los movimientos válidos
        const validMoves = [];

        //Para confirmar que dichos movimientos sean válidos en el tablero
        allMoves.forEach(move => {
            if(place.isValidMove(this, move.x, move.y)) {
                validMoves.push(move);
            }
        });

        //Retorna los movimientos válidos tomando en cuenta si se pueden realizar en el tablero
        return validMoves;
    }
}

//Clase Hunter: Hereda de Piece y es la clase que controla al cazador en el tablero (no la ia, sino las posiciones)
class Hunter extends Piece {
    //Siempre existirán cuatro cazadores o "Hunters" en el tablero de juego
    //La posición inicial en la coordenada x del cazador será calculada con un número aleatorio al inicio del juego
    //En dicha posición y siempre será 0 ya los cazadores siempre se encuentran en la fila 0 al iniciar el juego
    constructor(x, y=0) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.name = "Hunter";
    }

    //Retorna los movimientos posibles del zorro
    possibleMoves(place=board) {
        //Todos los movimientos posibles permitidos para el cazador

        //1 - (Avanzar) - Diagonal a la derecha
        //2 - (Avanzar) - Diagonal a la izquierda
        const allMoves = [
            {
                x: this.x + 1,
                y: this.y + 1
            },
            {
                x: this.x - 1,
                y: this.y + 1
            }
        ];

        //Para retornar los movimientos válidos
        const validMoves = []

        //Para confirmar que dichos movimientos sean válidos en el tablero
        allMoves.forEach(move => {
            if (place.isValidMove(this, move.x, move.y)) {
                validMoves.push(move)
            }
        });

        //Retorna los movimientos válidos tomando en cuenta si se pueden realizar en el tablero
        return validMoves;
    }
}

//Funcion generateNewBoard genera un nuevo tablero, ya sea por primera vez o haciendo reset
function generateNewBoard() {
    //Para que el zorro no aparezca siempre en la misma posición se establece la misma con un númeroaleatorio
    //inicialmente 8 porque son 8 posiciones en x dentro del tablero
    //
    //Se hace 8 veces para obtener mayor aleatoriedad
    var x_fox;
    for(var i=8; i >= 0; i--) {
        x_fox = Math.floor(Math.random() * 8);
        x_fox = Math.floor(Math.random()*(8-(x_fox-1))+i);
    }

    //Se asegura de que el zorro caiga en alguna casilla negra
    if(x_fox === 1) {x_fox-=1;}
    if(x_fox === 3) {x_fox-=1;}
    if(x_fox === 5) {x_fox-=1;}
    if(x_fox === 7) {x_fox-=1;}

    //Se crea el tablero
    board = new Board([
        new Fox(x_fox,7),
        new Hunter(1, 0),
        new Hunter(3, 0),
        new Hunter(5, 0),
        new Hunter(7, 0)
    ], "Fox");

    updateBoard();
}

function updateBoard() {
    //Quita las fichas
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            document.getElementById(`pos-${i}-${j}`).innerHTML = "<!--Game Piece inside-->";
        }
    }

    //Pone las fichas
    board.pieces.forEach((piece, index) => {
        if(index === 0) {
            document.getElementById(`pos-${piece.x}-${piece.y}`).innerHTML = `
                <!--Game Piece inside-->
                <span id="Fox" class="fox box-border">
                    <img src="./src/img/fox/fox-1.png" alt="fox or zorro" srcset="">
                </span>
            `;
        }
        else {
            document.getElementById(`pos-${piece.x}-${piece.y}`).innerHTML = `
                <!--Game Piece inside-->
                <span id="Hunter-${index}" class="hunter box-border">
                    <img src="./src/img/hunter/hunter-1.png" alt="hunter or cazador" srcset="">
                </span>
            `;
        }
    });

    //Agrega los listeners
    board.pieces.forEach((piece, index)=> {
        if(index !== 0) {
            document.getElementById(`Hunter-${index}`).onclick = () => {
                /*window.alert(`Hunter-${i}: Me has tocado!`);*/
                board.focussedPiece = index;
                console.log("Focus on: " + board.focussedPiece);
            }
        }
    });
}