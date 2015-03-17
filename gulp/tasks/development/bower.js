var gulp = require('gulp');
var concat = require('gulp-concat');
var filter = require('gulp-filter');
var bowerFiles = require('main-bower-files');
var config = require('../../config').bower.development;

var filterByExtension = function(extension){
    return filter(function(file){
        return file.path.match(new RegExp('.' + extension + '$'));
    });
};

gulp.task('bower:development', function() {

    var files = bowerFiles({ includeDev: true }),
        jsFilter = filterByExtension('js'),
        cssFilter = filterByExtension('css');

    return gulp.src(files)
        .pipe(jsFilter)
        .pipe(concat(config.jsOutput))
        .pipe(gulp.dest(config.dest + config.jsFolder))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(concat(config.cssOutput))
        .pipe(gulp.dest(config.dest + config.cssFolder))
});