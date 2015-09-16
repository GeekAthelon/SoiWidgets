function getBtcConfig () {

  let fs = require('fs');
  let stringFormat = require('./lib/string-format');  
  let configurationFile = '../btc-config.json';
    
  let configuration = JSON.parse(
      fs.readFileSync(configurationFile)
  );
  
  // Fill in the blanks.
  configuration = stringFormat(configuration.url, configuration);
  
  
  return configuration;
}

exports = module.exports = getBtcConfig;
