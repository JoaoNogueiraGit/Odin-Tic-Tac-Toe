
//Factory para criar player
const Player = (name, marker) => {

    const getName = () => name;
    const getMarker = () => marker; 

    return { getName, getMarker };
};


// Modulo para gerir o estado do tabuleiro
const GameBoardController = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

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
            gameboard[i] = "";
        }
    }

    return { setField, getField, reset};

})();

// Modulo para gerir ações do jogo
const gameController = (() => {

    let activePlayer;
    let p1, p2;
    let gameStarted = false;

    const changePlayer = () => {
        activePlayer = activePlayer === p1 ? p2 : p1;
    };

    const startGame = (name1, name2) => {
        if(name1 === "" || name2 === "") return false;

        p1 = Player(name1, "X");
        p2 = Player(name2, "O");
        activePlayer = p1;
        gameStarted = true;

        return true;
    };

    const getGameStarted = () => gameStarted

    const PlayRound = (index) => {
        if(!gameStarted) return;

        if(GameBoardController.getField(index) !== ""){
            return "You cannot play there 😠!";
            return;
        }

        GameBoardController.setField(index, activePlayer.getMarker());

        const winner = CheckWin()
        if(winner){
            gameStarted = false;
            return `The winner is ${activePlayer.getName()}!`;
        }

        if(isBoardFull()){
            gameStarted = false;
            return "It's a Tie!";
        }

        changePlayer();
        return `It's ${activePlayer.getName()}'s (${activePlayer.getMarker()}) turn`;
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
    };

    const iswinner = () => {
        const w = CheckWin()
        if(w !== null){
            gameStarted = false;
            return true;
        }

        return false;
    }

    const isBoardFull = () => {
        for(let i = 0; i < 9; i++){
            if(GameBoardController.getField(i) === "")
                return false
        }
        return true;
    };

    return { startGame, getGameStarted, PlayRound, getActivePlayer: () => activePlayer, iswinner };
})();



// modulo para gerir as alteraões na interface do utilizador
const DOMController = (() => {
    const fields = document.querySelectorAll(".fieldBtn");
    const resetBtn = document.querySelector("#resetBtn");
    const startBtn = document.querySelector("#startbtn");
    const p1Name = document.querySelector("#p1name");
    const p2Name = document.querySelector("#p2name");
    const result = document.querySelector("#result");

   const init = () => {
        startBtn.addEventListener("click", () => {
            const sucess = gameController.startGame(p1Name.value, p2Name.value);
            if(sucess) {
                result.textContent = "Game started"
            }
            else {
                result.textContent = "Enter names for both players!"
            }
        });
   }

    const updateScreen = (message) => {
        fields.forEach((btn, index) => {
            btn.textContent = GameBoardController.getField(index);
        });
        if(message){
            result.textContent = message;
        }
    };

    const initEventListeners = () => {
        fields.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                if(gameController.getGameStarted()){
                    const index = e.target.dataset.index;
                    const statusMessage = gameController.PlayRound(index);
                    updateScreen(statusMessage);
                }
                else {
                    if (gameController.iswinner()) {
                        result.textContent = "The game is over! Reset to play again.";
                    } 
                    else {
                        result.textContent = "Start the game first!";
                    }
                }
            });
        });
    };

    const resetBoard = () => {
        resetBtn.addEventListener("click", () => {
                fields.forEach((btn) => {
                btn.textContent = "";
                GameBoardController.reset();
            });
        });
    };

    init();
    initEventListeners();
    resetBoard();

    return { resetBoard, updateScreen };
})();

