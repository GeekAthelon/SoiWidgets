'use strict';
/* globals it: true, describe: true, before: true, beforeEach: true*/

const expect = require('chai').expect;
const btcConfig = require('../get-btc-config.js')();
const request = require('request');
const cheerio = require('cheerio');

class Soi {
    Soi() {}

    _getSoi(url) {
        return new Promise((resolve, reject) => {
            request(url, function(error, response, body) {
                if (error) {
                    console.error('getRoom');
                    reject(error);
                }
                if (!error && response.statusCode === 200) {
                    resolve(body);
                }
            });
        });
    }

    _extractForm(html) {
        return new Promise((resolve, reject) => {
            const $ = cheerio.load(html);
            const $entryForm = $('[name="vqxsp"]').closest('form');
            const formArray = $entryForm.serializeArray();

            const result = {};
            formArray.map((val) => {
                result[val.name] = val.value;
            });
            resolve(result);
        });
    }

    _delay() {
        return new Promise((resolve, reject) => {
            setTimeout(function() {
                resolve();
            }, 10 * 1000);
        });
    }

    _soiPost(url, data) {
        return new Promise((resolve, reject) => {
            request.post({
                url: url,
                form: data
            }, function(err, response, body) {
                if (err) {
                    console.error('postSendRealData');
                    reject(err);
                }
                if (!err && response.statusCode === 200) {
                    resolve(body);
                }
            });

        });
    }

    _executePost(src, text, destUser) {
        return new Promise((resolve, reject) => {
            this._delay().then(() => {
                console.log('The timeout happened');
                reject();
            });

            const promiseGetRoom = this._getSoi(src.getUrl);
            const promiseExtractForm = promiseGetRoom.then((body) => {
                return this._extractForm(body);
            });

            const promisePostPromise = promiseExtractForm.then((data) => {
                //console.log('Form data...', data);
                data.vqxsp = text;
                //data.vqxto = 'athelon@soi';
                return this._soiPost(src.postUrl, data);
            });

            return Promise.all([
                promiseGetRoom,
                promiseExtractForm,
                promisePostPromise,
            ]).then(function(results) {
                //console.log('Room updated');
                resolve();
                //return; // something using both resultA and resultB
            }).catch((err) => {
                console.error('Soi.js: ', err);
                reject(err);
            });
        });
    }

    postToRoom(text) {
        console.log('Sending..', text);
        return this._executePost(btcConfig.soi, text);
    }
}

exports = module.exports = new Soi();
