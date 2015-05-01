var g_roomstuff;
var g_multiConfig;

var currentView;
var currentTab;

var configDetails = [
//{  "z_name": "THISROOM", "type": "text", "maxlength": 15, "desc": "Full room name, including @soi or @bwr tail."  },
{  "z_name": "locationColor", "type": "text", "maxlength": 15, "desc": "Text color of location messages"  },
//{  "z_name": "defaultView", "type": "text", "maxlength": 15, "desc": "The default view.  This will be the view people see when they first come into the room"  }
//{  "z_name": "Color", "type": "text", "maxlength": 15, "desc" : "Text color of location."  }
];



var multiDetails = [
{  "z_name": "rName", "type": "text", "maxlength": 80, "desc" : "Name of this view"  },
{  "z_name": "backgroundImage", "type": "text", "maxlength": 200, "desc" : "Full URL to background image for this view"  },
{  "z_name": "chatleft", "type": "textarea", "desc": "Room Text Left Side Chat Box"  },
{  "z_name": "underchat", "type": "textarea", "desc": "Room Text Under Chat Box"  },
{  "z_name": "roomtop", "type": "textarea", "desc": "Text for Top Level of Room"  },
{  "z_name": "roombottom", "type": "textarea", "desc": "Text for Bottom of Room"  }];

/////////////////////////////////////////////////////////////////////////////
if (!Array.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex)
  {
    if (!fromIndex) { fromIndex = 0; }
    
    // If fromIndex is less than zero it's an offset from the end
    if (fromIndex < 0) {
      fromIndex = (this.length + fromIndex <= 0) ? 0 : this.length - 1 + fromIndex;
    }
    
    // Make sure it's an object at the very least
    for (var i = fromIndex; i < this.length; i++)
    {
      if (this[i] === searchElement) {
        return i;
      }
    }
    return -1;
  };
}

/////////////////////////////////////////////////////////////////////////////

function lineToForm(l)
{
  var s = "";
  s += l.desc + " ";
  
  switch (l.type) {
  case "text":
    s += "<input type='text' ";
    s += " name='" + l.z_name + "' ";
    if (l.maxlength) s += " maxlength='" + l.maxlength + "' ";
    s += "><br>";
    break;
    
  case "textarea":
    s += "<br><textarea ";
    s += " name='" + l.z_name + "' ";
    s += "rows=" +  ((!l.rows) ?  5 : l.rows) + " ";
    s += "cols=" +  ((!l.cols) ? 100 : l.cols) + " ";
    s += "></textarea><br>";
    break;
  }
  return s;
}

function makeJSON()
{
  var jout = document.getElementById("json_out");
  var s="";
  
  getDataFromForm(g_multiConfig, configDetails, document.getElementById("chatedit"));
  
  s += "var multiConfig = " + JSON.stringify(g_multiConfig, null, "");
  s += "\n\n";
  
  s += "var roomstuff = " + JSON.stringify(g_roomstuff, null, "");
  
  jout.value = s;
}


function makeDefault()
{
  var s = '';
  s = 'var multiConfig = {};'
  + 'multiConfig.THISROOM = "CHANGETHIS@soi";'
  + 'multiConfig.locationColor = "red";'
  + 'multiConfig.locationBackground = "green";'
  + 'multiConfig.currentView = "";'
  + 'var roomstuff = {};roomstuff.rooms = {};';
  
  document.getElementById("imp_textarea").value = s;
}

function getDataFromForm(data, list, form)
{
  for (var k in list) {
    if (list.hasOwnProperty(k)) {
    var n = list[k].z_name;
    data[n] = form[n].value;
    }
  }
}

function fillForm(data, list, form)
{
  
  for (var k in list) {
    if (list.hasOwnProperty(k)) {
    var n = list[k].z_name;
    var v = (!!data[n] ? data[n] : "");
    form[n].value = v;
    }
  }
}

function fillEditForm(view)
{
  var room = g_roomstuff.rooms[view];
  fillForm(room, multiDetails, document.getElementById("roomedit"));
  currentView = view;
}


function jsonToForm(o)
{
  var s = "";;
  for (var key in o) {
    if (o.hasOwnProperty(key)) {
    s += lineToForm(o[key])
    s += "<br>";
    }
  }
  
  //s = s.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  document.write(s);
}


function emptyNode(el) {    
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

function saveView() {
  var room = g_roomstuff.rooms[currentView];
  
  getDataFromForm(room, multiDetails, document.getElementById("roomedit"));
}

function editView(v1) {
  showTab(3);
  var v;
  
  if(typeof v1 == "string") { 
    v = v1;
  } else {  
    v = this.className.split("_")[1];
  }
  
  fillEditForm(v);  
}

function prepViews() {
  var div = document.getElementById("viewlist");
  var views = g_roomstuff.rooms;
  var e;
  var s;
  var none = true;
  
  emptyNode(div);
  
  for (var k in views) {
    if (views.hasOwnProperty(k)) {
      none = false;
      s = "" + k;
      e = document.createElement("span");
      e.style.textDecoration = "underline";
      e.className = "edit_" + s;
      e.appendChild(document.createTextNode("[" + s + "]"));
      
      e.onclick = editView;
      
      div.appendChild(e);
      div.appendChild(document.createTextNode(" "));
    }
  }
  
  if (none) {
    e = document.createElement("i");
    e.appendChild(document.createTextNode("*none*"));
    div.appendChild(e);
  }
}

function importData()
{
  var j = document.getElementById("imp_textarea").value
  eval(j);
  
  g_roomstuff = roomstuff;
  g_multiConfig = multiConfig;
  
  fillForm(g_multiConfig, configDetails, document.getElementById("chatedit"));
}

function addDel() {
  var mode = getCheckedValue(document.forms["viewlistform"].addDelete);
  var view = document.forms["viewlistform"].viewName.value;
  
  if (view === "") {
    window.alert("View cannot be blank.");
  } else {   
    if (mode === "add") {
      if (g_roomstuff.rooms[view]) {
        alert("View '" + view + "' already exists.");
      } else {
        g_roomstuff.rooms[view] = {};
        editView(view);
      }
    } else {
      if (g_roomstuff.rooms[view]) {
        delete g_roomstuff.rooms[view];
        showTab(2);
      } else {
        alert("Cannot delete '" + view + "' if it isn't there.");
      }
    }
  }
  
  document.forms["viewlistform"].viewName.value = "";
}

function makeOrderTable() {
  
  function tBodyClick()
  {
    var s = this.className.split("_")[1];
    var action = this.className.split("_")[0];
    var n = +s;
    var tmp;
    
    action = action.toLowerCase();
    
    switch(action) {
    case "setdefault":
      g_multiConfig.defaultView = a1[n];
      break;
    case "down":
      tmp = a1[n];
      a1[n] = a1[n+1];
      a1[n+1] = tmp;
      break;
    case "up":
      tmp = a1[n];
      a1[n] = a1[n-1];
      a1[n-1] = tmp;
      break;
    }
    
    g_multiConfig.viewList = a1;    
    makeOrderTable();
  }
  
  
  function makeButton(str, cmd,  idx) {
    var button = document.createElement("button");
    button.appendChild(document.createTextNode(str));    
    button.className = cmd + "_" + idx;
    button.onclick =tBodyClick;
    
    return button;
  }
  
  var tbody = document.getElementById("view_tbody");
  var i;
  var arrayList1 = g_multiConfig.viewList;
  var views = g_roomstuff.rooms;
  var a1 = [];
  var s;
  var button;
  var len;
  
  var tr, td;
  
  if (arrayList1) {
    for (i = 0; i < arrayList1.length; i++) {
      s = arrayList1[i];
      if (views[s]) {
        a1.push(s);
      }
    }
  }
  
  for (s in views) {
    if (views.hasOwnProperty(s)) {
      if (a1.indexOf(s) === -1) {
        a1.push(s);
      }
    }
  }
  
  // Give them the current order.. they'll just have to deal with it.
  // (In reality, they shouldn't ever know the difference.  
  g_multiConfig.viewList = a1;
  
  if (!g_multiConfig.defaultView) {
    g_multiConfig.defaultView = a1[0];
  }
  
  emptyNode(tbody);
  
  len = a1.length;
  for (i = 0; i < a1.length; i++) {
    s = a1[i];
    tr = document.createElement("tr");
    
    td = document.createElement("td");
    button = makeButton("Up", "up", i);
    if (i === 0) { button.disabled = true; }
    td.appendChild(button);
    
    button = makeButton("Down", "down", i);
    td.appendChild(button);
    if (i === len-1) { button.disabled = true; }
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.appendChild(document.createTextNode(s));
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.appendChild(document.createTextNode(views[s].rName));
    tr.appendChild(td);
    
    td = document.createElement("td");
    button = makeButton("Make Default View", "setdefault", i);
    if (g_multiConfig.defaultView === s) { button.disabled = true; }
    td.appendChild(button);
    tr.appendChild(td);
    
    tr.appendChild(td);
    
    tbody.appendChild(tr);    
  }
  document.forms.chatedit.save_btn.disabled = false;
}


function showTab(x)
{
  var tabs = 8;
  var i;
  var tab;
  
  for (i = 0; i < tabs; i++) {
    tab = document.getElementById("step" + i);
    if (tab) {
      tab.style.display = "none";
    }
  }
  
  tab = document.getElementById("step" + x);
  if (tab) {
    tab.style.display = "";
  }

  switch(x) {
  case 2:
    prepViews();
    break;
  case 4:
    makeOrderTable();
    break;
  case 5:
    makeJSON();
    break;
  }  
  currentTab = x;
}

function doBack()
{
  switch (currentTab) {
  case 1:
  case 2:
    showTab(1);
    break;
  case 3:
  case 4:
    showTab(2);
    break;
  case 5:
    showTab(4);
    break;    
  }  
}

// return the value of the radio button that is checked
// return an empty string if none are checked, or
// there are no radio buttons
function getCheckedValue(radioObj) {
  if(!radioObj)
    return "";
  var radioLength = radioObj.length;
  if(radioLength == undefined)
    if(radioObj.checked)
    return radioObj.value;
  else
    return "";
  for(var i = 0; i < radioLength; i++) {
    if(radioObj[i].checked) {
      return radioObj[i].value;
    }
  }
  return "";
}

// set the radio button with the given value as being checked
// do nothing if there are no radio buttons
// if the given value does not exist, all the radio buttons
// are reset to unchecked
function setCheckedValue(radioObj, newValue) {
  if(!radioObj)
    return;
  var radioLength = radioObj.length;
  if(radioLength == undefined) {
    radioObj.checked = (radioObj.value == newValue.toString());
    return;
  }
  for(var i = 0; i < radioLength; i++) {
    radioObj[i].checked = false;
    if(radioObj[i].value == newValue.toString()) {
      radioObj[i].checked = true;
    }
  }
}
