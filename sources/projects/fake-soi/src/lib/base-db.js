'use strict';

const Locallydb = require('locallydb');
const soiConfig = require('../fake-soi-get-config')();
const db = new Locallydb(soiConfig.db.current);

class BaseDatabase {
    constructor(collection) {
        this.collection = db.collection(collection);
    }

    verifyType(o) {
        if (o['$$hiddentype$$'] !== this.hiddenType) {
            throw new Error(`Passed object is of the wrong type. ` +
                `Expected "${this.hiddenType}" and found "${o['$$hiddentype$$']}"`);
        }
    }

    insert(data) {
        this.verifyType(data);
        return new Promise((resolve, reject) => {
            void(reject);
            const ret = this.collection.insert(data);
            resolve(ret);
        });
    }

    where(phrase) {
        return this.collection.where(phrase);
    }

    get(cid) {
        return new Promise((resolve, reject) => {
            void(reject);
            const ret = this.collection.get(cid);
            resolve(ret);
        });
    }

    getAll() {
        return this.collection.items;
    }

    update(cid, data) {
        this.collection.update(cid, data);
    }

    replace(cid, data) {
        this.collection.replace(cid, data);
    }

    remove(cid) {
        this.collection.remove(cid);
    }

    save() {
        this.collection.save();
    }

    removeAll() {
        return new Promise((resolve, reject) => {
            this.collection.items.forEach(rec => {
                this.remove(rec.cid);
            });

            if (this.collection.items.length !== 0) {
                reject(new Error('removeAll has failed'));
            }
            resolve();
        });
    }
}

exports = module.exports = BaseDatabase;
