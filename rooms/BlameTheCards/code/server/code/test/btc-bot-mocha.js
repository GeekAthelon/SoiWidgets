'use strict';

/* globals it: true, describe: true, before: true, beforeEach: true */

const expect = require('chai').expect;
const btcBot = require('../app/lib/btc-bot');

describe('BtcBot Tests', function() {

    before(function() {});

    it('btcBot is alive', function() {
        expect(btcBot instanceof Object).to.equal(true);
    });
});
