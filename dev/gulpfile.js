"use strict";

// Plugins //
var browserSync = require('browser-sync'),
    reload = browserSync.reload,
    browserify = require('browserify'),
    del = require('del'),
    gulp = require('gulp'),
    // gmq = require('gulp-group-css-media-queries'),
    $ = require('gulp-load-plugins')({
        rename: {
            'gulp-check-unused-css': 'cuc',
            'gulp-group-css-media-queries': 'gmq',
            'gulp-minify-css': 'cssmin'
        }
    }),
    pngquant = require('imagemin-pngquant'),
    stylish = require('jshint-stylish'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify');

// Paths //
var src = {
        images: 'images/**/*',
        scripts: 'scripts/*.js',
        styles: 'styles/*.styl',
        templates: 'templates/*.jade',
    },
    dest = {
        images: '../pub/images',
        scripts: '../pub/scripts',
        styles: '../pub/styles',
        templates: '../pub'
    };

// Browser Prefixes //
var browsers = {
    browsers: ['last 2 versions']
};

// Stylus //
gulp.task('css', function() {
    return gulp.src(src.styles)
        .pipe($.plumber())
        .pipe($.stylus())
        .pipe($.autoprefixer(browsers))
        .pipe(reload({
            stream: true
        }))
        .pipe($.gmq())
        .pipe($.cssmin())
        .pipe(gulp.dest(dest.styles));
});

gulp.task('csslint', function() {
    return gulp.src(dest.styles)
        .pipe($.plumber())
        .pipe($.csslint({
            'shorthand': false,
            'universal-selector': false,
            'fallback-colors': false,
            'box-sizing': false,
            'compatible-vendor-prefixes': false,
            'unique-headings': false
        }))
        .pipe($.csslint.reporter());
});

// Jade //
gulp.task('html', function() {
    return gulp.src(src.templates)
        .pipe($.plumber())
        .pipe($.jade())
        .pipe(reload({
            stream: true
        }))
        .pipe(gulp.dest(dest.templates));
});



// Javascript //
gulp.task('js', function() {
    return gulp.src(src.scripts)
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish))
        .pipe($.uglify())
        .pipe(reload({
            stream: true
        }))
        .pipe(gulp.dest(dest.scripts));
});


gulp.task('gulphint', function() {
    return gulp.src('gulpfile.js')
        .pipe($.plumber())
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish));
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
        .pipe(reload({
            stream: true
        }))
        .pipe(gulp.dest(dest.images));
});

// Clean //
gulp.task('clean', function(cb) {
    del(['../pub/**/*'], cb);
});

// Browser Sync
gulp.task('browser-sync', function() {
    browserSync.init('../pub/**/*', {
        server: {
            baseDir: '../pub/'
        },
        notify: false
    });
});

// Watch //
gulp.task('watch', function() {
    gulp.watch('styles/**/*', ['css']);
    gulp.watch('templates/**/*', ['html']);
    gulp.watch('scripts/**/*', ['js']);
    gulp.watch('images/**/*', ['img']);
});

// Bump Versions //
gulp.task('bump', function() {
    gulp.src('./package.json')
        .pipe($.bump({
            type: 'minor'
        }))
        .pipe(gulp.dest('./'));
});

// Default //
gulp.task('default', ['css', 'html', 'js', 'img', 'browser-sync', 'watch']);
