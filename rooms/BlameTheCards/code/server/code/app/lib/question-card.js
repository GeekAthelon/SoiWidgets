'use strict';

const Card = require('./card');
const Deck = require('./deck');
const grammar = require('../../client/lib/grammar-tool');
const ruleNameList = grammar.getRuleNames();

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

            const currentRules = [];

            ruleText.split(',').forEach((r) => {
                if (ruleNameList.indexOf(r) === -1) {
                    throw new Error(
                        `Question Card - constructor - unknown rule of "${r}" ` +
                        `in question "${text}"`);
                }
                currentRules.push(r);
            });

            this.rules.push(currentRules);
        }

        this.num = num;
        this.text = text;
        this.type = Deck.cardType.QUESTION;
    }
}

exports = module.exports = QuestionCard;
