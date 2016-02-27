/* globals it: true, describe: true, beforeEach: true */

const expect = require('chai').expect;

const bcrypt = require('bcrypt-nodejs');

describe('test bcrypt', function() {
    'use strict';

    const thePassword = 'bacon';


    let theSalt;

    beforeEach(done => {
        theSalt = bcrypt.genSalt(10, (error, salt) => {
            theSalt = salt;
            done();
        });
    });


    it('Testing hash', function(done) {



        bcrypt.hash(thePassword, theSalt, null, (err, hash) => {

            expect(hash).to.not.equal(null);

            bcrypt.compare(thePassword, hash, (err,
                res) => {
                expect(res).to.equal(true);
            });

            done();

        });

    });




});
