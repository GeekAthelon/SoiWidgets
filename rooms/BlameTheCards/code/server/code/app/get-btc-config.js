function getBtcConfig() {
    'use strict';

    let fs = require('fs');
    let stringFormat = require('./lib/string-format');
    let configurationFile = './btc-config.json';

    let configuration = JSON.parse(
        fs.readFileSync(configurationFile)
    );

    // Fill in the template.
    configuration.getUrl = stringFormat(configuration.getUrl, configuration);

    return configuration;
}

exports = module.exports = getBtcConfig;
