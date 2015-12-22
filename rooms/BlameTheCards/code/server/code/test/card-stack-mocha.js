'use strict';

/* globals it: true, describe: true, before: true, beforeEach: true */

const expect = require('chai').expect;
const QuestionCard = require('../app/lib/question-card');
const AnswerCard = require('../app/lib/answer-card');
const CardStack = require('../app/lib/card-stack');
const Deck = require('../app/lib/deck');

describe('Testing Card Stack - basics', function() {
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

        const qCard = new QuestionCard(10, `What is the question _?`);
        const aCard = new AnswerCard(11, `42, of course`);

        it('Can add QuestionCard', function() {
            testStack.add(qCard);
            expect(true).to.equal(true);
        });

        it('Can\'t draw from empty stack', function() {
            let result = false;
            try {
                testStack.draw();
            } catch (err) {
                result = true;
            }
            expect(result).to.equal(true);
        });

        it('Can\'t remove non-existant', function() {
            let result = false;
            try {
                testStack.remove(qCard);
            } catch (err) {
                result = true;
            }
            expect(result).to.equal(true);
        });

        it('Can add and draw QuestionCard', function() {
            testStack.add(qCard);
            const card2 = testStack.draw();
            void(card2);
            expect(testStack._cards.length).to.equal(0);
        });

        it('Can add and remove QuestionCard', function() {
            testStack.add(qCard);
            testStack.remove(qCard);

            expect(testStack._cards.length).to.equal(0);
        });

        it('Can\'t add QuestionCard twice', function() {
            let result = false;
            try {
                testStack.add(qCard);
                testStack.add(qCard);
            } catch (err) {
                result = true;
            }
            expect(result).to.equal(true);
        });

        it('Can\'t add AnswerCard', function() {
            let result = false;
            try {
                testStack.add(aCard);
            } catch (err) {
                result = true;
            }
            expect(result).to.equal(true);
        });
    });
});
