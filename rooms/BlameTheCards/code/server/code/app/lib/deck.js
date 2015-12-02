'use strict';

class Deck {
    constructor(db) {
        this.db = db;
    }

    empty() {
        return new Promise((resolve, reject) => {
            const qCollection = this.db.collection('questions');
            const aCollection = this.db.collection('answers');

            function remove(collection, cid) {
                collection.remove(cid);
            }

            Promise.all([this.getQuestionCards(), this.getAnswerCards()]).then((_cards) => {
                _cards[0].forEach((card) => remove(qCollection, card.cid));
                _cards[1].forEach((card) => remove(aCollection, card.cid));
                resolve();
            });

        });
    }

    addQuestionCard(card) {
        return new Promise((resolve, reject) => {
            const cardCollection = this.db.collection('questions');
            cardCollection.insert(card);
            resolve();
        });
    }

    addAnswerCard(card) {
        return new Promise((resolve, reject) => {
            const cardCollection = this.db.collection('answers');
            cardCollection.insert(card);
            resolve();
        });
    }

    getAnswerCards() {
        return new Promise((resolve, reject) => {
            const cardCollection = this.db.collection('answers');
            const cards = cardCollection.where(`@type === ${Deck.cardType.ANSWER}`);
            resolve(cards.items);
        });
    }

    getQuestionCards() {
        return new Promise((resolve, reject) => {
            const cardCollection = this.db.collection('questions');
            const cards = cardCollection.where(`@type === ${Deck.cardType.QUESTION}`);
            resolve(cards.items);
        });
    }
}

Deck.cardType = {
    QUESTION: 1000,
    ANSWER: 2000
};

Object.freeze(Deck.cardType);

exports = module.exports = Deck;
