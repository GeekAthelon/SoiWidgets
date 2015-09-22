'use strict';

const HAND_SIZE = 10;
var CardStack = require('./card-stack');
var Deck = require('./deck');

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function reshuffle(fromStack, toStack) {
    let fromCards = fromStack._cards;
    let toCards = toStack._cards;

    shuffleArray(fromCards);
    toStack._cards = fromCards;
    fromStack._cards = [];
}

class CardStackManager {
    constructor() {
        this.questionDrawStack = new CardStack('Question Draw Stack', Deck.cardType.QUESTION);
        this.questionDiscardStack = new CardStack('Question Discard Stack', Deck.cardType.QUESTION);

        this.answerDrawStack = new CardStack('Answer Draw Stack', Deck.cardType.ANSWER);
        this.answerDiscardStack = new CardStack('Answer Draw Stack', Deck.cardType.ANSWER);

        this.answerTableStack = new CardStack('Answer Table Stack', Deck.cardType.ANSWER);
        this.questionTableStack = new CardStack('Question Table Stack', Deck.cardType.QUESTION);

        this.players = {};
    }

    drawQuestion() {
        if (this.questionDrawStack._cards.length === 0) {
            reshuffle(this.questionDiscardStack, this.questionDrawStack);
        }

        return this.questionDrawStack.draw();
    }

    drawAnswer() {
        if (this.answerDrawStack._cards.length === 0) {
            reshuffle(this.answerDiscardStack, this.answerDrawStack);
        }

        return this.answerDrawStack.draw();
    }

    addPlayer(name) {
        if (this.players[name]) {
            return;
        }

        var playerDetails = {
            cards: new CardStack(`Player ${name}`, Deck.cardType.ANSWER)
        };

        this.players[name] = playerDetails;
    }

    removePlayer(name) {
        throw new Error('Not Implemented');
    }

}

exports = module.exports = CardStackManager;
