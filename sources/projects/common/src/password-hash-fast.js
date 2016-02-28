'use strict';

const bcrypt = require('bcrypt-nodejs');

let longStr = 'XXXXXXXXXX';
longStr += longStr;
longStr += longStr;
longStr += longStr;

/**
 * Calculate a 32 bit FNV-1a hash
 * Found here: https://gist.github.com/vaiorabbit/5657561
 * Ref.: http://isthe.com/chongo/tech/comp/fnv/
 *
 * @param {string} str the input value
 * @param {boolean} [asString=false] set to true to return the hash value as
 *     8-digit hex string instead of an integer
 * @param {integer} [seed] optionally pass the hash of the previous chunk
 * @returns {integer | string}
 */
const hashFnv32a = function(str, asString, seed) {
    /*jshint bitwise:false */
    let i, l,
        hval = (seed === undefined) ? 0x811c9dc5 : /* istanbul ignore next */
        seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) +
            (hval << 24);
    }

    /* istanbul ignore else */
    if (asString) {
        // Convert to 8 digit hex string
        return ('0000000' + (hval >>> 0).toString(16)).substr(-8);
    }
    /* istanbul ignore next */
    return hval >>> 0;
};

function padHash(hash) {
    return (longStr + hash).substr(-60);
}

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
        void(reject);
        let hash = hashFnv32a(salt + password, true);
        hash = padHash(hash);
        resolve(hash);
    });
}

function compare(salt, password, hash) {
    return new Promise((resolve, reject) => {
        void(reject);
        let newhash = hashFnv32a(salt + password, true);
        newhash = padHash(newhash);
        resolve(hash === newhash);
    });
}

const passwordHash = {
    genSalt: genSalt,
    hash: hash,
    compare: compare
};

exports = module.exports = passwordHash;
