"use strict";

// Plugins //
var browserSync = require('browser-sync'),
    reload = browserSync.reload,
    browserify = require('browserify'),
    del = require('del'),
    gulp = require('gulp'),
    gmq = require('gulp-group-css-media-queries'),
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
        jsfiles: 'scripts/**/*.js',
        imgfiles: 'images/**/*'
    },
    dest = {
        styles: 'public/css',
        views: 'public',
        jsfiles: 'public/js',
        imgfiles: 'public/img'
    },
    // Browser Prefixes //
    browsers = {
        browsers: ['last 2 versions']
    };

// Stylus //
gulp.task('stylus', function() {
    return gulp.src(src.styles)
        .pipe($.plumber())
        .pipe($.stylus())
        .pipe($.autoprefixer(browsers))
        .pipe(reload({
            stream: true
        }))
        .pipe(gmq())
        .pipe(gulp.dest(dest.styles));
});

// .pipe($.csslint(csslintIgnore))
// .pipe($.csslint.reporter(customReporter));

// var customReporter = function(file) {
//     $.util.log($.util.colors.red(file.csslint.errorCount) + ' errors : ' + $.util.colors.magenta(file.path));
//     file.csslint.results.forEach(function(result) {
//         $.util.log('Line ' + $.util.colors.yellow(result.error.line) + ' : ' + $.util.colors.blue(result.error.message));
//     });
// };

// var csslintIgnore = {
//     'shorthand': false,
//     'universal-selector': false,
//     'fallback-colors': false,
//     'box-sizing': false,
//     'compatible-vendor-prefixes': false,
//     'unique-headings': false
// };


// Jade //
gulp.task('jade', function() {
    return gulp.src(src.views)
        .pipe($.plumber())
        .pipe($.jade())
        .pipe(reload({
            stream: true
        }))
        .pipe(gulp.dest(dest.views));
});



// Javascript //
gulp.task('js', function() {
    return gulp.src(src.jsfiles)
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish))
        .pipe($.uglify())
        .pipe(reload({
            stream: true
        }))
        .pipe(gulp.dest(dest.jsfiles));
});


gulp.task('gulphint', function() {
    return gulp.src('gulpfile.js')
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish));
});


// Images //
gulp.task('img', function() {
    return gulp.src(src.imgfiles)
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
        .pipe(reload({
            stream: true
        }))
        .pipe(gulp.dest(dest.imgfiles));
});



// Clean //
gulp.task('clean', function(cb) {
    del(['public/**/*'], cb);
});



// // Browser Sync //
// gulp.task('sync', ['stylus', 'jade'], function() {
//     browserSync({
//         server: {
//             baseDir: 'public/'
//         },
//         notify: false
//     });
// });

// Browser Sync
gulp.task('browser-sync', function() {
    browserSync.init('public/**/*', {
        server: {
            baseDir: 'public/'
        },
        notify: false
    });
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
        .pipe($.bump({type:'minor'}))
        .pipe(gulp.dest('./'));
});



// Default //
gulp.task('default', ['stylus', 'jade', 'js', 'img', 'browser-sync', 'watch']);

// Production //
// gulp.task('production', ['images', 'minifyCss', 'uglifyJs']);
