/* globals it: true, describe: true, beforeEach:true */

const expect = require('chai').expect;

const databaseO = require('../src/lib/user-auth-db');
const collection = new databaseO.Database();

describe('Testing user-auth database functions', function() {
    'use strict';

    function testInsertAndGet(o1, o2) {
        let cid;

        return collection.insert(o1).then(_cid => {
            cid = _cid;

            expect(typeof cid).to.equal('number');

            return collection.get(cid).then(o => {
                expect(o.false).to.equal(o2.false);
                expect(o.nickName).to.equal(o2.nickName);
                expect(o.password).to.equal(o2.password);
                expect(o.salt).to.equal(o2.salt);
            });
        });
    }

    beforeEach(() => {
        return collection.removeAll();
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

});
