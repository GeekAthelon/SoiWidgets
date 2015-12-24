'use strict';

const sockjs = require('sockjs');
const psevents = require('../lib/pub-sub');
const RegisterUsers = require('../lib/register-users.js');
const registerUsers = new RegisterUsers();
const gRooms = require('../lib/game-room');

/* jshint -W079 */
const Map = require('es6-map'); // Ignore redefinition.
/* jshint +W079 */

function addOneMessageToList(details) {
    const d = {
        from: details.soiNick,
        room: details.roomName,
        to: details.to,
        message: details.message,
        timeStamp: new Date().toISOString()
    };

    if (d.to === '') {
        d.to = null;
    }
    psevents.publish('room.message', JSON.stringify(d));
}

function sendOneMessageToRoom(connections, details) {
	const room = details.room;

    const json = JSON.stringify({
        type: 'one-message',
        roomName: details.room,
        details: details,
    });

    connections.forEach(function(detail, key) {
        if (detail.roomName === room) {
            key.write(json);
        }
    });
}

function sendAllMessages(conn, details) {
    const messages = gRooms.getMessages(details.roomName, details.soiNick);
    if (messages.length === 0) {
        return;
    }

    const json = JSON.stringify({
        type: 'all-messages',
        roomName: details.roomName,
        list: messages
    });

    conn.write(json);
}

function sendPlayerList(connections, roomName) {
    const playerList = [];

    connections.forEach(function(detail) {
        if (detail.roomName === roomName) {
            playerList.push(detail.soiNick);
        }
    });

    const json = JSON.stringify({
        type: 'player-list',
        roomName: roomName,
        list: playerList
    });

    connections.forEach(function(detail, key) {
        if (detail.roomName === roomName) {
            key.write(json);
        }
    });
}

function sendRoomList(connections, gameRooms) {
    const roomName = null;
    const list = Object.keys(gameRooms).map((roomName) => {
        const r = gameRooms[roomName];

        return {
            roomName: roomName,
            theme: r.theme,
            owner: r.owner
        };
    });

    const json = JSON.stringify({
        type: 'room-list',
        roomName: roomName,
        list: list
    });

    connections.forEach(function(detail, key) {
        if (detail.roomName === roomName) {
            key.write(json);
        }
    });
}

var webSocket = function(app, server) {
    const connDetails = new Map();
    let saveGameRooms = {};

    psevents.subscribe('room.message', (json) => {
        const details = JSON.parse(json);
        sendOneMessageToRoom(connDetails, details)
    });

    const chat = sockjs.createServer();
    chat.on('connection', function(conn) {
        const details = {
            conn,
            soiNick: '-waiting'
        };

        connDetails.set(conn, details);

        conn.on('data', function(message) {
            let o;
            try {
                o = JSON.parse(message);
            } catch (err) {
                void(err);
                o = {};
            }

            registerUsers.verify(o.soiNick, o.token).then(isVerified => {
                if (!isVerified) {
                    conn.write('User validation failed');
                    return;
                }

                try {
                    const details = connDetails.get(conn);

                    if (details.soiNick !== o.soiNick) {
                        details.soiNick = o.soiNick;
                        details.roomName = o.roomName;
                        sendPlayerList(connDetails, o.roomName);

                        const d = {
                            from: null,
                            room: o.roomName,
                            to: null,
                            message: `User ${o.soiNick} has entered the room`,
                            timeStamp: new Date().toISOString()
                        };

                        psevents.publish('room.message', JSON.stringify(d));
                        setTimeout(() => {
                            sendAllMessages(conn, details);
                        }, 100);
                    }

                    switch (o.type) {
                        case 'request-room-list':
                            sendRoomList(connDetails, saveGameRooms);
                            break;
                        case 'send-room-message':
                            addOneMessageToList(o);
                            break;
                    }
                } catch (err) {
                    console.trace(err, 'An error happened in `ondata`');
                }
            });
        });
        conn.on('close', function() {
            const details = connDetails.get(conn);
            connDetails.delete(conn);
            sendPlayerList(connDetails, details.roomName);
        });
    });

    chat.installHandlers(server, {
        prefix: '/chat'
    });

    psevents.subscribe(`game.roomlist.changed`, (gameRooms) => {
        sendRoomList(connDetails, gameRooms);
        saveGameRooms = gameRooms;
    });
};

exports = module.exports = webSocket;
