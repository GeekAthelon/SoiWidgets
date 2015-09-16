function getBtcConfig () {

  var fs = require('fs');
  var stringFormat = require('./lib/string-format');
  
  var configurationFile = '../btc-config.json';
  
  
  var configuration = JSON.parse(
      fs.readFileSync(configurationFile)
  );
  
  
  
  
  return configuration;
}

exports = module.exports = getBtcConfig;
