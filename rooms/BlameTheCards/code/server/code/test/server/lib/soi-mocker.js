'use strict';

const nock = require('nock');
const urlLib = require('url');
const btcConfig = require('../../../app/get-btc-config.js')();

function convertQueryStringToObject(s) {
    const pairs = s.split('&');

    const result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    return result;
}

const mockGetBtcRoom = function() {
    const d = urlLib.parse(btcConfig.soi.getUrl);

    const url = `${d.protocol}//${d.host}`;
    const query = `${d.pathname}`;

    const queryObject = convertQueryStringToObject(d.query);

    const scope = nock(url)
        .get(query)
        .once()
        .query(queryObject)
        .replyWithFile(200, __dirname + '/mock-data/soi-btc-page.html');

    return scope;
};

const mockGetBtcRoomError = function() {
    const d = urlLib.parse(btcConfig.soi.getUrl);
    const url = `${d.protocol}//${d.host}`;
    const query = `${d.pathname}`;

    const queryObject = convertQueryStringToObject(d.query);

    const scope = nock(url)
        .get(query)
        .once()
        .query(queryObject)
        .reply(404);

    return scope;
};

const mockGetSoiMailRoom = function() {
    const d = urlLib.parse(btcConfig.soiMail.getUrl);

    const url = `${d.protocol}//${d.host}`;
    const query = `${d.pathname}`;

    const queryObject = convertQueryStringToObject(d.query);

    const scope = nock(url)
        .get(query)
        .once()
        .query(queryObject)
        .replyWithFile(200, __dirname + '/mock-data/soi-mail-room.html');

    return scope;
};

const mockPostToSoi = function() {
    const d = urlLib.parse(btcConfig.soi.postUrl);

    const url = `${d.protocol}//${d.host}`;
    const query = `${d.pathname}`;

    const scope = nock(url)
        .post(query)
        .once()
        .query(true)
        .reply(200, 'Data');

    return scope;
};

const mockPostToSoiError = function() {
    const d = urlLib.parse(btcConfig.soi.postUrl);

    const url = `${d.protocol}//${d.host}`;
    const query = `${d.pathname}`;

    const scope = nock(url)
        .post(query)
        .once()
        .query(true)
        .reply(404);

    return scope;
};

const cleanAll = function() {
    nock.cleanAll();
};

exports = module.exports = {
    mockGetBtcRoom,
    mockGetSoiMailRoom,
    mockPostToSoi,
    mockGetBtcRoomError,
    mockPostToSoiError,
    cleanAll
};
