let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newBtn = document.querySelector("#new-game");
let msgContainer =  document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let turn0 = true; // player0 and playerX

const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if(turn0){
            box.innerText = "0"
            box.style.color = "#BA3365";
            turn0 = false;
        }else{
            box.innerText = "X"
            turn0 = true;
            box.style.color = "#89023E"
        }
        box.disabled = "true";

        checkWinner();
    })
})

const disable = () =>{
    for(box of boxes){
        box.disabled = true;
    }
}

const enable = () =>{
    for(box of boxes){
        box.disabled = false;
        box.innerText = "";
    }
}


const showWinner = (winner) =>{
    msg.innerHTML = `Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disable();
}




const checkWinner = () => {
    for (const pattern of winPatterns) {
        let val1 = boxes[pattern[0]].innerText;
        let val2 = boxes[pattern[1]].innerText;
        let val3 = boxes[pattern[2]].innerText;

        if(val1 != "" && val2 != "" && val3 != ""){
            if(val1 === val2 && val2 === val3){
                console.log("winner" + " " + val1);
                showWinner(val1);
            }
        }
    }
}

const resetGame = () => {
    turn0 = true;
    enable();
    msgContainer.classList.add("hide");
}

newBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);