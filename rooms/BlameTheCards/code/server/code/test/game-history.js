/* globals it: true, describe: true, before: true, beforeEach: true*/

const expect = require('chai').expect;
const gameHistory = require('../app/lib/game-history');

describe('Testing History', function() {
    'use strict';

    beforeEach(() => {
        gameHistory.clearAll();

        gameHistory.registerVote({
            round: 1,
            voter: 'athelon',
            votee: 'athelondageek',
            html: 'line1'
        });
        gameHistory.registerVote({
            round: 5,
            voter: 'athelon2',
            votee: 'athelondageek',
            html: 'line2'
        });
        gameHistory.registerVote({
            round: 99,
            voter: 'tiny',
            votee: 'alice',
            html: 'line3'
        });
    });

    it('Created empty history', () => {
        expect(gameHistory).to.not.equal(undefined);
    });

    it('Testing getAllVotes', () => {

        const allVotes = gameHistory.getAllVotes();

        expect(allVotes).to.deep.equal(
            [{
                round: 1,
                voter: 'athelon',
                votee: 'athelondageek',
                html: 'line1'
            }, {
                round: 5,
                voter: 'athelon2',
                votee: 'athelondageek',
                html: 'line2'
            }, {
                round: 99,
                voter: 'tiny',
                votee: 'alice',
                html: 'line3'
            }]
        );
    });

});
