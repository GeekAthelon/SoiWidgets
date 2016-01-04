'use strict';

const Card = require('./card');
const Deck = require('./deck');

class AnswerCard extends Card {
    constructor(num, text) {
        super();

        this.num = num;
        this.text = text;
        this.type = Deck.cardType.ANSWER;
    }
}

exports = module.exports = AnswerCard;
