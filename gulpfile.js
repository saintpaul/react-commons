var connect             = require('gulp-connect'),
    del                 = require('del'),
    gulp                = require('gulp'),
    runSequence         = require('run-sequence');

require('./gulp/lint');
require('./gulp/sass');
require('./gulp/browserify');

gulp.task('clean', function (cb) {
    del(['./demo/build/*']).then((paths) => {
        console.log('Deleted files and folders::\n', paths.join('\n'));
        cb();
    });
});

gulp.task('clean-test', function (cb) {
    del(['./test/app/js/*']).then((paths) => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
    });
});

gulp.task('serve', function() {

    connect.server({
        port:8111,
        root: './demo/build',
        livereload: {
            port: 35111
        }
    });

});

gulp.task('html', function(){
    gulp.src('./demo/index.html')
        .pipe(gulp.dest('./demo/build/'))
        .pipe(connect.reload());
});

gulp.task('watch', ['watchify'], function(cb) {
    gulp.watch([
        './react-call-ajax/**/js/**/*.js',
        './react-reflux-component/**/js/**/*.js', './react-reflux-component/**/js/**/*.jsx',
        './react-spinner/**/js/**/*.js', './react-spinner/src/js/**/*.jsx',
    ], ['lint-dev']);
    gulp.watch(['./react-spinner/**/css/**/*.scss'], ['sass-dev']);
    gulp.watch(['./react-alert-box/**/css/**/*.scss'], ['sass-dev']);
    gulp.watch('./demo/index.html', ['html']);
    cb();
});

gulp.task('default', function(cb){
    runSequence(
        'clean',
        'lint-dev',
        ['sass-dev', 'html'],
        'watch',
        'serve',
        cb
    );
});