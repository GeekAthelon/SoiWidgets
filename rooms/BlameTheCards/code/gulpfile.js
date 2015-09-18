var gulp = require('gulp');
var path = require('path');
var args = require('yargs').argv;
var gulpConfig = require('./gulp.config')();
var del = require('del');

var $ = require('gulp-load-plugins')({lazy: true});

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

gulp.task('reformat', function () {
	return gulp.src(gulpConfig.src)
		.pipe($.if(args.verbose, $.print()))
        .pipe($.jscs({
            fix: true,
			esnext: true,
			configPath: './.jscsrc'
        })) 
        .pipe(gulp.dest("tmp" /*gulpConfig.srcDir */));
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

gulp.task('babel', ['clean-build'], function () {
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

