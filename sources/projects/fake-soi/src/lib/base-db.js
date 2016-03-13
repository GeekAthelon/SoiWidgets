'use strict';

const Locallydb = require('locallydb');
const soiConfig = require('../fake-soi-get-config')();
const db = new Locallydb(soiConfig.db.current);

class BaseDatabase {
    constructor(collectionName, autosave) {
        this.collection = db.collection(collectionName, autosave);
    }

    _mapAll(list) {
        const ret = list.map(this._createEntity);
        return ret;
    }

    verifyType(o) {
        if (o['$$hiddentype$$'] !== this.hiddenType) {
            throw new Error(`Passed object is of the wrong type. ` +
                `Expected "${this.hiddenType}" and found "${o['$$hiddentype$$']}"`);
        }
    }

    insertAsync(data) {
        if (data.length) {
            data.forEach(item => this.verifyType(item));
        } else {
            this.verifyType(data);
        }

        return new Promise((resolve, reject) => {
            void(reject);
            const ret = this.collection.insert(data);
            resolve(ret);
        });
    }

    whereAsync(phrase) {
        return new Promise((resolve, reject) => {
            void(reject);
            const list = this.collection.where(phrase);
            const ret = this._mapAll(list.items);
            resolve(ret);
        });
    }

    getAsync(cid) {
        return new Promise((resolve, reject) => {
            void(reject);
            const ret = this.collection.get(cid);
            resolve(ret);
        });
    }

    getAllAsync() {
        return new Promise((resolve, reject) => {
            void(reject);
            const ret = this._mapAll(this.collection.items);
            resolve(ret);
        });
    }

    updateAsync(cid, data) {
        return new Promise((resolve, reject) => {
            void(reject);
            this.collection.update(cid, data);
            resolve();
        });
    }

    replaceAsync(cid, data) {
        this.verifyType(data);
        return new Promise((resolve, reject) => {
            void(reject);
            this.collection.replace(cid, data);
            resolve();
        });
    }

    removeAsync(cid) {
        return new Promise((resolve, reject) => {
            void(reject);
            this.collection.remove(cid);
            resolve();
        });
    }

    saveAsync() { /* istanbul ignore next */
        return new Promise((resolve, reject) => {
            void(reject);
            this.collection.save();
            resolve();
        });
    }

    removeAllAsync() {
        return new Promise((resolve, reject) => {
            void(reject);
            while (this.collection.items.length) {
                const cid = this.collection.items[0].cid;
                this.removeAsync(cid);
            }

            resolve();
        });
    }
}

exports = module.exports = BaseDatabase;
