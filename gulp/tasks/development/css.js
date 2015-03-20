var gulp = require('gulp');
var less = require('gulp-less');
var autoprefix = require('gulp-autoprefixer');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var config = require('../../config').css.development;

gulp.task('css:development', function() {

    var lessOptions = config.options;
    var bowerFiles = mainBowerFiles({ includeDev: true, filter: /.*\.css$/i });

    return gulp.src(bowerFiles.concat(config.src))
        .pipe(less(lessOptions))
        .pipe(autoprefix('last 2 version', 'ie 9'))
        .pipe(concat(config.output))
        .pipe(gulp.dest(config.dest))
});