/* global define: true */
(function() {
    'use strict';

    const gtool = (function() {
        return {
            isAlive: function() {
                return true;
            }
        };
    }());

    (function(root, factory) {
        if (typeof define === 'function' && define.amd) {
            // AMD
            define([], factory);
        } else if (typeof exports === 'object') {
            // Node, CommonJS-like
            module.exports = factory();
        } else {
            // Browser globals (root is window)
            root.grammerTool = factory();
        }
    }(this, function() {
        return gtool;
    }));

}());
