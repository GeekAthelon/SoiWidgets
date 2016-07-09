/// <reference path='../../interfaces/IRoomData.ts' />
/// <reference path="../../../../typings/bluebird/bluebird.d.ts" />

const Promise = require('bluebird');

export namespace RoomData {

    const roomList: IRoomData[] = [];

    function addRoom(roomData: IRoomData) {
        roomList.push(roomData);
    }

    addRoom({
        template: 'login.pug',
        code: 'c_login',
        name: '',
        tail: 'priv',
        description: '',
        owner: 'system',
        textLeft: '',
        textUnderChat: '',
        iconUrl: 'URL2',
        textTop: '',
        textBottom: '',
        body: {
            background: '~/503.gif',
            bgcolor: 'black',
            text: 'deb887',
            link: 'deb887',
            alink: 'deb887',
            vlink: 'deb887'
        }
    });

    addRoom({
        template: 'room.pug',
        code: 'lobby',
        name: 'The main lobby',
        tail: 'priv',
        description: 'This is the lobby room',
        owner: 'system',
        textLeft: 'Text left of the chat box',
        textUnderChat: 'Text under the chat box',
        iconUrl: 'URL2',
        textTop: `<h1>Welcome to the LOBBY</h1>`,
        textBottom: 'Blah, blah, blah',
        body: {
            background: '~/503.gif',
            bgcolor: 'black',
            text: 'deb887',
            link: 'deb887',
            alink: 'deb887',
            vlink: 'deb887'
        }
    });

    export function getControlRoomDataAsync(roomName: string, controlName: string): Promise<IRoomData> {
        const lookupName = `${roomName}_${controlName}`;
        const data = roomList.filter(roomData => roomData.code === lookupName)[0];
        return Promise.resolve(data);
    }

    export function getRoomDataAsync(roomName: string): Promise<IRoomData> {
        const lookupName = roomName;
        const data = roomList.filter(roomData => roomData.code === lookupName)[0];
        return Promise.resolve(data);
    }

    export function getRoomCodesAsync(): Promise<string[]> {
        const codes = roomList.map((room: IRoomData) => room.code);
        return Promise.resolve(codes);
    }

    export function getAllRoomDataAsync(): Promise<IRoomData[]> {
        return getRoomCodesAsync().then(codes => {
            const promises = codes.map(code => getRoomDataAsync(code));
            return Promise.all(promises);
        });
    }
}

