/// <reference path='../../interfaces/IUserData.ts' />
/// <reference path="../../../../typings/bluebird/bluebird.d.ts" />

const Promise = require('bluebird');

export namespace UserData {
    export function getUserDataAsync(soiUserData: ISoiUserData): Promise<IUserData> {

        let data: IUserData = {
            givenName: 'Visitor',
            simpleNick: 'Visitor',
            roomName: 'c',
            roomTail: 'priv',
            fullRoomName: 'c@priv',
            controlRoomName: 'login',
            isLoggedIn: false
        };

        if (soiUserData.vqxus) {
            data.givenName = soiUserData.vqxus;
            data.simpleNick = data.givenName;
        }

        return Promise.resolve(data);
    }
}