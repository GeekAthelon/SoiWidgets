(function () {
  "use strict";

  var $$_GAME;

  function showGame(game, mode) {

    mode = mode || "edit";
    if (!game || !game.racers) {
      return;
    }

    var i;
    var maxRoll = 0;
    var idList = [];

    // First, find out who has the most rolls entered.
    // Use that as the baseline when drawing out the grid.
    for (i = 0; i < game.racers.length; i++) {
      var player = game.racers[i];
      maxRoll = Math.max(maxRoll, player.rolls.length);
    }

    // And we'll be tacking on one to the end after that.
    maxRoll++;

    var html = "";
    var template;
    if (mode === "edit") {
      template = "<input value='##value##' id='##racer##_##turn##' size='1' style='width: 1.5em'>";
    } else {
      template = "<span style='width: 1.5em'>##value##</span>&nbsp;";
    }

    for (i = 0; i < game.racers.length; i++) {
      var line = "";
      var racer = game.racers[i];

      var score;

      var s = "";
      score = 0;
      for (var j = 0; j < maxRoll; j++) {

        s += template.replace("##racer##", racer.name);
        s = s.replace("##turn##", j);

        var id = racer.name + "_" + j;
        idList.push(id);

        var value = "";
        if (racer.rolls[j] !== undefined) {
          value = racer.rolls[j];
          score += +value;
        }
        s = s.replace("##value##", value);
      }

      var percent = Math.floor((score / game.raceLength) * 100);
      if (percent > 100) {
        percent = 100;
      }
	  
	  if (percent < 0) {
	    percent = 0;
	  }
	  
      var pad = 1;

      line = racer.name + "(";
      line += score + "/" + game.raceLength + ")" + ":&nbsp;";
      line += "<br>";

      if (mode === "show"  || true) {
        line += "<p>";

        if (percent >= pad) {
           line += "  <p style='width:" + (percent - pad) + "%' class='pony-race-track-run'>&nbsp;</p>";
		}
		
        if (percent <= 100-pad) {
          line += "  <p style='width:" + (100 - percent - pad) + "%' class='pony-race-track-left'>&nbsp;</p>";
        }
        line += "</p>";
      }

      line += "<p style='clear:both'>";
      line += s;
      line += "</p>";

      html += line + "<br>";
    }

    function handleBlur() {
      var id = this.id;
      var tmp = id.split("_");
      var name = tmp[0];
      var idx = tmp[1];

      for (var i = 0; i < game.racers.length; i++) {
        var racer = game.racers[i];
        if (racer.name === name) {
          racer.rolls[idx] = this.value;
        }
      }

      saveGame(game);
      showGame(game);
    }

    var inp;
    if (mode === "edit") {
      gebid("pony-race-panel-racers").innerHTML = html;

      for (i = 0; i < idList.length; i++) {
        inp = gebid(idList[i]);
        inp.onblur = handleBlur;

      }
    }

    if (mode === "show") {
      inp = gebn("vqxsp");
      inp.value += html;
      inp.form.submit();
    }
  }

  function loadGame() {
    var gameName = getStorageName();
    var s = sessionStorage.getItem(gameName);
    $$_GAME = JSON.parse(s);

    showGame($$_GAME);
  }

  function saveGame(game) {
    var gameName = getStorageName();
    var json = JSON.stringify(game);
    sessionStorage.setItem(gameName, json);
  }

  function getStorageName() {
    var roomName = gebn("vqxro").value;
    var gameName = "ponyrace_room_" + roomName;
    return gameName;
  }

  function show(id) {
    document.getElementById(id).style.display = "";
  }

  function hide(id) {
    document.getElementById(id).style.display = "none";
  }

  function gebn(name) {
    var el = document.getElementsByName(name);
    if (!el[0]) {
      return null;
    } else {
      return el[0];
    }
  }

  function gebid(id) {
    return document.getElementById(id);
  }

  loadGame();

  show("pony-race-panel");
  show("pony-race-start-init");

  gebid("pony-race-panel-post").onclick = function () {
    showGame($$_GAME, "show");
  };

  document.getElementById("pony-race-panel-start")
    .onclick = function () {
      var listHome = gebid("pony-race-start-panel-list");
      listHome.innerHTML = "";

      var options = gebn("vqvdy").options;
      var i;

      for (i = 0 + 2; i < options.length; i++) {
        var option = options[i];
        var txt = option.text;

        var id = "start-label-id-" + txt;
        var s = "";

        s += "<input name='pony-race-panel-start-check' type='checkbox' value='" + txt + "' id='" + id + "'>";
        s += "<label for='" + id + "'>";
        s += txt;
        s += "</label><br>";

        listHome.innerHTML += s;
      }

      show("pony-race-start-panel");
      hide("pony-race-start-init");

      gebid("pony-race-start-panel-start").onclick = function () {

        var e = gebn("pony-race-start-panel-length");
        var raceLength = e.options[e.selectedIndex].value;

        var game = {
          racers: [],
          raceLength: raceLength
        };
        var checks = document.getElementsByName('pony-race-panel-start-check');

        for (var i = 0; i < checks.length; i++) {
          var check = checks[i];

          if (check.checked) {
            var racer = {
              name: check.value,
              rolls: []
            };
            game.racers.push(racer);
          }
        }

        hide("pony-race-start-panel");
        show("pony-race-start-init");

        $$_GAME = game;
        showGame(game);
        saveGame(game);

      };

      gebid("pony-race-start-panel-cancel").onclick = function () {
        hide("pony-race-start-panel");
        show("pony-race-start-init");
      };

  };
}());