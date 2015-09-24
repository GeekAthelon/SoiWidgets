/* globals it: true, describe: true, before: true, beforeEach: true*/

var expect = require('chai').expect;
var QuestionCard = require('../app/lib/question-card');
var AnswerCard = require('../app/lib/answer-card');
var CardStack = require('../app/lib/card-stack');
var CardStackManager = require('../app/lib/card-stack-manager');
var Card = require('../app/lib/card');

var btcConfig = require('../app/get-btc-config.js')();

function populateCards(cardStackManager, maxQuestionCards, maxAnswerCards) {
    'use strict';

    cardStackManager.questionDiscardStack._cards.length = 0;
    cardStackManager.answerDiscardStack._cards.length = 0;

    for (let i = 0; i < maxQuestionCards; i++) {
        let card = new QuestionCard(i, `What is the question _? (${i})`);
        cardStackManager.questionDiscardStack.add(card);
    }

    for (let i = 0; i < maxAnswerCards; i++) {
        let card = new AnswerCard(i, `Answer # ${i}`);
        cardStackManager.answerDiscardStack.add(card);
    }
}

describe('Testing Card Stack Manager', function() {
    'use strict';

    var cardStackManager = new CardStackManager();

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
        var cardStackManager = new CardStackManager();

        let maxQuestionCards = 4;
        let maxAnswerCards = 4;

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
            let card1 = cardStackManager.drawQuestion();
            expect(card1).to.not.equal(undefined);
        });

        it('drawing Answer from empty stack - forced reshuffle', function() {
            let card1 = cardStackManager.drawAnswer();
            expect(card1).to.not.equal(undefined);
        });

    });

    describe('Testing NPC', function() {
        let cardStackManager = new CardStackManager();

        let maxQuestionCards = 40;
        let maxAnswerCards = 40;

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
            let p1 = cardStackManager.players[btcConfig.nick];
            cardStackManager.addPlayer(btcConfig.nick);
            let p2 = cardStackManager.players[btcConfig.nick];
            expect(p1).to.equal(p2);
        });

        it('One Question Card On the Table', () => {
            expect(cardStackManager.questionTableStack._cards.length).to.equal(1);
        });

        it('Bot\'s hand filled correctly', () => {
            let player = cardStackManager.players[btcConfig.nick];
            expect(player.hand._cards.length).to.equal(10);
        });

        it('Bot\'s table created correctly', () => {
            let player = cardStackManager.players[btcConfig.nick];
            expect(player.table._cards.length).to.equal(0);
        });

        describe('Bot\'s Plays Two cards', () => {
            let player;

            before(() => {
                player = cardStackManager.players[btcConfig.nick];
                player.playByIndex([1, 2]);
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
        let cardStackManager = new CardStackManager();

        let player;

        let maxQuestionCards = 4;
        let maxAnswerCards = 10;

        before(() => {
            populateCards(cardStackManager, maxQuestionCards, maxAnswerCards);
            cardStackManager.addPlayer(btcConfig.nick);
            cardStackManager.startRound();

            player = cardStackManager.players[btcConfig.nick];
            player.playByIndex([1, 2]);

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

});
