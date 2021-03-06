'use strict';
(function() {

    let userList = {};

    class RegisterUsers {
        constructor() {}

        clear() {
            return new Promise((resolve, reject) => {
                void(reject);
                userList = {};
                resolve();
            });
        }

        add(userName) {
            return new Promise((resolve, reject) => {
                void(reject);
                require('crypto').randomBytes(8, function(ex, buf) {
                    let token = buf.toString('hex');
                    void(token);
                    //token = 'ffffffff';
                    const details = {
                        token
                    };
                    userList[userName] = details;
                    resolve(details);
                });
            });
        }

        verify(userName, token) {
            return new Promise((resolve, reject) => {
                void(reject);
                const details = userList[userName];

                //if (token === 'ffffffff') {
                //    resolve(true);
                //}

                /* istanbul ignore if */
                if (!details) {
                    resolve(false);
                }

                if (details.token !== token) {
                    resolve(false);
                }

                resolve(true);
            });
        }

        encodeAsSoiRoomPassword(username, token) {
            return new Promise((resolve, reject) => {
                void(reject);

                // SOI Room Passwords are the only way that we can pass data around
                // in links as a non-registered user, such as the btc-bot.
                // There are some important limitations.
                // [A-Za-z0-9]
                // Max length of 42 characters.

                // Encode the password in such a way it fits into
                // these limits.
                // WE can assume the username has already been stripped down to
                // [A-Za-z0-9@]

                const padToTwo = number => number <= 99 ? ('0' + number).slice(-2) : /* istanbul ignore next */ number;

                const tmp = username.split('@');
                const nick = tmp[0];
                const tail = tmp[1];

                let ret = '';
                ret += padToTwo(nick.length) + nick;
                ret += padToTwo(tail.length) + tail;
                ret += padToTwo(token.length) + token;

                resolve(ret);
            });
        }

        decodeFromSoiRoomPassword(encodedPassword) {
            return new Promise((resolve, reject) => {
                void(reject);
                let idx = 0;

                function readstring() {
                    const len = +encodedPassword.substr(idx, 2);
                    idx += 2;
                    const ret = encodedPassword.substr(idx, len);
                    idx += len;
                    return ret;
                }

                resolve({
                    soiUsername: readstring() + '@' + readstring(),
                    token: readstring()
                });
            });
        }
    }

    exports = module.exports = RegisterUsers;
}());
