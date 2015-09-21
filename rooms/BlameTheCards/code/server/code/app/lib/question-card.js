'use strict';

var Card = require('./card');
var Deck = require('./deck');

class QuestionCard extends Card {
    constructor(num, text) {
		super();
		
        this.num = num;
        this.text = text;
        this.type = Deck.cardType.QUESTION;
    }
}

exports = module.exports = QuestionCard;
