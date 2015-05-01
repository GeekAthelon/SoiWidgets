<?php

$top = <<<EOF


<style>
</style>

<script type="text/html" id="ath-info">
	A brutish and borish man, all truthfully told. 
	A brutish and borish man, all truthfully told. 
	A brutish and borish man, all truthfully told. 
	A brutish and borish man, all truthfully told. 
	A brutish and borish man, all truthfully told. 
	A brutish and borish man, all truthfully told. 
	A brutish and borish man, all truthfully told. 
	A brutish and borish man, all truthfully told. 
	A brutish and borish man, all truthfully told. 
	A brutish and borish man, all truthfully told. 
	A brutish and borish man, all truthfully told. 
</script>

<script type="text/html" id="unregistered-info">
  Who are you?  You've not been registered with a flair.
</script>


EOF;


$bot = <<<EOF

   <script type="text/javascript" src="http://76.188.44.119/fakesoi/rooms/flair/flair-config.js"></script>
   <script type="text/javascript" src="http://76.188.44.119/fakesoi/rooms/flair/flair.js"></script>
   <link rel="stylesheet" type="text/css"  href="http://76.188.44.119/fakesoi/rooms/flair/flair-style.css">
   
    <!--	
	  <script type="text/javascript" src="http://soiroom.hyperchat.com/chatplus/flair.js"></script>
	  <script type="text/javascript" src="http://soiroom.hyperchat.com/testdice/flair-config.js"></script>	
      <link rel="stylesheet" type="text/css"  href="http://soiroom.hyperchat.com/testdice/flair-style.css">
    -->
EOF;

$roomDetails = array (
  "color_link" =>  "brown",
  "background" => "",
  "color_bgcolor" => "#c09060",
  "color_text" => "brown",
  "color_vlink" => "brown",
  "color_alink" => "brown",
  
  "roomname" => "Flair Testing",
  "room_desc" => "Flair Testing",
  "room_short" => "flair",
  "room_tail" => "priv",
  
  "room_top" => $top,

  "room_left" => "",
  "room_bottom" => $bot,
  "room_under" => ""
);
?>