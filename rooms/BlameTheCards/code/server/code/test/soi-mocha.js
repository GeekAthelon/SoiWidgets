'use strict';

/* globals it: true, describe: true, before: true, beforeEach: true, afterEach: true*/

const expect = require('chai').expect;
const soi = require('../app/lib/soi');
const soiMocker = require('./soi-mocker');
const saveDelay = soi.timeoutDelay;

describe('SOI Communication Tests', () => {
    beforeEach(function() {});

    afterEach(function() {
        soiMocker.cleanAll();
        soi.timeoutDelay = saveDelay;
    });

    before(function() {});

    it('SOI communications module is alive', function() {
        expect(soi instanceof Object).to.equal(true);
    });

    it('Performing mock SOI room post', () => {
        soiMocker.mockGetBtcRoom();
        soiMocker.mockPostToSoi();
        return soi.postToRoom('Test message');
    });

    it('Performing mock SOI mail post', () => {
        soiMocker.mockGetSoiMailRoom();
        soiMocker.mockPostToSoi();
        return soi.postToMail('Mail message');
    });

    it('Performing mock SOI mail post with error in GetRoom', (done) => {
        soiMocker.mockGetBtcRoomError();
        soiMocker.mockPostToSoi();
        soi.postToMail('Mail message', 'nobody@priv').catch(() => {
            expect(true).to.equal(true);
            done();
        });
    });

    it('Performing mock SOI mail post with error in Post', (done) => {
        soiMocker.mockGetSoiMailRoom();
        soiMocker.mockPostToSoiError();
        soi.postToMail('Mail message', 'nobody@priv').then(() => {
            expect(false).to.equal(true);
            done();
        }).catch(() => {
            expect(true).to.equal(true);
            done();
        });
    });

    it('Performing mock SOI mail post with forced timeout', (done) => {
        soiMocker.mockGetSoiMailRoom();
        soiMocker.mockPostToSoi();
        soi.timeoutDelay = 1;
        soi.postToMail('Mail message', 'nobody@priv').catch(err => {
            expect(err.message).to.equal('_executePost: Request timed Out');
            done();
        });
    });
});
