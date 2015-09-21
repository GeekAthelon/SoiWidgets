'use strict';

class Deck {
    constructor(db) {
        this.db = db;
    }

    init() {
        var db = this.db;
        return new Promise(function(resolve, reject) {


            db.serialize(function() {
                db.run(`CREATE TABLE if not exists deck (
				text TEXT,
				cardtype INT,
				cardnumber INT)`);

                db.run("--", [], () => {
                    resolve();
                });
            });
        });

    }

    addCard(card) {
        var db = this.db;
        return new Promise(function(resolve, reject) {
            var stmt = db.prepare(
                `INSERT INTO deck
				(text, cardtype, cardnumber) 
				VALUES (?,?,?)`);

            stmt.run(card.text, card.type, card.num);
            stmt.finalize();

            db.run("--", [], () => {
                resolve();
            });
        });
    };

    << << << < HEAD
    _getCards(type) { === === =
        _getCards(type) { >>> >>> > b08372bc065f13ab532b91e236f14c61827dc0e7
            let db = this.db;
            return new Promise(function(resolve, reject) {

                let cards = [];
                db.each(`SELECT rowid AS id, text, cardtype, cardnumber 
				FROM deck
				where cardtype = ` + type,
                    function(err, row) {
                        let card = {
                            text: row.text,
                            type: row.cardtype,
                            num: row.cardnumber
                        };

                        Object.freeze(card);
                        cards.push(card);
                    });

                db.run("--", [], () => {
                    resolve(cards);
                });
            });

        }

        getQuestionCards() {
            return this._getCards(Deck.cardType.QUESTION);
        }

        getAnswerCards() {
            return this._getCards(Deck.cardType.ANSWER);
        }

        << << << < HEAD
        getQuestionCards() {
            return this._getCards(Deck.cardType.QUESTION);
        }

        getAnswerCards() {
            return this._getCards(Deck.cardType.ANSWER);
        }

        === === = >>> >>> > b08372bc065f13ab532b91e236f14c61827dc0e7
    }

    Deck.cardType = {
        QUESTION: 1,
        ANSWER: 2
    };

    Object.freeze(Deck.cardType);

    exports = module.exports = Deck;
