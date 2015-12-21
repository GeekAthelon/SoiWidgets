/*global postJSON: true, validate:true, serialize:true */
var gameUrl;
(function() {
    'use strict';

    window.onload = function() {

        function configureCreateRoom() {
            var form = document.getElementById('createRoomForm');
            if (!form) {
                return;
            }

            validate.attachAll(form);

            var submitButton = document.getElementById('createRoom');
            submitButton.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();

                const isValid = validate.verifyForm(form);
                console.log(isValid);
                const data = serialize(form);
                console.log(data);
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
                    url, data, (r) => {
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

        function addExtraButtons() {
            const findButton = document.querySelector('input[value="Find"]');

            function addButton(text, callback) {
                const button = document.createElement('input');
                button.value = text;
                button.type = 'submit';
                findButton.parentNode.insertBefore(button, findButton.nextSibling);
                button.addEventListener('click', callback);
            }

            addButton('Status', function(event) {
                event.stopPropagation();
                event.preventDefault();
                window.location = `${gameUrl}/status`;
            });

            addButton('Enter the Lounge', function(event) {
                event.stopPropagation();
                event.preventDefault();
                window.location = `${gameUrl}/enterlounge`;
            });

        }

        window.addEventListener('resize', function(event) {
            //addVoteButtons();
        });

        captureVerifyForm();
        configureCreateRoom();
    };
}());
