function mainAILoop() {
    if(board.gameover) {
        return;
    }
    nextAIMove(false);
}

function nextAIMove() {
    if(board.currentTurn === "Fox") {
        foxIA.makeMove();
    }
}

//Superclase
class IA {
    constructor() {
        this.name = ""
    }

    makeMove() {
        //Profundidad del algoritmo
        const depth = 6;
        if(isNaN(depth) || Number(depth) < 1 || Number(depth) > 6) {
            window.alert("Error: La profundidad de algoritmo es inválida");
            return;
        } else {
            this.evaluateMinimax(board, depth, true);
        }
    }

    terminalScore(boardScore) {
        const victory = board.checkVictory(false);
        if(victory === "") {
            return 0;
        }
        if (victory === this.name) {
            return 100;
        } else {
            return -100;
        }
    }

    cloneBoard(boardState) {
        const pieces = [];
        boardState.pieces.forEach(piece => {
            if(piece.name === "Fox") {
                pieces.push(new Fox(piece.x, piece.y));
            } else if( piece.name === "Hunter") {
                pieces.push(new Hunter(piece.x, piece.y));
            }
        });
        return new Board(pieces, boardState.currentTurn);
    }

    average(scores) {
        let total = 0;
        scores.forEach(score => {
            total += score;
        });
        return total/scores.length;
    }

    evaluateMinimax(currentBoard, depth, root=false) {
        const pieces = [];
        currentBoard.pieces.forEach(piece => {
            if(piece.name === currentBoard.currentTurn) {
                pieces.push(piece);
            }
        });
        if(root) {
            let highestSoFar = -1000;
            let bestPiece = null;
            let bestMove = null;
            let averageScoreOfBestMove;
            pieces.forEach(piece => {
                const moves = piece.possibleMoves(currentBoard);
                moves.forEach(move => {
                    const newBoard = this.cloneBoard(currentBoard);
                    newBoard.pieceAt(piece.x, piece.y).moveTo(move.x, move.y, newBoard);
                    const scores = this.evaluateMinimax(newBoard, depth - 1 );

                    if(scores.lowest > highestSoFar) {
                        highestSoFar = scores.lowest;
                        bestPiece = piece;
                        bestMove = move;
                    }
                });
            });
            bestPiece.moveTo(bestMove.x, bestMove.y);
            return;
        } else if(depth === 0 || this.terminalScore(currentBoard) !== 0) {
            return {
                lowest: this.evaluateScore(currentBoard),
                all: [this.evaluateScore(currentBoard)]
            }
        } else {
            let lowestScore = 1000;
            const allScores = [];
            pieces.forEach(piece => {
                const moves = piece.possibleMoves(currentBoard);
                moves.forEach(move => {
                    const newBoard = this.cloneBoard(currentBoard);
                    newBoard.pieceAt(piece.x, piece.y).moveTo(move.x, move.y, newBoard);
                    const scores = this.evaluateMinimax(newBoard, depth - 1);
                    if(scores.lowest < lowestScore) {
                        lowestScore = scores.lowest;
                    }
                    allScores.push(...scores.all)
                });
            });
            return {
                lowest: lowestScore,
                all: allScores
            }
        }
    }
}

class FoxIA extends IA {
    constructor() {
        super();
        this.name = "Fox";
    }

    evaluateScore(boardState) {
        let score = 0;
        //Se motiva a que el zorro se mueva al otro lado del tablero
        boardState.pieces.forEach(piece => {
            if(piece.name === "Fox") {
                score = -piece.y * 2;
            }
        });
        //Se hace que perder no sea una posibilidad
        //Toma como prioridad el hecho de ganar
        score += this.terminalScore(boardState);
        return score;
    }
}

const foxIA = new FoxIA();