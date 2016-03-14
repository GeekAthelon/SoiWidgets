/* globals it: true, describe: true, beforeEach:true */

const expect = require('chai').expect;
const linkManager = require('../src/lib/link-manager');

describe('Testing Link Manager', function() {
    'use strict';

    beforeEach(() => {});

    it('Testing nick formatting', () => {
        return linkManager.getRoomLinkAsync('entrance', 'priv', '-[Somebody]-')
            .then(res => {
                expect(res).to.equal('/room/entrance?nick=-%5BSomebody%5D-%40priv');
            });
    });

});
