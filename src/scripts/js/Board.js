let board;

class Board {
    constructor(pieces, firstTurn='Fox') {
        this.pieces = pieces;
        this.currentTurn = firstTurn;
        this.focussedPiece = null;
        this.gameover = false;
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

            if(place === board) {
                //Se actualiza la tabla
                updateBoard();
                //Se verifica si alguna de las piezas llegaron a la condición de victoria
                board.checkVictory();

            }
        }
        else {
            //Notifica que el movimiento es inválido
            notify("Warn", "Invalid Move");
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
    var x_fox
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
    //
}