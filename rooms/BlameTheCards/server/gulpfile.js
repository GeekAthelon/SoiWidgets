var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');

var path = require('path');

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


gulp.task('babel', function () {
    return gulp.src(srcPaths.es6)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.', { sourceRoot: srcPaths.sourceRoot }))
        .pipe(gulp.dest(srcPaths.es5));
});

gulp.task('tests', function () {
    return gulp.src(testPaths.es6)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.', { sourceRoot: testPaths.sourceRoot }))
        .pipe(gulp.dest(testPaths.es5));
});



gulp.task('watch', function() {
    gulp.watch(srcPaths.es6, ['babel']);
});
gulp.task('default', ['babel', 'tests']);
