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

    export function getControlRoomDataAsync(roomName: string, controlName: string): Promise<IRoomData> {
        const lookupName = `${roomName}_${controlName}`;
        const data = roomList.filter(roomData => roomData.code === lookupName)[0];
        return Promise.resolve(data);
    }
}