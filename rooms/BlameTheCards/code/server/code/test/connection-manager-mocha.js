'use strict';
/* globals it: true, describe: true, beforeEach: true, before: true */

const expect = require('chai').expect;
const ConnectionManager = require('../app/lib/connection-manager');
const ConnectionManagerDetail = ConnectionManager.ConnectionDetail;

describe('Ensuring ConnectionManagerDetail', () => {
    let connectionManagerDetail;

    before(() => {
        connectionManagerDetail = new ConnectionManagerDetail();
    });

    it('Testing ConnectionManagerDetail is alive', () => {
        expect(ConnectionManagerDetail).to.not.equal(undefined);
    });

    it('Testing ConnectionManagerDetail sealed', () => {
        expect(Object.isSealed(connectionManagerDetail)).to.equal(true);
    });

    it('Testing lastSceen is set', () => {
        expect(connectionManagerDetail.lastSeen instanceof Date).to.equal(true);
    });
});

describe('Ensuring ConnectionManager', () => {
    let connectionManager;

    beforeEach(() => {
        connectionManager = new ConnectionManager();
    });

    it('Testing ConnectionManager freezes', () => {
        expect(Object.isFrozen(connectionManager)).to.equal(true);
    });

    it('Testing connectionManager.connections.size exists', () => {
        expect(connectionManager.connections.size).to.equal(0);
    });

    it('Testing connectionManager.addConnection', () => {
        const key = 'Test1Key1';
        connectionManager.addConnection(key);
        expect(connectionManager.connections.size).to.equal(1);
    });

    it('Testing connectionManager.addConnection twice with same key should fail', () => {
        const key = 'TestTwiceKey1';
        let hasError = false;
        try {
            connectionManager.addConnection(key);
            connectionManager.addConnection(key);
        } catch (err) {
            hasError = true;
        }
        expect(hasError).to.equal(true);
    });

    it('Testing connectionManager.addConnection twice with different keys should work', () => {
        connectionManager.addConnection('Key1');
        connectionManager.addConnection('Key2');
        expect(connectionManager.connections.size).to.equal(2);
    });

    it('Testing connectionManager.addConnection/removeConnection', () => {
        const connection = 'key1';
        connectionManager.addConnection(connection);
        const detailAfterAdd = connectionManager.connections.get(connection);
        expect(detailAfterAdd.isConnected).to.equal(true);

        connectionManager.handleDroppedConnection(connection);
        const detailAfterDelete = connectionManager.connections.get(connection);
        expect(detailAfterDelete.isConnected).to.equal(false);
    });

    it('Testing connectionManager.removeConnection on unknown connection', () => {
        const connection = 'key1';
        let isError = false;
        try {
            connectionManager.handleDroppedConnection(connection);
        } catch (err) {
            isError = true;
        }
        expect(isError).to.equal(true);
    });

    it('Testing connectionManager.updateDetails', () => {
        const connection = 'testConnectionUpdate1';
        connectionManager.addConnection(connection);
        const isFirstUpdate = connectionManager.updateDetails(connection, '-nick-', '-room-');

        const detail = connectionManager.connections.get(connection);

        expect(isFirstUpdate).to.equal(true);
        expect(detail.soiNick).to.equal('-nick-');
        expect(detail.roomName).to.equal('-room-');

        const isSecondUpdate = !connectionManager.updateDetails(connection, '-nick-', '-room-');
        expect(isSecondUpdate).to.equal(true);
    });

    it('Testing connectionManager.updateDetails - bad connection name', () => {
        const connection = 'testConnectionBad';
        let isError = false;
        try {
            connectionManager.updateDetails(connection, '-nick-', '-room-');
        } catch (err) {
            isError = true;
        }
        expect(isError).to.equal(true);
    });

    it('Testing connectionManager.buildPlayerListForRoom', () => {
        function buildConnection(connection, room, name) {
            connectionManager.addConnection(connection);
            connectionManager.updateDetails(connection, name, room);
        }

        buildConnection('test1', '-room', '-bobby');
        buildConnection('test2', '-room', '-bobby');
        buildConnection('test3', '-room', '-bobby');

        connectionManager.handleDroppedConnection('test2');

        const list = connectionManager.buildPlayerListForRoom('-room');
        expect(list).to.deep.equal({
            '-bobby': {
                isConnected: true,
                isPlaying: false,
                connections: ['test1', 'test3']
            }
        });

        buildConnection('test10', '-zroom', '-sue');
        buildConnection('test11', '-zroom', '-sue');

        const list1 = connectionManager.buildPlayerListForRoom('-zroom');
        expect(list1).to.deep.equal({
            '-sue': {
                isConnected: true,
                isPlaying: false,
                connections: ['test10', 'test11']

            }
        });
    });

    it('Testing connectionManager.buildConnectionsForRoom', () => {
        function buildConnection(connection, room, name) {
            connectionManager.addConnection(connection);
            connectionManager.updateDetails(connection, name, room);
        }

        buildConnection('test1', '-room', '-bobby');
        buildConnection('test2', '-room', '-bobby');
        buildConnection('test3', '-room', '-bobby');
        buildConnection('test10', '-zroom', '-sue');
        buildConnection('test11', '-zroom', '-sue');
        connectionManager.handleDroppedConnection('test2');

        const list = connectionManager.buildConnectionsForRoom('-room');
        expect(list).to.deep.equal(['test1', 'test3']);
    });
});
