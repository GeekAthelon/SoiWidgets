(function() {
    'use strict';

    const express = require('express');
    const app = express();
    const readFile = require('fs-readfile-promise');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const http = require('http');
    const soiConfig = require('./fake-soi-get-config')();

    const port = soiConfig.env.port;
    //app.listen(port);
    //console.log('Listening to port ' + port);

    setTimeout(function() {
        const server = http.createServer(app)
            .listen(port, function() {
                console.log(
                    'Express server listening on port ' +
                    port);
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

    app.get('/', function(req, res) {
        res.render('index', status);
    });

    exports = module.exports = app;
}());
