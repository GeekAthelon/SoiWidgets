(function(window) {
    window.getJSON = function(file, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {

            if (request.readyState === 4 && request.status === 200) {
                callback(JSON.parse(request.responseText));
            }
        };

        request.onerror = function(err) {
            //window.alert('Error: ' + JSON.stringify(err.message));
        };

        request.open('GET', file, true);
        request.send();
    };

    window.postJSON = function(file, data, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {

            if (request.readyState === 4 && request.status === 200) {
                callback(JSON.parse(request.responseText));
            }
        };

        request.onerror = function(err) {
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
        var i, l,
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

    window.removeNodes = function(nodes) {
        [].forEach.call(nodes, n => {
            n.parentNode.removeChild(n);
        });
    };
}(window));
