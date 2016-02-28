/* globals it: true, describe: true */

const expect = require('chai').expect;

//const passwordHash = require('../src/password-hash-bcrypt');
const passwordHash = require('../src/password-hash-fast');

describe('Testing password-hash (promise based) (these tests have LONG timeout)', function() {
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
        return passwordHash.hash(theSalt, thePassword).then(hash => {
            theHash = hash;
            expect(theHash.length).to.equal(60);

        });
    });

    it('Testing hash compare (success)', () => {
        return passwordHash.
        compare(theSalt, thePassword, theHash).then(res => {
            expect(res).to.equal(true);
        });
    });

    it('Testing hash compare (failure bad hash)', (done) => {
        passwordHash.compare(theSalt, thePassword, theHash + theHash).then(res => {
            // catches fast crypt
            expect(res).to.equal(false);
            done();
        }).catch(err => {
            // catches BCrypt
            expect(err).to.equal('Not a valid BCrypt hash.');
            done();
        });
    });

    it('Testing hash compare (failure incorrect hash)', (done) => {
        let badHash;

        passwordHash.hash(theSalt, thePassword + 'A').then(hash => {
            expect(theHash).to.not.equal(hash);
            badHash = hash;
        }).then(() => {
            return passwordHash.compare(theSalt, thePassword, badHash).then(res => {
                expect(res).to.equal(false);
                done();
            });
        });
    });
});
