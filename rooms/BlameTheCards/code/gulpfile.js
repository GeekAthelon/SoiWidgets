var gulp = require('gulp');
var path = require('path');
var args = require('yargs').argv;
var gulpConfig = require('./gulp.config')();
var del = require('del');

var notify = require("gulp-notify");
var $ = require('gulp-load-plugins')({
  lazy: true
});

function tattle(msg) {
  var nn = require('node-notifier');

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
    src: ['server/code/app/**/*.js'],
    tests: ['server/code/test/**/*.js'],
    coverageDir: './coverage'
  }, done);
}

gulp.task('coverage-dev', function(done) {
  process.env.NODE_ENV = 'dev';
  runCoverage(done);
});

gulp.task('coverage-prod', function(done) {
  process.env.NODE_ENV = 'prod';
  runCoverage(done);
});

// Style and Linting Tasks

gulp.task('vet', function() {
  return gulp.src(gulpConfig.src)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.jscs())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish', {
      verbose: false
    }))
    .pipe($.jshint.reporter('fail'));
});

// File Converstion Tasks

gulp.task('build-src', ['babel'], function() {});

gulp.task('babel', /*['clean-build'], */ function() {
  log('Converting files to ES5');

  var config = {
    src: gulpConfig.src,
    dest: gulpConfig.dest,
    // Must be absolute or relative to source map
    sourceRoot: path.join(__dirname, gulpConfig.dest)
  };

  return gulp.src(config.src)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .on('error', (err) => {
      tattle('Build error under Babel');
      log(err);
    })
    .pipe($.sourcemaps.write('.', {
      sourceRoot: config.src
    }))
    .pipe(gulp.dest(config.dest));
});

// Full Build

gulp.task('build', ['build-src'], function() {});

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
    })
    .on('start', function() {
      log('*** nodemon started ***');
    })
    .on('crash', function(ev) {
      log('*** nodemon crash: script crashed for some reason');
      tattle('Build error under Babel');
    })
    .on('exit', function() {
      log('*** nodemon crash: script exited cleanly');
    });
}

gulp.task('serve-dev', ['vet', 'build'], function() {
  var nodeOptions = {
    script: gulpConfig.nodeServer,
    delayTime: 1,
    env: {
      NODE_ENV: 'dev',
    },
    tasks: ['vet', 'build'],
    watch: [gulpConfig.srcDir]
  };

  return runMonitor(nodeOptions);
});

gulp.task('serve-prod', ['build'], function() {
  var nodeOptions = {
    script: gulpConfig.nodeServer,
    delayTime: 1,
    env: {
      NODE_ENV: 'prod',
    },
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
