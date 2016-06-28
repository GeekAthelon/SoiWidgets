/// <reference path="../../../typings/mocha/mocha.d.ts" />

const soiConfigP = require('../lib/loadJSON').loadFakeSoiConfig();
const expect = require('chai').expect;
import { Database } from '../lib/base-db';

interface ITestDatabase {
    propBool: boolean;
    propString: string;
    propNumber: number;
}

describe('Testing base database functions', function() {
    let collection: Database<ITestDatabase>;

    before(() => {
        return soiConfigP.then((soiConfig: IFakeSoiConfig) => {
            collection = new Database<ITestDatabase>(soiConfig.db.current, '/test', true);
        });
    });

    beforeEach(() => {
        return collection.removeAllAsync();
    });

    it('Testing that the test is alive', () => {
        expect(1).to.equal(1);
    });

    function testInsertAndGet(o1, o2) {
        let cid;

        return collection.insertAsync(o1).then(_cid => {
            cid = _cid;

            expect(typeof cid).to.equal('number');

            return collection.getAsync(cid).then(o => {
                expect(o.propBool).to.equal(o2.propBool);
                expect(o.propString).to.equal(o2.propString);
                expect(o.propNumber).to.equal(o2.propNumber);
            });
        });
    }

    it('Testing insert one object (match)', () => {
        const o1: ITestDatabase = {
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        };

        return testInsertAndGet(o1, o1);
    });

    it('Testing insert one object (failure)', (done) => {
        const o1: ITestDatabase = {
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        };

        const o2: ITestDatabase = {
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

    it('Testing getAll', (done) => {
        const o1: ITestDatabase = {
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        };

        collection.getAllAsync().then(res => {
            expect(res.length).to.equal(0);
            return collection.insertAsync(o1);
        }).then(() => {
            return collection.getAllAsync();
        }).then(res => {
            expect(res.length).to.equal(1);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Testing where', (done) => {
        const o1: ITestDatabase = {
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        };

        const o2: ITestDatabase = {
            propBool: true,
            propString: 'Hello',
            propNumber: 5
        };

        return collection.insertAsync([o1, o2]).then(() => {
            return collection.whereAsync('@propNumber==10');
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
        const o1: ITestDatabase = {
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        };

        const o2: ITestDatabase = {
            propBool: false,
            propString: 'World',
            propNumber: -1
        };

        let cid;

        return collection.insertAsync(o1).then(_cid => {
            cid = _cid;
            return collection.replaceAsync(cid, o2);
        }).then(() => {
            return collection.getAsync(cid);
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
        const o1: ITestDatabase = {
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        };

        const o2: ITestDatabase = {
            propBool: undefined,
            propString: undefined,
            propNumber: -1
        };

        let cid;

        return collection.insertAsync(o1).then(_cid => {
            cid = _cid;
            return collection.updateAsync(cid, o2);
        }).then(() => {
            return collection.getAsync(cid);
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
        const o1: ITestDatabase = {
            propBool: true,
            propString: 'Hello',
            propNumber: 10
        };

        let cid;

        return collection.insertAsync(o1).then(_cid => {
            cid = _cid;
            return collection.removeAsync(cid);
        }).then(() => {
            return collection.getAsync(cid);
        }).then(rec => {
            expect(rec).to.equal(undefined);
            done();
        }).catch(err => {
            done(err);
        });
    });

    it('Testing Save', (done) => {
        return collection.saveAsync().then(() => {
            done();
        }).catch(err => {
            done(err);
        });
    });
});
