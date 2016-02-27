function getRoomConfig(roomName) {
    'use strict';

    const roomPath = '../../rooms/' + roomName;
    const roomData = require(roomPath);
    return roomData;
}

exports = module.exports = getRoomConfig;
