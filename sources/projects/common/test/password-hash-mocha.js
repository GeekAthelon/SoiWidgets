/* globals it: true, describe: true */

const expect = require('chai').expect;


//const passwordHash = require('../src/password-hash-bcrypt');
const passwordHash = require('../src/password-hash-fast');

describe('Testing password-hash (promise based)', function() {
    'use strict';

    this.timeout(200000);

    const thePassword = 'bacon';
    let theSalt;
    let theHash;

    it('Testing salt generation', () => {
        return passwordHash.genSalt().then(salt => {
            theSalt = salt;
            expect(theSalt.length).to.equal(29);
        });
    });

    it('Testing hash generation', () => {
        return passwordHash.hash(theSalt, thePassword).then(
            hash => {
                theHash = hash;
                expect(theHash.length).to.equal(60);

            });
    });

    it('Testing hash compare', () => {
        return passwordHash.compare(theSalt, thePassword,
            theHash).then(res => {
            expect(res).to.equal(true);
        });
    });
});
