'use strict';

const bcrypt = require('bcrypt-nodejs');


function genSalt() {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(-1, (err, salt) => {
            /* istanbul ignore if */
            if (err) {
                reject(err);
            }
            resolve(salt);
        });
    });
}

function hash(salt, password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, salt, null, (err, hash) => {
            /* istanbul ignore if */
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(hash);
        });
    });

}


function compare(salt, password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, res) => {
            /* istanbul ignore if */
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve(res);

        });
    });
}


const passwordHash = {
    genSalt: genSalt,
    hash: hash,
    compare: compare
};


exports = module.exports = passwordHash;
