'use strict';

const Locallydb = require('locallydb');
const btcConfig = require('../get-btc-config.js')();

const db = new Locallydb(btcConfig.env.dbPath);

const autoSaveMode = false;
let voteCollection;
let roundCollection;

function initDb() {
    voteCollection = db.collection('votes', db, autoSaveMode);
    roundCollection = db.collection('round', db, autoSaveMode);

    const rounds = roundCollection.where('@round > 0');
    if (rounds.items.length === 0) {
        console.log('Seeding round counter');
        roundCollection.insert({
            round: 0
        });
    }

    voteCollection.save();
    roundCollection.save();
}

function purgeCollections() {
    db.removeCollection('votes');
    db.removeCollection('round');
    initDb();
}

class History {
    constructor() {
        initDb();
        this.newVotes = [];
    }

    clearAll() {
        purgeCollections();
        this.newVotes.length = 0;
    }

    registerVote(voteData) {
        voteCollection.insert(voteData);
        this.newVotes.push(voteData);
        voteCollection.save();
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
