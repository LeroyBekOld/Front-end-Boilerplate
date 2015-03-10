var gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    bowerFiles = require('main-bower-files'),
    del = require('del'),
    concat = require('gulp-concat'),
    filter = require('gulp-filter'),
    less = require('gulp-less'),
    autoprefix = require('gulp-autoprefixer'),
    jade = require('gulp-jade'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed'),
    raster = require('gulp-raster'),
    rename = require('gulp-rename'),
    vinylPaths = require('vinyl-paths'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

var filterByExtension = function(extension){
    return filter(function(file){
        return file.path.match(new RegExp('.' + extension + '$'));
    });
};

gulp.task('bower', function() {

    var files = bowerFiles(),
        jsFilter = filterByExtension('js'),
        cssFilter = filterByExtension('css');

    gulp.src(files)
        .pipe(vinylPaths(del(['./test/assets/js/plugins.js'])))
        .pipe(vinylPaths(del(['./test/assets/css/plugins.css'])))
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
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
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        })).pipe(gulp.dest('./test/assets/js/vendor'));
});
gulp.task('modernizr', function() {
    var file = bowerFiles({includeSelf: true, paths: { bowerJson: 'bower_components/components-modernizr/bower.json'}});

    gulp.src(file)
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('./test/assets/js/vendor'));
});
gulp.task('normalize', function() {
    var file = bowerFiles({includeSelf: true, paths: { bowerJson: 'bower_components/normalize-css/bower.json'}});

    gulp.src(file)
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
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
gulp.task('js', function() {
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
// Templates (.jade)
gulp.task('templates', function() {
    gulp.src('./src/templates/*.jade')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(vinylPaths(del(['./test/*.html'])))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('./test'))
        .pipe(reload({stream:true}));
});

// Icons
gulp.task('icons', function() {
    gulp.src('src/icons/*.svg')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(vinylPaths(del(['./test/assets/icons'])))
        .pipe(gulp.dest('./test/assets/icons'))
        .pipe(raster())
        .pipe(rename({extname: '.png'}))
        .pipe(gulp.dest('./test/assets/icons/png'))
});
// Images
gulp.task('images', function(){
    gulp.src('src/img/**/*.{jpg,jpeg,gif,png,svg,bmp}')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(vinylPaths(del(['./test/assets/img'])))
        .pipe(gulp.dest('./test/assets/img'))
});

// fonts
gulp.task('fonts', function(){
    gulp.src(['src/fonts/**/*', '!src/fonts/*.md'])
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(vinylPaths(del(['./test/assets/fonts'])))
        .pipe(gulp.dest('./test/assets/fonts'))
});





// Server
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: './test'
        },
        port: 1337
    });
});





// Clean
gulp.task('clean:test', function(cb) {
    del(['test'], cb)
});

gulp.task('default', ['clean:test'], function() {
    runSequence('bower', 'jquery', 'modernizr', 'normalize', 'less', 'js', 'images', 'icons', 'fonts', 'templates', 'browser-sync', 'watch');
});

gulp.task('build', function() {

});

gulp.task('watch', function() {
    // Watch .less files
    gulp.watch('src/less/**/*.less', ['less']);

    // Watch .js files
    gulp.watch('src/js/**/*.js', ['js']);

    // Watch template files
    gulp.watch('src/templates/**/*.jade', ['templates']);

    // Watch icons
    gulp.watch('src/icons/*.svg', ['icons']);

    // Watch images
    gulp.watch('src/img/**/*.{jpg,jpeg,gif,png,svg,bmp}', ['images']);

    // Watch fonts
    gulp.watch(['src/fonts/**/*', '!src/fonts/*.md'], ['fonts']);

    // Watch bower components
    gulp.watch('bower_components/**/*', ['bower']);
});