"use strict"

let sequence = []; /* array to hold the sequence of colors */
let cur_score = 0; /* the user's current score */
let highest_score = 0; /* the user's highest score */
let midOfSeq = false; /* is the user in the middle of a game? */
let combo = 0; /* user's combo */
const startButton = $("#startButton");
const combo_div = $(".combo");
const result_div = $(".result");
const highestScore_div = $(".highScore");
const COLORS = ["green", "yellow", "red", "blue"];
const TIMEOUT = 600; /* time between flashes */


startButton.on("mousedown", () => {
    startButton.css("box-shadow", "none");
})

startButton.on("mouseup", () => {
    startButton.css("box-shadow", "1px 1px 3px 8px rgba(0, 0, 0, 0.8)");
})

startButton.on("click", () => {
    if(midOfSeq) { return; }
    flashSequence();
})

COLORS.forEach((color) => {
  let button = $(`#${color}`);
    button.on("click", function(e) {
        flashButton(button);
        Game(button);
    });
})

function flashButton(button) {
    button.css("opacity", 1);
    setTimeout(() => {
        button.css("opacity", 0.5);
    },TIMEOUT);
    let btnAudio = $(`#${button.attr("id")}Sound`);
    btnAudio.get(0).currentTime = 0;
    /* btnAudio is a jQuery object and thus doesn't know the method play().
     To use the method play() you need to access the element in the jQuery object first.*/
    btnAudio.get(0).play();
}

/* generates a number between 1 and 4 */
function rndChoice() {
  return COLORS[Math.floor(Math.random() * 4)];
}

function flashSequence() {
    sequence.push(rndChoice());
    setBtnsState(true);
    sequence.forEach((item, i) => {
      setTimeout(() => {
            let btnAudio = $(`#${item}Sound`);
            btnAudio.get(0).currentTime = 0;
            flashButton($(`#${item}`));
            if(i == sequence.length - 1) {
                setBtnsState(false);
            }
        }, 800 * (i + 1));
    })
    midOfSeq = true;
}

/* checks the user's progress */
function Game(btn) {
  if (sequence.length === 0) {
    return;
  }
  if (btn.attr("id") === sequence[combo]) {
    combo++;
    combo_div.html(`Combo: ${combo}`);
    if (combo === sequence.length) {
      cur_score++;
      result_div.html(`Score: ${cur_score}`);
      if (cur_score > highest_score) {
        highest_score = cur_score;
        highestScore_div.html(`Highest Score: ${highest_score}`);
      }
      midOfSeq = false;
      combo = 0;
      combo_div.html(`Combo: ${combo}`);
      flashSequence();
    }
  } else {
    cur_score = 0;
    result_div.html(`Score: ${cur_score}`);
    combo = 0;
    combo_div.html(`Combo: ${combo}`);
    sequence = [];
    midOfSeq = false;
  }
}

function setBtnsState(state) {
    COLORS.forEach((color) => {
      let b = $(`#${color}`);
      b.attr("disabled", state);
    })
}