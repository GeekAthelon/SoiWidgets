'use strict';

const sockjs = require('sockjs');
const psevents = require('../lib/pub-sub');
const RegisterUsers = require('../lib/register-users.js');
const registerUsers = new RegisterUsers();
const Map = require('es6-map');

function sendRoomList(connections, gameRooms) {
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
        list: list
    });

    connections.forEach(function(value, key) {
        key.write(json);
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

                const details = connDetails.get(conn);

                if (details.soiNick !== o.soiNick) {
                    details.soiNick = o.soiNick;
                    details.roomName = o.roomName;
                    console.log('Should publish users here');
                }

                if (o.type === 'request-room-list') {
                    sendRoomList(connDetails, saveGameRooms);
                    return;
                }
            });

        });
        conn.on('close', function() {});
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
