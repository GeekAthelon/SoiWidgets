'use strict';

let allRooms = ['_controls'];

let app = null;
let express = null;
let rooms = {};

function getRoomPath(roomName) {
    return `/static/room/${roomName}/static`;
}

function translateUrl(s, roomName) {
    const url = getRoomPath(roomName) + '/';
    const regex = new RegExp('~/', 'g');
    return s.replace(regex, url);
}

function setApp(_app, _express) {
    app = _app;
    express = _express;
}

function getRoomList() {
    return allRooms;
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
    setApp: setApp,
    loadAllRooms: loadAllRooms,
    getRoomList: getRoomList,
    getRoomPath: getRoomPath
};

exports = module.exports = roomConfig;
