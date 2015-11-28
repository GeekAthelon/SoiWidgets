'use strict';

class History {
    constructor() {
        this.clearAll();
    }

    clearAll() {
        this.rounds = [];
        this.data = {};
    }

    addRound(round) {
        this.rounds.unshift(round);
        this.data[round] = {
            votes: []
        };

        if (this.rounds.length > 10) {
            const top = this.rounds.pop();
            delete this.data[top];
        }
    }

    registerVote(voteData) {
        const h = this.data[voteData.round];
        if (h) {
            h.votes.push(voteData);
        }
    }

    getAllVotes() {
        const allvotes = {};
        for (let round of this.rounds) {
            const roundvotes = [];
            for (let vote of this.data[round].votes) {
                roundvotes.push({
                    voter: vote.voter,
                    votee: vote.votee
                });
                allvotes[round] = roundvotes;
            }
        }
        return allvotes;
    }
}

exports = module.exports = new History();
