var gulp = require('gulp');
var config = require('../../config').icons.development;

gulp.task('icons:development', function() {
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest))
});