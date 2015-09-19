var gulp = require('gulp');
var path = require('path');
var args = require('yargs').argv;
var gulpConfig = require('./gulp.config')();
var del = require('del');

var $ = require('gulp-load-plugins')({lazy: true});

var port = process.env.PORT || gulpConfig.defaultPort;

gulp.task('help', $.taskListing);

gulp.task('istanbul', function (cb) {
  gulp.src(['build/app/**/*.js'])
	.pipe($.if(args.verbose, $.print()))
    .pipe($.istanbul()) // Covering files
    .pipe($.istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function () {
      gulp.src(['build/test/*.js'])
		.pipe($.if(args.verbose, $.print()))
        .pipe($.mocha())
        .pipe($.istanbul.writeReports(
			{
				dir: './coverage',
				reporters: [ 'html', 'lcov', 'json', 'text', 'text-summary'],
				reportOpts: { dir: './coverage' },
			}
		)) // Creating the reports after tests ran
        .pipe($.istanbul.enforceThresholds({ thresholds: { global: 90 } })) // Enforce a coverage of at least 90%
        .on('end', cb);
    });
});


gulp.task('mocha', function() {
    return gulp.src([gulpConfig.dest + '/test/**/*.js'], { read: false })
        .pipe($.mocha({ reporter: 'list' }))
        .on('error', $.util.log);
});

gulp.task('serve-dev', ['vet'], function() {
	var isDev = true;
	
	var nodeOptions = {
		script: gulpConfig.nodeServer,
		delayTime: 1,
		env: {
			PORT: port,
			NODE_ENV: isDev ? 'dev' : 'build'
		},
		watch: [gulpConfig.dest]
	};
	
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
		})
		.on('exit', function() {
			log('*** nodemon crash: script exited cleanly');
		});
	
});

gulp.task('git-pre-js', function() {
  gulp.src('./src/foo.js', './src/bar.json')
    .pipe(prettify({config: '.jsbeautifyrc', mode: 'VERIFY_ONLY'}))
});

gulp.task('format-js', function() {
  return gulp.src(gulpConfig.src)
    .pipe($.jsbeautifier({
		config: '.jsbeautifyrc', 
		mode: 'VERIFY_AND_WRITE'
	}))
    .pipe(gulp.dest(gulpConfig.srcDir))
});

gulp.task('vet', function() {
    return gulp.src(gulpConfig.src)
		.pipe($.if(args.verbose, $.print()))
		.pipe($.jscs())
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish', {verbose: false}))
		.pipe($.jshint.reporter('fail'));
});

gulp.task('clean-build', function() {
	log('Cleaning ' + gulpConfig.dest);
	return del([gulpConfig.dest]);
});

gulp.task('babel', /*['clean-build'], */ function () {
   log('Converting files to ES5');

   	var config = {
		src: gulpConfig.src,
		dest: gulpConfig.dest,
		// Must be absolute or relative to source map
		sourceRoot: path.join(__dirname, gulpConfig.dest)
	};

	if (args.verbose) {
		log("Files to be processed:")
	};
	
    return gulp.src(config.src)
		.pipe($.if(args.verbose, $.print()))
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write('.', { sourceRoot: config.src }))
        .pipe(gulp.dest(config.dest));
});


gulp.task('watch', function() {
    gulp.watch(gulpConfig.src, ['babel']);
});

gulp.task('default', ['babel']);

function log(msg) {
	if (typeof (msg) === 'object') {
		for (var item in msg) {
			if (msg.hasOwnProperty(item)) {
				$.util.log($.util.colors.blue(msg[item]));
			}		
		}
	} else {
		$.util.log($.util.colors.blue(msg));
	}
}

