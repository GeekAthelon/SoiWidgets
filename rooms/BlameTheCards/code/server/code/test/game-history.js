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
        gameHistory.addRound(1);

        expect(gameHistory.rounds).to.deep.equal([1]);
        expect(gameHistory.data).to.deep.equal({
            1: {
                votes: []
            }
        });
    });

    it('Overflows properly', () => {
        for (let i = 0; i < 12; i++) {
            gameHistory.addRound(i);
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
        gameHistory.addRound(1);

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
        gameHistory.addRound(1);

        gameHistory.registerVote({
            round: 5,
            voter: 'athelon',
            votee: 'athelondageek'
        });

        expect(gameHistory.data).to.deep.equal({
            1: {
                votes: []
            }
        });
    });

    it('Get All Votes', () => {
        gameHistory.addRound(1);
        gameHistory.addRound(2);

        /* beautify preserve:start */
        gameHistory.registerVote({round: 1, voter: 'athelon', votee: 'athelondageek'});
        gameHistory.registerVote({round: 1, voter: 'athelon2', votee: 'athelondageek'});
        gameHistory.registerVote({round: 2, voter: 'tiny', votee: 'alice'});
        /* beautify preserve:end */

        const allVotes = gameHistory.getAllVotes();

        /* beautify preserve:start */
        expect(allVotes).to.deep.equal({
            1: [
                {voter: 'athelon', votee: 'athelondageek'},
                {voter: 'athelon2', votee: 'athelondageek'}
            ],
            2: [
                {voter: 'tiny', votee: 'alice'}
            ]
        });
        /* beautify preserve:end */
    });

});
