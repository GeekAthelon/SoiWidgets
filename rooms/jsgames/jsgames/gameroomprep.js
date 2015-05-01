document.domain = "hyperchat.com";
document.write("<div id='place'><\/div>'");


var JSON;
if (!JSON) {
  JSON = {}
}(function () {
  function f(n) {
    return n < 10 ? "0" + n : n
  }
  if (typeof Date.prototype.toJSON !== "function") {
    Date.prototype.toJSON = function (key) {
      return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
    };
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
      return this.valueOf()
    }
  }
  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap, indent, meta = {
      "\b": "\\b",
      "\t": "\\t",
      "\n": "\\n",
      "\f": "\\f",
      "\r": "\\r",
      '"': '\\"',
      "\\": "\\\\"
    },
    rep;

  function quote(string) {
    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
      var c = meta[a];
      return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
    }) + '"' : '"' + string + '"'
  }

  function str(key, holder) {
    var i, k, v, length, mind = gap,
      partial, value = holder[key];
    if (value && typeof value === "object" && typeof value.toJSON === "function") {
      value = value.toJSON(key)
    }
    if (typeof rep === "function") {
      value = rep.call(holder, key, value)
    }
    switch (typeof value) {
    case "string":
      return quote(value);
    case "number":
      return isFinite(value) ? String(value) : "null";
    case "boolean":
    case "null":
      return String(value);
    case "object":
      if (!value) {
        return "null"
      }
      gap += indent;
      partial = [];
      if (Object.prototype.toString.apply(value) === "[object Array]") {
        length = value.length;
        for (i = 0; i < length; i += 1) {
          partial[i] = str(i, value) || "null"
        }
        v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
        gap = mind;
        return v
      }
      if (rep && typeof rep === "object") {
        length = rep.length;
        for (i = 0; i < length;
        i += 1) {
          if (typeof rep[i] === "string") {
            k = rep[i];
            v = str(k, value);
            if (v) {
              partial.push(quote(k) + (gap ? ": " : ":") + v)
            }
          }
        }
      } else {
        for (k in value) {
          if (Object.prototype.hasOwnProperty.call(value, k)) {
            v = str(k, value);
            if (v) {
              partial.push(quote(k) + (gap ? ": " : ":") + v)
            }
          }
        }
      }
      v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
      gap = mind;
      return v
    }
  }
  if (typeof JSON.stringify !== "function") {
    JSON.stringify = function (value, replacer, space) {
      var i;
      gap = "";
      indent = "";
      if (typeof space === "number") {
        for (i = 0; i < space; i += 1) {
          indent += " "
        }
      } else {
        if (typeof space === "string") {
          indent = space
        }
      }
      rep = replacer;
      if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
        throw new Error("JSON.stringify")
      }
      return str("", {
        "": value
      })
    }
  }
  if (typeof JSON.parse !== "function") {
    JSON.parse = function (text, reviver) {
      var j;

      function walk(holder, key) {
        var k, v, value = holder[key];
        if (value && typeof value === "object") {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v
              } else {
                delete value[k]
              }
            }
          }
        }
        return reviver.call(holder, key, value)
      }
      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
        text = text.replace(cx, function (a) {
          return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        })
      }
      if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
        j = eval("(" + text + ")");
        return typeof reviver === "function" ? walk({
          "": j
        }, "") : j
      }
      throw new SyntaxError("JSON.parse")
    }
  }
}());



if (!JSON) {
  alert("Sorry, your browser doesn't have the needed features to use this room.  (No JSON support.)");
}

if (window.top === window.self) {
  window.onload = loc_init;
} else {
  window.onload = window.top.init2;
}

function getValueByName(n) {
  var el = document.getElementsByName(n);
  if (!el) {return;}
  return el[0].value;
}

function getReturnUrl() {
  var links = document.getElementsByTagName("a");
  var i, l = links.length;
  var a;
  for (i = 0; i < l; i++) {  
    a = links[i];
    if (a.innerHTML == "[Reload This Page]") {
      return a.href;
    } 
  }
}


function makeLink(destUrl, picUrl, text) {
  var but = document.createElement("button");

  var img = new Image();
  img.src = picUrl;
  but.appendChild(img);
  but.appendChild(document.createElement("br"));
  but.appendChild(document.createTextNode(text));


  but.onclick = function() {
    window.location = destUrl;
  };

  return but;
}

function oldBoggleLink(place) {
  var but = makeLink(
    "http://soiroom.hyperchat.com/jsgames/boggle.html",
    'http://soiroom.hyperchat.com/jsgames/boggle.jpg',
    'Enter Old Game World'
   );

  place.appendChild(but);

}

function newBoggleLink(place) {
  var but = makeLink(
    "http://soiroom.hyperchat.com/jsgames/boggle2/boggle.html",
    'http://soiroom.hyperchat.com/jsgames/boggle2/boggle.jpg',
    'Enter NEW Game World **MUST USE A REGISTERED HANDLE OR IT DOES NOT WORK.  I AM TRYING TO FIGURE OUT WHY.**'
   );

  place.appendChild(but);
}


function loc_init() {
  var place = document.getElementById('place');

  var vals = {};
  vals.user=getValueByName('vqxus');
  vals.room=getValueByName('vqxro');
  vals.url=getReturnUrl();

  window.name = JSON.stringify(vals);
  // This is really hacky, but we go for the 'Reload this page' link


  oldBoggleLink(place);
  newBoggleLink(place);

  place.appendChild(document.createElement("br"));

  place.appendChild(document.createTextNode(
    'Welcome to Boggle at SOI, another cheap production brought to you by Athelon AKA Lord of the Dice.'
   ));


  //place.innerHTML = "<div>" + place.innerHTML + "</div>";

}
