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
    const linkManager = require('./lib/link-manager');
    roomConfig.loadAllRooms();

    const port = soiConfig.env.port;

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
        const roomList = roomConfig.getFullRoomList();
        roomList.forEach(roomName => {
            const roomPath = roomConfig.getRoomPath(roomName);
            const staticPath = path.resolve(__dirname, `../rooms/${roomName}/static`);

            console.log('Static: ', roomPath, staticPath);

            app.use(roomPath, express.static(staticPath));
            app.use(roomPath, serveIndex(staticPath));

        });
    }());

    const viewPath = path.resolve(__dirname, '../views');

    app.set('views', viewPath);
    app.set('view engine', 'pug');
    app.locals.pretty = true;

    app.set('jsonp callback name', 'callback');

    function showRoom(res, d) {
        res.send(JSON.stringify(d));
    }

    app.route('/room')
        .get(function(req, res) {
            let data = {
                nick: req.query.nick,
                room: req.query.room
            };
            showRoom(res, data);

        })
        .post(function(req, res) {
            let data = {
                nick: req.body.nick,
                room: req.body.room
            };
            showRoom(res, data);
        });

    function showHotList(nick, res) {
        const databaseO = require('./lib/user-auth-db');
        const props = roomConfig.get('_controls');
        const roomList = roomConfig.getPlayerRoomList();

        return databaseO.gatherUserDataAsync(nick).then(userData => {
            const roomLinksPromises = [];
            const roomLinks = {};
            const roomDetails = {};
            roomList.forEach(r => {
                const rDetail = roomConfig.get(r);
                roomDetails[r] = rDetail;
                roomLinksPromises.push(
                    linkManager.getRoomLinkAsync(r, r.tail, userData.prettyNick)
                );
            });

            return Promise.all(roomLinksPromises).then(ll => {
                ll.forEach((item, idx) => {
                    let roomid = roomList[idx];
                    roomLinks[roomid] = item;
                });

                const cfg = {
                    roomProps: props,
                    user: userData,
                    roomList: roomList,
                    roomDetails: roomDetails,
                    roomLinks: roomLinks
                };

                if (userData.isAuth) {
                    res.render('hotlist', cfg);
                } else {
                    res.redirect('/');
                }
            });
        });
    }

    app.route('/ctl/hotlist')
        .get(function(req, res) {
            showHotList(req.query.vqxus, res);
        }).post(function(req, res) {
            showHotList(req.body.vqxus, res);
        });

    app.route('/')
        .get(function(req, res) {
            const props = roomConfig.get('_controls');
            res.render('login', {
                roomProps: props
            });
        })
        .post(function(req, res) {
            const databaseO = require('./lib/user-auth-db');

            databaseO.gatherUserDataAsync(req.body.vqxus).then(userData => {
                if (userData.isAuth) {
                    res.redirect('/ctl/hotlist?vqxus=' + encodeURIComponent(userData.prettyNick));
                } else {
                    res.redirect('/');
                }
            });
        });

    exports = module.exports = app;
}());
