/*global SockJS, secureSend, removeNodes, serialize */

(function() {
    'use strict';

    function formatTime(t) {
        let hours = t.getHours();
        let minutes = t.getMinutes();
        let seconds = t.getSeconds();

        hours = ('00' + hours).substr(-2);
        minutes = ('00' + minutes).substr(-2);
        seconds = ('00' + seconds).substr(-2);

        return `${hours}:${minutes}:${seconds}`;
    }

    function showOneMessage(msg) {
        const container = document.querySelector('.message-container');
        const template = document.getElementById('message-template').innerHTML;

        const m = document.createElement('div');
        m.innerHTML = template;
        const cols = m.querySelectorAll('.message-column');

        msg.from = msg.from || '<system>';
        msg.to = msg.to || ' ';

        const time = new Date(msg.timeStamp);

        cols[0].appendChild(document.createTextNode(formatTime(time)));
        cols[1].appendChild(document.createTextNode(msg.from));
        cols[2].appendChild(document.createTextNode(msg.to));
        cols[3].appendChild(document.createTextNode(msg.message));

        const r = m.querySelector('.message-row');
        container.appendChild(r);
    }

    function showAllMessages(list) {
        list = list.sort((i1, i2) => {
            const d1 = Date.parse(i1.timeStamp);
            const d2 = Date.parse(i2.timeStamp);
            return d1 < d2;
        });
        list.forEach(msg => showOneMessage(msg));
    }

    function populatePlayerList(players) {
        const template = document.getElementById('player-list-template').innerHTML;
        const container = document.getElementById('player-list-container');
        const selectContainer = document.querySelector('#chat-to');

        while (selectContainer.options.length > 0) {
            selectContainer.remove(0);
        }

        removeNodes(container.querySelectorAll('.soiNick'));
        let option = new Option('<room>', '');
        selectContainer.options.add(option);

        Object.keys(players).forEach((player) => {
            const div = document.createElement('div');
            div.innerHTML = template;
            div.querySelector('.soiNick').appendChild(document.createTextNode(player));
            container.appendChild(div);

            const option = new Option(player, player);
            selectContainer.options.add(option);
        });
    }

    function handleTalkClick(sock) {
        const form = document.getElementById('chat');
        const data = serialize(form);

        secureSend(sock, {
            type: 'send-room-message',
            to: data['chat-to'],
            message: data['chat-message']
        });
        form.reset();
    }

    window.onload = function() {
        const sock = new SockJS(`${window.cred.gameUrl}/chat`);

        document.querySelector('#chat').addEventListener('submit', (event) => {
            event.preventDefault();
            handleTalkClick(sock);
        });

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

            if (data.type === 'all-messages') {
                showAllMessages(data.list);
            }

            if (data.type === 'one-message') {
                showOneMessage(data.details);
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
