/* globals it: true, describe: true */

var expect = require('chai').expect;
var Deck = require('../app/lib/deck');
var deck = new Deck();


describe('Testing Deck', function() {
    'use strict';

    this.timeout(3000);
    this.slow(3000);

    function createDbObj() {
        var fs = require("fs");
        var file = "test.db";
        var exists = fs.existsSync(file);

        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database(':memory:');

        db.on('trace', function(sql) {
            //console.info("sql: " + sql);
        });

        return db;
    }

    describe('Testing for life', function() {
        it('init runs successfully', function(done) {
            var db = createDbObj();
            let deck = new Deck(db);
            deck.init(done);
            expect(true).to.equal(true);
        });
    });

    describe('Testing ENUMS', function() {
        var db = createDbObj();
        let deck = new Deck(db);

        it('Testing QUESTION enum', function() {
            expect(Deck.cardType.QUESTION).to.equal(1);
        });

        it('Testing ANSWER enum', function() {
            expect(Deck.cardType.ANSWER).to.equal(2);
        });

        it('Testing object frozen', function() {
            let result = false;
            try {
                Deck.cardType.ANSWER = 10;
            } catch (e) {
                result = true;
            }
            expect(result).to.equal(true);
        });

    });

    describe('Card Handling', function() {
        let db;
        let deck;

        beforeEach(function() {
            db = createDbObj();
            deck = new Deck(db);
            deck.init(function() {});
        });

        it('Add Card', function(done) {

            deck.addCard({
                num: 1,
                text: "What is the _",
                type: Deck.cardType.QUESTION
            }, done);

            expect(true).to.equal(true);
        });
    });

});
