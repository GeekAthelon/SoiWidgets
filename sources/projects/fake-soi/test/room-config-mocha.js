/* globals it: true, describe: true */

const expect = require('chai').expect;

const roomConfig = require('../src/lib/room-config');

describe('Get Room Config', function() {
    'use strict';

    it('Basic is alive', function() {
        expect(true).to.equal(true);
    });

    it('getRoomConfig should return a value', function() {
        const roomData = roomConfig.getcd('_controls');
        expect(roomData).to.not.equal(undefined);
        expect(roomData).to.not.equal(null);
    });
});
