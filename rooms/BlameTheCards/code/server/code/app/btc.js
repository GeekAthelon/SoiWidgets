(function() {
    'use strict';

    const express = require('express');
    const app = express();
    const readFile = require('fs-readfile-promise');
    const btcConfig = require('./get-btc-config.js')();
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const fs = require('fs');
    const http = require('http');
    const initWebSockets = require('./app-init/websockets');
    const initMainRoom = require('./app-init/main-room');
    const initLounges = require('./app-init/lounges');

    // Views

    const cardSources = {
        questions: [
            './data/official-cah/questions.txt',
            './data/cards-against-gallifrey/questions.txt'
        ],
        answers: [
            './data/official-cah/answers.txt',
            './data/cards-against-gallifrey/answers.txt'
        ]
    };

    var port = btcConfig.env.port;
    //app.listen(port);
    //console.log('Listening to port ' + port);

    setTimeout(function() {
        var server = http.createServer(app).listen(port, function() {
            console.log('Express server listening on port ' + port);
            initMainRoom(app, cardSources);
            initLounges(app, cardSources);
            initWebSockets(app, server);
        });
    }, 1000);

    app.use(cookieParser());
    app.use(bodyParser.json({
        inflate: true,
    }));
    // Catch POST data too
    app.use(bodyParser.urlencoded());

    app.use(cors());
    app.use('/static', express.static('static'));
    app.use('/client', express.static('build/client'));
    app.use('/css', express.static('build/css'));

    app.set('views', './views');
    app.set('view engine', 'jade');
    app.set('jsonp callback name', 'callback');

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
