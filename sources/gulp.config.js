'use strict';

const validTasks = 'tsc babelfy tshint jshint jscs formatjs formatts copy test'.split(' ');
const projects = {};

projects.fakeSoi2 = {
    jsSrcFiles: ['./projects-ts/fake-soi/**/*.js'],
    tsSrcFiles: ['./projects-ts/fake-soi/**/*.ts'],
    copyFiles: [
        './projects-ts/fake-soi/config/**/*.json',
        './projects-ts/fake-soi/views/**/*.pug',
        './projects-ts/fake-soi/rooms/**/static/*'
    ],
    srcDir: './projects-ts/fake-soi/src',
    dest: './build-ts/fake-soi',
    server: './build-ts/fake-soi/src/fake-soi.js',
    tasks: 'tsc tshint jscs formatts copy test'
};

projects.common = {
    jsSrcFiles: ['./projects-ts/common/**/*.js'],
    tsSrcFiles: ['./projects-ts/common/**/*.ts'],
    dest: './build-ts/common',
    srcDir: './projects-ts/common/src',
    tasks: 'tsc tshint jscs formatts test'
};

//projects.fakeSoi = {
//    srcFiles: ['./projects/fake-soi/**/*.js'],
//    copyFiles: [
//        './projects/fake-soi/config/**/*.json',
//        './projects/fake-soi/views/**/*.pug',
//        './projects/fake-soi/rooms/**/static/*'
//    ],
//    srcDir: './projects/fake-soi/src',
//    dest: './build/fake-soi',
//    server: './projects/fake-soi/src/fake-soi.js',
//    tasks: 'babelfy jshint jscs formatjs copy test'
//};

projects.buildfiles = {
    // The paths here are a lie...
    // but formatjs is off-by-one directory when it
    // formats....
    jsSrcFiles: ['./gulpfile.js', './gulp.config.js'],
    tsSrcFiles: [],
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
