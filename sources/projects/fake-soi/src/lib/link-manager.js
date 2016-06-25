'use strict';
const userAuthDbO = require('../../src/lib/user-auth-db');

function getRoomLinkAsync(roomID, tail, nick) {

    return new Promise((resolve, reject) => {
        void(reject);
        return userAuthDbO.gatherUserDataAsync(nick)
            .then(res => {
                const encodedNick = encodeURIComponent(
                    res.prettyNick + '@' + res.tail
                );

                let link = '/room?room=' + roomID;
                link += '&nick=' + encodedNick;
                resolve(link);
            });
    });
}

const linkManager = {
    getRoomLinkAsync: getRoomLinkAsync
};

exports = module.exports = linkManager;
