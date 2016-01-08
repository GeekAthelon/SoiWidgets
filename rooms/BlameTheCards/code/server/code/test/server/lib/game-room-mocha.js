'use strict';
/* globals it: true, describe: true, before: true, beforeEach: true*/

const expect = require('chai').expect;
const gameRoom = require('../../../app/lib/game-room');
const gameRoom2 = require('../../../app/lib/game-room');
const psevents = require('../../../app/lib/pub-sub');

const messageTextLength = 7;

describe('Testing Game Room', function() {
    before(() => {});

    beforeEach(() => {
        gameRoom.deleteAll();
        gameRoom.maxMessages = messageTextLength;
        gameRoom.add('unit-test-room', {});
    });

    it('gameRoom to exist', () => {
        expect(gameRoom).to.not.equal(undefined);
    });

    it('maxMessages correct value', () => {
        expect(gameRoom.maxMessages).to.equal(messageTextLength);
    });

    it('testing getting all game rooms', () => {
        expect(Object.keys(gameRoom.all())).to.deep.equal(['unit-test-room']);
    });

    it('gameRoom needs to be  a singleton', () => {
        expect(gameRoom).to.equal(gameRoom);
        expect(gameRoom).to.equal(gameRoom2);
    });

    it('testing add', () => {
        const d = {};
        gameRoom.add('test', d);
        const d1 = gameRoom.get('test');
        expect(d).to.equal(d1);
    });

    it('testing add twice fails', (done) => {
        const d = {};
        gameRoom.add('test', d);
        try {
            gameRoom.add('test', d);
        } catch (err) {
            expect(true).to.equal(true);
            done();
        }
    });

    it('testing adding messages', () => {
        for (let i = 0; i < messageTextLength * 2; i++) {
            gameRoom.addMessage('unit-test-room', 'bot', null, `Message #${i}`);
        }
        const messages = gameRoom.getMessages('unit-test-room', null);
        expect(messages.length).to.equal(messageTextLength);
        expect(messages[0].message).to.equal(`Message #${messageTextLength}`);
    });

    it('testing adding for `null` room', () => {
        for (let i = 0; i < messageTextLength * 2; i++) {
            gameRoom.addMessage(null, 'bot', null, `Message #${i}`);
        }
        const messages = gameRoom.getMessages(null, null);
        expect(messages.length).to.equal(0);
    });

    it('testing adding messages vis publishing', () => {
        for (let i = 0; i < messageTextLength * 2; i++) {
            const d = {
                from: 'bot',
                room: 'unit-test-room',
                to: null,
                message: `Message #${i}`,

            };

            psevents.publish('room.message', JSON.stringify(d));
        }
        const messages = gameRoom.getMessages('unit-test-room', null);
        expect(messages.length).to.equal(messageTextLength);
        expect(messages[0].message).to.equal(`Message #${messageTextLength}`);
    });

    it('testing getting messages from non-existent room should fail', (done) => {
        try {
            const messages = gameRoom.getMessages('this-room-does-not-exist', null);
            void(messages);
        } catch (err) {
            expect(true).to.equal(true);
            done();
        }
    });

    it.skip('testing adding messages for just one user', () => {
        gameRoom.addMessage('unit-test-room', 'bot', null, `Everyone`);
        gameRoom.addMessage('unit-test-room', 'bot', 'Bill', `Bill`);
        gameRoom.addMessage('unit-test-room', 'bot', 'Bill', `Bill`);
        gameRoom.addMessage('unit-test-room', 'bot', null, `Everyone`);
        gameRoom.addMessage('unit-test-room', 'bot', 'John', `John`);

        const messagesEveryone = gameRoom.getMessages('unit-test-room', null);
        const messagesBill = gameRoom.getMessages('unit-test-room', 'Bill');
        const messagesJohn = gameRoom.getMessages('unit-test-room', 'John');

        expect(messagesEveryone.length).to.equal(2);
        expect(messagesBill.length).to.equal(4);
        expect(messagesJohn.length).to.equal(3);
    });
});
