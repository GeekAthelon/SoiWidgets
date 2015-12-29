'use strict';
const psevents = require('../lib/pub-sub');

const gameRooms = {};

class GameRoom {
    constructor() {
        this._maxMessages = 10;
        this.messages = {};

        psevents.subscribe('room.message', (json) => {
            const details = JSON.parse(json);
            this.addMessage(details.room, details.from, details.to, details.message);
        });
    }

    get maxMessages() {
        return this._maxMessages;
    }

    set maxMessages(value) {
        this._maxMessages = value;
    }

    add(roomName, details) {
        if (gameRooms[roomName]) {
            throw (new Error(`GameRoom - Cannot add ${name}. Already exists.`));
        }
        gameRooms[roomName] = details;
        this.messages[roomName] = [];
    }

    get(roomName) {
        return gameRooms[roomName];
    }

    deleteAll() {
        Object.keys(gameRooms).forEach(k => delete gameRooms[k]);
        Object.keys(this.messages).forEach(k => delete this.messages[k]);
    }

    addMessage(room, from, to, message) {
        if (room === null) {
            return;
        }
        const list = this.messages[room];
        /* istanbul ignore if */
        if (!list) {
            throw new Error(`game-room addMessage.  room '${room}' is invalid.`);
        }

        list.push({
            from,
            to,
            message,
            timeStamp: new Date().toISOString()
        });

        while (list.length > this._maxMessages) {
            list.shift();
        }
    }

    all() {
        return gameRooms;
    }

    getMessages(room, player) {
        if (room === null) {
            return [];
        }
        const list = this.messages[room];
        if (!list) {
            throw new Error(`game-room getMessages.  room '${room}' is invalid.`);
        }

        const r = [];
        list.forEach(message => {
            /* istanbul ignore else */
            if ([player, null].indexOf(message.to) !== -1) {
                r.push(message);
            }
        });

        return r;
    }
}

exports = module.exports = new GameRoom();
