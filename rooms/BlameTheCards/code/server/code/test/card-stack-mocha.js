/* globals it: true, describe: true, before: true, beforeEach: true */

var expect = require('chai').expect;
var QuestionCard = require('../app/lib/question-card');
var AnswerCard = require('../app/lib/answer-card');
var CardStack = require('../app/lib/card-stack');
var Card = require('../app/lib/card');

var Deck = require('../app/lib/deck');
var deck = new Deck();

describe('Testing Card Stack - basics', function() {
    'use strict';

    let questionCardStack;
    let answerCardStack;

    before(function() {
        questionCardStack = new CardStack('answerDraw', Deck.cardType.QUESTION);
        answerCardStack = new CardStack('answerDraw', Deck.cardType.ANSWER);
    });

    it('questionCardStack exists', function() {
        expect(questionCardStack instanceof CardStack).to.equal(true);
    });

    it('answerCardStack exists', function() {
        expect(answerCardStack instanceof CardStack).to.equal(true);
    });

    describe('Testing Card Stack - single card manipulation', function() {

        let testStack;
        beforeEach(function() {
            testStack = new CardStack('testStack', Deck.cardType.QUESTION);
        });

        let qCard = new QuestionCard(10, `What is the question _?`);
        let aCard = new AnswerCard(11, `42, of course`);

        it('Can add QuestionCard', function() {
            testStack.add(qCard);
            expect(true).to.equal(true);
        });

        it('Can\'t draw from empty stack', function() {
            var result = false;
            try {
                testStack.draw();
            } catch (err) {
                result = true;
            }
            expect(result).to.equal(true);
        });

        it('Can\'t remove non-existant', function() {
            var result = false;
            try {
                testStack.remove(qCard);
            } catch (err) {
                result = true;
            }
            expect(result).to.equal(true);
        });

        it('Can add and draw QuestionCard', function() {
            testStack.add(qCard);
            var card2 = testStack.draw();

            expect(testStack._cards.length).to.equal(0);
        });

        it('Can add and remove QuestionCard', function() {
            testStack.add(qCard);
            testStack.remove(qCard);

            expect(testStack._cards.length).to.equal(0);
        });

        it('Can\'t add QuestionCard twice', function() {
            var result = false;
            try {
                testStack.add(qCard);
                testStack.add(qCard);
            } catch (err) {
                result = true;
            }
            expect(result).to.equal(true);
        });

        it('Can\'t add AnswerCard', function() {
            var result = false;
            try {
                testStack.add(aCard);
            } catch (err) {
                result = true;
            }
            expect(result).to.equal(true);
        });
    });
});
