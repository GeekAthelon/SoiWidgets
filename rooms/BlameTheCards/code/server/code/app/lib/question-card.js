'use strict';

const Card = require('./card');
const Deck = require('./deck');

class QuestionCard extends Card {
    constructor(num, text) {
        super();

        this.num = num;
        this.text = text;
        this.type = Deck.cardType.QUESTION;
    }
}

exports = module.exports = QuestionCard;
