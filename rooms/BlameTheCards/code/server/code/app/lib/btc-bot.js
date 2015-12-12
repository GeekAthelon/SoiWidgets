'use strict';

const gHistory = require('./game-history');
const soi = require('./soi');
const he = require('he');
const encodeOptions = {
    'allowUnsafeSymbols': true
};

class btcBot {
    constructor() {
        this._messages = [];
    }

    addMessage(s) {
        this._messages.push(he.encode(s, encodeOptions));
    }

    queueNewVotes() {
        const votes = gHistory.getNewVotes();

        if (votes.length) {
            const votelist = {};

            votes.forEach(v => {
                const html = v.html;
                votelist[v.html] = votelist[v.html] || {
                    voters: []
                };
                votelist[v.html].html = v.html;
                votelist[v.html].votee = v.votee;
                votelist[v.html].voters.push(v.voter);
            });

            this.addMessage('Votes are in!');
            Object.keys(votelist).forEach(v => {
                const l = votelist[v];
                this.addMessage(`<strong>${l.votee}</strong> ${l.html}`);
                this.addMessage(`Votes: ${l.voters.join(', ')}`);
                this.addMessage(``);
            });
        }
    }

    post() {
        if (this._messages.length) {
            const str = this._messages.join('<br>');
            this._messages.length = 0;
            soi.postToRoom(str);
        }
    }
}

exports = module.exports = new btcBot();
