'use strict';

const Locallydb = require('locallydb');
const btcConfig = require('../get-btc-config.js')();

const db = new Locallydb(btcConfig.env.dbPath);

const autoSaveMode = false;
let voteCollection;
let roundCollection;

function initDb(lounge) {
    voteCollection = db.collection('votes', db, autoSaveMode);
    roundCollection = db.collection('round', db, autoSaveMode);

    const rounds = roundCollection.where('@round > 0');
    if (rounds.items.length === 0) {
        roundCollection.insert({
            round: 0,
            lounge: lounge
        });
    }

    voteCollection.save();
    roundCollection.save();
}

function purgeCollections(lounge) {
    db.removeCollection('votes');
    db.removeCollection('round');
    initDb(lounge);
}

class History {
    constructor(loungeName) {
        this.lounge = loungeName;
        initDb(this.lounge);

        if (!this.lounge) {
            throw new Error(`History - Constuctor - loungeName not passed.`);
        }
        this.newVotes = [];
    }

    clearAll() {
        purgeCollections(this.lounge);
        this.newVotes.length = 0;
    }

    registerVote(voteData) {
        voteCollection.insert(voteData);
        this.newVotes.push(voteData);
        voteCollection.save();
    }

    saveRound(round) {
        const rounds = roundCollection.where(`@lounge == '${this.lounge}'`);
        const cid = rounds.items[0].cid;
        roundCollection.update(cid, {
            round: round
        });
        roundCollection.save();
    }

    getLastRoundNumber() {
        const rounds = roundCollection.where(`@lounge == '${this.lounge}'`);
        return rounds.items[0].round;
    }

    getUnpostedVotes() {
        const r = this.newVotes.slice(0);
        this.newVotes.length = 0;
        return r;
    }

    getVotesForRound(round) {
        const votes = voteCollection.where(`@round > ${round}`);
        return votes.items;
    }

    getAllVotes() {
        const votes = voteCollection.where(`@round > 0`);

        const out = votes.items.map((item) => {
            return {
                round: item.round,
                votee: item.votee,
                voter: item.voter,
                html: item.html
            };
        });

        return out;
    }

    getRecentVotes(round, range) {
        const bot = round - range;

        const votes = voteCollection.where(`(@round <= ${round}) && (@round > ${bot})`);

        const out = votes.items.map((item) => {
            return {
                round: item.round,
                votee: item.votee,
                voter: item.voter,
            };
        });

        return out;
    }
}

exports = module.exports = History;
