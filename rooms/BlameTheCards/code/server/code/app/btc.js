(function() {
    'use strict';
    const express = require('express');
    const fs = require('fs');
    const request = require('request');
    const cheerio = require('cheerio');
    const app = express();
    const btcConfig = require('./get-btc-config.js')();
    const CardStackManager = require('./lib/card-stack-manager.js');
    const gameHistory = require('./lib/game-history');
    const cors = require('cors');
    const game = new CardStackManager();
    const bodyParser = require('body-parser');

    // Views
    const getStatusViewData = require('./views/status.js');

    const questionPromise = (function() {
        var list = [
            './data/official-cah/questions.txt'
        ];

        function readOne(fname) {
            return new Promise((resolve, reject) => {
                fs.readFile(fname, 'utf8', function(err, data) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const lines = data.split(/\r\n|\r|\n/);
                    console.log(`Read question file: ${fname}.  ${lines.length} lines.`);
                    game.loadQuestionCards(lines);
                    resolve();
                });
            });
        }

        return new Promise(function(resolve, reject) {
            const pmis = list.map(readOne);
            Promise.all(pmis).then(resolve).catch(err => reject(err));
        });
    }());

    const answerPromise = (function() {
        var list = [
            './data/official-cah/answers.txt'
        ];

        function readOne(fname) {
            return new Promise((resolve, reject) => {
                fs.readFile(fname, 'utf8', function(err, data) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    const lines = data.split(/\r\n|\r|\n/);
                    console.log(`Read answer file: ${fname}.  ${lines.length} lines.`);
                    game.loadAnswerCards(lines);
                    resolve();
                });
            });
        }

        return new Promise(function(resolve, reject) {
            const pmis = list.map(readOne);
            Promise.all(pmis).then(resolve).catch(err => reject(err));
        });
    }());

    Promise.all([questionPromise, answerPromise]).then(() => {
        console.log('All questions and answers loaded');
        var port = process.env.PORT;
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

        const votes = gameHistory.getAllVotes();
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
            res.send(clientAppSrc);
        }

        return (function() {
            if (clientAppSrc) {
                console.log('Serving cached client.js');
                send();
                return;
            }

            fs.readFile('build/client/btc-client.js', 'utf8', function(err, data) {
                if (err) {
                    return console.log(err);
                }
                clientAppSrc = `var gameUrl = "${process.env.URL}";${data}`;
                console.log('Serving freshly loaded client.js');
                send();
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

    app.get('/scrape', function(req, res) {

        var url = 'http://www.imdb.com/title/tt1229340/';
        var json;

        request(url, function(error, response, html) {
            if (!error) {
                var $ = cheerio.load(html);

                var title, release, rating;
                json = {
                    title: '',
                    release: '',
                    rating: ''
                };

                $('.header').filter(function() {
                    var data = $(this);
                    title = data.children().first().text();
                    release = data.children().last().children().text();

                    json.title = title;
                    json.release = release;
                });

                $('.star-box-giga-star').filter(function() {
                    var data = $(this);
                    rating = data.text();

                    json.rating = rating;
                });
            }

            // To write to the system we will use the built in 'fs' library.
            // In this example we will pass 3 parameters to the writeFile function
            // Parameter 1 :  output.json - this is what the created filename will be called
            // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an
            // extra step by calling JSON.stringify to make our JSON easier to read
            // Parameter 3 :  callback function - a callback function to let us know the status of our function

            fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
                console.log('File successfully written! - Check your project directory for' +
                    ' the output.json file');
            });

            // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
            res.send('Check your console!');

        });
    });

    exports = module.exports = app;
}());
