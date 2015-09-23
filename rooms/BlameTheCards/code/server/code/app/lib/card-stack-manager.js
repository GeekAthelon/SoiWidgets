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

class Player {
    constructor(name) {
        this.hand = new CardStack(`Player ${name} Hand`, Deck.cardType.ANSWER);
        this.table = new CardStack(`Player ${name} Table`, Deck.cardType.ANSWER);
    }

    fillHand(cardStackManager) {
        for (var i = this.hand._cards.length; i < HAND_SIZE; i++) {
            let aCard = cardStackManager.drawAnswer();
            this.hand.add(aCard);
        }
    }

    playByIndex(cardIndexes) {
        /* istanbul ignore if  */
        if (!Array.isArray(cardIndexes)) {
            cardIndexes = [cardIndexes];
        }

        cardIndexes.forEach((idx) => {
            var card = this.hand._cards[idx];
            this.hand.remove(card);
            this.table.add(card);
        });
    }
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
        /* istanbul ignore next */
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

        let player = new Player(name);
        this.players[name] = player;
    }

    removePlayer(name) {
        throw new Error('Not Implemented');
    }

    startRound() {
        let qCard = this.drawQuestion();
        this.questionTableStack.add(qCard);

        Object.keys(this.players).forEach((name) => {
            var player = this.players[name];
            player.fillHand(this);
        });
    }
}

exports = module.exports = CardStackManager;
