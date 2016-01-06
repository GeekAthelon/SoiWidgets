'use strict';

const sockjs = require('sockjs');
const psevents = require('../lib/pub-sub');
const RegisterUsers = require('../lib/register-users.js');
const registerUsers = new RegisterUsers();
const gRooms = require('../lib/game-room');
const ConnectionManager = require('../lib/connection-manager');

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

function sendOneMessageToRoom(connectionManager, details) {
    const json = JSON.stringify({
        type: 'one-message',
        roomName: details.room,
        details: details,
    });

    const sendOneMessageToRoomConnections = connectionManager.buildConnectionsForRoom(details.room);

    sendOneMessageToRoomConnections.forEach(function(key) {
        key.write(json);
    });
}

function sendAllMessages(conn, details) {
    console.log('**SENDALLMESSAGES**');
    return;
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

function sendPlayerList(connectionManager, roomName) {
    const playerList = connectionManager.buildPlayerListForRoom(roomName);
	
    const json = JSON.stringify({
        type: 'player-list',
        roomName: roomName,
        list: playerList
    });

   const connections = connectionManager.buildConnectionsForRoom(roomName);

    connections.forEach(function(conn) {
            conn.write(json);
    });
}

function sendRoomList(sendRoomConnectionManager, gameRooms) {
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

    const connections = sendRoomConnectionManager.buildConnectionsForRoom(null);
    connections.forEach(function(conn) {
        conn.write(json);
    });
}

const webSocket = function(app, server) {
    let saveGameRooms = {};
    const connectionManager = new ConnectionManager();

    psevents.subscribe('room.message', (json) => {
        const details = JSON.parse(json);
        sendOneMessageToRoom(connectionManager, details);
    });

    const chat = sockjs.createServer();
    chat.on('connection', function(conn) {

        connectionManager.addConnection(conn);

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
                    const isFirstUpdate = connectionManager
                        .updateDetails(conn, o.soiNick, o.roomName);

                    const details = connectionManager.connections.get(conn);

                    if (isFirstUpdate) {
                        sendPlayerList(connectionManager, o.roomName);

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
                            sendRoomList(connectionManager, saveGameRooms);
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
            connectionManager.handleDroppedConnection(conn);
            //sendPlayerList(connectionManager, details.roomName);
        });
    });

    chat.installHandlers(server, {
        prefix: '/chat'
    });

    psevents.subscribe(`game.roomlist.changed`, (gameRooms) => {
        sendRoomList(connectionManager, gameRooms);
        saveGameRooms = gameRooms;
    });
};

exports = module.exports = webSocket;
