<?php

$top = <<<EOF
<style type="text/css">
body {background: #004444; }

form a {
  background-color:#155;
  text-decoration: none !important;
  border: 1px solid black;
  line-height: 1.5;
  white-space: nowrap;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.dice_data {
  display: none;
}

.diceStatus {position: fixed;
 top: 0px;
 left: 0p;
 background: blue;
color: yellow;
}
table.dice_tbl, table.dice_tbl td  {
  border: 1px solid black;
}

.die {
  float: left;
  margin-right: 1em;
}

div.background
  {
  width:100%;
/*  height:100%; */
  background:url(http://soiroom.hyperchat.com/dice/dicebg.gif) repeat;
  border:2px solid black;
  }
div.transbox
  {
  width:90%;
/*  height:100%; */
  margin: auto;
  background-color:#044;
  border:1px solid black;
/*  filter:alpha(opacity=90); */
  opacity:0.9;
  color: white;
  padding-left: 1em;
  padding-right: 1em;
  }

.gamelord {
  filter:alpha(opacity=30); 
  opacity:0.3;
}

span.but {
  border: 1px solid black;
  background: silver;
  color: black;
}

.scoreButton {
  width:100%;
  text-align:right;
}

.cheatnote {
  background-color: black;
  color: yellow;
}

div.infob {
  background:url(http://soiroom.hyperchat.com/dice/dicebg.gif) repeat;
}
div.info {
  background-color:#144;
  filter:alpha(opacity=80);
  opacity:0.8;
  border:4px ridge black;  
  color: white;
}

#gameBoard td {
  background-color:#033;
}

span.hint {
  font-size: 75%;
  border: 1px solid black;
  /*  background-color: black; */
  color: yellow;
 /* float: left; */
  cursor: pointer; 
  cursor: hand;
}

ol.nav {
list-style-type: none;
text-align: left;
}

ol.nav li {
width: 100%;
}

</style>

<div class="background">
<div class="transbox">


<div class="info">
<h2 style="margin-left: auto; margin-right:auto">Welcome to the new Javascript Game Room</h2>
<p>Brought to you by the madness of Athelon AKA Lord of the Dice.</p>

<p><i style="background-color: black">Not a pick-up room.</i>  If someone continues to hit on you after you've asked them to stop, please let one of the GameLords know.</p>

</div>

<!--
<script type="text/javascript" src="http://soiroom.hyperchat.com/jsgames/gameroomprep.js"></script>
-->
<script type="text/javascript" src="/fakesoi/rooms/jsgames/jsgames/gameroomprep.js"></script>
EOF;

$bot = <<<EOF
</div> <!--  transbox -->
</div> <!-- background -->
EOF;

$roomDetails = array (
  "color_link" =>  "yellow",
  "background" => "rooms/gtest/CM.JPG",
  "color_bgcolor" => "#004444",
  "color_text" => "white",
  "color_vlink" => "cyan",
  "color_alink" => "white",
  
  "roomname" => "Games in Javascript",
  "room_desc" => "Games in Javascript for SOI",
  "room_short" => "jsgames",
  "room_tail" => "priv",
  
  "room_top" => $top,
  "This is Athelon's private playground where he can test things as he needs" .
  "to without worrying about filling up his rooms at SOI.",

  "room_left" => "<strong>Does not work in Internet Explorer 6 or 7 for some reason.</strong><br>If you are running IE7, you can run IE8.  If you are running IE6 -- you shouldn't be.",
  "room_bottom" => $bot,
  "room_under" => "<a href=http://grail.sourceforge.net/demo/yahtzee/rules.html>Quick guide on how to play</a><br><font size=-1>Quote: <font color=darkred>marrk</font> said to <font color=navy>-=[<font color=silver>Lord of t<b></b>he Dice</font>]=-</font>:      Ohhh they know. <br><br>They <i>[the dice]</i> toy with us like the Gods of Olympus toyed with the humans.<br><br>They know, and they tease and then WHAM.. they knock all the wind out of your sails. </font>"
);
?>