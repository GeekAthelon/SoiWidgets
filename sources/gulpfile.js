'use strict';

const gulp = require('gulp');
const path = require('path');
const args = require('yargs')
    .argv;
const projects = require('./gulp.config')();
const del = require('del');

const $ = require('gulp-load-plugins')({
    lazy: true
});

const babelOptions = {
    presets: ['es2015']
};

const babelTasks = [];
const copyFilesTasks = [];
const jsHintTasks = [];
const jscsTasks = [];
const formatJsTasks = [];
const testTasks = [];

const testSources = [];
const testTests = [];


const gulpConfig = {};

(function() {
    function testtask(key) {
        const name = 'test-' + key;
        createTestTask(name, key);
        testTasks.push(name);
    }

    function copyfilestask(key) {
        const name = 'copyFiles-' + key;
        createCopyFilesTask(name, key);
        copyFilesTasks.push(name);
    }

    function btask(key) {
        const name = 'babelfy-' + key;
        createBabelTask(name, key);
        babelTasks.push(name);
    }

    function jshinttask(key) {
        const name = 'jshint-' + key;
        createJsHintTask(name, key);
        jsHintTasks.push(name);
    }

    function jscstask(key) {
        const name = 'jscs-' + key;
        createJscsTask(name, key);
        jscsTasks.push(name);
    }

    function formatjstask(key) {
        const name = 'formatjs-' + key;
        createFormatJsTask(name, key);
        formatJsTasks.push(name);
    }

    Object.keys(projects)
        .forEach((key) => {
            const proj = projects[key];
            if (proj.tasks.babelfy) {
                btask(key);
            }

            if (proj.tasks.jshint) {
                jshinttask(key);
            }

            if (proj.tasks.jscs) {
                jscstask(key);
            }

            if (proj.tasks.formatjs) {
                formatjstask(key);
            }

            if (proj.tasks.copy) {
                copyfilestask(key);
            }

            if (proj.tasks.test) {
                testtask(key);
            }

        });
}());


function tattle(msg) {
    const nn = require('node-notifier');

    nn.notify({
        title: 'Error from BtC Builder',
        message: msg,
        //icon: path.join(__dirname, 'coulson.jpg'), // absolute path (not balloons)
        sound: true, // Only Notification Center or Windows Toasters
        wait: true // wait with callback until user action is taken on notification
    }, function( /*err, response*/ ) {
        // response is response from notification
    });
}

// Informational
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

// Testing

function runTest(testConfig, done) {

    process.env.NODE_TEST = true;




    gulp.src(testConfig.src)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.istanbul()) // Covering files
        .pipe($.istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function() {
            gulp.src(testConfig.tests)
                .pipe($.if(args.verbose, $.print()))
                .pipe($.mocha())
                .pipe($.istanbul.writeReports({
                    dir: testConfig.coverageDir,
                    reporters: ['html', 'lcov', 'json', 'text',
                        'text-summary'
                    ],
                    reportOpts: {
                        dir: './coverage'
                    },
                })) // Creating the reports after tests ran
                .pipe($.istanbul.enforceThresholds({
                    thresholds: {
                        global: 90
                    }
                })) // Enforce a coverage of at least 90%
                .on('end', done);
        });
}

gulp.task('coverage-es5', ['babel'], function(done) {
    runTest({
        src: ['build/app/**/*.js', '!build/app/btc.js'],
        tests: ['build/test/**/*.js'],
        coverageDir: './coverage'
    }, done);
});

function runCoverage(done) {
    runTest({
        src: testSources,
        tests: testTests,
        coverageDir: './coverage'
    }, done);
}

gulp.task('coverage', function(done) {
    runCoverage(done);
});

// Style and Linting Tasks
function createTestTask(name, key) {
    const proj = projects[key];
    testSources.push(proj.srcDir + '/**/*.js');
    testTests.push(proj.srcDir + '/../test/**/*.js');
}

function createJscsTask(name, key) {
    log('Creating task: ' + name);
    const proj = projects[key];

    gulp.task(name, function() {
        return gulp.src(proj.srcFiles)
            .pipe($.if(args.verbose, $.print()))
            .pipe($.jscs());
    });
}

function createJsHintTask(name, key) {
    log('Creating task: ' + name);
    const proj = projects[key];

    gulp.task(name, function() {
        return gulp.src(proj.srcFiles)
            .pipe($.if(args.verbose, $.print()))
            .pipe($.jshint())
            .pipe($.jshint.reporter('jshint-stylish', {
                verbose: false
            }))
            .pipe($.jshint.reporter('fail'));
    });
}

function createCopyFilesTask(name, key) {
    log('Creating task: ' + name);

    const copyOptions = {
        prefix: 2
    };

    const proj = projects[key];
    gulp.task(name, function() {
        return gulp.src(proj.copyFiles)
            .pipe($.copy(proj.dest, copyOptions));
    });
}

function createBabelTask(name, key) {
    log('Creating task: ' + name);
    const proj = projects[key];
    gulp.task(name, function() {
        return gulp.src(proj.srcFiles)
            .pipe($.if(args.verbose, $.print()))
            .pipe($.sourcemaps.init())
            .pipe($.babel(babelOptions))
            .on('error', (err) => {
                tattle('Build error under Babel');
                log(err);
            })
            .pipe($.sourcemaps.write('.', {
                sourceRoot: proj.src
            }))
            .pipe(gulp.dest(proj.dest));
    });
}
gulp.task('copy', copyFilesTasks, function() {});

gulp.task('babel', babelTasks, function() {});

gulp.task('jshint', jsHintTasks, function() {});

gulp.task('jscs', jscsTasks, function() {});

gulp.task('test', testTasks, function() {});

gulp.task('vet', ['jshint', 'jscs'], function() {});


gulp.task('sass', function() {
    const sass = $.sass;
    const src = gulpConfig.srcDir + '/sass/**/*.scss';
    const exclude = '!' + gulpConfig.srcDir + '/sass/**/_*';
    const dest = gulpConfig.dest + '/css';
    console.log(src);
    console.log(exclude);
    console.log(dest);

    return gulp.src([src, exclude])
        .pipe(sass()
            .on('error', sass.logError))
        //    .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sass({
            outputStyle: 'nested'
        }))
        .pipe(gulp.dest(dest));
});

// Full Build

gulp.task('build', ['babel', 'copy'], function() {});

// Reformatting Tasks

function createFormatJsTask(name, key) {
    log('Creating task: ' + name);
    const proj = projects[key];
    const dest = path.join(proj.srcDir, '..');

    gulp.task(name, function() {
        return gulp.src(proj.srcFiles)
            .pipe($.jsbeautifier({
                config: '.jsbeautifyrc',
                mode: 'VERIFY_AND_WRITE'
            }))
            .pipe(gulp.dest(dest));
    });
}

gulp.task('formatjs', formatJsTasks, function() {});

function runMonitor(nodeOptions) {
    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            log('*** nodemon restarted ***');
            log('Files changed on restart: \n' + ev);
            //runBabble();
            log('Babble Finished:');
        })
        .on('start', function() {
            log('*** nodemon started ***');
        })
        .on('crash', function( /*ev */ ) {
            log('*** nodemon crash: script crashed for some reason');
            tattle('Build error under Babel');
        })
        .on('uncaughtException', function(err) {
            console.log('UNCAUGHT EXCEPTION');
            console.log(err);
            // server.kill();
            process.kill();
        })
        .on('exit', function() {
            log('*** nodemon crash: script exited cleanly');
        });
}

gulp.task('serve', ['build'], function() {
    const nodeOptions = {
        script: 'build/fake-soi/src/fake-soi.js',
        delayTime: 1,
        env: {},
        watch: ['']
    };

    return runMonitor(nodeOptions);
});


gulp.task('clean-build', function() {
    log('Cleaning ' + gulpConfig.dest);
    return del([gulpConfig.dest]);
});

gulp.task('watch', function() {
    gulp.watch(gulpConfig.src, ['build']);
});



function log(msg) {
    if (typeof(msg) === 'object') {
        for (let item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
