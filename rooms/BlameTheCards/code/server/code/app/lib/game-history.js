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

        /* istanbul ignore if */
        if (!this.lounge) {
            throw new Error(`History - Constuctor - loungeName not passed.`);
        }
        this.newVotes = [];
        this.resetCache();
    }

    resetCache() {
        this.recentVoteCache = {};
        this.allVotesCache = null;
    }

    clearAll() {
        purgeCollections(this.lounge);
        this.newVotes.length = 0;
        this.resetCache();
    }

    registerVote(voteData) {
        voteCollection.insert(voteData);
        this.newVotes.push(voteData);
        voteCollection.save();
        this.resetCache();
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
        /* istanbul ignore if */
        if (rounds.items.length === 0) {
            return 0;
        } else {
            return rounds.items[0].round;
        }
    }

    getUnpostedVotes() {
        const r = this.newVotes.slice(0);
        this.newVotes.length = 0;
        return r;
    }

    getAllVotes() {
        /* istanbul ignore if */
        if (this.allVotesCache) {
            return this.allVotesCache;
        }

        const votes = voteCollection.where(`@round > 0`);
        const out = votes.items.map((item) => {
            return {
                round: item.round,
                votee: item.votee,
                voter: item.voter,
                html: item.html
            };
        });
        this.allVotesCache = out;
        return out;
    }

    getRecentVotes(round, range) {
        const key = `${round}_${range}`;
        if (this.recentVoteCache[key]) {
            return this.recentVoteCache[key];
        }

        const bot = round - range;
        const votes = voteCollection.where(`(@round <= ${round}) && (@round > ${bot})`);

        const out = votes.items.map((item) => {
            return {
                round: item.round,
                votee: item.votee,
                voter: item.voter,
            };
        });
        this.recentVoteCache[key] = out;
        return out;
    }
}

exports = module.exports = History;
