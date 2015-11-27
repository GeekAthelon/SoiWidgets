<?php
$rnd = rand();

// http://enjoycss.com/qI0/code/#text

$top = <<<EOF

<style>


.question-card {
  /* height: 20em; */
  width: 90%;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  /* padding: 20px; */
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

.danswer-card {
  text-align: left;
  width: 90%;
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
  width: 100%;
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


.answer-card-marker-home {
  float: left;
  width: 1.5em;
  background-color: #A0A0A0;
  color: #050505;
  text-align: center; 
  -moz-border-radius: 15px;
  border-radius: 15px;
  margin-right: 0.5em;
}

.answer-card-text {
  float: left;
  width: 95%;
}


</style>

<div id='game-div'>

	<div class="question-card">
	Blame the Cards
	<hr>
	<p>Waiting to see if Athelon's computer is alive.</p>
	<p>
	  If this takes more than a few seconds, there is
	  either a network issue or Athelon's computer isn't
	  running.  Either way, nothing you can do about
	  it.
	</p>
	
	</div>
</div>

<script type='text/html' id='answer-template'>
  <button class="danswer-card">
     <div class="answer-card-marker-home">
	   <div class="answer-card-marker-span">&nbsp;</div>
	 </div>
	 <div class="answer-card-text"></div>
  </button>
</script>

<script type='text/html' id='question-template'>
	<div class="question-card">
		 <div class="question-card-text"></div>
		 <button class="question-card-clear-answers">Clear answers</button>
		 &nbsp;
		 <button class="question-card-play-answers">Play this hand</button>
		 &nbsp;
		 <span>
		    Next question in 
			<strong class="question-card-time-left">XXX</strong>
			seconds.
		 </span>
	</div>
</script>


<div style='clear:both'></div>


EOF;



$bot = <<<EOF
<script src="http://76.188.44.119:4242/client.js?bust=5&zbust={$rnd}"></script>
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