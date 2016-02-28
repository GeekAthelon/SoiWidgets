/* globals it: true, describe: true */

const expect = require('chai').expect;
const bcrypt = require('bcrypt-nodejs');

describe.skip('Testing bcrypt-nodejs (callback based)', function() {
    'use strict';
    this.timeout(200000);

    const thePassword = 'bacon';
    let theSalt;
    let theHash;

    it('Testing genSalt', function(done) {
        theSalt = bcrypt.genSalt(10, (err, salt) => {
            theSalt = salt;
            expect(err).to.equal(null);
            done();
        });
    });

    it('Testing hash generation', function(done) {
        bcrypt.hash(thePassword, theSalt, null, (err, hash) => {
            theHash = hash;
            expect(err).to.equal(null);
            done();
        });
    });

    it('Testing hash compare', function(done) {
        bcrypt.compare(thePassword, theHash, (err, res) => {
            expect(err).to.equal(null);
            expect(res).to.equal(true);
            done();
        });
    });
});
