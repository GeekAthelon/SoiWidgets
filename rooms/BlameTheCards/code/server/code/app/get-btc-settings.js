'use strict';

const fs = require('fs');
const path = require('path');
const configurationFile = './btc-settings.json';

const fullConfiguration = JSON.parse(
    fs.readFileSync(configurationFile)
);

exports = module.exports = fullConfiguration;
