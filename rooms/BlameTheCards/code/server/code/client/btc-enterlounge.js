var gameUrl;
(function() {
    'use strict';

    window.onload = function() {

        function captureEnterClicks() {
            document.body.addEventListener('click', function(event) {
                let target = event.target;

                while (target && target !== document) {
                    const lounge = target.getAttribute('data-lounge');
                    if (lounge) {
                        window.alert('lounge: ' + lounge);
                        event.stopPropagation();
                        event.preventDefault();
                        window.location = `${gameUrl}/enterlounge/${lounge}`;
                    }
                    target = target.parentNode;
                }
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

        captureEnterClicks();
    };
}());
