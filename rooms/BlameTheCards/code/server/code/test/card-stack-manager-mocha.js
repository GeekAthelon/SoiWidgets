'use strict';
/* globals it: true, describe: true, before: true, beforeEach: true*/

const expect = require('chai').expect;
const QuestionCard = require('../app/lib/question-card');
const AnswerCard = require('../app/lib/answer-card');
const CardStack = require('../app/lib/card-stack');
const CardStackManager = require('../app/lib/card-stack-manager');
const Card = require('../app/lib/card');

var btcConfig = require('../app/get-btc-config.js')();

function populateCards(cardStackManager, maxQuestionCards, maxAnswerCards) {
    cardStackManager.questionDiscardStack._cards.length = 0;
    cardStackManager.answerDiscardStack._cards.length = 0;

    for (let i = 0; i < maxQuestionCards; i++) {
        const card = new QuestionCard(i, `What is the question _? (${i})`);
        cardStackManager.questionDiscardStack.add(card);
    }

    for (let i = 0; i < maxAnswerCards; i++) {
        const card = new AnswerCard(i, `Answer # ${i}`);
        cardStackManager.answerDiscardStack.add(card);
    }
}

describe('Testing Card Stack Manager', function() {
    const cardStackManager = new CardStackManager();

    describe('Basic Existence', function() {
        before(function() {});

        it('cardStackManager exists', function() {
            expect(cardStackManager instanceof CardStackManager).to.equal(true);
        });

        it('cardStackManager.questionDrawStack exists', function() {
            expect(cardStackManager.questionDrawStack instanceof CardStack).to.equal(true);
        });

        it('cardStackManager.questionDiscardStack exists', function() {
            expect(cardStackManager.questionDiscardStack instanceof CardStack).to.equal(true);
        });

        it('cardStackManager.answerDrawStack exists', function() {
            expect(cardStackManager.answerDrawStack instanceof CardStack).to.equal(true);
        });

        it('cardStackManager.answerDiscardStack exists', function() {
            expect(cardStackManager.answerDiscardStack instanceof CardStack).to.equal(true);
        });

        it('cardStackManager.questionTableStack exists', function() {
            expect(cardStackManager.questionTableStack instanceof CardStack).to.equal(true);
        });

        it('cardStackManager.players exists', function() {
            expect(cardStackManager.players).to.deep.equal({});
        });

    });

    describe('Dealing and overdealing', function() {
        const cardStackManager = new CardStackManager();
        const maxQuestionCards = 4;
        const maxAnswerCards = 4;

        beforeEach(() => {
            populateCards(cardStackManager, maxQuestionCards, maxAnswerCards);
        });

        it('questionCardStack is populated', function() {
            expect(cardStackManager.questionDiscardStack._cards.length).to.equal(maxQuestionCards);
        });

        it('answerCardStack is populated', function() {
            expect(cardStackManager.answerDiscardStack._cards.length).to.equal(maxAnswerCards);
        });

        it('drawing Question from empty stack - forced reshuffle', function() {
            const card1 = cardStackManager.drawQuestion();
            expect(card1).to.not.equal(undefined);
        });

        it('drawing Answer from empty stack - forced reshuffle', function() {
            const card1 = cardStackManager.drawAnswer();
            expect(card1).to.not.equal(undefined);
        });

    });

    describe('Testing NPC', function() {
        const cardStackManager = new CardStackManager();

        const maxQuestionCards = 40;
        const maxAnswerCards = 40;

        before(() => {
            populateCards(cardStackManager, maxQuestionCards, maxAnswerCards);
            cardStackManager.addPlayer(btcConfig.nick);
            cardStackManager.startRound();
        });

        it('Checking bot name', () => {
            expect(btcConfig.nick).to.equal('btc-bot');
        });

        it('Adding Bot to game', () => {
            expect(cardStackManager.players[btcConfig.nick]).to.not.equal(undefined);
        });

        it('Adding Bot to game twice', () => {
            const p1 = cardStackManager.players[btcConfig.nick];
            cardStackManager.addPlayer(btcConfig.nick);
            const p2 = cardStackManager.players[btcConfig.nick];
            expect(p1).to.equal(p2);
        });

        it('One Question Card On the Table', () => {
            expect(cardStackManager.questionTableStack._cards.length).to.equal(1);
        });

        it('Bot\'s hand filled correctly', () => {
            const player = cardStackManager.players[btcConfig.nick];
            expect(player.hand._cards.length).to.equal(10);
        });

        it('Bot\'s table created correctly', () => {
            const player = cardStackManager.players[btcConfig.nick];
            expect(player.table._cards.length).to.equal(0);
        });

        it('getDataFor the Bot', () => {
            var data = cardStackManager.getDataFor(btcConfig.nick);
            expect(data.hand.length).to.equal(10);
            expect(data.table.length).to.equal(0);
            expect(data.inPlay.length).to.equal(1);
        });

        it('getDataFor the an invalid player', () => {
            var data = cardStackManager.getDataFor('**NOBODY**');
            expect(data.hand.length).to.equal(0);
            expect(data.table.length).to.equal(0);
            expect(data.inPlay.length).to.equal(1);
        });

        describe('Bot\'s plays card not in his hand', () => {

            let player;
            before(() => {
                player = cardStackManager.players[btcConfig.nick];
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
                player = cardStackManager.players[btcConfig.nick];
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
        const cardStackManager = new CardStackManager();
        const maxQuestionCards = 4;
        const maxAnswerCards = 10;

        let player;

        before(() => {
            populateCards(cardStackManager, maxQuestionCards, maxAnswerCards);
            cardStackManager.addPlayer(btcConfig.nick);
            cardStackManager.startRound();

            player = cardStackManager.players[btcConfig.nick];
            const hand = player.getHand();
            player.playByCardsId([hand[0].num, hand[1].num]);

            //console.log(JSON.stringify(cardStackManager, null, 2));
            cardStackManager._endRound();
            //console.log(JSON.stringify(cardStackManager, null, 2));
        });

        it('table.length should be 0', () => {
            expect(player.table._cards.length).to.equal(0);
        });

        it('questionDiscard Stack', () => {
            expect(cardStackManager.questionDiscardStack._cards.length).to.equal(1);
        });

        it('questionTableStack Stack', () => {
            expect(cardStackManager.questionTableStack._cards.length).to.equal(0);
        });

        it('answerDiscard Stack', () => {
            expect(cardStackManager.answerDiscardStack._cards.length).to.equal(2);
        });
    });

    describe('Populating Question Cards from Array', () => {
        let cardStackManager;

        before(() => {
            cardStackManager = new CardStackManager();
            cardStackManager.loadQuestionCards(
                [
                    'Why did the _ cross the _?',
                    'What interrupted the game? _'
                ]
            );
        });

        it('Created the two cards', () => {
            expect(cardStackManager.questionDiscardStack._cards.length).to.equal(2);
        });

        it('Created the second card correctly', () => {
            const card = cardStackManager.questionDiscardStack._cards[1];
            expect(card.num).to.equal(1);
            expect(card.text).to.equal('What interrupted the game? _');
        });
    });

    describe('Populating Answer Cards from Array', () => {
        let cardStackManager;

        before(() => {
            cardStackManager = new CardStackManager();
            cardStackManager.loadAnswerCards(
                [
                    'Because!',
                    'I said so!'
                ]
            );
        });

        it('Created the two cards', () => {
            expect(cardStackManager.answerDiscardStack._cards.length).to.equal(2);
        });

        it('Created the second card correctly', () => {
            const card = cardStackManager.answerDiscardStack._cards[1];
            expect(card.num).to.equal(1);
            expect(card.text).to.equal('I said so!');
        });
    });
});
