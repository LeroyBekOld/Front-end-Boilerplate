var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var config = require('../../config').javascript.development;

gulp.task('javascript:development', function() {
    return gulp.src(config.src)
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest))
});