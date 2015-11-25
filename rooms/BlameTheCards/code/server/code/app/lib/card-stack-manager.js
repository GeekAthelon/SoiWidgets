'use strict';

const HAND_SIZE = 10;
const CardStack = require('./card-stack');
const QuestionCard = require('./question-card');
const Deck = require('./deck');

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
    const fromCards = fromStack._cards;
    const toCards = toStack._cards;

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
        for (let i = this.hand._cards.length; i < HAND_SIZE; i++) {
            const aCard = cardStackManager.drawAnswer();
            this.hand.add(aCard);
        }
    }

    playByIndex(cardIndexes) {
        /* istanbul ignore if  */
        if (!Array.isArray(cardIndexes)) {
            cardIndexes = [cardIndexes];
        }

        cardIndexes.forEach((idx) => {
            const card = this.hand._cards[idx];
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

        this.questionTableStack = new CardStack('Question Table Stack', Deck.cardType.QUESTION);

        this.players = {};

        this.questionCardIndex = 0;
        this.answerCardIndex = 0;
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

        const player = new Player(name);
        this.players[name] = player;
    }

    removePlayer(name) {
        throw new Error('Not Implemented');
    }

    _endRound() {
        Object.keys(this.players).forEach((name) => {
            const player = this.players[name];

            while (true) {
                let card = player.table._cards[0];
                if (!card) {
                    break;
                }

                player.table.remove(card);
                this.answerDiscardStack.add(card);
            }

            let qcard = this.questionTableStack._cards[0];
            /* istanbul ignore else */
            if (qcard) {
                this.questionTableStack.remove(qcard);
                this.questionDiscardStack.add(qcard);
            }
        });
    }

    startRound() {
        let qCard = this.drawQuestion();
        this.questionTableStack.add(qCard);

        Object.keys(this.players).forEach((name) => {
            const player = this.players[name];
            player.fillHand(this);
        });
    }

    loadQuestionCards(cards) {
        cards.forEach(str => {
            const card = new QuestionCard(this.questionCardIndex, `${str}`);
            this.questionCardIndex++;
            this.questionDiscardStack.add(card);

        });
    }
}

exports = module.exports = CardStackManager;
