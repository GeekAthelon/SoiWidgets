/// <reference path="../../../typings/bluebird/bluebird.d.ts" />
/// <reference path="../interfaces/IPasswordInterface.ts" />

import * as Promise from 'bluebird';

const bcrypt = require('bcrypt-nodejs');

export default class PasswordHash implements IPasswordInterface {
    genSalt(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            bcrypt.genSalt(-1, (err, salt) => {
                /* istanbul ignore if */
                if (err) {
                    reject(err);
                }
                resolve(salt);
            });
        });
    }

    hash(salt: string, password: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            bcrypt.hash(password, salt, null, (err, hash) => {
                /* istanbul ignore if */
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    }

    compare(salt: string, password: string, hash: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            bcrypt.compare(password, hash, (err, res) => {
                /* istanbul ignore if */
                if (err) {
                    //reject(err);
                    console.log('There was an error in password-hash-bcrypt');
                    console.log(err);
                    resolve(false);
                }
                resolve(res);

            });
        });
    }
}