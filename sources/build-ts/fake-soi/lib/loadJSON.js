/// <reference path="../../../typings/bluebird/bluebird.d.ts" />
"use strict";
var fs = require('fs');
var path = require('path');
var os = require('os');
function loadJSONasync(fileName) {
    var fullPath = path.resolve(__dirname, '..', fileName);
    console.log('Reading file from', fullPath);
    return new Promise(function (resolve, reject) {
        fs.readFile(fullPath, 'utf8', function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            resolve(JSON.parse(data));
        });
    });
}
exports.loadJSONasync = loadJSONasync;
function loadFakeSoiConfig(fileName) {
    var hostname = os.hostname();
    return new Promise(function (resolve, reject) {
        loadJSONasync(fileName).then(function (list) {
            var data = list.filter(function (r) { return r.name === hostname; });
            if (data.length === 1) {
                resolve(data[0]);
            }
            reject(new Error('Could not load config data for: ' + hostname));
        });
    });
}
exports.loadFakeSoiConfig = loadFakeSoiConfig;
