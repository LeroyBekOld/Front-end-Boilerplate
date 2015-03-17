var gulp = require('gulp');
var config = require('../../config').images.development;

gulp.task('images:development', function(){
    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest))
});