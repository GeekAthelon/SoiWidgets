"use strict";

const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;
const $ = jQuery;

// Encode our square numbers (0..63) as one of these characters.
// That way we can just build up a long string instead of an array
// which will make for MUCH shorter JSON when posting games.
const BYTE_ENCODE = Array.from("abcefghijklmnopqrstuvwxyzABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789[]!@#");
const CELL_EMPTY = 'e';
const CELL_WHITE = 'w';
const CELL_BLACK = 'b';

const CELL_EMPTY_CLASS = 'cell_empty';
const CELL_WHITE_CLASS = 'cell_white';
const CELL_BLACK_CLASS = 'cell_black';

const POST_CLASS = "save-game";
const CELL_CLASS = "flipit-cell";

const calculateFlipped = (square, color) => {
    const pos = squareToPosition(square);
    const maxDim = Math.max(BOARD_WIDTH, BOARD_HEIGHT);

    const flipped = [];
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) {
                continue;
            }

            // Start one square away from the target square
            for (let i = 0 + 1; i < maxDim; i++) {

                const targetx = x * i;
                const targety = y * i;
                if (
                    targetx === BOARD_WIDTH ||
                    targety === BOARD_HEIGHT ||
                    targetx === -1 ||
                    targety === -1) {
                    break;
                }

                const val = game.board[targetx][targety];


            }


        }
    }

};

const handleTurn = () => {
    const gamePlayer = game.players[game.player];
    const user = getUsername();

    // Names in the HOT list can get chopped off, so we only check
    // for a starting match.
    if (user.indexOf(gamePlayer) !== 0) {
        return;
    }

    $('body').on('click', `.${CELL_CLASS}`, function () {
        const cell = +this.dataset.cell;
        const color = [CELL_WHITE, CELL_BLACK][game.player];

        playTurn(cell, color);
        game.player += 1;
        game.player = game.player % game.players.length;
        postGame();
    });
};
//////////////////////////////////////////////////////////////////////
/// UTILS
//////////////////////////////////////////////////////////////////////
const getUsername = () => {
    const s = document.getElementsByName("vqxha")[0].value;
    return butcherName(s);
}

const butcherName = (s) => {
    return s.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "");
};

const squareToPosition = (square) => {
    const col = Math.floor(square % BOARD_WIDTH);
    const row = Math.floor(square / BOARD_WIDTH);

    return { row: row, col: col };
}

const posToSquare = (x, y) => {
    return x * BOARD_WIDTH + y;
};


//////////////////////////////////////////////////////////////////////
const loadGame = () => {
    const saveElements = Array.from(document.querySelectorAll(`.${POST_CLASS}`));
    const saveEncoded = saveElements.map(s => s.textContent);
    const saveDecoded = saveEncoded.map(s => atob(s));
    const saves = saveDecoded.map(s => JSON.parse(s));

    const times = saves.map(s => s.soiTime);
    const max = Math.max(...times);
    const latestSave = saves.filter(a => a.soiTime === max)[0];

    const board = game.board;
    const h = latestSave.history;

    game = latestSave;
    game.board = board;
    game.history = ""

    console.log("*** HISTORY ***");
    console.log(h, h.length);
    for (let i = 0; i < h.length; i += 2) {
        const square = BYTE_ENCODE.indexOf(h[i]);
        const player = h[i + 1];
        console.log(square, player);
        playTurn(square, player);
    }

    console.log("Found save: ");
    console.log(latestSave);
};

const postGame = () => {
    delete (game.board);

    game.soiTime = +document.querySelector("[name='vqxti']").value;

    const str = btoa(JSON.stringify(game));
    const chatbox = document.querySelector("[name='vqxsp']");
    chatbox.value = `<span class="${POST_CLASS}" style="display:none">${str}</span>Game Turn<br>${JSON.stringify(game, null, 2)}`;

    document.querySelector("[name='vqvaj']").click();
};

const issueChallenge = () => {
    const $list = $("select[name='vqvdy'] option");

    $("[data-id='challenge']").remove();

    $list.each((idx, el) => {
        const name = el.textContent;
        if (idx < 2) return;

        $("#gamepanel").append(`
         <button 
           data-id="challenge"
           data-name="${name}"
           type="button">
           Challenge ${name}</button> `);
    })

    $("[data-id='challenge']").click((el) => {
        const victim = $(el.currentTarget).attr("data-name");

        for (let i = 0; i < 64; i++) {
            setSquare(i, CELL_EMPTY);
        }

        game.history = "";

        playTurn(27, CELL_WHITE);
        playTurn(28, CELL_BLACK);
        playTurn(36, CELL_WHITE);
        playTurn(35, CELL_BLACK);

        game.players = [butcherName(victim), getUsername()];
        game.player = 0;
        postGame();
    });
};

const initGame = () => {
    const $table = $("[name='vqxto']").closest("table");
    const $form = $("[name='vqxto']").closest("form");
    $("<div id='gameboard'></div>").insertBefore($table);
    $form.append($(`
    <div id="gamepanel">
       <button type="button" id='start-game'>Start Game</button>
    </div>
    `));

    let html = "";
    const board = [];

    for (var h = 0; h < BOARD_HEIGHT; h++) {
        html += "<div>";
        const rowArray = [];

        for (var w = 0; w < BOARD_WIDTH; w++) {
            const cell = posToSquare(w, h);

            html += `<span data-cell=${cell} data-row=${h} data-col=${w} class='${CELL_CLASS}'><span></span></span>`;
            rowArray.push(CELL_EMPTY);
        }

        html += "</div>";
        board.push(rowArray);
    }

    document.querySelector("#start-game").addEventListener("click", issueChallenge);
    document.querySelector("#gameboard").innerHTML = html;

    return {
        board: board,
        players: [],
        player: 0,
        history: "",
    }
};

const setSquare = (square, value) => {
    console.log('setSquare', square, value);

    const pos = squareToPosition(square);

    let className = CELL_EMPTY_CLASS;
    if (value === CELL_WHITE) {
        className = CELL_WHITE_CLASS;
    } else if (value === CELL_BLACK) {
        className = CELL_BLACK_CLASS;
    }
    
    console.log(pos.row, pos.col,  value);

    game.board[pos.row][pos.col] = value;
    const cell = $(`span[data-cell="${square}"] span`);
    cell.removeClass([CELL_EMPTY_CLASS, CELL_WHITE_CLASS, CELL_BLACK_CLASS].join(" "));
    cell.addClass(className);
};

const playTurn = (square, value) => {
    const byte = BYTE_ENCODE[square];
    game.history += (byte + value);

    setSquare(square, value);
};

let game = initGame();
loadGame();
handleTurn();
