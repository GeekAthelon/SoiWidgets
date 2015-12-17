(function() {
    'use strict';

    function getStatusViewData(game) {
        let totalCards = 0;
        const now = Date.now();
        const status = {
            title: 'BtC Status',
            message: `BtC Status - round ${game.round}`,
            playerList: [],
            cardTotals: [],
            votes: game.history.getAllVotes()
        };

        const addTotal = ((desc, qty) => {
            const d = {
                desc,
                qty
            };

            totalCards += qty;
            status.cardTotals.push(d);
        });

        let playerCards = 0;
        Object.keys(game.players).forEach(name => {
            const playerData = game.players[name];
            const inf = {
                name,
                idle: Math.floor((playerData.dropTime - now) / 1000)
            };
            status.playerList.push(inf);
            playerCards += playerData.hand._cards.length;
            playerCards += playerData.table._cards.length;
        });

        addTotal('Players', playerCards);
        addTotal('Question Draw Stack', game.questionDrawStack._cards.length);
        addTotal('Question Discard Stack', game.questionDiscardStack._cards.length);

        addTotal('Answer Draw Stack', game.answerDrawStack._cards.length);
        addTotal('Answer Discard Stack', game.answerDiscardStack._cards.length);
        addTotal('Face up Question Card', game.questionTableStack._cards.length);

        addTotal('Total Cards', totalCards);

        return status;
    }
    exports = module.exports = getStatusViewData;
}());
