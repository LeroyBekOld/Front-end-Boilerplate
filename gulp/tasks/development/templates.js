var gulp = require('gulp');
var jade = require('gulp-jade');
var config = require('../../config').templates.development;

gulp.task('templates:development', function() {
    return gulp.src(config.src)
        .pipe(jade(config.options))
        .pipe(gulp.dest(config.dest))
});