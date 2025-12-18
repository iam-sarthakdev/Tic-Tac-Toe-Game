let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newBtn = document.querySelector("#new-game");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let turnIndicator = document.querySelector("#current-turn");
let scoreXEl = document.querySelector("#score-x");
let scoreOEl = document.querySelector("#score-o");

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let turn0 = true; // User (O) starts first
let count = 0; // To track draw
let scoreX = 0; // Computer Score
let scoreO = 0; // User Score
let isComputerTurn = false;

const updateTurnIndicator = () => {
    if (turn0) {
        turnIndicator.innerText = "You (O)";
        turnIndicator.style.color = "#e879f9";
    } else {
        turnIndicator.innerText = "Computer (X)";
        turnIndicator.style.color = "#3b82f6";
    }
};

// Initial turn set
if (turnIndicator) updateTurnIndicator();

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (isComputerTurn) return; // Prevent user click during computer turn

        // User Move (O)
        if (turn0) {
            makeMove(box, "O");

            // Check win/draw after user move
            let isEnd = checkGameEnd();

            if (!isEnd) {
                // Trigger Computer Move
                turn0 = false;
                isComputerTurn = true;
                updateTurnIndicator();
                setTimeout(computerMove, 600); // 600ms delay for realism
            }
        }
    });
});

const makeMove = (box, player) => {
    box.innerText = player;
    box.style.color = player === "O" ? "#BA3365" : "#89023E"; // Hooks for CSS
    if (player === "X") box.classList.add("x"); // Extra hook for safety
    box.disabled = true;
    count++;
};

const computerMove = () => {
    // 1. Try to Win
    // 2. Block User
    // 3. Random

    let moveIndex = -1;

    // Helper to find best move
    moveIndex = findBestMove("X"); // Try win
    if (moveIndex === -1) moveIndex = findBestMove("O"); // Block user

    if (moveIndex === -1) {
        // Random available move
        let available = [];
        boxes.forEach((box, index) => {
            if (!box.disabled) available.push(index);
        });

        if (available.length > 0) {
            let rand = Math.floor(Math.random() * available.length);
            moveIndex = available[rand];
        }
    }

    if (moveIndex !== -1) {
        let box = boxes[moveIndex];
        makeMove(box, "X");

        let isEnd = checkGameEnd();
        if (!isEnd) {
            turn0 = true;
            isComputerTurn = false;
            updateTurnIndicator();
        }
    }
};

const findBestMove = (player) => {
    for (const pattern of winPatterns) {
        let [a, b, c] = pattern;
        let pA = boxes[a].innerText;
        let pB = boxes[b].innerText;
        let pC = boxes[c].innerText;

        // Check if 2 are filled by 'player' and 1 is empty
        if (pA === player && pB === player && pC === "") return c;
        if (pA === player && pC === player && pB === "") return b;
        if (pB === player && pC === player && pA === "") return a;
    }
    return -1;
};

const checkGameEnd = () => {
    let isWinner = checkWinner();
    if (isWinner) return true;

    if (count === 9) {
        gameDraw();
        return true;
    }
    return false;
};

const gameDraw = () => {
    msg.innerText = `Game was a Draw.`;
    msgContainer.classList.remove("hide");
    disable();
};

const disable = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enable = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("x"); // Remove class hook
    }
};

const showWinner = (winner) => {
    if (winner === "O") {
        msg.innerText = `You Won!`;
        scoreO++;
        if (scoreOEl) scoreOEl.innerText = scoreO;
    } else {
        msg.innerText = `Computer Won!`;
        scoreX++;
        if (scoreXEl) scoreXEl.innerText = scoreX;
    }
    msgContainer.classList.remove("hide");
    disable();
};

const checkWinner = () => {
    for (const pattern of winPatterns) {
        let val1 = boxes[pattern[0]].innerText;
        let val2 = boxes[pattern[1]].innerText;
        let val3 = boxes[pattern[2]].innerText;

        if (val1 != "" && val2 != "" && val3 != "") {
            if (val1 === val2 && val2 === val3) {
                showWinner(val1);
                return true;
            }
        }
    }
    return false;
};

const resetGame = () => {
    turn0 = true;
    count = 0;
    isComputerTurn = false;
    enable();
    msgContainer.classList.add("hide");
    updateTurnIndicator();
};

newBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
