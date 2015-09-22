'use strict';

var CardStack = require('./card-stack');
var Deck = require('./deck');

class CardStackManager {
    constructor() {
        this.questionDrawStack = new CardStack("Question Draw Stack", Deck.cardType.QUESTION);
        this.questionDiscardStack = new CardStack("Question Discard Stack", Deck.cardType.QUESTION);

        this.answerDrawStack = new CardStack("Answer Draw Stack", Deck.cardType.ANSWER);
        this.answerDiscardStack = new CardStack("Answer Draw Stack", Deck.cardType.ANSWER);

        this.hand = {};
    }

    addPlayer(name) {
        throw new Error("Not Implemented");
    }

    removePlayer(name) {
        throw new Error("Not Implemented");
    }

}

exports = module.exports = CardStackManager;
