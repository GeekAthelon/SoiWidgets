<?php

$top = <<<EOF
This is a test of a map system

<div id="map_edit_directions">&nbsp;</div>

<img id="map_image" src="/fakesoi/rooms/map/map_beware.jpg">
EOF;

$bot = <<<EOF
<script src="/fakesoi/rooms/map/map_show.js"></script>

<style>
  #mapEditBox {
    position: absolute;
	border: 2px solid black;
	background-color: black;
	margin-left: 0.25em;
	margin-right: 0.25em;
	color: yellow;
	zoom: 1;
	/* 
	filter: alpha(opacity=50);
	opacity: 0.50;	
	*/
  }


  .mapText {
    position: absolute;
	border: 2px solid black;
	background-color: black;
	margin-left: 0.25em;
	margin-right: 0.25em;
	color: white;
	zoom: 1;
	filter: alpha(opacity=50);
	opacity: 0.50;	
  }

  a.mapText {
    text-decoration: none !important;
  }  
  
  .mapText:hover {
	filter: alpha(opacity=99);
	opacity: 0.99;	
  
  }
</style>

EOF;

$roomDetails = array (
  "color_link" =>  "yellow",
  "background" => "rooms/gtest/CM.JPG",
  "color_bgcolor" => "navy",
  "color_text" => "white",
  "color_vlink" => "green",
  "color_alink" => "olive",
  
  "roomname" => "Test Map Room",
  "room_desc" => "Test Map Room",
  "room_short" => "map",
  "room_tail" => "priv",
  
  "room_top" => $top,

  "room_left" => "",
  "room_bottom" => $bot,
  "room_under" => ""
);
?>