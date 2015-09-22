/* globals it: true, describe: true, before: true */

var expect = require('chai').expect;
var QuestionCard = require('../app/lib/question-card');
var AnswerCard = require('../app/lib/answer-card');
var Card = require('../app/lib/card');

var Deck = require('../app/lib/deck');
var deck = new Deck();

describe('Testing Deck', function() {
    'use strict';

    this.timeout(3000);
    this.slow(3000);

    let createDbObj = require('./util-create-dbobject');

    describe('Testing for life', function() {
        it('init runs successfully', function(done) {
            var db = createDbObj();
            let deck = new Deck(db);

            deck.init().then(function() {
                    expect(true).to.equal(true);
                    done();
                })
                .catch(function(reason) {
                    console.log('init failed: ' + reason);
                });
        });
    });

    describe('Testing ENUMS', function() {
        var db = createDbObj();
        let deck = new Deck(db);

        it('Testing QUESTION enum', function() {
            expect(Deck.cardType.QUESTION).to.equal(1000);
        });

        it('Testing ANSWER enum', function() {
            expect(Deck.cardType.ANSWER).to.equal(2000);
        });

        it('Testing object frozen', function() {
            let result = false;
            try {
                Deck.cardType.ANSWER = 10;
            } catch (e) {
                result = true;
            }
            expect(result).to.equal(true);
        });

    });

    describe('Adding Question Card', function() {

        let db = createDbObj();
        let deck = new Deck(db);

        function addOneCard() {
            var questionCard = new QuestionCard(1, ' What is the _');
            return deck.addCard(questionCard);
        }

        let cards;
        let aCards;
        let card;

        before(function(done) {
            deck.init().then(function() {
                return addOneCard();
            }).then(function() {
                return Promise.all([deck.getQuestionCards(), deck.getAnswerCards()]);
            }).then(function(_cards) {
                cards = _cards[0];
                aCards = cards[1];
                card = cards[0];
                done();
            }).catch(function(err) {
                console.log('Err: ' + err);
            });
        });

        it('cards.length', function() {
            expect(cards.length).to.equal(1);
        });

        it('card.num', function() {
            expect(card.num).to.equal(1);
        });

        it('card.text', function() {
            expect(card.text).to.equal(' What is the _');
        });

        it('card.type', function() {
            expect(card.type).to.equal(Deck.cardType.QUESTION);
        });
    });
});

describe('Testing Question Cards', function() {
    'use strict';

    var questionCard = new QuestionCard(1, 'Huzzah');

    it('Testing QuestionCard isntanceof Card', function() {
        expect(questionCard instanceof Card).to.equal(true);
    });
});

describe('Testing Question Cards', function() {
    'use strict';

    var questionCard = new QuestionCard(1, 'Huzzah');

    it('Testing QuestionCard isntanceof Card', function() {
        expect(questionCard instanceof Card).to.equal(true);
    });
});

describe('Testing Answer Cards', function() {
    'use strict';

    var answerCard = new AnswerCard(1, 'Huzzah');

    it('Testing answerCard isntanceof Card', function() {
        expect(answerCard instanceof Card).to.equal(true);
    });
});
