var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var mainBowerFiles = require('main-bower-files');
var config = require('../../config').javascript.production;

gulp.task('javascript:production', function() {

    var bowerFiles = mainBowerFiles();

    return gulp.src(bowerFiles.concat(config.src))
        .pipe(concat(config.output))
        .pipe(uglify())
        .pipe(gulp.dest(config.dest))
});