/* globals it: true, describe: true */

const expect = require('chai').expect;
const stringFormat = require('../app/lib/string-format');

describe('stringFormat Gizmo', function() {
    'use strict';

    let expectedResult = 'Hello world';

    describe('Basic substitution Tests', function() {
        it('One Parameter', function() {
            let str = 'Hello {0}';
            let result = stringFormat(str, 'world');
            expect(result).to.equal(expectedResult);
        });

        it('One element array', function() {
            let str = 'Hello {0}';
            let result = stringFormat(str, ['world']);
            expect(result).to.equal(expectedResult);
        });

        it('Two parameters', function() {
            let str = '{0} {1}';
            let result = stringFormat(str, 'Hello', 'world');
            expect(result).to.equal(expectedResult);
        });

        it('Two element array', function() {
            let str = '{0} {1}';
            let result = stringFormat(str, ['Hello', 'world']);
            expect(result).to.equal(expectedResult);
        });

        it('Three element array (one extra)', function() {
            let str = '{0} {1}';
            let result = stringFormat(str, ['Hello', 'world', 'extra!']);
            expect(result).to.equal(expectedResult);
        });

    });

    describe('Brace substitution Tests', function() {
        it('Double Braces in source', function() {
            let str = 'Hello {{0}}';
            let result = stringFormat(str, 'world');
            expect(result).to.equal('Hello {0}');
        });

        it('Double Braces in replacement', function() {
            let str = '{0} {1} {2}';
            let result = stringFormat(str, 'a', '{0}', 'b');
            expect(result).to.equal('a {0} b');
        });

        it('One Key/Value substitution', function() {
            let str = 'Hello {key}';
            let result = stringFormat(str, {
                'key': 'world'
            });
            expect(result).to.equal(expectedResult);
        });

        it('Two Key/Value substitution', function() {
            let str = '{key2} {key}';

            let result = stringFormat(str, {
                'key': 'world',
                'key2': 'Hello'
            });

            expect(result).to.equal(expectedResult);
        });

    });

});
