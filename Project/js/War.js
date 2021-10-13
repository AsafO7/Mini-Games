"use strict"

const playerCard = $(".playcard1");
const comCard = $(".playcard2");
const pCards = $("#player-cards");
const cCards = $("#com-cards");
const message = $("#comment");
const cards = ["14C", "02C", "03C", "04C", "05C", "06C", "07C", "08C", "09C", "10C", "11C", "12C", "13C", "14D", "02D", "03D", "04D", "05D", "06D", "07D", "08D","09D", "10D", "11D", "12D", "13D", "14H", "02H", "03H", "04H", "05H", "06H", "07H", "08H", "09H", "10H", "11H", "12H", "13H", "14S", "02S", "03S", "04S", "05S","06S", "07S", "08S", "09S", "10S", "11S", "12S", "13S"];
let midGame = false;
let warSequence = false;

let deck;
let deck1;
let deck2;
let deck1Index = 0;
let deck2Index = 0;
let indexBeforeWar1 = 0;
let indexBeforeWar2 = 0;
let lastCardReceived1; // To know when we used every card in the deck.
let lastCardReceived2;
let numOfWarsInARow = 0;
let winner;
let warCard1Flipped = false;
let warCard2Flipped = false;
let warCard3Flipped = false;
let warCard4Flipped = false;


$("#play-button").on("mousedown", () => {
    $("#play-button").css("box-shadow", "none");
})

$("#play-button").on("mouseup", () => {
    $("#play-button").css("box-shadow", "1px 1px 3px 3px rgba(0, 0, 0, 0.8)");
})

$("#play-button").on("click", () => {
    if(!midGame) { startGame(); }
    play();
})

function startGame() {
    midGame = true;
    deck = shuffleArray(cards);
    deck1 = deck.slice(0, 26);
    deck2 = deck.slice(26,52);
    // deck1 = [];
    // deck2 = [];
    // deck1.unshift("08D");
    // deck2.unshift("09S");
    // deck1.unshift("09D");
    // deck2.unshift("09S");
    // deck1.unshift("09D");
    // deck2.unshift("09S");
    // deck1.unshift("09D");
    // deck2.unshift("09S");
    // deck1.unshift("09D");
    // deck2.unshift("09S");
    // deck1.unshift("09D");
    // deck2.unshift("09S");
    // deck1.unshift("09D");
    // deck2.unshift("09S");
    updateCardsNumber();
    deck1Index = 0;
    deck2Index = 0;
}

function play() {
    $("#play-button").attr("disabled", true);
    // if(deck1Index >= deck1.length || deck2Index >= deck2.length) { 
        if(deck1Index >= deck1.length) {
            deck1Index = 0;
            shuffleArray(deck1);
        }
        if(deck2Index >= deck2.length) {
            deck2Index = 0;
            shuffleArray(deck2);
        }
    //  }
    if(deck1.length != 1 || !warSequence) {
        flipCard(playerCard, deck1[deck1Index]);
    }
    if(deck2.length != 1 || !warSequence) {
        flipCard(comCard, deck2[deck2Index]);
    }
    
    
    
    let card1 = getCardName(deck1[deck1Index]);
    let card2 = getCardName(deck2[deck2Index]);
    winner = checkWinner(deck1[deck1Index], deck2[deck2Index]);
    if(winner == 1) {
        if(warSequence) {
            switch(deck2.length) {
                case 1: deck1.push(deck2.shift());
                        break;
                case 2: for(let i = 0; i < 2; i++) {
                        deck1.push(deck2.shift());
                    }
                    break;
                case 3: for(let i = 0; i < 3; i++) {
                        deck1.push(deck2.shift());
                    }
                    break;
                default: if(deck2.length < 4 * numOfWarsInARow) {
                            for(let i = 0; i < deck2.length; i++) {
                                deck1.push(deck2.shift());
                            }
                        }
                        else {
                            let cardsWon = deck2.splice(indexBeforeWar2, 4 * numOfWarsInARow);
                            for(let i = 0; i < cardsWon.length; i++) {
                                deck1.push(cardsWon[i]);
                            }
                        }
                        break;
            }
            warSequence = false;
            numOfWarsInARow = 0;
            deck2Index = indexBeforeWar2;
            setTimeout(() => {
                returnWarCards(1);
                returnWarCards(2);
                playerCard.css({zIndex: "0"});
                comCard.css({zIndex: "0"});
            }, 700);
        }
        else {
            lastCardReceived1 = deck2[deck2Index];
            deck1.push(lastCardReceived1);
            deck2.splice(deck2Index, 1);
        }
        message.text(card1 + " beats " + card2);
        setTimeout(() => {
            flipCard(playerCard, deck1[deck1Index]);
            flipCard(comCard, lastCardReceived1);
            deck1Index++;
            if(deck2.length == 0) { 
                message.text("You win!");
                midGame = false;
            }
            $("#play-button").attr("disabled", false);
            
        }, 2000);
    }
    else if(winner == 2) {
        if(warSequence) {
            switch(deck1.length) {
                case 1: deck2.push(deck1.shift());
                        break;
                case 2: for(let i = 0; i < 2; i++) {
                        deck2.push(deck1.shift());
                    }
                    break;
                case 3: for(let i = 0; i < 3; i++) {
                        deck2.push(deck1.shift());
                    }
                    break;
                default: if(deck1.length < 4 * numOfWarsInARow) {
                            for(let i = 0; i < deck1.length; i++) {
                                deck2.push(deck1.shift());
                            }
                        }
                        else {
                            let cardsWon = deck1.splice(indexBeforeWar1, 4 * numOfWarsInARow);
                            for(let i = 0; i < cardsWon.length; i++) {
                                deck2.push(cardsWon[i]);
                            }
                        }
                        break;
            }
            warSequence = false;
            numOfWarsInARow = 0;
            deck1Index = indexBeforeWar1;
            setTimeout(() => {
                returnWarCards(1);
                returnWarCards(2);
                playerCard.css({zIndex: "0"});
                comCard.css({zIndex: "0"});
            }, 700);
        }
        else {
            lastCardReceived2 = deck1[deck1Index];
            deck2.push(lastCardReceived2);
            deck1.splice(deck1Index, 1);
        }
        message.text(card2 + " beats " + card1);
        setTimeout(() => {
            flipCard(playerCard, lastCardReceived2);
            flipCard(comCard, deck2[deck2Index]);
            deck2Index++;
            if(deck1.length == 0) { 
                message.text("The computer wins!");
                midGame = false;
            }
            $("#play-button").attr("disabled", false);
        }, 2000);
    }
    else if(winner == 3) {
        warSequence = true;
        numOfWarsInARow++;
        message.text("Draw! Time for War!");
        if(numOfWarsInARow == 1) {
            indexBeforeWar1 = deck1Index;
            indexBeforeWar2 = deck2Index;
        }
        warAnimationChooser(1);
        warAnimationChooser(2);
        setTimeout(() => {
            /* Flip the cards that started the war */
            if(deck1.length > 2) {
                flipCard(playerCard, deck1[deck1Index]);
            }
            if(deck2.length > 2) {
                flipCard(comCard, deck2[deck2Index]);
            }
        }, 3000);
        setTimeout(() => {
            playerCard.css({zIndex: "1"});
            comCard.css({zIndex: "1"});
            play();
        }, 3500);
    }
    updateCardsNumber();
}

/* Draws a card face-down for the war sequence */
function drawBackCard(playerSide, comSide, time) {
    setTimeout(() => {
        if(playerSide != 0) {
            flipAnimation(playerSide, 1);
        }
        if(comSide != 0) {
            flipAnimation(comSide, 2);
        }
    },time);
}

/* Decides how many backcards need the return animation and animates them */
function returnWarCards(deckNum) {
    if(deckNum == 1) {
        // switch(deck1.length) {
        //     case 1: break;
        //     case 2: break;
        //     case 3: returnBackCard($(".warCard1"), 0);
        //             break;
        //     default: returnBackCard($(".warCard1"), 0);
        //             returnBackCard($(".warCard2"), 0);
        //             break;
        // }
        if(warCard1Flipped) { 
            returnBackCard($(".warCard1"), 0);
            warCard1Flipped = false;
        }
        if(warCard2Flipped) { 
            returnBackCard($(".warCard2"), 0);
            warCard2Flipped = false;
        }
    }
    else {
        // switch(deck2.length) {
        //     case 1: break;
        //     case 2: break;
        //     case 3: returnBackCard(0, $(".warCard3"));
        //             break;
        //     default: returnBackCard(0, $(".warCard3"));
        //             returnBackCard(0, $(".warCard4"));
        //             break;
        // }
        if(warCard3Flipped) { 
            returnBackCard($(".warCard3"), 0);
            warCard3Flipped = false;
        }
        if(warCard4Flipped) { 
            returnBackCard($(".warCard4"), 0);
            warCard4Flipped = false;
        }
    }
}

/* Animates the return of a face-down war sequence card */
function returnBackCard (playerSide, comSide) {
    if(playerSide != 0) {
        unflipAnimation(playerSide, 1);
    }
    if(comSide != 0) {
        unflipAnimation(comSide, 2);
    }
}

/* Adds animation for the war sequence */
function flipAnimation(element, flipNum) {
    element.css({animationName: "flip" + flipNum,
                animationDuration: "1s",
                animationIterationCount: "1",
                animationDirection: "normal",
                animationFillMode: "forwards"
        });
}

/* Adds animation for the war sequence */
function unflipAnimation(element, flipNum) {
    element.css({animationName: "flip-remove" + flipNum,
                animationDuration: "1s",
                animationIterationCount: "1",
                animationDirection: "normal",
                animationFillMode: "forwards"
        });
}

/* Checks which value on a card is the highest */
function checkWinner(card1, card2) {
    let value1 = parseInt(card1.substring(0,2));
    let value2 = parseInt(card2.substring(0,2));
    if(value1 > value2) { return 1; }
    else if(value2 > value1) { return 2; }
    return 3;
}

/* Flips a card to the opposite direction, face-up or face-down */
function flipCard(element, card) {
    element.toggleClass("flip");
    if(element.hasClass("flip")) {
        element.css({
            background: "url(../War/cards/" + card + ".png)",
            backgroundSize: "contain"
        });
    }
    else {
        element.css({
            background: "url(../War/cards/backcard.png)",
            backgroundSize: "contain"
        });
    }   
}

/* Decides how many backcards to flip and flips them */
function warAnimationChooser(deckNum) {
    if(deckNum == 1) {
        switch(deck1.length) {
            case 1: break;
            case 2: deck1Index++;
                    break;
            case 3: drawBackCard($(".warCard1"), 0, 1500);
                    deck1Index = deck1Index + 2;
                    warCard1Flipped = true;
                    break;
            default: drawBackCard($(".warCard1"), 0, 1500);
                    drawBackCard($(".warCard2"), 0, 2500);
                    deck1Index = deck1Index + 3;
                    warCard1Flipped = true;
                    warCard2Flipped = true;
                    break;
        }
    }
    else {
        switch(deck2.length) {
            case 1: break;
            case 2: deck2Index++;
                    break;
            case 3: drawBackCard(0, $(".warCard3"), 1500);
                    deck2Index = deck2Index + 2;
                    warCard3Flipped = true;
                    break;
            default: drawBackCard(0, $(".warCard3"), 1500);
                    drawBackCard(0, $(".warCard4"), 2500);
                    deck2Index = deck2Index + 3;
                    warCard3Flipped = true;
                    warCard4Flipped = true;
                    break;
        }
    } 
}

/* Shuffles the members of an array */
function shuffleArray(array) {
  let arr = array;
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

/* Updates the number of cards displayed on the screen for each player */
function updateCardsNumber() {
    pCards.text(`Cards: ${deck1.length}`);
    cCards.text(`Cards: ${deck2.length}`);
}

/* Returns the name of a card */
function getCardName(card) {
    if(parseInt(card.substring(0,2)) < 10) {
        return card.substring(1,2);
    }
    switch(parseInt(card.substring(0,2))) {
        case 11: return "J";
        case 12: return "Q";
        case 13: return "K";
        case 14: return "A";
    }
    return "10";
}