'use strict';

class Deck {
    constructor(db) {
        this.db = db;
    }

    init(done) {
        var db = this.db;

        db.serialize(function() {

            db.run(`CREATE TABLE if not exists user_info (
				text TEXT,
				cardtype INT,
				cardnumber INT
			)`);

            db.each("SELECT rowid AS id, text, cardtype, cardnumber FROM user_info", function(err, row) {
                //console.log([row.text, row.cardtype, row.cardnumber]);
            });

            db.run("--", [], () => {
                done();
            });
        });

    }

    addCard(card, done) {
           var stmt = this.db.prepare(
				`INSERT INTO user_info
				(text, cardtype, cardnumber) 
				VALUES (?,?,?)`);
				
            stmt.run(card.text, card.type, card.num);
            stmt.finalize();

            this.db.run("--", [], () => {
                done();
            });        
    };
}

Deck.cardType = {
    QUESTION: 1,
    ANSWER: 2
};

Object.freeze(Deck.cardType);


exports = module.exports = Deck;
