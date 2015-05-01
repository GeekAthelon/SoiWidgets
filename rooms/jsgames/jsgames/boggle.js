"use strict";

var $$_ISLOCAL = false;

var JSON = JSON || {};
// From: http://blogs.sitepoint.com/javascript-json-serialization/
// implement JSON.stringify serialization
JSON.stringify = JSON.stringify ||
function (obj) {
  var t = typeof (obj);
  if (t != "object" || obj === null) {
    // simple data type
    if (t == "string") obj = '"' + obj + '"';
    return String(obj);
  } else {
    // recurse array or object
    var n, v, json = [],
      arr = (obj && obj.constructor == Array);
    for (n in obj) {
      v = obj[n];
      t = typeof (v);
      if (t == "string") v = '"' + v + '"';
      else if (t == "object" && v !== null) v = JSON.stringify(v);
      json.push((arr ? "" : '"' + n + '":') + String(v));
    }
    return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
  }
};
// implement JSON.parse de-serialization
JSON.parse = JSON.parse ||
function (str) {
  if (str === "") str = '""';
  eval("var p=" + str + ";");
  return p;
};


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
      if (n !== n) // shortcut for verifying if it's NaN
      n = 0;
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

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.com/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback, thisArg) {

    var T, k;

    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }

    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0; // Hack to convert O.length to a UInt32
    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if ({}.toString.call(callback) != "[object Function]") {
      throw new TypeError(callback + " is not a function");
    }

    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (thisArg) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Call the Call internal method of callback with T as the this value and
        // argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}
/*************************************************************************/
var $$BASE_URL

if ($$_ISLOCAL) {
  $$BASE_URL = "/fakesoi/rooms/jsgames/jsgames";
} else {
  $$BASE_URL = 'http://soiroom.hyperchat.com/jsgames/boggle2';
  document.domain = "hyperchat.com";
}

var global = JSON.parse(window.name);

function setIframeHeight(id, h) {
  if (document.getElementById) {
    var theIframe = document.getElementById(id);
    if (theIframe) {
      dw_Viewport.getWinHeight();
      theIframe.style.height = Math.round(h * dw_Viewport.height) + "px";
      theIframe.style.marginTop = Math.round((dw_Viewport.height - parseInt(theIframe.style.height)) / 2) + "px";
    }
  }
}

/*************************************************************************
dw_viewport.js
free code from dyn-web.com
version date: mar 2008
*************************************************************************/

var dw_Viewport = {
  getWinWidth: function () {
    this.width = 0;
    if (window.innerWidth) this.width = window.innerWidth - 18;
    else if (document.documentElement && document.documentElement.clientWidth) this.width = document.documentElement.clientWidth;
    else if (document.body && document.body.clientWidth) this.width = document.body.clientWidth;
    return this.width;
  },

  getWinHeight: function () {
    this.height = 0;
    if (window.innerHeight) this.height = window.innerHeight - 18;
    else if (document.documentElement && document.documentElement.clientHeight) this.height = document.documentElement.clientHeight;
    else if (document.body && document.body.clientHeight) this.height = document.body.clientHeight;
    return this.height;
  },

  getScrollX: function () {
    this.scrollX = 0;
    if (typeof window.pageXOffset == "number") this.scrollX = window.pageXOffset;
    else if (document.documentElement && document.documentElement.scrollLeft) this.scrollX = document.documentElement.scrollLeft;
    else if (document.body && document.body.scrollLeft) this.scrollX = document.body.scrollLeft;
    else if (window.scrollX) this.scrollX = window.scrollX;
    return this.scrollX;
  },

  getScrollY: function () {
    this.scrollY = 0;
    if (typeof window.pageYOffset == "number") this.scrollY = window.pageYOffset;
    else if (document.documentElement && document.documentElement.scrollTop) this.scrollY = document.documentElement.scrollTop;
    else if (document.body && document.body.scrollTop) this.scrollY = document.body.scrollTop;
    else if (window.scrollY) this.scrollY = window.scrollY;
    return this.scrollY;
  },

  getAll: function () {
    this.getWinWidth();
    this.getWinHeight();
    this.getScrollX();
    this.getScrollY();
  }
}


/////////////////////////////////////////////////////////////////////////
// Portion below not generally part of the JavaScript file
// If you want to use the file above, place it on your own server!
// see www.dyn-web.com/business/terms.php
// for bandwidth thieves when no referrer
function handleHotlinks() {
  var loc = window.location.href.toLowerCase(); // for translate, etc
  if (loc.indexOf('dyn-web.com') == -1) {
    window.location.href = 'about:blank';
  }
}
//handleHotlinks();
/////////////////////////////////////////////////////////////////////////
function resize() {
  setIframeHeight('ifrm', 1);
}

var addCssRule = (function () {
  // http://stackoverflow.com/questions/4284935/adding-css-text-to-iframe-contents-using-javascript
  var addRule;

  if (typeof document.styleSheets != "undefined" && document.styleSheets) {
    addRule = function (selector, rule, doc, el) {
      var sheets = doc.styleSheets,
        sheet;
      if (sheets && sheets.length) {
        sheet = sheets[sheets.length - 1];
        if (sheet.addRule) {
          sheet.addRule(selector, rule)
        } else if (typeof sheet.cssText == "string") {
          sheet.cssText = selector + " {" + rule + "}";
        } else if (sheet.insertRule && sheet.cssRules) {
          sheet.insertRule(selector + " {" + rule + "}", sheet.cssRules.length);
        }
      }
    }
  } else {
    addRule = function (selector, rule, doc, el) {
      el.appendChild(doc.createTextNode(selector + " {" + rule + "}"));
    };
  }

  return function (selector, rule, doc) {
    doc = doc || document;

    var head = doc.getElementsByTagName("head")[0];
    if (head && addRule) {
      var styleEl = doc.createElement("style");
      styleEl.type = "text/css";
      styleEl.media = "screen";
      head.appendChild(styleEl);
      addRule(selector, rule, doc, styleEl);
      styleEl = null;
    }
  };
})();


window.onload = function () {
  var url = global.url;

  var iframe = document.createElement('iframe');
  iframe.id = 'ifrm';
  iframe.style.width = "100%";
  iframe.src = url;
  iframe.style.position = "absolute";
  iframe.style.top = '0px';
  iframe.style.left = '0px';

  //   <iframe onload="init2()" name="ifrm" id="ifrm" src="about:blank" width="1%" height="1px">
  //<p>No iframe support?  Ack...</p>
  //</iframe>
  document.body.appendChild(iframe);
  resize();
};
window.onresize = function () {
  resize()
};

var doc;
var goodRandom;

function init2() {
  var testEl;
  var bail = false;
  var rname;
  var rlist;

  // Check and see if we are still on the small frame we want to be...
  // We might run into same origion trouble..
  try {
    var iframe = document.getElementById('ifrm');
    doc = (iframe.contentWindow || iframe.contentDocument);
    if (doc.document) doc = doc.document;

    testEl = doc.getElementsByName("vqxro");
  } catch (e) {
    alert(e);
    testEl = null;
  }

  if (!testEl) {
    bail = true;
  }

  if (!bail && testEl[0]) {
    rlist = ["jsgames@soi", "jsgames"];
    rname = testEl[0].value;
    if (rlist.indexOf(rname) === -1) {
      bail = true;
    }
  }

  if (bail) {
    alert("Breaking out of iframe!  Sending you back to the login page... I'll " + "find a nicer way to handle this later.");
    window.location.href = "http://hyperchat.com";
    return;
  }

  var table;

  var boardDiv = doc.createElement("div");


  // Find an element in the chatbox, then work our way back out to the top
  // of the table.
  table = doc.getElementsByName("vqxto")[0];
  while (table.tagName.toLowerCase() != 'table') {
    table = table.parentNode;
  }
  table.style.clear = "both";
  table.parentNode.insertBefore(boardDiv, table);

  //document.body.appendChild(boardDiv);
  boardDiv.appendChild(doc.createTextNode("Game Board"));

  // http://www.kremalicious.com/2008/04/make-cool-and-clever-text-effects-with-css-text-shadow/
  var normal = "color: #fff; background: #666; text-shadow: 0px 1px 1px #000;";
  var disabled = "color: #000; background: #666; text-shadow: 0px 1px 1px #fff;";
  var active = "color: #fff; background: #666; text-shadow: 1px 1px 6px #fff;";

  normal = "color: #BBB; background: #666;";
  disabled = "color: #000; background: #666;";
  active = "color: #fff; background: #666;";

  addCssRule("pre button", "font-size: 200%; width:2em; " + normal + "margin: 0.05em", doc);

  addCssRule("pre button.disabled", disabled, doc);
  addCssRule("pre button.active", active, doc);
  addCssRule("pre button.normal", normal, doc);


  addCssRule("pre button.wide", "width:8.2em", doc);
  addCssRule(".border", "border: 1px dashed yellow; font-size: 150%; position: relative;" + normal, doc);
  addCssRule(".challenge", "border: 1px solid white; font-size: 110%;", doc);

  addCssRule(".rotate270", "-webkit-transform: rotate(-90deg); " + "-moz-transform: rotate(-90deg); " + "-ms-transform: rotate(-90deg);  " + "-o-transform: rotate(-90deg);  " + "transform: rotate(-90deg);  " + "filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3); ", doc);

  addCssRule(".rotate90", "-webkit-transform: rotate(90deg); /* Safari */ " + "-moz-transform: rotate(90deg); /* Firefox */ " + "-ms-transform: rotate(90deg); /* IE */ " + "-o-transform: rotate(90deg); /* Opera */ " + "transform: rotate(90deg); " + "filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);", doc);

  addCssRule(".rotate180", "-webkit-transform: rotate(180deg); /* Safari */ " + "-moz-transform: rotate(180deg); /* Firefox */ " + "-ms-transform: rotate(180deg); /* IE */ " + "-o-transform: rotate(180deg); /* Opera */ " + "transform: rotate(180deg); " + "filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2); /* IE */ ", doc);

  //addCssRule(".rotate180, .rotate0, .rotate270, .rotate90",
  /* Under IE7, these need split up into separate rules */
  ".rotate180,.rotate0,.rotate270,.rotate90".split(",").forEach(function (name) {
    addCssRule(name, "text-decoration: underline;" + "zoom: 1;", doc);
  });

  addCssRule(".fakeb", "border: 1px solid blue; font-size: 90%; background-color: white; color: black;", doc);

  fixLinks();

  boggle.init(boardDiv);
}


function fixLinks() {
  var els = doc.getElementsByTagName("a");
  var i, l = els.length;
  var el;

  for (i = 0; i < l; i++) {
    el = els[i];
    el.target = "_top";
  }

  els = doc.getElementsByTagName("span");
  l = els.length;

  for (i = 0; i < l; i++) {
    el = els[i];
    if (el.className == 'challenge') {
      el.onclick = (function (_el) {
        return function () {
          var rndSeed = _el.id.split("_");
          parent.boggle.startGame(rndSeed[1], rndSeed[2], rndSeed[3]);
        }
      }(el))
    }
  }

  var findForm = findElementParentNode(doc.getElementsByName("vqvak")[0], 'form');
  findForm.target = "_top";
}

function findElementParentNode(el, tagName) {
  var target = el;
  tagName = tagName.toLowerCase();

  while (target.tagName.toLowerCase() != tagName) {
    target = target.parentNode;
    if (!target) {
      break;
    }
  }

  return target;
}


var boggle = (

function () {

  function getDefaultDice() {
    var dice = [];
    dice[dice.length] = ["T", "O", "E", "S", "S", "I"];
    dice[dice.length] = ["A", "S", "P", "F", "F", "K"];
    dice[dice.length] = ["N", "U", "I", "H", "M", "Qu"];
    dice[dice.length] = ["O", "B", "J", "O", "A", "B"];
    dice[dice.length] = ["L", "N", "H", "N", "R", "Z"];
    dice[dice.length] = ["A", "H", "S", "P", "C", "O"];
    dice[dice.length] = ["R", "Y", "V", "D", "E", "L"];
    dice[dice.length] = ["I", "O", "T", "M", "U", "C"];
    dice[dice.length] = ["L", "R", "E", "I", "X", "D"];
    dice[dice.length] = ["T", "E", "R", "W", "H", "V"];
    dice[dice.length] = ["T", "S", "T", "I", "Y", "D"];
    dice[dice.length] = ["W", "N", "G", "E", "E", "H"];
    dice[dice.length] = ["E", "R", "T", "T", "Y", "L"];
    dice[dice.length] = ["O", "W", "T", "O", "A", "T"];
    dice[dice.length] = ["A", "E", "A", "N", "E", "G"];
    dice[dice.length] = ["E", "I", "U", "N", "E", "S"];
    return dice;
  }

  var dice = getDefaultDice();  
  var frozenDict = null;

  var boardWidth = 4;
  var boardHeight = 4;
  var gameBoard;
  var gameDiv;

  var SOIjstimeDifference;

  function rollInt(f) {
    return Math.floor(goodRandom() * f);
  }


  function shakeBoard() {
    var i, j, li, lj;
    var t, k;
    var a;
    var idx;

    // Start off with the default dice.  This way, the primed PRNG will start
    // things off in the correct order.
    dice = getDefaultDice();


    // First, random the dice by stepping through the values and
    // swapping the current dice with any random one.
    li = dice.length;
    for (i = 0; i < li; i++) {
      t = rollInt(li);
      k = dice[i];
      dice[i] = dice[t];
      dice[t] = k;
    }

    //alert(dice.join("|\r"));
    // Now that we've randomized the dice positions, step through each and
    // randomly choose one face.
    gameBoard = [];

    lj = dice[0].length;

    idx = 0;
    for (i = 0; i < boardHeight; i++) {
      a = [];
      for (j = 0; j < boardWidth; j++) {
        t = rollInt(lj);

        //alert( [t, i, j, idx, dice[idx]]);
        //alert([dice[idx], t]);
        k = dice[idx][t]; // Find die and grab letter.
        idx++;
        a.push(k);
      }
      gameBoard.push(a);
    }

    //alert(JSON.stringify(gameBoard));
    //alert("random dice = " + dice);
  }

  function showBoard() {
    var i, j;
    var khar;
    var word = "";
    var wordList = [];
    var letterEl;
    var wordCompleteEl;

    var el = doc.createElement("pre")

    var wordListEl = doc.createElement("div");
    wordListEl.style.cssFloat = wordListEl.style.styleFloat = "left";
    wordListEl.style.overflow = "scroll";

    el.style.cssFloat = el.style.styleFloat = "left";
    el.style.border = "1px solid red";

    var userWordEl;
    var buttonList = [];
    var wordButtonList = [];

    var pointsMatrix = {
      0: 0,
      1: 0,
      2: 0,
      3: 1,
      4: 1,
      5: 2,
      6: 3,
      7: 5,
      8: 11,
      9: 11,
      10: 11,
      11: 11,
      12: 11,
      13: 11,
      14: 11,
      15: 11,
      16: 11
    };

    function scoreWords(wordList, o) {
      var i;
      var word;
      var isValid;
      var wordPoints;
      var totalPoints = 0;
      var out = [];
      var s = "";
      
      for (i = 0; i < wordList.length; i++) {
        word = wordList[i].toLowerCase();
        isValid = frozenDict.lookup(word);

        wordPoints = isValid ? pointsMatrix[word.length] : 0;
        if (isValid) {
          s = word + ": " + wordPoints;
          totalPoints += wordPoints
        } else {
          s = word + ": <strike>" + wordPoints + "</strike>";
        }
        s += " <a class='fakeb' href='http://www.merriam-webster.com/dictionary/" + word + "'>m-w</a>";
        out.push(s);
      }


      out.push("Total = " + totalPoints);
      o.push(out.join("<br>"));
    }

    function broadcastGame() {
      var o = [];

      o.push("<pre>");
      for (i = 0; i < boardHeight; i++) {
        for (j = 0; j < boardWidth; j++) {
          khar = gameBoard[i][j];
          o.push(khar);
        }
        o.push("<br>");
      }
      o.push("</pre>");
      o.push("Found the words:<br>");
      if (frozenDict) {
        scoreWords(wordList, o);
      } else {
        o.push("Dictionary not loaded -- no scoring<br>");
        o.push(wordList.join(", "));
      }

      var ta = doc.getElementsByName("vqxsp")[0];
      var form = findElementParentNode(ta, 'form');
      // When the game ends, bail us out of the iframe.
      // form.target = "_top";
      ta.value = o.join("");
      form.submit();
    }

    function resetButtons() {
      if (wordList.indexOf(word) != -1) {
        wordCompleteEl.className = "wide disabled";
        wordCompleteEl.disabled = true;
        wordCompleteEl.innerHTML = "Duplicate Word";
      } else {
        wordCompleteEl.className = "wide active";
        wordCompleteEl.disabled = false;
        wordCompleteEl.innerHTML = "Word Complete!";
      }

      var lastButton = wordButtonList[wordButtonList.length - 1];
      var i, j;
      var b;

      function glow(i, j) {
        var s = ['game', i, j].join("_");
        var e = doc.getElementById(s);
        //alert([s, i, j, e]);
        if (e && !e.disabled) {
          addClass(e, "active");
        }
      }

      for (var i = 0; i < buttonList.length; i++) {
        b = buttonList[i];
        b.disabled = false;
        removeClass(b, "active");
        removeClass(b, "disabled");
      }

      for (var i = 0; i < wordButtonList.length; i++) {
        b = wordButtonList[i];
        b.disabled = true;
        addClass(b, "disabled");
      }

      // If there hasn't been a letter yet, give the player the choice of
      // everything.
      if (!wordButtonList.length) {
        for (var i = 0; i < buttonList.length; i++) {
          b = buttonList[i];
          b.disabled = false;
          addClass(b, "active");
        }
      }

      if (lastButton) {
        i = +lastButton.id.split("_")[1];
        j = +lastButton.id.split("_")[2];

        glow(i + 1, j - 1);
        glow(i - 1, j + 1);

        glow(i + 1, j + 1);
        glow(i + 0, j + 1);
        glow(i + 1, j + 0);

        glow(i - 1, j - 1);
        glow(i - 0, j - 1);
        glow(i - 1, j - 0);
      }

      if (lastButton) {
        for (var i = 0; i < buttonList.length; i++) {
          b = buttonList[i];
          if (!b.className) {
            b.disabled = true;
          }
        }
      }
    }

    function resetForNewWord() {
      wordButtonList = [];
    }

    function showWord() {
      var s = (word != "") ? word : "<i>Your word here</i>";
      userWordEl.innerHTML = "&nbsp;" + s;

      wordListEl.innerHTML = "You have found the following words:<br>" + wordList.join("<br>");

      resetButtons();
    }

    function printLetter(l) {
      var span = doc.createElement('button');
      span.appendChild(doc.createTextNode(l));
      el.appendChild(span);
      buttonList.push(span);
      span.style.height = "2em";
      span.style.width = "2em";
      span.className = ["rotate0", "rotate90", "rotate180", "rotate270"][rollInt(3)]

      span.onclick = function () {
        word += l;
        wordButtonList.push(span);
        showWord();
      }
      return span;
    }

    function printNewline(l) {
      var br = doc.createElement('br');
      el.appendChild(br);
    }

    function printWordButton() {
      var span = doc.createElement('button');
      span.className = "wide";
      span.appendChild(doc.createTextNode("Word Complete!"));
      el.appendChild(span);

      span.onclick = function () {
        wordList.push(word);
        word = "";
        resetForNewWord();
        showWord();
      }
      return span;
    }

    function printClearButton() {
      var span = doc.createElement('button');
      span.className = "wide active";
      span.appendChild(doc.createTextNode("Clear Word"));
      el.appendChild(span);

      span.onclick = function () {
        word = "";
        resetForNewWord();
        showWord();
      }
    }

    function initTimer() {
      var span = doc.createElement('button');
      span.className = "wide";
      span.id = "timer_span";
      span.disabled = true;
      el.appendChild(span);

      var startTime = Math.round((new Date()).getTime() / 1000);
      var endTime = startTime + (3 * 60);
      //var endTime = startTime + (30);
      showTimer();

      function showTimer() {
        var span = doc.getElementById("timer_span");
        if (!span) {
          // If the page looses focus before the timer fires.
          return;
        }
        var now = Math.round((new Date()).getTime() / 1000);
        var t = (endTime - now);

        span.innerHTML = "Time left: " + formatSeconds(t);
        if (t > 0) {
          window.setTimeout(showTimer, 500);
        } else {
          broadcastGame();
        }
      }


    }

    function printWordSpace() {
      var span = doc.createElement('p');
      span.className = "border";
      span.style.width = "16em";
      span.appendChild(doc.createTextNode(""));
      el.appendChild(span);
      userWordEl = span;
    }


    printWordSpace();

    for (i = 0; i < boardHeight; i++) {
      for (j = 0; j < boardWidth; j++) {
        khar = gameBoard[i][j];
        letterEl = printLetter(khar);
        letterEl.id = ["game", i, j].join("_");
      }
      printNewline();
    }

    wordCompleteEl = printWordButton();
    el.appendChild(doc.createElement("br"));
    printClearButton();

    gameDiv.appendChild(el);
    //el.appendChild(wordListEl);
    gameDiv.appendChild(wordListEl);
    showWord();
    el.appendChild(doc.createElement("br"));
    initTimer();
  }

  function getSoiTimeStamp() {
    return +doc.getElementsByName("vqxti")[0].value;
  }

  function getSoiTimeAsJsTime() {
    var a = getSoiTimeStamp() * 1000;
    return a;
  }

 function loadDictionary() {
  var z = null;
  var failed;
  var isValid;
  
  var data = null;
  if (supports_html5_storage()) {
    data = localStorage.getItem("jsgames_worddict");
    if (data) {
      data = JSON.parse(data);
      z = new FrozenTrie(data.trie, data.directory, data.nodeCount);
      if (!z) {
        window.alert("The dictionary failed to load");
        z = null;
      } else {
        failed = false;
        try {
          isValid = z.lookup("apple");
        } catch (err) {
          failed = true;
        }
        if (failed || !isValid) {
          alert("Dictionary doesn't seem to be working");
          z = null;
        }
      }
    }
  }
  return z;
}
 
  function init(div) {    
    frozenDict = loadDictionary();
    SOIjstimeDifference = +new Date() - getSoiTimeAsJsTime();

    gameDiv = div;

    gameDiv.innerHTML = "";
    var startGameButton = doc.createElement('span');

    var img = new Image();
    img.src = $$BASE_URL + "/boggle.jpg";
    startGameButton.appendChild(img);
    startGameButton.appendChild(doc.createElement('br'));
    startGameButton.appendChild(doc.createTextNode('Start Game'));
    startGameButton.onclick = function () {
      try {
        startGame();
      } catch (err) {
        if (console && console.log) {
          console.log(err);
        }
        alert(err);
      }
    };

    var challengeButton = doc.createElement('button');
    img = new Image();
    img.src = $$BASE_URL + "/gauntlet.jpg";
    challengeButton.appendChild(img);
    challengeButton.appendChild(doc.createElement('br'));
    challengeButton.appendChild(doc.createTextNode('Challenge!'));
    challengeButton.onclick = startChallenge;

    gameDiv.appendChild(startGameButton);
    gameDiv.appendChild(doc.createElement('br'));

    //gameDiv.appendChild(challengeButton);
    //gameDiv.appendChild(doc.createElement('br'));
    //jjz
    if (supports_html5_storage()) {
      var loadDictButton = doc.createElement('button');
      if (!supports_html5_storage()) {
        loadDictButton.appendChild(doc.createTextNode("This browser can't load the dictionary"));
        loadDictButton.disabled = true;
      } else if (frozenDict !== null) {
        loadDictButton.appendChild(doc.createTextNode('Erase Dictionary'));
        loadDictButton.onclick = function () {
          var ans = window.confirm("Are you sure you want to erase the dictionary?");
          if (ans) {
            localStorage.removeItem("jsgames_worddict");
            window.location.reload();
          }
        }
        
      } else {
        loadDictButton.appendChild(doc.createTextNode('Load the Dictionary'));
        loadDictButton.onclick = function () {
          window.location = $$BASE_URL + "/load_dictionary.html";
        }
      }

    }


    gameDiv.appendChild(loadDictButton);
  }

  function startChallenge() {
    var ta = doc.getElementsByName("vqxsp")[0];
    var form = findElementParentNode(ta, 'form');

    var o = [];

    //jjz
    o[o.length] = "This player has challenged others to play with them.";
    o[o.length] = "<br>&nbsp;<br>";
    o[o.length] = "You must be in game mode to accept.  If you are not in game ";
    o[o.length] = "mode, then clicking will do nothing.";
    o[o.length] = "<br>&nbsp;<br>";
    o[o.length] = formatStr("<span class='challenge' id='start_{0}_{1}_{2}'>Accept Challenge</span>", doc.getElementsByName("vqxha")[0].value, // Player Name
    getSoiTimeStamp(), // SOI Time stamp
    +
    new Date() // Real time stamp
    );

    ta.value = o.join("");
    form.submit();
  }

  function startGame(userName, soiTime, jsTime) {
    gameDiv.innerHTML = "";

    var challengeWaitTime = 2 * 60 * 1000;
    var jsSoiTime = soiTime * 1000;

    function runGame() {
      gameDiv.innerHTML = "";
      shakeBoard();
      showBoard();
    }

    function waitForGame() {
      gameDiv.innerHTML = "";

      //for (var ii = 0; ii < 10; ii++) {
      //  gameDiv.innerHTML += goodRandom() + "<br>";
      //}
      //return;
      gameDiv.innerHTML = "";
      var now = (+new Date) - SOIjstimeDifference;
      var timeToStart = jsSoiTime + challengeWaitTime;
      var secs = Math.floor((timeToStart - now) / 1000);


      if (secs < 0) {
        alert("That challenge already started.");
        return;
      }

      gameDiv.innerHTML = "<h2>The new game will start in " + formatSeconds(secs) + "</h2><br>" + "now = " + new Date(now) + "<br>" + "timeToStart = " + new Date(timeToStart) + "<br>" + "jsSoiTime = " + new Date(jsSoiTime) + "<br>" + "SOIjstimeDifference" + (SOIjstimeDifference / 60 / 1000) + "<br>" + "Keys = " + [userName, soiTime, jsTime].join(" ");

      if (secs < 2) {
        runGame();
      } else {
        window.setTimeout(waitForGame, 500);
      }
    }

    if (!userName) {
      goodRandom = new Alea();
      runGame();
    } else {
      goodRandom = new Alea(userName, soiTime, soiTime);
      waitForGame();
    }

  }

  return {
    init: init,
    startGame: startGame
  };

}());



// From http://baagoe.com/en/RandomMusings/javascript/
function Alea() {
  return (function (args) {
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    if (args.length == 0) {
      args = [+new Date];
    }
    var mash = Mash();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < args.length; i++) {
      s0 -= mash(args[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(args[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(args[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;

    var random = function () {
        var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
        s0 = s1;
        s1 = s2;
        return s2 = t - (c = t | 0);
      };
    random.uint32 = function () {
      return random() * 0x100000000; // 2^32
    };
    random.fract53 = function () {
      return random() + (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Alea 0.9';
    random.args = args;
    return random;

  }(Array.prototype.slice.call(arguments)));
};

// From http://baagoe.com/en/RandomMusings/javascript/
// Johannes Baagøe <baagoe@baagoe.com>, 2010
function Mash() {
  var n = 0xefc8249d;

  var mash = function (data) {
      data = data.toString();
      for (var i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        var h = 0.02519603282416938 * n;
        n = h >>> 0;
        h -= n;
        h *= n;
        n = h >>> 0;
        h -= n;
        n += h * 0x100000000; // 2^32
      }
      return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
    };

  mash.version = 'Mash 0.9';
  return mash;
}

function formatStr() {
  var args = arguments;
  var st = args[0];

  return st.replace(/\{\{|\}\}|\{(\d+)\}/g, function (m, n) {
    if (m == "{{") {
      return "{";
    }
    if (m == "}}") {
      return "}";
    }
    return args[+n + 1];
  });
};

function formatSeconds(t) {
  var sign = "";
  if (t < 0) {
    t = -t;
    sign = "-";
  }
  var s = t % 60;
  var m = Math.floor(t / 60);

  if (s < 10) {
    s = '0' + s;
  }
  return sign + m + ":" + s;
}


function supports_html5_storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}


function hasClass(ele, cls) {
  return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}