var gulp = require('gulp');
var svg2png = require('gulp-svg2png');
var config = require('../../config').icons.development;

gulp.task('icons:development', function() {
    gulp.src(config.src)
        .pipe(gulp.dest(config.dest))

    gulp.src(config.src)
        .pipe(svg2png())
        .pipe(gulp.dest(config.fallback))
});