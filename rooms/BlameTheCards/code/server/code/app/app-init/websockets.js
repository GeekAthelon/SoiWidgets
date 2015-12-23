'use strict';

const sockjs = require('sockjs');
const psevents = require('../lib/pub-sub');
const RegisterUsers = require('../lib/register-users.js');
const registerUsers = new RegisterUsers();

/* jshint -W079 */
const Map = require('es6-map'); // Ignore redefinition.
/* jshint +W079 */

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
                    }

                    if (o.type === 'request-room-list') {
                        sendRoomList(connDetails, saveGameRooms);
                        return;
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
