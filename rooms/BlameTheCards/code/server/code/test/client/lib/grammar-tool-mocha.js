'use strict';

/* globals it: true, describe: true, before: true, beforeEach: true, afterEach: true*/

const expect = require('chai').expect;
const grammar = require('../../../client/lib/grammar-tool');

describe('Grammer Tool Tests', function() {
    before(function() {});
    beforeEach(function() {});
    afterEach(function() {});

    it('isAlive', () => {
        expect(grammar.isAlive()).to.deep.equal(true);
    });

});
