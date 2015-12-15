function getBtcConfig() {
    'use strict';

    let fs = require('fs');
    let stringFormat = require('./lib/string-format');
    let configurationFile = './btc-config.json';

    let configuration = JSON.parse(
        fs.readFileSync(configurationFile)
    );

    // Fill in the template.
    configuration.soi.getUrl = stringFormat(
        configuration.soi.getUrl,
        configuration.soi
    );

    return configuration;
}

exports = module.exports = getBtcConfig;
