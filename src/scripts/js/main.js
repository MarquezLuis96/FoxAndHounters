function setuptListeners() {

    for(let i=0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            document.getElementById(`pos-${i}-${j}`).onclick = () => {
                /*window.alert(`Has tocado el tile: (x:${i};y:${j})`);*/
                let obj = board.focussedPiece;
                if((board.pieces[obj] !== null) && ((board.pieces[obj].x !== i) && (board.pieces[obj].y !== j))) {
                    let x = board.pieces[obj].x;
                    let y = board.pieces[obj].y;
                    if(board.pieces[obj].moveTo(i, j)) {
                        updateBoard();
                        mainAILoop();
                    }
                    else {
                        window.alert("No puedes realizar ese movimiento");
                    }
                }
            }
        }
    }

    for(let i=1; i < 5; i++) {
        document.getElementById(`Hunter-${i}`).onclick = () => {
            /*window.alert(`Hunter-${i}: Me has tocado!`);*/
            board.focussedPiece = i;
            console.log(board.focussedPiece);
        }
    }
}

function startup() {
    console.log("Ha presionado startup");
    generateNewBoard();
    console.log("Se ha generado un tablero, el tablero es: \n");
    console.log(board.pieces[0]);
    
    console.log("MainAILoop");
    setTimeout(mainAILoop(), 100000);
    console.log("Tablero luego de MainAILoop:");
    console.log(board.pieces[0]);

    setTimeout(setuptListeners(), 100000);
    console.log("Se han establecido los listeners");
}

window.onload = startup();