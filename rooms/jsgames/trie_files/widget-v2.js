function PostRankWidget(options) {
  this.options = options;

  if (!PostRankWidget.instances) PostRankWidget.instances = [];
  this.id = PostRankWidget.instances.length;
  PostRankWidget.instances[this.id] = this;

  PostRankWidget.loadCSS(document, PostRankWidget.apiHost + 'widget-v2.css');

  this.makeFrame();

  if (this.options['theme'] != 'diy') PostRankWidget.loadCSS(this.doc, PostRankWidget.apiHost + 'widget-v2.css');

  if (this.options['theme'] != 'diy') {
    var widget = this;
    PostRankWidget.addOnResize(function () {
      widget.changeHeight();
    });
  }

  if(this.options.contextual) {
    this.display(this.getTags());
  } else {
    this.display();
  }

} //end PostRankWidget
PostRankWidget.searchString = "Search this site";
PostRankWidget.apiHost = "http://api.postrank.com/static/";

// Inspired by : http://ghill.customer.netspace.net.au/freshtags/
PostRankWidget.prototype.getTags = function () {
  function filterTags(tags) {
    if (!tags) return '';
    tags = tags.replace(/[!?\"#]/g, '');
    /* TODO: Should actually check if combinations return results, instead of this ugly hack. */
    var black = 'also another could every find from have here into I just many more most much next only really same should show still such that their them then there these they thing this those very well were what when where which while will with without would';
    var white = 'art bbc css diy irc job fun law log mac map net osx pda php rdf rss tag tax tv web win xml vm';

    // Add short words to blacklist
    var pattern = new RegExp('\\b([a-z]{1,3})\\b', 'g');
    if ((newblack = tags.match(pattern))) black += ' ' + newblack.join(' ');

    // Remove whitelist from blacklist
    pattern = new RegExp('\\b(' + white.replace(/ +/g, '|') + ')\\b', 'ig');
    black = black.replace(pattern, '');

    pattern = new RegExp('\\b(' + black.replace(/ +/g, '|') + ')\\b', 'ig');
    return tags.replace(pattern, '').replace(/ +/g, ' ').replace(/^[\s\+]|[\s\+]$/g, '').split(' ').unique().join(' OR ');
  } //end filterTags

  function extractTags(source, names) {
    var pattern, tag;
    for (i in names) {
      try {
        if (source.indexOf('http:') == 0) // path
          pattern = new RegExp('[/]' + names[i] + '[/]([^&/?]*)', 'i');
        else // query string
          pattern = new RegExp('[?&]' + names[i] + '[=]([^&]*)', 'i');
      } catch(ex) {}

      if (pattern && (tag = pattern.exec(source))) return filterTags(unescape(tag[1]).replace(/\+/g, ' '));
    }
    return '';
  } //end extractTags
  var refer = document.referrer;
  var query = '';
  var path = refer;
  if ((ref = refer.indexOf('?')) > 0) {
    path = refer.substring(0, ref + 1);
    query = refer.substring(ref);
  }

  var reltags, tags = [];
  if ((reltags = document.getElementsByAttribute('rel', 'tag', true))) {
    var i, tags = [];
    for (i = 0; i < reltags.length; i++) {
      tags.push(reltags[i].href.match(/^[a-z]+:\/\/[^\/#?]+\/[^#?]*?([^#?\/]+)(?:[#?]|\/$|$)/)[1]);
    }
  }

  return extractTags(location.search, ['tags', 'tag', 'cat', 'label']) || extractTags(query, ['tags', 'q', 'p', 'tag', 'cat', 'query', 'search', 'topics', 'topic', 'label']) || extractTags(path, ['tag', 'tags', 'cat', 'category', 'wiki', 'search', 'topics', 'topic']) || filterTags(tags.join(' '));
} //end getTags

PostRankWidget.prototype.display = function (query) {
  var html = '\n<div id="prwidget-' + this.id + '" class="postrank-widget' + (this.options['theme'] == 'diy' ? '-diy' : '') + ' ' + this.options['theme'] + (this.options['hasLink'] ? ' has-pr-link' : '') + '">\n';
  if (this.options['theme'] != 'diy') html += '  <div class="pr_widget-roundedTop"><div class="pr_clearTopLeft"></div><div class="pr_solidMiddle"></div><div class="pr_clearTopRight"></div></div>\n';
  html += '  <div class="pr_widget-innerContainer" id="pr_widget-innerContainer-' + this.id + '">';
  html += '    <h2>Top Posts<a href="http://www.postrank.com/publishers" class="postrank-minilogo" target="_top"><small> - PostRank</small></a></h2>\n';
  html += '    <div id="prwidget-' + this.id + '-posts-wrapper" class="postrank-posts-wrapper">\n';
  if (this.options['theme'] != 'diy') html += '      <div class="pr_widget-corners"><div class="pr_widget-topLeft"></div><div class="pr_widget-topRight"></div><div class="pr_widget-bottomLeft"></div><div class="pr_widget-bottomRight"></div></div>';
  html += '    <div class="postrank-search-wrapper"><input id="prwidget-' + this.id + '-search" class="postrank-search defaultText" type="text" value="' + PostRankWidget.searchString + '" /></div>\n';
  html += '      <ul id="prwidget-' + this.id + '-posts" class="postrank-posts"></ul>';
  html += '    </div>\n';
  html += '  </div>';
  if (this.options['theme'] != 'diy') html += '  <div class="pr_widget-roundedBottom"><div class="pr_clearBottomLeft"></div><div class="pr_solidSpecialMiddle"></div><div class="pr_clearBottomRight"></div></div>';
  html += '</div>\n';
  html += '<!--[if lte IE 6]>';
  html += '<style type="text/css">'
  html += '      .postrank-posts-wrapper {  height: 0;  he\ight: auto;  zoom: 1;}';
  html += '      .postrank-widget .postrank-posts li a.postrank-value{ background: #fff url( ' + PostRankWidget.apiHost + 'widgetSprite.gif ) no-repeat 0 0; float: left; margin-left: -15px;}';
  html += '      .postrank-posts-wrapper .pr_widget-corners .pr_widget-bottomLeft, .postrank-posts-wrapper .pr_widget-corners .pr_widget-bottomRight { display: none; }';
  html += '</style>';
  html += '<![endif]-->';
  this.wrapper.innerHTML = (html);

  var search_box = this.doc.getElementById('prwidget-' + this.id + '-search');
  var widget = this;
  search_box.onfocus = function () {
    if (this.value == PostRankWidget.searchString) {
      this.value = '';
      PostRankWidget.removeClass(this, 'defaultText');
    }
  };

  search_box.onblur = function () {
    if (this.value.match(new RegExp('^\\s*$'))) {
      this.value = PostRankWidget.searchString;
      PostRankWidget.addClass(this, 'defaultText');
    }
  };

  search_box.onkeyup = function () {
    clearTimeout(PostRankWidget.timeout_id);
    PostRankWidget.timeout_id = setTimeout(function () {
      var filter = search_box.value;
      widget.getTopPosts(filter);
    }, 500); //wait .5 seconds before applying filter
  };

  var filter = (search_box.value && search_box.value != PostRankWidget.searchString) ? search_box.value : query;
  widget.setLoading();
  widget.getTopPosts(filter, query);
}

PostRankWidget.prototype.renderContextual = function (data) {
    if (data['items'].length == 0) {
      this.getTopPosts();
    } else {
      this.render(data);
    }
}

PostRankWidget.prototype.render = function (data) {
  var html = '';
  var search_box = this.doc.getElementById('prwidget-' + this.id + '-search');
  for (var i = 0; i < data['items'].length; i++) {
    var item = data['items'][i];
    item.title = PostRankWidget.escapeXSS(item.title);

    if (!item.postrank) continue;
    html += '      <li>\n';
    html += '        <a class="postrank-value" style="background-color:' + item.postrank_color + ';" href="' + item.link + '" title="PostRank" target="_top">';
    html += item.postrank.toFixed(1);
    html += '</a>\n';
    html += '        <a class="postrank-title" href="' + item.link + '"';
    html += ' title="' + item.title + '" target="_top">' + item.title + '</a>\n';
    html += '      </li>\n';
  }
  if (data['items'].length == 0) {
    html += '      <li>No posts found.</li>\n';
  }
  var widget = this;
  var posts = this.doc.getElementById('prwidget-' + this.id + '-posts')
  PostRankWidget.removeClass(posts, "loading");
  posts.innerHTML = html;
  if (this.options['theme'] != 'diy') {
    var wrapper = this.doc.getElementById('prwidget-' + this.id);
    wrapper.style.minWidth = document.getElementById('prwidget-' + this.id + '-wrapper').offsetWidth + 'px';
    if (!this.minHeight) {
      this.minHeight = posts.offsetHeight;
      posts.style.minHeight = this.minHeight + 'px';
    }
    setTimeout(function () {
      wrapper.style.minWidth = '';
      widget.changeHeight();
    }, 0);
  }
} //end function aiderss_top_posts_widget_step2
PostRankWidget.prototype.changeHeight = function () {
  var widget = this;
  setTimeout(function () {
    var height = widget.doc.getElementById("pr_widget-innerContainer-" + widget.id).offsetHeight;

    // outside iframe
    widget.frame.style.height = (height + 10) + 'px';
    document.getElementById("prwidget-" + widget.id + "-wrapper").style.height = height + 'px';
  }, navigator.userAgent.indexOf('MSIE') != -1 ? 200 : 0); //IE Race condition
}

PostRankWidget.prototype.getTopPosts = function (query, first) {
  if (!query || query == PostRankWidget.searchString) query = "";
  this.doc.getElementById('prwidget-' + this.id + '-search').value = query;
  this.setLoading();

  var query = 'http://api.postrank.com/v2/feed/' + this.options['feed_hash'] + '/topposts?appkey=postrank.com/widget&format=json&num=' + this.options['num'] + '&q=' + query + '&callback=PostRankWidget.instances[' + this.id + ']';

  if (first) {
      PostRankWidget.getJSON(query + '.renderContextual');
    } else {
      PostRankWidget.getJSON(query + '.render');
  }
}

PostRankWidget.prototype.setLoading = function () {
  var posts = this.doc.getElementById('prwidget-' + this.id + '-posts');
  PostRankWidget.addClass(posts, "loading");
  posts.innerHTML = '';
  if (this.minHeight && navigator.appName == 'Microsoft Internet Explorer' && parseFloat(navigator.appVersion) < 7) posts.style.height = this.minHeight + 'px'; //for IE6, which doesn't support CSS minHeight
}

PostRankWidget.loadCSS = function (doc, url) {
  var css = doc.createElement('link');
  css.rel = 'stylesheet';
  css.type = 'text/css';
  css.media = 'screen';
  css.href = url;
  doc.getElementsByTagName('head')[0].appendChild(css);
}

PostRankWidget.getJSON = function (url, id) {
  var s = document.createElement('script');
  s.src = url;
  s.type = 'text/javascript';
  if (id) s.id = id;
  document.getElementsByTagName('head')[0].appendChild(s);
}

PostRankWidget.prototype.makeFrame = function () {
  document.write('<div id="prwidget-' + this.id + '-wrapper" class="postrank-wrapper"></div>');
  var wrapper = document.getElementById('prwidget-' + this.id + '-wrapper');
  if (this.options['theme'] == 'diy') {
    this.frame = window;
    this.doc = document;
    this.wrapper = wrapper;
  } else {
    var html = '<iframe id="prwidget-' + this.id + '-iframe" class="postrank-iframe" name="prwidget-' + this.id + '-iframe" frameborder="0" style="border-width: 0px; width: 100%; overflow: hidden;" allowtransparency="true" ></iframe>';
    html += '<!--[if lte IE 6]><style type="text/css">';
    html += '  .powered-by-postrank-wrapper .pr_bottomCornerSet { display: none; }';
    html += '  .powered-by-postrank { border-bottom: solid 1px; }';
    html += '  .powered-by-postrank a { background-image: url( ' + PostRankWidget.apiHost + 'powered.gif ); }';
    html += '  .postrank-widget.springMeadows .powered-by-postrank a, .postrank-widget.hotChocolate .powered-by-postrank a, .postrank-widget.siren .powered-by-postrank a, .postrank-widget.pimento .powered-by-postrank a { background-image: url( ' + PostRankWidget.apiHost + 'poweredAlt.gif ); }';
    html += '</style><![endif]-->';
    html += '<!--[if lte IE 7]><style type="text/css">.powered-by-postrank-wrapper { margin-top: -8px; }</style><![endif]-->';
    wrapper.innerHTML = html;
    var frame = document.getElementById('prwidget-' + this.id + '-iframe');
    this.frame = frame;
    this.doc = this.getDocument(frame);
    this.doc.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html><head><title>PostRankWidget</title></head><body id="prwidget-body" style="overflow: hidden"></body></html>');
    this.wrapper = this.doc.body;
    this.doc.close();
  }
}

PostRankWidget.prototype.getDocument = function (frame) {
  var doc = null;
  if (frame.contentDocument) doc = frame.contentDocument;
  else if (frame.contentWindow) doc = frame.contentWindow.document;
  else if (frame.document) doc = frame.document;
  else throw "Document not initialized";
  return doc;
}

PostRankWidget.addOnResize = function (func) {
  var orig = window.onresize;
  window.onresize = function () {
    if (typeof orig == 'function') orig();
    func();
  }
}

PostRankWidget.escapeXSS = function (text) {
  text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  return text;
}

// http://www.openjs.com/scripts/dom/class_manipulation.php
PostRankWidget.hasClass = function (ele, cls) {
  return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
PostRankWidget.addClass = function (ele, cls) {
  if (!PostRankWidget.hasClass(ele, cls)) ele.className += " " + cls;
}
PostRankWidget.removeClass = function (ele, cls) {
  if (PostRankWidget.hasClass(ele, cls)) {
    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

// From http://codingforums.com/showthread.php?t=26744
if (!document.getElementsByAttribute) {
  // document.getElementsByAttribute([string attributeName],[string attributeValue],[boolean isCommaSeparatedList:false])
  document.getElementsByAttribute = function (attrN, attrV, multi) {
    attrV = attrV.replace(/\|/g, '\\|').replace(/\[/g, '\\[').replace(/\(/g, '\\(').replace(/\+/g, '\\+').replace(/\./g, '\\.').replace(/\*/g, '\\*').replace(/\?/g, '\\?').replace(/\//g, '\\/');
    var multi = typeof multi != 'undefined' ? multi : false,
    cIterate = typeof document.all != 'undefined' ? document.all : document.getElementsByTagName('*'),
    aResponse = [],
    re = new RegExp(multi ? '\\b' + attrV + '\\b' : '^' + attrV + '$'),
    i = 0,
    elm;
    while ((elm = cIterate.item(i++))) {
      if (re.test(elm.getAttribute(attrN) || '')) aResponse[aResponse.length] = elm;
    }
    return aResponse;
  }
}

if(!Array.prototype.indexOf){
  Array.prototype.indexOf = function(obj) {
    for(var i=0; i<this.length; i++) {
      if(this[i]==obj) {
        return i;
      }
    }
    return -1;
  }
}

if (!Array.prototype.unique) {
  Array.prototype.unique = function (b) {
    var a = [], i, l = this.length;
    for (i = 0; i < l; i++) {
      if (a.indexOf(this[i], 0, b) < 0) {
        a.push(this[i]);
      }
    }
    return a;
  };
}
