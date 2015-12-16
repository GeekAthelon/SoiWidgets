module.exports = function() {
  var config = {
    src: ['./server/code/**/*.js'],
    dest: './build',
    srcDir: './server/code',
    nodeServer: './server/code/app/btc.js'
  };
  
  return config;
}