
//Factory para criar player
const Player = (name, marker) => {

    const getName = () => name;
    const getMarker = () => marker;
    const setName = (_name) => {name = _name}
    const setMarker = (_marker) => {marker = _marker} 

    return {getName, getMarker};
};

const p1 = Player("Joao", "X");
const p2 = Player("Oaoj", "O");

// Modulo para gerir o estado do tabuleiro
const GameBoardController = (() => {
    let gameboard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

    const setField = (index, marker) => {
        if(index > gameboard.length) return;
            gameboard[index] = marker;
    };

    const getField = (index) => {
        if(index > gameboard.length) return;
            return gameboard[index];
    }

    const reset = () => {
        for(let i = 0; i < gameboard.length; i++){
            gameboard[i] = " ";
        }
    }

    return { setField, getField, reset};

})();

// Modulo para gerir ações do jogo
const gameController = (() => {

    let activePlayer = p1;

    const changePlayer = () => {
        activePlayer = activePlayer === p1 ? p2 : p1;
    }

    const PlayRound = (index) => {
        if(GameBoardController.getField(index) !== " "){
            console.log("ERRO: Não pode jogar num espaço que já esteja ocupado!");
            return;
        }

        GameBoardController.setField(index, activePlayer.getMarker());

        const winner = CheckWin()
        if(winner){
            console.log(`O vencedor é {activePlayer.getName()}!`);
        }

        if(isBoardFull()){
            console.log("Empate!");
        }

        changePlayer();
    };

    const CheckWin = () => {
        const winCases = [[0, 1, 2], [3, 4, 5], [6, 7, 8],
                          [0, 3, 6], [1, 4, 7], [2, 5, 8],
                          [0, 4, 8], [2, 4, 6]];
        
        for(let match of winCases){

            let [a, b, c] = match;
            const markA = GameBoardController.getField(a);
            const markB = GameBoardController.getField(b);
            const markC = GameBoardController.getField(c);
            if(markA !== " " && markA === markB && markA === markC){
                return markA;
            }
        }

        return null;
    }

    const isBoardFull = () => {
        for(let i = 0; i < 9; i++){
            if(GameBoardController.getField(i) === " ")
                return false
        }
        return true;
    }

    return { PlayRound, getActivePlayer: () => activePlayer }
})();

// modulo para gerir as alteraões na interface do utilizador
const DOMController = (() => {
    const fields = document.querySelectorAll(".fieldBtn");
    const resetBtn = document.querySelector("#resetBtn");
    const p1Name = document.querySelector("#p1name");
    const p2Name = document.querySelector("#p2name");
    const result = document.querySelector("#result");

    const drawMarker = () => {
        fields.forEach((btn, index) => {
            btn.textContent = GameBoardController.getField(index);
        });
    };

    const initEventListeners = () => {
        fields.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const index = e.target.dataset.index;
                gameController.PlayRound(index);
                drawMarker();
            });
        });
    };

    const resetBoard = () => {
        resetBtn.addEventListener("click", () => {
                fields.forEach((btn) => {
                btn.textContent = " ";
                GameBoardController.reset();
            });
        });
    }


    initEventListeners();
    resetBoard();

    return { resetBoard, drawMarker}
})();

// Funções para testes da logica do jogo
// const testGame = (moves) => {
//     console.log("--- Iniciando Teste de Jogo ---");
//     GameBoardController.reset(); // Limpa o tabuleiro antes de começar

//     moves.forEach((moveIndex, i) => {
//         const currentPlayer = gameController.getActivePlayer().getName();
//         console.log(`Ronda ${i + 1}: ${currentPlayer} joga na posição ${moveIndex}`);
        
//         gameController.PlayRound(moveIndex);
        
//         // Vamos imprimir o tabuleiro de forma visual na consola
//         renderConsoleBoard(); 
//     });
// };

// // Função auxiliar para veres o tabuleiro na consola
// const renderConsoleBoard = () => {
//     const b = [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => GameBoardController.getField(i));
//     console.log(`
//       ${b[0]} | ${b[1]} | ${b[2]}
//      -----------
//       ${b[3]} | ${b[4]} | ${b[5]}
//      -----------
//       ${b[6]} | ${b[7]} | ${b[8]}
//     `);
// };

// testGame([0, 0])