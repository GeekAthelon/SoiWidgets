'use strict';

const sockjs = require('sockjs');
const psevents = require('../lib/pub-sub');

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

            console.log(o);

            if (o.type === 'request-room-list') {
                console.log('*****');
                sendRoomList(connections, saveGameRooms);
                return;
            }
            for (var ii = 0; ii < connections.length; ii++) {
                connections[ii].write('User ' + number + ' says: ' + message);
            }
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
