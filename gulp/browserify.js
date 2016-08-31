var connect = require('gulp-connect'),
    gulp = require('gulp'),
    handleErrors = require('./handleErrors'),
    exitProcess  = require('./exitProcess'),
    browserify   = require('browserify'),
    babelify     = require('babelify'),
    watchify     = require('watchify'),
    uglify       = require('gulp-uglify'),
    gulpif       = require('gulp-if'),
    streamify    = require('gulp-streamify'),
    bundleLogger = require('./bundleLogger'),
    source       = require('vinyl-source-stream');


var runBrowserifyTask = function (options) {
    var compress = options.compress;
    var debug = options.debug;
    var fullPaths = options.fullPaths ? options.fullPaths : false;

    var bundleMethod = browserify({
        // Specify the entry point of your app
        entries: ['./demo/app.js'],
        extensions: ['.coffee', '.jsx'],
        global: true,
        debug: debug,
        cache: {}, packageCache: {}, fullPaths: fullPaths
    })
    .transform("babelify")
    .external('AppConfig');

    var bundler = options.watch ? watchify(bundleMethod) : bundleMethod;

    var bundle = function() {
        // Log when bundling starts
        bundleLogger.start();

        return bundler

            .bundle()
            // Report compile errors
            .on('error', handleErrors)
            .on('error', exitProcess(options.target !== "development"))
            // Use vinyl-source-stream to make the
            // stream gulp compatible. Specify the
            // desired output filename here.
            .pipe(source('app.js'))
            .pipe(gulpif(compress, streamify(uglify())))
            // Specify the output destination
            .pipe(gulp.dest("./demo/build"))
            // Refresh browser(s)
            //.pipe(browserSync.reload({stream:true}))
            .pipe(connect.reload())
            // Log when bundling completes!
            .on('end', bundleLogger.end);
    };

    if(options.watch) {
        // Re bundle with watchify on changes.
        bundler.on('update', bundle);
    }

    return bundle();
};

gulp.task('watchify', function() {
    return runBrowserifyTask({
        debug:true,
        compress:false,
        watch:true,
        target:'development',
        fullPaths: true
    });
});
