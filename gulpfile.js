var gulp = require('gulp'),
    bowerFiles = require('main-bower-files'),
    concat = require('gulp-concat'),
    filter = require('gulp-filter'),
    browserSync = require('browser-sync');

var filterByExtension = function(extension){
    return filter(function(file){
        return file.path.match(new RegExp('.' + extension + '$'));
    });
};

gulp.task('bower', function() {

    var jsFilter = filterByExtension('js'),
        cssFilter = filterByExtension('css');

    gulp.src(bowerFiles())
        .pipe(jsFilter)
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('./test/js'))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(concat('plugins.css'))
        .pipe(gulp.dest('./test/css'));
});

gulp.task('jquery', function() {
    var file = bowerFiles({includeSelf: true, paths: { bowerJson: 'bower_components/jquery/bower.json'}});

    gulp.src(file)
        .pipe(gulp.dest('./test/js/vendor'));
});
gulp.task('modernizr', function() {
    var file = bowerFiles({includeSelf: true, paths: { bowerJson: 'bower_components/components-modernizr/bower.json'}});

    gulp.src(file)
        .pipe(gulp.dest('./test/js/vendor'));
});
gulp.task('normalize', function() {
    var file = bowerFiles({includeSelf: true, paths: { bowerJson: 'bower_components/normalize-css/bower.json'}});

    gulp.src(file)
        .pipe(gulp.dest('./test/css'));
});



gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './test'
        }
    });
});







gulp.task('default', function() {
    gulp.run('bower', 'jquery', 'modernizr', 'normalize', 'browser-sync');
});

gulp.task('build', function() {

});