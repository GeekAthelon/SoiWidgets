<?php

$top = <<<EOF
<style type="text/css">
body {background: #004444; }

div.transbox > a {
 /* display: none; */
}

span.hint {
  text-size: 75%;
  border: 1px solid black;
  background-color: black;
  color: yellow;
}


form a {
  background-color:#155;
}

.dice_data {display: none;}

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

span.debugmsg {
  color: cyan;
  font-size: smaller;
}

#gameBoard td {
  background-color:#033;
}
</style>

<style type="text/css">
div.transbox
{
  background-color:#135;
}
</style>

<div class="background">
<div class="transbox">
<p>If you wish to play Yahtzee, please use <span style="background: black">#r-dice@soi</span>.  This room is for <strong>testing</strong> and I am likely to suddenly change things at <strong>any</strong> time.  I might not even check if the room is in use before I do.

Things in here may go from working to not working at any time.</p>

<br>

<a name="dicehash"></a>
<form id="diceform" action="#" onsubmit="return false;">
<div id="dicepanel">
</div>
</form>

<div style="clear:both">
  <div id="gameBoard"> </div>
</div>
<div id="diceStatus"> </div>
EOF;

$bot = <<<EOF
</div> <!--  transbox -->
</div> <!-- background -->

<script type="text/javascript" src="rooms/dice/dice/dice.js"></script>
EOF;

$roomDetails = array (
  "color_link" =>  "yellow",
  "background" => "rooms/gtest/CM.JPG",
  "color_bgcolor" => "navy",
  "color_text" => "white",
  "color_vlink" => "green",
  "color_alink" => "olive",
  
  "roomname" => "The Dice Room -- Testing room",
  "room_desc" => "Multiplayer Yahtzee Testing Room -- Use #r-dice@soi for actual games. -- Same password as the our cork.",
  "room_short" => "dice",
  "room_tail" => "priv",
  
  "room_top" => $top,
  "This is Athelon's private playground where he can test things as he needs" .
  "to without worrying about filling up his rooms at SOI.",

  "room_left" => "<div style=text-align: right><font size=+2>Post</font> in the room or the game can't find you! <br>Really, it won't work otherwise.<br><br>Questions? Comments?  Best place is #r-chatplus@soi(on my cork).</div><br><a href=http://soiroom.hyperchat.com/dice/help.html>Want to help?</a>",
  "room_bottom" => $bot,
  "room_under" => "<a href=http://grail.sourceforge.net/demo/yahtzee/rules.html>Quick guide on how to play</a><br><font size=-1>Quote: <font color=darkred>marrk</font> said to <font color=navy>-=[<font color=silver>Lord of t<b></b>he Dice</font>]=-</font>:      Ohhh they know. <br><br>They <i>[the dice]</i> toy with us like the Gods of Olympus toyed with the humans.<br><br>They know, and they tease and then WHAM.. they knock all the wind out of your sails. </font>"
);
?>