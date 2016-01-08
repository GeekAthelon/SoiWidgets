'use strict';

/* globals it: true, describe: true, before: true, beforeEach: true, afterEach: true*/

const expect = require('chai').expect;
const grammar = require('../../../client/lib/grammar-tool');

describe.only('Grammer Tool Tests', function() {
    before(function() {});
    beforeEach(function() {});
    afterEach(function() {});

    it('isAlive', () => {
        expect(grammar.isAlive()).to.deep.equal(true);
    });

    it('Testing isLetter', () => {
        expect(grammar.isLetter('a')).to.deep.equal(true);
        expect(grammar.isLetter('Z')).to.deep.equal(true);
        expect(grammar.isLetter('Ë')).to.deep.equal(true);
        expect(grammar.isLetter('Ð')).to.deep.equal(true);

        expect(grammar.isLetter(' ')).to.deep.equal(false);
        expect(grammar.isLetter('-')).to.deep.equal(false);
    });

    it('Testing tokenize', () => {
        const t1 = grammar.tokenize('Now "hear" this!  The quick  doggy --ran-- down the hall.');
        const pureArrayStrippedOfDecorations = t1.map(l => l);

        let expected = [{
            str: 'Now',
            type: grammar.TOKEN_WORD
        }, {
            str: ' "',
            type: grammar.TOKEN_OTHER
        }, {
            str: 'hear',
            type: grammar.TOKEN_WORD
        }, {
            str: '" ',
            type: grammar.TOKEN_OTHER
        }, {
            str: 'this',
            type: grammar.TOKEN_WORD
        }, {
            str: '!  ',
            type: grammar.TOKEN_OTHER
        }, {
            str: 'The',
            type: grammar.TOKEN_WORD
        }, {
            str: ' ',
            type: grammar.TOKEN_OTHER
        }, {
            str: 'quick',
            type: grammar.TOKEN_WORD
        }, {
            str: '  ',
            type: grammar.TOKEN_OTHER
        }, {
            str: 'doggy',
            type: grammar.TOKEN_WORD
        }, {
            str: ' --',
            type: grammar.TOKEN_OTHER
        }, {
            str: 'ran',
            type: grammar.TOKEN_WORD
        }, {
            str: '-- ',
            type: grammar.TOKEN_OTHER
        }, {
            str: 'down',
            type: grammar.TOKEN_WORD
        }, {
            str: ' ',
            type: grammar.TOKEN_OTHER
        }, {
            str: 'the',
            type: grammar.TOKEN_WORD
        }, {
            str: ' ',
            type: grammar.TOKEN_OTHER
        }, {
            str: 'hall',
            type: grammar.TOKEN_WORD
        }, {
            str: '.',
            type: grammar.TOKEN_OTHER
        }];

        expect(pureArrayStrippedOfDecorations).to.deep.equal(expected);
    });

    it('Testing rule: toString', () => {
        const t1 = grammar.tokenize('little miss muffet!');
        expect(t1.toString()).to.deep.equal('little miss muffet!');
    });

    it('Testing rule: capFirstWord', () => {
        const t1 = grammar.tokenize('little miss muffet');
        t1.capFirstWord();
        expect(t1.toString()).to.deep.equal('Little miss muffet');

        const t2 = grammar.tokenize('"beyond the stars"');
        t2.capFirstWord();
        expect(t2.toString()).to.deep.equal('"Beyond the stars"');
    });

    it('Testing rule: capName', () => {
        const t1 = grammar.tokenize('little miss muffet -- spider slayer');
        t1.capName();
        expect(t1.toString()).to.deep.equal('Little Miss Muffet -- Spider Slayer');
    });

    it('Testing rule: capTitle', () => {
        const t1 = grammar.tokenize('willy wonka and the chocolate factory');
        t1.capTitle();
        expect(t1.toString()).to.deep.equal('Willy Wonka and the Chocolate Factory');
    });

    it('Testing rule: dashify', () => {
        const t1 = grammar.tokenize('over the top');
        t1.dashify();
        expect(t1.toString()).to.deep.equal('over-the-top');
    });
});
