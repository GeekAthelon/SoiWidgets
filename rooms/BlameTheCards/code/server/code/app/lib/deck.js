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

                db.each("SELECT rowid AS id, text, cardtype, cardnumber FROM deck", function(err, row) {
                    //console.log([row.text, row.cardtype, row.cardnumber]);
                });

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

    getQuestionCards() {
        let db = this.db;
        return new Promise(function(resolve, reject) {

            let cards = [];
            db.each(`SELECT rowid AS id, text, cardtype, cardnumber 
				FROM deck
				where cardtype = ` + Deck.cardType.QUESTION,
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
}

Deck.cardType = {
    QUESTION: 1,
    ANSWER: 2
};

Object.freeze(Deck.cardType);


exports = module.exports = Deck;
