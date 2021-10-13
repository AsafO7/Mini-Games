"use-strict"

class AnswerHandler {
    constructor(data) {
        this.data = data;
        this.statNum = null;
        this.abilityQuestionNum = null;
        this.abilityNum = null;
    }

    getAbilityQuestionNum() { return this.abilityQuestionNum; }

    setStatNum(sNum) { this.statNum = sNum; }

    setAbilityQuestionNum(num) { this.abilityQuestionNum = num; }

    setAbilityNum(num) { this.abilityNum = num; }

    checkStatQuestion(answer) {
        if((this.data.stats[this.statNum].base_stat).toString() === answer) { return true; }
        return false;
    }

    checkNameQuestion(answer) {
        if(this.data.name === answer.toLowerCase()) { return true; }
        return false;
    }

    checkAbilityQuestion(answer) {
        let ans = false;
        this.data.abilities.forEach(ability => {
            if(ability.ability.name.replace('-', ' ') === (answer.toLowerCase()).replace('-', ' ')) { ans = true; }
        });
        return ans;
    }

    checkHiddenAbilityQuestion(answer) {
        if(answer.toLowerCase() !== "yes" && answer.toLowerCase() !== "no") { return false; }
        if(answer.toLowerCase() === "yes" && this.data.abilities[this.abilityNum].is_hidden === true) { return true; }
        if(answer.toLowerCase() === "no" && this.data.abilities[this.abilityNum].is_hidden === false) { return true; }
        return false;
    }

    checkTypeQuestion(answer) {
        if(this.data.types.length === 2) {
            if(`${this.data.types[0].type.name}/${this.data.types[1].type.name}` === answer.toLowerCase()) { return true; }
        }
        else {
            if(`${this.data.types[0].type.name}` === answer.toLowerCase()) { return true; }
        }
        return false;
    }

    checkWeightQuestion(answer) {
        if(this.data.weight/10 === parseFloat(answer)) { return true; }
        return false;
    }

    checkDexNumQuestion(answer) {
        if((this.data.id).toString() === answer) { return true; }
        return false;
    }

    checkMoveQuestion(answer, moveName) {
        let ans = false;
        this.data.moves.forEach((move) => {
            if(move.move.name === moveName) { ans = true; }
        })
        if(answer.toLowerCase() === "yes" && ans) { return true; }
        if(answer.toLowerCase() === "no" && !ans) { return true; }
        return false;
    }
}