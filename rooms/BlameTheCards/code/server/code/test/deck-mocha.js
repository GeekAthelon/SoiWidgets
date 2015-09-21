/* globals it: true, describe: true */

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

    function createDbObj() {
        var fs = require("fs");
        var file = "test.db";
        var exists = fs.existsSync(file);

        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database(':memory:');

        db.on('trace', function(sql) {
            //console.info("sql: " + sql);
        });

<<<<<<< HEAD
        db.run(`DROP TABLE if exists deck`);
=======
		db.run(`DROP TABLE if exists deck`);
>>>>>>> b08372bc065f13ab532b91e236f14c61827dc0e7

        return db;
    }

    describe('Testing for life', function(done) {
        it('init runs successfully', function(done) {
            var db = createDbObj();
            let deck = new Deck(db);

            deck.init().then(function() {;
                    expect(true).to.equal(true);
                    done();
                })
                .catch(function(reason) {
                    console.log("init failed: " + reason);
                });
        });
    });

    describe('Testing ENUMS', function() {
        var db = createDbObj();
        let deck = new Deck(db);

        it('Testing QUESTION enum', function() {
            expect(Deck.cardType.QUESTION).to.equal(1);
        });

        it('Testing ANSWER enum', function() {
            expect(Deck.cardType.ANSWER).to.equal(2);
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

    describe('Card Handling', function(done) {
        let db;
        let deck;

        beforeEach(function() {
            db = createDbObj();
            deck = new Deck(db);
        });

        it('Add Question Card', function(done) {
            function addOneCard() {
                var questionCard = new QuestionCard(1, " What is the _");
                return deck.addCard(questionCard);
            }

            deck.init().then(function() {;
                return addOneCard();
            }).then(function() {
                return deck.getQuestionCards();
            }).then(function(cards) {
                let card = cards[0];
                expect(cards.length).to.equal(1);
                expect(card.num).to.equal(1);
                expect(card.text).to.equal(" What is the _");
                expect(card.type).to.equal(Deck.cardType.QUESTION);

                done();
            }).catch(function(err) {
                console.log("Err: " + err);
            });
        });

        it('Add Answer Card', function(done) {
            function addOneCard() {
                let answerCard = new AnswerCard(1, " What is the _");
                return deck.addCard(answerCard);
            }
<<<<<<< HEAD

            deck.init().then(function() {;
                return addOneCard();
            }).then(function() {
                return deck.getAnswerCards();
            }).then(function(cards) {
                let card = cards[0];
                expect(cards.length).to.equal(1);
                expect(card.num).to.equal(1);
                expect(card.text).to.equal(" What is the _");
                expect(card.type).to.equal(Deck.cardType.ANSWER);

=======

            deck.init().then(function() {;
                return addOneCard();
            }).then(function() {
                return deck.getAnswerCards();
            }).then(function(cards) {
                let card = cards[0];
                expect(cards.length).to.equal(1);
                expect(card.num).to.equal(1);
                expect(card.text).to.equal(" What is the _");
                expect(card.type).to.equal(Deck.cardType.ANSWER);

>>>>>>> b08372bc065f13ab532b91e236f14c61827dc0e7
                done();
            }).catch(function(err) {
                console.log("Err: " + err);
            });
        });

		});
});

describe('Testing Question Cards', function() {
    'use strict';

    var questionCard = new QuestionCard(1, "Huzzah");

    it('Testing QuestionCard isntanceof Card', function() {
        expect(questionCard instanceof Card).to.equal(true);
    });
});
<<<<<<< HEAD

describe('Testing Question Cards', function() {
    'use strict';

    var questionCard = new QuestionCard(1, "Huzzah");

    it('Testing QuestionCard isntanceof Card', function() {
        expect(questionCard instanceof Card).to.equal(true);
    });
});
=======
>>>>>>> b08372bc065f13ab532b91e236f14c61827dc0e7

describe('Testing Answer Cards', function() {
    'use strict';

    var answerCard = new AnswerCard(1, "Huzzah");

    it('Testing answerCard isntanceof Card', function() {
        expect(answerCard instanceof Card).to.equal(true);
    });
});
