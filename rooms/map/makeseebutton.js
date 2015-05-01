(function () {

  var URL_TO_MAP_PAGE = "http://70.228.78.205:1701/fakesoi/rooms/map/mapedit.html";

  function waitForLoad() {
    var el = document.getElementsByName("vqxfi");
    if (el === null) {
      // The document isn't ready yet
      window.setTimeout(waitForLoad);
    } else {
      makeButton();
    }
  }
  window.setTimeout(waitForLoad);


  function makeButton() {  
    var el = document.getElementsByName("vqxfi")[0];
    var form = el.form;
	var link;
	
	el = document.getElementById('putSeeMapHere');
	el.innerHTML = "";
	
	var link = document.createElement("a");
	link.href = URL_TO_MAP_PAGE;
	link.hash = serialize(form);
    link.appendChild(document.createTextNode("See Map"));
    el.appendChild(link);
  }
function serialize(form) {
        if (!form || form.nodeName !== "FORM") {
                return;
        }
        var i, j, q = [];
        for (i = form.elements.length - 1; i >= 0; i = i - 1) {
                if (form.elements[i].name === "") {
                        continue;
                }
                switch (form.elements[i].nodeName) {
                case 'INPUT':
                        switch (form.elements[i].type) {
                        case 'text':
                        case 'hidden':
                        case 'password':
                        case 'button':
                        case 'reset':
                        case 'submit':
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                                break;
                        case 'checkbox':
                        case 'radio':
                                if (form.elements[i].checked) {
                                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                                }                                               
                                break;
                        case 'file':
                                break;
                        }
                        break;                   
                case 'TEXTAREA':
                        q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                        break;
                case 'SELECT':
                        switch (form.elements[i].type) {
                        case 'select-one':
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                                break;
                        case 'select-multiple':
                                for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
                                        if (form.elements[i].options[j].selected) {
                                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].options[j].value));
                                        }
                                }
                                break;
                        }
                        break;
                case 'BUTTON':
                        switch (form.elements[i].type) {
                        case 'reset':
                        case 'submit':
                        case 'button':
                                q.push(form.elements[i].name + "=" + encodeURIComponent(form.elements[i].value));
                                break;
                        }
                        break;
                }
        }
        return q.join("&");
}
  }());