(function() {
    'use strict';
    const btcConfig = require('../get-btc-config.js')();
    const request = require('request');
    const cheerio = require('cheerio');

    class Soi {
        constructor() {
            this.timeoutDelay = 10 * 1000;
        }

        _getSoi(url) {
            return new Promise((resolve, reject) => {
                request(url, function(error, response, body) {
                    //console.log('_getSOI');
                    //console.log(url);
                    /* istanbul ignore if */
                    if (error) {
                        console.error('getRoom');
                        reject(error);
                        return;
                    }

                    if (!error && response.statusCode === 200) {
                        resolve(body);
                        return;
                    }

                    reject(new Error(`_getSoi unknown error: ${response.statusCode}`));
                });
            });
        }

        _extractForm(html) {
            return new Promise((resolve, reject) => {
                void(reject);
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
                void(reject);
                setTimeout(() => {
                    resolve();
                }, this.timeoutDelay);
            });
        }

        _soiPost(url, data) {
            return new Promise((resolve, reject) => {
                request.post({
                    url: url,
                    form: data
                }, function(err, response, body) {
                    //console.log('_soiPOST');
                    /* istanbul ignore if */
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (!err && response.statusCode === 200) {
                        resolve(body);
                        return;
                    }

                    reject(new Error(`_getPost unknown error: ${response.statusCode}`));
                });

            });
        }

        _executePost(src, text, destUser) {
            return new Promise((resolve, reject) => {
                this._delay().then(() => {
                    reject(new Error('_executePost: Request timed Out'));
                });

                const promiseGetRoom = this._getSoi(src.getUrl);
                const promiseExtractForm = promiseGetRoom.then((body) => {
                    return this._extractForm(body);
                });

                const promisePostPromise = promiseExtractForm.then((data) => {
                    //console.log('Form data...', data);
                    data.vqxsp = text;
                    if (destUser) {
                        data.vqxto = destUser;
                    }
                    return this._soiPost(src.postUrl, data);
                });

                return Promise.all([
                    promiseGetRoom,
                    promiseExtractForm,
                    promisePostPromise,
                ]).then(function(results) {
                    void(results);
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
            return this._executePost(btcConfig.soi, text);
        }

        postToMail(text, user) {
            return this._executePost(btcConfig.soiMail, text, user);
        }
    }

    exports = module.exports = new Soi();
}());
