/// <reference path='../../../typings/node/node.d.ts' />
/// <zreference path='../../../typings/bluebird/bluebird.d.ts' />
/// <reference path='.././interfaces/IFakeSoiConfig.ts' />
/// <reference path='.././interfaces/IUserData.ts' />


const Promise = require('bluebird');

import {UserData} from './lib/user-data';
import {RoomData} from './lib/room-data';

const soiConfigP = require('./lib/loadJSON').loadFakeSoiConfig();

soiConfigP.then((soiConfig: IFakeSoiConfig) => {
    console.log('Read Configuration File for server: ', soiConfig.name);

    const port = soiConfig.env.port;

    const express = require('express');
    const app = express();
    const path = require('path');

    const cors = require('cors');
    const bodyParser = require('body-parser');
    const serveIndex = require('serve-index');
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


    function prepRoomsAsync(): Promise<void> {
        return RoomData.getRoomCodesAsync().then(codes => {
            codes.forEach(code => {

                RoomData.getRoomDataAsync(code).then(roomData => {
                    const staticPath = path.resolve(__dirname, `../rooms/${code}/static`);
                    const roomPath = `/room-static/${code}/`;

                    roomData.body.background = roomData.body.background.replace('~/', roomPath);

                    app.use(roomPath, express.static(staticPath));
                    app.use(roomPath, serveIndex(staticPath));

                    console.log('Found room', code);
                    console.log(`Mapped ${roomPath} to ${staticPath}`);
                });
            });
        });
    }
    prepRoomsAsync();

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

    function showHotList(soiUserData: ISoiUserData, res: any) {
        let userDataP = UserData.getUserDataAsync(soiUserData);

        const allDataP = userDataP.then(userData => {
            return RoomData.getAllRoomDataAsync();
        });

        const roomDataP = userDataP.then(userData => {
            return RoomData.getControlRoomDataAsync(userData.roomName, userData.controlRoomName);
        });


        return Promise.all([
            userDataP,
            allDataP,
            roomDataP
        ]).spread((
            userData: IUserData,
            allData: IRoomData[],
            roomData
        ) => {

            let soiUserData = UserData.toSoiProperties(userData);

            let roomLinks = {};
            allData.forEach(room => {
                let url = `/room/${room.code}?vqxus=${encodeURIComponent(userData.givenName)}`;

                roomLinks[room.code] = url;
                });

            console.log(JSON.stringify(roomLinks, null, 2));

            res.render('hotlist.pug', {
                userData,
                roomData,
                roomList: allData,
                soiUserData,
                roomLinks
            });

            // const out = [userData, roomData];
            // res.send('<pre>' + JSON.stringify(out, null, 2) + '</pre>');
        }).catch(err => {
            console.log('Acck.. error:', err);
            res.send('Ther was an unexpected error:' + err);
        });
    }

    app.route('/ctl/hotlist')
        .get(function(req, res) {
            let soiUserData = <ISoiUserData>req.query;
            showHotList(soiUserData, res);
        }).post(function(req, res) {
            let soiUserData = <ISoiUserData>req.body;
            showHotList(soiUserData, res);
        });

    function renderPage(res: any, soiUserData: ISoiUserData): Promise<void> {
        const userDataP = UserData.getUserDataAsync(soiUserData);

        const roomDataP = userDataP.then(userData => {
            return RoomData.getControlRoomDataAsync(userData.roomName, userData.controlRoomName);
        });

        return Promise.all([
            userDataP,
            roomDataP
        ]).spread((
            userData: IUserData,
            roomData: IRoomData
        ) => {
            console.log(`Template is ${roomData.template}`);

            let soiUserData = UserData.toSoiProperties(userData);

            res.render(roomData.template, {
                userData,
                roomData,
                soiUserData
            });

            // const out = [userData, roomData];
            // res.send('<pre>' + JSON.stringify(out, null, 2) + '</pre>');
        }).catch(err => {
            console.log('Acck.. error:', err);
            res.send('Ther was an unexpected error:' + err);
        });
    }

    app.route('/')
        .get(function(req, res) {
            let soiUserData = <ISoiUserData>req.query;
            renderPage(res, soiUserData);
        })
        .post(function(req, res) {
            let soiUserData = <ISoiUserData>req.body;

            let userDataP = UserData.getUserDataAsync(soiUserData);

            userDataP.then(userData => {
                res.redirect('/ctl/hotlist?vqxus=' + encodeURIComponent(userData.givenName));
            });


            //res.send('Logged in');
            /*
            const databaseO = require('./lib/user-auth-db');
     
            databaseO.gatherUserDataAsync(req.body.vqxus).then(userData => {
                if (userData.isAuth) {
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