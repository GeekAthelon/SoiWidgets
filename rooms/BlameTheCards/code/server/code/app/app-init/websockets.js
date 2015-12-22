'use strict';

const sockjs = require('sockjs');
const psevents = require('../lib/pub-sub');
const RegisterUsers = require('../lib/register-users.js');
const registerUsers = new RegisterUsers();

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

    for (var ii = 0; ii < connections.length; ii++) {
        connections[ii].write(json);
    }
}

var webSocket = function(app, server) {
    const connections = [];
    let saveGameRooms = [];

    const chat = sockjs.createServer();
    chat.on('connection', function(conn) {
        connections.push(conn);
        var number = connections.length;
        conn.write('Welcome, User ' + number);

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

                if (o.type === 'request-room-list') {
                    console.log('*****');
                    sendRoomList(connections, saveGameRooms);
                    return;
                }
            });

        });
        conn.on('close', function() {
            for (var ii = 0; ii < connections.length; ii++) {
                connections[ii].write('User ' + number + ' has disconnected');
            }
        });
    });

    chat.installHandlers(server, {
        prefix: '/chat'
    });

    psevents.subscribe(`game.roomlist.changed`, (gameRooms) => {
        sendRoomList(connections, gameRooms);
        saveGameRooms = gameRooms;
    });
};

exports = module.exports = webSocket;
