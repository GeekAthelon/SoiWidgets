'use strict';

const CardStack = require('./card-stack');
const QuestionCard = require('./question-card');
const AnswerCard = require('./answer-card');
const Random = require('random-js');
const psevents = require('./pub-sub');

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

    shuffleArray(fromCards);
    toStack._cards = fromCards;
    fromStack._cards = [];
}

class Player {
    constructor(name) {
        this.hand = new CardStack(`Player ${name} Hand`, Deck.cardType.ANSWER);
        this.table = new CardStack(`Player ${name} Table`, Deck.cardType.ANSWER);
        this.playedRound = false;
    }

    fillHand(cardStackManager) {
        const l = cardStackManager.settings.handSize;
        for (let i = this.hand._cards.length; i < l; i++) {
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
    constructor(cfg) {

        /* istanbul ignore if  */
        if (!cfg) {
            throw new Error('CardStackManager - cfg object not passed');
        }

        /* istanbul ignore if  */
        if (!cfg.history) {
            throw new Error('CardStackManager - cfg.history not configured');
        }

        /* istanbul ignore if  */
        if (!cfg.settings) {
            throw new Error('CardStackManager - cfg.settings not configured');
        }

        /* istanbul ignore if  */
        if (!cfg.name) {
            throw new Error('CardStackManager - cfg.name not configured');
        }

        this.history = cfg.history;
        this.settings = cfg.settings;
        this.name = cfg.name;

        this.questionDrawStack = new CardStack('Question Draw Stack', Deck.cardType.QUESTION);
        this.questionDiscardStack = new CardStack('Question Discard Stack', Deck.cardType.QUESTION);
        this.answerDrawStack = new CardStack('Answer Draw Stack', Deck.cardType.ANSWER);
        this.answerDiscardStack = new CardStack('Answer Draw Stack', Deck.cardType.ANSWER);
        this.questionTableStack = new CardStack('Question Table Stack', Deck.cardType.QUESTION);
        this.players = {};

        this.questionCardIndex = 0;
        this.answerCardIndex = 0;
        this.countdown = -1;
        this.round = this.history.getLastRoundNumber();

        this.lastRoundPlaced = -1;
    }

    _pub(n, obj) {
        const s = `${this.name}.${n}`;
        console.log(s);
        psevents.publish(s, obj);
    }

    drawQuestion() {
        /* istanbul ignore else  */
        if (this.questionDrawStack._cards.length === 0) {
            this._pub('game.info', `Shuffled Question Deck`);
            reshuffle(this.questionDiscardStack, this.questionDrawStack);
        }
        return this.questionDrawStack.draw();
    }

    drawAnswer() {
        if (this.answerDrawStack._cards.length === 0) {
            this._pub('game.info', `Shuffled Answer Deck`);
            reshuffle(this.answerDiscardStack, this.answerDrawStack);
        }
        return this.answerDrawStack.draw();
    }

    resetPlayeDropCounter(player) {
        player.dropTime = Date.now() + this.settings.playerTimeOutDuration;

    }
    addPlayer(name) {
        if (this.players[name]) {
            return;
        }

        const player = new Player(name);
        this.resetPlayeDropCounter(player);
        this.players[name] = player;
        player.fillHand(this);
    }

    playCardsFor /* istanbul ignore next */ (name, cards) {
        if (!this.players[name]) {
            throw new Error(`Player ${name} is not in the game.`);
        }

        const player = this.players[name];
        player.playByCardsId(cards);
        player.playedRound = true;
        player.lastRoundPlayed = this.round;
        this.resetPlayeDropCounter(player);
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
        data.gameHistory = this.history.getRecentVotes(
            this.round,
            this.settings.numberOfRoundsVotesReturnedToClient
        );
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

            /* istanbul ignore if */
            if (now > player.dropTime) {
                this.removePlayer(name);
            }
        });

        this._emptyStackTo(this.questionTableStack, this.questionDiscardStack);
    }

    _setTestingMode /* istanbul ignore next */ () {
        console.info('Test Mode Activated');
        random = new Random(Random.engines.mt19937().seed(1701));
    }

    startRound() {
        this._pub('game.start-round.begin');

        this.round++;
        let qCard = this.drawQuestion();
        this.questionTableStack.add(qCard);

        Object.keys(this.players).forEach((name) => {
            const player = this.players[name];
            player.fillHand(this);
            player.playedRound = false;
        });

        this.history.saveRound(this.round);

        this.countdown = Date.now() + this.settings.turnDuration;

        this._pub('game.start-round.end');
        return new Promise((resolve, reject) => {
            resolve();
            void(reject);
        });
    }

    loadQuestionCards(cards) {
        cards.forEach(str => {
            const card = new QuestionCard(this.questionCardIndex, str);
            this.questionCardIndex++;
            this.questionDiscardStack.add(card);
        });
    }

    loadAnswerCards(cards) {
        cards.forEach(str => {
            const card = new AnswerCard(this.answerCardIndex, str);
            this.answerCardIndex++;
            this.answerDiscardStack.add(card);
        });
    }
}

exports = module.exports = CardStackManager;
