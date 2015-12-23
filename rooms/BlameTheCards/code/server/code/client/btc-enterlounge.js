/*global postJSON: true, validate:true, serialize:true, post:true, SockJS, secureSend */

(function() {
    'use strict';

    window.onload = function() {
        const sock = new SockJS(`${window.cred.gameUrl}/chat`);

        function enterRoom(roomName) {
            const enterUrl = `${window.cred.gameUrl}/enterlounge/enter-room`;
            const form = document.getElementById('createRoomForm');
            const formData = serialize(form);
            formData.roomName = roomName;
            post(enterUrl, formData, 'post');
        }

        function createRoomList(list, defaultMessage) {
            const container = document.getElementById('room-list-container');
            const template = document.getElementById('join-room-template').innerHTML;

            if (!container) {
                return;
            }

            if (list.length === 0) {
                container.innerHTML = defaultMessage;
                return;
            }

            container.innerHTML = '';
            list.forEach(room => {
                const inp = document.createElement('div');
                inp.innerHTML = template;
                inp.className = 'room-list-item-container';
                const img = inp.querySelector('img');
                img.src = `/static/images/${room.theme}-logo-small.png`;
                img.className = `lounge_${room.theme}`;

                inp.querySelector('.room-list-name').innerHTML = room.roomName;
                inp.querySelector('.room-list-owner').innerHTML = room.owner;
                container.appendChild(inp);

                const button = inp.querySelector('button');
                button.addEventListener('click', () => {
                    enterRoom(room.roomName);
                });
            });
        }

        function configureCreateRoom() {
            var form = document.getElementById('createRoomForm');
            if (!form) {
                return;
            }

            validate.attachAll(form);

            form.addEventListener('submit', (event) => {
                event.stopPropagation();
                event.preventDefault();

                const isValid = validate.verifyForm(form);
                const validationMessageContainer =
                    document.querySelector('[data-val-for="createRoom"]');

                if (isValid) {
                    validationMessageContainer.innerHTML = '';
                    const formData = serialize(form);
                    const url = `${window.cred.gameUrl}/enterlounge/create-room`;

                    postJSON(
                        url, formData, (result) => {
                            if (result.error) {
                                validationMessageContainer.innerHTML = result.error;
                            } else {
                                enterRoom(formData.roomName);
                            }
                        });

                } else {
                    validationMessageContainer.innerHTML = 'Error in form.';
                }
            });

            document.body.addEventListener('zclick', function(event) {
                let target = event.target;

                while (target && target !== document) {
                    const lounge = target.getAttribute('data-lounge');
                    if (lounge) {
                        window.alert('lounge: ' + lounge);
                        event.stopPropagation();
                        event.preventDefault();
                        //window.location = `${gameUrl}/enterlounge/${lounge}`;
                    }
                    target = target.parentNode;
                }
            });
        }

        function captureVerifyForm() {
            const button = document.getElementById('submitVerify');
            if (!button) {
                return;
            }

            const form = button.form;

            form.addEventListener('submit', (event) => {
                event.stopPropagation();
                event.preventDefault();
            });

            button.addEventListener('click', (event) => {
                const soiNick = document.getElementById('soiNick').value;
                if (!soiNick) {
                    return;
                }

                const url = `/enterlounge/send-registration/`;
                const data = {
                    soiNick
                };

                postJSON(
                    url, data, (reponse) => {
                        void(reponse);
                        const span = document.getElementById('instructions');
                        span.innerHTML = 'Return to the SOI Mail room to check';

                        const el = document.getElementById('soi-mail-room');
                        if (el) {
                            window.location = el.href;
                        }
                        //window.alert(JSON.stringify(r));
                    });
                event.stopPropagation();
                event.preventDefault();
            });
        }

        window.addEventListener('resize', function(event) {
            void(event);
            //addVoteButtons();
        });

        sock.onmessage = function(json) {
            console.log('websocket data received', json);
            let data = {};

            try {
                data = JSON.parse(json.data);
            } catch (err) {}

            if (data.type === 'room-list') {
                createRoomList(data.list, 'No Rooms Created yet');
            }
        };

        sock.onopen = function() {
            console.log('Websocket open');
            secureSend(sock, {
                type: 'request-room-list'
            });
        };

        captureVerifyForm();
        configureCreateRoom();
        createRoomList([], 'Loading...');
    };
}());
