var gulp = require('gulp');
var less = require('gulp-less');
var autoprefix = require('gulp-autoprefixer');
var config = require('../../config').less.development;

gulp.task('less:development', function() {

    var lessOptions = config.options;

    return gulp.src(config.src)
        .pipe(less(lessOptions))
        .pipe(autoprefix('last 2 version', 'ie 9'))
        .pipe(gulp.dest(config.dest))
});