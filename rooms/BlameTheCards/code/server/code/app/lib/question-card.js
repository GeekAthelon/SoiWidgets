'use strict';

const Card = require('./card');
const Deck = require('./deck');

class QuestionCard extends Card {
    constructor(num, fullText) {
        super();
        this.rules = [];

        let text = fullText;
        while (text.indexOf('[') !== -1) {
            const start = text.indexOf('[');
            const end = text.indexOf(']');
            const t = text.substring(start, end + 1);
            const ruleText = t.replace('[', '').replace(']', '');

            text = text.replace(t, '_');
            this.rules = (ruleText.split(' '));
        }

        this.num = num;
        this.text = text;
        this.type = Deck.cardType.QUESTION;
    }
}

exports = module.exports = QuestionCard;
