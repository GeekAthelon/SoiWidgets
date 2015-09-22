/* globals it: true, describe: true, before: true*/

var expect = require('chai').expect;
var QuestionCard = require('../app/lib/question-card');
var AnswerCard = require('../app/lib/answer-card');
var CardStack = require('../app/lib/card-stack');
var CardStackManager = require('../app/lib/card-stack-manager');
var Card = require('../app/lib/card');

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

        it('cardStackManager.answerTableStack exists', function() {
            expect(cardStackManager.answerTableStack instanceof CardStack).to.equal(true);
        });

        it('cardStackManager.questionTableStack exists', function() {
            expect(cardStackManager.questionTableStack instanceof CardStack).to.equal(true);
        });

        it('cardStackManager.hand exists', function() {
            expect(cardStackManager.hand).to.deep.equal({});
        });

    });

    describe('Dealing and overdealing', function() {
        var cardStackManager = new CardStackManager();

        let maxQuestionCards = 3;
        let maxAnswerCards = 20;

        for (let i = 0; i < maxQuestionCards; i++) {
            let card = new QuestionCard(i, `What is the question _? (${i})`);
            cardStackManager.questionDrawStack.add(card);
        }

        for (let i = 0; i < maxAnswerCards; i++) {
            let card = new AnswerCard(i, `Answer # ${i}`);
            cardStackManager.answerDrawStack.add(card);
        }

        it('questionCardStack is populated', function() {
            expect(cardStackManager.questionDrawStack._cards.length).to.equal(maxQuestionCards);
        });

        it('answerCardStack is populated', function() {
            expect(cardStackManager.answerDrawStack._cards.length).to.equal(maxAnswerCards);
        });
    });
});
