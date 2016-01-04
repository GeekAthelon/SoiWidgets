/* globals it: true, describe: true, before: true */
'use strict';

const expect = require('chai').expect;
const QuestionCard = require('../app/lib/question-card');
const AnswerCard = require('../app/lib/answer-card');
const Card = require('../app/lib/card');

describe('Testing Question Cards', function() {
    const questionCard = new QuestionCard(1, 'Huzzah');

    it('Testing QuestionCard isntanceof Card', function() {
        expect(questionCard instanceof Card).to.equal(true);
    });
});

describe('Testing Answer Cards', function() {
    const answerCard = new AnswerCard(1, 'Huzzah');

    it('Testing answerCard isntanceof Card', function() {
        expect(answerCard instanceof Card).to.equal(true);
    });
});
