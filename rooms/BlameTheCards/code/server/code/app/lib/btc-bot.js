'use strict';

const soi = require('./soi');
const he = require('he');
const encodeOptions = {
    'allowUnsafeSymbols': true
};

class BtcBot {
    constructor(history) {
        this._messages = [];
        this.history = history;
    }

    addMessage(s) {
        this._messages.push(he.encode(s, encodeOptions));
    }

    queueNewVotes() {
        const votes = this.history.getUnpostedVotes();

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
            return soi.postToRoom(str);
        }
    }
}

exports = module.exports = BtcBot;
