(function() {
    'use strict';

    const express = require('express');
    const app = express();
    const path = require('path');

    //const readFile = require('fs-readfile-promise');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const cookieParser = require('cookie-parser');
    const http = require('http');
    const soiConfig = require('./fake-soi-get-config')();
    const getRoomConfig = require('./lib/get-room-config');

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

        void(server);
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

    const viewPath = path.resolve(__dirname, '../views');

    app.set('views', viewPath);
    app.set('view engine', 'jade');
    app.locals.pretty = true;

    app.set('jsonp callback name', 'callback');

    app.get('/', function(req, res) {
        const props = getRoomConfig('_controls');
        res.render('login', props);
    });

    exports = module.exports = app;
}());
