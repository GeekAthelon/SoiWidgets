/* globals it: true, describe: true, before: true, beforeEach: true*/

const expect = require('chai').expect;
const History = require('../app/lib/game-history');

describe('Testing History', function() {
    'use strict';

    it('Created empty history', () => {
        const history = new History();
        expect(history).to.not.equal(undefined);
    });

    it('Creates One history element', () => {
        const history = new History();
        history.addRound(1);

        expect(history.rounds).to.deep.equal([1]);
        expect(history.data).to.deep.equal({
            1: {
                votes: []
            }
        });
    });

    it('Overflows properly', () => {
        const history = new History();
        for (let i = 0; i < 12; i++) {
            history.addRound(i);
        }

        expect(history.rounds).to.deep.equal([11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

        /* beautify preserve:start */
        expect(history.data).to.deep.equal({
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
        const history = new History();
        history.addRound(1);

        history.registerVote({
            round: 1,
            voter: 'athelon',
            votee: 'athelondageek'
        });

        expect(history.data).to.deep.equal({
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
        const history = new History();
        history.addRound(1);

        history.registerVote({
            round: 5,
            voter: 'athelon',
            votee: 'athelondageek'
        });

        expect(history.data).to.deep.equal({
            1: {
                votes: []
            }
        });
    });

    it('Get All Votes', () => {
        const history = new History();
        history.addRound(1);
        history.addRound(2);

        /* beautify preserve:start */
        history.registerVote({round: 1, voter: 'athelon', votee: 'athelondageek'});
        history.registerVote({round: 1, voter: 'athelon2', votee: 'athelondageek'});
        history.registerVote({round: 2, voter: 'tiny', votee: 'alice'});
        /* beautify preserve:end */

        const allVotes = history.getAllVotes();

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
