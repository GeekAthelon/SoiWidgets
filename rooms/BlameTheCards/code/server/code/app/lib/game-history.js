'use strict';

class History {
    constructor() {
        this.clearAll();
        this.newVotes = [];
    }

    clearAll() {
        this.rounds = [];
        this.data = {};
    }

    _addRound(round) {
        if (this.rounds.indexOf(round) !== -1) {
            return;
        }
        this.rounds.unshift(round);
        this.data[round] = {
            votes: []
        };

        if (this.rounds.length > 1000) {
            const top = this.rounds.pop();
            delete this.data[top];
        }
    }

    registerVote(voteData) {
        const h = this.data[voteData.round];
        if (!h) {
            this._addRound(voteData.round);
            this.registerVote(voteData);
            return;
        }
        h.votes.push(voteData);
        this.newVotes.push(voteData);
    }

    getNewVotes() {
        const r = this.newVotes.slice(0);
        this.newVotes.length = 0;
        return r;
    }

    getVotesForRound(round) {
        const roundvotes = [];
        if (this.data[round]) {
            for (let vote of this.data[round].votes) {
                roundvotes.push({
                    voter: vote.voter,
                    votee: vote.votee,
                    html: vote.html
                });
            }
        }
        return roundvotes;
    }

    getAllVotes() {
        const allvotes = {};
        for (let round of this.rounds) {
            allvotes[round] = this.getVotesForRound(round);
        }
        return allvotes;
    }
}

exports = module.exports = new History();
