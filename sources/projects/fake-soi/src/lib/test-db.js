'use strict';

const BaseDatabase = require('./base-db');
const hiddenType = 'TestEntity';

class TestDatabase extends BaseDatabase {
    constructor() {
        super('test');
        this.hiddenType = hiddenType;
    }
}

function TestEntity() {
    this.propBool = false;
    this.propString = '';
    this.propNumber = 0;

    this.cid = 0;
    this['$$hiddentype$$'] = hiddenType;
    this['$created'] = null;
    this['$updated'] = null;
}

function createTestEntity() {
    const o = new TestEntity();
    Object.seal(o);
    return o;
}

exports = module.exports = {
    Database: TestDatabase,
    createEntity: createTestEntity
};
