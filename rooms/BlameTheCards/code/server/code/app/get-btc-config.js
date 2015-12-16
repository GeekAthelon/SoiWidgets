function getBtcConfig() {
    'use strict';

    const nodeEnv = process.env.NODE_ENV;
    const isTest = process.env.NODE_TEST;

    const fs = require('fs');
    const path = require('path');
    const stringFormat = require('./lib/string-format');
    const configurationFile = './btc-config.json';

    const fullConfiguration = JSON.parse(
        fs.readFileSync(configurationFile)
    );

    console.log(`getBtcConfig - Found NODE_ENV of ${nodeEnv}`);
    if (!nodeEnv) {
        throw new Error(`getBtcConfig - NODE_ENV not found. Cannot continue`);
    }
    const configuration = fullConfiguration[nodeEnv];
    // Fill in the template.
    configuration.soi.getUrl = stringFormat(
        configuration.soi.getUrl,
        configuration.soi
    );

    configuration.isTest = (isTest === 'true');
    if (configuration.isTest) {
        configuration.env.dbPath = configuration.env.dbPathTest;
    } else {
        configuration.env.dbPath = configuration.env.dbPathReal;
    }

    configuration.env.dbPath = path.resolve(configuration.env.dbPath);
    //console.log(configuration);
    return configuration;
}

exports = module.exports = getBtcConfig;
