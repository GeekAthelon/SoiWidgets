/* globals it: true, describe: true, beforeEach:true, afterEach: true */

const expect = require('chai').expect;

const databaseO = require('../src/lib/user-auth-db');
const collection = databaseO.collection;

describe('Testing user-auth database functions', function() {
    'use strict';

    function testInsertAndGet(o1, o2) {
        let cid;

        return collection.insertAsync(o1).then(_cid => {
            cid = _cid;

            expect(typeof cid).to.equal('number');

            return collection.getAsync(cid).then(o => {
                expect(o.isAdmin).to.equal(o2.isAdmin);
                expect(o.nickName).to.equal(o2.nickName);
                expect(o.password).to.equal(o2.password);
                expect(o.salt).to.equal(o2.salt);
            });
        });
    }

    beforeEach(() => {
        return collection.removeAllAsync();
    });

    it('Testing that the test is alive', () => {
        expect(1).to.equal(1);
    });

    it('Testing insert one object (match)', () => {
        const o1 = databaseO.createEntity({
            nickName: 'nick',
            isAdmin: false,
            password: 'password',
            salt: 'salt'
        });

        return testInsertAndGet(o1, o1);
    });

    it('Testing isRegisteredUser when false', () => {
        const o1 = databaseO.createEntity({
            nickName: 'nick',
            isAdmin: false,
            password: 'password',
            salt: 'salt'
        });

        return testInsertAndGet(o1, o1).then(() => {
            return databaseO.isRegisteredUserAsync('nobody');
        }).then(res => {
            expect(res).to.equal(false);
        });
    });

    it('Testing isRegisteredUser when SomeBunny', () => {
        const o1 = databaseO.createEntity({
            nickName: 'SomeBunny',
            isAdmin: false,
            password: 'password',
            salt: 'salt'
        });

        return testInsertAndGet(o1, o1).then(() => {
            return databaseO.isRegisteredUserAsync('SomeBunny');
        }).then(res => {
            expect(res).to.equal(true);
        });
    });

    describe('Testing gatherUserDataAsync', () => {

        beforeEach(() => {
            const o1 = databaseO.createEntity({
                nickName: '-[Somebody]-',
                isAdmin: false,
                password: 'password',
                salt: 'salt'
            });

            return testInsertAndGet(o1, o1);
        });

        afterEach(() => {
            return collection.removeAllAsync();
        });

        it('Testing isRegisteredUser when false', () => {
            return databaseO.gatherUserDataAsync('nobody')
                .then(res => {
                    expect(res.isRegistered).to.equal(false);
                });
        });

        it('Testing isRegisteredUser when Somebody', () => {
            return databaseO.gatherUserDataAsync('-[Somebody]-')
                .then(res => {
                    expect(res.isRegistered).to.equal(true);
                });
        });

        it('Testing nick formatting', () => {
            return databaseO.gatherUserDataAsync('-[Somebody]-')
                .then(res => {
                    expect(res.simpleNick).to.equal('somebody');
                    expect(res.tail).to.equal('priv');
                });
        });

    });
});
