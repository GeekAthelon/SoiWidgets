'use strict';

const gulp = require('gulp');
const path = require('path');
const args = require('yargs').argv;
const projects = require('./gulp.config')();
var del = require('del');

const notify = require("gulp-notify");
const $ = require('gulp-load-plugins')({
    lazy: true
});

const babelOptions = {
	presets: ['es2015']
};


function tattle(msg) {
    const nn = require('node-notifier');

    nn.notify({
        title: 'Error from BtC Builder',
        message: msg,
        //icon: path.join(__dirname, 'coulson.jpg'), // absolute path (not balloons)
        sound: true, // Only Notification Center or Windows Toasters
        wait: true // wait with callback until user action is taken on notification
    }, function(err, response) {
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
                    reporters: ['html', 'lcov', 'json', 'text', 'text-summary'],
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
        src: ['server/code/app/**/*.js', 'server/code/client/lib/**/*.js'],
        tests: ['server/code/test/**/*.js'],
        coverageDir: './coverage'
    }, done);
}

gulp.task('coverage', function(done) {
    runCoverage(done);
});

// Style and Linting Tasks

gulp.task('vet', ['jshint', 'jscs'], function() {
});

gulp.task('jscs', function() {
    return gulp.src(gulpConfig.src)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs());
});

gulp.task('jshint', function() {
    return gulp.src(gulpConfig.src)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: false
        }))
        .pipe($.jshint.reporter('fail'));
});

// File Converstion Tasks

function createBabelTask(name, key) {
    log('Creating task: ' + name);
    var proj = projects[key];
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

var babelTasks = [];
for (var key in projects) {
  var name = 'babelfy-' + key;
  createBabelTask(name, key);
  babelTasks.push(name);
}	

gulp.task('babel', babelTasks, function() {
    //return runBabble();
});

gulp.task('sass', function () {
	const sass = $.sass
	const src = gulpConfig.srcDir + '/sass/**/*.scss';
	const exclude = '!' + gulpConfig.srcDir + '/sass/**/_*'
	const dest = gulpConfig.dest + '/css';
	console.log(src);
	console.log(exclude);
	console.log(dest);
	
  return gulp.src([src, exclude])
    .pipe(sass().on('error', sass.logError))
//    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(sass({outputStyle: 'nested'}))
    .pipe(gulp.dest(dest));
});

// Full Build

gulp.task('build', ['babel'], function() {});

// Reformatting Tasks

gulp.task('format-js', function() {
    return gulp.src(gulpConfig.src)
        .pipe($.jsbeautifier({
            config: '.jsbeautifyrc',
            mode: 'VERIFY_AND_WRITE'
        }))
        .pipe(gulp.dest(gulpConfig.srcDir))
});

function runMonitor(nodeOptions) {
    return $.nodemon(nodeOptions)
        .on('restart', function(ev) {
            log('*** nodemon restarted ***');
            log('Files changed on restart: \n' + ev);
            runBabble();
            log('Babble Finished:');
        })
        .on('start', function() {
            log('*** nodemon started ***');
        })
        .on('crash', function(ev) {
            log('*** nodemon crash: script crashed for some reason');
            tattle('Build error under Babel');
        })
        .on('uncaughtException', function(err) {
            console.log('UNCAUGHT EXCEPTION');
            console.log(err);
            server.kill();
            process.kill();
         })
        .on('exit', function() {
            log('*** nodemon crash: script exited cleanly');
        });
}

gulp.task('serve', [/* 'build' */], function() {
    const nodeOptions = {
        script: gulpConfig.nodeServer,
        delayTime: 1,
        env: {},
        watch: [gulpConfig.src]
    };

    return runMonitor(nodeOptions);
});

gulp.task('git-pre-js', function() {
    gulp.src('./src/foo.js', './src/bar.json')
        .pipe(prettify({
            config: '.jsbeautifyrc',
            mode: 'VERIFY_ONLY'
        }))
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
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
