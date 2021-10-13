 "use strict";

jQuery(function() {
    let btn = document.getElementById("lookUp");

    let pic = $("#pkm-img");
    let stats = [$(".hp"), $(".atk"), $(".def"), $(".spa"), $(".spd"), $(".speed")];
    let name = $(".name");
    let abilities = $(".abilities");
    let types = $(".types");
    let weight = $(".weight");
    let dexNum = $(".dex-num");
    let attributes = [stats, name, abilities, types, weight, dexNum];

    let question = $("#question");
    let input = $("#user-answer");
    let answer_btn = $("#submit-btn");
    let answer = $("#answer"); // Correct or Incorrect

    let qNum = 0;
    let pkmData = null;
    let pkmStatNum = 0;
    let pkmMove = null;

    let answerHandler;

    /* To get a random move use the API https://pokeapi.co/api/v2/move/randomNumber/ where randomNumber <= 621 */

    const questionType = {
        STATS: 1,
        NAME: 2,
        ABILITIES: 3,
        TYPES: 4,
        WEIGHT: 5,
        DEXNUM: 6,
        MOVES: 7
    }
    
    btn.addEventListener("click", (e) => {
        e.preventDefault();
        try {
            const rnd = Math.ceil(Math.random() * 898);
            fetch(`https://pokeapi.co/api/v2/pokemon/${rnd}`)
                .then(response => response.json())
                .then(data => {
                    pkmData = data;

                    if(data.moves.length === 0) { qNum = Math.ceil(Math.random() * 6); }
                    else { qNum = Math.ceil(Math.random() * 7); }
                    
                    answerHandler = new AnswerHandler(data);
                    displayPokemon(data, qNum);
                    switch(qNum) {
                        case questionType.STATS: 
                            let statNum = Math.floor(Math.random() * 6);
                            pkmStatNum = statNum;
                            question.html(`What is ${toCapitalLetter(data.name)}'s base ${toCapitalLetter(data.stats[statNum].stat.name)} stat?`);
                            answerHandler.setStatNum(statNum);
                            break;

                        case questionType.NAME:
                            question.html(`Who's that Pokemon?`);
                            break;

                        case questionType.ABILITIES:
                            let abilityQuestion = Math.ceil(Math.random() * 2);
                            answerHandler.setAbilityQuestionNum(abilityQuestion);
                            if(abilityQuestion === 1) { question.html(`Name one ability of ${toCapitalLetter(data.name)}.`); }
                            else {
                                let abilityNum = Math.floor(Math.random() * data.abilities.length);
                                answerHandler.setAbilityNum(abilityNum);
                                question.html(`Is ${toCapitalLetter(data.abilities[abilityNum].ability.name)} ${toCapitalLetter(data.name)}'s hidden ability? (Yes/No)`);
                            }
                            break;

                        case questionType.TYPES:
                            question.html(`What is ${toCapitalLetter(data.name)}'s type? (Type1/Type2)`);
                            break;

                        case questionType.WEIGHT:
                            question.html(`What is ${toCapitalLetter(data.name)}'s weight in kg?`);
                            break;

                        case questionType.DEXNUM:
                            question.html(`What is ${toCapitalLetter(data.name)}'s national Pokedex number?`);
                            break;

                        case questionType.MOVES:
                            let rndMove = Math.ceil(Math.random() * 621);
                            fetch(`https://pokeapi.co/api/v2/move/${rndMove}/`)
                                .then(response => response.json())
                                .then(moveData => { 
                                    pkmMove = moveData;
                                    question.html(`Can ${toCapitalLetter(pkmData.name)} learn the move ${toCapitalLetter(pkmMove.name)}? (Yes/No)`);
                                })   
                            break;
                        default: question.html("");
                    }
                    input.get(0).value = "";
                    answer.html("");
                })
        }
        catch(error) {
            info.item(0).innerHTML = "The Pokemon you chose doesn't exist.";
            for(let i = 1; i < info.length; i++) {
                info.item(i).innerHTML = "";
            }
        }
    })
    
    function toCapitalLetter(str) {
        return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
    }

    function displayPokemon(data, attrToHide) {
        pic.get(0).src = data.sprites.front_default;

        stats.forEach((stat, index) => {
            stat.html(`${toCapitalLetter(data.stats[index].stat.name)}: ${data.stats[index].base_stat}`);
        })

        // stat.html(`${toCapitalLetter(data.stats[pkmStatNum].stat.name)}: ${data.stats[pkmStatNum].base_stat}`);
        
        name.html(data.forms[0].name.charAt(0).toUpperCase() + data.forms[0].name.slice(1));

        abilities.html("");
        for(let i = 0; i < data.abilities.length; i++) {
            abilities.html(`${abilities.html()} ${toCapitalLetter(data.abilities[i].ability.name)}, `);
        }
        abilities.html(`Abilities: ${abilities.html().substring(0, abilities.get(0).innerHTML.length - 2)}`);

        types.html("");
        for (let i = 0; i < data.types.length; i++) {
            types.html(`${types.html()}${toCapitalLetter(data.types[i].type.name)}/`);
        }
        types.html(`Type: ${types.html().substring(0, types.get(0).innerHTML.length - 1)}`);

        weight.html(`Weight: ${data.weight/10} kg`);

        dexNum.html(`Pokedex number: ${data.id}`)
        if(attrToHide !== 7) {
            if(attrToHide === 1) {
                setTimeout(() => {
                    stats[pkmStatNum].html(`${toCapitalLetter(data.stats[pkmStatNum].stat.name)}: ???`);
                }, 100);
            }
            else {
                attributes[attrToHide - 1].html("???");
            }
        }

        // if(attrToHide === 1) { stat.html(`${toCapitalLetter(data.stats[pkmStatNum].stat.name)}: ???`); }
    }

    answer_btn.on("click", (e) => {
        let userAnswer = input.get(0).value;
        let userCorrect = false;
        switch(qNum) {
            case questionType.STATS:
                if(answerHandler.checkStatQuestion(userAnswer)) { userCorrect = true; }
                break;

            case questionType.NAME:
                if(answerHandler.checkNameQuestion(userAnswer)) { userCorrect = true; }
                break;

            case questionType.ABILITIES:
                if(answerHandler.getAbilityQuestionNum() === 1) {
                    if(answerHandler.checkAbilityQuestion(userAnswer)) { userCorrect = true; }
                }
                else { if(answerHandler.checkHiddenAbilityQuestion(userAnswer)) { userCorrect = true; }}
                break;

            case questionType.TYPES:
                if(answerHandler.checkTypeQuestion(userAnswer)) { userCorrect = true; }
                break;

            case questionType.WEIGHT:
                if(answerHandler.checkWeightQuestion(userAnswer)) { userCorrect = true; }
                break;
            
            case questionType.DEXNUM:
                if(answerHandler.checkDexNumQuestion(userAnswer)) { userCorrect = true; }
                break;

            case questionType.MOVES:
                if(answerHandler.checkMoveQuestion(userAnswer, pkmMove.name)) { userCorrect = true; }
                break;

            default: console.log("Something went wrong");
        }
        if(userCorrect) {
            answer.html("Correct!");
            answer.css({ color: "green" });
        }
        else {
            answer.html("Wrong!");
            answer.css({ color: "red" });
        }
        displayPokemon(pkmData, 7);
    })
})
    