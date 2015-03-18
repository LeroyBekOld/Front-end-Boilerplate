var gulp = require('gulp');
var jade = require('gulp-jade');
var config = require('../../config').jade.development;

gulp.task('jade:development', function() {
    return gulp.src(config.src)
        .pipe(jade(config.options))
        .pipe(gulp.dest(config.dest))
});