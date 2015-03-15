var gulp = require('gulp');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var config = require('../../config').images.development;

gulp.task('images:development', function(){
    return gulp.src(config.src)
        .pipe(vinylPaths(del(config.dest)))
        .pipe(gulp.dest(config.dest))
});