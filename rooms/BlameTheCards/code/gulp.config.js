module.exports = function() {
	var config = {
	};

	config.src = ['./server/code/**/*.js'];
	config.dest = './build';
	config.srcDir = './server/code';

	config.nodeServer = './build/app/btc.js';
	config.defaultPort = 1701;
	
	return config;
}