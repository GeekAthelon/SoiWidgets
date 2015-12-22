'use strict';

/* globals it: true, describe: true, before: true, beforeEach: true */

const expect = require('chai').expect;
const psevents = require('../app/lib/pub-sub');

describe('psevents Tests', function() {

    before(function() {});

    it('psevents is alive', function() {
        expect(psevents instanceof Object).to.equal(true);
    });

    it('psevents - testing public and subscriptions', function(done) {
        var subscription = psevents.subscribe('test1a', function(obj) {
            expect(obj).deep.equal({
                prop: true
            });
            done();
        });

        psevents.publish('test1a', {
            prop: true
        });
    });

    it('psevents - testing doesn\'t call the wrong subscriber', function(done) {
        var subscription1 = psevents.subscribe('test2a', function(obj) {
            expect(obj).deep.equal({
                prop: true
            });
            done();
        });

        var subscription2 = psevents.subscribe('test2b', function(obj) {
            expect(obj).deep.equal({
                prop: true
            });
            done();
        });

        psevents.publish('test2a', {
            prop: true
        });
    });

    it('psevents - testing calls multiple subscribers', function(done) {
        let count = 0;

        function inc() {
            count++;
            if (count === 2) {
                done();
            }
        }

        var subscription1 = psevents.subscribe('test3a', function(obj) {
            expect(obj).deep.equal({
                prop: true
            });
            inc();
        });

        var subscription2 = psevents.subscribe('test3a', function(obj) {
            expect(obj).deep.equal({
                prop: true
            });
            inc();
        });

        psevents.publish('test3a', {
            prop: true
        });
    });

    it('psevents - Testing un-subscribe', function(done) {
        let count = 0;

        function inc() {
            done();
        }

        function t1() {
            inc();
        }

        function t2() {
            inc();
        }

        var subscription1 = psevents.subscribe('test4a', t1);
        var subscription2 = psevents.subscribe('test4a', t2);
        subscription2.remove();
        psevents.publish('test4a', {
            prop: true
        });
    });

});
