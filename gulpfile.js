var gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    bowerFiles = require('main-bower-files'),
    del = require('del'),
    concat = require('gulp-concat'),
    filter = require('gulp-filter'),
    less = require('gulp-less'),
    autoprefix = require('gulp-autoprefixer'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

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
        .pipe(gulp.dest('./test/assets/js'))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(concat('plugins.css'))
        .pipe(gulp.dest('./test/assets/css'));
});

gulp.task('jquery', function() {
    var file = bowerFiles({includeSelf: true, paths: { bowerJson: 'bower_components/jquery/bower.json'}});

    gulp.src(file)
        .pipe(gulp.dest('./test/assets/js/vendor'));
});
gulp.task('modernizr', function() {
    var file = bowerFiles({includeSelf: true, paths: { bowerJson: 'bower_components/components-modernizr/bower.json'}});

    gulp.src(file)
        .pipe(gulp.dest('./test/assets/js/vendor'));
});
gulp.task('normalize', function() {
    var file = bowerFiles({includeSelf: true, paths: { bowerJson: 'bower_components/normalize-css/bower.json'}});

    gulp.src(file)
        .pipe(gulp.dest('./test/assets/css'));
});

// Less
gulp.task('less', function() {
    gulp.src('src/less/main.less')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(less())
        .pipe(autoprefix('last 2 version', 'ie 9'))
        .pipe(gulp.dest('test/assets/css'))
        .pipe(reload({stream:true}));
});

// Javascript
gulp.task('javascript', function() {
    gulp.src('src/js/**/*.js')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('test/assets/js'))
        .pipe(reload({stream:true}))
});

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './test'
        }
    });
});





// Clean
gulp.task('clean:test', function(cb) {
    del(['test'], cb)
});

gulp.task('default', function() {
    gulp.run('clean:test', 'bower', 'jquery', 'modernizr', 'normalize', 'less', 'javascript', 'browser-sync', 'watch');
});

gulp.task('build', function() {

});

gulp.task('watch', function() {
    // Watch .less files
    gulp.watch('src/less/**/*.less', ['less']);

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['js']);
});