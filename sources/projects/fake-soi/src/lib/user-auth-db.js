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

exports = module.exports = {
    Database: UserAuthDatabase,
    createEntity: createUserAuthEntity
};
