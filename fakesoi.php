<?php

//var_dump($_REQUEST);

$PHP_SELF = htmlspecialchars($_SERVER['PHP_SELF']);
$ROOM = isset_or($_REQUEST['vqxfi'], null);
$ROOM = isset_or($_REQUEST['vqxro'], $ROOM);
$spiritList = array();


$TIME = time();
$action = isset_or($_REQUEST['vqvaj'], '');
$action = isset_or($_REQUEST['vqvak'], $action);

$didTalk = isset_or($_REQUEST['vqxsp'], false);
if ($didTalk) {
  $action = "Talk/Listen";
}

if ($ROOM === null) {
  $action = "frontDoor";
}


define("DEFAULT_NAME", "Guest of Athelon");
define("DEFAULT_TAIL", "priv");

function formatTimeForPost($time) {
  //Fri Feb 10 21:29:14 *
  return strftime ("%a %b %d %H:%M:%S", $time);
}

function cleanStringForSpiritList($s) {
  $cleansedstring = preg_replace('/[^A-Za-z0-9@]/', '', $s);
  return $cleansedstring;
}

function getChatLogFileName($room) {
  $fn = "chat-logs/$room.log";
  return $fn;
}

function cleanString($s) {
  $cleansedstring = preg_replace('/[^A-Za-z0-9_@ ]/', '', $s);
  return $cleansedstring;
}

function mungString($s) {
  /*
   *  Yes, this is a heavy-handed and extremely brutish mung,
   *  but it mirrors what SOI does to the best I can.  I don't have a list
   *  of munged words, so I have to add as I go.
   *
   *  My filtered results aren't exactly the same as SOI's, but it should
   *  be good enough.
   *
   *  SOI will mount 'mouseover' to '*over'
   */
   $list = "onclick xmp onkeydown onmouseover onmouseout javascript:";

   $a = explode(" ", $list);
   foreach ($a as $word) {
     $s = str_replace($word, '*', $s);
   }
   return $s;
}

function makeClosingTags($html) {
  /*
   * Yes, this function is horrible in so many ways.
   * All I can say is, I'm trying to mimic what SOI does, both good and bad.
   */
   $out = array();
   preg_match_all("/\<.*?\>/m", $html, $tags);
   $tags = $tags[0];

   $l = count($tags);
   for ($i = 0; $i < $l; $i++) {
     $tag = $tags[$i];
     $tag = str_replace("<", "", $tag);
     $tag = str_replace(">", "", $tag);

     $tmp = explode(' ', $tag);
     $tag = $tmp[0];

	 if ($tag === "br") {
	   continue;
	 }

     if (strpos($tag, '/') === false) {
       $out[] = "</${tag}>";
     }
   }
   return implode(" ", $out);
}

function getUserDetails() {
  $x = new stdClass();
  $defaultFullname = DEFAULT_NAME . '@' . DEFAULT_TAIL;


  $fullname = isset_or($_REQUEST['vqxha'], DEFAULT_NAME);
  if (strpos($fullname , '@') === false) {
    $fullname .= '@' . DEFAULT_TAIL;
  }

  $tmp = explode('@', $fullname);
  $shortname = $tmp[0];
  if ($tmp[1] !== DEFAULT_TAIL) {
    $shortname .= '@' . $tmp[1];
  }

  $x->longName = $fullname;
  $x->shortname = $shortname;
  return $x;
}

function makeParms() {
  global $TIME;
  global $ROOM;
  $p = new stdClass();
  $user = getUserDetails();
  $p->roomsite = DEFAULT_TAIL;
  $p->vqxsq = "Unused";
  $p->vqxha = "Unused";
  $p->vqxti = floor($TIME / 100);
  $p->vqxus = cleanString($user->longName);
  $p->vqxha = cleanString($user->shortname);
  $p->vqxro = $ROOM;
  $p->on_auto = isset_or($_REQUEST['on_auto'], 'off');
  return $p;
}

function makeLink($extra) {
  global $PHP_SELF;
  $p = makeParms();

  $a = array_merge((array) $p, (array) $extra);

  $q = http_build_query($a, '', '&amp;');
  $r = $PHP_SELF . '?' . $q;
  return $r;
}


function ChatToHtml() {
  global $ROOM;
  global $spiritList;

  $fn = getChatLogFileName($ROOM);

  if (!file_exists ($fn)) {
    return "";
  }

  $txt = file_get_contents($fn);
  if (!$txt) {
    return "";
  }

  $out = "";

  $log = json_decode($txt);

  $len = isset_or($_REQUEST['vqxby'], 20);
  $len = min($len, count($log));

  for ($i = 0; $i < $len; $i++) {
    $entry = $log[count($log) - $i -1];
    $html = "";
    $html .= "<i>";
    $html .= formatTimeForPost($entry->time);
    $html .= "</i>";
    $html .= " <a href='#'>*</a>";
    $html .= "<br>";

    $html .= "<b>";     // SOI wraps things in double <b> elements
    $html .= "<b>";
    $name = $entry->from_name;

	if (!in_array ($name , $spiritList)) {
	  $spiritList[] = $name;
	}
    if ($entry->from_tail !== DEFAULT_TAIL) {
      $name .= "<sup>@" . $entry->from_tail . "</sup>";
    }
    $html .= $name;
    $html .= "</b>";


    if ($entry->to) {
      $html .= " <i>said to</i> <b>" . $entry->to . "</b>";
    } else {
       $html .= " <i>said</i>";
    }
    $html .= "</b>"; // END SOI wrapping
    $html .= ":";
    $text = $entry->text;
    $text = mungString($text);
    $closetags = makeClosingTags($entry->text);

    $text = str_replace("\r\n", "\r", $text);
    $text = str_replace("\r\r", "<p>", $text);
    $text = str_replace("\r", "<br>", $text);
    $text .= $closetags;


    $html .= "<blockquote>";
    $html .= $text;
    $html .= "</blockquote>";
    $html .= "<hr>";
    $out .= $html;
  }

  return $out;
}


function process() {
  global $PHP_SELF;
  global $ROOM;
  global $TIME;

  $fields = array();
  $user = makeParms();
  include "rooms/$ROOM/details.php";

  date_default_timezone_set('America/New_York');

  $fields['human_time'] = strftime ("%H:%M", $TIME);
  $fields['link_localcontrols'] = makeLink(array('mode' => 'rControl'));
  $fields['link_hotlist'] = makeLink(array('vqvaj' => 'showHot'));

  $fields['php_self'] = $PHP_SELF;

  $templateName = "templates/chatroom.html";
  $template = file_get_contents($templateName);

  $chat = ChatToHtml();
  $fields['room_body'] = $chat;

  $roomDetails['chat_entry_box'] = makeChatEntryBox($user);

  if ($user->on_auto === "on") {
    $fields['url_self'] = makeLink(array('on_auto' => 'on'));
    $fields['link_auto'] = makeLink(array('on_auto' => 'off'));
    $fields['link_auto_text'] = "Stop auto";
    $fields['header_refresh'] = makeHeaderRefresh();
  } else {
    $fields['url_self'] = makeLink(array('on_auto' => 'off'));
	$fields['link_auto'] = makeLink(array('on_auto' => 'on'));
    $fields['link_auto_text'] = "Auto";
    $fields['header_refresh'] = "";
  }

  $template = replaceFields($template, $roomDetails);
  $template = replaceFields($template, $user);
  $template = replaceFields($template, $fields);

  $template = replaceFields($template, $fields);
  print $template;
}


function processTalk() {
  global $ROOM;
  global $TIME;

  $text = $_REQUEST['vqxsp'];
  if ($text === "" || $text === null) {
    return;
  }
  $fn = getChatLogFileName($ROOM);
  $fp = fopen($fn, "a+");

  $nameToUse = $_REQUEST['vqxha'];
  if (strpos($nameToUse , '@') === false) {
    $nameToUse .= '@' . DEFAULT_TAIL;
  }

  $tmp = explode("@", $nameToUse);

  $newEntry = array();
  $newEntry['from_name'] = $tmp[0];
  $newEntry['from_tail'] = $tmp[1];
  $newEntry['time'] = $TIME;
  $newEntry['text'] = $text;
  $newEntry['to'] = $_REQUEST['vqxto'];

  if ($_REQUEST['vqvdy'] != "<==") {
    $newEntry['to'] = $_REQUEST['vqvdy'];
  }

  if (flock($fp, LOCK_EX)) { // do an exclusive lock
    $fileSize = filesize($fn);
	if ($fileSize > 0) {
      $txt = fread($fp,  filesize($fn));
	} else {
	  $txt = "";
	}

    if (!$txt || $txt === "") {
      $log = array();
    } else {
      $log = json_decode($txt);
    }
    ftruncate($fp, 0);

    array_push($log, $newEntry);
    fwrite($fp, json_encode($log));
    flock($fp, LOCK_UN); // release the lock
  } else {
    echo "Couldn't lock the file !";
  }
  fclose($fp);
}


switch($action) {
case "frontDoor":
  login();
  break;
case "showHot":
  makeHotList();
  break;
case 'Talk/Listen':
  processTalk();
  process();
  break;
case 'rControl':
  print 'Room Controls not yet in';
  break;
default:
  process();
}


function replaceFields($contents, $fields) {
  foreach ($fields as $key => $value) {
    $contents = str_replace("##" . $key . "##", $value, $contents);
  }
  return $contents;
}

function isset_or(&$check, $alternate = NULL) {
  return (isset($check)) ? $check : $alternate;
}

function makeChatEntryBox($user) {
  global $spiritList;

  $out = array();

  $l = count($spiritList);

  if ($user->on_auto === "off") {
    $out[] = 'From:<input name="vqxha" size="11" value="##vqxha##" type="text">';
    $out[] = 'To:<input name="vqxto" size="11" type="text">';
    $out[] = '<select name="vqvdy">';
    $out[] = '  <option selected="selected">&lt;==</option>';
    $out[] = '  <option>**The Room**</option>';

	for($i = 0; $i < $l; $i++) {
	  $name = $spiritList[$i];
	  $name = cleanStringForSpiritList($name);
	  $out[] = "  <option>$name</option>";
	}

    $out[] = '</select>';
    $out[] = 'Show:<input name="vqxby" size="3" value="20" type="text">';
    $out[] = '<br>';
    $out[] = '<textarea name="vqxsp" rows="4" cols="55" wrap="VIRTUAL"></textarea>';
    $out[] = '<br>';
  } else {
    $out[] = '<input type="hidden" name="on_auto" value="on">';
    $out[] = '<input type="hidden" name="vqxha" value="##vqxha##">';
  }

  return implode("\r", $out);
}

function makeHeaderRefresh() {
  $out = array();
  $out[] = '<meta http-equiv="Pragma" content="no-cache">';
  $out[] = '<meta http-equiv="refresh" content="24;URL=##url_self##">';
  return implode("\r", $out);
}


function makeHotList() {
  $user = makeParms();
  include "rooms/_control/details.php";

  $templateName = "templates/blank_file.html";
  $template = file_get_contents($templateName);

  $roomList = array("gtest", "dice", "dice2", "jsgames", "refresh", "map", "timewarp", "ponyrace", "flair", "BlameTheCards", "rtc");
  $out = array();

  $out[] = "<h1>The fake HOT list</h1>";
  $out[] = "<p>I know this isn't really a hot list, but one can navigate " .
  "the rooms here using it, so it will work.  Its the chat rooms that are " .
  "really important here.</p>";

  $out[] = "<ul>";
  for ($i = 0; $i < count($roomList); $i++) {
    $room = $roomList[$i];
	$url = makeLink(array('vqxro' => $room));

	$out[] = "<li>";
	$out[] = "<a href='$url'>$room</a>";
	$out[] = "</li>";
  }
  $out[] = "</ul>";

  $fields = array();
  $fields['body'] = implode(PHP_EOL, $out);


  $template = replaceFields($template, $roomDetails);
  $template = replaceFields($template, $fields);
  print $template;
}

function login() {
  $user = makeParms();
  include "rooms/_control/details.php";

  $templateName = "templates/blank_file.html";
  $template = file_get_contents($templateName);

  $roomList = array("gtest", "dice");
  $out = array();


  $out[] = <<< EOF
              <h1>This is not SOI</h1>
			  <p>This site kind of looks like SOI in some ways,
			  its a place that Athelon uses for testing, since he
			  can develop things so much faster here.</p>

			  <p>Be warned, there are <strong>no</strong> registered names here.<p>

              By what name art thou known here?
              <form action="##php_self###chatmark" method="POST">
              <input name="vqxsq" value="##vqxsq##" type="hidden">
              <input name="vqxha" value="##vqxha##" >
              <input name="vqxus" value="##vqxus##" type="hidden">
              <input name="vqxro" value="##vqxro##" type="hidden">
              <input name="ZZZ" value="Login" type="Submit">
			  <input name="vqvaj" value="showHot" type="Hidden">

            </form>
EOF;

  $z = array();
  $z['body'] = implode(PHP_EOL, $out);

  $template = replaceFields($template, $z);

  $template = replaceFields($template, $roomDetails);
  $template = replaceFields($template, $user);
  //$template = replaceFields($template, $fields);
  print $template;
}

?>
