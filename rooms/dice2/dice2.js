/*jslint continue: true, plusplus: true, white: true,  regexp: true, nomen: true */
/*globals document: false, alert:false, window:false, unescape: true, escape: true, console:true */

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement /*, fromIndex */ ) {
    "use strict";
    if (this == null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k += 1) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}


/*
    json2.js
    2012-10-08

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
  JSON = {};
}

(function() {
  'use strict';

  function f(n) {
    // Format integers to have at least two digits.
    return n < 10 ? '0' + n : n;
  }

  if (typeof Date.prototype.toJSON !== 'function') {

    Date.prototype.toJSON = function(key) {

      return isFinite(this.valueOf()) ? this.getUTCFullYear() + '-' +
        f(this.getUTCMonth() + 1) + '-' +
        f(this.getUTCDate()) + 'T' +
        f(this.getUTCHours()) + ':' +
        f(this.getUTCMinutes()) + ':' +
        f(this.getUTCSeconds()) + 'Z' : null;
    };

    String.prototype.toJSON =
      Number.prototype.toJSON =
      Boolean.prototype.toJSON = function(key) {
        return this.valueOf();
      };
  }

  var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = { // table of character substitutions
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"': '\\"',
      '\\': '\\\\'
    },
    rep;


  function quote(string) {

    // If the string contains no control characters, no quote characters, and no
    // backslash characters, then we can safely slap some quotes around it.
    // Otherwise we must also replace the offending characters with safe escape
    // sequences.

    escapable.lastIndex = 0;
    return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
      var c = meta[a];
      return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    }) + '"' : '"' + string + '"';
  }


  function str(key, holder) {

    // Produce a string from holder[key].

    var i, // The loop counter.
      k, // The member key.
      v, // The member value.
      length,
      mind = gap,
      partial,
      value = holder[key];

    // If the value has a toJSON method, call it to obtain a replacement value.

    if (value && typeof value === 'object' &&
      typeof value.toJSON === 'function') {
      value = value.toJSON(key);
    }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.

    if (typeof rep === 'function') {
      value = rep.call(holder, key, value);
    }

    // What happens next depends on the value's type.

    switch (typeof value) {
      case 'string':
        return quote(value);

      case 'number':

        // JSON numbers must be finite. Encode non-finite numbers as null.

        return isFinite(value) ? String(value) : 'null';

      case 'boolean':
      case 'null':

        // If the value is a boolean or null, convert it to a string. Note:
        // typeof null does not produce 'null'. The case is included here in
        // the remote chance that this gets fixed someday.

        return String(value);

        // If the type is 'object', we might be dealing with an object or an array or
        // null.

      case 'object':

        // Due to a specification blunder in ECMAScript, typeof null is 'object',
        // so watch out for that case.

        if (!value) {
          return 'null';
        }

        // Make an array to hold the partial results of stringifying this object value.

        gap += indent;
        partial = [];

        // Is the value an array?

        if (Object.prototype.toString.apply(value) === '[object Array]') {

          // The value is an array. Stringify every element. Use null as a placeholder
          // for non-JSON values.

          length = value.length;
          for (i = 0; i < length; i += 1) {
            partial[i] = str(i, value) || 'null';
          }

          // Join all of the elements together, separated with commas, and wrap them in
          // brackets.

          v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
          gap = mind;
          return v;
        }

        // If the replacer is an array, use it to select the members to be stringified.

        if (rep && typeof rep === 'object') {
          length = rep.length;
          for (i = 0; i < length; i += 1) {
            if (typeof rep[i] === 'string') {
              k = rep[i];
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        } else {

          // Otherwise, iterate through all of the keys in the object.

          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }
        }

        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.

        v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
        gap = mind;
        return v;
    }
  }

  // If the JSON object does not yet have a stringify method, give it one.

  if (typeof JSON.stringify !== 'function') {
    JSON.stringify = function(value, replacer, space) {

      // The stringify method takes a value and an optional replacer, and an optional
      // space parameter, and returns a JSON text. The replacer can be a function
      // that can replace values, or an array of strings that will select the keys.
      // A default replacer method can be provided. Use of the space parameter can
      // produce text that is more easily readable.

      var i;
      gap = '';
      indent = '';

      // If the space parameter is a number, make an indent string containing that
      // many spaces.

      if (typeof space === 'number') {
        for (i = 0; i < space; i += 1) {
          indent += ' ';
        }

        // If the space parameter is a string, it will be used as the indent string.

      } else if (typeof space === 'string') {
        indent = space;
      }

      // If there is a replacer, it must be a function or an array.
      // Otherwise, throw an error.

      rep = replacer;
      if (replacer && typeof replacer !== 'function' &&
        (typeof replacer !== 'object' ||
          typeof replacer.length !== 'number')) {
        throw new Error('JSON.stringify');
      }

      // Make a fake root object containing our value under the key of ''.
      // Return the result of stringifying the value.

      return str('', {
        '': value
      });
    };
  }


  // If the JSON object does not yet have a parse method, give it one.

  if (typeof JSON.parse !== 'function') {
    JSON.parse = function(text, reviver) {

      // The parse method takes a text and an optional reviver function, and returns
      // a JavaScript value if the text is a valid JSON text.

      var j;

      function walk(holder, key) {

        // The walk method is used to recursively walk the resulting structure so
        // that modifications can be made.

        var k, v, value = holder[key];
        if (value && typeof value === 'object') {
          for (k in value) {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            }
          }
        }
        return reviver.call(holder, key, value);
      }


      // Parsing happens in four stages. In the first stage, we replace certain
      // Unicode characters with escape sequences. JavaScript handles many characters
      // incorrectly, either silently deleting them, or treating them as line endings.

      text = String(text);
      cx.lastIndex = 0;
      if (cx.test(text)) {
        text = text.replace(cx, function(a) {
          return '\\u' +
            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
      }

      // In the second stage, we run the text against regular expressions that look
      // for non-JSON patterns. We are especially concerned with '()' and 'new'
      // because they can cause invocation, and '=' because it can cause mutation.
      // But just to be safe, we want to reject all unexpected forms.

      // We split the second stage into 4 regexp operations in order to work around
      // crippling inefficiencies in IE's and Safari's regexp engines. First we
      // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
      // replace all simple value tokens with ']' characters. Third, we delete all
      // open brackets that follow a colon or comma or that begin the text. Finally,
      // we look to see that the remaining characters are only whitespace or ']' or
      // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

      if (/^[\],:{}\s]*$/
        .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
          .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        // In the third stage we use the eval function to compile the text into a
        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
        // in JavaScript: it can begin a block or an object literal. We wrap the text
        // in parens to eliminate the ambiguity.

        j = eval('(' + text + ')');

        // In the optional fourth stage, we recursively walk the new structure, passing
        // each name/value pair to a reviver function for possible transformation.

        return typeof reviver === 'function' ? walk({
          '': j
        }, '') : j;
      }

      // If the text is not JSON parseable, then a SyntaxError is thrown.

      throw new SyntaxError('JSON.parse');
    };
  }
}());



(function() {
  "use strict";

  var $$_DEFAULT_DATA, // The blank data to start out the game    
    $$_DEFAULT_IMG_PATH = 'http://soiroom.hyperchat.com/dice/',
    $$_SUBMIT, // the submit button
    $$_TIMESTAMP, // The game time stamp
    $$_MSGFORM, // The Message Box form
    $$_USERNAME, // The username
    $$Y_ALREADY_SCORED, // Has the player already scored this turn?
    $$_PLAYERPREF, // Player preference object
    $$_GAMELORDS, // List of game lords
    diceSets, // The various dice in the game
    util, // The utilities collection
    $$_INSPIRIT, // Player in the spirit list?
    boardData, // The saved game info
    diceRollCalculator, // Calculate that roll of the dice
    soiFormControl; // Manipulate the SOI forms
  ///////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////
  boardData = [{
    name: "Players",
    style: "player"
  }, {
    hint: "This slot is for the sum of all dice showing 1.",
    name: "Aces",
    id: "1"
  }, {
    hint: "This slot is for the sum of all dice showing 2.",
    name: "Twos",
    id: "2"
  }, {
    hint: "This slot is for the sum of all dice showing 3.",
    name: "Threes",
    id: "3"
  }, {
    hint: "This slot is for the sum of all dice showing 4.",
    name: "Fours",
    id: "4"
  }, {
    hint: "This slot is for the sum of all dice showing 5.",
    name: "Fives",
    id: "5"
  }, {
    hint: "This slot is for the sum of all dice showing 6.",
    name: "Sixes",
    id: "6"
  }, {
    hint: "The total of the top half of the board.",
    name: "Subtotal",
    id: "up_total"
  }, {
    hint: "If you score 63 or more points on the top half of the board, " + "you receive a 35 point bonus.  Hint:  63 = Three of all kinds of dice " + "but any combination of dice may be used.",
    name: "Upper Bonus",
    id: "bonus"
  }, {
    name: "\u00A0",
    style: "blank"
  }, {
    hint: "If you have three of any face of dice, the sum of ALL dice may be scored here." + "Example: 1 3 1 6 1 would score 12 points.",
    name: "3 of a Kind",
    id: "3k"
  }, {
    hint: "If you have three of any face of dice, the sum of ALL dice may be scored here." + "Example: 1 1 1 6 1 would score 10 points.",
    name: "4 of a Kind",
    id: "4k"
  }, {
    hint: "A small straight is any four numbers in sequence.  They don't actually have to be " + "in order, but all of the numbers have to be there.  Both 1 2 3 4 1 and 4 2 3 6 1 are small straights.",
    name: "Small Straight",
    id: "ss"
  }, {
    hint: "A large straight is any five numbers in sequence.  They don't actually have to be " + "in order, but all of the numbers have to be there.  Both 1 2 3 4 5 and 4 2 3 6 5 are large straights.",
    name: "Large Straight",
    id: "ls"
  }, {
    hint: "Any two of a kind and any three of a kind.  1 1 2 2 2 and 5 1 5 1 5 are both full houses.",
    name: "Full House",
    id: "fh"
  }, {
    hint: "All dice showing the same face.  The first Yahtzee is worth 50 points, each additional Yahtzee " + "is worth an additional 100 extra points.  Additional Yahtzees can be scored almost anywhere on the card. " + "You'll see when you get one.",
    name: "Yahtzee",
    id: "y"
  }, {
    hint: "The value of the dice showing.  This is a 'catch all' category.",
    name: "Chance",
    id: "c"
  }, {
    name: "\u00A0",
    style: "blank"
  }, {
    name: "Yahtzee Bonus",
    id: "yah_bonus"
  }, {
    name: "Lower Total",
    id: "bot_total"
  }, {
    name: "Grand Total",
    id: "g_total"
  }];


  $$_GAMELORDS = ['athelon', 'lordofthedice'];
  diceSets = {
    "default": {
      "path": $$_DEFAULT_IMG_PATH,
      "clear": ["dice/old/d0.jpg", "dice/old/d1.jpg", "dice/old/d2.jpg", "dice/old/d3.jpg", "dice/old/d4.jpg", "dice/old/d5.jpg", "dice/old/d6.jpg"],
      "marked": ["dice/old/d0.jpg", "dice/old/d1x.jpg", "dice/old/d2x.jpg", "dice/old/d3x.jpg", "dice/old/d4x.jpg", "dice/old/d5x.jpg", "dice/old/d6x.jpg"]
    },
    "big": {
      "path": $$_DEFAULT_IMG_PATH,
      "clear": ["dice/old/d0.jpg", "dice/big/1.gif", "dice/big/2.gif", "dice/big/3.gif", "dice/big/4.gif", "dice/big/5.gif", "dice/big/6.gif"],
      "marked": ["dice/old/d0.jpg", "dice/big/x1.jpg", "dice/big/x2.jpg", "dice/big/x3.gif", "dice/big/x4.gif", "dice/big/x5.gif", "dice/big/x6.gif"]
    },
    "small1": {
      "path": $$_DEFAULT_IMG_PATH,
      "clear": ["dice/old/d0.jpg", "dice/small/d1.jpg", "dice/small/d2.jpg", "dice/small/d3.jpg", "dice/small/d4.jpg", "dice/small/d5.jpg", "dice/small/d6.jpg"],
      "marked": ["dice/old/d0.jpg", "dice/small/d1o.jpg", "dice/small/d2o.jpg", "dice/small/d3o.jpg", "dice/small/d4o.jpg", "dice/small/d5o.jpg", "dice/small/d6o.jpg"]
    },
    "small2": {
      "path": $$_DEFAULT_IMG_PATH,
      "clear": ["dice/old/d0.jpg", "dice/small/d1.jpg", "dice/small/d2.jpg", "dice/small/d3.jpg", "dice/small/d4.jpg", "dice/small/d5.jpg", "dice/small/d6.jpg"],
      "marked": ["dice/old/d0.jpg", "dice/small/d1sc.jpg", "dice/small/d2sc.jpg", "dice/small/d3sc.jpg", "dice/small/d4sc.jpg", "dice/small/d5sc.jpg", "dice/small/d6sc.jpg"]
    },
    "small3": {
      "path": $$_DEFAULT_IMG_PATH,
      "clear": ["dice/old/d0.jpg", "dice/small/d1.jpg", "dice/small/d2.jpg", "dice/small/d3.jpg", "dice/small/d4.jpg", "dice/small/d5.jpg", "dice/small/d6.jpg"],
      "marked": ["dice/old/d0.jpg", "dice/small/d1x.jpg", "dice/small/d2x.jpg", "dice/small/d3x.jpg", "dice/small/d4x.jpg", "dice/small/d5x.jpg", "dice/small/d6x.jpg"]
    },
    "HTML - Try on iPod": {
      "text": [
        ["???", "???", "???"],

        ["   ", " o ", "   "],
        ["o  ", "   ", "  o"],
        ["o  ", " o ", "  o"],
        ["o o", "   ", "o o"],
        ["o o", " o ", "o o"],
        ["ooo", "   ", "ooo"]
      ]
    }
  };

  util = {};
  util.rollD6 = function() {
    var r = Math.floor(Math.random() * 6) + 1;
    return r;
  };

  util.appendStyle = function(styles) {
    var css = document.createElement('style');
    css.type = 'text/css';

    if (css.styleSheet) {
      css.styleSheet.cssText = styles;
    } else {
      css.appendChild(document.createTextNode(styles));
    }

    document.getElementsByTagName("head")[0].appendChild(css);
  };

  util.disableInputs = function() {
    /* Disable any of the input buttons to prevent double posting and double
     * form submission.  Would be nice if this would persist against the
     * backbutton use, but we can't have everything.
     */
    var el = document.getElementsByName("vqvaj")[0],
      gameBoard = document.getElementById("gameBoard"),
      els = gameBoard.getElementsByTagName("button"),
      i; // counter
    if (el) {
      el.disabled = true;
      el.value = "Already played";
      el.title = "Did you use the back button?";
    }

    for (i = 0; i < els.length; i++) {
      els[i].disabled = true;
    }
  };

  util.getSoiTimeStamp = function() {
    /* Read the SOI timedate stamp.  To turn this into a POSIX
    time stamp, just multiply by 100 (to add seconds)
     */
    var r, stamp = document.getElementsByName("vqxti");
    if (stamp) {
      r = +stamp[0].value;
      return r;
    }
  };

  util.serializeFormUrlencoded = function(f) {
    var e, // form element
      n, // form element's name
      t, // form element's type
      o, // option element
      i, // loop counter
      ilen, // length
      j, // loop counter
      jlen, // length
      es = f.elements,
      c1 = {},
      c = []; // the serialization data parts

    function urlencode(n) {
      return n; //FAKE! But we don't care in this case
    }

    function add(n, v) {
      c[c.length] = urlencode(n) + "=" + urlencode(v);
      c1[urlencode(n)] = urlencode(v);
    }

    for (i = 0, ilen = es.length; i < ilen; i++) {
      e = es[i];
      n = e.name;
      if (n && !e.disabled) {
        t = e.type;
        if (t.match(/^select/)) {
          // The 'select-one' case could reuse 'select-multiple' case
          // The 'select-one' case code is an optimization for
          // serialization processing time.
          if (t === 'select-one' || (t === 'select' && !t.multiple)) {
            if (e.selectedIndex >= 0) {
              add(n, util.getOptionValue(e.options[e.selectedIndex]));
            }
          } else {
            for (j = 0, jlen = e.options.length; j < jlen; j++) {
              o = e.options[j];
              if (o.selected) {
                add(n, util.getOptionValue(o));
              }
            }
          }
        } else if (t.match(/^checkbox|radio$/)) {
          if (e.checked) {
            add(n, e.value);
          }
        } else if (t.match(/^text|password|hidden|textarea$/)) {
          add(n, e.value);
        }
      }
    }
    return c1;
    //return c.join('&');
  };

  util.getText = function(el) {
    var ret, txt = [],
      i = 0;

    if (!el) {
      ret = "";
    } else if (el.nodeType === 3) {
      // No problem if it's a text node
      ret = el.nodeValue;
    } else {
      // If there is more to it, then let's gather it all.
      while (el.childNodes[i]) {
        txt[txt.length] = util.getText(el.childNodes[i]);
        i++;
      }
      // return the array as a string
      ret = txt.join("");
    }
    return ret;
  };


  util.normalizeName = function(n) {
    n = n.toLowerCase();
    n = n.replace(/[^a-zA-Z0-9@]+/g, '');
    return n;
  };

  util.mungeNameToSpiritList = function(n) {
    var i, l, spiritListNames = document.getElementsByName("vqvdy"),
      name;

    spiritListNames = spiritListNames[0].options;
    l = spiritListNames.length;
    for (i = 2; i < l; i++) { // Skip the first two entries, they are junk
      name = util.getOptionValue(spiritListNames[i]);
      name = util.normalizeName(name);

      if (n.indexOf(name) === 0) {
        $$_INSPIRIT = true;
        return name;
      }
    }
  };

  util.getOptionValue = (function() {
    if (document.documentElement) {
      if (document.documentElement.hasAttribute) {
        return function(o) {
          return o.hasAttribute('value') ? o.value : o.text;
        };
      }
      if (document.documentElement.attributes) {
        return function(o) {
          return (o.attributes.value && o.attributes.value.specified) ? o.value : o.text;
        };
      }
    }
  }());

  util.getElementsByClassName = function(className, tag, elm) {
    /* This version of getElementsByClassName is a little brain dead.   
  OK, it is VERY brain dead but it was made to work around some SOI/IE specific
  issues ... mostly that you could post something that was such invalid code
  that none of the other getElmentsByClassName could find it and I have no 
  idea why they couldn't.
  */
    var els, out, i, node, txt;

    if (!tag) {
      tag = "span";
    }
    if (!elm) {
      elm = document;
    }


    els = elm.getElementsByTagName(tag);
    out = [];

    for (i = 0; i < els.length; i++) {
      node = els[i];

      if (node.className === className) {
        //txt = document.createTextNode(["IDX",i,'className', node.className].join(", " ));    
        //node.parentNode.appendChild(txt);
        out.push(node);
      }
    }

    return out;
  };

  function gotoHash() {
    var el = document.getElementById("diceform");
    // Give things a chance to render
    window.setTimeout(function() {
      el.scrollIntoView(true);
    });
  }

  function romanize(num) {
    var date = new Date();
    if (date.getMonth() === 3 && date.getDate() === 1) {
      return num;
    } else {
      return num;
    }
  }

  util.purgeChildren = function(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  };

  window.dicegame2 = (function() {
    var spiritLength, gameData, dataClass = 'dice_data',
      isOurTurn = false,
      maxRolls = 3,
      gameIsReady, handleDiceClick; // Function
    diceRollCalculator = (function() {

      /*Helper function:
  Look through the dice and see if we have 'k' of a kind,
  if so return which face there are 'k' of.

  @param How many dice we are looking for

  @return Which face there were 'k' of a kind for.
  0 if not enough of a kind
  */

      function findDiceOfAKind(k) {
        var i, t = 0,
          l, f, a, face;
        f = gameData.dice.faces;
        a = [];

        l = f.length;

        // Six faces
        for (i = 0; i < 8; i++) {
          a[i] = 0;
        }

        for (i = 0; i < l; i++) {
          face = f[i];
          a[face]++;

          if (a[face] === k) {
            return face;
          }
        }
        return 0;
      }


      function calcYah() {
        var face = findDiceOfAKind(5);
        if (face) {
          return 50;
        }
        return 0;
      }

      /*
  Count up the total dot value of all dice showing
  the given face.  For instance, the total value
  of all 6's.
*/

      function addUpMatchingFaces(n) {
        var i, t = 0,
          l, f;

        f = gameData.dice.faces;
        l = f.length;
        for (i = 0; i < l; i++) {
          if (f[i] === n) {
            t += n;
          }
        }
        return t;
      }

      function addUpAllFaces() {
        var i, t = 0,
          l, f;

        f = gameData.dice.faces;
        l = f.length;
        for (i = 0; i < l; i++) {
          t += f[i];
        }
        return t;
      }

      function calc1() {
        return addUpMatchingFaces(1);
      }

      function calc2() {
        return addUpMatchingFaces(2);
      }

      function calc3() {
        return addUpMatchingFaces(3);
      }

      function calc4() {
        return addUpMatchingFaces(4);
      }

      function calc5() {
        return addUpMatchingFaces(5);
      }

      function calc6() {
        return addUpMatchingFaces(6);
      }

      function calc3K() {
        var face, n;
        face = findDiceOfAKind(3);

        if (face) {
          return addUpAllFaces();

        }
        return 0;
      }

      function calc4K() {
        var face = findDiceOfAKind(4);
        if (face) {
          return addUpAllFaces();

        }
        return 0;
      }

      /*
  Helper function:
  Count how many of each face of dice we have.
  How many 1's, how many 2's, etc.   

  If the dice faces are 
  [0, 1, 2, 2, 3, 4, 5] then
  countDiceFaces(1) will return
  [0, 1, 1, 1, 1, 1, 0]
  and the duplicate '2' is collapsed into a single 2.

  @param A cap to stop counting at. 
  @return An array with how many times each face appears, max of cap.
  */

      function countDiceFaces(cap) {
        var f = gameData.dice.faces,
          a = [],
          face, l = f.length,
          i;

        for (i = 0; i < 8; i++) {
          a[i] = 0;
        }

        for (i = 0; i < l; i++) {
          face = f[i];
          if (face) {
            a[face]++;
            if (a[face] > cap) {
              a[face] = cap;
            }
          }
        }
        return a.join(" ");
      }


      function calcSs() {
        var fs = 30,
          s;

        s = countDiceFaces(1);
        if (s.indexOf("1 1 1 1") !== -1) {
          return fs;
        }

        return $$Y_ALREADY_SCORED && calcYah() ? fs : 0;

      }

      function calcLs() {
        var fs = 40,
          s;
        s = countDiceFaces(1);
        if (s.indexOf("1 1 1 1 1") !== -1) {
          return fs;
        }
        return $$Y_ALREADY_SCORED && calcYah() ? fs : 0;
      }

      function calcFh() {
        var fs = 25,
          s;
        s = countDiceFaces(3);
        if ((s.indexOf("3") !== -1) && (s.indexOf("2") !== -1)) {
          return fs;
        }
        return $$Y_ALREADY_SCORED && calcYah() ? fs : 0;
      }


      function calcChance() {
        return addUpAllFaces();
      }

      return {
        "1": calc1,
        "2": calc2,
        "3": calc3,
        "4": calc4,
        "5": calc5,
        "6": calc6,
        "3k": calc3K,
        "4k": calc4K,
        "ss": calcSs,
        "ls": calcLs,
        "fh": calcFh,
        "y": calcYah,
        "c": calcChance
      };

    }());


    function endGame() {
      gameData.status = "finished";
      gameData.currentPlayer = null;
      soiFormControl.addMessage("Has ended the game");
      soiFormControl.endGame();
      soiFormControl.postAndReload();
    }

    function getEmptyDice() {
      return {
        "faces": [0, 0, 0, 0, 0],
        "reroll": [true, true, true, true, true]
      };
    }

    function getEmptyData() {
      var o = {
        "player": null,
        "1": null,
        "2": null,
        "3": null,
        "4": null,
        "5": null,
        "6": null,
        "up_total": null,
        "bonus": null,
        "3k": null,
        "4k": null,
        "ss": null,
        "ls": null,
        "fh": null,
        "yah_token": null,
        "y": null,
        "c": null,
        "yah_bonus": 0,
        "bot_total": null,
        "g_total": null
      };
      return o;
    }


    function nextPlayer() {
      function makeScoreList() {
        var p = 0,
          out = "",
          playerName, playerData, roman;

        out += "Final scores:<br>";
        while (undefined !== (playerName = gameData.playerList[p])) {
          playerData = gameData["score" + p];
          roman = romanize(playerData.g_total);
          out += "<br>" + playerName + " : " + roman;
          p++;
        }
        return out;
      }


      var i, l, p = gameData.currentPlayer;
      p++; // Move to the next player yet.
      if (!gameData.playerList[p]) {
        p = 0;
        gameData.round++;
      }

      if (gameData.round === 13) {
        gameData.status = "finished";
        gameData.currentPlayer = null;

        soiFormControl.addMessage("Game over!");
        soiFormControl.addMessage(makeScoreList());
        soiFormControl.endGame();
        soiFormControl.postAndReload();
      }

      gameData.currentPlayer = p;
      gameData.rollNumber = 0;
      gameData.dice = getEmptyDice();

      //setStatus(JSON.stringify(gameData));
    }

    function isPlayerGameLord() {
      return ($$_GAMELORDS.indexOf($$_USERNAME) !== -1);
    }

    function isGameInProgress() {
      return gameData && gameData.status && gameData.status === "ready";
    }

    function setStatus(s) {
      var el = document.getElementById('diceStatus');
      el.innerHTML = "";
      if (s.push) {
        s = s.join("");
      }
      el.appendChild(document.createTextNode(s));
    }

    function setPanel(s) {
      var hostEl = document.getElementById("dicepanel");
      if (s.push) {
        s = s.join("");
      }
      hostEl.innerHTML = s;
      gotoHash();
    }


    function getGameAgeState() {
      var gameAge, gameAgeMin, gameDeathAgeMin = 5,
        o; // Outgoing object
      /* If no game data, then we don't need the game age since the
                    game won't be in progress.
                    */
      if (!gameData) {
        return;
      }


      gameAge = (util.getSoiTimeStamp() - gameData.lastPost) / 60;
      gameAgeMin = Math.round(gameAge, 2);

      o = {
        gameAgeMin: gameAgeMin,
        gameDeathAgeMin: gameDeathAgeMin,
        isStale: gameAgeMin >= gameDeathAgeMin,
        gameAge: gameAgeMin
      };

      return o;
    }

    function prepData() {
      var msg, data, i, idx, name;

      data = util.serializeFormUrlencoded(document.getElementById('diceform'));
      setStatus("Starting Game");
      gameData = $$_DEFAULT_DATA;

      idx = 0;
      for (i = 0; i < spiritLength; i++) {
        name = data["player" + i];
        if (name) {
          gameData.playerList.push(name);
          gameData["score" + idx] = getEmptyData();
          idx++;
        }
      }

      gameData.owner = $$_USERNAME;
      gameData.status = "ready";
      gameData.round = 0;

      if (gameData.playerList.indexOf($$_USERNAME) === -1) {
        window.alert("You must be in the game you start!");
        return;
      }

      nextPlayer();

      msg = $$_USERNAME + " has started a new game with the following players:<br>" + gameData.playerList.join(", ");
      soiFormControl.addMessage(msg);
      soiFormControl.startGame();
      soiFormControl.postAndReload();
    }

    function beginNewGame() {
      var gameState = getGameAgeState(),
        o = [],
        spiritListNames, i, l, s, name, names, html;

      if (isGameInProgress()) {
        if (gameState.isStale) {
          alert("Game in progress is stale... you may continue.");
        } else {
          o = ["There is already a game in progress, that is", gameState.gameAgeMin, "minutes stale.  You can start a new game when it gets to be", gameState.gameDeathAgeMin, "minutes stale."];

          alert(o.join(" "));
          return;
        }
      }

      gotoHash();
      spiritListNames = document.getElementsByName("vqvdy");

      if (!spiritListNames) {
        setStatus = "Cannot find spirit list.. bailing";
        return;
      }
      spiritListNames = spiritListNames[0].options;
      l = spiritListNames.length;
      if (l < 3) {
        setStatus("Nobody in the room... ");
      }

      spiritLength = l;

      s = "";
      for (i = 2; i < l; i++) { // Skip the first two entries, they are junk
        name = util.getOptionValue(spiritListNames[i]);
        name = util.normalizeName(name);
        s += "<label>";
        s += "<input type='checkbox' name='player" + i + "' value='" + name + "'> " + name;
        s += "</label><br>";
      }

      html = ["<p>Please choose the people you'd like to play dice with.</p>"];

      html.push(s);
      html.push("<br><button id='diceStartGame'>Start game with selected players</button>");

      setPanel(html);
      document.getElementById('diceStartGame').onclick = prepData;
    }


    function cookieName() {
      var roomname, s;

      roomname = document.getElementsByName('vqxro')[0];
      s = "yahcookie" + "_" + roomname + "_";
      s += $$_USERNAME.replace(/[^a-zA-Z0-9]+/g, '');
      s = s.toLowerCase();
      return s;
    }

    function getCookie(key) {
      return localStorage.getItem(key);
    }

    function setCookie(key, value, expiredays) {
      localStorage.setItem(key, value);
    }

    function isUserPlaying(user) {
      if (!user) {
        user = $$_USERNAME;
      }
      return gameData && gameData.playerList && gameData.playerList.indexOf(user) !== -1;
    }

    function checkIsOurTurn() {
      return gameData && gameData.playerList && gameData.playerList[gameData.currentPlayer] === $$_USERNAME;
    }

    soiFormControl = (function() {

      var lastmsg, // Is this the last message to send?
        hasControlMessage, // Does this form have a control message in it?
        forceGameDump, // Force writing control message, regardless of whose turn it is      
        msg = []; // The messages to send.
      // Work around an IE bug that doesn't
      // execute the post right away, but rather
      // allows other code to keep executing.
      lastmsg = false;
      hasControlMessage = false;
      forceGameDump = false;

      function addMessage(s) {
        if (!lastmsg) {
          s = '<p style="clear:both; margin:0px">' + s + '</p>';
          msg.push(s);
        }
      }

      function addDebugMessage(s) {
        if (!lastmsg) {
          if (false) {
            msg.push("<span class='debugmsg'>" + s + "</span>");
          }
        }
      }

      function addControlMessage(s) {
        var gameId = gameData.gameId,
          s1;
        hasControlMessage = true;
        s = JSON.stringify(s).split("").join(" ");

        s1 = "<span style='display:none' class='control_" + gameId + "'>" + s + "</span>";
        msg.push(s1);
      }

      function postAndReload() {
        lastmsg = true;
        var s, s1;

        gameData.loadedFromPost = gameData.lastPost;
        gameData.lastPost = util.getSoiTimeStamp();

        s1 = JSON.stringify(gameData).split("").join(" ");
        //s1 = JSON.stringify(gameData, null, 2);
        s = "";

        //s += "checkIsOurTurn() = " + checkIsOurTurn();                  
        //s += "DEBUG: This post ID...: " + gameData.lastPost + "<br>"; 
        s += msg.join(" ");

        //s += "<pre>";
        if ((hasControlMessage && forceGameDump) || checkIsOurTurn()) {
          s += "<span style='display:none' class='" + dataClass + "'>" + s1 + "</span>";
        }
        //s += "</pre>";
        //s += "DEBUG: Loaded from post " + gameData.loadedFromPost + "<br>";
        $$_MSGFORM.vqxsp.value = s;
        util.disableInputs();
        $$_MSGFORM.submit();
      }

      function endGame() {
        forceGameDump = true;
        addControlMessage("ENDGAME: true");
      }

      function startGame() {
        forceGameDump = true;
        addControlMessage("STARTGAME: true");
      }

      function dropPlayer(user) {
        forceGameDump = false;
        addControlMessage("DROPPLAYER:" + user);
      }

      return {
        startGame: startGame,
        endGame: endGame,
        dropPlayer: dropPlayer,
        addControlMessage: addControlMessage,
        addMessage: addMessage,
        addDebugMessage: addDebugMessage,
        postAndReload: postAndReload
      };


    }());


    function getDiceHtml(face, reroll, setName) {
      var s, diceSet, ff, color, htmlDiceColors = ["black", "#faebd7", "#eecbad", "#add8e6", "#98fb98", "#eedd82", "#ffb6c1"],
        faceGroup, backgroundColor;

      if (setName) {
        diceSet = diceSets[setName];
      } else {
        if ($$_PLAYERPREF && $$_PLAYERPREF.setName) {
          diceSet = diceSets[$$_PLAYERPREF.setName];
        }
      }

      if (!diceSet) {
        // fallback in case of trouble.
        diceSet = diceSets["default"];
      }

      faceGroup = reroll ? diceSet.marked : diceSet.clear;
      backgroundColor = reroll ? "gray" : "black";

      if (faceGroup) { // Graphical dice
        s = "<img src='" + diceSet.path + faceGroup[face] + "' alt='" + face + "'>";
        return s;
      }

      color = htmlDiceColors[face];

      ff = function(s) {
        return s.replace(/o/g, "&#x25cf;");
      };

      s = '<pre style="background-color: ' + backgroundColor + '; ' + 'color: ' + color + "; " + 'line-height:.5; border:3px solid silver; padding:.25em">';
      s += ff(diceSet.text[face][0]);
      s += "<br>";
      s += ff(diceSet.text[face][1]);
      s += "<br>";
      s += ff(diceSet.text[face][2]);
      s += "</pre>";

      return s;
    }

    function showPlayerScreen() {
      var html, i, s, l, dice, die, face, reroll, fname, canRoll, gameState, diceBar;

      function makeGraphicButton(fname, id, alt, extra) {
        var s = [],
          disabled = "disabled";

        if (canRoll) {
          disabled = "";
        }
        s.push("<button " + disabled + " class='die' id='" + id + "'>");
        if (fname.substring(0, 1) === "<") {
          s.push(fname);
        } else {
          s.push("<img src='" + $$_DEFAULT_IMG_PATH + fname + "' alt='" + alt + "'>");
        }
        s.push("<br>");
        s.push(extra);
        s.push("</button>");
        return s.join("\n");
      }

      isOurTurn = checkIsOurTurn();

      if (isOurTurn) {
        //attachToTalkListen();
      }

      html = [];

      gameState = getGameAgeState();

      if (gameIsReady) {
        html.push("<p>");
        html.push("Game in Progress.");
        if (gameState.isStale) {
          html.push(" ");
          html.push("If this game has been abandoned, feel free to start a new one.");
        }
        html.push("</p>");
      } else {
        html.push("<p>No Game in Progress. Why not start one?</p>");
      }

      if (!$$_INSPIRIT) {
        html.push("<p>You are not in the spirit list.  Post to make things work.</p>");
      }

      //html.push("You are: " + $$_USERNAME + "<br>");
      if (gameIsReady) {
        html.push("It is " + gameData.playerList[gameData.currentPlayer] + "'s turn to play.");
      }
      //html.push("<br>");
      document.getElementById("status_panel").innerHTML = html.join("\n");


      html = [];

      if (gameData.rollNumber !== maxRolls) {
        html.push("Roll # " + gameData.rollNumber + " of " + maxRolls);
      } else {
        html.push("-No More Rolls-");
      }
      html.push("<br>");

      canRoll = isOurTurn && (gameData.rollNumber !== maxRolls) && gameIsReady;

      if (canRoll) {
        html.push("Please choose which dice to roll:");
      } else {
        html.push(" ");
      }
      html.push("<br>");

      html.push("<div id='dicebox'>");

      dice = gameData.dice;

      l = dice.faces.length;
      for (i = 0; i < l; i++) {
        face = dice.faces[i];
        reroll = dice.reroll[i];

        if (!canRoll) {
          reroll = false;
        }
        diceBar = reroll ? "XX" : "--";
        fname = getDiceHtml(dice.faces[i], reroll, null);

        html.push(makeGraphicButton(fname, "die_" + i, face, "[" + diceBar + face + diceBar + "]"));
      }
      if (isOurTurn) {
        html.push(makeGraphicButton('roll.gif', 'rollButton', "Roll", "Roll marked dice"));

        if (isPlayerGameLord()) {
          html.push(makeGraphicButton('roll.gif', 'cheatButton', "Roll", "Cheat!"));
        }

      }
      html.push("</div> <!-- dicebox -->");
      html.push("<div style='clear:both'");

      //setStatus(html);
      setPanel(html);

      if (isPlayerGameLord() && document.getElementById("cheatButton")) {
        document.getElementById("cheatButton").className += " gamelord";
      }

      if (isOurTurn) {
        document.getElementById('dicebox').onclick = handleDiceClick;
        gotoHash();
      }
    }


    function setText() {
      var div, s;

      function makeSpirit2List() {

        var spiritListNames, gb, s, i, l, name, div = document.createElement("div");

        div.appendChild(document.createTextNode("Spirit List"));
        div.appendChild(document.createElement("br"));

        spiritListNames = document.getElementsByName("vqvdy");
        spiritListNames = spiritListNames[0].options;

        l = spiritListNames.length;
        s = "";
        for (i = 2; i < l; i++) { // Skip the first two entries, they are junk
          name = util.getOptionValue(spiritListNames[i]);
          div.appendChild(document.createTextNode(name));
          div.appendChild(document.createElement("br"));
        }

        div.style.cssFloat = "left";

        gb = document.getElementById("gameBoard");
        gb.parentNode.insertBefore(div, gb);
      }


      function makeButton(text, onclick) {
        var span = document.createElement("button");
        //span.className = "but";
        span.appendChild(document.createTextNode(text));
        span.onclick = function() {
          onclick();
          return false;
        };
        return span;
      }


      function dropSelf() {
        if (window.confirm("Do you really want to leave the game?")) {
          soiFormControl.addMessage("Has left the game.");
          soiFormControl.dropPlayer($$_USERNAME);
          soiFormControl.postAndReload();
        }
      }

      function playerControls() {
        var hostEl = document.getElementById("dicepanel"),
          but, img, span, fs = document.createElement("div"),
          setName, set;

        function onclick(_setName) {
          return function() {
            $$_PLAYERPREF.setName = _setName;
            setCookie(cookieName() + "_pref", JSON.stringify($$_PLAYERPREF));
            util.purgeChildren(hostEl);
            showPlayerScreen();
          };
        }

        fs.className = "info";
        hostEl.innerHTML = "PLAYER CONTROLS";

        for (setName in diceSets) {
          if (diceSets.hasOwnProperty(setName)) {
            set = diceSets[setName];
            but = document.createElement("button");
            but.appendChild(document.createTextNode(setName));

            span = document.createElement("span");
            span.innerHTML = getDiceHtml(1, false, setName);
            but.appendChild(span);

            span = document.createElement("span");
            span.innerHTML = getDiceHtml(1, true, setName);
            but.appendChild(span);

            but.onclick = onclick(setName);

            fs.appendChild(but);
            fs.appendChild(document.createElement("br"));
          }
        }

        hostEl.appendChild(fs);
        gotoHash();
      }


      function makeGameControls() {

        var i, bar = " ",
          name, b, div;

        function onclick(_n) {
          return function() {
            soiFormControl.addMessage("Has booted " + _n + " from the game.");
            soiFormControl.dropPlayer(_n);
            soiFormControl.postAndReload();
          };
        }

        div = document.createElement("div");
        div.appendChild(document.createTextNode("Warning: Booting someone during their turn can cause breakage."));

        for (i = 0; i < gameData.playerList.length; i++) {
          b = document.createElement("button");
          b.appendChild(document.createTextNode("Boot: " + gameData.playerList[i]));

          b.onclick = onclick(gameData.playerList[i]);
          div.appendChild(document.createElement("br"));
          div.appendChild(b);
        }

        div.appendChild(document.createElement("br"));

        if (isGameInProgress()) {
          div.appendChild(document.createTextNode(bar));
          div.appendChild(makeButton("End Game", endGame));
        }

        $$_MSGFORM.parentNode.appendChild(div);
      }


      function makeButtons() {
        var s, bar = ' ',
          div, but, isOwner = gameData && gameData.owner && gameData.owner === $$_USERNAME;

        div = document.createElement("div");
        div.appendChild(makeButton("Start Game", beginNewGame));
        div.appendChild(makeButton("Player Controls", playerControls));


        //if (isOwner && isGameInProgress() ) {
        //  div.appendChild(document.createTextNode(bar));
        //  div.appendChild(makeButton("End Game", endGame));
        //}                    
        if (isUserPlaying() && isGameInProgress()) {
          div.appendChild(document.createTextNode(bar));
          div.appendChild(makeButton("Leave Game", dropSelf));
        }

        if ((isOwner || isPlayerGameLord()) && isGameInProgress()) {
          if (isOwner) {
            but = makeButton("Game Controls - Game Owner", makeGameControls);
          } else {
            but = makeButton("Game Controls - Game Lord", makeGameControls);
            but.className = "gameLord";
          }
          div.appendChild(document.createTextNode(bar));
          div.appendChild(but);
        }

        $$_MSGFORM.parentNode.appendChild(div);
      }


      div = document.createElement("div");
      div.id = "status_panel";
      $$_MSGFORM.parentNode.appendChild(div);

      makeButtons();

      s = "If you post in the room and its ignored, don't take it personally. " + "As fast as this room can move, it is -very- easy to miss posts...";

      div = document.createElement("div");
      div.appendChild(document.createTextNode(s));
      div.className = "transbox";

      $$_MSGFORM.parentNode.appendChild(div);

      showPlayerScreen();
      makeSpirit2List();
    }


    function showBoard(hostElement) {
      var i, j, li, lj, playerName, playerData, line, style, exitLoop, val, but, table, tbody, tr, td, id, hintGizmo, gb;

      function calcTotals() {
        var scores;

        function gv(k) {
          var v = scores[k];
          if (v) {
            return +v;
          }
          return 0;
        }

        scores = gameData["score" + gameData.currentPlayer];
        scores.up_total = gv('1') + gv('2') + gv('3') + gv('4') + gv('5') + gv('6');
        scores.bonus = scores.up_total >= 63 ? 35 : 0;
        scores.bot_total = gv("3k") + gv("4k") + gv("ss") + gv("ls") + gv("fh") + gv("yah_token") + gv("y") + gv("c");
        scores.g_total = scores.up_total + scores.bonus + scores.bot_total + scores.yah_bonus;
      }


      function handleScoreButtonClick(e) {
        e = e || window.event;
        var target = e.target || e.srcElement,
          s, msg, i, l, data = target.id.split("_"),
          playerData = gameData["score" + gameData.currentPlayer],
          isYah = !!diceRollCalculator.y();


        l = boardData.length;
        for (i = 0; i < l; i++) {

          if (boardData[i].id === data[1]) {
            s = boardData[i].name;
            break;
          }
        }

        msg = "Score: " + data[2] + " points on " + s;

        soiFormControl.addMessage(msg);

        if (isYah && $$Y_ALREADY_SCORED) {
          playerData.yah_bonus += 100;
          soiFormControl.addMessage("Yahtzee Bonus!");
        }

        playerData[data[1]] = +data[2];

        calcTotals();
        nextPlayer();

        soiFormControl.startGame();
        soiFormControl.postAndReload();
      }


      function makeScoreButton(line, id) {
        var roman, val, but, td, s;

        //jjz
        val = diceRollCalculator[line.id]();
        roman = romanize(val);

        but = document.createElement("button");
        td = document.createElement("td");
        but.id = ['score', id, val].join("_");
        s = roman.toString();
        but.appendChild(document.createTextNode(s));
        td.appendChild(but);
        but.className = "scoreButton";
        but.title = val;
        but.onclick = handleScoreButtonClick;
        return td;
      }

      table = document.createElement("table");
      tbody = document.createElement("tbody");
      table.className = "dice_tbl";

      function mTd(val) {
        var roman = val,
          td;
        if (+val.toString() === val) {
          roman = romanize(val);
        }

        td = document.createElement("td");
        if (val !== "-") {
          td.appendChild(document.createTextNode(roman));
        } else {
          td.appendChild(document.createElement("hr"));
        }
        td.style.textAlign = "right";
        return td;
      }

      table.appendChild(tbody);

      li = boardData.length;
      lj = gameData.playerList.length;
      isOurTurn = checkIsOurTurn();

      for (i = 0; i < li; i++) {
        line = boardData[i];
        tr = document.createElement("tr");

        id = line.id;
        style = line.style;
        exitLoop = false;

        val = line.name;
        if (style && style === "blank") {
          val = "-";
        }
        td = mTd(val);
        tr.appendChild(td);


        if (line.hint) {
          hintGizmo = document.createElement("span");
          hintGizmo.appendChild(document.createTextNode("?"));
          td.appendChild(hintGizmo);

          hintGizmo.className = "hint";
          tr.title = line.hint;
        }

        for (j = 0; j < lj; j++) {
          if (exitLoop) {
            break;
          }

          td = undefined;
          playerName = gameData.playerList[j];
          playerData = gameData["score" + j];

          if (style && style === "player") {
            td = mTd(gameData.playerList[j]);
          }

          if (!id && !td) {
            td = mTd("-");
          }

          if (isOurTurn && !td && playerName === $$_USERNAME) {
            val = playerData[id];
            if (val !== null) {
              td = mTd(val);
            } else if (diceRollCalculator[line.id]) {
              //jjz
              td = makeScoreButton(line, id);
            } else {
              td = mTd("0");
            }
          }

          if (!td) {
            val = playerData[id];
            if (val === null) {
              val = "\u00A0";
            }
            td = mTd(val);
          }
          tr.appendChild(td);

        }
        tbody.appendChild(tr);
      }

      gb = hostElement || document.getElementById('gameBoard');
      util.purgeChildren(gb);
      gb.appendChild(table);
    }

    function htmlToGameData(el) {
      var txt, data;
      txt = util.getText(el);
      txt = txt.replace(/\|/g, "");
      txt = txt.replace(/ /g, "");
      data = JSON.parse(txt);
      return data;
    }


    function findCurrentGame() {
      /*
    Look through the SOI page and find the current game in progress.
    */
      var i, l, data, el, playerData;

      function processControlMessages() {
        /* Look for any control messages that persist to the current
      gameId. If so, process the control message and update
      whatever data needs updated.
      */

        var i, l, txt, data, gameId = gameData.gameId,
          dataClass = 'control_' + gameId,
          idx, command, target, tmp, el = util.getElementsByClassName(dataClass);

        if (!el) {
          return;
        }
        l = el.length;
        for (i = 0; i < l; i++) {
          data = htmlToGameData(el[i]);
          if (!data) {
            continue;
          }

          tmp = data.split(":");
          command = tmp[0];
          target = tmp[1];

          if (command === "DROPPLAYER") {
            idx = gameData.playerList.indexOf(target);
            if (idx !== -1) {
              gameData["score" + idx].dropped = true;
              gameData["score" + idx].g_total = "N/A";
            }
          }

          if (command === "ENDGAME") {
            gameData.status = "finished";
          }
        }
      }

      el = util.getElementsByClassName(dataClass);
      if (!el) {
        return;
      }


      l = el.length;
      for (i = 0; i < l; i++) {
        data = htmlToGameData(el[i]);
        if (!data) {
          continue;
        }

        gameData = data;
        gameIsReady = gameData.status === "ready";

        if (gameIsReady) {
          processControlMessages();
          playerData = gameData["score" + gameData.currentPlayer];


          if (!playerData) {
            soiFormControl.addMessage("There has been a major bug." + " Player data not found in /findCurrentGame/." + " Going into panic shutdown.  Sorry.");
            gameData = $$_DEFAULT_DATA;
            gameIsReady = false;
            endGame();
            //jjz
            return undefined;
          }


          while (playerData.dropped) {
            soiFormControl.addDebugMessage("Skipping player:" + gameData.playerList[gameData.currentPlayer]);
            nextPlayer();
            if (!isGameInProgress()) { /* nextPlayer might have ended the game */
              break;
            }
            playerData = gameData["score" + gameData.currentPlayer];
          }

          if (playerData) {
            $$Y_ALREADY_SCORED = (+playerData.y > 0);
          }
        }

        return true;
      }
      return undefined;
    }

    function handleCheat() {
      soiFormControl.addMessage("<span class='cheatnote'>Has decided to cheat  Must be testing something...</span>");
      var i, l, dice = gameData.dice,
        diceHtml = "",
        data, data2, a = []; //Track which dice are being re-rolled
      l = dice.faces.length;


      data = window.prompt("New roll?", "66666");
      if (!data) {
        return;
      }
      data = data.replace(/ /g, "");
      data2 = data.split("");

      for (i = 0; i < l; i++) {
        a.push(i + 1);
        dice.faces[i] = +data2[i];
        diceHtml += getDiceHtml(dice.faces[i], false, null) + "&nbsp;&nbsp";

      }

      diceHtml += '<p style="clear:both"></p>';
      soiFormControl.addMessage("Rerolled dice in positions: " + a.join(","));
      soiFormControl.addMessage(diceHtml);
      soiFormControl.postAndReload();
    }

    function handleRoll(firstRoll) {
      if (gameData.rollNumber >= maxRolls) {
        alert("No rolls left");
        return;
      }



      //alert(printStackTrace());
      soiFormControl.addMessage("<i>Rolled dice</i>: Roll #" + (gameData.rollNumber + 1));
      var saveData, i, l, dice = gameData.dice,
        diceHtml, a = []; //Track which dice are being re-rolled
      l = dice.faces.length;
      diceHtml = "<pre>";

      for (i = 0; i < l; i++) {
        if (dice.reroll[i] || firstRoll) {
          a.push(i + 1);
          dice.faces[i] = util.rollD6();
          if (firstRoll) {
            dice.reroll[i] = false;
          }
        }
        diceHtml += '<pre style="float:left; margin-left: 0.5em; margin-right: 0.5em;">';
        diceHtml += getDiceHtml(dice.faces[i], false, null);
        diceHtml += '</pre>';
      }
      diceHtml += '</pre>';
      gameData.rollNumber++;

      /* Ok, the player has rolled.  Lets take just the most important
 information and store it away in a cookie to be checked later on a
  page reload.
  */
      saveData = {
        rollNumber: gameData.rollNumber,
        round: gameData.round,
        gameId: gameData.gameId,
        dice: dice
      };

      setCookie(cookieName(), JSON.stringify(saveData));

      soiFormControl.addMessage("Rolled dice in positions: " + a.join(","));
      soiFormControl.addMessage(diceHtml);
      showPlayerScreen();
      showBoard();
    }

    handleDiceClick = function(e) {
      e = e || window.event;
      var idx, target = e.target || e.srcElement;

      while (target && target.tagName.toLowerCase() !== 'button') {
        target = target.parentNode;
      }


      // Catch disabled buttons.  There seems to be an issue in some
      // versions of IE that recogonize a click on a disabled button.
      // May as well catch it for everybody, it can't do any harm.                  
      if (target.disabled) {
        return;
      }

      idx = target.id.split("_")[1];
      if (idx) {
        gameData.dice.reroll[idx] = !gameData.dice.reroll[idx];
        showPlayerScreen();
      }

      if (target.id === 'rollButton') {
        handleRoll();
      }

      if (target.id === 'cheatButton') {
        handleCheat();
      }
    };

    function loadCookieData() {
      /* See if the player has any data saved for this turn that
                    might indicate they have rolled on this turn already.
                    This -could- mean the player navigated away from the page
                    and returned in and attempt to cheat, or it could mean the
                    player had a genuine computer problem.
                    */
      var playerData = gameData["score" + gameData.currentPlayer],
        saveData2 = getCookie(cookieName()),
        saveData;

      try {
        saveData = JSON.parse(saveData2);
      } catch (e) {
        saveData = null;
      }

      if (!saveData) {
        soiFormControl.addMessage("Cookies not enabled or they were corrupted (or the first turn of the game).");
        soiFormControl.addDebugMessage("This message is not unusual for the very first turn of the game. " + "if they haven't played in a while the cookie may have expired. " + "Getting this message mid game is more unusual.");
      } else if ((gameData.gameId === saveData.gameId) && (gameData.round === saveData.round)) {
        gameData.dice = saveData.dice;
        gameData.rollNumber = saveData.rollNumber;
        soiFormControl.addMessage("Reloading dice from saved data.");
        soiFormControl.addMessage("Found data from roll: " + saveData.rollNumber);
        soiFormControl.addMessage(JSON.stringify(gameData.dice.faces));
        soiFormControl.addDebugMessage("This message means the player reloaded the page during their turn. " + "They could have either navigated away from the page and come back or " + "their browser may have crashed and needed reopened.  Either way the " + "cookies did exactly what they should have done.");
        //soiFormControl.addMessage("Cookie Data: " + JSON.stringify(saveData, null, 2));
        soiFormControl.startGame();
        soiFormControl.postAndReload();
        return true;
      } else {
        soiFormControl.addDebugMessage("Found old cookie.  (Everything is working properly.  The cookie was found from an old turn and is ignored.)");
      }
    }


    function init() {
      var haveGame, z;

      function gatherGlobalData() {

        var e, // Element reference        
          n; // user name
        $$_SUBMIT = document.getElementsByName("vqvaj")[0];
        $$_TIMESTAMP = document.getElementsByName("vqxti")[0].value;

        $$_DEFAULT_DATA = {
          "gameId": $$_TIMESTAMP,
          "playerList": [],
          "rollNumber": 0,
          "currentPlayer": -1,
          "dice": getEmptyDice()
        };
        e = document.getElementsByName("vqxsp")[0];
        if (e) {
          $$_MSGFORM = e.parentNode;
        }
        e = document.getElementsByName("vqxha")[0];
        if (e) {
          $$_USERNAME = util.normalizeName(e.value);
          n = util.mungeNameToSpiritList($$_USERNAME);
          if (n) {
            $$_USERNAME = n;
          }
        }
      }

      gatherGlobalData();

      if ($$_SUBMIT && $$_SUBMIT.disabled) {
        util.disableInputs();
      }

      if (!$$_MSGFORM) {
        return;
      }

      haveGame = findCurrentGame();
      if (haveGame) {
        if (checkIsOurTurn()) {
          if (gameData.rollNumber === 0) {
            if (loadCookieData()) {
              return;
            }
          }
        }
      }


      z = getCookie(cookieName() + "_pref");
      try {
        $$_PLAYERPREF = JSON.parse(z);
      } catch (e) {
        $$_PLAYERPREF = {};
      }
      if (!$$_PLAYERPREF) {
        $$_PLAYERPREF = {};
      }

      if (!gameData) {
        gameData = $$_DEFAULT_DATA;
      }

      showBoard();

      setText();

      if (checkIsOurTurn() && isGameInProgress()) {
        if (gameData.rollNumber === 0) {
          handleRoll(true);
        }
      }

      /*
      //setWhisperStatus();
      renderReveal();
      */
    }

    function registerGameLord(s) {
      $$_GAMELORDS.push(s);
    }

    function registerDice(name, code) {
      diceSets[name] = code;
    }

    return {
      init: init,
      registerGameLord: registerGameLord,
      registerDice: registerDice
    };
  }());

  util.appendStyle(".scoreButton {width:100%; text-align:right;}");
  util.appendStyle("table.dice_tbl, table.dice_tbl td  {  border: 1px solid black;}");
}());