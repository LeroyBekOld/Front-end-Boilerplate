var gulp = require('gulp');
var svgo = require('gulp-svgo');
var config = require('../../config').icons.production;

gulp.task('icons:production', function() {
    return gulp.src(config.src)
        .pipe(svgo())
        .pipe(gulp.dest(config.dest))
});