var gulp = require('gulp');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var config = require('../../config').watch.development;

gulp.task('watch', function() {

    // Watch .less files
    watch(config.less, function() {
        runSequence('less:development');
    });

    // Watch .js files
    watch(config.javascript, function() {
        runSequence('javascript:development')
    });

    // Watch template files
    watch(config.templates, function() {
        runSequence('templates:development');
    });

    // Watch icons
    watch(config.icons, function() {
        runSequence('icons:development')
    });

    // Watch images
    watch(config.images, function() {
        runSequence('images:development')
    });

    // Watch fonts
    watch(config.fonts, function() {
        runSequence('fonts:development')
    });

    // Watch bower components
    watch(config.bower, function() {
        runSequence('bower:development')
    });
});