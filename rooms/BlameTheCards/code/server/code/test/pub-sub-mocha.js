'use strict';

/* globals it: true, describe: true, before: true, beforeEach: true */

const expect = require('chai').expect;
const psevents = require('../app/lib/pub-sub');

describe('psevents Tests', function() {

    before(function() {});
    beforeEach(function() {});

    it('psevents is alive', function() {
        expect(psevents instanceof Object).to.equal(true);
    });

    it('psevents - testing public and subscriptions', function(done) {
        const subscription = psevents.subscribe('test1a', function(obj) {
            expect(obj).deep.equal({
                prop: true
            });
            done();
        });

        psevents.publish('test1a', {
            prop: true
        });
        void(subscription);
    });

    it('psevents - testing doesn\'t call the wrong subscriber', function(done) {
        const subscription1 = psevents.subscribe('test2a', function(obj) {
            expect(obj).deep.equal({
                prop: true
            });
            done();
        });

        const subscription2 = psevents.subscribe('test2b', function(obj) {
            expect(obj).deep.equal({
                prop: true
            });
            done();
        });

        psevents.publish('test2a', {
            prop: true
        });
        void(subscription1);
        void(subscription2);
    });

    it('psevents - testing calls multiple subscribers', function(done) {
        let count = 0;

        function inc() {
            count++;
            if (count === 2) {
                done();
            }
        }

        const subscription1 = psevents.subscribe('test3a', function(obj) {
            expect(obj).deep.equal({
                prop: true
            });
            inc();
        });

        const subscription2 = psevents.subscribe('test3a', function(obj) {
            expect(obj).deep.equal({
                prop: true
            });
            inc();
        });

        psevents.publish('test3a', {
            prop: true
        });
        void(subscription1);
        void(subscription2);
    });

    it('psevents - Testing un-subscribe', function(done) {
        function inc() {
            done();
        }

        function t1() {
            inc();
        }

        function t2() {
            inc();
        }

        const subscription1 = psevents.subscribe('test4a', t1);
        const subscription2 = psevents.subscribe('test4a', t2);
        subscription2.remove();
        psevents.publish('test4a', {
            prop: true
        });
        void(subscription1);
        void(subscription2);
    });

});
