'use strict';

const BaseDatabase = require('./base-db');
const hiddenType = 'UserAuthEntity';

class UserAuthDatabase extends BaseDatabase {
    constructor() {
        super('user-auth', false);
        this.hiddenType = hiddenType;
        this._createEntity = createUserAuthEntity;
    }
}

const collection = new UserAuthDatabase();

function UserAuthEntity() {
    this.nickName = '';
    this.isAdmin = false;
    this.password = '';
    this.salt = '';

    this.cid = 0;
    this['$$hiddentype$$'] = hiddenType;
    this['$created'] = null;
    this['$updated'] = null;
}

function createUserAuthEntity(o1) {
    const o = new UserAuthEntity();
    Object.seal(o);

    if (o1) {
        Object.keys(o1).forEach(key => {
            o[key] = o1[key];
        });
    }

    return o;
}

function isRegisteredUserAsync(nick) {
    return new Promise((resolve, reject) => {
        void(reject);
        collection.whereAsync(`@nickName=='${nick}'`)
            .then(list => {
                resolve(list.length === 1);
            });
    });
}

exports = module.exports = {
    collection: collection,
    createEntity: createUserAuthEntity,
    isRegisteredUserAsync: isRegisteredUserAsync
};
