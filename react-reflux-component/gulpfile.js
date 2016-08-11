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
    gulp.src('./src/**/*.html')
        .pipe(gulp.dest('./build/'))
        .pipe(connect.reload());
});

gulp.task('watch', ['watchify'], function(cb) {
    gulp.watch(['./src/js/**/*.js', './src/js/**/*.jsx'], ['lint-dev']);
    gulp.watch(['./src/css/**/*.scss'], ['sass-dev']);
    gulp.watch('./src/*.html', ['html']);
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