/* exported post */
/* exported validate */
/* exported serialize */
/* exported secureSend */
(function(window) {
    'use strict';

    window.getJSON = function(file, callback) {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {

            if (request.readyState === 4 && request.status === 200) {
                callback(JSON.parse(request.responseText));
            }
        };

        request.onerror = function(err) {
            void(err);
            //window.alert('Error: ' + JSON.stringify(err.message));
        };

        request.open('GET', file, true);
        request.send();
    };

    window.postJSON = function(file, data, callback) {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {

            if (request.readyState === 4 && request.status === 200) {
                callback(JSON.parse(request.responseText));
            }
        };

        request.onerror = function(err) {
            void(err);
            //window.alert('Error: ' + JSON.stringify(err.message));
        };

        request.open('POST', file, true);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        request.send(JSON.stringify(data));
    };

    /**
     * Calculate a 32 bit FNV-1a hash
     * Found here: https://gist.github.com/vaiorabbit/5657561
     * Ref.: http://isthe.com/chongo/tech/comp/fnv/
     *
     * @param {string} str the input value
     * @param {boolean} [asString=false] set to true to return the hash value as
     *     8-digit hex string instead of an integer
     * @param {integer} [seed] optionally pass the hash of the previous chunk
     * @returns {integer | string}
     */
    window.hashFnv32a = function(str, asString, seed) {
        /*jshint bitwise:false */
        let i, l,
            hval = (seed === undefined) ? 0x811c9dc5 : seed;

        for (i = 0, l = str.length; i < l; i++) {
            hval ^= str.charCodeAt(i);
            hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
        }
        if (asString) {
            // Convert to 8 digit hex string
            return ('0000000' + (hval >>> 0).toString(16)).substr(-8);
        }
        return hval >>> 0;
    };

    window.getQueryVariable = function(variable) {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) === variable) {
                return decodeURIComponent(pair[1]);
            }
        }
    };

    window.removeNodes = function(nodes) {
        [].forEach.call(nodes, n => {
            n.parentNode.removeChild(n);
        });
    };
}(window));

const validate = (function() {

    const rules = {};
    const IS_VALID = true;
    const IS_NOT_VALID = false;

    rules.required = ((input) => {
        const val = input.value;
        if (val) {
            return IS_VALID;
        }
        return IS_NOT_VALID;
    });

    function validateField(input) {
        let fieldState = IS_VALID;
        Object.keys(rules).forEach((rule) => {
            const ruleMessage = input.getAttribute(`data-val-${rule}`);
            if (!ruleMessage) {
                return;
            }

            const state = rules[rule](input);
            const messageContainer = document.querySelector(`[data-val-for=${input.id}]`);
            if (state === IS_VALID) {
                messageContainer.innerHTML = '';
            } else {
                messageContainer.innerHTML = ruleMessage;
                fieldState = IS_NOT_VALID;
            }
        });
        return fieldState;
    }

    function attachAll(form) {
        const inputs = form.querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            input.addEventListener('blur', function() {
                validateField(this);
            }, false);
        }
    }

    function verifyForm(form) {
        let formState = IS_VALID;
        const inputs = form.querySelectorAll('input');
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            const state = validateField(input);

            if (state === IS_NOT_VALID) {
                formState = IS_NOT_VALID;
            }
        }
        return formState;
    }

    return {
        validateField,
        attachAll,
        verifyForm
    };

}());

function serialize(form, encode) {
    'use strict';
    // jshint maxdepth:10
    // jshint maxcomplexity:20
    let field, s = [];
    const postValues = {};
    if (typeof form === 'object' && form.nodeName === 'FORM') {
        let len = form.elements.length;
        for (let i = 0; i < len; i++) {
            field = form.elements[i];
            if (field.name &&
                !field.disabled &&
                field.type !== 'file' &&
                field.type !== 'reset' &&
                field.type !== 'submit' &&
                field.type !== 'button') {
                if (field.type === 'select-multiple') {
                    for (let j = form.elements[i].options.length - 1; j >= 0; j--) {
                        if (field.options[j].selected) {
                            postValues[field.name] = field.options[j].value;
                            s[s.length] = encodeURIComponent(field.name) +
                                '=' +
                                encodeURIComponent(field.options[j].value);
                        }
                    }
                } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                    postValues[field.name] = field.value;
                    s[s.length] = encodeURIComponent(field.name) +
                        '=' +
                        encodeURIComponent(field.value);
                }
            }
        }
    }

    if (encode) {
        return s.join('&').replace(/%20/g, '+');
    } else {
        return postValues;
    }
}

function post(path, params, method) {
    'use strict';
    method = method || 'post'; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    const form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);

    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            const hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function secureSend(sock, data) {
    data.soiNick = window.cred.soiNick;
    data.token = window.cred.token;
    data.roomName = window.cred.roomName;

    console.log('secureSend', data);
    sock.send(JSON.stringify(data));
}
