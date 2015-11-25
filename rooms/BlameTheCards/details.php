<?php
$rnd = rand();

// http://enjoycss.com/qI0/code/#text

$top = <<<EOF

<style>

.zoom-tilt {
  -webkit-transition:all 0.3s ease-out;
  -moz-transition:all 0.3s ease-out;
  -ms-transition:all 0.3s ease-out;
  -o-transition:all 0.3s ease-out;
  transition:all 0.3s ease-out;
}

.zoom-tilt:hover {
  -webkit-transform:rotate(5deg) scale(1.3);
  -moz-transform:rotate(5deg) scale(1.3);
  -ms-transform:rotate(5deg) scale(1.3);
  -o-transform:rotate(5deg) scale(1.3);
  transform:rotate(5deg) scale(1.3);
}

.question-card {
  float: left;
  height: 20em;
  width: 10em;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  width: 160px;
  padding: 20px;
  overflow: hidden;
  border: none;
  -webkit-border-radius: 12px;
  border-radius: 12px;
  font: normal 16px/1 "Lucida Console", Monaco, monospace;
  line-height: 1.5em;
  color: rgba(255,255,255,1);
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  background: #050505;
  -webkit-box-shadow: 7px 7px 9px 5px rgba(0,0,0,0.3) ;
  box-shadow: 7px 7px 9px 5px rgba(0,0,0,0.3) ;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.2) ;
  -webkit-transition: opacity 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;
  -moz-transition: opacity 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;
  -o-transition: opacity 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;
  transition: opacity 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;
}
.answer-home {
float: left;

  width: 25em;
}

.danswer-card {
width: 100%;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  /* width: 160px; */
  padding: 20px;
  overflow: hidden;
  border: none;
  -webkit-border-radius: 12px;
  border-radius: 12px;
  font: normal 16px/1 "Lucida Console", Monaco, monospace;
  line-height: 1.5em;
  color: rgba(05,05,05,1);
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  background: #FFFFFF;
  -webkit-box-shadow: 7px 7px 9px 5px rgba(0,0,0,0.3) ;
  box-shadow: 7px 7px 9px 5px rgba(0,0,0,0.3) ;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.2) ;

  }

.answer-card {
  float: left;
  height: 10em;
  width: 10em;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  width: 160px;
  padding: 20px;
  overflow: hidden;
  border: none;
  -webkit-border-radius: 12px;
  border-radius: 12px;
  font: normal 16px/1 "Lucida Console", Monaco, monospace;
  line-height: 1.5em;
  color: rgba(05,05,05,1);
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  background: #FFFFFF;
  -webkit-box-shadow: 7px 7px 9px 5px rgba(0,0,0,0.3) ;
  box-shadow: 7px 7px 9px 5px rgba(0,0,0,0.3) ;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.2) ;
  -webkit-transition: opacity 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;
  -moz-transition: opacity 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;
  -o-transition: opacity 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;
  transition: opacity 200ms cubic-bezier(0.42, 0, 0.58, 1) 10ms;
}


</style>

<div id='game-div'>

	<div class="question-card">
	Blame the Cards
	<hr>
	Waiting to see if Athelon's computer is alive.
	</div>
</div>

<div style='clear:both'></div>


EOF;

$bot = <<<EOF
<script src="http://127.0.0.1:1702/SoiWidgets/rooms/BlameTheCards/code/build/client/btc-client.js?bust={$rnd}"></script>
EOF;

$roomDetails = array (
  "color_link" =>  "yellow",
  "background" => "rooms/gtest/CM.JPG",
  "color_bgcolor" => "navy",
  "color_text" => "white",
  "color_vlink" => "green",
  "color_alink" => "olive",
  
  "roomname" => "Blame the Cards",
  "room_desc" => "Cards Against Humanity",
  "room_short" => "BlameTheCards",
  "room_tail" => "priv",
  
  "room_top" => $top,

  "room_left" => "",
  "room_bottom" => $bot,
  "room_under" => ""
);
?>