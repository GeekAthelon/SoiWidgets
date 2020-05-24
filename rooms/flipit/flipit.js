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

const calculateFlipped = (cellID, playerColor, enemyColor) => {
    const pos = cellIDToPosition(cellID);
    const maxDim = Math.max(BOARD_WIDTH, BOARD_HEIGHT);

    let flipped = [];
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) {
                continue;
            }

            let lineFlipped = [];
            // Start one square away from the target square
            for (let i = 0 + 1; i < maxDim; i++) {

                const targetx = pos.row + (x * i);
                const targety = pos.col + (y * i);
                if (
                    targetx === BOARD_WIDTH ||
                    targety === BOARD_HEIGHT ||
                    targetx === -1 ||
                    targety === -1) {
                    break;
                }

                const val = game.board[targetx][targety];
                let breakLoop = false;
                switch (val) {
                    case enemyColor:
                        // One of the enemies. Maybe we can keep it.
                        lineFlipped.push(positionToCellID(targetx, targety));
                        break;
                    case playerColor:
                        // Bookend by one of the player pieces. We DO
                        // get to keep them.
                        flipped = flipped.concat(lineFlipped);
                        breakLoop = true;
                        break;
                    case CELL_EMPTY:
                        breakLoop = true;
                        break;
                    default:
                        throw new Error("Unknown cell type");
                }

                if (breakLoop) {
                    break;
                }
            }
        }
    }
    return flipped;
};

const handleTurn = () => {
    const gamePlayer = game.players[game.player];
    const user = getUsername();

    const statusEl = document.querySelector("#game-status");


    // Names in the HOT list can get chopped off, so we only check
    // for a starting match.
    if (user.indexOf(gamePlayer) !== 0) {
        statusEl.innerHTML = `Waiting on: Player# ${game.player} ${gamePlayer}`;
        return;
    }

    statusEl.innerHTML = `
    <div> <b>It is your turn. Player ${game.player}</b></div>
    <button id="skip-turn" type="button">SKIP TURN</button>
    `;

    const advanceTurn = () => {
        game.player += 1;
        game.player = game.player % game.players.length;
        postGame();
    };

    $('body').on('click', `#skip-turn`, function () {
        advanceTurn();
    });

    $('body').on('click', `.${CELL_CLASS}`, function () {
        const cellID = +this.dataset.cell;
        const playerColor = [CELL_WHITE, CELL_BLACK][game.player];
        const enemyColor = [CELL_BLACK, CELL_WHITE][game.player];

        const pos = cellIDToPosition(cellID);
        if (game.board[pos.row][pos.col] !== CELL_EMPTY) {
            alert("That position has already been played");
            return;
        }


        const targets = calculateFlipped(cellID, playerColor, enemyColor);
        const isTurnGood = targets.length !== 0;

        if (isTurnGood) {
            playTurn(cellID, playerColor, enemyColor);
            advanceTurn();
        } else {
            alert("That position does not turn over any enemy pieces.");
        }
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

const cellIDToPosition = (cellID) => {
    const col = Math.floor(cellID % BOARD_WIDTH);
    const row = Math.floor(cellID / BOARD_WIDTH);

    return { row: row, col: col };
}

const positionToCellID = (x, y) => {
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

    // console.log("*** HISTORY ***");
    // console.log(h, h.length);
    for (let i = 0; i < h.length; i += 2) {
        const cellID = BYTE_ENCODE.indexOf(h[i]);
        const playerColor = h[i + 1];
        const enemyColor = playerColor == CELL_WHITE ? CELL_BLACK : CELL_WHITE;

        // console.log(cellID, playerColor, enemyColor);
        playTurn(cellID, playerColor, enemyColor);
    }

    // console.log("Found save: ");
    // console.log(latestSave);
};

const postGame = () => {
    // The board is huge -- no reason to inflate the save file with it.
    delete (game.board);

    game.soiTime = +document.querySelector("[name='vqxti']").value;

    const str = btoa(JSON.stringify(game));
    const chatbox = document.querySelector("[name='vqxsp']");
    chatbox.value = `<span class="${POST_CLASS}" style="display:none">${str}</span>Game Turn`;

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
            setByCellID(i, CELL_EMPTY);
        }

        game.history = "";

        playTurn(27, CELL_WHITE, CELL_BLACK);
        playTurn(28, CELL_BLACK, CELL_WHITE);
        playTurn(36, CELL_WHITE, CELL_BLACK);
        playTurn(35, CELL_BLACK, CELL_WHITE);

        game.players = [butcherName(victim), getUsername()];
        game.player = 0;
        postGame();
    });
};

const initGame = () => {
    const $table = $("[name='vqxto']").closest("table");
    const $form = $("[name='vqxto']").closest("form");
    $(`
    <section>
      <div id='gameboard'></div>
      <div id='game-status'></div>
    </section>
     `).insertBefore($table);
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
            const cellID = positionToCellID(w, h);

            html += `<span data-cell=${cellID} data-row=${h} data-col=${w} class='${CELL_CLASS}'><span></span></span>`;
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

const setByCellID = (cellID, value) => {
    console.log('setSquare', cellID, value);

    const pos = cellIDToPosition(cellID);

    let className = CELL_EMPTY_CLASS;
    if (value === CELL_WHITE) {
        className = CELL_WHITE_CLASS;
    } else if (value === CELL_BLACK) {
        className = CELL_BLACK_CLASS;
    }

    console.log(pos.row, pos.col, value);

    game.board[pos.row][pos.col] = value;
    const cellElement = $(`span[data-cell="${cellID}"] span`);
    cellElement.removeClass([CELL_EMPTY_CLASS, CELL_WHITE_CLASS, CELL_BLACK_CLASS].join(" "));
    cellElement.addClass(className);
};

const playTurn = (cellID, playerColor, enemyColor) => {
    const byte = BYTE_ENCODE[cellID];
    game.history += (byte + playerColor);

    const targets = calculateFlipped(cellID, playerColor, enemyColor);

    targets.forEach(cellID => setByCellID(cellID, playerColor));
    setByCellID(cellID, playerColor);
};

let game = initGame();
loadGame();
handleTurn();
