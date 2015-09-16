function getBtcConfig () {

  var fs = require('fs');

  var configurationFile = '../btc-config.json';
  
  
  var configuration = JSON.parse(
      fs.readFileSync(configurationFile)
  );
  
  return configuration;
}

exports = module.exports = getBtcConfig;
