/* global define: true */
(function() {
    'use strict';

    const gtool = (function() {
        // This code is mostly English-centric. That's OK, since I'm only dealing in English.
        // I don't mind checking for letters in the extended set.
        // THIS CODE WILL BREAK WITH surrogate pairs

        const TOKEN_WORD = 1000;
        const TOKEN_OTHER = 2000;

        const minorWords = 'a an the at by for in of on to up and as but or nor'.split(' ');

        const letters = 'ÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜäëïöüçÇßØøÅåÆæÞþÐð' +
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

        function isLetter(ch) {
            const r = letters.indexOf(ch) !== -1;
            return r;
        }

        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        const rules = {
            capFirstWord: function() {
                const l = this.length;
                for (let i = 0; i < l; i++) {
                    const token = this[i];
                    if (token.type === TOKEN_WORD) {
                        token.str = capitalizeFirstLetter(token.str);
                        break;
                    }
                }
            },
            capName: function() {
                const l = this.length;
                for (let i = 0; i < l; i++) {
                    const token = this[i];
                    if (token.type === TOKEN_WORD) {
                        token.str = capitalizeFirstLetter(token.str);
                    }
                }
            },
            capTitle: function() {
                const l = this.length;
                for (let i = 0; i < l; i++) {
                    const token = this[i];
                    if (token.type === TOKEN_WORD) {
                        const isMinor = minorWords.indexOf(token.str) !== -1;
                        if (!isMinor) {
                            token.str = capitalizeFirstLetter(token.str);
                        }
                    }
                }
            },
            toString: function() {
                const txt = this.map(l => l.str);
                return txt.join('');
            }
        };

        function tokenize(str) {
            const l = str.length;
            const tokens = [];
            let i = 0;

            function readWord() {
                let s = '';
                while (i < l) {
                    s += str.charAt(i);

                    if (isLetter(str.charAt(i + 1))) {
                        i++;
                        continue;
                    } else {
                        break;
                    }
                }
                return s;
            }

            function readOther() {
                let s = '';
                while (i < l) {
                    s += str.charAt(i);

                    if (isLetter(str.charAt(i + 1))) {
                        break;
                    } else {
                        i++;
                        continue;
                    }
                }
                return s;
            }

            while (i < l) {
                const ch = str.charAt(i);
                let s;
                let type;

                if (isLetter(ch)) {
                    s = readWord();
                    type = TOKEN_WORD;
                } else {
                    s = readOther();
                    type = TOKEN_OTHER;
                }
                i++;

                tokens.push({
                    str: s,
                    type: type
                });
            }

            for (let ruleName in rules) {
                if (rules.hasOwnProperty(ruleName)) {
                    tokens[ruleName] = rules[ruleName];
                }
            }

            return tokens;
        }

        return {
            isAlive: function() {
                return true;
            },
            isLetter,
            tokenize,
            TOKEN_WORD,
            TOKEN_OTHER
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
