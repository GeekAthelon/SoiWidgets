'use strict';

class EnterLounge {
    constructor(lounges) {
        this.lounges = lounges;
    }

    getEntranceDetails() {
        return {
            title: 'Lounge Listing',
            lounges: this.lounges
        };
    }
}

exports = module.exports = EnterLounge;
