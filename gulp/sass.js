var connect      = require('gulp-connect'),
    gulp         = require('gulp'),
    gulpif       = require('gulp-if'),
    handleErrors = require('./handleErrors'),
    exitProcess  = require('./exitProcess'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps');


/**
 * Compile css from scss files.
 * This will generate one unique output file (main.scss) according to several options :
 * - options.compress :
 *      Compress generated file's content (this will reduce the size of the file)
 * - options.sourceMaps :
 *      Generate a .map file (for debugging purpose only)
 */
var sassTask = function(exit, options) {
    return gulp.src('./demo/main.scss')
        .pipe(gulpif(options.sourceMaps, sourcemaps.init()))
        .pipe(sass({
            outputStyle: gulpif(options.compress, "compressed", "nested"),
            precision: 10
        }))
        .on('error', handleErrors)
        .on('error', exitProcess(exit))
        .pipe(gulpif(options.sourceMaps, sourcemaps.write('.')))
        .pipe(gulp.dest('./demo/build/css/'))
        .pipe(connect.reload());
};

gulp.task('sass', function () {
    sassTask(true, {
        compress: true,
        sourceMaps: false
    });
});

gulp.task('sass-dev', function () {
    sassTask(false, {
        compress: false,
        sourceMaps: true
    });
});
