"use strict";

// Plugins //
var browserSync = require('browser-sync'),
    reload = browserSync.reload,
    browserify = require('browserify'),
    del = require('del'),
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    pngquant = require('imagemin-pngquant'),
    stylish = require('jshint-stylish'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify');

// Paths //
var src = {
        styles: 'stylus/*.styl',
        views: 'jade/*.jade',
        scripts: 'scripts/**/*.js',
        images: 'images/**/*'
    },
    dest = {
        styles: 'public/css',
        views: 'public',
        scripts: 'public/js',
        images: 'public/img'
    },
    // Browser Prefixes //
    browsers = {
        browsers: ['last 2 versions']
    };

// Browser Sync //
gulp.task('sync', function() {
    browserSync({
        server: {
            baseDir: 'public/'
        },
        notify: false
    });
});

// Clean //
gulp.task('clean', function(cb) {
    del(['public/**/*'], cb);
});

// Stylus //
gulp.task('stylus', function() {
    return gulp.src(src.styles)
        .pipe($.plumber())
        .pipe($.stylus())
        .pipe($.autoprefixer(browsers))
        .pipe(gulp.dest(dest.styles))
        .pipe($.csslint(csslintIgnore))
        .pipe($.csslint.reporter(customReporter))
        .pipe(reload({
            stream: true
        }));
});

var customReporter = function(file) {
    $.util.log($.util.colors.red(file.csslint.errorCount) + ' errors : ' + $.util.colors.magenta(file.path));
    file.csslint.results.forEach(function(result) {
        $.util.log('Line ' + $.util.colors.yellow(result.error.line) + ' : ' + $.util.colors.blue(result.error.message));
    });
};
var csslintIgnore = {
    'shorthand': false,
    'universal-selector': false,
    'fallback-colors': false,
    'box-sizing': false,
    'compatible-vendor-prefixes': false
};

// Jade //
gulp.task('jade', function() {
    return gulp.src(src.views)
        .pipe($.plumber())
        .pipe($.jade())
        .pipe(gulp.dest(dest.views))
        .pipe(reload({
            stream: true
        }));
});

// Javascript //
gulp.task('js', function() {
    return gulp.src(src.scripts)
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish))
        .pipe($.uglify())
        .pipe(gulp.dest(dest.scripts))
        .pipe(reload({
            stream: true
        }));
});


// Images //
gulp.task('img', function() {
    return gulp.src(src.images)
        .pipe($.plumber())
        .pipe($.imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(dest.images))
        .pipe(reload({
            stream: true
        }));
});


// Watch //
gulp.task('watch', function() {
    gulp.watch('stylus/**/*', ['stylus']);
    gulp.watch('jade/**/*', ['jade']);
    gulp.watch('scripts/**/*', ['js']);
    gulp.watch('images/**/*', ['img']);
});

// Bump Versions //
gulp.task('bump', function() {
    gulp.src('./package.json')
        .pipe($.bump())
        .pipe(gulp.dest('./'));
});

// Default //
gulp.task('default', ['stylus', 'jade', 'js', 'img', 'sync', 'watch']);

// Production //
gulp.task('production', ['images', 'minifyCss', 'uglifyJs']);
