var gulp = require('gulp');
var iconify = require('gulp-iconify');
var config = require('../../config').icons.development;

gulp.task('icons:development', function() {

    iconify({
        src: config.src
    });

    return gulp.src(config.src)
        .pipe(gulp.dest(config.dest))
});