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
        const o1 = databaseO.createEntity({
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        });

        return testInsertAndGet(o1, o1);
    });

    it('Testing insert of wrong object type', (done) => {
        new Promise((reject, resolve) => {
            void(resolve);
            void(reject);

            const o1 = {};

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
        const o1 = databaseO.createEntity({
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        });

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

    it('Testing getAll', (done) => {
        const o1 = databaseO.createEntity({
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        });

        collection.getAll().then(res => {
            expect(res.length).to.equal(0);
            return collection.insert(o1);
        }).then(() => {
            return collection.getAll();
        }).then(res => {
            expect(res.length).to.equal(1);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Testing where', (done) => {
        const o1 = databaseO.createEntity({
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        });

        const o2 = databaseO.createEntity({
            propBool: true,
            propString: 'Hello',
            propNumber: 5
        });

        return collection.insert([o1, o2]).then(() => {
            return collection.where('@propNumber==10');
        }).then(res => {
            expect(res.length).to.equal(1);
            const rec = res[0];
            expect(rec.propNumber).to.equal(10);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Testing Replace', (done) => {
        const o1 = databaseO.createEntity({
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        });

        const o2 = databaseO.createEntity({
            propBool: false,
            propString: 'World',
            propNumber: -1
        });

        let cid;

        return collection.insert(o1).then(_cid => {
            cid = _cid;
            return collection.replace(cid, o2);
        }).then(() => {
            return collection.get(cid);
        }).then(rec => {
            expect(rec.propBool).to.equal(o2.propBool);
            expect(rec.propString).to.equal(o2.propString);
            expect(rec.propNumber).to.equal(o2.propNumber);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Testing Update', (done) => {
        const o1 = databaseO.createEntity({
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        });

        const o2 = {
            propNumber: -1
        };

        let cid;

        return collection.insert(o1).then(_cid => {
            cid = _cid;
            return collection.update(cid, o2);
        }).then(() => {
            return collection.get(cid);
        }).then(rec => {
            expect(rec.propBool).to.equal(o1.propBool);
            expect(rec.propString).to.equal(o1.propString);
            expect(rec.propNumber).to.equal(o2.propNumber);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Testing Remove', (done) => {
        const o1 = databaseO.createEntity({
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        });

        let cid;

        return collection.insert(o1).then(_cid => {
            cid = _cid;
            return collection.remove(cid);
        }).then(() => {
            return collection.get(cid);
        }).then(rec => {
            expect(rec).to.equal(undefined);
            done();
        }).catch(err => {
            done(err);
        });
    });

});
