/* globals it: true, describe: true, before: true */
'use strict';

const expect = require('chai').expect;
const RegisterUsers = require('../app/lib/register-users.js');

describe('Testing RegistereUser', () => {
    let registerUsers;

    before(() => {
        console.log(RegisterUsers);
        registerUsers = new RegisterUsers();
        return registerUsers.clear();
    });

    it('Testing registereUsers instanceOf RegistereUsers', () => {
        expect(registerUsers instanceof RegisterUsers).to.equal(true);
    });

    it('Adding a user', () => {
        return registerUsers.add('BotBoy').then(details => {
            expect(details.token.length).to.equal(96);
        });
    });

    it('Adding a user a second time should give a new token', () => {
        let token1;
        return registerUsers.add('BotBoy')
            .then(details => {
                token1 = details.token;
                return registerUsers.add('BotBoy');
            }).then(details => {
                const token2 = details.token;
                expect(token1).to.not.equal(token2);
            });
    });

    it('Testing to make sure verify works.', () => {
        /*jshint -W030 */
        return registerUsers.add('BotBoy')
            .then(details => {
                const token = details.token;
                return registerUsers.verify('BotBoy', details.token);
            }).then(isVerified => {
                expect(isVerified).to.be.true;
            });
        /*jshint +W030 */
    });

    it('Testing to make sure verify of a bad token fails.', () => {
        /*jshint -W030 */
        return registerUsers.add('BotBoy')
            .then(details => {
                return registerUsers.verify('BotBoy', `Z${details.token}Z`);
            }).then(isVerified => {
                expect(isVerified).to.be.false;
            });
        /*jshint +W030 */
    });

});
