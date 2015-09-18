var gulp = require('gulp');
var path = require('path');
var args = require('yargs').argv;

var $ = require('gulp-load-plugins')({lazy: true});



var srcPaths = {
    es6: ['btc/**/*.js'],
    es5: 'btc-es5',
    // Must be absolute or relative to source map
    sourceRoot: path.join(__dirname, 'btc'),
};

var testPaths = {
    es6: ['test-es6/**/*.js'],
    es5: 'test',
    // Must be absolute or relative to source map
    sourceRoot: path.join(__dirname, 'test-es6'),
};

gulp.task('vet', function() {
    return gulp.src([srcPaths.es6[0], testPaths.es6[0]])
		.pipe($.if(args.verbose, $.print()))
		.pipe($.jscs())
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish', {verbose: false}))
		.pipe($.jshint.reporter('fail'));
});

gulp.task('babel', function () {

   log('Running babel');

    return gulp.src(srcPaths.es6)
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write('.', { sourceRoot: srcPaths.sourceRoot }))
        .pipe(gulp.dest(srcPaths.es5));
});

gulp.task('tests', function () {
    return gulp.src(testPaths.es6)
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write('.', { sourceRoot: testPaths.sourceRoot }))
        .pipe(gulp.dest(testPaths.es5));
});

gulp.task('watch', function() {
    gulp.watch(srcPaths.es6, ['babel']);
	gulp.watch(testPaths.es6, ['tests']);
});
gulp.task('default', ['babel', 'tests']);

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

