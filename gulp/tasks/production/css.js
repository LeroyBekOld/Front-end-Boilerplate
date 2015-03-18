var gulp = require('gulp');
var less = require('gulp-less');
var autoprefix = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var mainBowerFiles = require('main-bower-files');
var config = require('../../config').less.production;

gulp.task('css:production', function() {

    var bowerFiles = mainBowerFiles(),
        lessOptions = config.options;

    return gulp.src(bowerFiles.concat(config.src))
        .pipe(less(lessOptions))
        .pipe(autoprefix('last 2 version', 'ie 9'))
        .pipe(cssmin())
        .pipe(gulp.dest(config.dest))
});