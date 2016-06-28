'use strict';

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

    verifyType(o: T): void {
        if (o['$$hiddentype$$'] !== this.hiddenType) {
            throw new Error(`Passed object is of the wrong type. ` +
                `Expected "${this.hiddenType}" and found "${o['$$hiddentype$$']}"`);
        }
    }

    insertAsync(data: T);
    insertAsync(data: T[]);
    insertAsync(data: any): Promise<T> {
        if (data.length) {
            data.forEach(item => this.verifyType(item));
        } else {
            this.verifyType(data);
        }

        return new Promise<T>((resolve, reject) => {
            void (reject);
            const ret = this.collection.insert(data);
            resolve(ret);
        });
    }

    whereAsync(phrase: any): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            void (reject);
            const list = this.collection.where(phrase);
            resolve(list.items);
        });
    }

    getAsync(cid): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            void (reject);
            const ret = this.collection.get(cid);
            resolve(ret);
        });
    }

    getAllAsync(): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {
            void (reject);
            resolve(this.collection.items);
        });
    }

    updateAsync(cid: number, data: T) {
        return new Promise((resolve, reject) => {
            void (reject);
            this.collection.update(cid, data);
            resolve();
        });
    }

    replaceAsync(cid: number, data: T) {
        this.verifyType(data);
        return new Promise((resolve, reject) => {
            void (reject);
            this.collection.replace(cid, data);
            resolve();
        });
    }

    removeAsync(cid) {
        return new Promise((resolve, reject) => {
            void (reject);
            this.collection.remove(cid);
            resolve();
        });
    }

    saveAsync() { /* istanbul ignore next */
        return new Promise((resolve, reject) => {
            void (reject);
            this.collection.save();
            resolve();
        });
    }

    removeAllAsync() {
        return new Promise((resolve, reject) => {
            void (reject);
            while (this.collection.items.length) {
                const cid = this.collection.items[0].cid;
                this.removeAsync(cid);
            }

            resolve();
        });
    }
}

