/// <reference path="../../../typings/mocha/mocha.d.ts" />
/// <reference path="../interfaces/IPasswordInterface.ts" />

describe('Testing password hash (bcrypt)', function() {
    const passwordHashModule = require('../src/password-hash-bcrypt').default;
    const passwordHash = new passwordHashModule();
    runHashTest(passwordHash);
});

describe('Testing password hash (fast)', function() {
    const passwordHashModule = require('../src/password-hash-fast').default;
    const passwordHash = new passwordHashModule();
    runHashTest(passwordHash);
});

function runHashTest(passwordHash: IPasswordInterface) {
    describe('Testing password-hash ', function() {
        const expect = require('chai').expect;

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
                expect(res).to.equal(false);
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
}