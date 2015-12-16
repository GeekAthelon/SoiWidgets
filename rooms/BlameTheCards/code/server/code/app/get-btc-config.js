function getBtcConfig() {
    'use strict';

    const nodeEnv = process.env.NODE_ENV;
    const fs = require('fs');
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

    return configuration;
}

exports = module.exports = getBtcConfig;
