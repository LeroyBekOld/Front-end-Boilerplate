var gulp = require('gulp');
var jade = require('gulp-jade');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var config = require('../../config').templates.development;

gulp.task('templates:development', function() {
    return gulp.src(config.src)
        .pipe(vinylPaths(del(config.dest + config.files)))
        .pipe(jade(config.options))
        .pipe(gulp.dest(config.dest))
});