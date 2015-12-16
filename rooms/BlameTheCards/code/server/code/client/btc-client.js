var gameUrl;

//window.onerror = function() {
//    window.alert(JSON.stringify(arguments));
//};

window.onload = function() {
    const soiUsername = document.getElementsByName('vqxus')[0].value.toLowerCase().replace(/[^a-z1234567890@]/g, '');
    const username = hashFnv32a(soiUsername, true);
    const playerAnswers = [];
    let game;
    let timerId;
    let votedHash = {};

    /**
     * Calculate a 32 bit FNV-1a hash
     * Found here: https://gist.github.com/vaiorabbit/5657561
     * Ref.: http://isthe.com/chongo/tech/comp/fnv/
     *
     * @param {string} str the input value
     * @param {boolean} [asString=false] set to true to return the hash value as
     *     8-digit hex string instead of an integer
     * @param {integer} [seed] optionally pass the hash of the previous chunk
     * @returns {integer | string}
     */
    function hashFnv32a(str, asString, seed) {
        /*jshint bitwise:false */
        var i, l,
            hval = (seed === undefined) ? 0x811c9dc5 : seed;

        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        if (asString) {
            // Convert to 8 digit hex string
            return ('0000000' + (hval >>> 0).toString(16)).substr(-8);
        }
        return hval >>> 0;
    }

    function removeNodes(nodes) {
        [].forEach.call(nodes, n => {
            n.parentNode.removeChild(n);
        });
    }

    function setTimer(countDown) {
        clearTimeout(timerId);
        let endTime = Date.now() + countDown;

        function showTime() {
            var leftHome = document.getElementsByClassName('question-card-time-left')[0];
            timerId = setTimeout(() => {
                const now = Date.now();
                const left = endTime - now;

                if (left > 0) {
                    showTime();
                    leftHome.innerHTML = Math.floor(left / 1000);
                } else {
                    leftHome.innerHTML = 'Loading new question';
                    getData();
                }
            }, 25);
        }

        showTime();
    }

    function answerCardsNeeded(data) {
        var temp = data.inPlay[0].text;
        return temp.split('_').length - 1;
    }

    function fillInQuestionCard(txt) {
        playerAnswers.forEach((cardNum) => {
            const cardList = game.hand.filter((c) => c.num === cardNum);
            const card = cardList[0];
            txt = txt.replace(/_/, `<i>${card.text}</i>`);
        });
        return txt;
    }

    function drawVotes(voteData) {
        votedHash = {};

        removeNodes(document.querySelectorAll('.votee-list'));

        voteData.forEach(v => {
            votedHash[`${v.round}__${v.voter}`] = true;

            const adiv = document.querySelector(
                `[data-btc-player="${v.votee}"]` +
                `[data-btc-round="${v.round}"]`
            );
            if (adiv) {
                addVoteMessage(adiv, `Voted on by: ${v.voter}`, 'votee-list');
            }
        });
    }

    function drawBoard(data) {
        drawVotes(data.gameHistory);
        var gameDiv = document.getElementById('game-div');
        const atemplate = document.getElementById('answer-template').innerHTML;
        const qtemplate = document.getElementById('question-template').innerHTML;

        gameDiv.innerHTML = '';

        function drawQuestionCard() {
            const inPlay = data.inPlay[0];
            if (inPlay) {
                const qcard = document.createElement('div');
                qcard.innerHTML = '' + qtemplate;

                let txt = fillInQuestionCard(inPlay.text);
                txt = txt.replace(/_/g, '__________');
                qcard.getElementsByClassName('question-card-text')[0]
                    .innerHTML = txt;

                if (data.playedRound) {
                    let playButton =
                        qcard.getElementsByClassName('question-card-play-answers')[0];

                    playButton.innerHTML = 'Already played';
                    playButton.disabled = true;
                }
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
                        .innerHTML = playPosition + 1;
                }

                acard.getElementsByClassName('answer-card-text')[0].innerHTML = card.text;
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
            acard.getElementsByClassName('answer-card-text')[0].innerHTML =
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
            //window.alert('Error: ' + JSON.stringify(err.message));
        };

        request.open('GET', file, true);
        request.send();
    }

    function postJSON(file, data, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {

            if (request.readyState === 4 && request.status === 200) {
                callback(JSON.parse(request.responseText));
            }
        };

        request.onerror = function(err) {
            //window.alert('Error: ' + JSON.stringify(err.message));
        };

        request.open('POST', file, true);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.send(JSON.stringify(data));
    }

    function getData() {
        getJSON(`${gameUrl}/getdata/${username}`, (data) => {
            clearSelectedAnswers();
            drawBoard(data);
            setTimer(data.countdown);
            game = data;
        });
    }

    function joinGame() {
        getJSON(`${gameUrl}/addplayer/${username}`, (data) => {
            getData();
        });
    }

    function handleCardClick(cardNum) {
        if (game.playedRound) {
            return;
        }

        var maxAnswers = answerCardsNeeded(game);

        if (playerAnswers.length < maxAnswers) {
            playerAnswers.push(cardNum);
            drawBoard(game);
        }
    }

    function clearSelectedAnswers() {
        playerAnswers.length = 0;
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
                if (target.className === 'question-card-clear-answers') {
                    clearSelectedAnswers();
                    drawBoard(game);
                }
                target = target.parentNode;
            }
        });
    }

    function playAnswers() {
        var cards = playerAnswers.join('/');

        if (playerAnswers.length !== answerCardsNeeded(game)) {
            //alert('Not enough answers');
            return;
        }

        getJSON(`${gameUrl}/play/${username}/${cards}`, (data) => {
            const inPlay = game.inPlay[0];
            const txtBox = document.getElementsByName('vqxsp')[0];
            const txt = fillInQuestionCard(inPlay.text);

            txtBox.value = `<p class='question-card' ` +
                ` data-btc-player='${soiUsername}' ` +
                ` data-btc-round='${game.round}'` +
                ` data-btc-inplay='${game.inPlay[0].num}'` +
                `><span>${txt}</span></p>`;
            txtBox.form.submit();
        });
    }

    function capturePlayAnswerClicks() {
        document.body.addEventListener('click', function(event) {
            var target = event.target;

            while (target && target !== document) {
                if (target.className === 'question-card-play-answers') {
                    playAnswers();
                }
                target = target.parentNode;
            }
        });
    }

    function addStatusButton() {
        const findButton = document.querySelector('input[value="Find"]');
        const statusButton = document.createElement('input');
        statusButton.value = 'Status';
        statusButton.type = 'submit';

        findButton.parentNode.insertBefore(statusButton, findButton.nextSibling);

        statusButton.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            window.location = `${gameUrl}/status`;
        });
    }

    function addVoteMessage(adiv, message, className) {
        const msg = document.createElement('div');
        msg.className = className || '';
        msg.innerHTML = `<strong>${message}</strong>`;
        adiv.appendChild(msg);
        addVoteButtons();
    }

    function addVoteButtons() {
        const posts = document.querySelectorAll('[data-btc-round]');

        function attachClick(but) {
            but.addEventListener('click', function(event) {
                event.stopPropagation();
                event.preventDefault();

                const parent = but.parentNode;
                const votee = parent.getAttribute('data-btc-player');
                const round = parent.getAttribute('data-btc-round');
                const inplay = parent.getAttribute('data-btc-inplay');

                if (!game.inGame) {
                    addVoteMessage(parent,
                        'You aren\'t even in the game.');
                    return;
                }

                if (!game.lastRoundPlayed) {
                    addVoteMessage(parent,
                        'You\ve got cards, but you haven\'t played any yet.');
                    return;
                }

                if (game.round - game.lastRoundPlayed > 3) {
                    addVoteMessage(parent,
                        'You haven\'t played in a few rounds -- You must play to vote.');
                    return;
                }

                if (votedHash[`${round}__${soiUsername}`]) {
                    addVoteMessage(parent,
                        'You already voted on this round.');
                    return;
                }

                if (soiUsername === votee) {
                    addVoteMessage(parent,
                        'You can\'t vote for yourself');
                    return;
                }

                const html = parent.querySelector('span').innerHTML;
                const url = `${gameUrl}/vote`;

                const data = {
                    voter: soiUsername,
                    votee,
                    round,
                    inplay,
                    html
                };

                postJSON(
                    url, data, (voteData) => {
                        addVoteMessage(parent, 'Vote Registered');
                        game.gameHistory = voteData;
                        drawVotes(voteData);
                    });

                addVoteMessage(parent, 'Sending vote');
            });
        }

        removeNodes(document.querySelectorAll('.btc-vote'));

        [].forEach.call(posts, post => {
            const span = post.querySelector('span');
            if (!span) {
                return;
            }

            const voteButton = document.createElement('input');
            voteButton.value = 'Vote';
            voteButton.type = 'submit';
            voteButton.style.cssFloat = 'left';
            voteButton.style.display = 'block';
            voteButton.style.position = 'relative';
            voteButton.className = 'btc-vote';
            voteButton.style.marginRight = '1em';

            attachClick(voteButton);
            post.insertBefore(voteButton, post.firstChild);
        });
    }

    window.addEventListener('resize', function(event) {
        addVoteButtons();
    });

    addVoteButtons();
    addStatusButton();
    captureAnswerClicks();
    captureClearAnswerClicks();
    capturePlayAnswerClicks();
    getData();
};
