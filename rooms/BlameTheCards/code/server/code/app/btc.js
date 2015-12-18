(function() {
    'use strict';

    const express = require('express');
    const request = require('request');
    const cheerio = require('cheerio');
    const app = express();
    const readFile = require('fs-readfile-promise');
    const btcConfig = require('./get-btc-config.js')();
    const btcSettings = require('./get-btc-settings');
    const CardStackManager = require('./lib/card-stack-manager.js');
    const btcLounges = require('./get-btc-lounges');
    const History = require('./lib/game-history');
    const EnterLounge = require('./lib/enter-lounge');
    const gameHistory = new History('main-room');
    const cors = require('cors');
    const BtcBot = require('./lib/btc-bot');
    const btcBot = new BtcBot(gameHistory);

    const game = new CardStackManager({
        history: gameHistory,
        btcBot: btcBot,
        settings: btcSettings
    });

    const bodyParser = require('body-parser');
    const cardLoader = require('./lib/card-loader');
    const fs = require('fs');

    // Views
    const getStatusViewData = require('./views/status.js');

    const cardSources = {
        questions: ['./data/official-cah/questions.txt'],
        answers: ['./data/official-cah/answers.txt']
    };

    const cardLoaderPromise = cardLoader.load(game, cardSources);

    cardLoaderPromise.then(() => {
        var port = btcConfig.env.port;
        app.listen(port);
        console.log('Listening to port ' + port);

        game.startRound();
    }).catch((err) => {
        console.log('Promise.all', err);
    });

    app.use(bodyParser.json({
        inflate: true,
    }));
    app.use(cors());
    app.use('/static', express.static('static'));
    app.use('/client', express.static('build/client'));

    app.set('views', './views');
    app.set('view engine', 'jade');
    app.set('jsonp callback name', 'callback');

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

    app.get('/enterlounge/:nick/:lounge', function(req, res) {
        res.json({
            status: 'OK',
            text: 'Entered Lounge' + req.params.lounge
        });
    });

    app.get('/enterlounge/:nick?', function(req, res) {
        const lounge = new EnterLounge(btcLounges);
        const status = lounge.getEntranceDetails();
        status.url = btcConfig.env.url;
        status.soiNick = req.params.nick;
        res.render('enterlounge', status);
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

    app.get('/set-test-mode', (req, res) => {
        game._setTestingMode();
        res.send(`OK - Testing mode ON`);
    });

    app.get('/startround', function(req, res) {
        game.startRound();
        res.send('OK -- Started Round');
    });

    let clientAppSrc;
    app.get('/client.js', function(req, res) {

        function send() {
            res.setHeader('Cache-Control', 'public, max-age=31557600'); // one year
            res.setHeader('content-type', 'application/javascript');

            res.send(clientAppSrc);

            if (btcConfig.isDev) {
                clientAppSrc = null;
            }
        }

        return (function() {
            if (clientAppSrc) {
                console.log('Serving cached client.js');
                send();
                return;
            }

            Promise.all([
                readFile('build/client/btc-client.js'),
                readFile('build/client/btc-common.js')
            ]).then(function(value) {
                clientAppSrc = `var gameUrl = "${btcConfig.env.url}"`;
                clientAppSrc += value[0].toString();
                clientAppSrc += value[1].toString();
                send();
            }).catch((err) => {
                console.log('Error reading files');
                console.log(err);
            });

        }());
    });

    app.get('/client.js.map', function(req, res) {
        fs.readFile('build/client/btc-client.js.map', 'utf8', function(err, data) {
            if (err) {
                return console.log(err);
            }
            res.send(data);
        });
    });

    exports = module.exports = app;
}());
