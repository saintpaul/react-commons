var connect             = require('gulp-connect'),
    del                 = require('del'),
    gulp                = require('gulp'),
    runSequence         = require('run-sequence');

require('./gulp/lint');
require('./gulp/sass');
require('./gulp/browserify');

gulp.task('clean', function (cb) {
    del(['./build/*'], cb);
});

gulp.task('clean-test', function (cb) {
    del(['./test/app/js/*'], cb);
});

gulp.task('serve', function() {

    connect.server({
        port:8111,
        root: './build',
        livereload: {
            port: 35111
        }
    });

});

gulp.task('html', function(){
    gulp.src('./index.html')
        .pipe(gulp.dest('./build/'))
        .pipe(connect.reload());
});

gulp.task('watch', ['watchify'], function(cb) {
    gulp.watch(['./react-reflux-component/src/js/**/*.js', './react-reflux-component/src/js/**/*.jsx'], ['lint-dev']);
    gulp.watch(['./react-spinner/src/js/**/*.js', './react-spinner/src/js/**/*.jsx'], ['lint-dev']);
    gulp.watch('./index.html', ['html']);
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