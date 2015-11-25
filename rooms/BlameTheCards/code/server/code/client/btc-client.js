//var gameUrl = 'http://127.0.0.1:1701';
var gameUrl = 'http://192.168.40.2:1701';

//window.onerror = function() {
//    window.alert(JSON.stringify(arguments));
//};

window.onload = function() {
    const username = document.getElementsByName('vqxus')[0].value.toLowerCase();
    const playerAnswers = [];
    let gameState;

    function answerCardsNeeded(data) {
        var temp = data.inPlay[0].text;
        return temp.split('_').length - 1;
    }

    function drawBoard(data) {
        var gameDiv = document.getElementById('game-div');
        const atemplate = document.getElementById('answer-template').innerHTML;
        const qtemplate = document.getElementById('question-template').innerHTML;

        gameDiv.innerHTML = '';

        function drawQuestionCard() {
            const inPlay = data.inPlay[0];
            if (inPlay) {
                const qcard = document.createElement('div');
                let txt = inPlay.text;
                qcard.innerHTML = '' + qtemplate;

                playerAnswers.forEach((cardNum) => {
                    const cardList = data.hand.filter((c) => c.num === cardNum);
                    const card = cardList[0];
                    txt = txt.replace(/_/, `<i>${card.text}</i>`);
                });

                txt = txt.replace(/_/g, '__________');
                qcard.getElementsByClassName('question-card-text')[0]
                    .innerHTML = txt;

                gameDiv.appendChild(qcard);
            }
        }

        function drawAnswerCards() {
            const ahome = document.createElement('div');

            data.hand.forEach((card) => {
                const acard = document.createElement('div');
                const playPosition = playerAnswers.indexOf(card.num);
                acard.innerHTML = '' + atemplate;

                if (playPosition !== -1) {
                    acard.getElementsByClassName('answer-card-marker-span')[0]
                        .innerText = playPosition + 1;
                }

                acard.getElementsByClassName('answer-card-text')[0].innerText = card.text;
                acard.setAttribute('data-card-num', card.num);

                gameDiv.appendChild(acard);
            });
        }

        function drawJoinButton() {
            if (data.hand.length > 0) {
                return;
            }

            const acard = document.createElement('div');
            acard.innerHTML = '' + atemplate;
            acard.getElementsByClassName('answer-card-text')[0].innerText =
                'Deal me some cards!';
            gameDiv.appendChild(acard);

            acard.addEventListener('click', (event) => {
                event.stopPropagation();
                joinGame();
            });
        }

        drawQuestionCard();
        drawAnswerCards();
        drawJoinButton();
    }

    function getJSON(file, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {

            if (request.readyState === 4 && request.status === 200) {
                callback(JSON.parse(request.responseText));
            }
        };

        request.onerror = function(err) {
            window.alert('Error: ' + JSON.stringify(err.message));
        };

        request.open('GET', file, true);
        request.send();
    }

    function getData() {
        getJSON(`${gameUrl}/getdata/${username}`, (data) => {
            drawBoard(data);
            gameState = data;
        });
    }

    function joinGame() {
        getJSON(`${gameUrl}/addplayer/${username}`, (data) => {
            getData();
        });
    }

    function handleCardClick(cardNum) {
        var maxAnswers = answerCardsNeeded(gameState);

        if (playerAnswers.length < maxAnswers) {
            playerAnswers.push(cardNum);
            drawBoard(gameState);
        }
    }

    function captureAnswerClicks() {
        document.body.addEventListener('click', function(event) {
            var target = event.target;

            while (target !== document) {
                var num = target.getAttribute('data-card-num');
                if (num) {
                    handleCardClick(+num);
                    break;
                }
                target = target.parentNode;
            }
        });
    }

    function captureClearAnswerClicks() {
        document.body.addEventListener('click', function(event) {
            var target = event.target;

            while (target && target !== document) {
                if (target.className === 'quetion-card-clear-answers') {
                    playerAnswers.length = 0;
                    drawBoard(gameState);
                }
                target = target.parentNode;
            }
        });
    }

    captureAnswerClicks();
    captureClearAnswerClicks();
    getData();
};
