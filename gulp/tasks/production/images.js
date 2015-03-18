var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var config = require('../../config').images.production;

gulp.task('images:production', function(){
    return gulp.src(config.src)
        .pipe(imagemin())
        .pipe(gulp.dest(config.dest))
});