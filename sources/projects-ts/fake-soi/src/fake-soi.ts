/// <reference path='../../../typings/node/node.d.ts' />
/// <zreference path='../../../typings/bluebird/bluebird.d.ts' />
/// <reference path='.././interfaces/IFakeSoiConfig.ts' />
/// <reference path='.././interfaces/IUserData.ts' />


const Promise = require('bluebird');

import {UserData} from './lib/user-data';




const soiConfigP = require('./lib/loadJSON').loadFakeSoiConfig();

soiConfigP.then((soiConfig: IFakeSoiConfig) => {

    'use strict';

    console.log('Read Configuration File for server: ', soiConfig.name);

    const port = soiConfig.env.port;

    const express = require('express');
    const app = express();
    const path = require('path');

    const cors = require('cors');
    const bodyParser = require('body-parser');
    // const serveIndex = require('serve-index');
    const cookieParser = require('cookie-parser');
    const http = require('http');

    const server = http.createServer(app)
        .listen(port, function() {
            console.log(`Express server listening on port ${port}.`);
        });

    void (server);

    app.use(cookieParser());
    app.use(bodyParser.json({
        inflate: true,
    }));
    // Catch POST data too
    app.use(bodyParser.urlencoded());

    app.use(cors());

    /*
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
    */

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
        /*
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
          */
    }

    app.route('/ctl/hotlist')
        .get(function(req, res) {
            let soiUseData = <ISoiUserData>req.query;
            showHotList(req.query.vqxus, res);
        }).post(function(req, res) {
            let soiUseData = <ISoiUserData>req.body;
            showHotList(req.body.vqxus, res);
        });

    function renderPage(res: any, soiUserData: ISoiUserData): Promise<void> {
        const userDataP = UserData.getUserDataAsync(soiUserData);

        userDataP.then(val => {
            console.log('val', val);
        });

        return Promise.all([userDataP]).spread((userData) => {
            res.send(JSON.stringify(userData));
        }).catch(err => {
            console.log('Acck.. error:', err);
            res.send('Ther was an unexpected error:' + err);
        });
    }

    app.route('/')
        .get(function(req, res) {
            let soiUserData = <ISoiUserData>req.query;
            renderPage(res, soiUserData);


            /*            
            const props = roomConfig.get('_controls');
            res.render('login', {
                roomProps: props
            });
            */
        })
        .post(function(req, res) {
            /*
            const databaseO = require('./lib/user-auth-db');
     
            databaseO.gatherUserDataAsync(req.body.vqxus).then(userData => {
                if (userData.isAuth) {
                    res.redirect('/ctl/hotlist?vqxus=' + encodeURIComponent(userData.prettyNick));
                } else {
                    res.redirect('/');
                }
            });
            */
        });

    exports = module.exports = app;
}).catch(err => {
    console.log('Error starting application');
    console.log(err);
});