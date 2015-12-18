'use strict';
(function() {

    let userList = {};

    class RegisterUsers {
        constructor() {}

        clear() {
            return new Promise((resolve, reject) => {
            userList = {};
                    resolve();
                });
        }

        add(userName) {
            return new Promise((resolve, reject) => {
                require('crypto').randomBytes(48, function(ex, buf) {
                    const token = buf.toString('hex');
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
                const details = userList[userName];
                if (!details) {
                    resolve(false);
                }

                if (details.token !== token) {
                    resolve(false);
                }

                resolve(true);
            });
        }
    }

    exports = module.exports = RegisterUsers;
}());
