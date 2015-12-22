'use strict';

const fs = require('fs');
const configurationFile = './server/code/config/btc-lounges.json';

const fullConfiguration = JSON.parse(
    fs.readFileSync(configurationFile)
);

exports = module.exports = fullConfiguration;
