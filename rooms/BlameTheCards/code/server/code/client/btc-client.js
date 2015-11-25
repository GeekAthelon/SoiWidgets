var gameUrl = 'http://127.0.0.1:1701';

window.onload = function() {

    function drawBoard(data) {
        var gameDiv = document.getElementById('game-div');

        gameDiv.innerHTML = '';

        const inPlay = data.inPlay[0];
        if (inPlay) {
            const qcard = document.createElement('div');
            qcard.className = 'question-card';
            let txt = inPlay.text.replace('_', '__________');
            qcard.innerText = txt;
            gameDiv.appendChild(qcard);
        }

      const ahome = document.createElement('div');		
	ahome.className = 'answer-home';
        for (let i = 0; i < 10; i++) {
            const acard = document.createElement('div');
            acard.className = 'danswer-card zoom-tilt';
            acard.innerText = 'The quick brown fox and all his amazing friends.';
            ahome.appendChild(acard);
        }
		gameDiv.appendChild(ahome);
    }

    function getJSON(file, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                callback(JSON.parse(request.responseText));
            }
        };

        request.open('GET', file, true);
        request.send();
    }

    const username = document.getElementsByName('vqxus')[0].value.toLowerCase();

    getJSON(`${gameUrl}/getdata/${username}`, (data) => {
        drawBoard(data);
        console.log(data);
        console.log(JSON.stringify(data.inPlay, null, 2));
    });
};
