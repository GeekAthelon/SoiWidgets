'use strict';

const TIME_BETWEEN_HANDS = 1 * 1000 * 60;
const PLAYER_TIME_OUT_DELAY = 5 * 1000 * 60;

const HAND_SIZE = 10;
const CardStack = require('./card-stack');
const QuestionCard = require('./question-card');
const AnswerCard = require('./answer-card');
const Random = require('random-js');
const gHistory = require('./game-history');
const btcBot = require('./btc-bot');

var random = new Random(Random.engines.mt19937().autoSeed());

const Deck = require('./deck');

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(random.real(0, 1, false) * (i + 1));
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
        this.playedRound = false;
        this.dropTime = Date.now() + PLAYER_TIME_OUT_DELAY;
    }

    fillHand(cardStackManager) {
        for (let i = this.hand._cards.length; i < HAND_SIZE; i++) {
            const aCard = cardStackManager.drawAnswer();
            this.hand.add(aCard);
        }
    }

    getHand() {
        return this.hand._cards;
    }

    getTable() {
        return this.table._cards;
    }

    playByCardsId(cardIndexes) {
        /* istanbul ignore if  */
        if (!Array.isArray(cardIndexes)) {
            cardIndexes = [cardIndexes];
        }

        cardIndexes.forEach((idx) => {
            const cardList = this.hand._cards.filter((c) => c.num === idx);
            if (cardList.length === 1) {
                const card = cardList[0];
                this.hand.remove(card);
                this.table.add(card);
            } else {
                throw new Error(`Unable to find card index ${idx} in hand`);
            }
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
        this.countdown = -1;
        this.round = 0;

        this.gHistory = gHistory;
        this.lastRoundPlaced = -1;
    }

    drawQuestion() {
        if (this.questionDrawStack._cards.length === 0) {
            btcBot.addMessage(`Shuffled Question Deck`);
            console.log(
                'Shuffling question deck: ',
                this.questionDrawStack._cards.length,
                this.questionDiscardStack._cards.length
            );

            reshuffle(this.questionDiscardStack, this.questionDrawStack);
        }
        return this.questionDrawStack.draw();
    }

    drawAnswer() {
        if (this.answerDrawStack._cards.length === 0) {
            btcBot.addMessage(`Shuffled Answer Deck`);
            console.log(
                'Shuffling answer deck: ',
                this.answerDrawStack._cards.length,
                this.answerDiscardStack._cards.length);
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
        player.fillHand(this);
    }

    playCardsFor(name, cards) {
        if (!this.players[name]) {
            throw new Error(`Player ${name} is not in the game.`);
        }

        const player = this.players[name];
        player.playByCardsId(cards);
        player.playedRound = true;
        player.dropTime = Date.now() + PLAYER_TIME_OUT_DELAY;
        player.lastRoundPlayed = this.round;
    }

    getDataFor(name) {
        let data;
        const player = this.players[name];

        if (player) {
            data = {
                hand: player.getHand(),
                table: player.getTable(),
                inGame: true,
                playedRound: player.playedRound,
                round: this.round,
                lastRoundPlayed: player.lastRoundPlayed
            };
        } else {
            data = {
                hand: [],
                table: [],
                inGame: false
            };
        }

        data.inPlay = this.questionTableStack._cards;
        data.countdown = this.countdown - Date.now();
        data.gameHistory = gHistory.getRecentVotes(this.round, GLOBAL.RECENT_VOTE_COUNT);
        return data;
    }

    _emptyStackTo(src, dest) {
        while (true) {
            let card = src._cards[0];
            if (!card) {
                break;
            }

            src.remove(card);
            dest.add(card);
        }
    }

    removePlayer(name) {
        const player = this.players[name];

        this._emptyStackTo(player.table, this.answerDiscardStack);
        this._emptyStackTo(player.hand, this.answerDiscardStack);

        delete this.players[name];
    }

    _endRound() {
        const now = Date.now();
        Object.keys(this.players).forEach((name) => {
            const player = this.players[name];

            this._emptyStackTo(player.table, this.answerDiscardStack);

            if (now > player.dropTime) {
                this.removePlayer(name);
            }
        });

        this._emptyStackTo(this.questionTableStack, this.questionDiscardStack);
    }

    _setTestingMode() {
        console.info('Test Mode Activated');
        random = new Random(Random.engines.mt19937().seed(1701));
    }

    startRound() {
        btcBot.queueNewVotes();

        this.round++;
        let qCard = this.drawQuestion();
        this.questionTableStack.add(qCard);

        Object.keys(this.players).forEach((name) => {
            const player = this.players[name];
            player.fillHand(this);
            player.playedRound = false;
        });

        let txt = this.questionTableStack._cards[0].text.replace(/_/g, '_______');
        btcBot.post();

        this.countdown = Date.now() + TIME_BETWEEN_HANDS;
        setTimeout(() => {
            this._endRound();
            this.startRound();
        }, TIME_BETWEEN_HANDS);
    }

    loadQuestionCards(cards) {
        cards.forEach(str => {
            const card = new QuestionCard(this.questionCardIndex, `${str}`);
            this.questionCardIndex++;
            this.questionDiscardStack.add(card);
        });
    }

    loadAnswerCards(cards) {
        cards.forEach(str => {
            const card = new AnswerCard(this.answerCardIndex, `${str}`);
            this.answerCardIndex++;
            this.answerDiscardStack.add(card);
        });
    }
}

exports = module.exports = CardStackManager;
