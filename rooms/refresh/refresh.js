(function () {
  var $$REFRESH_TIMER = 30; // seconds.
  var $$OPTION_NAME;
  var $$VERSION = "(beta 2)";

  // This is a poor man's check for document content loaded.
  // Loop until the DOM is ready, then fire our event.  This allows
  // the event to fire *before* the onload event, so we no longer have
  // to wait for all of the images/avatars to load.
  checkForReady();

  function checkForReady() {
    var el = document.getElementsByName("vqvaj");
    if (el) {
      setRefreshStatus();
    } else {
      window.setTimeout(checkForReady);
    }
  }

  function setRefreshStatus() {
    if (self !== top) {
      // We are in an iframe -- bail
      return;
    }

    if (!supports_html5_storage()) {
      return;
    }

    function getLink(txt) {
      var el, el2;
      var i = 0;
      while ((el = document.links[i++])) {
        el2 = el.firstChild;
        if (!el2) {
          continue;
        }
        if (el2.nodeType === 3 && el2.nodeValue == txt) {
          return el
        }
      }
    }

    $$OPTION_NAME = "chatplus_autorefresh_" + document.getElementsByName("vqxro")[0].value;
    var v = localStorage.getItem($$OPTION_NAME);

    var el = getLink('Auto');
    var n = document.createElement("a");
    n.href = '#' + new Date().getTime();
    if (v === "1") {
      n.appendChild(document.createTextNode("**Stop Live**"));
    } else {
      n.appendChild(document.createTextNode("**Start Live**"));
    }

    n.onclick = function () {
      var v = localStorage.getItem($$OPTION_NAME);
      v = v || "0";
      v = (v === "0") ? "1" : "0";
      localStorage.setItem($$OPTION_NAME, v);
      window.location = getLink("[Reload This Page]").href;
    }

    if (v === "1") {
      autoRefresh();
    }

    el.parentNode.insertBefore(n, el);
    el.parentNode.insertBefore(document.createTextNode($$VERSION), el);
    el.parentNode.insertBefore(document.createTextNode(" | "), el);
  }


  function supports_html5_storage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }


  function autoRefresh() {
    if (!supports_html5_storage()) {
      return;
    }

    if (localStorage.getItem($$OPTION_NAME) !== "1") {
      return;
    }


    function getContentElement(doc, data) {
      var el = doc.getElementsByName("vqxfi")[0];

      while (el && el.tagName.toLowerCase() !== 'table') {
        el = el.parentNode;
      }

      data.chatBoxTable = el;
      data.contentElement = el.parentNode;
    }

    function getAllChildren(el) {
      var children = [];
      var i;
      for (i = 0; i < el.childNodes.length; i++) {
        children.push(el.childNodes[i]);
      }
      return children;

      // unlike element.children, this also gets text nodes.
      var children = [];
      var kid = el.firstChild;
      while (kid) {
        alert(kid);
        children.push(kid);
        kid = kid.nextSibling;
      }
      return children;
    }

    function commentsToArray(contents) {
      var el;

      var els = getAllChildren(contents.contentElement);
      var i = 0;
      var l = els.length;
      var inPosts = false;
      var lastHr;
      var commentsArray = [];
      // Find the last HR
      for (i = l - 1; i > 0; i--) {
        el = els[i];
        if (el.tagName && el.tagName.toLowerCase() === "hr") {
          contents.lastHr = el;
          l = i;
          break;
        }
      }

      for (i = 0; i < l; i++) {
        el = els[i];

        // IE goes really screwy with improperly nested tags and creates this weird
        // mess.
        if (el && el.tagName && el.tagName.indexOf("/") === 0) {
          continue;
        }

        // Improper HTML left some input elements that show up in different
        // parts of the DOM, depending on the browser.	  
        if (el && el.tagName && el.tagName.toLowerCase() === "input") {
          continue;
        }

        if (el === contents.chatBoxTable) {
          inPosts = true;
          continue;
        }
        if (inPosts) {
          commentsArray.push(el);
        }
      }
      return commentsArray;
    }

    function purgeComments(mainComments, contents) {
      var i;
      for (i = 0; i < mainComments.length; i++) {
        var z = mainComments[i];
        if (z.nodeType === 3) {
          z.nodeValue = "";
        } else {
          contents.contentElement.removeChild(z);
        }
      }
    }


    function getAutoUrl() {
      var el, el2;
      var i = 0;
      while ((el = document.links[i++])) {
        el2 = el.firstChild;
        if (!el2) {
          continue;
        }
        if (el2.nodeType === 3 && el2.nodeValue == "Auto") {
          return el.href;
        }
      }
    }


    function captureForm() {
      var iname = "post_iframe";

      var but = document.getElementsByName("vqvaj")[0];
      var form = but.parentNode;

      but.value = "Talk";

      timerDiv = document.createElement("span");
      but.parentNode.insertBefore(timerDiv, but);
    }

    function doiframe() {

      var endTime = new Date().getTime() + ($$REFRESH_TIMER * 1000);

      function countdown() {
        var t = endTime - new Date().getTime();
        timerDiv.innerHTML = "Refresh in: " + (t / 1000 | 0);
        if (t > 0) {
          window.setTimeout(countdown, 500);
        } else {
          doiframe();
        }
      }
	  
	  function purgeThroughString(html, s) {
	    var i;
		i = html.toLowerCase().indexOf(s);
		html = html.substring(i + s.length, html.length);
		return html;
	  }
	  
	  function purgeTillEnd(html, s) {
	    var i;
		i = html.toLowerCase().indexOf(s);
		html = html.substring(0, i);
		return html;
	  }
	  
	  function hackupHtml(html) {
	    var i;
	    // At this point, we have a complete HTML string, complete
		// with a great deal of stuff we do not want.
		
		// Step 1: We don't want the first table listed -- we know that
		// is the chatbox form and such.
		html = purgeThroughString(html, "</table>");
		html = purgeTillEnd(html, "</body>");
		chatDiv.innerHTML = html;
		countdown();
	  }
	  
	  var xmlhttp = getXmlHttp();
	  var autoUrl = getAutoUrl() + "&force=" + new Date().getTime();
      xmlhttp.open("GET", autoUrl, true);
      xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState === 4) {
          hackupHtml(xmlhttp.responseText);
        }
      }
      xmlhttp.send(null)
    }

    var pulse;
    var mainBody = {};
    var mainComments;
    var timerDiv;

    captureForm();
    getContentElement(document, mainBody);
    mainComments = commentsToArray(mainBody);
    purgeComments(mainComments, mainBody);

    var chatDiv = document.createElement("div");
    if (mainBody.lastHr) {
      mainBody.lastHr.parentNode.insertBefore(chatDiv, mainBody.lastHr);
    } else {
      document.body.appendChild(chatDiv);
    }

    doiframe();
  }

  function addEvent(obj, type, fn) {
    if (obj.attachEvent) {
      obj['e' + type + fn] = fn;
      obj[type + fn] = function () {
        obj['e' + type + fn](window.event);
      }
      obj.attachEvent('on' + type, obj[type + fn]);
    } else obj.addEventListener(type, fn, false);
  }

  function removeEvent(obj, type, fn) {
    if (obj.detachEvent) {
      obj.detachEvent('on' + type, obj[type + fn]);
      obj[type + fn] = null;
    } else obj.removeEventListener(type, fn, false);
  }

  function getXmlHttp() {
    var xmlhttp = false;
    /*@cc_on @*/
    /*@if (@_jscript_version >= 5)
      // JScript gives us Conditional compilation, we can cope with old IE versions.
      // and security blocked creation of the objects.
    try {
      xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
     } catch (e) {
      try {
       xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (E) {
       xmlhttp = false;
      }
    }
    @end @*/
	
    if (!xmlhttp && typeof XMLHttpRequest != 'undefined') {
      try {
        xmlhttp = new XMLHttpRequest();
      } catch (e) {
        xmlhttp = false;
      }
    }
    if (!xmlhttp && window.createRequest) {
      try {
        xmlhttp = window.createRequest();
      } catch (e) {
        xmlhttp = false;
      }
    }
    return xmlhttp;
  }

}());