/* globals it: true, describe: true */

var expect = require('chai').expect;
var QuestionCard = require('../app/lib/question-card');
var AnswerCard = require('../app/lib/answer-card');
var CardStack = require('../app/lib/card-stack');
var Card = require('../app/lib/card');

var Deck = require('../app/lib/deck');
var deck = new Deck();

describe('Testing Card Stack - basics', function() {
    'use strict';

    beforeEach(function() {
        //db = createDbObj();
        //deck = new Deck(db);
    });

    let questionCardStack = new CardStack("answerDraw", Deck.cardType.QUESTION);
    let answerCardStack = new CardStack("answerDraw", Deck.cardType.ANSWER);


    it('questionCardStack exists', function() {
        expect(questionCardStack instanceof CardStack).to.equal(true);
    });

    it('answerCardStack exists', function() {
        expect(answerCardStack instanceof CardStack).to.equal(true);
    });

    describe('Testing Card Stack - single card manipulation', function() {

        let testStack;
        beforeEach(function() {
            testStack = new CardStack("testStack", Deck.cardType.QUESTION);
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
                testStack.draw(qCard);
            } catch (err) {
                result = true;
            }
            expect(result).to.equal(true);
        });


        it('Can add and remove QuestionCard', function() {
            testStack.add(qCard);
            testStack.draw(qCard);

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

describe('Testing Card Stack - Full Deck', function() {
    'use strict'

    this.timeout(3000);
    this.slow(3000);

    let questionCardStack = new CardStack("answerDraw", Deck.cardType.QUESTION);
    let answerCardStack = new CardStack("answerDraw", Deck.cardType.ANSWER);

    let maxQuestionCards = 30;
    let maxAnswerCards = 100;

    for (let i = 0; i < maxQuestionCards; i++) {
        let card = new QuestionCard(i, `What is the question _? (${i})`);
        questionCardStack.add(card);
    }

    for (let i = 0; i < maxAnswerCards; i++) {
        let card = new AnswerCard(i, `Answer # ${i}`);
        answerCardStack.add(card);
    }

    it('questionCardStack is populated', function() {
        expect(questionCardStack._cards.length).to.equal(maxQuestionCards);
    });

    it('answerCardStack is populated', function() {
        expect(answerCardStack._cards.length).to.equal(maxAnswerCards);
    });
});
