interface IUserData {
    givenName: string;
    simpleNick: string;
    roomName: string;

    ///Only used if roomName === 'c'
    controlRoomName: string;
    roomTail: string;
    fullRoomName: string;
    isLoggedIn: boolean;
}

interface ISoiUserData {
    vqxus: string; // Nickname
}