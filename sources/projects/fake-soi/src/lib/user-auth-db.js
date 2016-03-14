'use strict';

const BaseDatabase = require('./base-db');
const hiddenType = 'UserAuthEntity';

// jshint -W079
const Promise = require('bluebird');
// jshint +W079

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

function gatherUserDataAsync(fullNick) {
    //TODO: Tie this into the database sometime.

    return new Promise((resolve, reject) => {
        void(reject);
        const userData = {};

        const t = fullNick.split('@');
        const nick = t[0];
        const tail = t[1] || 'priv';

        userData.simpleNick = nick.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
        userData.tail = tail;
        userData.prettyNick = nick;
        userData.isAuth = true;
        userData.isVisitor = true;

        isRegisteredUserAsync(nick).then(isRegistered => {
            userData.isRegistered = isRegistered;
        }).then(() => {

            if (fullNick === '') {
                userData.isAuth = false;
            }

            resolve(userData);
        });
    });
}

exports = module.exports = {
    collection: collection,
    createEntity: createUserAuthEntity,
    isRegisteredUserAsync: isRegisteredUserAsync,
    gatherUserDataAsync: gatherUserDataAsync
};
