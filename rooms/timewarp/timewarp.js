var console;
(function () {
  "use strict";

  var config = {
    // These are the items to change to configure how the room works.

    // Accepted values:
    // "time" - The room works like a timewarp room with 24 hour days.
    // "multiloc" -- The room works like the old multiloc rooms.
    mode : "time",

    ///////////////////////////////////////////////////
    // Valid for mode: "time"
    ///////////////////////////////////////////////////

    // May the player save his current time selection?
    // true - If the player changes the time, the system will remember his change.
    // false - The room always loads to SOI's current time.
    canSaveTime : true,

    // May the player even HAVE the option to change the time?
    // true - The player gets the list of times.
    // false - the list of times does not even appear.
    canChangeTime : true,

    ///////////////////////////////////////////////////
    // Valid for mode: "multiloc"
    ///////////////////////////////////////////////////

    views : [
      ["00", "Midnight"],
      ["12", "High Noon"]
    ]

  };

  var canUseLocalStorage = true;

  var storage = (function () {
    // This code comes from Mozilla.
    // Its a limited version of localStorage, but it works well enough for
    // my purposes.
    // Syntax is very limited. No big deal.

    var o = {
      getItem : function (sKey) {
        if (!sKey || !this.hasOwnProperty(sKey)) {
          return null;
        }
        return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
      },
      key : function (nKeyId) {
        return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
      },
      setItem : function (sKey, sValue) {
        if (!sKey) {
          return;
        }
        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
        this.length = document.cookie.match(/\=/g).length;
      },
      length : 0,
      removeItem : function (sKey) {
        if (!sKey || !this.hasOwnProperty(sKey)) {
          return;
        }
        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        this.length--;
      },
      hasOwnProperty : function (sKey) {
        return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
      }
    };
    o.length = (document.cookie.match(/\=/g) || o).length;

    return o;
  }
    ());

  function featureTest() {
    function err(s) {

      var submitButton = document.getElementsByName("vqvaj")[0];
      var td = submitButton;
      while (td.tagName.toLowerCase() != "td") {
        td = td.parentNode;
      }

      var strong = document.createElement("strong");
      strong.appendChild(document.createTextNode("Unable to enjoy this room due to missing browser feature: "));
      strong.appendChild(document.createTextNode(s));

      td.appendChild(strong);
      throw s;
    }

    // This is an ugly, nasty, brute-force feature test.
    // UGGG

    try {
      var t1 = " ".trim(" ");
    } catch (e) {
      err("String.trim");
    }

    try {
      var t2 = document.querySelectorAll(".modalDialog")
    } catch (e) {
      err("document.querySelectorAll");
    }

    try {

      // We actually TRY the localStorage rather than just checking for its existence.
      // In some browsers, if cookies are disabled, localStorage appears, but one gets an
      // access denied.
      //
      // In addition, localStorage may be full and throws an error.

      var key = "SESSION_STORAGE_TEST";
      var n1 = Math.random();
      localStorage.setItem(key, n1);
      var n2 = +localStorage.getItem(key);
      localStorage.removeItem(key);
      if (n1 !== n2) {
        canUseLocalStorage = false;
      }
    } catch (e) {
      canUseLocalStorage = false;
    }

    if (!canUseLocalStorage) {
      var key = "SESSION_STORAGE_TEST";
      var n1 = Math.random();
      storage.setItem(key, n1);
      var n2 = +storage.getItem(key);
      storage.removeItem(key);
      if (n1 !== n2) {
        err("localStorage or cookies");
      }
    }

  }

  function addEventHandler(elem, eventType, handler) {
    if (elem.addEventListener)
      elem.addEventListener(eventType, handler, false);
    else if (elem.attachEvent)
      elem.attachEvent('on' + eventType, handler);
  }

  function dummy() {};

  function walkTheDOM(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
      walkTheDOM(node, func);
      node = node.nextSibling;
    }
  }

  var PREFKEY;

  function mainTimeWarp() {

    featureTest();

    var HAS_POINTER_EVENTS = (function () {
      // FRIGGING IE10 doesn't know pointer events.
      // So, we'll hide and unhide the div instead.
      // Nowhere near as pretty, but it works.

      //return false;
      var a = document.createElement("x");
      a.style.cssText = "pointer-events:auto";
      return a.style.pointerEvents === "auto"
    }
      ());

    var $$findButton = document.getElementsByName("vqvak")[0];
    var currentView;

    config.canSaveView = false;
    if ((config.mode === "multiloc") || (config.mode === "time" && config.canSaveTime)) {
      config.canSaveView = true;
    }

    var PLAYERNAME = document.getElementsByName("vqxus")[0].value;
    var ROOMNAME = document.getElementsByName("vqxro")[0].value;
    PREFKEY = "ATHELON_TIMEWARP_" + PLAYERNAME + "_" + ROOMNAME;

    var playerPrefs = getPlayerPrefs();

    function getPlayerPrefs() {
      var data;
      if (canUseLocalStorage) {
        data = localStorage.getItem(PREFKEY);
      } else {
        data = storage.getItem(PREFKEY);
      }

      if (!data) {
        return {};
      }
      return JSON.parse(data);
    }

    function setPlayerPrefs() {
      var data = JSON.stringify(playerPrefs);
      if (canUseLocalStorage) {
        localStorage.setItem(PREFKEY, data);
      } else {
        storage.setItem(PREFKEY, data);
      }
    }

    if (!console) {
      console = {
        log : dummy,
        info : dummy,
        trace : dummy,
        error : dummy
      };
    }

    function hourToString(h) {
      var hs = h;
      if (hs < 10) {
        hs = "0" + h;
      }
      return "" + hs;
    }

    function loopNodeList(list, f) {
      var l = list.length;
      for (var i = 0; i < l; i++) {
        f(list[i]);
      }
    }

    function getSoiViewName() {
      // Start at the Find button and work our way up to the proper td
      var el = $$findButton;
      while (el.tagName.toLowerCase() !== 'td') {
        el = el.parentNode;
      }

      // Ok, we have the right time element.
      // Now, walk through the text elements and look for the time sig

      var hour = null;

      var hourRegex = /\[(\d{1,2}):\d{2}\]/; //[12:12]

      walkTheDOM(el, function (node) {
        if (node.nodeType === 3) {
          var txt = node.nodeValue.trim();
          var m = txt.match(hourRegex);

          if (m) {
            hour = +m[1];
          }

        }
      });

      if (hour === null) {
        throw "Unable to locate SOI time for determine the hour";
      }
      return hourToString(hour);
    }

    function timeWarpOne(el, view) {
      // Nope, don't want to show it.
      el.style.display = "none";

      function addElement(ourEl) {
        var span;
        // It is a text node, lets wrap it up in a SPAN
        if (ourEl.nodeType === 3) {
          span = document.createElement("span");
          span.appendChild(ourEl);
          ourEl = span;
        }

        ourEl.setAttribute("data-time-virtual", true);
        el.parentNode.appendChild(ourEl);
      }

      var viewsToShow = el.getAttribute("data-time-views");
      if (!viewsToShow) {
        console.error("There were no views available for element");
        console.error(el);
        return;
      }

      viewsToShow = viewsToShow.split(",");

      for (var i = 0; i < viewsToShow.length; i++) {
        var h = viewsToShow[i];
        if (h === view) {

          var html = el.innerHTML;
          html = html.trim();

          // Create an element just to hold our template
          var testDiv = document.createElement("div");

          // Let the browser convert it to HTML
          testDiv.innerHTML = html;
          while (testDiv.firstChild) {
            addElement(testDiv.firstChild);
          }
        }
      }
    }

    function createTimeChangeControls() {
      var views = getViewsForTime();
      createChangeControls(views, "Change Time");
    }

    function getViewList() {
      function getViewListMulti() {
        var viewList = [];

        for (var i = 0; i < config.views.length; i++) {
          var view = config.views[i];
          var o = {
            key : view[0],
            value : view[1]
          };

          viewList.push(o);
        }
        return viewList;
      }

      function getViewListForTime() {
        var viewList = getViewsForTime();
        return viewList;
      }

      if (config.mode === "time") {
        return getViewListForTime();
      } else {
        return getViewListMulti();
      }
    }

    function createMultilocChangeControls() {
      var viewList = getViewList();
      createChangeControls(viewList, "Change View");
    }

    function closeChangeControls() {
      if (!HAS_POINTER_EVENTS) {
        document.getElementById("chooseViewModal").style.display = "none";
      }
      window.location.hash = "close";
    }

    function createChangeControls(views, defaultDropdownTitle) {
      var messageText;

      var button = document.createElement("button");
      button.type = "button";
      button.appendChild(document.createTextNode(defaultDropdownTitle));
      $$findButton.parentNode.insertBefore(button, $$findButton.nextSibling);

      addEventHandler(button, "click", function () {
        var container = document.getElementById("chooseViewModal");
        if (!HAS_POINTER_EVENTS) {
          container.style.display = "";
        }

        window.location.hash = "chooseViewModal";
      }, 1);

      var containerDiv = document.getElementById("chooseViewModelViews");

      if (config.mode === "time") {
        if (config.canSaveTime) {
          messageText = "This room allows you to change time.";
        } else {
          messageText = "This room follows SOI time.  You may see these views, but not change to them.";
        }

        var el = document.createElement("div");
        el.className = "message";
        el.appendChild(document.createTextNode(messageText));
        containerDiv.appendChild(el);
      }

      function makeEntry(str, val) {
        var button = document.createElement("button");
        button.type = "button";
        button.setAttribute("data-view", val);
        button.appendChild(document.createTextNode(str));
        containerDiv.appendChild(button);

        addEventHandler(button, "click", rerun);
      }

      for (var i = 0; i < views.length; i++) {
        makeEntry(views[i].value, views[i].key);
      }

      function rerun() {
        var view = this.getAttribute("data-view");
        if (view !== "") {

          if (config.canSaveView) {
            playerPrefs.lastView = view;
            setPlayerPrefs();
          }
          runTimeWarp(view);

          window.setTimeout(function () {
            // If the images are loaded, this will put the screen in the right place.
            // That *should* be the case more often than not.
            closeChangeControls();
            window.location.hash = "chatmark";
          }, 1);

        }
        return false;
      }
    }

    function runTimeWarp(hour) {
      //console.log("Running Timewarp as of hour: " + hour + " (SOI time)");

      // Remove anything filled in by templates already.
      var els = document.querySelectorAll("[data-time-virtual]");
      loopNodeList(els, function (el) {
        el.parentElement.removeChild(el);
      });

      // Process Text Nodes
      var text = document.querySelectorAll("[data-time-type='text']");
      loopNodeList(text, function (el) {
        timeWarpOne(el, hour);
      });

      currentView = hour;
      document.body.setAttribute("data-time-hour", "" + hour);
    }

    function runSoiCurrentTime() {
      var soiViewName = getSoiViewName();
      runTimeWarp(soiViewName);
    }

    function getViewsForTime() {
      var v = [{
          "key" : "00",
          "value" : "Midnight"
        }, {
          "key" : "01",
          "value" : "1 AM"
        }, {
          "key" : "02",
          "value" : "2 AM"
        }, {
          "key" : "03",
          "value" : "3 AM"
        }, {
          "key" : "04",
          "value" : "4 AM"
        }, {
          "key" : "05",
          "value" : "5 AM"
        }, {
          "key" : "06",
          "value" : "6 AM"
        }, {
          "key" : "07",
          "value" : "7 AM"
        }, {
          "key" : "08",
          "value" : "8 AM"
        }, {
          "key" : "09",
          "value" : "9 AM"
        }, {
          "key" : "10",
          "value" : "10 AM"
        }, {
          "key" : "11",
          "value" : "11 AM"
        }, {
          "key" : "12",
          "value" : "Noon"
        }, {
          "key" : "13",
          "value" : "1 PM"
        }, {
          "key" : "14",
          "value" : "2 PM"
        }, {
          "key" : "15",
          "value" : "3 PM"
        }, {
          "key" : "16",
          "value" : "4 PM"
        }, {
          "key" : "17",
          "value" : "5 PM"
        }, {
          "key" : "18",
          "value" : "6 PM"
        }, {
          "key" : "19",
          "value" : "7 PM"
        }, {
          "key" : "20",
          "value" : "8 PM"
        }, {
          "key" : "21",
          "value" : "9 PM"
        }, {
          "key" : "22",
          "value" : "10 PM"
        }, {
          "key" : "23",
          "value" : "11 PM"
        }
      ];

      return v;
    }

    function hijackFormSubmit() {
      var submitButton = document.getElementsByName("vqvaj")[0];
      var textArea = document.getElementsByName("vqxsp")[0];
      var form;

      if (submitButton) {
        form = submitButton.form;
        addEventHandler(form, "submit", function () {

          var views = getViewList();
          var currentViewName = "**UNKNOWN**";

          for (var i = 0; i < views.length; i++) {
            var view = views[i];
            if (view.key === playerPrefs.lastView) {
              currentViewName = view.value;
            }
          }

          if (config.canSaveTime) {
            // Only display the new time if the player can save the time.
            var txt = textArea.value;
            if (txt.trim() !== "") {
              textArea.value = "<section class='viewMessage'>" + currentViewName + "</section>" + textArea.value;
            }
          }
        });
      }

    }

    function createSelectWindow() {
      var a = [];
      a[a.length] = '<div id="chooseViewModal" class="modalDialog">';
      a[a.length] = '<div>';
      a[a.length] = '<a href="#close" title="Close" class="modalDialogClose">X</a>';

      if (config.mode === "time") {
        a[a.length] = '<h2>Choose Time</h2>';
      }

      if (config.mode === "multiloc") {
        a[a.length] = '<h2>Choose View</h2>';
      }

      a[a.length] = '<div id="chooseViewModelViews"></div>';
      a[a.length] = '</div>';
      a[a.length] = '</div>';
      var div = document.createElement("div");
      div.innerHTML = a.join("");
      document.body.appendChild(div);

      var close = document.querySelector(".modalDialogClose");
      addEventHandler(close, "click", closeChangeControls);
    }

    function DeCrapifyIE10() {
      var els = document.querySelectorAll(".modalDialog");
      loopNodeList(els, function (el) {
        el.style.display = "none";
      });
    }

    function runInitTimeWarp() {
      hijackFormSubmit();
      createSelectWindow();

      if (!HAS_POINTER_EVENTS) {
        DeCrapifyIE10();
      }

      if (config.mode === "time") {
        if (!config.canSaveTime) {
          playerPrefs.lastView = null;
          runSoiCurrentTime();
        } else {
          if (playerPrefs.lastView) {
            runTimeWarp(playerPrefs.lastView);
          } else {
            runSoiCurrentTime();
          }
        }

        if (config.canChangeTime) {
          createTimeChangeControls();
        }
      }

      if (config.mode === "multiloc") {
        if (playerPrefs.lastView) {
          runTimeWarp(playerPrefs.lastView);
        } else {
          runTimeWarp(config.views[0][0]);
        }
        createMultilocChangeControls();
      }

    }

    // Set up some things to make decorating the room easier
    (function () {
      var toBox = document.getElementsByName("vqxto")[0];
      var chatBox = toBox;
      while (chatBox.nodeName.toLowerCase() !== "table") {
        chatBox = chatBox.parentNode;
      }

      chatBox.setAttribute("data-time-style", "chat-box ");
    }
      ());

    runInitTimeWarp();
  }

  addEventHandler(window, "load", mainTimeWarp);
}
  ());
