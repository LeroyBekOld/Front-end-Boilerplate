var gulp = require('gulp');
var jade = require('gulp-jade');
var config = require('../../config').jade.production;

gulp.task('jade:production', function() {
    return gulp.src(config.src)
        .pipe(jade(config.options))
        .pipe(gulp.dest(config.dest))
});