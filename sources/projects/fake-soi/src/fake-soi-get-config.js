function getConfig() {
    'use strict';

    const isTest = process.env.NODE_TEST === 'true';
    const os = require('os');
    const fs = require('fs');
    const path = require('path');
    const stringFormat = require('./lib/string-format');
    const configurationFile = path.resolve(__dirname, '../fake-soi-config.json')

    const fullConfiguration = JSON.parse(
        fs.readFileSync(configurationFile)
    );

    let hostname = os.hostname();
    //console.log(`hostname ${hostname}`);
    const configuration = fullConfiguration[hostname];

    /* istanbul ignore if */
    if (!configuration) {
        throw new Error(`Not configuration found for ${hostname}. Bailing`);
    }

    if (isTest) {
        const testConfig = fullConfiguration.Speedy;
        configuration.soi = testConfig.soi;
        configuration.soiMail = testConfig.soiMail;
    }

    // Fill in the template.
    configuration.soi.getUrl = stringFormat(
        configuration.soi.getUrl,
        configuration.soi
    );

    configuration.soiMail.getUrl = stringFormat(
        configuration.soiMail.getUrl,
        configuration.soiMail
    );

    configuration.isTest = isTest;
    /* istanbul ignore else  */
    if (configuration.isTest) {
        configuration.env.dbPath = configuration.env.dbPathTest;
    } else {
        configuration.env.dbPath = configuration.env.dbPathReal;
    }

    configuration.isDev = configuration.env.isDev;
    configuration.env.dbPath = path.resolve(configuration.env.dbPath);
    //console.log(configuration);
    return configuration;
}

exports = module.exports = getConfig;
