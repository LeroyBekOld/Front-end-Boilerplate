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


var config = {
    'environment': 'development'
};

var paths = {
    'development': './test',
    'production': './dist',
    'assets': {
        'css': '/assets/css',
        'fonts': '/assets/fonts',
        'icons': '/assets/icons',
        'img': '/assets/img',
        'js': '/assets/js'
    }
};

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
        .pipe(vinylPaths(del(['test/assets/js/plugins.js'])))
        .pipe(vinylPaths(del(['test/assets/css/plugins.css'])))
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(jsFilter)
        .pipe(concat('plugins.js'))
        .pipe(gulp.dest('test/assets/js'))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe(concat('plugins.css'))
        .pipe(gulp.dest('test/assets/css'));
});

gulp.task('jquery', function() {
    var file = bowerFiles({includeSelf: true, paths: { bowerJson: 'bower_components/jquery/bower.json'}});

    gulp.src(file)
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('test/assets/js/vendor'));
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
        .pipe(gulp.dest('test/assets/js/vendor'));
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
        .pipe(gulp.dest('test/assets/css'));
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
});
// Templates (.jade)
gulp.task('templates', function() {
    gulp.src('src/templates/*.jade')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(vinylPaths(del(['test/*.html'])))
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest('test'))
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
        .pipe(vinylPaths(del(['test/assets/icons'])))
        .pipe(gulp.dest('test/assets/icons'))
        .pipe(raster())
        .pipe(rename({extname: '.png'}))
        .pipe(gulp.dest('test/assets/icons/png'))
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
        .pipe(vinylPaths(del(['test/assets/img'])))
        .pipe(gulp.dest('test/assets/img'))
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
        .pipe(vinylPaths(del(['test/assets/fonts'])))
        .pipe(gulp.dest('test/assets/fonts'))
});





// Server
gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: 'test'
        },
        port: 1337
    });
});
gulp.task('reload', function() {
    return reload({stream: true});
});


// Environment
gulp.task('environment:production', function() {
    config.environment = 'production';
});

// Clean
gulp.task('clean:test', function(cb) {
    del(['test'], cb)
});

gulp.task('default', ['clean:test'], function() {
    runSequence('bower', 'jquery', 'modernizr', 'normalize', 'less', 'js', 'images', 'icons', 'fonts', 'templates', 'browser-sync', 'watch');
});

gulp.task('build', ['clean:build', 'environment:production'], function() {

});

gulp.task('watch', function() {
    // Watch .less files
    watch('src/less/**/*.less', function() {
        runSequence('less', 'reload')
    });

    // Watch .js files
    watch('src/js/**/*.js', function() {
        runSequence('js', 'reload')
    });

    // Watch template files
    watch('src/templates/**/*.jade', function() {
        runSequence('templates', 'reload')
    });

    // Watch icons
    watch('src/icons/*.svg', function() {
        runSequence('icons', 'reload')
    });

    // Watch images
    watch('src/img/**/*.{jpg,jpeg,gif,png,svg,bmp}', function() {
        runSequence('images', 'reload')
    });

    // Watch fonts
    watch(['src/fonts/**/*', '!src/fonts/*.md'], function() {
        runSequence('fonts', 'reload')
    });

    // Watch bower components
    watch('bower_components/**/bower.json', function() {
        runSequence('bower', 'reload')
    });
});