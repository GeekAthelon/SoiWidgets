'use strict';

const projects = {};

projects.fakeSoi = {
	srcFiles: ['./fake-soi/src/**/*.js'],
	srcDir: './fake-soi/src',
	server: './fake-soi/src/fake-soi.js'
};


module.exports = function() {
  var config = {
    src: [],
    dest: './build',
  };
  
  Object.keys(projects).forEach(key => {
	  const proj = projects[key];
	  config.src.push(proj.srcFiles);
  });
  
  return config;
}