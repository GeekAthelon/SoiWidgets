'use strict';

let allRooms = ['_controls', 'entrance'];

let rooms = {};

function getRoomPath(roomName) {
    return `/static/room/${roomName}/static`;
}

function translateUrl(s, roomName) {
    const url = getRoomPath(roomName) + '/';
    const regex = new RegExp('~/', 'g');
    return s.replace(regex, url);
}

function getFullRoomList() {
    return allRooms;
}

function getPlayerRoomList() {
    return allRooms.filter(p => p !== '_controls');
}

function get(roomName) {
    return rooms[roomName];
}

function load(roomName) {
    const roomPath = `../../rooms/${roomName}/config`;
    const roomData = require(roomPath);
    roomData.body.background = translateUrl(roomData.body.background, roomName);

    return roomData;
}

function loadAllRooms() {
    allRooms.forEach(roomName => {
        const roomData = load(roomName);
        rooms[roomName] = roomData;
    });
}

const roomConfig = {
    get: get,
    loadAllRooms: loadAllRooms,
    getFullRoomList: getFullRoomList,
    getPlayerRoomList: getPlayerRoomList,
    getRoomPath: getRoomPath
};

exports = module.exports = roomConfig;
