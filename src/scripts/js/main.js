function startup() {
    console.log("Ha presionado startup");
    generateNewBoard();
    console.log("Se ha generado un tablero, el tablero es: \n");
    console.log(board.pieces[0]);
    setTimeout(mainAILoop(), 100000);
    mainAILoop();
    console.log("MainAILoop");
    console.log("Tablero luego de MainAILoop:");
    console.log(board.pieces[0]);
}

window.onload = startup();