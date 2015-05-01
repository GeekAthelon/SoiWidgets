document.addEventListener("DOMContentLoaded", function(event) {
  "use strict";

  var baseFlairClass = "all-flairs"

  function deleteOldFlairs() {
    var flairList = document.querySelectorAll("." + baseFlairClass);
    for (var i = 0; i < flairList.length; i++) {
      var el = flairList[i];
      el.parentElement.removeChild(el);
    }
  }


  var getElementPosition = function(obj) {
    var curleft = 0;
    var curtop = 0;
    if (obj.offsetParent) {
      curleft = obj.offsetLeft;
      curtop = obj.offsetTop;
      while (obj = obj.offsetParent) {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      }
    }
    return {
      left: curleft,
      top: curtop
    };
  }


  function handleFlairClickBuilder() {
    var div;
    var isShowing = false;

    return function() {
      var id = this.getAttribute("data-info-id");
      var host = document.getElementById(id);
      var contents = host.innerHTML;
      var pos = getElementPosition(this);

      if (isShowing) {
        isShowing = false;
        // Ugg, cheap hack..
        div.className = div.className.replace(" flair-load", "");
        return;
      }

      isShowing = true;

      // Yes, I know this litters the page with extra divs.
      // I'm really not worried.
      div = document.createElement("div");
      div.className = this.getAttribute("data-info-class-name") + " all-flairs-extra";
      div.innerHTML = contents;

      div.style.position = 'absolute';
      div.style.top = pos.top + this.clientHeight + 5 + "px";
      div.style.left = pos.left + "px";

      document.body.appendChild(div);

      //alert(this.clientHeight);

      window.setTimeout(function() {
        div.className += " flair-load";
      }, 1);


    };
  }

  function applyFlair(name, el) {

    function getName(name) {
      flairs.forEach(function(user) {
        var n1 = user[0];
        if (n1 === name) {
          flair = user[1];
          className = user[2];
          hasExtraInfo = !!user[3];
          extraClassId = user[3];
        }
      });
    }

    // Does this user have a flair?
    var flair = null;
    var className = null;
    var hasExtraInfo;
    var extraClassId;

	
    getName(name);
    if (!flair) {
      // Check to see if we handle unregistered users
      getName("");
      if (!flair) {
        return;
      }

    }

    var outerSpan = document.createElement("div");
    var span = document.createElement("span");

    outerSpan.className = [baseFlairClass, className].join(" ");
    span.appendChild(document.createTextNode(flair));

    if (hasExtraInfo) {
      var trigger = document.createElement("span");
      trigger.appendChild(document.createTextNode(" \u25bc"));
      span.appendChild(trigger);
      outerSpan.setAttribute("data-info-id", extraClassId);
      outerSpan.setAttribute("data-info-class-name", className);
      outerSpan.onclick = handleFlairClickBuilder();
      outerSpan.className += " flair-has-extra";
    }

    outerSpan.appendChild(span);
    el.parentNode.insertBefore(outerSpan, el.nextSibling);
  }

  function splitOutName(el) {
    var s = el.textContent;

    var name = s.split(/ said| said to | whispered to /)[0];

    name = name.trim();
    return name;
  }


  deleteOldFlairs();

  var actionList = document.querySelectorAll("hr+i+a");
  var nameList = document.querySelectorAll("hr+i+a~b");

  var l = actionList.length;
  for (var i = 0; i < l; i++) {
    var anchor = actionList[i];
    var nameElement = nameList[i];

    var name = splitOutName(nameElement);
    applyFlair(name, anchor)
  }

});