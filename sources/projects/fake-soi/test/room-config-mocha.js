/* globals it: true, describe: true, before */

const expect = require('chai').expect;

const roomConfig = require('../src/lib/room-config');

describe('Get Room Config', function() {
    'use strict';

    before(() => {
        roomConfig.loadAllRooms();
    });

    it('Basic is alive', function() {
        expect(true).to.equal(true);
    });

    it('roomConfig.get should return a value', function() {
        const roomData = roomConfig.get('_controls');
        expect(roomData).to.not.equal(undefined);
        expect(roomData).to.not.equal(null);
    });

    it('roomConfig.getRoomList should return a value', function() {
        const roomList = roomConfig.getRoomList();
        expect(roomList.length > 0).to.equal(true);

    });
});
