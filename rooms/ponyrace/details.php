<?php

$top = <<<EOF
<table width="85%" border="2" cellpadding="7" cellspacing="2"  background="http://soiroom.hyperchat.com/ponyrace/celloutside.jpg"><tr>
<td width="100%">

<center><table width="100%" border="3"  cellpadding="3" cellspacing="3" background="http://soiroom.hyperchat.com/iannex/brownbgborder.jpg"><tr>
<td width="100%">

<center><table width="100%" border="3"  cellpadding="7" cellspacing="3" background="http://soiroom.hyperchat.com/ponyrace/celloutside.jpg"><tr>
<td width="100%">

<center><table width="100%" border="2" cellpadding="2" cellspacing="2" background="http://soiroom.hyperchat.com/ponyrace/printarea.jpg"><tr>
<td width="100%"><br><br>

<center>

<img src=http://lh4.googleusercontent.com/-M81N7U3PS2U/Uxir6BFlzpI/AAAAAAAAG9E/2oDQeitAp-Q/w870-h495-no/HomeandTrainingandRaceGrounds.jpg><br><br>

<center>

The grounds of Our home with racetrack to the lower left, training barn and stables behind.<br>
Master, Mistresses and their ponies are welcome to come stay, train and race here.<br><br>

To race Your pony you must roll the die. <img src=http://ssom1.hyperchat.com/images/systemxxx/d6.jpg><br><br>  

To roll type < roll die > but close the spaces. <br><br>

As there is no score machine as yet, You must manually keep score.<br><br>

This room is for pony training and racing.<br>
Please take chat to the <a href="som1.cgi?EParms=ru%7Ckqw29teplahkjDwkm%22ru%7Cvk9mejja%7CDwkm%22ru%7Cle9eplahkj&vqvbs=wvQPeveOhxdDykQLwzvDhLhNzLPyOLxFwLeDvLvLOLFPOLNDPLFLD&vqxti=1394511218#newtalk">annex</a> and scenes to the <a href="som1.cgi?EParms=ru%7Ckqw29teplahkjDwkm%22ru%7Cvk9sahhqwa`Dwkm%22ru%7Cle9eplahkj&vqvbs=wvQPeveOhxdDykQLwzvDhLhNzLPyOLxFwLeDvLvLOLFPOLNDPLFLD&vqxti=1394511218#newtalk">dungeon</a>.<br><br>

<button id="pony-start-button" type="button">Show Race Panel</button>

<style>

.pony-race-track-run {
  display: block;
  float: left;
  width: 100%;
  color: #cf9f6f;
  background-color: #cf9f6f;
  border-left: 2px solid black
}

.pony-race-track-left {
  display: block;
  float: left;
  width: 100%;
  color: gray; 
  background-color: gray; 
  border-right: 2px solid black
}


#pony-race-panel {
  text-align: left;
  width: 600px;
  border: 2px solid #cf9f6f;
}

#pony-race-panel button {
  display: block;
  width: 100%;
}
</style>

<div id="pony-race-panel" style="display: none">

  <div id="pony-race-panel-racers">
  Racers!
  </div>
  
  <div id="pony-race-start-panel" style="display: none">
    <div id="pony-race-start-panel-list"></div>
		
	<label>Race Length:
	  <select name="pony-race-start-panel-length">
  	  <option value="10">10 - Very short race</option>
	  <option value="30">30 - Medium race</option>
	  <option value="50">50 - Long race</option>
	  <option value="100">100 - Ain't nobody got time for dat!</option>
	</select>
	</label>
	
    <button type="button" id="pony-race-start-panel-start">Start!</button>
    <button type="button" id="pony-race-start-panel-cancel">Cancel</button>
  </div>

  <div id="pony-race-start-init" style="display: none">
    <button type="button" id="pony-race-panel-start">Start a new race</button>
    <button type="button" id="pony-race-panel-post">Post Scores</button>
  </div>
</div>

EOF;



$bot = <<<EOF

<script>
  (function () {
    function forceReload() {
      var form = document.getElementsByName("vqxsp")[0].form;
      form.submit();
    }

    try {
      var v = sessionStorage.getItem("pony-race-show-controls");
      if (v === "true") {
        document.write("<script type='text/javascript' src='rooms/ponyrace/ponyrace.js'><\/script>");
        document.getElementById("pony-start-button").innerHTML = "<span>Hide race panel</span>";
      }
    } catch (e) {
	  // Ignore the error entirely.
	}

    var but = document.getElementById("pony-start-button");
    var inError = false;

    but.onclick = function () {
      try {
        var v = sessionStorage.getItem("pony-race-show-controls");
        var n = "true"
        if (v === "true") {
          n = "false";
        }
        sessionStorage.setItem("pony-race-show-controls", n);
      } catch (e) {
        inError = true;
        alert("Your browser don't seem to support sessionStorage, or it has been disabled.");
      }

      if (!inError) {
        forceReload();
      }

    };
  }());

</script>

EOF;

$roomDetails = array (
  "color_link" =>  "brown",
  "background" => "",
  "color_bgcolor" => "#c09060",
  "color_text" => "brown",
  "color_vlink" => "brown",
  "color_alink" => "brown",
  
  "roomname" => "Pony Race",
  "room_desc" => "Pony Races!",
  "room_short" => "ponyrace",
  "room_tail" => "priv",
  
  "room_top" => $top,

  "room_left" => "",
  "room_bottom" => $bot,
  "room_under" => ""
);
?>