'use strict';

const cardLoader = require('../lib/card-loader');
const btcSettings = require('../get-btc-settings');
const CardStackManager = require('../lib/card-stack-manager.js');
const History = require('../lib/game-history');
const gameHistory = new History('main-room');
const psevents = require('../lib/pub-sub');
const EnterLounge = require('../lib/enter-lounge');
const btcLounges = require('../get-btc-lounges');
const btcConfig = require('../get-btc-config.js')();
const RegisterUsers = require('../lib/register-users.js');
const registerUsers = new RegisterUsers();
const soi = require('../lib/soi');
const gRooms = require('../lib/game-room');

function init(app, cardSources) {
    app.get('/enterlounge/straight-link/:nick/:token', function(req, res) {
        const lounge = new EnterLounge(btcLounges);
        const status = lounge.getEntranceDetails();

        status.url = btcConfig.env.url;
        status.link = null;
        status.soiNick = req.params.nick;
        status.token = req.params.token;

        return registerUsers.verify(status.soiNick, status.token)
            .then((isVerified) => {
                status.verified = isVerified;
                res.render('enterlounge', status);
            });
    });

    app.get('/enterlounge/room-link/:soiRoomPassword', function(req, res) {
        const lounge = new EnterLounge(btcLounges);
        const status = lounge.getEntranceDetails();
        const soiRoomPassword = req.params.soiRoomPassword;

        status.url = btcConfig.env.url;
        status.link = null;

        return registerUsers.decodeFromSoiRoomPassword(soiRoomPassword)
            .then(details => {
                status.soiNick = details.soiUsername;
                status.token = details.token;
                return registerUsers.verify(status.soiNick, status.token);
            })
            .then((isVerified) => {
                status.verified = isVerified;
                res.render('enterlounge', status);
            });
    });

    app.post('/enterlounge/enter-room/', function(req, res) {
        return registerUsers.verify(req.body.soiNick, req.body.token)
            .then((isVerified) => {
                if (!isVerified) {
                    res.status(404).send(`Invalid credentials`);
                    return;
                }

                const roomName = req.body.roomName;
                const roomData = gRooms.get(roomName);
                if (!roomData) {
                    res.status(404).send(`${roomName} not found`);
                    return;
                }

                const viewData = {
                    url: btcConfig.env.url,
                    roomName: roomName,
                    theme: roomData.theme,
                    soiNick: req.body.soiNick,
                    token: req.body.token,
                    title: `Blame the Cards Room: ${roomName}`,
                    lounges: btcLounges,
                };

                res.render('game-room', viewData);
                return;
            });
    });

    app.post('/enterlounge/create-room/', function(req, res) {
        const roomName = req.body.roomName;
        const doesRoomExist = !!gRooms.get(roomName);
        if (doesRoomExist) {
            res.json({
                error: `Room ${roomName} already exists`
            });
            return;
        }

        const gameHistory = new History(roomName);
        const roomGame = new CardStackManager({
            history: gameHistory,
            btcBot: btcBot,
            settings: btcSettings,
            name: roomName
        });

        gRooms.add(roomName, {
            game: roomGame,
            theme: req.body.theme,
            owner: req.body.soiNick
        });

        const cardLoaderPromise = cardLoader.load(roomGame, cardSources);

        cardLoaderPromise.then(() => {
            //game.startRound();
            psevents.publish(`game.roomlist.changed`, gRooms.all());

            res.json({
                message: `Room ${roomName} prepped`
            });
        }).catch((err) => {
            res.json({
                error: `Error making ${roomName}`,
                details: err
            });
            console.log(`Error making ${roomName}`);
            console.log(err);
        });
    });

    app.post('/enterlounge/send-registration/', function(req, res) {
        const soiNick = req.body.soiNick;
        let token;

        registerUsers.add(soiNick)
            .then(details => {
                token = details.token;
                return registerUsers.encodeAsSoiRoomPassword(soiNick, token);
            })
            .then(soiRoomPassword => {
                const encodedNick = encodeURIComponent(soiNick);
                let newUrl = `${btcConfig.env.url}/enterlounge/straight-link/` +
                    `${encodedNick}/${token}`;
                if (btcConfig.isDev) {
                    newUrl = `<a href='${newUrl}'>Go to the lounge</a>`;
                } else {
                    newUrl = newUrl.replace('http', 'ht<b></b>tp');
                }

                const msg = `Someone, most likely you, has requested access to the
                   #r-btc@soi(Blame the Cards) lounge.   If so, follow the link below.
                   <br>
                   This link will be valid until the game is reset or until you request a
                   new link.
                   <br>
                   If you didn't request acces to the game, ignore this message.
                   <br>
                   ${newUrl}
                   <br>
                   #r-btc@soi(This will redirect you),${soiRoomPassword} unless your
                   nickname is too long, in which case you'll have to cut-and-paste the
                   link above.
                `;

                const msg2 = msg.replace(/(\r\n|\n|\r)/gm, '');
                return soi.postToMail(msg2, soiNick);
            }).then(() => {
                res.json({
                    status: 'OK'
                });
            }).catch((err) => {
                console.log('send-registration');
                console.log(err);

                res.json({
                    status: 'ERROR',
                    text: 'Error: ' + err
                });
            });
    });

    app.get('/enterlounge/reg/:nick/:link', function(req, res) {
        const lounge = new EnterLounge(btcLounges);
        const status = lounge.getEntranceDetails();
        status.url = btcConfig.env.url;
        status.soiNick = req.params.nick;
        status.verified = false;
        status.link = req.params.link;
        res.render('enterlounge', status);
    });

    psevents.subscribe('game.info', (message) => {
        void(message);
        //console.log(message);
    });

    psevents.subscribe('game.start-round.begin', () => {
        //btcBot.queueNewVotes();
    });

    psevents.subscribe('game.start-round.end', () => {

    });

}

exports = module.exports = init;
