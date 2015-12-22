/*global postJSON: true, validate:true, serialize:true, post:true */
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

            form.addEventListener('submit', (event) => {
                event.stopPropagation();
                event.preventDefault();

                const isValid = validate.verifyForm(form);
                const validationMessageContainer =
                    document.querySelector('[data-val-for="createRoom"]');

                if (isValid) {
                    validationMessageContainer.innerHTML = '';
                    const formData = serialize(form);
                    const url = `${gameUrl}/enterlounge/create-room`;

                    postJSON(
                        url, formData, (result) => {
                            if (result.error) {
                                validationMessageContainer.innerHTML = result.error;
                            } else {
                                const enterUrl = `${gameUrl}/enterlounge/enter-room`;
                                post(enterUrl, formData, 'post');
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

        captureVerifyForm();
        configureCreateRoom();
    };
}());
