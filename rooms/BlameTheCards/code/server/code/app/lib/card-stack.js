'use strict';

class CardStack {
    constructor(name, cardType) {
        this.name = name;
        this.cardType = cardType
        this._cards = [];
    }

    add(card) {
        if (this._cards.indexOf(card) !== -1) {
            throw new Error(`CardStack: Cannot add.  ${this.name} already contains ${card.num}.`);
        }

        if (card.type !== this.cardType) {
            throw new Error(`CardStack: Cannot add to ${this.name}.  Card of the wrong type.`);
        }

        this._cards.push(card);
    }

    draw() {
        if (this._cards.length === 0) {
            throw new Error(`CardStack: Cannot draw.  ${this.name} is empty.`);
        }
        return this._cards.shift();
    }

}

exports = module.exports = CardStack;
