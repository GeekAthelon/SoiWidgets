/* globals it: true, describe: true */

var expect = require('chai').expect;
var QuestionCard = require('../app/lib/question-card');
var AnswerCard = require('../app/lib/answer-card');
var CardStack = require('../app/lib/card-stack');
var CardStackManager = require('../app/lib/card-stack-manager');
var Card = require('../app/lib/card');

var cardStackManager = new CardStackManager();

describe('Testing Card Stack Manager', function() {
    'use strict';

    describe('Basic Existence', function() {

        before(function() {});

        it('cardStackManager exists', function() {
            expect(cardStackManager instanceof CardStackManager).to.equal(true);
        });

        it('cardStackManager.questionDrawStack exists', function() {
            expect(cardStackManager.questionDrawStack instanceof CardStack).to.equal(true);
        });

        it('cardStackManager.questionDiscardStack exists', function() {
            expect(cardStackManager.questionDiscardStack instanceof CardStack).to.equal(true);
        });

        it('cardStackManager.answerDrawStack exists', function() {
            expect(cardStackManager.answerDrawStack instanceof CardStack).to.equal(true);
        });

        it('cardStackManager.answerDiscardStack exists', function() {
            expect(cardStackManager.answerDiscardStack instanceof CardStack).to.equal(true);
        });

        it('cardStackManager.hand exists', function() {
            expect(cardStackManager.hand).to.deep.equal({});
        });

    });

});
