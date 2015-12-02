/* globals it: true, describe: true, before: true, beforeEach: true*/

const expect = require('chai').expect;
const gameHistory = require('../app/lib/game-history');

describe('Testing History', function() {
    'use strict';

    beforeEach(() => {
        gameHistory.clearAll();
    });

    it('Created empty history', () => {
        expect(gameHistory).to.not.equal(undefined);
    });

    it('Creates One history element', () => {
        gameHistory._addRound(1);

        expect(gameHistory.rounds).to.deep.equal([1]);
        expect(gameHistory.data).to.deep.equal({
            1: {
                votes: []
            }
        });
    });

    it.skip('Overflows properly', () => {
        for (let i = 0; i < 12; i++) {
            gameHistory._addRound(i);
        }

        expect(gameHistory.rounds).to.deep.equal([11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

        /* beautify preserve:start */
        expect(gameHistory.data).to.deep.equal({
            11: {votes: []},
            10: {votes: []},
            9: {votes: []},
            8: {votes: []},
            7: {votes: []},
            6: {votes: []},
            5: {votes: []},
            4: {votes: []},
            3: {votes: []},
            2: {votes: []}
        });
        /* beautify preserve:end */
    });

    it('Registers a vote in a known round', () => {
        gameHistory._addRound(1);

        gameHistory.registerVote({
            round: 1,
            voter: 'athelon',
            votee: 'athelondageek'
        });

        expect(gameHistory.data).to.deep.equal({
            1: {
                votes: [{
                    round: 1,
                    voter: 'athelon',
                    votee: 'athelondageek'
                }]
            }
        });
    });

    it('Ignore votes in an unknown round', () => {
        gameHistory._addRound(1);

        gameHistory.registerVote({
            round: 5,
            voter: 'athelon',
            votee: 'athelondageek'
        });

        expect(gameHistory.data).to.deep.equal({
            /* beautify preserve:start */
            1: {votes: []},
            5: {votes: [{round: 5, voter: 'athelon', votee: 'athelondageek'}]}
            /* beautify preserve:end */
        });
    });

    it('Get All Votes', () => {
        gameHistory._addRound(1);
        gameHistory._addRound(2);

        gameHistory.registerVote({
            round: 1,
            voter: 'athelon',
            votee: 'athelondageek',
            html: 'line1'
        });
        gameHistory.registerVote({
            round: 1,
            voter: 'athelon2',
            votee: 'athelondageek',
            html: 'line2'
        });
        gameHistory.registerVote({
            round: 2,
            voter: 'tiny',
            votee: 'alice',
            html: 'line3'
        });

        const allVotes = gameHistory.getAllVotes();

        expect(allVotes).to.deep.equal({
            1: [{
                voter: 'athelon',
                votee: 'athelondageek',
                html: 'line1'
            }, {
                voter: 'athelon2',
                votee: 'athelondageek',
                html: 'line2'
            }],
            2: [{
                voter: 'tiny',
                votee: 'alice',
                html: 'line3'
            }]
        });
    });

});
