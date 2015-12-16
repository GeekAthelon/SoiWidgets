'use strict';
/* globals it: true, describe: true, before: true, beforeEach: true*/

const expect = require('chai').expect;
const btcConfig = require('../get-btc-config.js')();
const request = require('request');
const cheerio = require('cheerio');

class Soi {
    Soi() {}

    getRoom() {
        return new Promise((resolve, reject) => {
            request(btcConfig.soi.getUrl, function(error, response, body) {
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

    extractForm(html) {
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

    postSendRealData(data) {
        return new Promise((resolve, reject) => {
            request.post({
                url: btcConfig.soi.postUrl,
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

    postToRoom(text) {
        const promiseGetRoom = this.getRoom();
        const promiseExtractForm = promiseGetRoom.then((body) => {
            return this.extractForm(body);
        });

        const promisePostPromise = promiseExtractForm.then((data) => {
            //console.log('Form data...', data);
            data.vqxsp = text;
            return this.postSendRealData(data);
        });

        return Promise.all([
            promiseGetRoom,
            promiseExtractForm,
            promisePostPromise
        ]).then(function(results) {
            //console.log('Room updated');
            return; // something using both resultA and resultB
        }).catch((err) => {
            console.error('Soi.js: ', err);
        });
    }
}

exports = module.exports = new Soi();
