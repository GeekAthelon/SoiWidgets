(function() {
    'use strict';

    const express = require('express');
    const app = express();
    const path = require('path');

    //const readFile = require('fs-readfile-promise');
    const cors = require('cors');
    const bodyParser = require('body-parser');
    const serveIndex = require('serve-index');
    const cookieParser = require('cookie-parser');
    const http = require('http');
    const soiConfig = require('./fake-soi-get-config')();
    const roomConfig = require('./lib/room-config');
    roomConfig.loadAllRooms();

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

    (function() {
        const roomList = roomConfig.getRoomList();
        roomList.forEach(roomName => {
            const roomPath = roomConfig.getRoomPath(roomName);
            const staticPath = path.resolve(__dirname, `../rooms/${roomName}/static`);

            console.log(roomPath, staticPath);

            app.use(roomPath, express.static(staticPath));
            app.use(roomPath, serveIndex(staticPath));

        });
    }());

    const viewPath = path.resolve(__dirname, '../views');

    app.set('views', viewPath);
    app.set('view engine', 'jade');
    app.locals.pretty = true;

    app.set('jsonp callback name', 'callback');

    app.get('/', function(req, res) {
        const props = roomConfig.get('_controls');
        res.render('login', props);
    });

    app.post('/login', function(req, res) {
        console.log(req.body);
        const props = roomConfig.get('_controls');
        res.render('login', props);
    });

    exports = module.exports = app;
}());
