'use strict';

const cardLoader = require('../lib/card-loader');
const btcSettings = require('../get-btc-settings');
const CardStackManager = require('../lib/card-stack-manager.js');
const History = require('../lib/game-history');
const gameHistory = new History('main-room');
const BtcBot = require('../lib/btc-bot');
const btcBot = new BtcBot(gameHistory);
//const soi = require('../lib/soi');
const getStatusViewData = require('../views/status.js');
const psevents = require('../lib/pub-sub');

function init(app, cardSources) {
    const game = new CardStackManager({
        history: gameHistory,
        settings: btcSettings
    });

    app.get('/', function(req, res) {
        res.render('index', {
            title: 'Hey',
            message: 'Hello there!'
        });
    });

    app.get('/debug', function(req, res) {
        const json = JSON.stringify(game, null, 2);

        res.render('index', {
            title: 'Debugging Info',
            message: 'Debugging info',
            json: json
        });
    });

    app.get('/getdata/:name', function(req, res) {
        //http://127.0.0.1:1701/getdata/tinker
        const name = req.params.name;
        const hand = game.getDataFor(name);
        res.json(hand);
    });

    app.get('/play/:name/*', function(req, res) {
        //http://127.0.0.1:1701/play/tinker/1/2/3
        const ids = req.params[0].split('/').map(Number);
        game.playCardsFor(req.params.name, ids);
        res.json({
            status: 'OK',
            text: `Cards played: ${ids}`
        });
    });

    app.post('/vote', function(req, res) {
        const data = req.body;
        gameHistory.registerVote({
            round: data.round,
            voter: data.voter,
            votee: data.votee,
            html: data.html,
        });

        const votes = gameHistory.getRecentVotes(
            game.round,
            btcSettings.numberOfRoundsVotesReturnedToClient
        );
        res.json(votes);
    });

    app.get('/status', function(req, res) {
        const status = getStatusViewData(game);
        console.log('/status called');
        res.render('status', status);
    });

    app.get('/addplayer/:name', function(req, res) {
        game.addPlayer(req.params.name);
        res.json({
            status: 'OK',
            text: 'Player added'
        });
    });

    psevents.subscribe('main-room.info', (message) => {
        btcBot.addMessage(message);
        console.log(message);
    });

    psevents.subscribe('main-room.start-round.begin', () => {
        btcBot.queueNewVotes();
    });

    psevents.subscribe('main-room.start-round.end', () => {
        var postPromise = btcBot.post();
        postPromise.then(() => {
            console.log('SOI post complete');
        });

        setTimeout(() => {
            game._endRound();
            game.startRound();
        }, btcSettings.turnDuration);
    });

    const cardLoaderPromise = cardLoader.load(game, cardSources);
    cardLoaderPromise.then(() => {
        game.startRound();
    }).catch((err) => {
        console.log('main-room.init - ', err);
    });
}

exports = module.exports = init;
