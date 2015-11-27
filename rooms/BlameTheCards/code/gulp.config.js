module.exports = function() {
	var config = {
	};

	config.src = ['./server/code/**/*.js'];
	config.dest = './build';
	config.srcDir = './server/code';

	config.nodeServer = './server/code/app/btc.js';
	
	config.prod = {
		port: 5000,
		url: "http://76.188.44.119:5000"
	};
	
	config.dev = {
		port: 4242,
		url: "http://76.188.44.119:4242"
	};

	
	return config;
}
