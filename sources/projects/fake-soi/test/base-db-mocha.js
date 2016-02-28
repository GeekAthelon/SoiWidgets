/* globals it: true, describe: true, beforeEach:true */

const expect = require('chai').expect;

const databaseO = require('../src/lib/test-db');
const collection = new databaseO.Database();

describe('Testing base database functions', function() {
    'use strict';

    beforeEach(() => {
        return collection.removeAll();
    });

    it('Testing that the test is alive', () => {
        expect(1).to.equal(1);
    });

    function testInsertAndGet(o1, o2) {
        let cid;

        return collection.insert(o1).then(_cid => {
            cid = _cid;

            expect(typeof cid).to.equal('number');

            return collection.get(cid).then(o => {
                expect(o.propBool).to.equal(o2.propBool);
                expect(o.propString).to.equal(o2.propString);
                expect(o.propNumber).to.equal(o2.propNumber);
            });
        });
    }

    it('Testing insert one object (match)', () => {
        const o1 = databaseO.createEntity();
        o1.propBool = true;
        o1.propString = 'Hello';
        o1.propNumber = 10;

        return testInsertAndGet(o1, o1);
    });

    it('Testing insert of wrong object type', (done) => {
        new Promise((reject, resolve) => {
            void(resolve);
            void(reject);

            const o1 = {};
            o1.propBool = true;
            o1.propString = 'Hello';
            o1.propNumber = 10;

            return testInsertAndGet(o1, o1).then(() => {
                done(new Error('Failed to error on wrong object type'));
            });
        }).catch((err) => {
            if (err.message.indexOf('Passed object is of the wrong type') === -1) {
                done(err);
            } else {
                done();
            }
        });
    });

    it('Testing insert one object (failure)', (done) => {
        const o1 = databaseO.createEntity();
        o1.propBool = true;
        o1.propString = 'Hello';
        o1.propNumber = 10;

        const o2 = databaseO.createEntity();
        o2.propBool = false;
        o2.propString = 'Hello';
        o2.propNumber = 10;

        testInsertAndGet(o1, o2).then(() => {
            done(new Error('Failed to find a difference in the objects'));
        }).catch((err) => {
            expect(err.message).to.equal('expected true to equal false');
            done();
        });
    });
});
