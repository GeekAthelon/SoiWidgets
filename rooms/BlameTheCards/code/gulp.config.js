module.exports = function() {
	var config = {
	};

	config.src = ['./server/code/**/*.js'];
	config.dest = './build';
	config.srcDir = './server/code';

	return config;
}