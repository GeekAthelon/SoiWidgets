module.exports = function() {
	var config = {
	};

	config.src = ['./server/code/**/*.js'];
	config.dest = './build';
	config.srcDir = './server/code';

	config.nodeServer = './server/code/app/btc.js';
	config.defaultPort = 1701;
	
	return config;
}