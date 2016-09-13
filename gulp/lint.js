var gulp                = require('gulp'),
    eslint              = require('gulp-eslint'),
    friendlyFormatter   = require('eslint-friendly-formatter'),
    ESLintConfiguration = require('./ESLintConfiguration'),
    handleErrors        = require('./handleErrors'),
    exitProcess         = require('./exitProcess');

var lintTask = function(exit) {
    return gulp.src([
        './react-call-ajax/**/js/**/*.js',
        './react-reflux-component/src/js/**/*.js', './react-reflux-component/src/js/**/*.jsx',
        './react-spinner/src/js/**/*.js', './react-spinner/src/js/**/*.jsx'
    ])
        .pipe(eslint(ESLintConfiguration))
        .pipe(eslint.format(friendlyFormatter))
        .pipe(eslint.failAfterError())
        .on('error', handleErrors)
        .on('error', exitProcess(exit));
};

gulp.task('lint', function () {
    return lintTask(true);
});

gulp.task('lint-dev', function () {
    return lintTask(false);
});