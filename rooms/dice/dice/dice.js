//"use strict";


var $$_GAMELORDS = ['athelon', 'msconduct', 'salacious', 'lordofthedice', 
'jace', 'diceprincess@bw', 'ladydice'];


var diceSets = {
  "old" : {
    "clear":  ["dice/old/d0.jpg", "dice/old/d1.jpg", "dice/old/d2.jpg", "dice/old/d3.jpg", "dice/old/d4.jpg", "dice/old/d5.jpg", "dice/old/d6.jpg"],
    "marked": ["dice/old/d0.jpg", "dice/old/d1x.jpg", "dice/old/d2x.jpg", "dice/old/d3x.jpg", "dice/old/d4x.jpg", "dice/old/d5x.jpg", "dice/old/d6x.jpg"] 
  },
  "big": {
    "clear":  ["dice/old/d0.jpg", "dice/big/1.gif", "dice/big/2.gif", "dice/big/3.gif", "dice/big/4.gif", "dice/big/5.gif", "dice/big/6.gif"],
    "marked": ["dice/old/d0.jpg", "dice/big/x1.jpg", "dice/big/x2.jpg", "dice/big/x3.gif", "dice/big/x4.gif", "dice/big/x5.gif", "dice/big/x6.gif"]
  },
  "small1": {
    "clear":  ["dice/old/d0.jpg", "dice/small/d1.jpg", "dice/small/d2.jpg", "dice/small/d3.jpg", "dice/small/d4.jpg", "dice/small/d5.jpg", "dice/small/d6.jpg"],
    "marked": ["dice/old/d0.jpg", "dice/small/d1o.jpg", "dice/small/d2o.jpg", "dice/small/d3o.jpg", "dice/small/d4o.jpg", "dice/small/d5o.jpg", "dice/small/d6o.jpg"]
  },
  "small2": {
    "clear":  ["dice/old/d0.jpg", "dice/small/d1.jpg", "dice/small/d2.jpg", "dice/small/d3.jpg", "dice/small/d4.jpg", "dice/small/d5.jpg", "dice/small/d6.jpg"],
    "marked": ["dice/old/d0.jpg", "dice/small/d1sc.jpg", "dice/small/d2sc.jpg", "dice/small/d3sc.jpg", "dice/small/d4sc.jpg", "dice/small/d5sc.jpg", "dice/small/d6sc.jpg"]
  },
  "small3": {
    "clear":  ["dice/old/d0.jpg", "dice/small/d1.jpg", "dice/small/d2.jpg", "dice/small/d3.jpg", "dice/small/d4.jpg", "dice/small/d5.jpg", "dice/small/d6.jpg"],
    "marked": ["dice/old/d0.jpg", "dice/small/d1x.jpg", "dice/small/d2x.jpg", "dice/small/d3x.jpg", "dice/small/d4x.jpg", "dice/small/d5x.jpg", "dice/small/d6x.jpg"]
  },
  "HTML - Try on iPod": {
    "text": [
      [
        "???",
        "???", 
        "???"
      ],
      
      [
        "   ",
        " o ",
        "   "
      ],
      [
        "o  ",
        "   ",
        "  o"
      ]
      ,
      [
        "o  ",
        " o ",
        "  o"
      ],
      [
        "o o",
        "   ", 
        "o o"
      ],
      [
        "o o",
        " o ",
        "o o"
      ],
      [
        "ooo", 
        "   ", 
        "ooo"
      ]
    ]
  }
}

var $$_INSPIRIT = false;


function romanize(num) {
  var date = new Date();
  if (date.getMonth() === 3 && date.getDate() === 1) {  
    return romanize2(num);
  } else {
    return num;
  }
}


function romanize2(num) {
  var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},
      roman = '',
      i;
  for ( i in lookup ) {
    while ( num >= lookup[i] ) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

/* Keep just the "significant" characters in a name.*/

function normalizeName(n) {
  n = n.toLowerCase();
  n = n.replace(/[^a-zA-Z0-9@]+/g, '');
  return n;i
}

/*
The Spirit List truncates names to 16 characters.  Unfortunately, that does
not mean 16 SIGNIFICANT characters.  This codes does a /best guess/ to see
who you are and who the spirit list things you are.  At some point, the spirit
list should be removed and I should parse the whole DOM like I do in ChatPlus
but that was too much work for this.
*/

function mungeNameToSpiritList(n) {
  var i, l;
  var spiritListNames = document.getElementsByName("vqvdy");
  var name;
  
  spiritListNames = spiritListNames[0].options;
  l = spiritListNames.length;
  for (i = 0 + 2; i < l; i++) { // Skip the first two entries, they are junk
    name = getOptionValue(spiritListNames[i]);
    name = normalizeName(name);
    
    if (n.indexOf(name) === 0) {
      $$_INSPIRIT = true;
      return name;
    }
  }
}


function disableInputs() {
  /* Disable any of the input buttons to prevent double posting and double
  * form submission.  Would be nice if this would persist against the 
  * backbutton use, but we can't have everything.
  */
  var el = document.getElementsByName("vqvaj")[0];
  if (el) {
    el.disabled = true;
    el.value = "Already played";
    el.title = "Did you use the back button?";
  }
  
  var gameBoard = document.getElementById("gameBoard");  
  var els = gameBoard.getElementsByTagName("button");
  for (var i = 0; i < els.length; i++) {
    els[i].disabled = true;
  }  
}


var diceGame = (
                
                function () 
                {
                  var spiritLength;
                  var gameData;
                  var dataClass = 'dice_data';
                  var isOurTurn = false;
                  var maxRolls = 3;
                  var gameIsReady;
                  var $$_DEFAULT_DATA;
                  
                  var $$_SUBMIT;
                  var $$_TIMESTAMP;
                  var $$_ROOMPATH = 'http://soiroom.hyperchat.com/dice/';
                  var $$_MSGFORM;
                  var $$_USERNAME;
                  var $$Y_ALREADY_SCORED = false;
                  var $$_PLAYERPREF;
                  
                  
                  var boardData = [{
                      name: "Players",
                      style: "player"
                  },
                  {
                    hint: "This slot is for the sum of all dice showing 1.",
                    name: "Aces",
                    id: "1",
                    f: calc1
                  },
                  {
                    hint: "This slot is for the sum of all dice showing 2.",
                    name: "Twos",
                    id: "2",
                    f: calc2
                  },
                  {
                    hint: "This slot is for the sum of all dice showing 3.",
                    name: "Threes",
                    id: "3",
                    f: calc3
                  },
                  {
                    hint: "This slot is for the sum of all dice showing 4.",
                    name: "Fours",
                    id: "4",
                    f: calc4
                  },
                  {
                    hint: "This slot is for the sum of all dice showing 5.",
                    name: "Fives",
                    id: "5",
                    f: calc5
                  },
                  {
                    hint: "This slot is for the sum of all dice showing 6.",
                    name: "Sixes",
                    id: "6",
                    f: calc6
                  },
                  {
                    hint: "The total of the top half of the board.",
                    name: "Subtotal",
                    id: "up_total"
                  },
                  {
                    hint: "If you score 63 or more points on the top half of the board, "
                    + "you receive a 35 point bonus.  Hint:  63 = Three of all kinds of dice "
                    + "but any combonation of dice may be used.",
                    name: "Upper Bonus",
                    id: "bonus"
                  },
                  {
                    name: "\u00A0",
                    style: "blank"
                  },
                  {
                    hint: "If you have three of any face of dice, the sum of ALL dice may be scored here." +
                    "Example: 1 3 1 6 1 would score 12 points.",
                    name: "3 of a Kind",
                    id: "3k",
                    f: calc3K
                  },
                  {
                    hint: "If you have three of any face of dice, the sum of ALL dice may be scored here." +
                    "Example: 1 1 1 6 1 would score 10 points.",
                    name: "4 of a Kind",
                    id: "4k",
                    f: calc4K
                  },
                  {
                    hint: "A small straight is any four numbers in sequence.  They don't actually have to be " +
                    "in order, but all of the numbers have to be there.  Both 1 2 3 4 1 and 4 2 3 6 1 are small straights.",
                    name: "Small Straight",
                    id: "ss",
                    f: calcSs
                  },
                  {
                    hint: "A large straight is any five numbers in sequence.  They don't actually have to be " +
                    "in order, but all of the numbers have to be there.  Both 1 2 3 4 5 and 4 2 3 6 5 are large straights.",
                    name: "Large Straight",
                    id: "ls",
                    f: calcLs
                  },
                  {
                    hint: "Any two of a kind and any three of a kind.  1 1 2 2 2 and 5 1 5 1 5 are both full houses.",
                    name: "Full House",
                    id: "fh",
                    f: calcFh
                  },
                  {
                    hint: "All dice showing the same face.  The first Yahtzee is worth 50 points, each additional Yahtzee " +
                    "is worth an additonal 100 extra points.  Additional Yahtzees can be scored almost anywhere on the card. "
                    +"You'll see when you get one.",
                    name: "Yahtzee",
                    id: "y",
                    f: calcYah
                  },
                  {
                    hint: "The value of the dice showing.  This is a 'catch all' catagory.",
                    name: "Chance",
                    id: "c",
                    f: calcChance
                  },
                  {
                    name: "\u00A0",
                    style: "blank"
                  },
                  {
                    name: "Yahtzee Bonus",
                    id: "yah_bonus"
                  },
                  {
                    name: "Lower Total",
                    id: "bot_total"
                  },
                  {
                    name: "Grand Total",
                    id: "g_total"
                  }];
                  
                  
                  /*
                  Count up the total dot value of all dice showing
                  the given face.  For instance, the total value
                  of all 6's.
                  */
                  
                  function addUpMatchingFaces(n) {
                    var i, t = 0,
                    l;
                    var f = gameData.dice.faces;
                    l = f.length;
                    for (i = 0; i < l; i++) {
                      if (f[i] === n) {
                        t += n;
                      }
                    }
                    return t;
                  }
                  
                  
                  function addUpAllFaces() {
                    var i, t = 0,
                    l;
                    var f = gameData.dice.faces;
                    l = f.length;
                    for (i = 0; i < l; i++) {
                      t += f[i];
                    }
                    return t;
                  }
                  
                  function calc1() {
                    return addUpMatchingFaces(1);
                  }
                  
                  function calc2() {
                    return addUpMatchingFaces(2);
                  }
                  
                  function calc3() {
                    return addUpMatchingFaces(3);
                  }
                  
                  function calc4() {
                    return addUpMatchingFaces(4);
                  }
                  
                  function calc5() {
                    return addUpMatchingFaces(5);
                  }
                  
                  function calc6() {
                    return addUpMatchingFaces(6);
                  }
                  
                  
                  /*
                  Helper function:
                  Look through the dice and see if we have 'k' of a kind,
                  if so return which face there are 'k' of.
                  
                  
                  @param How many dice we are looking for
                  
                  @return Which face there were 'k' of a kind for.
                  0 if not enough of a kind
                  */
                  
                  function findDiceOfAKind(k) {
                    var i, t = 0,
                    l;
                    var f = gameData.dice.faces;
                    var a = [];
                    var face;
                    l = f.length;
                    
                    // Six faces
                    for (i = 0; i < 8; i++) {
                      a[i] = 0;
                    }
                    
                    for (i = 0; i < l; i++) {
                      face = f[i];
                      a[face]++;
                      
                      if (a[face] === k) {
                        return face;
                      }
                    }
                    return 0;
                  }
                  
                  function calc3K() {
                    var face = findDiceOfAKind(3);
                    var n;
                    if (face) {
                      return addUpAllFaces();
                      
                    }
                    return 0;
                  }
                  
                  function calc4K() {
                    var face = findDiceOfAKind(4);
                    if (face) {
                      return addUpAllFaces();
                      
                    }
                    return 0;
                  }
                  
                  
                  /*
                  Helper function:
                  Count how many of each face of dice we have.
                  How many 1's, how many 2's, etc.   
                  
                  If the dice faces are 
                  [0, 1, 2, 2, 3, 4, 5] then
                  countDiceFaces(1) will return
                  [0, 1, 1, 1, 1, 1, 0]
                  and the duplicate '2' is collapsed into a single 2.
                  
                  @param A cap to stop counting at. 
                  
                  @return An array with how many times each face appears, max of cap.
                  */
                  
                  function countDiceFaces(cap) {
                    var f = gameData.dice.faces;
                    var a = [];
                    var face;
                    var l = f.length;
                    var i;
                    
                    for (i = 0; i < 8; i++) {
                      a[i] = 0;
                    }
                    
                    for (i = 0; i < l; i++) {
                      face = f[i];
                      if (face) {
                        a[face]++;
                        if (a[face] > cap) {
                          a[face] = cap;
                        }
                      }
                    }
                    return a.join(" ");
                  }
                  
                  
                  function calcSs() {
                    var fs = 30;
                    var s = countDiceFaces(1);
                    if (s.indexOf("1 1 1 1") !== -1) {
                      return fs;
                    }
                    
                    return $$Y_ALREADY_SCORED && calcYah() ? fs: 0;
                    
                  }
                  
                  function calcLs() {
                    var fs = 40;
                    var s = countDiceFaces(1);
                    if (s.indexOf("1 1 1 1 1") !== -1) {
                      return fs;
                    }
                    return $$Y_ALREADY_SCORED && calcYah() ? fs: 0;
                  }
                  
                  function calcFh() {
                    var fs = 25;
                    var s = countDiceFaces(3);
                    if ((s.indexOf("3") !== -1) && (s.indexOf("2") !== -1)) {
                      return fs;
                    }
                    return $$Y_ALREADY_SCORED && calcYah() ? fs: 0;
                  }
                  
                  function calcYah() {
                    var face = findDiceOfAKind(5);
                    if (face) {
                      return 50;
                    }
                    return 0;
                  }
                  
                  function calcChance() {
                    return addUpAllFaces();
                  }
                  
                  
                  
                  function htmlToGameData(el) {
                    var txt, data;
                    
                    txt = getText(el);
                    txt = txt.replace(/\|/g, "");
                    txt = txt.replace(/ /g, "");
                    data = JSON.parse(txt);
                    return data;
                  }
                  
                  function findCurrentGame() {
                    /*
                    Look through the SOI page and find the current game in progress.
                    */
                    
                    function processControlMessages() {
                      /* Look for any control messages that persist to the current
                      gameId. If so, process the control message and update
                      whatever data needs updated.
                      */
                      var i, l, txt, data;
                      
                      var gameId = gameData.gameId;
                      var dataClass='control_' + gameId;
                      
                      var command, target, tmp;
                      
                      var el = getElementsByClassName(dataClass);
                      if (!el) {return; }
                      l = el.length;
                      for (i = 0; i < l; i++) {
                        data = htmlToGameData(el[i]);
                        if (!data) {continue; }
                        
                        tmp = data.split(":");
                        command = tmp[0];
                        target = tmp[1];
                        
                        if (command == "DROPPLAYER") {
                          var idx = gameData.playerList.indexOf(target);
                          if (idx != -1) {
                            gameData["score" + idx].dropped = true;
                            gameData["score" + idx].g_total = "N/A";
                          }
                        }
                        
                        if (command == "ENDGAME") {
                          gameData.status = "finished";
                        }                                            
                      }
                    }
                    
                    var el = getElementsByClassName(dataClass);
                    if (!el) {return; }
                    
                    var i, l;
                    var txt;
                    var data;
                    
                    l = el.length;
                    for (i = 0; i < l; i++) {
                      data = htmlToGameData(el[i]);
                      if (!data) {continue; }
                      
                      gameData = data;
                      gameIsReady = gameData.status === "ready";
                      
                      if (gameIsReady) {
                        processControlMessages();
                        var playerData = gameData["score" + gameData.currentPlayer];
                        
                        
                        if (!playerData) {
                          soiFormControl.addMessage("There has been a major bug." +
                                                    " Player data not found in /findCurrentGame/." +
                                                    " Going into panic shutdown.  Sorry.");
                          gameData = $$_DEFAULT_DATA;
                          gameIsReady = false;
                          endGame();
                          //jjz
                          return;
                        }
                        
                        
                        while (playerData.dropped == true) {
                          soiFormControl.addDebugMessage("Skipping player:" + gameData.playerList[gameData.currentPlayer]);
                          nextPlayer();
                          if (!isGameInProgress()) { /* nextPlayer might have ended the game */
                            break;
                          }
                          playerData = gameData["score" + gameData.currentPlayer];                        
                        }
                        
                        if (playerData) {
                          $$Y_ALREADY_SCORED = (+playerData['y'] > 0)
                        }
                      }
                      
                      return true;
                    }                  
                  }                
                  
                  function isGameInProgress() {
                    return gameData && gameData.status && gameData.status == "ready";
                  }
                  
                  function setStatus(s) {
                    var el = document.getElementById('diceStatus');
                    el.innerHTML = "";
                    if (s.push) {
                      s = s.join("");
                    }
                    el.appendChild(document.createTextNode(s));
                  }
                  
                  function setPanel(s) {
                    var hostEl = document.getElementById("dicepanel");
                    if (s.push) {
                      s = s.join("");
                    }
                    hostEl.innerHTML = s;
                    
                    window.location.hash = '#dicehash';
                    
                  }
                  
                  var beginNewGame = function () {
                    var gameState = getGameAgeState();
                    var o = [];
                    
                    if (isGameInProgress()) {
                      if (gameState.isStale) {
                        alert("Game in progress is stale... you may continue.");
                      } else {
                        o = ["There is already a game in progress, that is",
                          gameState.gameAgeMin,
                          "minutes stale.  You can start a new game when it gets to be",
                          gameState.gameDeathAgeMin,
                        "minutes stale."];
                        
                        alert(o.join(" "));
                        return;
                      }
                    }
                    
                    window.location.hash = '#dicehash';
                    var spiritListNames = document.getElementsByName("vqvdy");
                    var i, l;
                    var s;
                    var name;
                    var names;
                    var html;
                    
                    if (!spiritListNames) {
                      setStatus = "Cannot find spirit list.. bailing";
                      return;
                    }
                    spiritListNames = spiritListNames[0].options;
                    l = spiritListNames.length;
                    if (l < 3) {
                      setStatus("Nobody in the room... ");
                    }
                    
                    spiritLength = l;
                    
                    s = "";
                    for (i = 0 + 2; i < l; i++) { // Skip the first two entries, they are junk
                      name = getOptionValue(spiritListNames[i]);
                      name = normalizeName(name);
                      s += "<input type='checkbox' name='player" + i + "' value='" + name + "'> " + name + "<br>";
                    }
                    
                    html = ["<p>Please choose the people you'd like to play dice with.</p>", ];
                    
                    html.push(s);
                    html.push("<br><button id='diceStartGame'>Start game with selected players</button>");
                    
                    setPanel(html);
                    document.getElementById('diceStartGame').onclick = prepData;
                  }
                  
                  var getEmptyData = function () {
                    var o = {
                      "player": null,
                      "1": null,
                      "2": null,
                      "3": null,
                      "4": null,
                      "5": null,
                      "6": null,
                      "up_total": null,
                      "bonus": null,
                      "3k": null,
                      "4k": null,
                      "ss": null,
                      "ls": null,
                      "fh": null,
                      "yah_token": null,
                      "y": null,
                      "c": null,
                      "yah_bonus": 0,
                      "bot_total": null,
                      "g_total": null
                    };
                    return o;
                  };
                  
                  function calcTotals() {
                    function gv(k) {
                      var v = scores[k];
                      if (v) {
                        return +v;
                      }
                      return 0;
                    }
                    
                    var scores = gameData["score" + gameData.currentPlayer];
                    scores.up_total =
                    gv('1') + gv('2') + gv('3') + gv('4') + gv('5') + gv('6');
                    
                    scores.bonus = scores.up_total >= 63 ? 35 : 0;
                    
                    scores.bot_total =
                    gv("3k") + gv("4k") + gv("ss") + gv("ls") + gv("fh") + gv("yah_token") + gv("y") + gv("c");
                    
                    scores.g_total = scores.up_total + scores.bonus + scores.bot_total + scores.yah_bonus;
                  }
                  
                  function getEmptyDice() {
                    return {
                      "faces": [0, 0, 0, 0, 0],
                      "reroll": [true, true, true, true, true]
                    };
                  }
                  
                  function getSoiTimeStamp() {
                    /* Read the SOI timedate stamp.  To turn this into a POSIX
                    time stamp, just multiply by 100 (to add seconds)
                    */
                    var r;
                    var stamp = document.getElementsByName("vqxti");
                    if (stamp) {
                      r = +stamp[0].value;
                      return r;
                    }
                  }
                  
                  function endGame() {
                    gameData.status = "finished";
                    gameData.currentPlayer = null;                     
                    soiFormControl.addMessage("Has ended the game");
                    soiFormControl.endGame();                  
                    soiFormControl.postAndReload();
                  }
                  
                  function getGameAgeState() {
                    /* If no game data, then we don't need the game age since the
                    game won't be in progress.
                    */
                    if (!gameData) { return; }
                    
                    
                    var gameAge;
                    var gameAgeMin;
                    var gameDeathAgeMin = 5;
                    gameAge = (getSoiTimeStamp() - gameData.lastPost) / 60;
                    gameAgeMin = Math.round(gameAge, 2);                  
                    
                    var o = {
                      gameAgeMin: gameAgeMin,
                      gameDeathAgeMin: gameDeathAgeMin,
                      isStale: gameAgeMin >= gameDeathAgeMin,
                      gameAge: gameAgeMin
                    }; 
                    
                    return o; 
                  }
                  
                  
                  
                  
                  
                  var prepData = function () {
                    var msg;
                    
                    setStatus("Starting Game");
                    var data = serializeFormUrlencoded(document.getElementById('diceform'));
                    var name;
                    
                    gameData = $$_DEFAULT_DATA;
                    
                    var idx = 0;
                    
                    var i;
                    for (i = 0; i < spiritLength; i++) {
                      name = data["player" + i];
                      if (name) {
                        gameData.playerList.push(name);
                        gameData["score" + idx] = getEmptyData();
                        idx++;
                      }
                    }
                    
                    gameData.owner = $$_USERNAME;
                    gameData.status = "ready";
                    gameData.round = 0;
                    
                    if (gameData.playerList.indexOf($$_USERNAME) === -1) {
                      window.alert("You must be in the game you start!");
                      return;
                    }
                    
                    nextPlayer();
                    
                    msg = $$_USERNAME + " has started a new game with the following players:<br>" + gameData.playerList.join(", ");
                    soiFormControl.addMessage(msg);
                    soiFormControl.startGame();
                    soiFormControl.postAndReload();
                  }
                  
                  function nextPlayer() {
                    function makeScoreList() {
                      var p = 0;
                      var out = "";
                      var playerName;
                      var playerData;
					  var roman;
 		            
                     
                      out += "Final scores:<br>";
                      while ((playerName = gameData.playerList[p])) {
                        playerData = gameData["score" + p];                    
						roman = romanize(playerData['g_total']);
                        out += "<br>" + playerName + " : " + roman;
                        p++;
                      }
                      return out;
                    }
                    
                    
                    var i, l;
                    var p = gameData.currentPlayer;
                    p++; // Move to the next player yet.
                    if (!gameData.playerList[p]) {
                      p = 0;
                      gameData.round++;
                    }
                    
                    if (gameData.round == 13) {
                      gameData.status = "finished";
                      gameData.currentPlayer = null;                     
                      
                      soiFormControl.addMessage("Game over!");
                      soiFormControl.addMessage(makeScoreList());
                      soiFormControl.endGame();
                      soiFormControl.postAndReload();
                    }
                    
                    var name;
                    gameData.currentPlayer = p;
                    gameData.rollNumber = 0;
                    gameData.dice = getEmptyDice();
                    
                    //setStatus(JSON.stringify(gameData));
                  }
                  
                  
                  function loadCookieData() {
                    /* See if the player has any data saved for this turn that
                    might indicate they have rolled on this turn already.
                    This -could- mean the player navigated away from the page
                    and returned in and attempt to cheat, or it could mean the
                    player had a genuine computer problem.
                    */
                    var playerData = gameData["score" + gameData.currentPlayer];
                    var saveData2 = getCookie(cookieName());
                    try {
                      var saveData = JSON.parse(saveData2);
                    } catch(e) {
                      saveData = null;
                    }
                    
                    if (!saveData) {
                      soiFormControl.addMessage("Cookies not enabled or they were corrupted (or the first turn of the game).");
                      soiFormControl.addDebugMessage("This message is not unusual for the very first turn of the game. " +
                                                     "if they haven't played in a while the cookie may have expired. " + 
                                                     "Getting this message mid game is more unusual.");
                    } else if ((gameData.gameId == saveData.gameId) && (gameData.round == saveData.round)) {
                      gameData.dice = saveData.dice;
                      gameData.rollNumber = saveData.rollNumber;
                      soiFormControl.addMessage("Reloading dice from saved data.");    
                      soiFormControl.addMessage("Found data from roll: " + saveData.rollNumber);
                      soiFormControl.addMessage(JSON.stringify(gameData.dice.faces));
                      soiFormControl.addDebugMessage("This message means the player reloaded the page during their turn. " +
                                                     "They could have either navigated away from the page and come back or " +
                                                     "their browser may have crashed and needed reopened.  Either way the " +
                                                     "cookies did exactly what they should have done.");
                      //soiFormControl.addMessage("Cookie Data: " + JSON.stringify(saveData, null, 2));
                      soiFormControl.startGame();
                      soiFormControl.postAndReload();
                      return true;
                    } else {
                      soiFormControl.addDebugMessage("Found old cookie.  (Everything is working properly.  The cookie was found from an old turn and is ignored.)");
                    }
                  }
                  
                  var soiFormControl = (function() {
                                        
                                        var msg = [];
                                        
                                        // Work around an IE bug that doesn't
                                        // execute the post right away, but rather
                                        // allows other code to keep executing.
                                        var lastmsg = false;
                                        var hasControlMessage = false;
                                        var forceGameDump = false;
                                        
                                        function addMessage(s) {
                                          if (!lastmsg) {
                                            s = '<p style="clear:both; margin:0px">' + s + '</p>';
                                            msg.push(s);
                                          }
                                        }
                                        
                                        function addDebugMessage(s) {                                        
                                          if (!lastmsg) {
                                            //msg.push("<span class='debugmsg'>" + s + "</span>");
                                          }
                                        }
                                        
                                        
                                        
                                        function addControlMessage(s) {
                                          var gameId = gameData.gameId;
                                          hasControlMessage = true;
                                          s = JSON.stringify(s).split("").join(" ");
                                          
                                          var s1 = "<span style='display:none' class='control_" + gameId + "'>" + s + "</span>";
                                          msg.push(s1);
                                        }
                                        
                                        function postAndReload() {
                                          lastmsg = true;
                                          var s;
                                          
                                          
                                          gameData.loadedFromPost = gameData.lastPost;                                         
                                          gameData.lastPost = getSoiTimeStamp();
                                          
                                          var s1 = JSON.stringify(gameData).split("").join(" ");
                                          s = "";
                                          
                                          //s += "checkIsOurTurn() = " + checkIsOurTurn();                  
                                          //s += "DEBUG: This post ID...: " + gameData.lastPost + "<br>"; 
                                          s +=  msg.join(" ");
                                          if ( (hasControlMessage && forceGameDump) || checkIsOurTurn() )  {
                                            s += "<span style='display:none' class='" + dataClass + "'>" + s1 + "</span>";
                                          }
                                          //s += "DEBUG: Loaded from post " + gameData.loadedFromPost + "<br>";
                                          
                                          $$_MSGFORM.vqxsp.value = s;
                                          disableInputs();
                                          $$_MSGFORM.submit();
                                        }
                                        
                                        function endGame() {
                                          forceGameDump = true;
                                          addControlMessage("ENDGAME: true");
                                        }
                                       
                                        
                                        function startGame() {
                                          forceGameDump = true;
                                          addControlMessage("STARTGAME: true");
                                        }
                                        
                                        
                                        
                                        function dropPlayer(user) {
                                          forceGameDump = false;
                                          addControlMessage("DROPPLAYER:" + user);
                                        }
                                        
                                        return {
                                          startGame: startGame,
                                          endGame: endGame,
                                          dropPlayer: dropPlayer,
                                          addControlMessage: addControlMessage,
                                          addMessage: addMessage,
                                          addDebugMessage: addDebugMessage,
                                          postAndReload: postAndReload
                                        };
                                        
                                        
                  }());
                  
                  
                  function getDiceHtml(face, reroll, setName) {
                    var s;
                    var diceSet;
                    var ff;

                    if (setName) {
                      diceSet = diceSets[setName];
                    } else {
                      diceSet = diceSets[$$_PLAYERPREF.setName];
                    }

                    if (!diceSet) {diceSet = diceSets.old;}
                    var faceGroup = reroll ? diceSet.marked: diceSet.clear;
                    var backgroundColor = reroll ? "gray": "black";
                    
                    if (faceGroup) { // Graphical dice
                      s = "<img src='" + $$_ROOMPATH + faceGroup[face] + "' alt='" + face + "'>";
                      return s;
                    }
                   
                    var color = [
                      "black",
                      "#faebd7",
                      "#eecbad",
                      "#add8e6",
                      "#98fb98",
                      "#eedd82",
                      "#ffb6c1"
                    ]
                    [face];
                    
                    ff = function(s) {
                      return s.replace(/o/g, "&#x25cf;");                        
}


                    s = '<pre style="background-color: ' + backgroundColor + '; ' +
                    'color: ' + color + "; " + 
                    'line-height:.5; border:3px solid silver; padding:.25em">';
                    s += ff(diceSet.text[face][0]);
                    s += "<br>";
                    s += ff(diceSet.text[face][1]);
                    s += "<br>";
                    s += ff(diceSet.text[face][2]);
                    s += "</pre>";
                    
                    return s;
                    
                  }
                                                    
                  function showPlayerScreen() {
                    var html;
                    var i, s, l, dice, die;
                    var face, reroll;
                    var fname;
                    var canRoll;
                    
                    function makeGraphicButton(fname, id, alt, extra) {
                      var s = [];
                      var disabled = "disabled";
                      var diceBar;
                      if (canRoll) {
                        disabled = "";
                      }
                      s.push("<button " + disabled + " class='die' id='" + id + "'>");
                      if (fname.substring(0,1) == "<") {
                        s.push(fname);
                      } else {
                        s.push("<img src='" + $$_ROOMPATH + fname + "' alt='" + alt + "'>");
                      }
                      s.push("<br>");
                      s.push(extra)
                      s.push("</button>");
                      return s.join("\n");
                    }
                    
                    isOurTurn = checkIsOurTurn();
                    
                    if (isOurTurn) {
                      attachToTalkListen();
                    }
                    
                    html = [];
                    
                    var gameState = getGameAgeState();
                    
                    if (gameIsReady) {
                      html.push("<p>");
                      html.push("Game in Progress.");
                      if (gameState.isStale) {
                        html.push(" ");
                        html.push("If this game has been abandoned, feel free to start a new one.");
                      }
                      html.push("</p>");
                    } else {
                      html.push("<p>No Game in Progress. Why not start one?</p>");
                    }
                    
                    if (!$$_INSPIRIT) {
                      html.push("<p>You are not in the spirit list.  Post to make things work.</p>");
                    }
                    
                    //html.push("You are: " + $$_USERNAME + "<br>");
                    
                    if (gameIsReady) {
                      html.push("It is " + gameData.playerList[gameData.currentPlayer] + "'s turn to play.");
                    }
                    //html.push("<br>");
                    
                    document.getElementById("status_panel").innerHTML = html.join("\n");
                    
                    
                    html = [];
                    
                    if (gameData.rollNumber !== maxRolls) {
                      html.push("Roll # " + gameData.rollNumber + " of " + maxRolls);
                    } else {
                      html.push("-No More Rolls-");
                    }
                    html.push("<br>");
                    
                    canRoll = isOurTurn && (gameData.rollNumber !== maxRolls) && gameIsReady;
                    
                    if (canRoll) {
                      html.push("Please choose which dice to roll:");
                    } else {
                      html.push(" ");
                    }
                    html.push("<br>");
                    
                    html.push("<div id='dicebox'>");
                    
                    dice = gameData.dice;
                    
                    l = dice.faces.length;
                    for (i = 0; i < l; i++) {
                      face = dice.faces[i];
                      reroll = dice.reroll[i];
                      
                      if (!canRoll) {
                        reroll = false;
                      }
                      diceBar = reroll ? "XX" : "--";
                      fname= getDiceHtml(dice.faces[i], reroll, null);
                      
                      html.push(makeGraphicButton(fname, "die_" + i, face, "[" + diceBar + face + diceBar + "]"));
                    }
                    if (isOurTurn) {
                      html.push(makeGraphicButton('roll.gif', 'rollButton', "Roll", "Roll marked dice"));
                      
                      if (isPlayerGameLord()) {
                        html.push(makeGraphicButton('roll.gif', 'cheatButton', "Roll", "Cheat!"));
                      }
                      
                    }
                    html.push("</div> <!-- dicebox -->");
                    html.push("<div style='clear:both'");
                    
                    //setStatus(html);
                    setPanel(html);
                    
                    
                    if (isPlayerGameLord() && document.getElementById("cheatButton")) {
                      document.getElementById("cheatButton").className += " gamelord";
                    }
                    
                    if (isOurTurn) {
                      document.getElementById('dicebox').onclick = handleDiceClick;      
                      window.location.hash = '#dicehash';
                    }
                  };
                  
                  function isPlayerGameLord() {
                    return ($$_GAMELORDS.indexOf($$_USERNAME) !== -1);
                  }
                  
                  
                  function handleDiceClick(e) {
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    var idx;
                    
                    while (target && target.tagName.toLowerCase() !== 'button') {
                      target = target.parentNode;
                    }
                    
                    
                    // Catch disabled buttons.  There seems to be an issue in some
                    // versions of IE that recogonize a click on a disabled button.
                    // May as well catch it for everybody, it can't do any harm.                  
                    if (target.disabled) {return;}
                    
                    idx = target.id.split("_")[1];
                    if (idx) {
                      gameData.dice.reroll[idx] = !gameData.dice.reroll[idx];
                      showPlayerScreen();
                    }
                    
                    if (target.id === 'rollButton') {
                      handleRoll();
                    }
                    
                    if (target.id === 'cheatButton') {
                      handleCheat();
                    }
                    
                    
                  }
                  
                  
                  function handleCheat() {
                    soiFormControl.addMessage("<span class='cheatnote'>Has decided to cheat  Must be testing something...</span>");
                    var i, l;
                    var dice = gameData.dice;
                    var a = []; //Track which dice are being re-rolled
                    l = dice.faces.length;
                    var diceHtml = "";
                    
                    var data = window.prompt("New roll?", "66666");
                    if (!data) {return; }
                    data = data.replace(/ /g, "");
                    var data2 = data.split("");
                    
                    for (i = 0; i < l; i++) {
                      a.push(i + 1);
                      dice.faces[i] = +data2[i];
                      diceHtml += getDiceHtml(dice.faces[i], false, null) + "&nbsp;&nbsp";

                    }
                    
                    diceHtml += '<p style="clear:both"></p>';
                    soiFormControl.addMessage("Rerolled dice in positions: " + a.join(","));
                    soiFormControl.addMessage(diceHtml);
                    soiFormControl.postAndReload();                  
                  }
                  
                  function handleRoll(firstRoll) {
                    if (gameData.rollNumber >= maxRolls) {
                      alert("No rolls left");
                      return;
                    }
                    
                    var saveData;
                    
                    //alert(printStackTrace());
                    
                    soiFormControl.addMessage("<i>Rolled dice</i>: Roll #" + (gameData.rollNumber+1));
                    var i, l;
                    var dice = gameData.dice;
                    var a = []; //Track which dice are being re-rolled
                    l = dice.faces.length;
                    var diceHtml = "<pre>";
                    
                    for (i = 0; i < l; i++) {
                      if (dice.reroll[i] || firstRoll) {
                        a.push(i + 1);
                        dice.faces[i] = rollD6();
                        if (firstRoll) {dice.reroll[i] = false;}
                      }
                      diceHtml += '<pre style="float:left; margin-left: 0.5em; margin-right: 0.5em;">';
                      diceHtml += getDiceHtml(dice.faces[i], false, null)
                      diceHtml += '</pre>';
                    }
                    diceHtml += '</pre>';
                    gameData.rollNumber++;
                    
                    /* Ok, the player has rolled.  Lets take just the most important
                    information and store it away in a cookie to be checked later on a
                    page reload.
                    */
                    var saveData = {
                      rollNumber: gameData.rollNumber, 
                      round: gameData.round,
                      gameId:gameData.gameId,
                      dice: dice
                    };
                    
                    setCookie(cookieName(), JSON.stringify(saveData));
                    
                    
                    soiFormControl.addMessage("Rolled dice in positions: " + a.join(","));
                    soiFormControl.addMessage(diceHtml);
                    showPlayerScreen();
                    showBoard();
                  }
                  
                  function showBoard(hostElement) {
                    var i, j, li, lj;
                    var playerName;
                    var playerData;
                    var line;
                    var style;
                    var exitLoop;
                    var val;
                    var but;
                    
                    var table = document.createElement("table");
                    var tbody = document.createElement("tbody");
                    var tr, td;
                    var id;
                    table.className = "dice_tbl";
                    
                    function mTd(val) {
					  var roman = val;
					  if (+val.toString() === val) {
					    roman = romanize(val);
					  }
					  
                      var td = document.createElement("td");
                      if (val != "-") {
                        td.appendChild(document.createTextNode(roman));
                      } else {
                        td.appendChild(document.createElement("hr"));
                      }
                      td.style.textAlign = "right";
                      return td;
                    }
                    
                    table.appendChild(tbody);
                                        
                    li = boardData.length;
                    lj = gameData.playerList.length;
                    isOurTurn = checkIsOurTurn();
                    
                    for (i = 0; i < li; i++) {
                      line = boardData[i];
                      tr = document.createElement("tr");
                      
                      id = line.id;
                      style = line.style;
                      exitLoop = false;
                      
                      val = line.name;
                      if (style && style === "blank") {
                        val = "-";
                      }
                      td = mTd(val);
                      tr.appendChild(td);
                      
                      
                      if (line.hint) {
                        var hintGizmo = document.createElement("span");
                        hintGizmo.appendChild(document.createTextNode("?"));
                        td.appendChild(hintGizmo);
                        
                        hintGizmo.className = "hint";
                        tr.title = line.hint;
                        
                        hintGizmo.onclick = (function(_hint) {
                                             return function() {
                                             //window.alert(_hint);                                 
                                             }
                        }(line.hint));
                      }
                      
                      for (j = 0; j < lj; j++) {
                        if (exitLoop) {
                          break;
                        }
                        
                        td = undefined;
                        playerName = gameData.playerList[j];
                        playerData = gameData["score" + j];
                        
                        if (style && style === "player") {
                          td = mTd(gameData.playerList[j]);
                        }
                        
                        if (!id && !td) {
                          td = mTd("-");
                        }
                        
                        if (isOurTurn && !td && playerName === $$_USERNAME) {
                          val = playerData[id];
                          if (val !== null) {
                            td = mTd(val);
                          } else if (typeof line.f === "function") {
                            td = makeScoreButton(line, id)
                          } else {
                            td = mTd("0");
                          }
                        }
                        
                        if (!td) {
                          val = playerData[id];
                          if (val === null) {
                            val = "\u00A0";
                          }
                          td = mTd(val);
                        }
                        tr.appendChild(td);
                        
                      }
                      tbody.appendChild(tr);
                    }
                    var gb;
                    gb = hostElement || document.getElementById('gameBoard');
                    purgeChildren(gb);
                    gb.appendChild(table);
                  }
                  
                  function attachToTalkListen() {
                    if (!checkIsOurTurn()) {return;}
                    
                    var submit = document.getElementsByName("vqvaj")[0];
                    var textArea = document.getElementsByName("vqxsp")[0];
                    
                    submit.onclick = function() {
                      if (isGameInProgress()) {
                        var msg = textArea.value;
                        soiFormControl.addMessage(msg);
                        soiFormControl.postAndReload();
                        
                        return false;
                      }                    
                    }
                  }
                  
                  function handleScoreButtonClick(e) {
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    var s, msg;
                    var data = target.id.split("_");
                    var playerData = gameData["score" + gameData.currentPlayer];
                    var isYah = !!calcYah();
                    
                    
                    var i, l;
                    l = boardData.length;
                    for (i = 0; i < l; i++) {
                      
                      if (boardData[i].id === data[1]) {
                        s = boardData[i].name;
                        break;
                      }
                    }
                    
                    msg = "Score: " + data[2] + " points on " + s;
                    
                    soiFormControl.addMessage(msg);
                    
                    if (isYah && $$Y_ALREADY_SCORED) {
                      playerData['yah_bonus'] += 100;
                      soiFormControl.addMessage("Yahtzee Bonus!");
                    }
                    
                    playerData[data[1]] = +data[2];
                    
                    calcTotals();
                    nextPlayer();
                    
                    soiFormControl.startGame();
                    soiFormControl.postAndReload();                                    
                  }
                  
                  function makeScoreButton(line, id) {
				    var roman;
					
                    var val = line.f();
		            roman = romanize(val);

                    var but = document.createElement("button");
                    var td = document.createElement("td");
                    but.id = ['score', id, val].join("_");
                    but.appendChild(document.createTextNode("" + roman + ""));
                    td.appendChild(but);
                    but.className = "scoreButton";
                    but.title = val;
                    but.onclick = handleScoreButtonClick;
                    return td;
                  }
                  
                  
                  function isUserPlaying(user) {
                    if (!user) {user = $$_USERNAME;}
                    return gameData && gameData.playerList && gameData.playerList.indexOf(user) != -1;
                  }
                  
                  function checkIsOurTurn() {
                    return gameData && 
                    gameData.playerList && 
                    gameData.playerList[gameData.currentPlayer] == $$_USERNAME;
                  }
                  
                  function rollD6() {
                    return Math.floor(Math.random() * 6) + 1;
                  }
                  
                  
                  function renderReveal() {
                    var els = getElementsByClassName(dataClass);
                    if (!els) {return;}
                    var idx = 0;
                    var el;
                    
                    
                    function renderOne() {
                      var el = els[idx];
                      if (!el) {return; } // No more here.
                      
                      var b = document.createElement("button");
                      b.appendChild(document.createTextNode("See the scorecard from this turn."));
                      
                      
                      b.onclick = (function(_el, _b) {
                                   return function() {
                                   var div = document.createElement("div");
                                   _el.parentNode.appendChild(div);                                 
                                   
                                   var data = htmlToGameData(_el);
                                   var saveGameData = gameData;
                                   gameData = data;
                                   gameData.currentPlayer = null; 
                                   showBoard(div);
                                   
                                   gameData = saveGameData;
                                   _b.disabled = true;
                                   
                                   }
                      }(el, b));
                      
                      el.parentNode.appendChild(b);
                      
                      
                      if (isPlayerGameLord()) {
                        b = document.createElement("button");
                        b.appendChild(document.createTextNode("Show data"));
                        b.className = "gamelord";
                        
                        b.onclick = (function(_el, _b) {
                                     return function() {
                                     var div = document.createElement("pre");
                                     _el.parentNode.appendChild(div);                                 
                                     
                                     var data = htmlToGameData(_el);
                                     div.innerHTML = JSON.stringify(data, undefined, 2);
                                     
                                     _b.disabled = true;
                                     
                                     }
                        }(el, b));
                        
                        el.parentNode.appendChild(b);
                      }
                      
                      
                      
                      if (idx != els.length-1) {
                        idx++;
                        window.setTimeout(renderOne);
                      }
                    }
                    renderOne();
                    
                    
                  }
                  
                  function setText() {
                    function makeSpirit2List() {
                      var div = document.createElement("div");
                      
                      div.appendChild(document.createTextNode("Spirit List"));
                      div.appendChild(document.createElement("br"));
                      
                      var spiritListNames = document.getElementsByName("vqvdy");
                      spiritListNames = spiritListNames[0].options
                      var i, l = spiritListNames.length;
                      var name;
                      
                      
                      s = "";
                      for (i = 0 + 2; i < l; i++) { // Skip the first two entries, they are junk
                        name = getOptionValue(spiritListNames[i]);
                        div.appendChild(document.createTextNode(name));
                        div.appendChild(document.createElement("br"));
                      }
                      
                      div.style.cssFloat="left";
                      
                      var gb = document.getElementById("gameBoard"); 
                      gb.parentNode.insertBefore(div, gb);
                    }
                    
                    
                    function makeButton(text, onclick) {
                      var span = document.createElement("button");
                      //span.className = "but";
                      span.appendChild(document.createTextNode(text));
                      span.onclick = function () { onclick(); return false;}
                      return span;
                    }
                    
                    
                    function dropSelf() {
                      if (window.confirm("Do you really want to leave the game?")) {
                        soiFormControl.addMessage("Has left the game.");                                        
                        soiFormControl.dropPlayer($$_USERNAME);
                        soiFormControl.postAndReload();                  
                      }
                    }
                    
                    function playerControls() {
                      var hostEl = document.getElementById("dicepanel");                    
                      hostEl.innerHTML = "PLAYER CONTROLS";
                      var but;
                      var img;
                      var span;
                      var fs = document.createElement("div");
                      fs.className = "info";
                      
                      var setName;
                      var set;
                      for (setName in diceSets) {
                        set = diceSets[setName];
                        but = document.createElement("button");
                        but.appendChild(document.createTextNode(setName));
                        
                        span = document.createElement("span");
                        span.innerHTML = getDiceHtml(1, false, setName)
                        but.appendChild(span);
                        
                        span = document.createElement("span");
                        span.innerHTML = getDiceHtml(1, true, setName)
                        but.appendChild(span);
                                                                        
                        but.onclick = (function(_setName) {
                                       return function() {
                                       $$_PLAYERPREF.setName = _setName;
                                       setCookie(cookieName() + "_pref", JSON.stringify($$_PLAYERPREF));
                                       purgeChildren(hostEl);
                                       showPlayerScreen();
                                       }
                        }(setName));
                        
                        
                        
                        fs.appendChild(but);
                        fs.appendChild(document.createElement("br"));
                      }
                      
                      hostEl.appendChild(fs);
                      window.location.hash = '#dicehash';
                    }
                    
                    
                    function makeButtons() {
                      function makeGameControls() {
                        var i, name;
                        var div = document.createElement("div");
                        div.appendChild(document.createTextNode("Warning: Booting someone during their turn can cause breakage."));                                        
                        
                        for (i = 0; i < gameData.playerList.length; i++) {
                          var b = document.createElement("button");
                          b.appendChild(document.createTextNode("Boot: " + gameData.playerList[i]));
                          
                          
                          b.onclick = (function(_n) {
                                       return function() {
                                       soiFormControl.addMessage("Has booted " + _n + " from the game.");
                                       soiFormControl.dropPlayer(_n);
                                       soiFormControl.postAndReload();                                                     
                                       }
                          }(gameData.playerList[i]));
                          div.appendChild(document.createElement("br"));
                          div.appendChild(b);                      
                        }
                        
                        div.appendChild(document.createElement("br"));
                        
                        if (isGameInProgress() ) {
                          div.appendChild(document.createTextNode(bar));
                          div.appendChild(makeButton("End Game", endGame));
                        }                    
                        
                        $$_MSGFORM.parentNode.appendChild(div);
                      }
                      
                      
                      var bar = " ";
                      var div = document.createElement("div");
                      var but;
                      var isOwner = gameData && gameData.owner && gameData.owner === $$_USERNAME; 
                      
                      div.appendChild(makeButton("Start Game", beginNewGame));
                      
                      div.appendChild(makeButton("Player Controls", playerControls));
                      
                      
                      //if (isOwner && isGameInProgress() ) {
                      //  div.appendChild(document.createTextNode(bar));
                      //  div.appendChild(makeButton("End Game", endGame));
                      //}                    
                      
                      if (isUserPlaying() &&  isGameInProgress() ) {
                        div.appendChild(document.createTextNode(bar));
                        div.appendChild(makeButton("Leave Game", dropSelf));
                      }
                      
                      if ((isOwner || isPlayerGameLord()) && isGameInProgress() ) {
                        if (isOwner) {
                          but = makeButton("Game Controls - Game Owner", makeGameControls)
                        } else {
                          but = makeButton("Game Controls - Game Lord", makeGameControls)
                          but.className = "gameLord";
                        }
                        div.appendChild(document.createTextNode(bar));
                        div.appendChild(but);
                      }
                      
                      $$_MSGFORM.parentNode.appendChild(div);
                    }
                    
                    
                    div = document.createElement("div");
                    div.id = "status_panel";
                    $$_MSGFORM.parentNode.appendChild(div);                  
                    
                    makeButtons();
                    var div;                  
                    var s = "If you post in the room and its ignored, don't take it personally. " +
                    "As fast as this room can move, it is -very- easy to miss posts...";
                    
                    div = document.createElement("div");
                    div.appendChild(document.createTextNode(s));
                    div.className = "transbox";
                    
                    $$_MSGFORM.parentNode.appendChild(div);                  
                    
                    showPlayerScreen();                  
                    makeSpirit2List();
                  }
                  
                  function cookieName() {
                    var s = "yahcookie"
                    s += $$_USERNAME.replace(/[^a-zA-Z0-9]+/g, '');
                    s = s.toLowerCase();
                    return s;
                  }
                  
                  function getCookie(NameOfCookie)
                  { if (document.cookie.length > 0) 
                    { begin = document.cookie.indexOf(NameOfCookie+"="); 
                      if (begin != -1) 
                      { begin += NameOfCookie.length+1; 
                        end = document.cookie.indexOf(";", begin);
                        if (end == -1) end = document.cookie.length;
                      return unescape(document.cookie.substring(begin, end)); } 
                    }
                    
                    
                    if (window.name && NameOfCookie == cookieName()) {
                      soiFormControl.addDebugMessage("Cookies not enabled -- attempting to use fallback.");
                      return window.name;
                    } else {
                      return null;
                    }
                    
                  }
                  
                  function setCookie(NameOfCookie, value, expiredays) 
                  { var ExpireDate = new Date ();
                    if (expiredays) {expiredays = 300;}
                    ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000));
                    
                    
                    document.cookie = NameOfCookie + "=" + escape(value) + 
                    ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString());
                    
                    // Emergency fallback.
                    if (NameOfCookie == cookieName()) {
                      window.name = value;
                    }
                  }
                  
                  function delCookie(NameOfCookie) 
                  { if (getCookie(NameOfCookie)) {
                    document.cookie = NameOfCookie + "=" +
                    "; expires=Thu, 01-Jan-70 00:00:01 GMT";
                    }
                    
                  }
                  
                  function setWhisperStatus() {
                    var els = document.getElementsByTagName("a");
                    var el, i, l = els.length;
                    var txt;
                    
                    function badUser() {
                      window.alert("You can't whisper if you aren't chatting.");
                      return false;
                    }

                    for (i = 0; i < l; i++) {                      
                      el = els[i];
                      txt = getText(el);
                      if (txt != "~") {continue;}
                      
                      el.style.display = "inline";
                      
                      if (!$$_INSPIRIT) {
                        el.onclick = badUser;
                      }
                    }
                  }
                  
                  
                  function init() {
                    $$_SUBMIT = document.getElementsByName("vqvaj")[0];
                    if ($$_SUBMIT && $$_SUBMIT.disabled) {
                      disableInputs();
                    }
                    
                    $$_TIMESTAMP = document.getElementsByName("vqxti")[0].value;
                    
                    $$_DEFAULT_DATA = {
                      "gameId": $$_TIMESTAMP,
                      "playerList": [],
                      "rollNumber": 0,
                      "currentPlayer": -1,
                      "dice": getEmptyDice()
                    };
                    
                    var e;
                    var n;
                    
                    e = document.getElementsByName("vqxsp")[0];
                    if (e) {
                      $$_MSGFORM = e.parentNode;
                    }
                    
                    if (!$$_MSGFORM) {
                      return;
                    }
                    
                    
                    e = document.getElementsByName("vqxha")[0];
                    if (e) {
                      $$_USERNAME = normalizeName(e.value);
                      n = mungeNameToSpiritList($$_USERNAME);
                      if (n) {
                        $$_USERNAME = n;
                      }
                    }
                    
                    var haveGame = findCurrentGame();
                    if (haveGame) {
                      
                      if (checkIsOurTurn()) {                      
                        if (gameData.rollNumber ==0) {
                          if (loadCookieData()) {
                            return;
                          }
                        }
                      }                                       
                    }
                    
                    
                    var z = getCookie(cookieName() + "_pref");
                    try {
                      $$_PLAYERPREF = JSON.parse(z);
                    } catch(e) {
                      $$_PLAYERPREF = {};
                    }
                    if (!$$_PLAYERPREF) {
                      $$_PLAYERPREF = {};
                    }                      
                    
                    if (!gameData) {
                      gameData = $$_DEFAULT_DATA; 
                    }
                    showBoard();
                    
                    
                    setText();                  
                    
                    if (checkIsOurTurn() && isGameInProgress()) {                      
                      if (gameData.rollNumber == 0) {
                        handleRoll(true);
                      }
                    }
                    
                    
                    //setWhisperStatus();
                    
                    renderReveal();
                  }
                  
                  
                  return {
                    "init": init,
                    "endGame": endGame,
                    "beginNewGame": beginNewGame
                  }
                }());


function purgeChildren(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

var getOptionValue = (function () {
                      if (document.documentElement) {
                      if (document.documentElement.hasAttribute) {
                        return function (o) {
                          return o.hasAttribute('value') ? o.value : o.text;
                        };
                      }
                      if (document.documentElement.attributes) {
                        return function (o) {
                          return (o.attributes.value && o.attributes.value.specified) ? o.value : o.text;
                        };
                      }
                      }
}());


var nextNode = function(node) {
  function nextWide(node) {
    if (!node) {return null;}
    if (node.nextSibling) {
      return node.nextSibling;
    } else {
      return nextWide(node.parentNode);
    }
  }
  
  if (!node) {return null;}
  if (node.firstChild){
    return node.firstChild;
  } else {
    return nextWide(node);
  }
};


var getElementsByClassName = function (className, tag, elm) {
  /* This version of getElementsByClassName is a little brain dead. 
  
  OK, it is VERY brain dead but it was made to work around some SOI/IE specific
  issues ... mostly that you could post something that was such invalid code
  that none of the other getElmentsByClassName could find it and I have no 
  idea why they couldn't.
  
  */
  
  if (!tag) {tag = "span";}
  if (!elm) {elm = document;}
  
  var els = elm.getElementsByTagName(tag);
  
  var out = [];
  
  for (var i = 0; i < els.length; i++) {
    var node = els[i];
    var txt;
    
    if (node.className == className) {
      //txt = document.createTextNode(["IDX",i,'className', node.className].join(", " ));    
      //node.parentNode.appendChild(txt);
      out.push(node);
    }
  }
  
  return out;
}



if (!(JSON && JSON.stringify && JSON.parse)) {
  var JSON = {
    //http://zumbrunn.com/mochazone/JSON.stringify+and+JSON.parse/
    org: 'http://www.JSON.org',
    copyright: '(c)2005 JSON.org',
    license: 'http://www.crockford.com/JSON/license.html',
    stringify: function stringify(arg) {
      var c, i, l, s = '',
      v;
      
      switch (typeof arg) {
      case 'object':
        if (arg) {
          if (arg.constructor == Array) {
            for (i = 0; i < arg.length; ++i) {
              v = stringify(arg[i]);
              if (s) {
                s += ',';
              }
              s += v;
            }
            return '[' + s + ']';
          } else if (typeof arg.toString != 'undefined') {
            for (i in arg) {
              if (!arg.hasOwnProperty(i)) {
                continue;
              } //JJS
              v = stringify(arg[i]);
              if (typeof v != 'function') {
                if (s) {
                  s += ',';
                }
                s += stringify(i) + ':' + v;
              }
            }
            return '{' + s + '}';
          }
        }
        return 'null';
      case 'number':
        return isFinite(arg) ? String(arg) : 'null';
      case 'string':
        l = arg.length;
        s = '"';
        for (i = 0; i < l; i += 1) {
          c = arg.charAt(i);
          if (c >= ' ') {
            if (c == '\\' || c == '"') {
              s += '\\';
            }
            s += c;
          } else {
            switch (c) {
            case '\b':
              s += '\\b';
              break;
            case '\f':
              s += '\\f';
              break;
            case '\n':
              s += '\\n';
              break;
            case '\r':
              s += '\\r';
              break;
            case '\t':
              s += '\\t';
              break;
            default:
              c = c.charCodeAt();
              s += '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }
          }
        }
        return s + '"';
      case 'boolean':
        return String(arg);
      default:
        return 'null';
      }
    },
    parse: function (text) {
      var at = 0;
      var ch = ' ';
      
      function error(m) {
        throw {
          name: 'JSONError',
          message: m,
          at: at - 1,
          text: text
        };
      }
      
      function next() {
        ch = text.charAt(at);
        at += 1;
        return ch;
      }
      
      function white() {
        while (ch) {
          if (ch <= ' ') {
            next();
          } else if (ch == '/') {
            switch (next()) {
            case '/':
              while (next() && ch != '\n' && ch != '\r') {}
              break;
            case '*':
              next();
              for (;;) {
                if (ch) {
                  if (ch == '*') {
                    if (next() == '/') {
                      next();
                      break;
                    }
                  } else {
                    next();
                  }
                } else {
                  error("Unterminated comment");
                }
              }
              break;
            default:
              error("Syntax error");
            }
          } else {
            break;
          }
        }
      }
      
      function string() {
        var i, s = '',
        t, u;
        
        if (ch == '"') {
          outer: while (next()) {
            if (ch == '"') {
              next();
              return s;
            } else if (ch == '\\') {
              switch (next()) {
              case 'b':
                s += '\b';
                break;
              case 'f':
                s += '\f';
                break;
              case 'n':
                s += '\n';
                break;
              case 'r':
                s += '\r';
                break;
              case 't':
                s += '\t';
                break;
              case 'u':
                u = 0;
                for (i = 0; i < 4; i += 1) {
                  t = parseInt(next(), 16);
                  if (!isFinite(t)) {
                    break outer;
                  }
                  u = u * 16 + t;
                }
                s += String.fromCharCode(u);
                break;
              default:
                s += ch;
              }
            } else {
              s += ch;
            }
          }
        }
        error("Bad string");
      }
      
      function array() {
        var a = [];
        
        if (ch == '[') {
          next();
          white();
          if (ch == ']') {
            next();
            return a;
          }
          while (ch) {
            a.push(value());
            white();
            if (ch == ']') {
              next();
              return a;
            } else if (ch != ',') {
              break;
            }
            next();
            white();
          }
        }
        error("Bad array");
      }
      
      function object() {
        var k, o = {};
        
        if (ch == '{') {
          next();
          white();
          if (ch == '}') {
            next();
            return o;
          }
          while (ch) {
            k = string();
            white();
            if (ch != ':') {
              break;
            }
            next();
            o[k] = value();
            white();
            if (ch == '}') {
              next();
              return o;
            } else if (ch != ',') {
              break;
            }
            next();
            white();
          }
        }
        error("Bad object");
      }
      
      function number() {
        var n = '',
        v;
        
        if (ch == '-') {
          n = '-';
          next();
        }
        while (ch >= '0' && ch <= '9') {
          n += ch;
          next();
        }
        if (ch == '.') {
          n += '.';
          while (next() && ch >= '0' && ch <= '9') {
            n += ch;
          }
        }
        v = +n;
        if (!isFinite(v)) {
          error("Bad number");
        } else {
          return v;
        }
      }
      
      function word() {
        switch (ch) {
        case 't':
          if (next() == 'r' && next() == 'u' && next() == 'e') {
            next();
            return true;
          }
          break;
        case 'f':
          if (next() == 'a' && next() == 'l' && next() == 's' && next() == 'e') {
            next();
            return false;
          }
          break;
        case 'n':
          if (next() == 'u' && next() == 'l' && next() == 'l') {
            next();
            return null;
          }
          break;
        }
        error("Syntax error");
      }
      
      function value() {
        white();
        switch (ch) {
        case '{':
          return object();
        case '[':
          return array();
        case '"':
          return string();
        case '-':
          return number();
        default:
          return ch >= '0' && ch <= '9' ? number() : word();
        }
      }
      
      return value();
    }
  };
}


if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    "use strict";
    
    if (this === void 0 || this === null) throw new TypeError();
    
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) return -1;
    
    var n = 0;
    if (arguments.length > 0) {
      n = Number(arguments[1]);
      if (n !== n) n = 0;
      else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    
    if (n >= len) return -1;
    
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) return k;
    }
    return -1;
  };
}

var getText = function (el) {
  var ret;
  var txt = [],
  i = 0;
  
  if (!el) {
    ret = "";
  } else if (el.nodeType === 3) {
    // No problem if it's a text node
    ret = el.nodeValue;
  } else {
    // If there is more to it, then let's gather it all.
    while (el.childNodes[i]) {
      txt[txt.length] = self.getText(el.childNodes[i]);
      i++;
    }
    // return the array as a string
    ret = txt.join("");
  }
  return ret;
};

function urlencode(n) {
  return n; //FAKE! But we don't care in this case
}

function serializeFormUrlencoded(f) {
  var e, // form element
  n, // form element's name
  t, // form element's type
  o, // option element
  es = f.elements,
  c1 = {},
  c = []; // the serialization data parts
  
  function add(n, v) {
    c[c.length] = urlencode(n) + "=" + urlencode(v);
    c1[urlencode(n)] = urlencode(v);
  }
  
  for (var i = 0, ilen = es.length; i < ilen; i++) {
    e = es[i];
    n = e.name;
    if (n && !e.disabled) {
      t = e.type;
      if (t.match(/^select/)) {
        // The 'select-one' case could reuse 'select-multiple' case
        // The 'select-one' case code is an optimization for
        // serialization processing time.
        if (t === 'select-one' || (t === 'select' && !t.multiple)) {
          if (e.selectedIndex >= 0) {
            add(n, getOptionValue(e.options[e.selectedIndex]));
          }
        }
        else {
          for (var j = 0, jlen = e.options.length; j < jlen; j++) {
            o = e.options[j];
            if (o.selected) {
              add(n, getOptionValue(o));
            }
          }
        }
      }
      else if (t.match(/^checkbox|radio$/)) {
        if (e.checked) {
          add(n, e.value);
        }
      }
      else if (t.match(/^text|password|hidden|textarea$/)) {
        add(n, e.value);
      }
    }
  }
  return c1;
  //return c.join('&');
};


window.onload = diceGame.init;
window.onunload = function() { /*Do nothing*/ };



// Domain Public by Eric Wendelin http://eriwen.com/ (2008)
//                  Luke Smith http://lucassmith.name/ (2008)
//                  Loic Dachary <loic@dachary.org> (2008)
//                  Johan Euphrosine <proppy@aminche.com> (2008)
//                  Øyvind Sean Kinsey http://kinsey.no/blog (2010)
//
// Information and discussions
// http://jspoker.pokersource.info/skin/test-printstacktrace.html
// http://eriwen.com/javascript/js-stack-trace/
// http://eriwen.com/javascript/stacktrace-update/
// http://pastie.org/253058
//
// guessFunctionNameFromLines comes from firebug
//
// Software License Agreement (BSD License)
//
// Copyright (c) 2007, Parakey Inc.
// All rights reserved.
//
// Redistribution and use of this software in source and binary forms, with or without modification,
// are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above
//   copyright notice, this list of conditions and the
//   following disclaimer.
//
// * Redistributions in binary form must reproduce the above
//   copyright notice, this list of conditions and the
//   following disclaimer in the documentation and/or other
//   materials provided with the distribution.
//
// * Neither the name of Parakey Inc. nor the names of its
//   contributors may be used to endorse or promote products
//   derived from this software without specific prior
//   written permission of Parakey Inc.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
// IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
// CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
// IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
// OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/**
* Main function giving a function stack trace with a forced or passed in Error 
*
* @cfg {Error} e The error to create a stacktrace from (optional)
* @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
* @return {Array} of Strings with functions, lines, files, and arguments where possible 
*/
function printStackTrace(options) {
  var ex = (options && options.e) ? options.e : null;
  var guess = options ? !!options.guess : true;
  
  var p = new printStackTrace.implementation();
  var result = p.run(ex);
  return (guess) ? p.guessFunctions(result) : result;
}

printStackTrace.implementation = function() {};

printStackTrace.implementation.prototype = {
  run: function(ex) {
    // Use either the stored mode, or resolve it
    var mode = this._mode || this.mode();
    if (mode === 'other') {
      return this.other(arguments.callee);
    } else {
      ex = ex ||
      (function() {
       try {
       (0)();
       } catch (e) {
         return e;
       }
      })();
      return this[mode](ex);
    }
  },
  
	/**
	* @return {String} mode of operation for the environment in question.
	*/
	mode: function() {
	  try {
	    (0)();
	  } catch (e) {
	    if (e.arguments) {
	      return (this._mode = 'chrome');
	    } else if (window.opera && e.stacktrace) {
				return (this._mode = 'opera10');
			} else if (e.stack) {
			  return (this._mode = 'firefox');
			} else if (window.opera && !('stacktrace' in e)) { //Opera 9-
			  return (this._mode = 'opera');
			}
		}
		return (this._mode = 'other');
	},
	
	/**
	* Given a context, function name, and callback function, overwrite it so that it calls
	* printStackTrace() first with a callback and then runs the rest of the body.
	* 
	* @param {Object} context of execution (e.g. window)
	* @param {String} functionName to instrument
	* @param {Function} function to call with a stack trace on invocation
	*/
	instrumentFunction: function(context, functionName, callback) {
		context = context || window;
		context['_old' + functionName] = context[functionName];
		context[functionName] = function() { 
			callback.call(this, printStackTrace());
			return context['_old' + functionName].apply(this, arguments);
		}
		context[functionName]._instrumented = true;
	},
	
	/**
	* Given a context and function name of a function that has been
	* instrumented, revert the function to it's original (non-instrumented)
	* state.
	*
	* @param {Object} context of execution (e.g. window)
	* @param {String} functionName to de-instrument
	*/
	deinstrumentFunction: function(context, functionName) {
		if (context[functionName].constructor === Function
				&& context[functionName]._instrumented
				&& context['_old' + functionName].constructor === Function) {
		context[functionName] = context['_old' + functionName];
		    }
	},
	
	/**
	* Given an Error object, return a formatted Array based on Chrome's stack string.
	* 
	* @param e - Error object to inspect
	* @return Array<String> of function calls, files and line numbers
	*/
	chrome: function(e) {
	  return e.stack.replace(/^.*?\n/, '').
	  replace(/^.*?\n/, '').
	  replace(/^.*?\n/, '').
	  replace(/^[^\(]+?[\n$]/gm, '').
	          replace(/^\s+at\s+/gm, '').
	          replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@').
	                  split('\n');
	                  },
	                  
	                  /**
	                  * Given an Error object, return a formatted Array based on Firefox's stack string.
	                  * 
	                  * @param e - Error object to inspect
	                  * @return Array<String> of function calls, files and line numbers
	                  */
	                  firefox: function(e) {
	                    return e.stack.replace(/^.*?\n/, '').
	                    replace(/(?:\n@:0)?\s+$/m, '').
	                    replace(/^\(/gm, '{anonymous}(').
	                            split('\n');
	                            },
	                            
	                            /**
	                            * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
	                            * 
	                            * @param e - Error object to inspect
	                            * @return Array<String> of function calls, files and line numbers
	                            */
	                            opera10: function(e) {
	                              var stack = e.stacktrace;
	                              var lines = stack.split('\n'), ANON = '{anonymous}',
	                              lineRE = /.*?line (\d+), column (\d+) in ((<anonymous function\:?\s*(\S+))|([^\(]+)\([^\)]*\))(?: in )?(.*)\s*$/i, i, j, len;
	                              for (i = 2, j = 0, len = lines.length; i < len - 2; i++) {
	                                if (lineRE.test(lines[i])) {
	                                  var location = RegExp.$6 + ':' + RegExp.$1 + ':' + RegExp.$2;
	                                  var fnName = RegExp.$3;
	                                  fnName = fnName.replace(/<anonymous function\s?(\S+)?>/g, ANON);
	                                  lines[j++] = fnName + '@' + location;
	                                }
	                              }
	                              
	                              lines.splice(j, lines.length - j);
	                              return lines;
	                            },
	                            
	                            // Opera 7.x-9.x only!
	                            opera: function(e) {
	                              var lines = e.message.split('\n'), ANON = '{anonymous}', 
	                              lineRE = /Line\s+(\d+).*?script\s+(http\S+)(?:.*?in\s+function\s+(\S+))?/i, 
	                              i, j, len;
	                              
	                              for (i = 4, j = 0, len = lines.length; i < len; i += 2) {
	                                //TODO: RegExp.exec() would probably be cleaner here
	                                if (lineRE.test(lines[i])) {
	                                  lines[j++] = (RegExp.$3 ? RegExp.$3 + '()@' + RegExp.$2 + RegExp.$1 : ANON + '()@' + RegExp.$2 + ':' + RegExp.$1) + ' -- ' + lines[i + 1].replace(/^\s+/, '');
	                                }
	                              }
	                              
	                              lines.splice(j, lines.length - j);
	                              return lines;
	                            },
	                            
	                            // Safari, IE, and others
	                            other: function(curr) {
	                              var ANON = '{anonymous}', fnRE = /function\s*([\w\-$]+)?\s*\(/i,
	                                                                                           stack = [], j = 0, fn, args;
	                                                                                           
	                                                                                           var maxStackSize = 10;
	                                                                                           while (curr && stack.length < maxStackSize) {
	                                                                                             fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
	                                                                                             args = Array.prototype.slice.call(curr['arguments']);
	                                                                                             stack[j++] = fn + '(' + this.stringifyArguments(args) + ')';
	                                                                                             curr = curr.caller;
	                                                                                           }
	                                                                                           return stack;
	                            },
	                            
	                            /**
	                            * Given arguments array as a String, subsituting type names for non-string types.
	                            *
	                            * @param {Arguments} object
	                            * @return {Array} of Strings with stringified arguments
	                            */
	                            stringifyArguments: function(args) {
	                              for (var i = 0; i < args.length; ++i) {
	                                var arg = args[i];
	                                if (arg === undefined) {
	                                  args[i] = 'undefined';
	                                } else if (arg === null) {
	                                  args[i] = 'null';
	                                } else if (arg.constructor) {
	                                  if (arg.constructor === Array) {
	                                    if (arg.length < 3) {
	                                      args[i] = '[' + this.stringifyArguments(arg) + ']';
	                                    } else {
	                                      args[i] = '[' + this.stringifyArguments(Array.prototype.slice.call(arg, 0, 1)) + '...' + this.stringifyArguments(Array.prototype.slice.call(arg, -1)) + ']';
	                                    }
	                                  } else if (arg.constructor === Object) {
	                                    args[i] = '#object';
	                                  } else if (arg.constructor === Function) {
	                                    args[i] = '#function';
	                                  } else if (arg.constructor === String) {
	                                    args[i] = '"' + arg + '"';
	                                  }
	                                }
	                              }
	                              return args.join(',');
	                            },
	                            
	                            sourceCache: {},
	                            
	                            /**
	                            * @return the text from a given URL.
	                            */
	                            ajax: function(url) {
	                              var req = this.createXMLHTTPObject();
	                              if (!req) {
	                                return;
	                              }
	                              req.open('GET', url, false);
	                              req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
	                              req.send('');
	                              return req.responseText;
	                            },
	                            
	                            /**
	                            * Try XHR methods in order and store XHR factory.
	                            *
	                            * @return <Function> XHR function or equivalent
	                            */
	                            createXMLHTTPObject: function() {
	                              var xmlhttp, XMLHttpFactories = [
	                                function() {
	                                  return new XMLHttpRequest();
	                                }, function() {
	                                  return new ActiveXObject('Msxml2.XMLHTTP');
	                                }, function() {
	                                  return new ActiveXObject('Msxml3.XMLHTTP');
	                                }, function() {
	                                  return new ActiveXObject('Microsoft.XMLHTTP');
	                                }
	                              ];
	                              for (var i = 0; i < XMLHttpFactories.length; i++) {
	                                try {
	                                  xmlhttp = XMLHttpFactories[i]();
	                                  // Use memoization to cache the factory
	                                  this.createXMLHTTPObject = XMLHttpFactories[i];
	                                  return xmlhttp;
            } catch (e) {}
                                }
                              },
                              
                              /**
                              * Given a URL, check if it is in the same domain (so we can get the source
                              * via Ajax).
                              *
                              * @param url <String> source url
                              * @return False if we need a cross-domain request
                              */
                              isSameDomain: function(url) {
                                return url.indexOf(location.hostname) !== -1;
                              },
                              
                              /**
                              * Get source code from given URL if in the same domain.
                              *
                              * @param url <String> JS source URL
                              * @return <String> Source code
                              */
                              getSource: function(url) {
                                if (!(url in this.sourceCache)) {
                                  this.sourceCache[url] = this.ajax(url).split('\n');
                                }
                                return this.sourceCache[url];
                              },
                              
                              guessFunctions: function(stack) {
                                for (var i = 0; i < stack.length; ++i) {
                                  var reStack = /{anonymous}\(.*\)@(\w+:\/\/([-\w\.]+)+(:\d+)?[^:]+):(\d+):?(\d+)?/;
                                  var frame = stack[i], m = reStack.exec(frame);
                                  if (m) {
                                    var file = m[1], lineno = m[4]; //m[7] is character position in Chrome
                                    if (file && this.isSameDomain(file) && lineno) {
                                      var functionName = this.guessFunctionName(file, lineno);
                                      stack[i] = frame.replace('{anonymous}', functionName);
                                    }
                                  }
                                }
                                return stack;
                              },
                              
                              guessFunctionName: function(url, lineNo) {
                                try {
                                  return this.guessFunctionNameFromLines(lineNo, this.getSource(url));
                                } catch (e) {
                                  return 'getSource failed with url: ' + url + ', exception: ' + e.toString();
                                }
                              },
                              
                              guessFunctionNameFromLines: function(lineNo, source) {
                                var reFunctionArgNames = /function ([^(]*)\(([^)]*)\)/;
                                var reGuessFunction = /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*(function|eval|new Function)/;
                                  // Walk backwards from the first line in the function until we find the line which
                                  // matches the pattern above, which is the function definition
                                  var line = "", maxLines = 10;
                                  for (var i = 0; i < maxLines; ++i) {
                                    line = source[lineNo - i] + line;
                                    if (line !== undefined) {
                                      var m = reGuessFunction.exec(line);
                                      if (m && m[1]) {
                                        return m[1];
                                      } else {
                                        m = reFunctionArgNames.exec(line);
                                        if (m && m[1]) {
                                          return m[1];
                                        }
                                      }
                                    }
                                  }
                                  return '(?)';
                              }
};

