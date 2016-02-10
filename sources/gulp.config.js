'use strict';

const projects = {};

projects.fakeSoi = {
	srcFiles: ['./projects/fake-soi/**/*.js'],
	srcDir: './projects/fake-soi/src',
	dest: './build/fake-soi',
	server: './projects/fake-soi/src/fake-soi.js'
};

projects.common = {
	srcFiles: ['./projects/common/**/*.js'],
	dest: './build/common',
	srcDir: './projects/common/src'
};


module.exports = function() {
    Object.keys(projects).forEach(key => {
        const proj = projects[key];
    });
  
  return projects;
}