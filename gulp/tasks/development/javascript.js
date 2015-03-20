var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var mainBowerFiles = require('main-bower-files');
var config = require('../../config').javascript.development;

gulp.task('javascript:development', function() {

    var bowerFiles = mainBowerFiles({ includeDev: true, filter: /.*\.js$/i });

    return gulp.src(bowerFiles.concat(config.src))
        .pipe(sourcemaps.init())
        .pipe(concat(config.output))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest))
});