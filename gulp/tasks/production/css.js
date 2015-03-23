var gulp = require('gulp');
var less = require('gulp-less');
var autoprefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var mainBowerFiles = require('main-bower-files');
var config = require('../../config').css.production;

gulp.task('css:production', function() {

    var lessOptions = config.options;
    var bowerFiles = mainBowerFiles({ includeDev: true, filter: /.*\.css$/i });

    return gulp.src(bowerFiles.concat(config.src))
        .pipe(less(lessOptions))
        .pipe(autoprefix('last 2 version', 'ie 9'))
        .pipe(concat(config.output))
        .pipe(cssmin())
        .pipe(gulp.dest(config.dest))
});