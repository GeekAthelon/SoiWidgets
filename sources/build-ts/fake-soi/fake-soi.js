/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/bluebird/bluebird.d.ts" />
(function () {
    'use strict';
    var k = [];
    var express = require('express');
    var app = express();
    var path = require('path');
    var readFile = require('fs-readfile-promise');
    var cors = require('cors');
    var bodyParser = require('body-parser');
    var serveIndex = require('serve-index');
    var cookieParser = require('cookie-parser');
    var http = require('http');
    var soiConfig = require('./fake-soi-get-config')();
    var roomConfig = require('./lib/room-config');
    var linkManager = require('./lib/link-manager');
    roomConfig.loadAllRooms();
    var port = soiConfig.env.port;
    setTimeout(function () {
        var server = http.createServer(app)
            .listen(port, function () {
            console.log('Express server listening on port ' +
                port);
        });
        void (server);
    }, 1000);
    app.use(cookieParser());
    app.use(bodyParser.json({
        inflate: true
    }));
    // Catch POST data too
    app.use(bodyParser.urlencoded());
    app.use(cors());
    (function () {
        var roomList = roomConfig.getFullRoomList();
        roomList.forEach(function (roomName) {
            var roomPath = roomConfig.getRoomPath(roomName);
            var staticPath = path.resolve(__dirname, "../rooms/" + roomName + "/static");
            console.log('Static: ', roomPath, staticPath);
            app.use(roomPath, express.static(staticPath));
            app.use(roomPath, serveIndex(staticPath));
        });
    }());
    var viewPath = path.resolve(__dirname, '../views');
    app.set('views', viewPath);
    app.set('view engine', 'pug');
    app.locals.pretty = true;
    app.set('jsonp callback name', 'callback');
    function showRoom(res, d) {
        res.send(JSON.stringify(d));
    }
    app.route('/room')
        .get(function (req, res) {
        var data = {
            nick: req.query.nick,
            room: req.query.room
        };
        showRoom(res, data);
    })
        .post(function (req, res) {
        var data = {
            nick: req.body.nick,
            room: req.body.room
        };
        showRoom(res, data);
    });
    function showHotList(nick, res) {
        var databaseO = require('./lib/user-auth-db');
        var props = roomConfig.get('_controls');
        var roomList = roomConfig.getPlayerRoomList();
        return databaseO.gatherUserDataAsync(nick).then(function (userData) {
            var roomLinksPromises = [];
            var roomLinks = {};
            var roomDetails = {};
            roomList.forEach(function (r) {
                var rDetail = roomConfig.get(r);
                roomDetails[r] = rDetail;
                roomLinksPromises.push(linkManager.getRoomLinkAsync(r, r.tail, userData.prettyNick));
            });
            return Promise.all(roomLinksPromises).then(function (ll) {
                ll.forEach(function (item, idx) {
                    var roomid = roomList[idx];
                    roomLinks[roomid] = item;
                });
                var cfg = {
                    roomProps: props,
                    user: userData,
                    roomList: roomList,
                    roomDetails: roomDetails,
                    roomLinks: roomLinks
                };
                if (userData.isAuth) {
                    res.render('hotlist', cfg);
                }
                else {
                    res.redirect('/');
                }
            });
        });
    }
    app.route('/ctl/hotlist')
        .get(function (req, res) {
        showHotList(req.query.vqxus, res);
    }).post(function (req, res) {
        showHotList(req.body.vqxus, res);
    });
    app.route('/')
        .get(function (req, res) {
        var props = roomConfig.get('_controls');
        res.render('login', {
            roomProps: props
        });
    })
        .post(function (req, res) {
        var databaseO = require('./lib/user-auth-db');
        databaseO.gatherUserDataAsync(req.body.vqxus).then(function (userData) {
            if (userData.isAuth) {
                res.redirect('/ctl/hotlist?vqxus=' + encodeURIComponent(userData.prettyNick));
            }
            else {
                res.redirect('/');
            }
        });
    });
    exports = module.exports = app;
}());
