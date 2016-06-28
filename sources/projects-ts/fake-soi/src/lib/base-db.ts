/// <reference path="../../../../typings/bluebird/bluebird.d.ts" />
import * as Promise from 'bluebird';

const Locallydb = require('locallydb');

interface ILocallyDBCollection {
    insert(data: any): any;
    where(data: any): any;
    get(cid: number): any;
    update(cid: number, data: any): void;
    replace(cid: number, data: any): void;
    remove(cid: number): void;
    save(): void;
    items: any[];
}

export interface IDatabase {
    collection: ILocallyDBCollection;
    hiddenType: string;
}

export class Database<T> implements IDatabase {
    collection: ILocallyDBCollection;
    hiddenType: string;
    db: any;

    constructor(collectionDir: string, collectionName: string, autosave: boolean) {
        const db = new Locallydb(collectionDir);
        this.collection = db.collection(collectionName, autosave);
    }

    insertAsync(data: T);
    insertAsync(data: T[]);
    insertAsync(data: any): Promise<T> {
        const ret = this.collection.insert(data);
        return Promise.resolve(ret);
    }

    whereAsync(phrase: any): Promise<T[]> {
        const list = this.collection.where(phrase);
        return Promise.resolve(list.items);
    }

    getAsync(cid): Promise<T> {
        const ret = this.collection.get(cid);
        return Promise.resolve(ret);
    }

    getAllAsync(): Promise<T[]> {
        return Promise.resolve(this.collection.items);
    }

    updateAsync(cid: number, data: T) {
        this.collection.update(cid, data);
        return Promise.resolve();
    }

    replaceAsync(cid: number, data: T) {
        this.collection.replace(cid, data);
        return Promise.resolve();
    }

    removeAsync(cid) {
        this.collection.remove(cid);
        return Promise.resolve();
    }

    saveAsync() { /* istanbul ignore next */
        this.collection.save();
        return Promise.resolve();
    }

    removeAllAsync() {
        while (this.collection.items.length) {
            const cid = this.collection.items[0].cid;
            this.removeAsync(cid);
        }

        return Promise.resolve();
    }
}
