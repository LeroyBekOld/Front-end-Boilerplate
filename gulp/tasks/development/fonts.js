var gulp = require('gulp');
var config = require('../../config').fonts.development;

gulp.task('fonts:development', function(){
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest))
});