/*global SockJS, secureSend, removeNodes */

(function() {
    'use strict';

    function populatePlayerList(players) {
        const template = document.getElementById('player-list-template').innerHTML;
        const container = document.getElementById('player-list-container');

        removeNodes(container.querySelectorAll('.soiNick'));

        players.forEach((player) => {
            const div = document.createElement('div');
            div.innerHTML = template;
            div.querySelector('.soiNick').innerHTML = player;
            container.appendChild(div);
        });
    }

    window.onload = function() {
        const sock = new SockJS(`${window.cred.gameUrl}/chat`);

        sock.onmessage = function(json) {
            console.log('websocket data received', json);
            let data = {};

            try {
                data = JSON.parse(json.data);
            } catch (err) {}

            console.log('RECEIVED', data);

            if (data.roomName !== window.cred.roomName) {
                console.error(`Received out-of-band message for room ${data.roomName}`);
                return;
            }

            if (data.type === 'player-list') {
                populatePlayerList(data.list);
            }

        };

        sock.onopen = function() {
            console.log('Websocket open');
            secureSend(sock, {
                type: 'request-player-list'
            });
        };
    };
}());
