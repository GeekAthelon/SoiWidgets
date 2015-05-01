var labelList = [{
  room: "beware@bwr",
  desc: "Castle Beware",
  coords: "10,100",
  rotate: 90
},
{
  room: "none@bwr",
  desc: "ZeClare",
  coords: "20,200",
  rotate: 0
}
];


"use strict";
window.onload = prep;

// This needs to be all lower case
var $$_MAKERS = ['athelon', 'athelon@soi'];
var $$USER;
var $$MODE;

var labelHome;


function setElementPosition(element, left, top) {
  if (typeof element === "string") {
    element = document.getElementById(element);
  }
  var elementStyleRef = element.style;
  elementStyleRef.position = "absolute";

  var mod = (typeof elementStyleRef.top == 'string') ? "px" : 0
  elementStyleRef.top = top + mod;
  elementStyleRef.left = left + mod;
}


function getElementPosition(obj) {
  var curleft = 0;
  var curtop = 0;
  if (obj.offsetParent) {
    curleft = obj.offsetLeft
    curtop = obj.offsetTop
    while (obj = obj.offsetParent) {
      curleft += obj.offsetLeft
      curtop += obj.offsetTop
    }
  }
  return {
    left: curleft,
    top: curtop
  };
}

function prep() {
  $$MODE = "show";
  //$$USER = document.getElementsByName('vqxha')[0].value.toLowerCase();
  showNormalDirections();
  showLabels();
}

function createButton(text, func, tooltip, width) {
  var but = document.createElement("button");
  but.innerHTML = text;
  but.onclick = func;
  
  if (tooltip) {
    but.title = tooltip;
  }
  
  if (width) {
    but.style.width = width;
  }
  return but;
}

function noImp() {
  alert("Not implimented");
}

function activateEditor() {
  $$MODE = "edit";
  var but;
  var el = document.getElementById("map_edit_directions");
  el.innerHTML = "";

  but = createButton("Add a map point - Click here, then click on the map", addMapPoint);
  addDirectionButton(but);

  but = createButton("Generate Javascript", generateOut);
  addDirectionButton(but);

  showLabels(); // The map may have moved.
}

function addDirectionButton(but) {
  var el = document.getElementById("map_edit_directions");
  el.appendChild(document.createElement("br"));
  el.appendChild(but);
}

function showNormalDirections() {
  var el = document.getElementById("map_edit_directions");
  var but;
  el.innerHTML = "Move the mouse around the image to see area names.<br>Click on an area name to go there.";
  el.innerHTML = "<div style='font-size: 75%'>The map editor brought to you by Athelon<sup>@soi</sup>.</div>";

  //if ($$_MAKERS.indexOf($$USER) !== -1) {
    but = createButton("Click here to use editor", activateEditor);
    addDirectionButton(but);
  //}
}

function showLabels() {
  makeOrClearLabelHome();
  var picEl = document.getElementById("map_image");
  var pos = getElementPosition(picEl);

  var i = 0;
  var l = labelList.length;
  for (i = 0; i < l; i++) {
    showOneLabel(i, pos, labelList[i]);
  }
}


function makeOrClearLabelHome() {
  labelHome = document.getElementById("map_label_home");
  if (labelHome) {
    labelHome.parentNode.removeChild(labelHome);
  }

  labelHome = document.createElement("div");
  labelHome.id = "map_label_home";
  document.body.appendChild(labelHome);
}

function showOneLabel(idx, picpos, mapEntry) {
  var coords = mapEntry.coords.split(",")
  var offsetLeft = +coords[0];
  var offsetTop = +coords[1];
  var el;
  var left, top;
  var w, h;
  var bgEl;

  el = document.createElement("div");
  bgEl = document.createElement("div");

  var dot = document.createElement("div");
  dot.style.backgroundColor = "red";
  dot.style.width = "2px";
  dot.style.height = "2px";
  dot.className = "mapDot";
  
  el.className = "mapText";
  bgEl.className = "mapTextBackground";
  
  //el.className += " rotate"+ mapEntry.rotate;
  //bgEl.className += " rotate"+ mapEntry.rotate;
  
  el.id = "map_label_" + idx;
  el.appendChild(document.createTextNode(mapEntry.desc));
  
  if (mapEntry.rotate == 90)  { 
    el.innerHTML = mapEntry.desc.split("").join("<br>");
	el.className += " centerVert";
  } 
  
  bgEl.appendChild(document.createTextNode("---"));
  
  left = picpos.left + offsetLeft;
  top = picpos.top + offsetTop;  
  
  labelHome.appendChild(el);  
  labelHome.appendChild(bgEl);    
  labelHome.appendChild(dot);

  setElementPosition(dot, left, top);  

  h = parseInt(el.offsetHeight);
  w = parseInt(el.offsetWidth);
      
  setElementPosition(bgEl, left, top);      
  setElementPosition(el, left, top);
  el.onclick = handleNameClick;

  bgEl.style.width = w + "px";
  bgEl.style.height = h + "px";
  
  bgEl.title = [bgEl.style.left,bgEl.style.top].join(",");
  el.title = [el.style.left,el.style.top].join(",");
}

function handleNameClick(e) {
  if ($$MODE === "show") {
    e = e || window.event;    
    var target = e.target || e.srcElement;
    var idx = getIdxFromId(target.id);
    var mapEntry = labelList[idx];
    forceRoomJump(mapEntry.room);

  } else {
    handleMapEdit(e);
  }
}

function getTarget(e) {
  e = e || window.event;
  var target = e.target || e.srcElement;
  return target;
}

function getIdxFromId(id) {
  var idx = id.split("_")[2];
  return +idx;
}


function handleMapEdit(e) {
  function closeMapEdit() {
   var editDiv = document.getElementById('mapEditBox');
   if (editDiv && editDiv.parentNode) {
      editDiv.parentNode.removeChild(editDiv);
    }
  }

  function doneEdit(e) {
    closeMapEdit();
    showLabels();
  }

  function deleteLabel(e) {
    var idx = getIdxFromId(target.id);
    closeMapEdit();
    labelList.splice(idx, 1);
    showLabels();
  }

  function moveLabel(e, delta) {
    var idx = getIdxFromId(target.id);
    var mapEntry = labelList[idx];
    var coords = mapEntry.coords.split(",")
    var offsetLeft = +coords[0];
    var offsetTop = +coords[1];

    offsetLeft += delta.x;
    offsetTop += delta.y;
    mapEntry.coords = [offsetLeft, offsetTop].join(",");
    showLabels();
  }

  function moveRight(e) {
    moveLabel(e, {
      x: 1,
      y: 0
    });
  }

  function moveLeft(e) {
    moveLabel(e, {
      x: -1,
      y: 0
    });
  }

  function moveUp(e) {
    moveLabel(e, {
      x: 0,
      y: -1
    });
  }

  function moveDown(e) {
    moveLabel(e, {
      x: 0,
      y: 1
    });
  }


  function jerkRight(e) {
    moveLabel(e, {
      x: 10,
      y: 0
    });
  }

  function jerkLeft(e) {
    moveLabel(e, {
      x: -10,
      y: 0
    });
  }

  function jerkUp(e) {
    moveLabel(e, {
      x: 0,
      y: -10
    });
  }

  function jerkDown(e) {
    moveLabel(e, {
      x: 0,
      y: 10
    });
  }

  function rotateLabel(e, dr) {
    var idx = getIdxFromId(target.id);
    var mapEntry = labelList[idx];
    mapEntry.rotate = dr;
    showLabels();
  }
  function rotate0(e) {
    rotateLabel(e, 0);
  }
  function rotate90(e) {
    rotateLabel(e, 90);
  }
  function rotate180(e) {
    rotateLabel(e, 180);
  }
  function rotate270(e) {
    rotateLabel(e, 270);
  }


  function change(e) {
    var idx = getIdxFromId(target.id);
    var mapEntry = labelList[idx];
    getEntry(mapEntry)

    closeMapEdit();
    showLabels();
  }

  e = e || window.event;
  var but;
  var target = e.target || e.srcElement;

  var pos = getElementPosition(target);

  closeMapEdit();
  var editDiv = document.createElement("div");
  editDiv.id = 'mapEditBox';
  document.body.appendChild(editDiv);
  setElementPosition(editDiv, pos.left + 10, pos.top + 30);

  but = createButton("Delete", deleteLabel, "Delete this item", "100%");
  editDiv.appendChild(but);

  editDiv.appendChild(document.createElement("br"));

  but = createButton("\u2190", moveLeft, "Move left one pixel", "25%");
  editDiv.appendChild(but);
  but = createButton("\u2192", moveRight, "Move right one pixel", "25%");
  editDiv.appendChild(but);
  but = createButton("\u2191", moveUp, "Move up one pixel", "25%");
  editDiv.appendChild(but);
  but = createButton("\u2193", moveDown, "Move down one pixel", "25%");
  editDiv.appendChild(but);

  editDiv.appendChild(document.createElement("br"));
  but = createButton("\u21D0", jerkLeft, "Move left 10 pixels", "25%");
  editDiv.appendChild(but);
  but = createButton("\u21D2", jerkRight, "Move right 10 pixels", "25%");
  editDiv.appendChild(but);
  but = createButton("\u21D1", jerkUp, "Move up 10 pixels", "25%");
  editDiv.appendChild(but);
  but = createButton("\u21D3", jerkDown, "Move down 10 pixels", "25%");
  editDiv.appendChild(but);

  
  editDiv.appendChild(document.createElement("br"));
  but = createButton("Horizontal", rotate0, "Rotate text to 0\u00B0", "50%");
  editDiv.appendChild(but);
  but = createButton("Vertical", rotate90, "Rotate text to 90\u00B0", "50%");
  editDiv.appendChild(but);
  /*
  but = createButton("180\u00B0", rotate180, "Rotate text to 180\u00B0", "25%");
  editDiv.appendChild(but);
  but = createButton("270\u00B0", rotate270, "Rotate text to 270\u00B0", "25%");
  editDiv.appendChild(but);
*/
  
  editDiv.appendChild(document.createElement("br"));
  but = createButton("Change", change, "Change description or target room", "100%");
  editDiv.appendChild(but);

  editDiv.appendChild(document.createElement("br"));
  but = createButton("Close", doneEdit, "Close this box", "100%");
  editDiv.appendChild(but);

  editDiv.appendChild(but);
}


function addMapPoint() {
  var picEl = document.getElementById("map_image");
  var pos = getElementPosition(picEl);
  var outOfRange = false;
  
  function handeClick(e) {
    outOfRange = false;
    document.body.onclick = null;

    var o = {
      room: "roomname",
      desc: "Desc",
      coords: "1,1"
    };

    var coords = getAbsoluteMouseClickCoords(e);
    coords.left -= pos.left;
    coords.top -= pos.top;
        
    o.coords = [coords.left, coords.top].join(",");
    getEntry(o);
	
    labelList.push(o);
    showLabels();
  }

  function attachHandler() {
    document.body.onclick = handeClick;
  }

  // Chrome gets over eager and sees the body click as soon
  // as we define the handler ... so give some breathing space.
  window.setTimeout(attachHandler, 1);
}

function getAbsoluteMouseClickCoords(e) {
  var posx = 0;
  var posy = 0;
  if (!e) var e = window.event;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }

  return {
    left: posx,
    top: posy
  };
}

function getEntry(mapEntry) {
  var s;

  s = window.prompt("Description of area", mapEntry.desc);
  if (s) {
    mapEntry.desc = s;
  }

  s = window.prompt("Links to room", mapEntry.room);
  if (s) {
    mapEntry.room = s;
  }
}

function generateOut() {
  var o = JSON.stringify(labelList, undefined, 2);
  document.write("<pre>labelList = " + o + ";");
}

function forceRoomJump(room) {
  // Normally we would *not* be using hash.. we would be using
  // query, however -- query is broken under SOI so we 
  // shoe horn in what we can.

  var form = document.getElementById("formFind");
  var searchString = document.location.hash;
  searchString = searchString.substring(1);

  var nvPairs = searchString.split("&");
  var i;
  for (i = 0; i < nvPairs.length; i++)
  {
     var nvPair = nvPairs[i].split("=");
     var name = nvPair[0];
     var value = nvPair[1];
	 var el;
	 value = decodeURIComponent(value);	 
	 console.log([name, value]);
	 
	 el = form.elements.namedItem(name);
	 if (el) {
	   el.value = value;
	 }
  }
  form.elements.namedItem('vqxfi').value = room;
  form.submit();
  
}