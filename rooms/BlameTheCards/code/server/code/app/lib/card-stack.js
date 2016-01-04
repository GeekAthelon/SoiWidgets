'use strict';

class CardStack {
    constructor(name, cardType) {
        this.name = name;
        this.cardType = cardType;
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

    remove(card) {

        const idx = this._cards.indexOf(card);

        if (idx === -1) {
            throw new Error(`CardStack: Cannot remove. Card not found`);
        }

        const removedCard = this._cards.splice(idx, 1);

        /* istanbul ignore next */
        if (card !== removedCard[0]) {
            throw new Error(`CardStack: Card removed was not card found`);
        }
    }
}

exports = module.exports = CardStack;
