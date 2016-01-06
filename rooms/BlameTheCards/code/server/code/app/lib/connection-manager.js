'use strict';

/* jshint -W079 */
const Map = require('es6-map'); // Ignore redefinition.
/* jshint +W079 */

class ConnectionDetail {
    constructor() {
        this.roomName = null;
        this.soiNick = null;
        this.lastSeen = new Date();
        this.isConnected = false;
        this.isPlaying = false;
        this.valueSet = false;
        Object.seal(this);
    }
}

class ConnectionManager {
    constructor() {
        // Websocket connections
        this.connections = new Map();
        Object.freeze(this);
    }

    addConnection(connection) {
        const oldDetail = this.connections.get(connection);
        if (oldDetail !== undefined) {
            throw new Error(
                'ConnectionManager: addConnection: passed connection already exists'
            );
        }
        const detail = new ConnectionDetail();
        detail.isConnected = true;
        this.connections.set(connection, detail);
    }

    handleDroppedConnection(connection) {
        const detail = this.connections.get(connection);
        if (detail === undefined) {
            throw new Error(
                'ConnectionManager: removeConnection: passed connection does not exist'
            );
        }
        detail.isConnected = false;
        this.connections.set(connection, detail);

        //this.connections.delete(connection);
    }

    updateDetails(connection, soiNick, roomName) {
        const detail = this.connections.get(connection);
        if (!detail) {
            throw new Error('ConnectionManager: updateDetails: passed connection not found');
        }
        let r = detail.valueSet === false;
        detail.valueSet = true;
        detail.roomName = roomName;
        detail.soiNick = soiNick;
        detail.lastSeen = new Date();
        return r;
    }

    buildConnectionsForRoom(roomName) {
        const connections = [];
        this.connections.forEach((detail, connection) => {
            if (detail.roomName === roomName) {
                if (detail.isConnected) {
                    connections.push(connection);
                }
            }

        });
        return connections;
    }

    buildPlayerListForRoom(roomName) {
        const players = {};
        this.connections.forEach((detail) => {
            if (detail.roomName !== roomName) {
                return;
            }

            const d = {
                isConnected: false,
                isPlaying: false,
            };

            const player = players[detail.soiNick] || d;
            if (detail.isConnected) {
                player.isConnected = true;
            }

            player.isPlaying = detail.isPlaying;
            players[detail.soiNick] = player;
        });
        return players;
    }
}

ConnectionManager.ConnectionDetail = ConnectionDetail;

exports = module.exports = ConnectionManager;
