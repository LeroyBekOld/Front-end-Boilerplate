var gulp = require('gulp');
var browserSync = require('browser-sync');
var config = require('../../config').browserSync.production;

gulp.task('browser-sync:production', function() {
    browserSync(config)
});