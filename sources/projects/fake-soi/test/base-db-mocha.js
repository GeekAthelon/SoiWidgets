/* globals it: true, describe: true, before:true, beforeEach */

const expect = require('chai').expect;

const Database = require('../src/lib/base-db');

describe('Testing base database functions', function() {
    'use strict';

    let collection;

    before(() => {
        collection = new Database('test');
    });

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
        const obj = {
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        };

        return testInsertAndGet(obj, obj);
    });

    it('Testing insert one object (failure)', (done) => {
        const o1 = {
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        };

        const o2 = {
            propBool: false,
            propString: 'Hello',
            propNumber: 10
        };

        testInsertAndGet(o1, o2).then(() => {
            done(new Error('Failed to find a difference in the objects'));
        }).catch((err) => {
            expect(err.message).to.equal('expected true to equal false');
            done();
        });
    });
});
