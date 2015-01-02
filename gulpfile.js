// name: "Twerkit"
// description: "Twerking on it."
// author: "Shak Daniel <web.designs@me.com>"
// url: "https://github.com/shakdaniel/twerkit.git"
'use strict';


// Load plugins
var browserSync = require("browser-sync"),
    del = require("del"),
    gulp = require("gulp"),
    prefixer = require("gulp-autoprefixer"),
    bump = require("gulp-bump"),
    checkcss = require("gulp-check-unused-css"),
    concat = require("gulp-concat"),
    csslint = require("gulp-csslint"),
    imgmin = require("gulp-imagemin"),
    jade = require("gulp-jade"),
    jshint = require("gulp-jshint"),
    newer = require("gulp-newer"),
    plumber = require("gulp-plumber"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps"),
    stylus = require("gulp-stylus"),
    uncss = require("gulp-uncss"),
    pngquant = require("imagemin-pngquant"),
    stylish = require("jshint-stylish"),
    nib = require("nib");



// Paths
var paths = {
    templates: 'templates/*.jade',
    styles: 'styles/*.styl',
    scripts: 'scripts/*.js',
    images: 'images/**/*'
};



// HTML
gulp.task('html', function() {
    return gulp.src(paths.templates)
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('public/'));
});



// CSS
gulp.task('css', function() {
    return gulp.src(paths.styles)
        .pipe(plumber())
        .pipe(stylus({
            use: [nib()],
            pretty: true
        }))
        .pipe(prefixer({
            browsers: ['last 5 versions']
        }))
        .pipe(gulp.dest('public/css/'));
});

gulp.task('csslint', function() {
    return gulp.src('public/css/*.css')
        .pipe(plumber())
        .pipe(csslint())
        .pipe(csslint.reporter());
});

gulp.task('csscheck', function() {
    return gulp.src(['public/css/*.css', 'public/*.html'])
        .pipe(plumber())
        .pipe(checkcss());
});

gulp.task('uncss', function() {
    return gulp.src('public/css/*.css')
        .pipe(uncss({
            html: 'public/*.html'
        }))
        .pipe(gulp.dest('public/css/'));
});


// JS
gulp.task('js', function() {
    return gulp.src(paths.scripts)
        .pipe(plumber())
        .pipe(gulp.dest('public/js/'));
});

gulp.task('jshint', function() {
    return gulp.src('scripts/custom.js')
        .pipe(plumber())
        .pipe(gulp.dest('public/js/'))
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});



// IMG
gulp.task('img', function() {
    return gulp.src(paths.images)
        .pipe(plumber())
        .pipe(imgmin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('public/img/'));
});



// Clean
gulp.task('clean', function(cb) {
    del('public/', cb);
});



// Watch
gulp.task('watch', function() {
    gulp.watch('templates/**/*', ['html']);
    gulp.watch('styles/**/*', ['css']);
    gulp.watch('scripts/**/*', ['js']);
    gulp.watch('images/**/*', ['img']);
});



// Browser Sync
gulp.task('sync', function() {
    browserSync.init('public/**/*', {
        server: {
            baseDir: 'public/'
        },
        notify: false
    });
});



// Bump Versions
gulp.task('bump', function() {
    gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});



// Default Task
gulp.task('default', function() {
    gulp.start('html', 'css', 'uncss', 'js', 'jshint', 'img', 'watch', 'sync');
});
