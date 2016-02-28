'use strict';

const validTasks = 'babelfy jshint jscs formatjs copy test'.split(' ');

const projects = {};

projects.fakeSoi = {
    srcFiles: ['./projects/fake-soi/**/*.js'],
    copyFiles: [
        './projects/fake-soi/config/**/*.json',
        './projects/fake-soi/views/**/*.jade'
    ],
    srcDir: './projects/fake-soi/src',
    dest: './build/fake-soi',
    server: './projects/fake-soi/src/fake-soi.js',
    tasks: 'babelfy jshint jscs formatjs copy test'
};

projects.common = {
    srcFiles: ['./projects/common/**/*.js'],
    dest: './build/common',
    srcDir: './projects/common/src',
    tasks: 'babelfy jshint jscs formatjs test'
};

projects.buildfiles = {
    // The paths here are a lie...
    // but formatjs is off-by-one directory when it
    // formats....
    srcFiles: ['./gulpfile.js', './gulp.config.js'],
    dest: './build',
    srcDir: './build',
    tasks: 'jshint jscs formatjs'
};

module.exports = function() {
    Object.keys(projects)
        .forEach(key => {
            const proj = projects[key];
            const tasks = {};

            const t = proj.tasks.split(' ');

            t.forEach(taskName => {
                if (validTasks.indexOf(taskName) === -1) {
                    throw new Error('For project `' + key +
                        '` there is an invalid task name of `' +
                        taskName + '`');
                }

                tasks[taskName] = true;
            });
            proj.tasks = tasks;
        });

    return projects;
};
