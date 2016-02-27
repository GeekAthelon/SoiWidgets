function getConfig() {
    'use strict';

    const isTest = process.env.NODE_TEST === 'true';
    const os = require('os');
    const fs = require('fs');
    const path = require('path');
    //const stringFormat = require('../../common/src/string-format');
    const configurationFile = path.resolve(__dirname,
        '../config/fake-soi-config.json');


    const fullConfiguration = JSON.parse(
        fs.readFileSync(configurationFile)
    );

    console.log('Found configuration: ');
    console.log(fullConfiguration);

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

    configuration.isTest = isTest;
    /* istanbul ignore else  */
    if (configuration.isTest) {
        void(0);
        //configuration.env.dbPath = configuration.env.dbPathTest;
    } else {
        void(0);
        //configuration.env.dbPath = configuration.env.dbPathReal;
    }

    configuration.isDev = configuration.env.isDev;
    //configuration.env.dbPath = path.resolve(configuration.env.dbPath);
    //console.log(configuration);
    return configuration;
}

exports = module.exports = getConfig;
