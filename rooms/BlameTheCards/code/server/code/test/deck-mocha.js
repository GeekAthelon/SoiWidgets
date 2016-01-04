/* globals it: true, describe: true, before: true */
'use strict';

const expect = require('chai').expect;
const QuestionCard = require('../app/lib/question-card');
const AnswerCard = require('../app/lib/answer-card');
const Card = require('../app/lib/card');

describe('Testing Deck', function() {
    before(() => {});

    // this.timeout(3000);
    // this.slow(3000);

    // describe('Testing ENUMS', function() {
    // let deck = new Deck(db);

    // it('Testing QUESTION enum', function() {
    // expect(Deck.cardType.QUESTION).to.equal(1000);
    // });

    // it('Testing ANSWER enum', function() {
    // expect(Deck.cardType.ANSWER).to.equal(2000);
    // });

    // it('Testing object frozen', function() {
    // let result = false;
    // try {
    // Deck.cardType.ANSWER = 10;
    // } catch (e) {
    // result = true;
    // }
    // expect(result).to.equal(true);
    // });

    // });

    // describe('Adding Question Card', function() {
    // let cards;
    // let aCards;
    // let card;

    // function addOneCard(deck) {
    // const questionCard = new QuestionCard(1, ' What is the _');
    // return deck.addQuestionCard(questionCard);
    // }

    // before(function(done) {
    // const deck = new Deck(db);

    // deck.empty().then(function() {
    // return addOneCard(deck);
    // }).then(function() {
    // return Promise.all([deck.getQuestionCards(), deck.getAnswerCards()]);
    // }).then(function(_cards) {
    // cards = _cards[0];
    // aCards = cards[1];
    // card = cards[0];
    // done();
    // }).catch(function(err) {
    // console.log('Err: ' + err);
    // });
    // });

    // it('cards.length', function() {
    // expect(cards.length).to.equal(1);
    // });

    // it('card.num', function() {
    // expect(card.num).to.equal(1);
    // });

    // it('card.text', function() {
    // expect(card.text).to.equal(' What is the _');
    // });

    // it('card.type', function() {
    // expect(card.type).to.equal(Deck.cardType.QUESTION);
    // });
    // });
});

describe('Testing Question Cards', function() {
    const questionCard = new QuestionCard(1, 'Huzzah');

    it('Testing QuestionCard isntanceof Card', function() {
        expect(questionCard instanceof Card).to.equal(true);
    });
});

describe('Testing Answer Cards', function() {
    const answerCard = new AnswerCard(1, 'Huzzah');

    it('Testing answerCard isntanceof Card', function() {
        expect(answerCard instanceof Card).to.equal(true);
    });
});
