'use strict';
/* globals it: true, describe: true, before: true, beforeEach: true*/

const expect = require('chai').expect;
const QuestionCard = require('../app/lib/question-card');
const AnswerCard = require('../app/lib/answer-card');
const CardStack = require('../app/lib/card-stack');
const CardStackManager = require('../app/lib/card-stack-manager');
const History = require('../app/lib/game-history');
const BtcBot = require('../app/lib/btc-bot');
const btcConfig = require('../app/get-btc-config')();
const btcSettings = require('../app/get-btc-settings');

const gameConfig = (function() {
    const gameHistory = new History('main-room');
    const btcBot = new BtcBot(gameHistory);

    return {
        history: gameHistory,
        btcBot: btcBot,
        settings: btcSettings
    };
}());

function populateCards(game, maxQuestionCards, maxAnswerCards) {
    game.questionDiscardStack._cards.length = 0;
    game.answerDiscardStack._cards.length = 0;

    for (let i = 0; i < maxQuestionCards; i++) {
        const card = new QuestionCard(i, `What is the question _? (${i})`);
        game.questionDiscardStack.add(card);
    }

    for (let i = 0; i < maxAnswerCards; i++) {
        const card = new AnswerCard(i, `Answer # ${i}`);
        game.answerDiscardStack.add(card);
    }
}

describe('Testing Card Stack Manager', function() {
    this.timeout(50 * 1000);
    const game = new CardStackManager(gameConfig);

    describe('Basic Existence', function() {
        before(function() {});

        it('game exists', function() {
            expect(game instanceof CardStackManager).to.equal(true);
        });

        it('game.questionDrawStack exists', function() {
            expect(game.questionDrawStack instanceof CardStack).to.equal(true);
        });

        it('game.questionDiscardStack exists', function() {
            expect(game.questionDiscardStack instanceof CardStack).to.equal(true);
        });

        it('game.answerDrawStack exists', function() {
            expect(game.answerDrawStack instanceof CardStack).to.equal(true);
        });

        it('game.answerDiscardStack exists', function() {
            expect(game.answerDiscardStack instanceof CardStack).to.equal(true);
        });

        it('game.questionTableStack exists', function() {
            expect(game.questionTableStack instanceof CardStack).to.equal(true);
        });

        it('game.players exists', function() {
            expect(game.players).to.deep.equal({});
        });

    });

    describe('Dealing and overdealing', function() {
        const game = new CardStackManager(gameConfig);
        const maxQuestionCards = 4;
        const maxAnswerCards = 4;

        beforeEach(() => {
            populateCards(game, maxQuestionCards, maxAnswerCards);
        });

        it('questionCardStack is populated', function() {
            expect(game.questionDiscardStack._cards.length).to.equal(maxQuestionCards);
        });

        it('answerCardStack is populated', function() {
            expect(game.answerDiscardStack._cards.length).to.equal(maxAnswerCards);
        });

        it('drawing Question from empty stack - forced reshuffle', function() {
            const card1 = game.drawQuestion();
            expect(card1).to.not.equal(undefined);
        });

        it('drawing Answer from empty stack - forced reshuffle', function() {
            const card1 = game.drawAnswer();
            expect(card1).to.not.equal(undefined);
        });

    });

    describe('Testing NPC', function() {
        const game = new CardStackManager(gameConfig);

        const maxQuestionCards = 40;
        const maxAnswerCards = 40;

        before(() => {
            populateCards(game, maxQuestionCards, maxAnswerCards);
            game.addPlayer(btcConfig.nick);
            return game.startRound();
        });

        it('Checking bot name', () => {
            expect(btcConfig.soi.nick).to.equal('btc-bot');
        });

        it('Adding Bot to game', () => {
            expect(game.players[btcConfig.nick]).to.not.equal(undefined);
        });

        it('Adding Bot to game twice', () => {
            const p1 = game.players[btcConfig.nick];
            game.addPlayer(btcConfig.nick);
            const p2 = game.players[btcConfig.nick];
            expect(p1).to.equal(p2);
        });

        it('One Question Card On the Table', () => {
            expect(game.questionTableStack._cards.length).to.equal(1);
        });

        it('Bot\'s hand filled correctly', () => {
            const player = game.players[btcConfig.nick];
            expect(player.hand._cards.length).to.equal(10);
        });

        it('Bot\'s table created correctly', () => {
            const player = game.players[btcConfig.nick];
            expect(player.table._cards.length).to.equal(0);
        });

        it('getDataFor the Bot', () => {
            var data = game.getDataFor(btcConfig.nick);
            expect(data.hand.length).to.equal(10);
            expect(data.table.length).to.equal(0);
            expect(data.inPlay.length).to.equal(1);
        });

        it('getDataFor the an invalid player', () => {
            var data = game.getDataFor('**NOBODY**');
            expect(data.hand.length).to.equal(0);
            expect(data.table.length).to.equal(0);
            expect(data.inPlay.length).to.equal(1);
        });

        describe('Bot\'s plays card not in his hand', () => {

            let player;
            before(() => {
                player = game.players[btcConfig.nick];
            });

            it('should fail badly', () => {
                let res = false;

                try {
                    player.playByCardsId(-10);
                } catch (err) {
                    res = true;
                }

                expect(res).to.be.equal(true);
            });
        });

        describe('Bot\'s Plays Two cards', () => {
            let player;

            before(() => {
                player = game.players[btcConfig.nick];
                const hand = player.getHand();
                player.playByCardsId([hand[1].num, hand[2].num]);
            });

            it('table.length', () => {
                expect(player.table._cards.length).to.equal(2);
            });

            it('hand.length', () => {
                expect(player.hand._cards.length).to.equal(8);
            });
        });
    });

    describe('Testing endRound', () => {
        const game = new CardStackManager(gameConfig);
        const maxQuestionCards = 4;
        const maxAnswerCards = 10;

        let player;

        before(() => {
            populateCards(game, maxQuestionCards, maxAnswerCards);
            game.addPlayer(btcConfig.nick);
            return game.startRound().then(() => {

                player = game.players[btcConfig.nick];
                const hand = player.getHand();
                player.playByCardsId([hand[0].num, hand[1].num]);

                //console.log(JSON.stringify(game, null, 2));
                game._endRound();
                //console.log(JSON.stringify(game, null, 2));
            });
        });

        it('table.length should be 0', () => {
            expect(player.table._cards.length).to.equal(0);
        });

        it('questionDiscard Stack', () => {
            expect(game.questionDiscardStack._cards.length).to.equal(1);
        });

        it('questionTableStack Stack', () => {
            expect(game.questionTableStack._cards.length).to.equal(0);
        });

        it('answerDiscard Stack', () => {
            expect(game.answerDiscardStack._cards.length).to.equal(2);
        });
    });

    describe('Testing removingPlayer', () => {
        const game = new CardStackManager(gameConfig);
        const maxQuestionCards = 4;
        const maxAnswerCards = 40;

        let player;

        before(() => {
            populateCards(game, maxQuestionCards, maxAnswerCards);
            game.addPlayer(btcConfig.nick);
            return game.startRound().then(() => {

                player = game.players[btcConfig.nick];
                const hand = player.getHand();
                player.playByCardsId([hand[0].num, hand[1].num]);

                game.removePlayer(btcConfig.nick);
            });
        });

        it('table.length should be 0', () => {
            expect(player.table._cards.length).to.equal(0);
        });

        it('hand.length should be 0', () => {
            expect(player.hand._cards.length).to.equal(0);
        });

        it('answerDiscard Stack', () => {
            expect(game.answerDiscardStack._cards.length).to.equal(10);
        });

        it('answerDiscard Stack', () => {
            let l = game.answerDiscardStack._cards.length +
                game.answerDrawStack._cards.length;
            expect(l).to.equal(40);
        });

        it('Should not be in game', () => {
            var data = game.getDataFor(btcConfig.nick);
            expect(data.inGame).to.equal(false);
        });

    });

    describe('Populating Question Cards from Array', () => {
        let game;

        before(() => {
            game = new CardStackManager(gameConfig);
            game.loadQuestionCards(
                [
                    'Why did the _ cross the _?',
                    'What interrupted the game? _'
                ]
            );
        });

        it('Created the two cards', () => {
            expect(game.questionDiscardStack._cards.length).to.equal(2);
        });

        it('Created the second card correctly', () => {
            const card = game.questionDiscardStack._cards[1];
            expect(card.num).to.equal(1);
            expect(card.text).to.equal('What interrupted the game? _');
        });
    });

    describe('Populating Answer Cards from Array', () => {
        let game;

        before(() => {
            game = new CardStackManager(gameConfig);
            game.loadAnswerCards(
                [
                    'Because!',
                    'I said so!'
                ]
            );
        });

        it('Created the two cards', () => {
            expect(game.answerDiscardStack._cards.length).to.equal(2);
        });

        it('Created the second card correctly', () => {
            const card = game.answerDiscardStack._cards[1];
            expect(card.num).to.equal(1);
            expect(card.text).to.equal('I said so!');
        });
    });
});
