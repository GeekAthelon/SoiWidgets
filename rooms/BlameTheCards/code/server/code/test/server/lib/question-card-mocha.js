'use strict';

/* globals it: true, describe: true*/

const expect = require('chai').expect;
const QuestionCard = require('../../../app/lib/question-card');

describe('Testing Question Card', function() {

    it('Testing Question Card with no rules', function() {
        const qCard = new QuestionCard(10, `What is the question _?`);
        expect(qCard.text).to.equal(`What is the question _?`);
        expect(qCard.rules).to.deep.equal([]);
    });

    it('Testing Question Card with one rule', function() {
        const qCard = new QuestionCard(10, `What is the question [capName]?`);
        expect(qCard.text).to.equal(`What is the question _?`);
        expect(qCard.rules).to.deep.equal([
            ['capName']
        ]);
    });

    it('Testing Question Card with two slots rule', function() {
        const qCard = new QuestionCard(10, `What is the question [capName]? [capTitle,dashify]`);
        expect(qCard.text).to.equal(`What is the question _? _`);
        expect(qCard.rules).to.deep.equal([
            ['capName'],
            ['capTitle', 'dashify']
        ]);
    });

    it('Testing Question Card with unknown rule', function() {
        let r = false;
        try {
            const qCard = new QuestionCard(10, `What is the question [-broken-]?`);
            void(qCard);
        } catch (err) {
            if (err.message.indexOf(`unknown rule of "-broken-"`)) {
                r = true;
            } else {
                throw err;
            }
        }

        expect(r).to.deep.equal(true);
    });
});
