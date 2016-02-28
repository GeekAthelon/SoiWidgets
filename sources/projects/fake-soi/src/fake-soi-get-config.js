'use strict';

const isTest = process.env.NODE_TEST === 'true';
const os = require('os');
const fs = require('fs');
const path = require('path');
const configurationFile = path.resolve(__dirname, '../config/fake-soi-config.json');

const fullConfiguration = JSON.parse(
    fs.readFileSync(configurationFile)
);

//console.log('Found configuration: ');
//console.log(fullConfiguration);

let hostname = os.hostname();
//console.log(`hostname ${hostname}`);
const configuration = fullConfiguration[hostname];

/* istanbul ignore if */
if (!configuration) {
    throw new Error(`Not configuration found for ${hostname}. Bailing`);
}

configuration.isTest = isTest;
Object.seal(configuration);

/* istanbul ignore else  */
if (configuration.isTest) {
    configuration.db.current = configuration.db.test;
} else {
    configuration.db.current = configuration.db.real;
}

console.log(configuration);

function getConfig() {
    return configuration;
}

exports = module.exports = getConfig;
