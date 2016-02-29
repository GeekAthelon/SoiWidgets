'use strict';

const Locallydb = require('locallydb');
const soiConfig = require('../fake-soi-get-config')();
const db = new Locallydb(soiConfig.db.current);

class BaseDatabase {
    constructor(collectionName) {
        this.collection = db.collection(collectionName);
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

    insert(data) {
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

    where(phrase) {
        return new Promise((resolve, reject) => {
            void(reject);
            const list = this.collection.where(phrase);
            const ret = this._mapAll(list.items);
            resolve(ret);
        });
    }

    get(cid) {
        return new Promise((resolve, reject) => {
            void(reject);
            const ret = this.collection.get(cid);
            resolve(ret);
        });
    }

    getAll() {
        return new Promise((resolve, reject) => {
            void(reject);
            const ret = this._mapAll(this.collection.items);
            resolve(ret);
        });
    }

    update(cid, data) {
        this.collection.update(cid, data);
    }

    replace(cid, data) {
        this.verifyType(data);

        return new Promise((resolve, reject) => {
            void(reject);
            this.collection.replace(cid, data);
            resolve();
        });
    }

    remove(cid) {
        this.collection.remove(cid);
    }

    save() {
        this.collection.save();
    }

    removeAll() {
        return new Promise((resolve, reject) => {
            void(reject);
            while (this.collection.items.length) {
                const cid = this.collection.items[0].cid;
                this.remove(cid);
            }

            resolve();
        });
    }
}

exports = module.exports = BaseDatabase;
