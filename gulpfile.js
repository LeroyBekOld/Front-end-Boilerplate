var gulp = require('gulp'),
    del = require('del'),
    watch = require('gulp-watch'),

    // Less specific gulp plugins
    less = require('gulp-less'),
    autoprefix = require('gulp-autoprefixer'),

    // Javascript specific gulp plugins
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),

    // Live reloading plugin
    browserSync = require('browser-sync'),
    reload = browserSync.reload;



gulp.task('less', function() {
    gulp.src('source/less/style.less')
        .pipe(less())
        .pipe(autoprefix('last 2 version', 'ie 9'))
        .pipe(gulp.dest('public/asset/css'))
        .pipe(reload({stream:true}));
});

gulp.task('javascript', function () {
    return gulp.src('source/javascript/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('public/asset/js'))
        .pipe(reload({stream:true}));
});

// Clean
gulp.task('clean', function(cb) {
    del(['public/asset/css'], cb)
});

// Default task
gulp.task('default', ['clean', 'browser-sync'], function() {
    gulp.start('less', 'javascript', 'watch');
});

// Watch
gulp.task('watch', function() {

    // Watch .less files
    gulp.watch('source/less/**/*.less', ['less']);

    // Watch .js files
    gulp.watch('source/javascript/**/*.js', ['javascript']);

});

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./public"
        }
    });
});