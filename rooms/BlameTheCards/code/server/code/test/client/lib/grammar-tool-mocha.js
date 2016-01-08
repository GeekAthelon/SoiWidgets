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
        let t1 = grammar.tokenize('Now "hear" this!  The quick  doggy --ran-- down the hall.');

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

        expect(t1).to.deep.equal(expected);
    });
});
